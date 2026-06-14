-- ============================================================
-- MIGRATION 009: Tabel Izin / Sakit Request
-- Jalankan jika sudah pernah run 001_init.sql sebelum fitur ini
-- ditambahkan. Aman dijalankan berulang (IF NOT EXISTS).
-- ============================================================

CREATE TABLE IF NOT EXISTS izin_sakit_request (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pelaksanaan_id  UUID NOT NULL REFERENCES pelaksanaan_magang(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    tanggal         DATE NOT NULL,
    jenis           VARCHAR(10) NOT NULL CHECK (jenis IN ('izin', 'sakit')),
    alasan          TEXT NOT NULL,
    bukti_path      VARCHAR(500),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'disetujui', 'ditolak')),
    catatan_hrd     TEXT,
    diproses_oleh   UUID REFERENCES users(id),
    diproses_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(pelaksanaan_id, tanggal)
);
