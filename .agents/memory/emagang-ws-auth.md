---
name: WebSocket Auth Pattern
description: Bagaimana auth JWT ditangani di endpoint WebSocket e-Magang
---

## Rule
Endpoint `/api/ws` adalah **public route** (tidak pakai middleware.AuthRequired).
Auth ditangani di dalam `ServeWS()` handler sendiri, dengan membaca token dari:
1. Query param: `?token=<jwt>` — ini yang dipakai browser
2. Header: `Authorization: Bearer <jwt>` — fallback untuk non-browser client

## Why
Browser JavaScript WebSocket API (`new WebSocket(url)`) tidak mengizinkan setting custom header saat melakukan HTTP Upgrade. Satu-satunya cara mengirim token adalah via URL query param.

## How to apply
- `ServeWS` di `internal/websocket/hub.go` menangani auth sendiri via `middleware.ParseToken()`
- Frontend Vue: `new WebSocket(\`ws://localhost:8080/api/ws?token=${accessToken}\`)`
- Jika token kosong/invalid → handler return 401 JSON sebelum upgrade
- Setelah connect berhasil → server kirim event `type: "connected"` dengan konfirmasi
