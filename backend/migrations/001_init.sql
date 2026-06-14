-- e-Magang TELPP — Database Init
-- Aman dijalankan berulang kali (idempotent)
-- Jalankan: psql -U postgres -d emagang_telpp -f migrations/001_init.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMs (buat hanya jika belum ada)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'hrd', 'peserta');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kategori_magang AS ENUM ('smk', 'd3_s1_s2', 'penelitian');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE jenis_kelamin AS ENUM ('laki_laki', 'perempuan');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_pengajuan AS ENUM ('diajukan','menunggu_verifikasi','diproses','diterima','ditolak');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE jenis_dokumen AS ENUM ('proposal_magang','surat_pengantar','ktp','ktm','pasfoto','bpjs_kis','surat_balasan','laporan_magang','sertifikat');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_pelaksanaan AS ENUM ('menunggu_mulai','aktif','upload_laporan','penilaian','selesai');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE status_tiket AS ENUM ('menunggu','diproses','selesai');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- USERS & AUTH
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama_lengkap     VARCHAR(255) NOT NULL,
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    role             user_role NOT NULL DEFAULT 'peserta',
    is_active        BOOLEAN DEFAULT TRUE,
    password_changed BOOLEAN DEFAULT FALSE,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PERIODE MAGANG
-- ============================================================
CREATE TABLE IF NOT EXISTS periode_magang (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama            VARCHAR(255) NOT NULL,
    tanggal_buka    DATE NOT NULL,
    tanggal_tutup   DATE NOT NULL,
    kuota           INTEGER,
    is_active       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PENGAJUAN MAGANG
-- ============================================================
CREATE TABLE IF NOT EXISTS pengajuan_magang (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    nama_lengkap    VARCHAR(255) NOT NULL,
    tempat_lahir    VARCHAR(100) NOT NULL,
    tanggal_lahir   DATE NOT NULL,
    jenis_kelamin   jenis_kelamin NOT NULL,
    alamat          TEXT NOT NULL,
    no_hp           VARCHAR(20) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    kategori_magang kategori_magang NOT NULL,
    nomor_induk     VARCHAR(50) NOT NULL,
    asal_institusi  VARCHAR(255) NOT NULL,
    jurusan         VARCHAR(255) NOT NULL,
    kelas_semester  VARCHAR(50) NOT NULL,
    status          status_pengajuan NOT NULL DEFAULT 'diajukan',
    catatan_hrd     TEXT,
    verified_by     UUID REFERENCES users(id),
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pengajuan_id    UUID NOT NULL REFERENCES pengajuan_magang(id) ON DELETE CASCADE,
    status_lama     status_pengajuan,
    status_baru     status_pengajuan NOT NULL,
    changed_by      UUID REFERENCES users(id),
    catatan         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DOKUMEN UPLOAD
-- ============================================================
CREATE TABLE IF NOT EXISTS dokumen (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pengajuan_id    UUID REFERENCES pengajuan_magang(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    jenis           jenis_dokumen NOT NULL,
    nama_file       VARCHAR(255) NOT NULL,
    path_file       VARCHAR(500) NOT NULL,
    ukuran_bytes    BIGINT,
    mime_type       VARCHAR(100),
    uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PELAKSANAAN MAGANG
-- ============================================================
CREATE TABLE IF NOT EXISTS pelaksanaan_magang (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pengajuan_id            UUID UNIQUE NOT NULL REFERENCES pengajuan_magang(id),
    user_id                 UUID NOT NULL REFERENCES users(id),
    periode_id              UUID REFERENCES periode_magang(id),
    tanggal_mulai           DATE NOT NULL,
    tanggal_selesai         DATE NOT NULL,
    divisi                  VARCHAR(255),
    pembimbing_id           UUID REFERENCES users(id),
    status                  status_pelaksanaan DEFAULT 'menunggu_mulai',
    nilai                   NUMERIC(5,2),
    catatan_nilai           TEXT,
    dinilai_oleh            UUID REFERENCES users(id),
    dinilai_at              TIMESTAMPTZ,
    sertifikat_generated    BOOLEAN DEFAULT FALSE,
    sertifikat_path         VARCHAR(500),
    sertifikat_generated_at TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ABSENSI HARIAN
-- ============================================================
CREATE TABLE IF NOT EXISTS absensi (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pelaksanaan_id  UUID NOT NULL REFERENCES pelaksanaan_magang(id) ON DELETE CASCADE,
    tanggal         DATE NOT NULL,
    jam_masuk       TIME,
    jam_keluar      TIME,
    keterangan      VARCHAR(20) DEFAULT 'hadir',
    kegiatan        TEXT,
    ttd_pembimbing  BOOLEAN DEFAULT FALSE,
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMPTZ,
    catatan         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(pelaksanaan_id, tanggal)
);

-- ============================================================
-- CHAT / HELPDESK
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_tiket (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    nomor_tiket VARCHAR(20) UNIQUE NOT NULL,
    subjek      VARCHAR(255),
    status      status_tiket DEFAULT 'menunggu',
    assigned_to UUID REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_pesan (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tiket_id    UUID NOT NULL REFERENCES chat_tiket(id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES users(id),
    pesan       TEXT NOT NULL,
    is_read     BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_knowledge (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pertanyaan  VARCHAR(500) NOT NULL,
    jawaban     TEXT NOT NULL,
    urutan      INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NOTIFIKASI
-- ============================================================
CREATE TABLE IF NOT EXISTS notifikasi (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    judul           VARCHAR(255) NOT NULL,
    pesan           TEXT NOT NULL,
    tipe            VARCHAR(50),
    referensi_id    UUID,
    is_read         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LANDING PAGE CMS
-- ============================================================
CREATE TABLE IF NOT EXISTS landing_content (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kunci       VARCHAR(100) UNIQUE NOT NULL,
    nilai       TEXT,
    tipe        VARCHAR(20) DEFAULT 'text',
    updated_by  UUID REFERENCES users(id),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faq (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pertanyaan  TEXT NOT NULL,
    jawaban     TEXT NOT NULL,
    urutan      INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DIVISI
-- ============================================================
CREATE TABLE IF NOT EXISTS divisi (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama       VARCHAR(255) NOT NULL,
    is_active  BOOLEAN DEFAULT TRUE,
    urutan     INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- KONFIGURASI ABSENSI (singleton, selalu id=1)
-- ============================================================
CREATE TABLE IF NOT EXISTS absensi_config (
    id               SERIAL PRIMARY KEY,
    jam_masuk_buka   TIME NOT NULL DEFAULT '07:00',
    jam_masuk_tutup  TIME NOT NULL DEFAULT '09:00',
    jam_pulang_buka  TIME NOT NULL DEFAULT '16:00',
    jam_pulang_tutup TIME NOT NULL DEFAULT '18:00',
    kantor_lat       DOUBLE PRECISION,
    kantor_lng       DOUBLE PRECISION,
    radius_meter     INTEGER DEFAULT 1500,
    updated_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_by       UUID REFERENCES users(id)
);

-- ============================================================
-- SEED DATA (upsert — aman dijalankan ulang)
-- ============================================================

-- Password untuk kedua akun ini adalah: Admin@123!
-- Hash di-generate dengan bcrypt cost 12
-- PENTING: Ganti password ini setelah pertama kali login!
INSERT INTO users (nama_lengkap, email, password_hash, role) VALUES
  ('Super Admin', 'admin@telpp.co.id',
   '$2b$12$sbQOEPRpHccBYe3XaQhLWu4G8J364qHhmuDSiYHylRKULhMF9gMAW', 'admin'),
  ('Staff HRD', 'hrd@telpp.co.id',
   '$2b$12$sbQOEPRpHccBYe3XaQhLWu4G8J364qHhmuDSiYHylRKULhMF9gMAW', 'hrd')
ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      updated_at    = NOW();

-- Seed knowledge base
INSERT INTO chat_knowledge (pertanyaan, jawaban, urutan) VALUES
  ('Bagaimana cara mendaftar magang?', 'Klik tombol "Daftar" di menu utama, buat akun, lalu isi form pengajuan magang yang tersedia.', 1),
  ('Apa saja dokumen yang dibutuhkan?', 'Dokumen yang dibutuhkan: Proposal Magang (PDF max 100MB), KTP, KTM (untuk mahasiswa), Pasfoto 3x4, dan Kartu BPJS/KIS.', 2),
  ('Berapa lama proses verifikasi?', 'Proses verifikasi berkas biasanya memakan waktu 3-5 hari kerja setelah dokumen lengkap diterima.', 3),
  ('Bagaimana cara cek status pengajuan?', 'Login ke akun Anda, lalu buka Dashboard. Status pengajuan ditampilkan secara real-time di halaman utama.', 4),
  ('Siapa yang bisa mendaftar magang di TELPP?', 'Magang terbuka untuk siswa SMK, mahasiswa D3/S1/S2, dan peneliti. Pastikan periode pendaftaran sedang aktif.', 5),
  ('Bagaimana jika dokumen saya ditolak?', 'Anda akan mendapat notifikasi beserta catatan alasan penolakan dari HRD. Anda dapat mengajukan ulang dengan dokumen yang telah diperbaiki.', 6)
ON CONFLICT DO NOTHING;

-- Seed landing content
INSERT INTO landing_content (kunci, nilai, tipe) VALUES
  ('hero_title',        'Program Magang PT TanjungEnim Lestari Pulp and Paper', 'text'),
  ('hero_subtitle',     'Wujudkan pengalaman nyata di industri pulp dan kertas terkemuka di Indonesia', 'text'),
  ('syarat_umum',       '1. Mahasiswa aktif atau siswa SMK\n2. IPK minimal 2.75 (untuk mahasiswa)\n3. Surat pengantar dari institusi\n4. Sehat jasmani dan rohani\n5. Bersedia mematuhi peraturan perusahaan', 'text'),
  ('ketentuan_magang',  '1. Wajib memakai helm safety di area produksi\n2. Wajib memakai sepatu safety\n3. Pakaian: kemeja hitam-putih, celana kain gelap\n4. Hadir tepat waktu sesuai jadwal yang ditetapkan\n5. Wajib membuat laporan akhir magang', 'text'),
  ('tempat_kumpul',     'Gedung HRD PT TanjungEnim Lestari, Jl. Raya Muara Enim, Sumatera Selatan', 'text'),
  ('kontak_hrd',        'hrd@telpp.co.id | (0734) 123-456', 'text')
ON CONFLICT (kunci) DO UPDATE
  SET nilai      = EXCLUDED.nilai,
      updated_at = NOW();

-- Seed FAQ
INSERT INTO faq (pertanyaan, jawaban, urutan) VALUES
  ('Kapan periode pendaftaran magang dibuka?', 'Periode pendaftaran magang dibuka setiap semester. Pantau terus halaman ini atau ikuti pengumuman resmi dari PT TanjungEnim Lestari.', 1),
  ('Apakah ada biaya untuk mendaftar magang?', 'Tidak ada biaya pendaftaran. Program magang di TELPP sepenuhnya gratis.', 2),
  ('Berapa lama durasi magang?', 'Durasi magang bervariasi: minimum 1 bulan hingga maksimum 6 bulan, tergantung kebutuhan dan kesepakatan dengan HRD.', 3),
  ('Apakah peserta magang mendapat uang saku?', 'Informasi mengenai uang saku dapat ditanyakan langsung kepada HRD saat proses penerimaan.', 4),
  ('Divisi apa saja yang menerima peserta magang?', 'Tersedia berbagai divisi seperti produksi, teknik, IT, keuangan, HRD, dan lingkungan. Penempatan disesuaikan dengan latar belakang pendidikan.', 5),
  ('Bagaimana format laporan magang?', 'Format laporan akan diberikan oleh pembimbing magang. Laporan dikumpulkan dalam format PDF maksimal 1 minggu setelah masa magang berakhir.', 6)
ON CONFLICT DO NOTHING;

-- Seed default konfigurasi absensi
INSERT INTO absensi_config (jam_masuk_buka, jam_masuk_tutup, jam_pulang_buka, jam_pulang_tutup)
VALUES ('07:00', '09:00', '16:00', '18:00')
ON CONFLICT DO NOTHING;

-- Seed divisi
INSERT INTO divisi (nama, urutan) VALUES
  ('IT & Sistem Informasi', 1),
  ('Produksi', 2),
  ('Teknik', 3),
  ('Keuangan & Akuntansi', 4),
  ('HRD & Umum', 5),
  ('Lingkungan & K3', 6)
ON CONFLICT DO NOTHING;
