import { Router, Response } from "express";
import pool from "../lib/db.js";
import { requireAuth, requireRole, AuthRequest } from "../middlewares/authMiddleware.js";

const router = Router();

// GET /api/divisi — semua user login, hanya divisi aktif (untuk dropdown HRD/peserta)
router.get(
  "/divisi",
  requireAuth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        `SELECT id, nama, is_active, urutan, created_at
         FROM divisi WHERE is_active = TRUE ORDER BY urutan ASC, nama ASC`
      );
      res.json({ data: result.rows });
    } catch (err) {
      console.error("GET /divisi:", err);
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

// GET /api/admin/divisi — admin only, semua divisi termasuk nonaktif
router.get(
  "/admin/divisi",
  requireAuth,
  requireRole("admin"),
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await pool.query(
        `SELECT id, nama, is_active, urutan, created_at
         FROM divisi ORDER BY urutan ASC, nama ASC`
      );
      res.json({ data: result.rows });
    } catch (err) {
      console.error("GET /admin/divisi:", err);
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

// POST /api/admin/divisi — tambah divisi baru
router.post(
  "/admin/divisi",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { nama, urutan } = req.body;
    if (!nama || !nama.trim()) {
      res.status(400).json({ error: "validation_error", message: "Nama divisi wajib diisi" });
      return;
    }
    try {
      const result = await pool.query(
        `INSERT INTO divisi (id, nama, is_active, urutan, created_at)
         VALUES (gen_random_uuid(), $1, TRUE, $2, NOW())
         RETURNING id, nama, is_active, urutan, created_at`,
        [nama.trim(), urutan ?? 0]
      );
      res.status(201).json({ message: "Divisi berhasil ditambahkan", data: result.rows[0] });
    } catch (err: any) {
      if (err.code === "23505") {
        res.status(400).json({ error: "duplicate", message: "Nama divisi sudah ada" });
      } else {
        console.error("POST /admin/divisi:", err);
        res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
      }
    }
  }
);

// PATCH /api/admin/divisi/:id — ubah nama dan urutan
router.patch(
  "/admin/divisi/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nama, urutan } = req.body;
    if (!nama || !nama.trim()) {
      res.status(400).json({ error: "validation_error", message: "Nama divisi wajib diisi" });
      return;
    }
    try {
      await pool.query(
        `UPDATE divisi SET nama=$1, urutan=$2 WHERE id=$3`,
        [nama.trim(), urutan ?? 0, id]
      );
      res.json({ message: "Divisi berhasil diperbarui" });
    } catch (err: any) {
      if (err.code === "23505") {
        res.status(400).json({ error: "duplicate", message: "Nama divisi sudah ada" });
      } else {
        console.error("PATCH /admin/divisi/:id:", err);
        res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
      }
    }
  }
);

// PATCH /api/admin/divisi/:id/toggle — aktifkan/nonaktifkan
router.patch(
  "/admin/divisi/:id/toggle",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const { is_active } = req.body;
    try {
      await pool.query(`UPDATE divisi SET is_active=$1 WHERE id=$2`, [!!is_active, id]);
      const status = is_active ? "diaktifkan" : "dinonaktifkan";
      res.json({ message: `Divisi berhasil ${status}` });
    } catch (err) {
      console.error("PATCH /admin/divisi/:id/toggle:", err);
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

// DELETE /api/admin/divisi/:id — hapus divisi
router.delete(
  "/admin/divisi/:id",
  requireAuth,
  requireRole("admin"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await pool.query(`DELETE FROM divisi WHERE id=$1`, [id]);
      res.json({ message: "Divisi berhasil dihapus" });
    } catch (err) {
      console.error("DELETE /admin/divisi/:id:", err);
      res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
    }
  }
);

export default router;
