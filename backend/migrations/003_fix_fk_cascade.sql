-- e-Magang TELPP — Migration 003: Fix FK constraints (CASCADE / SET NULL)
-- Jalankan: psql -U postgres -d emagang_telpp -f migrations/003_fix_fk_cascade.sql
-- Aman dijalankan berulang kali (idempotent)
-- Lokal: jalankan SQL ini di database lokal Anda juga.

-- notifikasi: CASCADE agar notif terhapus otomatis saat user dihapus
ALTER TABLE notifikasi DROP CONSTRAINT IF EXISTS notifikasi_user_id_fkey;
ALTER TABLE notifikasi ADD CONSTRAINT notifikasi_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- dokumen: CASCADE agar dokumen terhapus otomatis saat user dihapus
ALTER TABLE dokumen DROP CONSTRAINT IF EXISTS dokumen_user_id_fkey;
ALTER TABLE dokumen ADD CONSTRAINT dokumen_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- pelaksanaan_magang: CASCADE pada user_id peserta, SET NULL pada nullable FKs
ALTER TABLE pelaksanaan_magang DROP CONSTRAINT IF EXISTS pelaksanaan_magang_user_id_fkey;
ALTER TABLE pelaksanaan_magang ADD CONSTRAINT pelaksanaan_magang_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE pelaksanaan_magang DROP CONSTRAINT IF EXISTS pelaksanaan_magang_pembimbing_id_fkey;
ALTER TABLE pelaksanaan_magang ADD CONSTRAINT pelaksanaan_magang_pembimbing_id_fkey
  FOREIGN KEY (pembimbing_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE pelaksanaan_magang DROP CONSTRAINT IF EXISTS pelaksanaan_magang_dinilai_oleh_fkey;
ALTER TABLE pelaksanaan_magang ADD CONSTRAINT pelaksanaan_magang_dinilai_oleh_fkey
  FOREIGN KEY (dinilai_oleh) REFERENCES users(id) ON DELETE SET NULL;

-- chat_tiket: CASCADE pada user_id, SET NULL pada assigned_to (agar tiket tidak hilang)
ALTER TABLE chat_tiket DROP CONSTRAINT IF EXISTS chat_tiket_user_id_fkey;
ALTER TABLE chat_tiket ADD CONSTRAINT chat_tiket_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE chat_tiket DROP CONSTRAINT IF EXISTS chat_tiket_assigned_to_fkey;
ALTER TABLE chat_tiket ADD CONSTRAINT chat_tiket_assigned_to_fkey
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL;

-- chat_pesan: CASCADE sender_id agar pesan terhapus saat user dihapus
ALTER TABLE chat_pesan DROP CONSTRAINT IF EXISTS chat_pesan_sender_id_fkey;
ALTER TABLE chat_pesan ADD CONSTRAINT chat_pesan_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;

-- absensi: SET NULL pada approved_by (data absensi tetap ada)
ALTER TABLE absensi DROP CONSTRAINT IF EXISTS absensi_approved_by_fkey;
ALTER TABLE absensi ADD CONSTRAINT absensi_approved_by_fkey
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- status_history: SET NULL pada changed_by (history tetap tercatat)
ALTER TABLE status_history DROP CONSTRAINT IF EXISTS status_history_changed_by_fkey;
ALTER TABLE status_history ADD CONSTRAINT status_history_changed_by_fkey
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL;

-- pengajuan_magang: SET NULL pada verified_by
ALTER TABLE pengajuan_magang DROP CONSTRAINT IF EXISTS pengajuan_magang_verified_by_fkey;
ALTER TABLE pengajuan_magang ADD CONSTRAINT pengajuan_magang_verified_by_fkey
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL;
