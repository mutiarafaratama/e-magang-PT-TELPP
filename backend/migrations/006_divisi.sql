-- e-Magang TELPP — Migration 006: Tabel Divisi
-- Jalankan: psql -U postgres -d emagang_telpp -f migrations/006_divisi.sql
-- Aman dijalankan berulang kali (idempotent)

CREATE TABLE IF NOT EXISTS divisi (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama       VARCHAR(255) NOT NULL UNIQUE,
    is_active  BOOLEAN DEFAULT TRUE,
    urutan     INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO divisi (nama, urutan) VALUES
  ('IT / Sistem Informasi',   1),
  ('Produksi',                2),
  ('Keuangan & Akuntansi',    3),
  ('HRD & Umum',              4),
  ('Teknik & Pemeliharaan',   5),
  ('Lingkungan & K3',         6),
  ('Logistik & Pengadaan',    7),
  ('Riset & Pengembangan',    8)
ON CONFLICT DO NOTHING;
