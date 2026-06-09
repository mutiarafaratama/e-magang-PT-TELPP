import { Router, Request, Response } from "express";
import pool from "../lib/db.js";
import { requireAuth, requireRole, AuthRequest } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/landing/content", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query("SELECT kunci, nilai FROM landing_content");
    const map: Record<string, string> = {};
    for (const row of result.rows) {
      if (row.nilai !== null) map[row.kunci] = row.nilai;
    }
    res.json({ data: map });
  } catch (err) {
    console.error("Landing content error:", err);
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.put(
  "/landing/content",
  requireAuth,
  requireRole("admin", "hrd"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { kunci, nilai, tipe } = req.body;
    if (!kunci) {
      res.status(400).json({ error: "validation_error", message: "kunci wajib diisi" });
      return;
    }
    try {
      await pool.query(
        `INSERT INTO landing_content (kunci, nilai, tipe, updated_by, updated_at)
         VALUES ($1, $2, $3, $4::uuid, NOW())
         ON CONFLICT (kunci) DO UPDATE SET nilai = $2, tipe = $3, updated_by = $4::uuid, updated_at = NOW()`,
        [kunci, nilai ?? "", tipe || "text", req.user!.user_id]
      );
      res.json({ message: "Konten berhasil diperbarui" });
    } catch (err) {
      console.error("Update landing content error:", err);
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

router.get("/landing/faq", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT id, pertanyaan, jawaban, urutan, is_active FROM faq WHERE is_active = true ORDER BY urutan ASC"
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.get(
  "/landing/faq/all",
  requireAuth,
  requireRole("admin", "hrd"),
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        "SELECT id, pertanyaan, jawaban, urutan, is_active FROM faq ORDER BY urutan ASC"
      );
      res.json({ data: result.rows });
    } catch (err) {
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

router.post(
  "/landing/faq",
  requireAuth,
  requireRole("admin", "hrd"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { pertanyaan, jawaban, urutan, is_active } = req.body;
    if (!pertanyaan || !jawaban) {
      res.status(400).json({ error: "validation_error", message: "pertanyaan dan jawaban wajib diisi" });
      return;
    }
    try {
      const result = await pool.query(
        "INSERT INTO faq (pertanyaan, jawaban, urutan, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
        [pertanyaan, jawaban, urutan ?? 0, is_active !== false]
      );
      res.status(201).json({ message: "FAQ berhasil ditambahkan", data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

router.delete(
  "/landing/faq/:id",
  requireAuth,
  requireRole("admin", "hrd"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM faq WHERE id = $1", [id]);
      res.json({ message: "FAQ berhasil dihapus" });
    } catch (err) {
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

router.get("/landing/periode", async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT * FROM periode_magang WHERE is_aktif = true ORDER BY tanggal_mulai ASC"
    );
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

export default router;
