# e-Magang TELPP

Sistem manajemen magang untuk PT TanjungEnim Lestari Pulp and Paper. Backend Go + Vue 3 frontend + PostgreSQL.

## Run & Operate

Backend (dijalankan di mesin lokal user, bukan Replit):
- `cd backend && go mod tidy` — install dependencies
- `psql -U postgres -d emagang_telpp -f migrations/001_init.sql` — init database
- `cp .env.example .env` lalu isi konfigurasi
- `go run cmd/server/main.go` — jalankan server di port 8080

Frontend (Vue 3):
- Belum dibangun. Akan dibuat terpisah.

## Stack

- Backend: Go 1.22 + Gin + PostgreSQL (pgx/v5) + JWT + Gorilla WebSocket + gofpdf
- Frontend (rencana): Vue 3 + Pinia + Axios
- DB: PostgreSQL 15+

## Where things live

- `backend/` — seluruh kode Go backend (tidak dalam artifacts/, untuk dibawa user ke lokal)
- `backend/migrations/001_init.sql` — source of truth schema + seed data
- `backend/internal/models/models.go` — semua struct, enum, request/response types
- `backend/internal/router/router.go` — semua route API terdaftar di sini
- `backend/README.md` — tutorial setup lengkap untuk user

## Architecture decisions

- 3 role: `admin`, `hrd`, `peserta`. Role guard via JWT claims + middleware.
- In-app notification via WebSocket (GlobalHub) — tidak pakai OneSignal/Firebase.
- Upload file ke local filesystem `./uploads/`, bukan cloud storage.
- Sertifikat dan rekap absensi auto-generated PDF via gofpdf.
- Chat helpdesk berbasis tiket queue — peserta buat tiket, HRD balas.
- Landing page CMS key-value di tabel `landing_content` — admin edit via API.

## Product

- Landing page publik (syarat, FAQ, info magang)
- Multi-step form pendaftaran magang (peserta)
- Verifikasi berkas + approval workflow (HRD)
- Dashboard pelaksanaan magang dengan absensi harian self-service
- TTD digital pembimbing untuk lembar absensi
- Penilaian akhir + auto-generate sertifikat PDF
- Chat helpdesk berbasis tiket + knowledge base
- Real-time notifikasi via WebSocket
- Dashboard admin dengan statistik

## User preferences

_Belum ada preferensi eksplisit yang tercatat._

## Gotchas

- `repository.SetDB(pool)` WAJIB dipanggil sebelum service diinit (sudah ada di `router.go`)
- Password harus memenuhi regex: huruf + angka + karakter spesial, min 8 karakter
- Duplicate route `/api/dokumen/upload` sudah dihapus (hanya di HRD group dan shared peserta)
- `go.sum` tidak di-commit — user harus jalankan `go mod tidy` untuk generate-nya

## Pointers

- Lihat `backend/README.md` untuk tutorial setup lengkap dengan daftar endpoint API
- Lihat `.agents/memory/emagang-backend.md` untuk catatan arsitektur detail
