-- Migration 008: tambah kolom password_changed ke tabel users
-- Jalankan di lokal: psql -U postgres -d emagang_telpp -f migrations/008_password_changed.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS password_changed BOOLEAN NOT NULL DEFAULT FALSE;
