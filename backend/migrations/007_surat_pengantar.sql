-- e-Magang TELPP — Migration 007: Tambah jenis dokumen surat_pengantar
-- Jalankan: psql -U postgres -d emagang_telpp -f migrations/007_surat_pengantar.sql
-- Aman dijalankan berulang kali (idempotent)
-- Lokal: jalankan SQL ini di database lokal Anda juga.

ALTER TYPE jenis_dokumen ADD VALUE IF NOT EXISTS 'surat_pengantar';
