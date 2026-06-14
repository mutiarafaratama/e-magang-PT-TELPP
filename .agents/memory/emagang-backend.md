---
name: e-Magang TELPP Backend
description: Catatan arsitektur dan keputusan desain backend Go untuk sistem e-Magang TELPP
---

## Status
Backend Go selesai — 35 file .go (termasuk divisi), siap di-compile dan dijalankan lokal oleh user.
Migration 001–006 sudah dijalankan ke database Replit.

## Go Build di Replit
- GOPROXY default Replit memblokir paket CVE (pgx v5.6.0 diblokir)
- Solusi: `GOPROXY=direct GONOSUMCHECK=* GONOSUMDB=* go build -o bin/server ./cmd/server/main.go`
- Setelah berhasil, module cache terisi dan build berikutnya normal

## Struktur Folder

```
backend/
├── cmd/server/main.go            ← Entry point
├── internal/config/              ← Load .env
├── internal/database/            ← pgxpool koneksi PostgreSQL
├── internal/middleware/          ← JWT auth + CORS
├── internal/models/models.go     ← Semua struct, enum, request/response
├── internal/repository/          ← 8 repo (user, pengajuan, dokumen, pelaksanaan, absensi, chat, notifikasi, landing)
├── internal/service/             ← auth, pengajuan, chat, notifikasi, sertifikat, helpers
├── internal/handler/             ← 9 handler (auth, pengajuan, dokumen, pelaksanaan, absensi, chat, notifikasi, landing, admin)
├── internal/websocket/hub.go     ← GlobalHub singleton, ServeWS handler
├── internal/router/router.go     ← Semua route terdaftar di sini
└── migrations/                   ← 001–005 SQL (semua idempotent, sudah dirun ke Replit DB)
```

## Keputusan Penting

**Password validation**: regex wajib huruf + angka + spesial `!@#$%^&*()_+=.,><?/`, min 8 char. Diimplementasikan di `auth_service.go`.

**WebSocket**: GlobalHub singleton di `internal/websocket/hub.go`. Dijalankan di goroutine dari main.go. `SendToUser` dan `SendToRole` tersedia. Token JWT dikirim via header Authorization saat upgrade WebSocket.

**Sertifikat PDF**: `sertifikat_service.go` menggunakan `database.DB` langsung (bukan via repo) untuk query pelaksanaan by ID karena repo tidak punya `FindByID`. Menggunakan gofpdf, output landscape A4.

**Absensi PDF**: Dibuat inline di `absensi_handler.go` fungsi `generateAbsensiPDF`, bukan service terpisah.

**Notifikasi badge endpoint**: `GET /api/notifikasi/badge` → `{total_unread, chat_menunggu}` — dipakai sidebar Vue untuk badge merah.

**repository.SetDB / GetDB**: `internal/repository/db.go` menyimpan global pool untuk dipakai service yang butuh direct DB access. `SetDB(pool)` harus dipanggil di `router.go` sebelum service diinit.

**File upload**: disimpan di `./uploads/{user_id}/{jenis}_{timestamp}.ext`, bukan di cloud. Max 100MB per file.

**Landing page CMS**: Key-value di tabel `landing_content`. Frontend baca via `GET /api/landing/content` → dapat map `{kunci: nilai}`.

**Geofencing absensi**: koordinat kantor disimpan di `absensi_config` (kolom `kantor_lat`, `kantor_lng`, `radius_meter`). Default: -3.432194, 104.035361, radius 1500m.

## Seed Accounts
- admin@telpp.co.id / Admin@123!
- hrd@telpp.co.id / Admin@123!
Hash bcrypt cost 12 di migration.

## Langkah Setup User (go mod tidy + migration + .env + go run)
Lihat backend/README.md untuk tutorial lengkap.

**Why**: Proyek ini berjalan di mesin lokal user (bukan Replit), sehingga tidak ada workflow Replit untuk backend Go.

## Workflow Preferences User (WAJIB DIIKUTI)

- **DB lokal**: User pakai PostgreSQL lokal. Replit hanya untuk testing/preview.
  - Setiap perubahan schema (tabel baru, kolom baru, dll) → beritahu SQL-nya agar bisa dijalankan lokal juga.
  - Jalankan migration dari `backend/migrations/` ke database Replit via `psql "$DATABASE_URL" -f ...`
- **Inform sebelum eksekusi**: Setiap file baru atau perubahan penting → beritahu user dulu sebelum dieksekusi/dibuat.
- **Struktur lokal vs Replit**:
  - Lokal: `E-MAGANG PT TELPP/backend/` (Go) dan `E-MAGANG PT TELPP/frontend/` (Vue 3, di root project, bukan di artifacts/)
  - Replit: `backend/` (Go) dan `artifacts/frontend/` (Vue 3)
  - `artifacts/api-server/` (Node.js proxy) HANYA ada di Replit, tidak ada di lokal — jangan anggap ini backend utama.
  - Semua perubahan relevan harus bisa diterapkan ke struktur lokal user.
- **Sinkronisasi routes**: Jika ada perubahan di `artifacts/api-server/src/routes/`, wajib juga ubah `backend/internal/routes/` menggunakan Go.
