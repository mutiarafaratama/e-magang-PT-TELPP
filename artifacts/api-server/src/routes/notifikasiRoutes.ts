import { Router } from "express";
import pool from "../lib/db.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Response } from "express";

const router = Router();

router.get("/notifikasi/badge", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const r = await pool.query(
      "SELECT COUNT(*) FROM notifikasi WHERE user_id=$1 AND is_read=false",
      [req.user!.user_id]
    );
    res.json({ data: { total_unread: parseInt(r.rows[0].count, 10) } });
  } catch {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.get("/notifikasi", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const r = await pool.query(
      `SELECT id, judul, pesan, tipe, referensi_id, is_read, created_at
       FROM notifikasi WHERE user_id=$1 ORDER BY created_at DESC LIMIT 30`,
      [req.user!.user_id]
    );
    res.json({ data: r.rows });
  } catch {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.patch("/notifikasi/read-all", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      "UPDATE notifikasi SET is_read=true WHERE user_id=$1 AND is_read=false",
      [req.user!.user_id]
    );
    res.json({ message: "Semua notifikasi ditandai sudah dibaca" });
  } catch {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.patch("/notifikasi/:id/read", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      "UPDATE notifikasi SET is_read=true WHERE id=$1 AND user_id=$2",
      [req.params.id, req.user!.user_id]
    );
    res.json({ message: "Notifikasi ditandai sudah dibaca" });
  } catch {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

export default router;
