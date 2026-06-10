---
name: e-Magang TELPP Backend
description: Catatan arsitektur dan keputusan desain backend Go untuk sistem e-Magang TELPP
---

## Status
Backend Go selesai — 32 file .go, siap di-compile dan dijalankan lokal oleh user.

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
└── migrations/001_init.sql       ← DDL + seed (admin/hrd password: Admin@123!)
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

## Seed Accounts
- admin@telpp.co.id / Admin@123!
- hrd@telpp.co.id / Admin@123!
Hash bcrypt cost 12 di migration.

## Langkah Setup User (go mod tidy + migration + .env + go run)
Lihat backend/README.md untuk tutorial lengkap.

**Why**: Proyek ini berjalan di mesin lokal user (bukan Replit), sehingga tidak ada workflow Replit untuk backend Go.

## Workflow Preferences User

- **DB**: User pakai PostgreSQL lokal. Replit hanya untuk testing/preview. Setiap perubahan schema → beritahu SQL-nya agar bisa dijalankan lokal.
- **Inform sebelum eksekusi**: Setiap file baru atau perubahan penting → beritahu user dulu sebelum dieksekusi.
- **Struktur lokal vs Replit**:
  - Lokal: `backend/` (Go) dan `frontend/` (Vue 3, di root project)
  - Replit: `backend/` (Go) dan `artifacts/frontend/` (Vue 3)
  - Pastikan semua perubahan relevan bisa diterapkan ke struktur lokal.
