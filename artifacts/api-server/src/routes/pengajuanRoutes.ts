import { Router } from "express";
import pool from "../lib/db.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Response } from "express";

const router = Router();

// GET /api/pengajuan/saya — pengajuan milik peserta yang login
router.get("/pengajuan/saya", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.user_id;
    const result = await pool.query(
      `SELECT id, user_id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
              alamat, no_hp, email, kategori_magang, nomor_induk, asal_institusi,
              jurusan, kelas_semester, status, catatan_hrd, created_at, updated_at
       FROM pengajuan_magang
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Belum ada pengajuan" });
      return;
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error("GET /api/pengajuan/saya error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// GET /api/pengajuan — list semua pengajuan (HRD/admin only)
router.get("/pengajuan", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    if (!["hrd", "admin"].includes(role)) {
      res.status(403).json({ message: "Akses tidak diizinkan" });
      return;
    }
    const result = await pool.query(
      `SELECT pm.id, pm.user_id, pm.nama_lengkap, pm.tempat_lahir, pm.tanggal_lahir,
              pm.jenis_kelamin, pm.alamat, pm.no_hp, pm.email, pm.kategori_magang,
              pm.nomor_induk, pm.asal_institusi, pm.jurusan, pm.kelas_semester,
              pm.status, pm.catatan_hrd, pm.verified_at, pm.created_at, pm.updated_at,
              u.email AS user_email
       FROM pengajuan_magang pm
       JOIN users u ON u.id = pm.user_id
       ORDER BY pm.created_at DESC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("GET /api/pengajuan error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// GET /api/pengajuan/:id — detail satu pengajuan
router.get("/pengajuan/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.user_id;
    const role = req.user!.role;

    const result = await pool.query(
      `SELECT pm.id, pm.user_id, pm.nama_lengkap, pm.tempat_lahir, pm.tanggal_lahir,
              pm.jenis_kelamin, pm.alamat, pm.no_hp, pm.email, pm.kategori_magang,
              pm.nomor_induk, pm.asal_institusi, pm.jurusan, pm.kelas_semester,
              pm.status, pm.catatan_hrd, pm.verified_at, pm.created_at, pm.updated_at,
              u.email AS user_email
       FROM pengajuan_magang pm
       JOIN users u ON u.id = pm.user_id
       WHERE pm.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      return;
    }
    const row = result.rows[0];
    if (role === "peserta" && row.user_id !== userId) {
      res.status(403).json({ message: "Akses tidak diizinkan" });
      return;
    }
    res.json({ data: row });
  } catch (err) {
    console.error("GET /api/pengajuan/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// POST /api/pengajuan — buat pengajuan baru
router.post("/pengajuan", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.user_id;

    // Cek apakah sudah punya pengajuan
    const existing = await pool.query(
      "SELECT id FROM pengajuan_magang WHERE user_id = $1 LIMIT 1",
      [userId]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ message: "Anda sudah memiliki pengajuan magang" });
      return;
    }

    const { step1, step2 } = req.body;
    if (!step1 || !step2) {
      res.status(400).json({ message: "Data tidak lengkap" });
      return;
    }

    const { nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, no_hp, email } = step1;
    const { kategori_magang, nomor_induk, asal_institusi, jurusan, kelas_semester } = step2;

    if (!nama_lengkap || !tempat_lahir || !tanggal_lahir || !jenis_kelamin || !alamat || !no_hp || !email) {
      res.status(400).json({ message: "Data diri tidak lengkap" });
      return;
    }
    if (!kategori_magang || !nomor_induk || !asal_institusi || !jurusan || !kelas_semester) {
      res.status(400).json({ message: "Data akademis tidak lengkap" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO pengajuan_magang
         (user_id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
          no_hp, email, kategori_magang, nomor_induk, asal_institusi, jurusan, kelas_semester)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id, status, created_at`,
      [userId, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
       no_hp, email, kategori_magang, nomor_induk, asal_institusi, jurusan, kelas_semester]
    );

    res.status(201).json({ message: "Pengajuan berhasil dibuat", data: result.rows[0] });
  } catch (err: any) {
    console.error("POST /api/pengajuan error:", err);
    if (err.code === "22P02") {
      res.status(400).json({ message: "Nilai tidak valid untuk enum (jenis_kelamin / kategori_magang)" });
      return;
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// PATCH /api/pengajuan/:id/status — update status (HRD/admin only)
router.patch("/pengajuan/:id/status", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    if (!["hrd", "admin"].includes(role)) {
      res.status(403).json({ message: "Akses tidak diizinkan" });
      return;
    }
    const { id } = req.params;
    const { status, catatan } = req.body;

    const validStatus = ["diajukan", "menunggu_verifikasi", "diproses", "diterima", "ditolak"];
    if (!status || !validStatus.includes(status)) {
      res.status(400).json({ message: `Status tidak valid. Pilihan: ${validStatus.join(", ")}` });
      return;
    }

    const existing = await pool.query("SELECT status FROM pengajuan_magang WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      return;
    }

    const oldStatus = existing.rows[0].status;

    await pool.query("BEGIN");
    await pool.query(
      `UPDATE pengajuan_magang
       SET status = $1, catatan_hrd = $2, verified_by = $3, verified_at = NOW(), updated_at = NOW()
       WHERE id = $4`,
      [status, catatan ?? null, req.user!.user_id, id]
    );
    await pool.query(
      `INSERT INTO status_history (pengajuan_id, status_lama, status_baru, changed_by, catatan)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, oldStatus, status, req.user!.user_id, catatan ?? null]
    );
    await pool.query("COMMIT");

    res.json({ message: "Status berhasil diupdate" });
  } catch (err) {
    await pool.query("ROLLBACK").catch(() => {});
    console.error("PATCH /api/pengajuan/:id/status error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
