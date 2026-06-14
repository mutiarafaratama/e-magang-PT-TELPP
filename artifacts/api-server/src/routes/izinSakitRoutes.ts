import { Router } from "express";
import pool from "../lib/db.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Response } from "express";

const router = Router();

// ── PESERTA: Riwayat pengajuan saya ─────────────────────────
// NOTE: /saya harus didaftarkan sebelum /:id agar tidak tertukar
router.get("/izin-sakit/saya", requireAuth, requireRole("peserta"), async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.user_id;
  try {
    const r = await pool.query(
      `SELECT isr.id, isr.tanggal, isr.jenis, isr.alasan, isr.status, isr.catatan_hrd, isr.created_at
       FROM izin_sakit_request isr
       JOIN pelaksanaan_magang pm ON pm.id = isr.pelaksanaan_id
       WHERE pm.user_id = $1
       ORDER BY isr.tanggal DESC`,
      [userId]
    );
    res.json({ success: true, data: r.rows });
  } catch (err: any) {
    console.error("[izin-sakit GET saya]", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// ── PESERTA: Ajukan izin/sakit ────────────────────────────────
router.post("/izin-sakit", requireAuth, requireRole("peserta"), async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user!.user_id;
  const { tanggal, jenis, alasan } = req.body as { tanggal: string; jenis: string; alasan: string };

  if (!tanggal || !jenis || !alasan?.trim()) {
    res.status(400).json({ success: false, message: "Tanggal, jenis, dan alasan wajib diisi" });
    return;
  }
  if (!["izin", "sakit"].includes(jenis)) {
    res.status(400).json({ success: false, message: "Jenis harus 'izin' atau 'sakit'" });
    return;
  }
  if (alasan.trim().length < 5) {
    res.status(400).json({ success: false, message: "Alasan terlalu singkat (min 5 karakter)" });
    return;
  }

  try {
    const pelRow = await pool.query(
      `SELECT id FROM pelaksanaan_magang WHERE user_id = $1 AND status = 'aktif' LIMIT 1`,
      [userId]
    );
    if (pelRow.rowCount === 0) {
      res.status(404).json({ success: false, message: "Tidak ditemukan pelaksanaan magang aktif" });
      return;
    }
    const pelaksanaanId = pelRow.rows[0].id;

    const dup = await pool.query(
      `SELECT id FROM izin_sakit_request WHERE pelaksanaan_id = $1 AND tanggal = $2`,
      [pelaksanaanId, tanggal]
    );
    if ((dup.rowCount ?? 0) > 0) {
      res.status(409).json({ success: false, message: "Sudah ada pengajuan untuk tanggal tersebut" });
      return;
    }

    const r = await pool.query(
      `INSERT INTO izin_sakit_request (pelaksanaan_id, user_id, tanggal, jenis, alasan, status)
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [pelaksanaanId, userId, tanggal, jenis, alasan.trim()]
    );
    res.status(201).json({ success: true, message: "Pengajuan berhasil dikirim", data: r.rows[0] });
  } catch (err: any) {
    console.error("[izin-sakit POST]", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// ── HRD: List semua pengajuan ─────────────────────────────────
router.get("/izin-sakit", requireAuth, requireRole("hrd", "admin"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { status } = req.query as { status?: string };
  try {
    let qry = `
      SELECT
        isr.id, isr.tanggal, isr.jenis, isr.alasan, isr.status, isr.catatan_hrd, isr.created_at,
        u.nama_lengkap AS nama_peserta,
        pm.divisi
      FROM izin_sakit_request isr
      JOIN pelaksanaan_magang pm ON pm.id = isr.pelaksanaan_id
      JOIN users u ON u.id = pm.user_id
    `;
    const params: string[] = [];
    if (status && ["pending", "disetujui", "ditolak"].includes(status)) {
      qry += ` WHERE isr.status = $1`;
      params.push(status);
    }
    qry += ` ORDER BY isr.created_at DESC`;
    const r = await pool.query(qry, params);
    res.json({ success: true, data: r.rows });
  } catch (err: any) {
    console.error("[izin-sakit GET all]", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

// ── HRD: Setujui pengajuan ────────────────────────────────────
router.patch("/izin-sakit/:id/approve", requireAuth, requireRole("hrd", "admin"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const hrdId = req.user!.user_id;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const row = await client.query(
      `SELECT id, pelaksanaan_id, tanggal, jenis, status FROM izin_sakit_request WHERE id = $1 FOR UPDATE`,
      [id]
    );
    if (row.rowCount === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
      return;
    }
    const req_data = row.rows[0];
    if (req_data.status !== "pending") {
      await client.query("ROLLBACK");
      res.status(400).json({ success: false, message: "Pengajuan sudah diproses sebelumnya" });
      return;
    }

    await client.query(
      `UPDATE izin_sakit_request
       SET status = 'disetujui', diproses_oleh = $1, diproses_at = NOW()
       WHERE id = $2`,
      [hrdId, id]
    );

    await client.query(
      `INSERT INTO absensi (pelaksanaan_id, tanggal, keterangan)
       VALUES ($1, $2, $3)
       ON CONFLICT (pelaksanaan_id, tanggal)
       DO UPDATE SET keterangan = EXCLUDED.keterangan`,
      [req_data.pelaksanaan_id, req_data.tanggal, req_data.jenis]
    );

    await client.query("COMMIT");
    res.json({ success: true, message: "Pengajuan disetujui dan absensi telah diperbarui" });
  } catch (err: any) {
    await client.query("ROLLBACK");
    console.error("[izin-sakit APPROVE]", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  } finally {
    client.release();
  }
});

// ── HRD: Tolak pengajuan ──────────────────────────────────────
router.patch("/izin-sakit/:id/tolak", requireAuth, requireRole("hrd", "admin"), async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const hrdId = req.user!.user_id;
  const { catatan_hrd } = req.body as { catatan_hrd?: string };

  try {
    const row = await pool.query(
      `SELECT id, status FROM izin_sakit_request WHERE id = $1`,
      [id]
    );
    if (row.rowCount === 0) {
      res.status(404).json({ success: false, message: "Pengajuan tidak ditemukan" });
      return;
    }
    if (row.rows[0].status !== "pending") {
      res.status(400).json({ success: false, message: "Pengajuan sudah diproses sebelumnya" });
      return;
    }

    await pool.query(
      `UPDATE izin_sakit_request
       SET status = 'ditolak', catatan_hrd = $1, diproses_oleh = $2, diproses_at = NOW()
       WHERE id = $3`,
      [catatan_hrd?.trim() ?? null, hrdId, id]
    );
    res.json({ success: true, message: "Pengajuan ditolak" });
  } catch (err: any) {
    console.error("[izin-sakit TOLAK]", err);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

export default router;
