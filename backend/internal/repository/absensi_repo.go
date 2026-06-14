package repository

import (
        "context"

        "github.com/google/uuid"
        "github.com/jackc/pgx/v5/pgxpool"
        "github.com/telpp/emagang/internal/models"
)

type AbsensiRepository struct {
        db *pgxpool.Pool
}

func NewAbsensiRepository(db *pgxpool.Pool) *AbsensiRepository {
        return &AbsensiRepository{db: db}
}

func (r *AbsensiRepository) CheckIn(ctx context.Context, a *models.Absensi) error {
        query := `
                INSERT INTO absensi (pelaksanaan_id, tanggal, jam_masuk, keterangan, kegiatan, latitude, longitude)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, created_at`
        return r.db.QueryRow(ctx, query, a.PelaksanaanID, a.Tanggal, a.JamMasuk, a.Keterangan, a.Kegiatan, a.Latitude, a.Longitude).
                Scan(&a.ID, &a.CreatedAt)
}

func (r *AbsensiRepository) CheckOut(ctx context.Context, pelaksanaanID uuid.UUID, tanggal, jamKeluar, kegiatan string) error {
        _, err := r.db.Exec(ctx,
                "UPDATE absensi SET jam_keluar=$1, kegiatan=$2 WHERE pelaksanaan_id=$3 AND tanggal=$4",
                jamKeluar, kegiatan, pelaksanaanID, tanggal)
        return err
}

func (r *AbsensiRepository) FindByPelaksanaanID(ctx context.Context, pelaksanaanID uuid.UUID) ([]models.Absensi, error) {
        rows, err := r.db.Query(ctx,
                `SELECT id, pelaksanaan_id, tanggal, jam_masuk, jam_keluar, keterangan, kegiatan,
                 ttd_pembimbing, approved_by, approved_at, catatan, created_at
                 FROM absensi WHERE pelaksanaan_id=$1 ORDER BY tanggal ASC`, pelaksanaanID)
        if err != nil {
                return nil, err
        }
        defer rows.Close()

        var list []models.Absensi
        for rows.Next() {
                var a models.Absensi
                rows.Scan(&a.ID, &a.PelaksanaanID, &a.Tanggal, &a.JamMasuk, &a.JamKeluar, &a.Keterangan, &a.Kegiatan,
                        &a.TTDPembimbing, &a.ApprovedBy, &a.ApprovedAt, &a.Catatan, &a.CreatedAt)
                list = append(list, a)
        }
        return list, nil
}

func (r *AbsensiRepository) FindByDate(ctx context.Context, pelaksanaanID uuid.UUID, tanggal string) (*models.Absensi, error) {
        a := &models.Absensi{}
        err := r.db.QueryRow(ctx,
                `SELECT id, pelaksanaan_id, tanggal, jam_masuk, jam_keluar, keterangan, kegiatan,
                 ttd_pembimbing, approved_by, approved_at, catatan, created_at
                 FROM absensi WHERE pelaksanaan_id=$1 AND tanggal=$2`, pelaksanaanID, tanggal).
                Scan(&a.ID, &a.PelaksanaanID, &a.Tanggal, &a.JamMasuk, &a.JamKeluar, &a.Keterangan, &a.Kegiatan,
                        &a.TTDPembimbing, &a.ApprovedBy, &a.ApprovedAt, &a.Catatan, &a.CreatedAt)
        return a, err
}

func (r *AbsensiRepository) Approve(ctx context.Context, id uuid.UUID, approvedBy uuid.UUID) error {
        _, err := r.db.Exec(ctx,
                "UPDATE absensi SET ttd_pembimbing=true, approved_by=$1, approved_at=NOW() WHERE id=$2",
                approvedBy, id)
        return err
}

// GetRekapAll — ringkasan absensi semua pelaksanaan, dipakai oleh HRD
func (r *AbsensiRepository) GetRekapAll(ctx context.Context) ([]models.RekapAbsensiRow, error) {
        query := `
        SELECT
                pl.id::text,
                pj.nama_lengkap,
                pj.asal_institusi,
                pj.kategori_magang,
                pl.divisi,
                pl.tanggal_mulai,
                pl.tanggal_selesai,
                pl.status,
                COALESCE(COUNT(a.id) FILTER (WHERE a.keterangan = 'hadir'), 0)::int,
                COALESCE(COUNT(a.id) FILTER (WHERE a.keterangan = 'izin'), 0)::int,
                COALESCE(COUNT(a.id) FILTER (WHERE a.keterangan = 'sakit'), 0)::int,
                COALESCE(COUNT(a.id) FILTER (WHERE a.keterangan = 'alpha'), 0)::int,
                COALESCE(COUNT(a.id) FILTER (WHERE a.approved_at IS NULL), 0)::int
        FROM pelaksanaan_magang pl
        JOIN pengajuan_magang pj ON pj.id = pl.pengajuan_id
        LEFT JOIN absensi a ON a.pelaksanaan_id = pl.id
        WHERE pl.status NOT IN ('menunggu_mulai')
        GROUP BY pl.id, pj.nama_lengkap, pj.asal_institusi, pj.kategori_magang,
                 pl.divisi, pl.tanggal_mulai, pl.tanggal_selesai, pl.status
        ORDER BY pl.tanggal_mulai DESC`

        rows, err := r.db.Query(ctx, query)
        if err != nil {
                return nil, err
        }
        defer rows.Close()

        var list []models.RekapAbsensiRow
        for rows.Next() {
                var row models.RekapAbsensiRow
                if err := rows.Scan(
                        &row.PelaksanaanID, &row.NamaLengkap, &row.AsalInstitusi, &row.KategoriMagang,
                        &row.Divisi, &row.TanggalMulai, &row.TanggalSelesai, &row.Status,
                        &row.Hadir, &row.Izin, &row.Sakit, &row.Alpha, &row.PendingApproval,
                ); err != nil {
                        return nil, err
                }
                list = append(list, row)
        }
        if list == nil {
                list = []models.RekapAbsensiRow{}
        }
        return list, nil
}

func (r *AbsensiRepository) CountByPelaksanaan(ctx context.Context, pelaksanaanID uuid.UUID) (hadir, izin, sakit, alpha int) {
        r.db.QueryRow(ctx,
                `SELECT
                        COUNT(*) FILTER (WHERE keterangan='hadir'),
                        COUNT(*) FILTER (WHERE keterangan='izin'),
                        COUNT(*) FILTER (WHERE keterangan='sakit'),
                        COUNT(*) FILTER (WHERE keterangan='alpha')
                 FROM absensi WHERE pelaksanaan_id=$1`, pelaksanaanID).
                Scan(&hadir, &izin, &sakit, &alpha)
        return
}
