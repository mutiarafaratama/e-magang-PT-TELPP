-- 010: Tabel konten alur pendaftaran untuk landing page carousel
CREATE TABLE IF NOT EXISTS landing_alur (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    judul      TEXT         NOT NULL DEFAULT '',
    paragraf   TEXT         NOT NULL DEFAULT '',
    gambar_url TEXT         NOT NULL DEFAULT '',
    urutan     INTEGER      NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Seed data default (bisa dihapus/diedit admin kapan saja)
INSERT INTO landing_alur (judul, paragraf, gambar_url, urutan) VALUES
  ('Isi Formulir Pendaftaran', 'Lengkapi data diri, akademik, dan pilih periode magang melalui formulir online yang mudah digunakan.', '', 1),
  ('Verifikasi Berkas oleh HRD', 'Tim HRD memeriksa kelayakan berkas dan dokumen pendukung Anda dalam waktu 3–5 hari kerja.', '', 2),
  ('Terima Akun e-Magang', 'Akun login e-Magang dikirimkan ke email Anda setelah dinyatakan lolos seleksi administrasi.', '', 3),
  ('Upload Dokumen Persyaratan', 'Login ke sistem dan unggah seluruh dokumen persyaratan yang diminta sesuai panduan.', '', 4),
  ('Mulai & Pantau Magang', 'Mulai kegiatan magang, lakukan absensi digital harian, dan pantau progress via dashboard real-time.', '', 5)
ON CONFLICT DO NOTHING;
