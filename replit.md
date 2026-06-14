# e-Magang TELPP

Sistem manajemen magang untuk PT TanjungEnim Lestari Pulp and Paper. Backend Go + Vue 3 frontend + PostgreSQL.

## Stack

- Backend: Go 1.22 + Gin + PostgreSQL (pgx/v5 **v5.6.0**) + JWT + Gorilla WebSocket + gofpdf
- Frontend: Vue 3 + Pinia + Axios (bukan TypeScript/Node — murni Vue 3 SFC)
- DB: PostgreSQL 15+

## Struktur proyek

```
Lokal user:
E-MAGANG PT TELPP/
├── backend/      ← Go backend (sama dengan backend/ di Replit)
└── frontend/     ← Vue 3 frontend (sama isinya dengan artifacts/frontend/ di Replit)

Replit:
├── backend/               ← Go backend (source of truth)
├── artifacts/frontend/    ← Vue 3 frontend (isi sama dengan lokal frontend/)
└── artifacts/api-server/  ← Node.js proxy HANYA ADA DI REPLIT, tidak ada di lokal
```

**Catatan penting:**
- `artifacts/api-server/` adalah proxy Express untuk keperluan Replit saja — **tidak ada di lokal user**
- Backend asli tetap **Go** — semua logika bisnis ada di `backend/`
- Frontend Vue 3 di `artifacts/frontend/` isinya identik dengan `frontend/` lokal user

## Where things live

- `backend/` — seluruh kode Go backend
- `backend/migrations/` — file SQL migrasi schema (dijalankan ke DB Replit dan DB lokal)
- `backend/internal/models/models.go` — semua struct, enum, request/response types
- `backend/internal/router/router.go` — semua route API terdaftar di sini
- `backend/README.md` — tutorial setup lengkap untuk user
- `artifacts/frontend/src/` — Vue 3 SFC components dan views

## Run & Operate di Replit

**Go backend** (workflow: `Go API Server`):
```bash
cd backend && ./bin/server
```

**Build ulang binary** (jika ada perubahan file Go):
```bash
cd backend && GOPROXY='https://goproxy.cn,direct' GONOSUMDB='*' GOFLAGS='-mod=mod' go build -o bin/server ./cmd/server/main.go
```
> Wajib pakai `GOPROXY=goproxy.cn` karena Replit memblokir download pgx/v5 langsung (CVE policy). Metode ini sudah terbukti berhasil.

**Jalankan migrasi SQL ke DB Replit:**
```bash
psql $DATABASE_URL -f backend/migrations/00X_nama.sql
```

**Frontend** (workflow: `Frontend`):
```bash
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/frontend run dev
```

## Run & Operate di lokal user

```bash
cd backend
go mod tidy
cp .env.example .env  # lalu isi konfigurasi DB lokal
go build -o bin/server ./cmd/server/main.go
./bin/server
```

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

- **Inform dulu sebelum eksekusi**: Setiap ada perubahan file penting atau file baru, beritahu user lebih dulu sebelum mengeksekusi/membuat.
- **Beritahu file yang berubah**: Setiap selesai mengerjakan sesuatu, sebutkan semua file yang diubah/dibuat beserta lokasinya (Replit path dan path lokal yang ekuivalen), agar user bisa meng-copy ke lokal.
- **DB lokal**: User pakai PostgreSQL lokal di mesin sendiri. Replit hanya untuk testing. Setiap ada perubahan schema (tabel baru, kolom baru, dll), wajib beritahu SQL-nya agar bisa dijalankan di lokal juga. Migrasi SQL dari `backend/migrations/` dijalankan langsung ke database Replit untuk testing.
- **SQL migrasi ke Replit**: Setiap ada migration file baru, langsung jalankan ke DB Replit dengan `psql $DATABASE_URL -f backend/migrations/00X_nama.sql`.
- **Backend = Go, Frontend = Vue 3**: Jangan pakai TypeScript murni atau Node.js untuk logika bisnis. Backend adalah Go, frontend adalah Vue 3 SFC.
- **Sinkronisasi routes**: Jika ada perubahan route di `artifacts/api-server/src/routes/`, wajib juga ubah di `backend/internal/router/` menggunakan Go.

## Gotchas

- **Build di Replit**: Wajib pakai `GOPROXY='https://goproxy.cn,direct' GONOSUMDB='*' GOFLAGS='-mod=mod'` saat `go build` — Replit memblokir download pgx/v5 langsung karena CVE policy. Tanpa ini build akan gagal 403 Forbidden.
- **pgx versi**: Pakai `github.com/jackc/pgx/v5 v5.6.0` (bukan v5.7.2) — sesuai dengan versi lokal user dan tidak kena CVE block di Replit.
- `repository.SetDB(pool)` WAJIB dipanggil sebelum service diinit (sudah ada di `router.go`)
- Password harus memenuhi regex: huruf + angka + karakter spesial, min 8 karakter
- `go.sum` tidak di-commit — user jalankan `go mod tidy` di lokal untuk generate ulang
- `artifacts/api-server/` hanya proxy Replit — tidak ada di lokal user, jangan tambah logika bisnis di sini

## Pointers

- Lihat `backend/README.md` untuk tutorial setup lengkap dengan daftar endpoint API
- Lihat `.agents/memory/emagang-backend.md` untuk catatan arsitektur detail
