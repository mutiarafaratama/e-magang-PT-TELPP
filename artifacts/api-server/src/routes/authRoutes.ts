import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../lib/db.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth, AuthRequest } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/auth/register", async (req: Request, res: Response): Promise<void> => {
  const { nama_lengkap, email, password } = req.body;
  if (!nama_lengkap || !email || !password) {
    res.status(400).json({ error: "validation_error", message: "nama_lengkap, email, dan password wajib diisi" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "validation_error", message: "Password minimal 8 karakter" });
    return;
  }
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "email_exists", message: "Email sudah terdaftar" });
      return;
    }
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (nama_lengkap, email, password_hash, role) VALUES ($1, $2, $3, 'peserta') RETURNING id, nama_lengkap, email, role",
      [nama_lengkap, email, hash]
    );
    res.status(201).json({ message: "Akun berhasil dibuat", data: result.rows[0] });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.post("/auth/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "validation_error", message: "Email dan password wajib diisi" });
    return;
  }
  try {
    const result = await pool.query(
      "SELECT id, nama_lengkap, email, password_hash, role, is_active FROM users WHERE email = $1",
      [email]
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "invalid_credentials", message: "Email atau password salah" });
      return;
    }
    const user = result.rows[0];
    if (!user.is_active) {
      res.status(403).json({ error: "account_inactive", message: "Akun dinonaktifkan. Hubungi admin." });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "invalid_credentials", message: "Email atau password salah" });
      return;
    }
    const token = signToken({ user_id: user.id, email: user.email, role: user.role });
    res.json({
      message: "Login berhasil",
      data: {
        access_token: token,
        user: { id: user.id, nama_lengkap: user.nama_lengkap, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      "SELECT id, nama_lengkap, email, role, created_at FROM users WHERE id = $1",
      [req.user!.user_id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "not_found", message: "User tidak ditemukan" });
      return;
    }
    res.json({ data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

export default router;
