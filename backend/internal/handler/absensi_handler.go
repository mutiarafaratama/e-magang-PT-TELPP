package handler

import (
        "bytes"
        "fmt"
        "math"
        "net/http"
        "time"

        "github.com/gin-gonic/gin"
        "github.com/google/uuid"
        "github.com/jung-kurt/gofpdf"
        "github.com/telpp/emagang/internal/middleware"
        "github.com/telpp/emagang/internal/models"
        "github.com/telpp/emagang/internal/repository"
)

type AbsensiHandler struct {
        repo            *repository.AbsensiRepository
        pelaksanaanRepo *repository.PelaksanaanRepository
        pengajuanRepo   *repository.PengajuanRepository
        configRepo      *repository.AbsensiConfigRepository
}

func NewAbsensiHandler(
        repo *repository.AbsensiRepository,
        pelaksanaanRepo *repository.PelaksanaanRepository,
        pengajuanRepo *repository.PengajuanRepository,
        configRepo *repository.AbsensiConfigRepository,
) *AbsensiHandler {
        return &AbsensiHandler{repo: repo, pelaksanaanRepo: pelaksanaanRepo, pengajuanRepo: pengajuanRepo, configRepo: configRepo}
}

// haversineM menghitung jarak antara dua koordinat GPS dalam meter (rumus Haversine)
func haversineM(lat1, lng1, lat2, lng2 float64) float64 {
        const R = 6371000.0
        dLat := (lat2 - lat1) * math.Pi / 180
        dLng := (lng2 - lng1) * math.Pi / 180
        a := math.Sin(dLat/2)*math.Sin(dLat/2) +
                math.Cos(lat1*math.Pi/180)*math.Cos(lat2*math.Pi/180)*
                        math.Sin(dLng/2)*math.Sin(dLng/2)
        return R * 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
}

// wibNow returns current time in WIB (Asia/Jakarta, UTC+7)
func wibNow() time.Time {
        wib, _ := time.LoadLocation("Asia/Jakarta")
        return time.Now().In(wib)
}

// parseWindowTime parses "HH:MM" string into time.Time on the same day as base
func parseWindowTime(hhMM string, base time.Time) time.Time {
        t, err := time.ParseInLocation("2006-01-02 15:04", base.Format("2006-01-02")+" "+hhMM, base.Location())
        if err != nil {
                return base
        }
        return t
}

// POST /api/absensi/checkin
func (h *AbsensiHandler) CheckIn(c *gin.Context) {
        var req models.AbsensiCheckInRequest
        if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "validation_error", Message: "Data tidak valid"})
                return
        }
        if req.Latitude == 0 && req.Longitude == 0 {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "location_required", Message: "Data lokasi GPS diperlukan untuk absensi"})
                return
        }

        userID := middleware.GetUserID(c)
        now := wibNow()

        cfg, err := h.configRepo.Get(c.Request.Context())
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: "Gagal memuat konfigurasi jam absensi"})
                return
        }

        // Validasi window waktu
        buka := parseWindowTime(cfg.JamMasukBuka, now)
        tutup := parseWindowTime(cfg.JamMasukTutup, now)
        if now.Before(buka) || now.After(tutup) {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{
                        Error:   "outside_window",
                        Message: fmt.Sprintf("Absen masuk hanya bisa dilakukan antara %s - %s WIB", cfg.JamMasukBuka, cfg.JamMasukTutup),
                })
                return
        }

        // Validasi geofence
        jarakM := haversineM(req.Latitude, req.Longitude, cfg.KantorLat, cfg.KantorLng)
        if jarakM > float64(cfg.RadiusMeter) {
                c.JSON(http.StatusForbidden, models.ErrorResponse{
                        Error:   "outside_geofence",
                        Message: fmt.Sprintf("Lokasi Anda berada %.0f meter di luar area kantor yang diizinkan", jarakM-float64(cfg.RadiusMeter)),
                })
                return
        }

        pelaksanaan, err := h.pelaksanaanRepo.FindByUserID(c.Request.Context(), userID)
        if err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "not_found", Message: "Data pelaksanaan magang tidak ditemukan"})
                return
        }
        if pelaksanaan.Status != models.StatusAktif {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "invalid_status", Message: "Magang belum aktif"})
                return
        }

        tanggal := now.Format("2006-01-02")
        jamMasuk := now.Format("15:04")
        keterangan := "hadir"

        a := &models.Absensi{
                PelaksanaanID: pelaksanaan.ID,
                Tanggal:       parseTimeOnly(tanggal),
                JamMasuk:      &jamMasuk,
                Keterangan:    keterangan,
                Latitude:      &req.Latitude,
                Longitude:     &req.Longitude,
        }

        if err := h.repo.CheckIn(c.Request.Context(), a); err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "checkin_failed", Message: "Sudah check-in hari ini atau terjadi kesalahan"})
                return
        }

        c.JSON(http.StatusCreated, models.SuccessResponse{
                Message: "Absen masuk berhasil",
                Data:    a,
        })
}

// PATCH /api/absensi/checkout
func (h *AbsensiHandler) CheckOut(c *gin.Context) {
        var req models.AbsensiCheckOutRequest
        if err := c.ShouldBindJSON(&req); err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "validation_error", Message: err.Error()})
                return
        }

        userID := middleware.GetUserID(c)
        now := wibNow()

        cfg, err := h.configRepo.Get(c.Request.Context())
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: "Gagal memuat konfigurasi jam absensi"})
                return
        }

        buka := parseWindowTime(cfg.JamPulangBuka, now)
        tutup := parseWindowTime(cfg.JamPulangTutup, now)
        if now.Before(buka) || now.After(tutup) {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{
                        Error:   "outside_window",
                        Message: fmt.Sprintf("Absen pulang hanya bisa dilakukan antara %s - %s WIB", cfg.JamPulangBuka, cfg.JamPulangTutup),
                })
                return
        }

        pelaksanaan, err := h.pelaksanaanRepo.FindByUserID(c.Request.Context(), userID)
        if err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "not_found", Message: "Data pelaksanaan tidak ditemukan"})
                return
        }

        today := now.Format("2006-01-02")
        jamKeluar := now.Format("15:04")

        if err := h.repo.CheckOut(c.Request.Context(), pelaksanaan.ID, today, jamKeluar, req.Kegiatan); err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "checkout_failed", Message: "Belum check-in hari ini atau sudah check-out"})
                return
        }

        c.JSON(http.StatusOK, models.SuccessResponse{Message: "Absen pulang berhasil"})
}

// GET /api/absensi/saya — rekap absensi peserta
func (h *AbsensiHandler) GetMy(c *gin.Context) {
        userID := middleware.GetUserID(c)
        pelaksanaan, err := h.pelaksanaanRepo.FindByUserID(c.Request.Context(), userID)
        if err != nil {
                c.JSON(http.StatusOK, models.SuccessResponse{Data: map[string]interface{}{"list": []interface{}{}, "rekap": map[string]int{}}})
                return
        }

        list, err := h.repo.FindByPelaksanaanID(c.Request.Context(), pelaksanaan.ID)
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: err.Error()})
                return
        }

        hadir, izin, sakit, alpha := h.repo.CountByPelaksanaan(c.Request.Context(), pelaksanaan.ID)

        c.JSON(http.StatusOK, models.SuccessResponse{
                Data: map[string]interface{}{
                        "list":  list,
                        "rekap": map[string]int{"hadir": hadir, "izin": izin, "sakit": sakit, "alpha": alpha},
                },
        })
}

// GET /api/absensi/pelaksanaan/:id — HRD lihat absensi peserta tertentu
func (h *AbsensiHandler) GetByPelaksanaan(c *gin.Context) {
        id, err := uuid.Parse(c.Param("id"))
        if err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "invalid_id", Message: "ID tidak valid"})
                return
        }

        list, err := h.repo.FindByPelaksanaanID(c.Request.Context(), id)
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: err.Error()})
                return
        }

        hadir, izin, sakit, alpha := h.repo.CountByPelaksanaan(c.Request.Context(), id)
        c.JSON(http.StatusOK, models.SuccessResponse{
                Data: map[string]interface{}{
                        "list":  list,
                        "rekap": map[string]int{"hadir": hadir, "izin": izin, "sakit": sakit, "alpha": alpha},
                },
        })
}

// GET /api/absensi/rekap — HRD melihat ringkasan absensi semua peserta
func (h *AbsensiHandler) GetRekapHRD(c *gin.Context) {
        list, err := h.repo.GetRekapAll(c.Request.Context())
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: err.Error()})
                return
        }
        c.JSON(http.StatusOK, models.SuccessResponse{Data: list})
}

// GET /api/absensi/pelaksanaan/:id/pdf — HRD download PDF rekap absensi peserta tertentu
func (h *AbsensiHandler) GetByPelaksanaanPDF(c *gin.Context) {
        id, err := uuid.Parse(c.Param("id"))
        if err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "invalid_id", Message: "ID tidak valid"})
                return
        }

        pelaksanaan, err := h.pelaksanaanRepo.FindByID(c.Request.Context(), id)
        if err != nil {
                c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "not_found", Message: "Data pelaksanaan tidak ditemukan"})
                return
        }

        pengajuan, err := h.pengajuanRepo.FindByID(c.Request.Context(), pelaksanaan.PengajuanID)
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: err.Error()})
                return
        }

        list, _ := h.repo.FindByPelaksanaanID(c.Request.Context(), id)
        hadir, izin, sakit, alpha := h.repo.CountByPelaksanaan(c.Request.Context(), id)

        pdf := generateAbsensiPDF(pengajuan, pelaksanaan, list, hadir, izin, sakit, alpha)

        var buf bytes.Buffer
        pdf.Output(&buf)

        c.Header("Content-Type", "application/pdf")
        c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="Absensi_%s.pdf"`, pengajuan.NamaLengkap))
        c.Data(http.StatusOK, "application/pdf", buf.Bytes())
}

// PATCH /api/absensi/:id/approve — HRD setujui absensi
func (h *AbsensiHandler) Approve(c *gin.Context) {
        id, err := uuid.Parse(c.Param("id"))
        if err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "invalid_id", Message: "ID tidak valid"})
                return
        }

        approvedBy := middleware.GetUserID(c)
        if err := h.repo.Approve(c.Request.Context(), id, approvedBy); err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: err.Error()})
                return
        }

        c.JSON(http.StatusOK, models.SuccessResponse{Message: "Absensi berhasil disetujui"})
}

// GET /api/absensi/saya/pdf — download rekap PDF absensi
func (h *AbsensiHandler) DownloadPDF(c *gin.Context) {
        userID := middleware.GetUserID(c)
        pelaksanaan, err := h.pelaksanaanRepo.FindByUserID(c.Request.Context(), userID)
        if err != nil {
                c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "not_found", Message: "Data pelaksanaan tidak ditemukan"})
                return
        }

        pengajuan, err := h.pengajuanRepo.FindByID(c.Request.Context(), pelaksanaan.PengajuanID)
        if err != nil {
                c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "server_error", Message: err.Error()})
                return
        }

        list, _ := h.repo.FindByPelaksanaanID(c.Request.Context(), pelaksanaan.ID)
        hadir, izin, sakit, alpha := h.repo.CountByPelaksanaan(c.Request.Context(), pelaksanaan.ID)

        pdf := generateAbsensiPDF(pengajuan, pelaksanaan, list, hadir, izin, sakit, alpha)

        var buf bytes.Buffer
        pdf.Output(&buf)

        c.Header("Content-Type", "application/pdf")
        c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="Absensi_%s.pdf"`, pengajuan.NamaLengkap))
        c.Data(http.StatusOK, "application/pdf", buf.Bytes())
}

func generateAbsensiPDF(pengajuan *models.PengajuanMagang, pel *models.PelaksanaanMagang, list []models.Absensi, hadir, izin, sakit, alpha int) *gofpdf.Fpdf {
        pdf := gofpdf.New("P", "mm", "A4", "")
        pdf.AddPage()

        pdf.SetFillColor(0, 128, 0)
        pdf.Rect(0, 0, 210, 25, "F")
        pdf.SetTextColor(255, 255, 255)
        pdf.SetFont("Helvetica", "B", 14)
        pdf.SetXY(10, 5)
        pdf.CellFormat(190, 8, "PT TANJUNGENIM LESTARI PULP AND PAPER", "", 0, "C", false, 0, "")
        pdf.SetFont("Helvetica", "", 10)
        pdf.SetXY(10, 14)
        pdf.CellFormat(190, 8, "REKAP ABSENSI MAGANG", "", 0, "C", false, 0, "")

        pdf.SetTextColor(0, 0, 0)
        pdf.SetFont("Helvetica", "B", 11)
        pdf.SetXY(10, 32)
        pdf.CellFormat(190, 7, "DATA PESERTA", "", 0, "L", false, 0, "")

        pdf.SetFont("Helvetica", "", 10)
        info := [][]string{
                {"Nama", pengajuan.NamaLengkap},
                {"Asal Institusi", pengajuan.AsalInstitusi},
                {"Jurusan", pengajuan.Jurusan},
                {"Periode", fmt.Sprintf("%s s/d %s", pel.TanggalMulai.Format("02/01/2006"), pel.TanggalSelesai.Format("02/01/2006"))},
        }
        if pel.Divisi != nil {
                info = append(info, []string{"Divisi", *pel.Divisi})
        }

        yPos := 40.0
        for _, row := range info {
                pdf.SetXY(10, yPos)
                pdf.SetFont("Helvetica", "B", 10)
                pdf.CellFormat(40, 6, row[0], "", 0, "L", false, 0, "")
                pdf.SetFont("Helvetica", "", 10)
                pdf.CellFormat(5, 6, ":", "", 0, "C", false, 0, "")
                pdf.CellFormat(145, 6, row[1], "", 0, "L", false, 0, "")
                yPos += 7
        }

        yPos += 5
        pdf.SetFillColor(240, 255, 240)
        pdf.SetDrawColor(0, 128, 0)
        pdf.Rect(10, yPos, 190, 10, "FD")
        pdf.SetFont("Helvetica", "B", 10)
        pdf.SetXY(10, yPos+2)
        pdf.CellFormat(47, 6, fmt.Sprintf("Hadir: %d", hadir), "", 0, "C", false, 0, "")
        pdf.CellFormat(47, 6, fmt.Sprintf("Izin: %d", izin), "", 0, "C", false, 0, "")
        pdf.CellFormat(47, 6, fmt.Sprintf("Sakit: %d", sakit), "", 0, "C", false, 0, "")
        pdf.CellFormat(47, 6, fmt.Sprintf("Alpha: %d", alpha), "", 0, "C", false, 0, "")
        yPos += 15

        pdf.SetFillColor(0, 100, 0)
        pdf.SetTextColor(255, 255, 255)
        pdf.SetFont("Helvetica", "B", 9)
        pdf.SetXY(10, yPos)
        headers := []string{"No", "Tanggal", "Masuk", "Keluar", "Ket", "Kegiatan", "TTD"}
        widths := []float64{10, 28, 18, 18, 15, 75, 18}
        for i, h := range headers {
                pdf.CellFormat(widths[i], 7, h, "1", 0, "C", true, 0, "")
        }
        yPos += 7

        pdf.SetTextColor(0, 0, 0)
        pdf.SetFont("Helvetica", "", 8)
        for i, a := range list {
                pdf.SetFillColor(255, 255, 255)
                if i%2 == 0 {
                        pdf.SetFillColor(245, 255, 245)
                }
                pdf.SetXY(10, yPos)
                masuk := "-"
                if a.JamMasuk != nil {
                        masuk = *a.JamMasuk
                }
                keluar := "-"
                if a.JamKeluar != nil {
                        keluar = *a.JamKeluar
                }
                kegiatan := "-"
                if a.Kegiatan != nil {
                        kegiatan = *a.Kegiatan
                }
                ttd := "Belum"
                if a.TTDPembimbing {
                        ttd = "V"
                }
                row := []string{
                        fmt.Sprintf("%d", i+1),
                        a.Tanggal.Format("02/01/2006"),
                        masuk, keluar, a.Keterangan, kegiatan, ttd,
                }
                for j, val := range row {
                        pdf.CellFormat(widths[j], 6, val, "1", 0, "C", true, 0, "")
                }
                yPos += 6
                if yPos > 270 {
                        pdf.AddPage()
                        yPos = 20
                }
        }

        yPos += 15
        pdf.SetFont("Helvetica", "", 10)
        pdf.SetXY(120, yPos)
        pdf.CellFormat(80, 6, "Mengetahui,", "", 0, "C", false, 0, "")
        pdf.SetXY(120, yPos+6)
        pdf.CellFormat(80, 6, "Pembimbing Magang", "", 0, "C", false, 0, "")
        pdf.SetXY(120, yPos+30)
        pdf.SetDrawColor(0, 0, 0)
        pdf.Line(125, yPos+30, 195, yPos+30)
        pdf.SetXY(120, yPos+32)
        pdf.CellFormat(80, 6, "PT TanjungEnim Lestari", "", 0, "C", false, 0, "")

        return pdf
}

func parseTimeOnly(s string) time.Time {
        t, _ := time.Parse("2006-01-02", s)
        return t
}
