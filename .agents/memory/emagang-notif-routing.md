---
name: Notification Service Pattern
description: Cara kerja notifikasi backend — method mana yang dipakai dan struktur payload WS
---

## Rule
Selalu pakai `KirimKeUser(ctx, userID, role, judul, pesan, tipe, refID)`.
**Jangan pakai `Kirim()` lama** — sudah tidak ada di codebase.
`KirimKeRole()` hanya untuk broadcast ke seluruh role.

## Why
`KirimKeUser` menerima `role` penerima sehingga bisa memanggil `RouteForRole()` yang menghasilkan path navigasi Vue yang tepat per role. Peserta ke `/dashboard/...`, HRD/Admin ke `/hrd/...`.

## Payload WebSocket (`type: "notifikasi"`)
```json
{
  "id": "uuid",
  "judul": "string",
  "pesan": "string",
  "tipe": "pengajuan|chat|absensi|sertifikat|pelaksanaan|nilai|dokumen|sistem",
  "referensi_id": "uuid|null",
  "route": "/hrd/pengajuan/uuid",  ← langsung pakai untuk router.push()
  "badge_count": 3,               ← total unread setelah notif ini
  "created_at": "RFC3339"
}
```

## Tipe Notif (models.NotifTipe constants)
- `NotifPengajuan`, `NotifDokumen`, `NotifPelaksanaan`, `NotifAbsensi`
- `NotifNilai`, `NotifSertifikat`, `NotifChat`, `NotifSistem`

## How to apply
- Di setiap service yang trigger notif: import `models` dan pakai konstanta `string(models.NotifPengajuan)` dll
- Setelah mark-read: service otomatis push `badge_update` event via WS
- Badge fallback (user buka web kembali): `GET /api/notifikasi/badge` → `{total_unread, chat_menunggu}`
