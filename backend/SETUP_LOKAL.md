# Tutorial Setup e-Magang TELPP di Komputer Lokal

Panduan ini berlaku untuk **Windows**, **macOS**, dan **Linux**.

---

## Daftar Isi

1. [Install Prasyarat](#1-install-prasyarat)
2. [Siapkan Database PostgreSQL](#2-siapkan-database-postgresql)
3. [Clone / Salin Folder Backend](#3-clone--salin-folder-backend)
4. [Buat File Konfigurasi `.env`](#4-buat-file-konfigurasi-env)
5. [Install Dependencies Go](#5-install-dependencies-go)
6. [Jalankan Server](#6-jalankan-server)
7. [Test API & WebSocket](#7-test-api--websocket)
8. [Referensi: Alur Notifikasi](#8-referensi-alur-notifikasi)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Install Prasyarat

### Go 1.22+

**Windows:**
1. Buka https://go.dev/dl/
2. Download installer `.msi` (contoh: `go1.22.4.windows-amd64.msi`)
3. Jalankan installer, klik Next terus
4. Buka Command Prompt baru, ketik: `go version`
   - Harus muncul: `go version go1.22.x windows/amd64`

**macOS:**
```bash
# Cara 1 — Homebrew (disarankan)
brew install go

# Cara 2 — Manual
# Download dari https://go.dev/dl/ → file .pkg
# Install seperti biasa
```

**Linux (Ubuntu/Debian):**
```bash
# Download dan install
wget https://go.dev/dl/go1.22.4.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.4.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
go version
```

---

### PostgreSQL 15+

**Windows:**
1. Download installer dari https://www.postgresql.org/download/windows/
2. Pilih versi 15 atau 16
3. Install dengan pengaturan default
4. **CATAT password yang kamu set untuk user `postgres`** — akan dipakai nanti
5. Centang "pgAdmin 4" kalau mau pakai GUI

**macOS:**
```bash
# Cara 1 — Homebrew (disarankan)
brew install postgresql@15
brew services start postgresql@15
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Buat user postgres (jika belum ada)
createuser -s postgres
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 2. Siapkan Database PostgreSQL

### Buka Terminal / Command Prompt

**Windows:** Buka "SQL Shell (psql)" dari Start Menu, atau Command Prompt lalu:
```
"C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres
```

**macOS/Linux:**
```bash
psql -U postgres
```

### Buat Database

Di dalam psql, ketik perintah berikut satu per satu:

```sql
-- Buat database
CREATE DATABASE emagang_telpp;

-- Verifikasi
\l

-- Keluar dari psql
\q
```

### Jalankan Migration (Buat Semua Tabel + Seed Data)

```bash
# Ganti PASSWORD_KAMU dengan password PostgreSQL yang kamu set saat install
psql -U postgres -d emagang_telpp -f migrations/001_init.sql
```

Kalau berhasil, output akan panjang berisi CREATE TYPE, CREATE TABLE, INSERT, dsb.

**Verifikasi tabel terbuat:**
```bash
psql -U postgres -d emagang_telpp -c "\dt"
```

Harus ada 14 tabel:
```
 absensi, chat_knowledge, chat_pesan, chat_tiket, dokumen, faq,
 landing_content, notifikasi, pelaksanaan_magang, pengajuan_magang,
 periode_magang, refresh_tokens, status_history, users
```

---

## 3. Clone / Salin Folder Backend

Jika kamu punya project dari Replit, folder `backend/` sudah ada.
Salin folder `backend/` ke komputer lokal kamu, lalu masuk ke dalamnya:

```bash
cd backend
```

Semua perintah selanjutnya dijalankan dari dalam folder `backend/`.

---

## 4. Buat File Konfigurasi `.env`

```bash
# Copy template
cp .env.example .env
```

Buka file `.env` dengan text editor:

```bash
# macOS/Linux
nano .env
# atau: code .env (jika pakai VS Code)

# Windows
notepad .env
```

Isi `.env` seperti ini (sesuaikan dengan konfigurasi lokal kamu):

```env
# ============================================================
# DATABASE — Ganti sesuai setup PostgreSQL kamu
# ============================================================
DATABASE_URL=postgres://postgres:PASSWORD_KAMU@localhost:5432/emagang_telpp?sslmode=disable

# ============================================================
# JWT — WAJIB ganti dengan string random yang panjang!
# Minimal 32 karakter, bebas isinya
# ============================================================
JWT_SECRET=ini-contoh-jwt-secret-ganti-dengan-yang-acak-dan-panjang-123!@#

# Durasi token (biarkan default)
JWT_EXPIRY=24h
REFRESH_EXPIRY=168h

# ============================================================
# SERVER
# ============================================================
PORT=8080
APP_ENV=development

# ============================================================
# FILE UPLOAD
# ============================================================
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE=104857600

# ============================================================
# FRONTEND URL (untuk CORS — sesuaikan port Vue kamu)
# ============================================================
FRONTEND_URL=http://localhost:5173
```

> ⚠️ **Penting:**
> - Ganti `PASSWORD_KAMU` dengan password PostgreSQL yang kamu set saat install
> - Ganti `JWT_SECRET` dengan string random panjang (bisa generate dengan: `openssl rand -hex 32`)
> - Jangan commit file `.env` ke Git — sudah di `.gitignore`

---

## 5. Install Dependencies Go

```bash
# Dari dalam folder backend/
go mod tidy
```

Perintah ini akan:
- Download semua package yang dibutuhkan (gin, pgx, gorilla/websocket, gofpdf, dll)
- Generate file `go.sum`
- Butuh koneksi internet, proses ~1-3 menit

Output normal seperti:
```
go: downloading github.com/gin-gonic/gin v1.10.0
go: downloading github.com/jackc/pgx/v5 v5.6.0
...
```

---

## 6. Jalankan Server

```bash
# Dari dalam folder backend/
go run cmd/server/main.go
```

Jika berhasil, output akan seperti ini:
```
✅ Konfigurasi berhasil dimuat (env: development)
✅ Koneksi database PostgreSQL berhasil
🚀 e-Magang TELPP API berjalan di http://localhost:8080
📋 Environment: development
```

Server siap melayani request!

> **Tips:** Untuk development, pakai `air` untuk hot-reload otomatis:
> ```bash
> go install github.com/air-verse/air@latest
> air  # jalankan dari folder backend/
> ```

---

## 7. Test API & WebSocket

### Test Health Check

```bash
curl http://localhost:8080/api/health
```

Response yang diharapkan:
```json
{"app":"e-Magang TELPP","status":"ok"}
```

---

### Test Login Admin

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@telpp.co.id","password":"Admin@123!"}'
```

Response:
```json
{
  "message": "Login berhasil",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid...",
      "nama_lengkap": "Super Admin",
      "email": "admin@telpp.co.id",
      "role": "admin"
    }
  }
}
```

Simpan `access_token` untuk request berikutnya.

---

### Test Profil (dengan token)

```bash
# Ganti TOKEN dengan access_token dari login di atas
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

### Test WebSocket (dari browser)

Buka browser, tekan F12, buka Console, ketik:

```javascript
// Ganti TOKEN dengan access_token dari login
const token = "TOKEN_DARI_LOGIN"
const ws = new WebSocket(`ws://localhost:8080/api/ws?token=${token}`)

ws.onopen = () => console.log("✅ WebSocket terhubung!")

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data)
  console.log("📨 Pesan WS:", msg)
  // Event yang mungkin diterima:
  // type: "connected"     → konfirmasi koneksi berhasil
  // type: "notifikasi"    → ada notifikasi baru (lihat payload.route untuk navigate)
  // type: "badge_update"  → update jumlah badge sidebar
}

ws.onerror = (e) => console.error("❌ WebSocket error:", e)
ws.onclose = () => console.log("🔌 WebSocket terputus")
```

Saat pertama connect, akan muncul di console:
```json
{
  "type": "connected",
  "payload": {
    "user_id": "uuid...",
    "role": "admin",
    "message": "Koneksi WebSocket berhasil"
  }
}
```

---

### Test Notifikasi Realtime

Buka **dua tab browser** (atau dua terminal).

**Tab 1 — Buat WebSocket connection** (seperti di atas, login sebagai admin)

**Tab 2 / Terminal — Trigger notifikasi** (register user baru untuk simulasi):

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama_lengkap": "Test Peserta",
    "email": "test@gmail.com",
    "password": "Test@123!"
  }'
```

Lalu peserta baru submit pengajuan (akan trigger notif ke admin):

```bash
# Ambil token peserta dari register di atas
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"Test@123!"}'

# Simpan token peserta, lalu submit pengajuan:
curl -X POST http://localhost:8080/api/pengajuan \
  -H "Authorization: Bearer TOKEN_PESERTA" \
  -H "Content-Type: application/json" \
  -d '{
    "step1": {
      "nama_lengkap": "Test Peserta",
      "tempat_lahir": "Jakarta",
      "tanggal_lahir": "2000-01-15",
      "jenis_kelamin": "laki_laki",
      "alamat": "Jl. Test No. 1",
      "no_hp": "08123456789",
      "email": "test@gmail.com"
    },
    "step2": {
      "kategori_magang": "d3_s1_s2",
      "nomor_induk": "12345678",
      "asal_institusi": "Universitas Test",
      "jurusan": "Teknik Informatika",
      "kelas_semester": "Semester 6"
    }
  }'
```

Di Tab 1 (admin WebSocket), akan muncul notifikasi real-time seperti:
```json
{
  "type": "notifikasi",
  "payload": {
    "id": "uuid...",
    "judul": "Pengajuan Magang Baru",
    "pesan": "Test Peserta (d3_s1_s2) dari Universitas Test",
    "tipe": "pengajuan",
    "referensi_id": "uuid-pengajuan...",
    "route": "/hrd/pengajuan/uuid-pengajuan...",
    "badge_count": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**`route`** inilah yang dipakai Vue Router untuk navigate saat toast diklik!

---

### Test Badge Count (saat buka web kembali)

```bash
curl http://localhost:8080/api/notifikasi/badge \
  -H "Authorization: Bearer TOKEN_ADMIN"
```

Response:
```json
{
  "data": {
    "total_unread": 1,
    "chat_menunggu": 0
  }
}
```

Badge angka merah di ikon lonceng = `total_unread`.
Badge khusus chat di sidebar HRD = `chat_menunggu`.

---

### Test Mark Read (setelah klik notif)

```bash
# Tandai satu notif sudah dibaca
curl -X PATCH http://localhost:8080/api/notifikasi/UUID_NOTIF/read \
  -H "Authorization: Bearer TOKEN"

# Tandai semua sudah dibaca
curl -X PATCH http://localhost:8080/api/notifikasi/read-all \
  -H "Authorization: Bearer TOKEN"
```

Setelah mark-read, backend otomatis push `badge_update` via WebSocket ke user tersebut agar badge langsung berkurang tanpa perlu refresh.

---

## 8. Referensi: Alur Notifikasi

```
BACKEND                              FRONTEND (Vue)
───────                              ──────────────

1. EVENT TERJADI
   (pengajuan baru, pesan chat, dll)
         │
         ▼
2. service.Kirim() / KirimKeUser()
   ├─ Simpan ke tabel `notifikasi`  ←── Tersimpan permanen di DB
   └─ Push via WebSocket             ──► onmessage: type="notifikasi"
                                         │
                                         ├─ Tampilkan Toast (pop-up)
                                         ├─ Increment badge count
                                         └─ Klik Toast → router.push(payload.route)

3. USER OFFLINE (web tertutup)
   Tidak ada koneksi WS             ←── Notif tetap di DB (is_read = false)

4. USER BUKA WEB LAGI
   Frontend call GET /notifikasi/badge
         │
         ▼
   Response: { total_unread: 3, chat_menunggu: 1 }
         │
         └─► Tampilkan badge di lonceng navbar
             (angka merah)

5. USER KLIK LONCENG
   Frontend call GET /notifikasi
         │
         ▼
   Tampilkan dropdown list notif
   Klik notif → router.push(notif.route)
             → PATCH /notifikasi/:id/read
             → WS push badge_update (badge berkurang)
```

---

### Format Event WebSocket Lengkap

**`type: "connected"` — saat pertama connect:**
```json
{
  "type": "connected",
  "payload": {
    "user_id": "uuid",
    "role": "peserta|hrd|admin",
    "message": "Koneksi WebSocket berhasil"
  }
}
```

**`type: "notifikasi"` — ada notif baru:**
```json
{
  "type": "notifikasi",
  "payload": {
    "id": "uuid-notif",
    "judul": "Pengajuan Magang Diterima! 🎉",
    "pesan": "Selamat! Permohonan magang Anda telah diterima",
    "tipe": "pelaksanaan",
    "referensi_id": "uuid-pelaksanaan",
    "route": "/dashboard/pelaksanaan",
    "badge_count": 3,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**`type: "badge_update"` — badge perlu diupdate:**
```json
{
  "type": "badge_update",
  "payload": {
    "total_unread": 2,
    "chat_menunggu": 1
  }
}
```

---

### Tabel Route per Tipe Notifikasi

| Tipe | Role Penerima | Route Navigasi |
|------|--------------|----------------|
| `pengajuan` | Peserta | `/dashboard/pengajuan/{id}` |
| `pengajuan` | HRD/Admin | `/hrd/pengajuan/{id}` |
| `pelaksanaan` | Peserta | `/dashboard/pelaksanaan` |
| `absensi` | Peserta | `/dashboard/absensi` |
| `nilai` | Peserta | `/dashboard/pelaksanaan` |
| `sertifikat` | Peserta | `/dashboard/sertifikat` |
| `chat` | Semua | `/dashboard/chat/{tiket_id}` atau `/hrd/chat/{tiket_id}` |
| `sistem` | Semua | `/dashboard` |

---

## 9. Troubleshooting

### ❌ `dial tcp [::1]:5432: connect: connection refused`
PostgreSQL tidak berjalan.

```bash
# Linux
sudo systemctl start postgresql

# macOS (Homebrew)
brew services start postgresql@15

# Windows — buka Services (Win+R → services.msc) → cari PostgreSQL → Start
```

---

### ❌ `pq: password authentication failed for user "postgres"`
Password di `.env` salah.

```bash
# Reset password postgres
sudo -u postgres psql
ALTER USER postgres PASSWORD 'password_baru';
\q

# Update DATABASE_URL di .env
DATABASE_URL=postgres://postgres:password_baru@localhost:5432/emagang_telpp?sslmode=disable
```

---

### ❌ `go: module github.com/telpp/emagang: not found` atau dependency error
```bash
go clean -modcache
go mod tidy
```

---

### ❌ `bind: address already in use` (port 8080 sudah dipakai)
```bash
# Cek proses di port 8080
# Linux/macOS:
lsof -i :8080
kill -9 PID_YANG_MUNCUL

# Windows:
netstat -ano | findstr :8080
taskkill /PID NOMOR_PID /F

# Atau ganti port di .env:
PORT=9090
```

---

### ❌ `JWT_SECRET wajib diisi`
File `.env` belum dibuat atau kosong.
```bash
cp .env.example .env
# Edit .env dan isi JWT_SECRET
```

---

### ❌ WebSocket error: `WebSocket is closed before the connection is established`
Token JWT tidak valid atau sudah expired. Login ulang dan ambil token baru.

---

### ❌ `relation "users" does not exist`
Migration belum dijalankan.
```bash
psql -U postgres -d emagang_telpp -f migrations/001_init.sql
```

---

### Cek Log Server
Semua request dan koneksi WS di-log ke terminal tempat kamu jalankan `go run`:
```
[GIN] 2024/01/15 - 10:30:00 | 200 | POST /api/auth/login
🔗 WS terhubung: user=abc-123 role=admin (online: 1)
🔌 WS terputus: user=abc-123 (online: 0)
```

---

## Default Accounts (dari Seed)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@telpp.co.id | `Admin@123!` |
| **HRD** | hrd@telpp.co.id | `Admin@123!` |

> ⚠️ **WAJIB GANTI PASSWORD** setelah pertama kali login!

```bash
curl -X POST http://localhost:8080/api/auth/change-password \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"old_password":"Admin@123!","new_password":"PasswordBaru@2024!"}'
```

---

## Build Binary untuk Production

```bash
# Build
go build -o emagang-api ./cmd/server/main.go

# Jalankan
APP_ENV=production ./emagang-api

# Windows:
go build -o emagang-api.exe ./cmd/server/main.go
emagang-api.exe
```
