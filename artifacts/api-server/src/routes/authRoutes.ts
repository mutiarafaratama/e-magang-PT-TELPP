import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../lib/db.js";
import { signToken } from "../lib/jwt.js";
import { requireAuth, AuthRequest } from "../middlewares/authMiddleware.js";

const router = Router();

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
      "SELECT id, nama_lengkap, email, role, is_active, created_at FROM users WHERE id = $1",
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

router.post("/auth/change-password", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { old_password, new_password } = req.body;
  if (!old_password || !new_password) {
    res.status(400).json({ error: "validation_error", message: "old_password dan new_password wajib diisi" });
    return;
  }
  try {
    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [req.user!.user_id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "not_found", message: "User tidak ditemukan" });
      return;
    }
    const valid = await bcrypt.compare(old_password, result.rows[0].password_hash);
    if (!valid) {
      res.status(400).json({ error: "change_password_failed", message: "password lama tidak sesuai" });
      return;
    }
    const special = "!@#$%^&*()_+=.,><?/";
    let hasLetter = false, hasDigit = false, hasSpecial = false;
    for (const c of new_password as string) {
      if (/[a-zA-Z]/.test(c)) hasLetter = true;
      else if (/[0-9]/.test(c)) hasDigit = true;
      else if (special.includes(c)) hasSpecial = true;
    }
    if ((new_password as string).length < 8 || !hasLetter || !hasDigit || !hasSpecial) {
      res.status(400).json({ error: "change_password_failed", message: "password baru harus mengandung huruf, angka, dan karakter spesial (!@#$%^&*()_+=.,><?/)" });
      return;
    }
    const hash = await bcrypt.hash(new_password as string, 12);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, req.user!.user_id]);
    res.json({ message: "Password berhasil diubah" });
  } catch (err) {
    res.status(500).json({ error: "server_error", message: "Terjadi kesalahan server" });
  }
});

export default router;
