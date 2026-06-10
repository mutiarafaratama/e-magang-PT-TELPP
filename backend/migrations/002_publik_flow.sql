-- 002: Alur baru — form publik tanpa akun & kirim akun via HRD
-- Jalankan: psql $DATABASE_URL -f backend/migrations/002_publik_flow.sql

-- Buat user_id nullable (peserta mendaftar tanpa akun dulu)
ALTER TABLE pengajuan_magang ALTER COLUMN user_id DROP NOT NULL;

-- Ganti FK constraint agar SET NULL ketika user dihapus
ALTER TABLE pengajuan_magang DROP CONSTRAINT IF EXISTS pengajuan_magang_user_id_fkey;
ALTER TABLE pengajuan_magang ADD CONSTRAINT pengajuan_magang_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Kolom timestamp ketika HRD mengirimkan akun ke peserta
ALTER TABLE pengajuan_magang ADD COLUMN IF NOT EXISTS akun_terkirim_at TIMESTAMPTZ;
