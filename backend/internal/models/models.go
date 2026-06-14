package models

import (
        "time"

        "github.com/google/uuid"
)

// ============================================================
// ENUMS (sebagai konstanta string)
// ============================================================

type UserRole string

const (
        RoleAdmin   UserRole = "admin"
        RoleHRD     UserRole = "hrd"
        RolePeserta UserRole = "peserta"
)

type KategoriMagang string

const (
        KategoriSMK        KategoriMagang = "smk"
        KategoriD3S1S2     KategoriMagang = "d3_s1_s2"
        KategoriPenelitian KategoriMagang = "penelitian"
)

type JenisKelamin string

const (
        JenisLakiLaki  JenisKelamin = "laki_laki"
        JenisPerempuan JenisKelamin = "perempuan"
)

type StatusPengajuan string

const (
        StatusDiajukan           StatusPengajuan = "diajukan"
        StatusMenungguVerifikasi StatusPengajuan = "menunggu_verifikasi"
        StatusDiproses           StatusPengajuan = "diproses"
        StatusDiterima           StatusPengajuan = "diterima"
        StatusDitolak            StatusPengajuan = "ditolak"
)

type JenisDokumen string

const (
        DokumenProposal        JenisDokumen = "proposal_magang"
        DokumenSuratPengantar  JenisDokumen = "surat_pengantar"
        DokumenKTP             JenisDokumen = "ktp"
        DokumenKTM        JenisDokumen = "ktm"
        DokumenPasfoto    JenisDokumen = "pasfoto"
        DokumenBPJS       JenisDokumen = "bpjs_kis"
        DokumenSuratBalas JenisDokumen = "surat_balasan"
        DokumenLaporan    JenisDokumen = "laporan_magang"
        DokumenSertifikat JenisDokumen = "sertifikat"
)

type StatusPelaksanaan string

const (
        StatusMenungguMulai StatusPelaksanaan = "menunggu_mulai"
        StatusAktif         StatusPelaksanaan = "aktif"
        StatusUploadLaporan StatusPelaksanaan = "upload_laporan"
        StatusPenilaian     StatusPelaksanaan = "penilaian"
        StatusSelesai       StatusPelaksanaan = "selesai"
)

type StatusTiket string

const (
        TiketMenunggu StatusTiket = "menunggu"
        TiketDiproses StatusTiket = "diproses"
        TiketSelesai  StatusTiket = "selesai"
)

// ============================================================
// USER
// ============================================================

type User struct {
        ID           uuid.UUID `json:"id" db:"id"`
        NamaLengkap  string    `json:"nama_lengkap" db:"nama_lengkap"`
        Email        string    `json:"email" db:"email"`
        PasswordHash string    `json:"-" db:"password_hash"`
        Role         UserRole  `json:"role" db:"role"`
        IsActive     bool      `json:"is_active" db:"is_active"`
        CreatedAt    time.Time `json:"created_at" db:"created_at"`
        UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type UserPublic struct {
        ID          uuid.UUID `json:"id"`
        NamaLengkap string    `json:"nama_lengkap"`
        Email       string    `json:"email"`
        Role        UserRole  `json:"role"`
        IsActive    bool      `json:"is_active"`
        CreatedAt   time.Time `json:"created_at"`
}

type RefreshToken struct {
        ID        uuid.UUID `json:"id" db:"id"`
        UserID    uuid.UUID `json:"user_id" db:"user_id"`
        TokenHash string    `json:"-" db:"token_hash"`
        ExpiresAt time.Time `json:"expires_at" db:"expires_at"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
}

// ============================================================
// PERIODE MAGANG
// ============================================================

type PeriodeMagang struct {
        ID           uuid.UUID `json:"id" db:"id"`
        Nama         string    `json:"nama" db:"nama"`
        TanggalBuka  time.Time `json:"tanggal_buka" db:"tanggal_buka"`
        TanggalTutup time.Time `json:"tanggal_tutup" db:"tanggal_tutup"`
        Kuota        *int      `json:"kuota" db:"kuota"`
        IsActive     bool      `json:"is_active" db:"is_active"`
        CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// ============================================================
// PENGAJUAN MAGANG
// ============================================================

type PengajuanMagang struct {
        ID             uuid.UUID       `json:"id" db:"id"`
        UserID         uuid.UUID       `json:"user_id" db:"user_id"`
        NamaLengkap    string          `json:"nama_lengkap" db:"nama_lengkap"`
        TempatLahir    string          `json:"tempat_lahir" db:"tempat_lahir"`
        TanggalLahir   time.Time       `json:"tanggal_lahir" db:"tanggal_lahir"`
        JenisKelamin   JenisKelamin    `json:"jenis_kelamin" db:"jenis_kelamin"`
        Alamat         string          `json:"alamat" db:"alamat"`
        NoHP           string          `json:"no_hp" db:"no_hp"`
        Email          string          `json:"email" db:"email"`
        KategoriMagang KategoriMagang  `json:"kategori_magang" db:"kategori_magang"`
        NomorInduk     string          `json:"nomor_induk" db:"nomor_induk"`
        AsalInstitusi  string          `json:"asal_institusi" db:"asal_institusi"`
        Jurusan        string          `json:"jurusan" db:"jurusan"`
        KelasSemester  string          `json:"kelas_semester" db:"kelas_semester"`
        Status         StatusPengajuan `json:"status" db:"status"`
        CatatanHRD     *string         `json:"catatan_hrd" db:"catatan_hrd"`
        VerifiedBy     *uuid.UUID      `json:"verified_by" db:"verified_by"`
        VerifiedAt     *time.Time      `json:"verified_at" db:"verified_at"`
        AkunTerkirimAt *time.Time      `json:"akun_terkirim_at" db:"akun_terkirim_at"`
        CreatedAt      time.Time       `json:"created_at" db:"created_at"`
        UpdatedAt      time.Time       `json:"updated_at" db:"updated_at"`
}

type StatusHistory struct {
        ID          uuid.UUID        `json:"id" db:"id"`
        PengajuanID uuid.UUID        `json:"pengajuan_id" db:"pengajuan_id"`
        StatusLama  *StatusPengajuan `json:"status_lama" db:"status_lama"`
        StatusBaru  StatusPengajuan  `json:"status_baru" db:"status_baru"`
        ChangedBy   *uuid.UUID       `json:"changed_by" db:"changed_by"`
        Catatan     *string          `json:"catatan" db:"catatan"`
        CreatedAt   time.Time        `json:"created_at" db:"created_at"`
}

// ============================================================
// DOKUMEN
// ============================================================

type Dokumen struct {
        ID          uuid.UUID    `json:"id" db:"id"`
        PengajuanID *uuid.UUID   `json:"pengajuan_id" db:"pengajuan_id"`
        UserID      *uuid.UUID   `json:"user_id" db:"user_id"`
        Jenis       JenisDokumen `json:"jenis" db:"jenis"`
        NamaFile    string       `json:"nama_file" db:"nama_file"`
        PathFile    string       `json:"path_file" db:"path_file"`
        UkuranBytes *int64       `json:"ukuran_bytes" db:"ukuran_bytes"`
        MimeType    *string      `json:"mime_type" db:"mime_type"`
        UploadedAt  time.Time    `json:"uploaded_at" db:"uploaded_at"`
}

// ============================================================
// PELAKSANAAN MAGANG
// ============================================================

type PelaksanaanMagang struct {
        ID                    uuid.UUID         `json:"id" db:"id"`
        PengajuanID           uuid.UUID         `json:"pengajuan_id" db:"pengajuan_id"`
        UserID                uuid.UUID         `json:"user_id" db:"user_id"`
        PeriodeID             *uuid.UUID        `json:"periode_id" db:"periode_id"`
        TanggalMulai          time.Time         `json:"tanggal_mulai" db:"tanggal_mulai"`
        TanggalSelesai        time.Time         `json:"tanggal_selesai" db:"tanggal_selesai"`
        Divisi                *string           `json:"divisi" db:"divisi"`
        PembimbingID          *uuid.UUID        `json:"pembimbing_id" db:"pembimbing_id"`
        Status                StatusPelaksanaan `json:"status" db:"status"`
        Nilai                 *float64          `json:"nilai" db:"nilai"`
        CatatanNilai          *string           `json:"catatan_nilai" db:"catatan_nilai"`
        DinilaiOleh           *uuid.UUID        `json:"dinilai_oleh" db:"dinilai_oleh"`
        DinilaiAt             *time.Time        `json:"dinilai_at" db:"dinilai_at"`
        SertifikatGenerated   bool              `json:"sertifikat_generated" db:"sertifikat_generated"`
        SertifikatPath        *string           `json:"sertifikat_path" db:"sertifikat_path"`
        SertifikatGeneratedAt *time.Time        `json:"sertifikat_generated_at" db:"sertifikat_generated_at"`
        CreatedAt             time.Time         `json:"created_at" db:"created_at"`
        UpdatedAt             time.Time         `json:"updated_at" db:"updated_at"`
}

// ============================================================
// ABSENSI
// ============================================================

type Absensi struct {
        ID            uuid.UUID  `json:"id" db:"id"`
        PelaksanaanID uuid.UUID  `json:"pelaksanaan_id" db:"pelaksanaan_id"`
        Tanggal       time.Time  `json:"tanggal" db:"tanggal"`
        JamMasuk      *string    `json:"jam_masuk" db:"jam_masuk"`
        JamKeluar     *string    `json:"jam_keluar" db:"jam_keluar"`
        Keterangan    string     `json:"keterangan" db:"keterangan"`
        Kegiatan      *string    `json:"kegiatan" db:"kegiatan"`
        TTDPembimbing bool       `json:"ttd_pembimbing" db:"ttd_pembimbing"`
        ApprovedBy    *uuid.UUID `json:"approved_by" db:"approved_by"`
        ApprovedAt    *time.Time `json:"approved_at" db:"approved_at"`
        Catatan       *string    `json:"catatan" db:"catatan"`
        Latitude      *float64   `json:"latitude" db:"latitude"`
        Longitude     *float64   `json:"longitude" db:"longitude"`
        CreatedAt     time.Time  `json:"created_at" db:"created_at"`
}

type AbsensiConfig struct {
        ID             int        `json:"id" db:"id"`
        JamMasukBuka   string     `json:"jam_masuk_buka" db:"jam_masuk_buka"`
        JamMasukTutup  string     `json:"jam_masuk_tutup" db:"jam_masuk_tutup"`
        JamPulangBuka  string     `json:"jam_pulang_buka" db:"jam_pulang_buka"`
        JamPulangTutup string     `json:"jam_pulang_tutup" db:"jam_pulang_tutup"`
        KantorLat      float64    `json:"kantor_lat" db:"kantor_lat"`
        KantorLng      float64    `json:"kantor_lng" db:"kantor_lng"`
        RadiusMeter    int        `json:"radius_meter" db:"radius_meter"`
        UpdatedAt      time.Time  `json:"updated_at" db:"updated_at"`
        UpdatedBy      *uuid.UUID `json:"updated_by" db:"updated_by"`
}

// ============================================================
// CHAT
// ============================================================

type ChatTiket struct {
        ID         uuid.UUID   `json:"id" db:"id"`
        UserID     uuid.UUID   `json:"user_id" db:"user_id"`
        NomorTiket string      `json:"nomor_tiket" db:"nomor_tiket"`
        Subjek     *string     `json:"subjek" db:"subjek"`
        Status     StatusTiket `json:"status" db:"status"`
        AssignedTo *uuid.UUID  `json:"assigned_to" db:"assigned_to"`
        CreatedAt  time.Time   `json:"created_at" db:"created_at"`
        UpdatedAt  time.Time   `json:"updated_at" db:"updated_at"`
}

type ChatTiketDetail struct {
        ChatTiket
        UserNama     string  `json:"user_nama"`
        UserEmail    string  `json:"user_email"`
        AssignedNama *string `json:"assigned_nama"`
        UnreadCount  int     `json:"unread_count"`
        LastMessage  *string `json:"last_message"`
}

type ChatPesan struct {
        ID        uuid.UUID `json:"id" db:"id"`
        TiketID   uuid.UUID `json:"tiket_id" db:"tiket_id"`
        SenderID  uuid.UUID `json:"sender_id" db:"sender_id"`
        Pesan     string    `json:"pesan" db:"pesan"`
        IsRead    bool      `json:"is_read" db:"is_read"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type ChatPesanDetail struct {
        ChatPesan
        SenderNama string   `json:"sender_nama"`
        SenderRole UserRole `json:"sender_role"`
}

type ChatKnowledge struct {
        ID         uuid.UUID `json:"id" db:"id"`
        Pertanyaan string    `json:"pertanyaan" db:"pertanyaan"`
        Jawaban    string    `json:"jawaban" db:"jawaban"`
        Urutan     int       `json:"urutan" db:"urutan"`
        IsActive   bool      `json:"is_active" db:"is_active"`
        CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// ============================================================
// NOTIFIKASI
// ============================================================

type Notifikasi struct {
        ID          uuid.UUID  `json:"id" db:"id"`
        UserID      uuid.UUID  `json:"user_id" db:"user_id"`
        Judul       string     `json:"judul" db:"judul"`
        Pesan       string     `json:"pesan" db:"pesan"`
        Tipe        *string    `json:"tipe" db:"tipe"`
        ReferensiID *uuid.UUID `json:"referensi_id" db:"referensi_id"`
        IsRead      bool       `json:"is_read" db:"is_read"`
        CreatedAt   time.Time  `json:"created_at" db:"created_at"`
}

// ============================================================
// LANDING PAGE
// ============================================================

type LandingContent struct {
        ID        uuid.UUID  `json:"id" db:"id"`
        Kunci     string     `json:"kunci" db:"kunci"`
        Nilai     *string    `json:"nilai" db:"nilai"`
        Tipe      string     `json:"tipe" db:"tipe"`
        UpdatedBy *uuid.UUID `json:"updated_by" db:"updated_by"`
        UpdatedAt time.Time  `json:"updated_at" db:"updated_at"`
}

type FAQ struct {
        ID         uuid.UUID `json:"id" db:"id"`
        Pertanyaan string    `json:"pertanyaan" db:"pertanyaan"`
        Jawaban    string    `json:"jawaban" db:"jawaban"`
        Urutan     int       `json:"urutan" db:"urutan"`
        IsActive   bool      `json:"is_active" db:"is_active"`
        CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// ============================================================
// REQUEST / RESPONSE STRUCTS
// ============================================================

type RegisterRequest struct {
        NamaLengkap string `json:"nama_lengkap" binding:"required,min=3"`
        Email       string `json:"email" binding:"required,email"`
        Password    string `json:"password" binding:"required,min=8"`
}

type LoginRequest struct {
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
        AccessToken  string     `json:"access_token"`
        RefreshToken string     `json:"refresh_token"`
        User         UserPublic `json:"user"`
}

type PengajuanStep1Request struct {
        NamaLengkap  string       `json:"nama_lengkap" binding:"required"`
        TempatLahir  string       `json:"tempat_lahir" binding:"required"`
        TanggalLahir string       `json:"tanggal_lahir" binding:"required"`
        JenisKelamin JenisKelamin `json:"jenis_kelamin" binding:"required"`
        Alamat       string       `json:"alamat" binding:"required"`
        NoHP         string       `json:"no_hp" binding:"required"`
        Email        string       `json:"email" binding:"required,email"`
}

type PengajuanStep2Request struct {
        KategoriMagang KategoriMagang `json:"kategori_magang" binding:"required"`
        NomorInduk     string         `json:"nomor_induk" binding:"required"`
        AsalInstitusi  string         `json:"asal_institusi" binding:"required"`
        Jurusan        string         `json:"jurusan" binding:"required"`
        KelasSemester  string         `json:"kelas_semester" binding:"required"`
}

// PengajuanPublikRequest — form publik tanpa login
type PengajuanPublikRequest struct {
        Step1 PengajuanStep1Request `json:"step1" binding:"required"`
        Step2 PengajuanStep2Request `json:"step2" binding:"required"`
}

type UpdateStatusRequest struct {
        Status  StatusPengajuan `json:"status" binding:"required"`
        Catatan string          `json:"catatan"`
}

type SetJadwalRequest struct {
        TanggalMulai   string `json:"tanggal_mulai" binding:"required"`
        TanggalSelesai string `json:"tanggal_selesai" binding:"required"`
        Divisi         string `json:"divisi" binding:"required"`
        PembimbingID   string `json:"pembimbing_id"`
}

type AbsensiCheckInRequest struct {
        Latitude  float64 `json:"latitude"`
        Longitude float64 `json:"longitude"`
}

type AbsensiCheckOutRequest struct {
        Kegiatan string `json:"kegiatan" binding:"required"`
}

type NilaiRequest struct {
        Nilai        float64 `json:"nilai" binding:"required,min=0,max=100"`
        CatatanNilai string  `json:"catatan_nilai"`
}

type ChatBuatTiketRequest struct {
        Subjek string `json:"subjek" binding:"required"`
        Pesan  string `json:"pesan" binding:"required"`
}

type ChatKirimPesanRequest struct {
        Pesan string `json:"pesan" binding:"required"`
}

type ErrorResponse struct {
        Error   string `json:"error"`
        Message string `json:"message"`
}

type SuccessResponse struct {
        Message string      `json:"message"`
        Data    interface{} `json:"data,omitempty"`
}

type PaginatedResponse struct {
        Data       interface{} `json:"data"`
        Total      int         `json:"total"`
        Page       int         `json:"page"`
        Limit      int         `json:"limit"`
        TotalPages int         `json:"total_pages"`
}

type DashboardAdminStats struct {
        TotalPeserta      int `json:"total_peserta"`
        TotalPengajuan    int `json:"total_pengajuan"`
        PengajuanMenunggu int `json:"pengajuan_menunggu"`
        PengajuanDiterima int `json:"pengajuan_diterima"`
        PengajuanDitolak  int `json:"pengajuan_ditolak"`
        MagangAktif       int `json:"magang_aktif"`
        MagangSelesai     int `json:"magang_selesai"`
        TiketChatMenunggu int `json:"tiket_chat_menunggu"`
}

type NotifBadgeCount struct {
        TotalUnread  int `json:"total_unread"`
        ChatMenunggu int `json:"chat_menunggu"`
}

// ============================================================
// REKAP ABSENSI (view untuk HRD)
// ============================================================

type RekapAbsensiRow struct {
        PelaksanaanID   string     `json:"pelaksanaan_id"`
        NamaLengkap     string     `json:"nama_lengkap"`
        AsalInstitusi   string     `json:"asal_institusi"`
        KategoriMagang  string     `json:"kategori_magang"`
        Divisi          *string    `json:"divisi"`
        TanggalMulai    time.Time  `json:"tanggal_mulai"`
        TanggalSelesai  time.Time  `json:"tanggal_selesai"`
        Status          string     `json:"status"`
        Hadir           int        `json:"hadir"`
        Izin            int        `json:"izin"`
        Sakit           int        `json:"sakit"`
        Alpha           int        `json:"alpha"`
        PendingApproval int        `json:"pending_approval"`
}

// ============================================================
// DIVISI
// ============================================================

type Divisi struct {
        ID        uuid.UUID `json:"id" db:"id"`
        Nama      string    `json:"nama" db:"nama"`
        IsActive  bool      `json:"is_active" db:"is_active"`
        Urutan    int       `json:"urutan" db:"urutan"`
        CreatedAt time.Time `json:"created_at" db:"created_at"`
}
