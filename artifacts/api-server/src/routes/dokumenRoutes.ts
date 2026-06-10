import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pool from "../lib/db.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Response } from "express";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const VALID_JENIS = ["proposal_magang", "ktp", "ktm", "pasfoto", "bpjs_kis", "surat_balasan", "laporan_magang", "sertifikat"];

const router = Router();

// POST /api/dokumen/upload — upload satu file dokumen
router.post(
  "/dokumen/upload",
  requireAuth,
  upload.single("file"),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "File tidak ditemukan di request" });
        return;
      }

      const userId = req.user!.user_id;
      const { jenis, pengajuan_id } = req.body;

      if (!jenis || !VALID_JENIS.includes(jenis)) {
        fs.unlinkSync(req.file.path);
        res.status(400).json({ message: `jenis tidak valid. Pilihan: ${VALID_JENIS.join(", ")}` });
        return;
      }

      if (pengajuan_id) {
        const check = await pool.query(
          "SELECT id FROM pengajuan_magang WHERE id = $1 AND user_id = $2",
          [pengajuan_id, userId]
        );
        if (check.rows.length === 0) {
          fs.unlinkSync(req.file.path);
          res.status(403).json({ message: "Pengajuan tidak ditemukan atau bukan milik Anda" });
          return;
        }
      }

      const relativePath = path.relative(process.cwd(), req.file.path);

      const result = await pool.query(
        `INSERT INTO dokumen (pengajuan_id, user_id, jenis, nama_file, path_file, ukuran_bytes, mime_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, jenis, nama_file, uploaded_at`,
        [
          pengajuan_id || null,
          userId,
          jenis,
          req.file.originalname,
          relativePath,
          req.file.size,
          req.file.mimetype,
        ]
      );

      res.status(201).json({ message: "Dokumen berhasil diupload", data: result.rows[0] });
    } catch (err) {
      if (req.file) { try { fs.unlinkSync(req.file.path); } catch {} }
      console.error("POST /api/dokumen/upload error:", err);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }
);

// GET /api/dokumen/pengajuan/:pengajuan_id — list dokumen untuk satu pengajuan (HRD/admin)
router.get("/dokumen/pengajuan/:pengajuan_id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    const userId = req.user!.user_id;
    const { pengajuan_id } = req.params;

    if (role === "peserta") {
      const check = await pool.query(
        "SELECT id FROM pengajuan_magang WHERE id = $1 AND user_id = $2",
        [pengajuan_id, userId]
      );
      if (check.rows.length === 0) {
        res.status(403).json({ message: "Akses tidak diizinkan" });
        return;
      }
    }

    const result = await pool.query(
      `SELECT id, jenis, nama_file, path_file, ukuran_bytes, mime_type, uploaded_at
       FROM dokumen
       WHERE pengajuan_id = $1
       ORDER BY uploaded_at ASC`,
      [pengajuan_id]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("GET /api/dokumen/pengajuan/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
