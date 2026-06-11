import { Router } from "express";
import pool from "../lib/db.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const router = Router();

function generatePassword(): string {
  const letters = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
  let pwd = "Mg";
  for (let i = 0; i < 6; i++) {
    pwd += letters[crypto.randomInt(letters.length)];
  }
  return pwd + "1!";
}

async function sendKredensialEmail(toEmail: string, namaLengkap: string, password: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY tidak dikonfigurasi — email tidak dikirim, password:", password);
    return;
  }

  const actualTo = process.env.RESEND_TEST_TO || toEmail;
  if (actualTo !== toEmail) {
    console.info(`[TEST MODE] Email dialihkan dari ${toEmail} ke ${actualTo}`);
  }

  const frontendUrl =
    process.env.FRONTEND_URL ||
    (process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : "http://localhost:5000");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Akun e-Magang PT TELPP</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

        <!-- Header -->
        <tr>
          <td style="background:#0d2818;padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.5);">PT TanjungEnim Lestari Pulp and Paper</p>
            <h1 style="margin:0;font-size:20px;font-weight:800;color:#ffffff;letter-spacing:0.02em;">e-Magang PT TELPP</h1>
          </td>
        </tr>

        <!-- Subject line -->
        <tr>
          <td style="background:#f8fafc;border-bottom:1px solid #e2e8f0;padding:14px 40px;">
            <p style="margin:0;font-size:12px;color:#64748b;font-weight:500;">Informasi Akun &mdash; Sistem Manajemen Magang</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#0f172a;">Yth. ${namaLengkap},</p>
            <p style="margin:0 0 28px;font-size:13.5px;color:#475569;line-height:1.8;">
              Dengan hormat, kami informasikan bahwa akun e-Magang Anda di PT TanjungEnim Lestari Pulp and Paper
              telah dibuat. Gunakan akun ini untuk <strong style="color:#166534;">memantau status pengajuan magang</strong>
              Anda secara langsung melalui dashboard. Kredensial login Anda:
            </p>

            <!-- Credential box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;margin-bottom:20px;">
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;">
                        <p style="margin:0 0 4px;font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Email Login</p>
                        <p style="margin:0;font-size:14.5px;font-weight:700;color:#0f172a;">${toEmail}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="border-top:1px solid #bbf7d0;padding-top:14px;">
                        <p style="margin:0 0 4px;font-size:10.5px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Password Sementara</p>
                        <p style="margin:0;font-size:22px;font-weight:800;color:#15803d;letter-spacing:0.15em;font-family:'Courier New',Courier,monospace;">${password}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Warning box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;margin-bottom:28px;">
              <tr>
                <td style="padding:12px 18px;">
                  <p style="margin:0;font-size:12.5px;color:#713f12;line-height:1.7;">
                    <strong>Perhatian:</strong> Demi keamanan akun Anda, segera ubah password sementara di atas
                    setelah berhasil masuk ke sistem melalui menu Pengaturan Akun.
                    Jangan bagikan password ini kepada pihak lain.
                  </p>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${frontendUrl}/login"
                     style="display:inline-block;background:#166534;color:#ffffff;text-decoration:none;border-radius:8px;padding:13px 32px;font-size:14px;font-weight:700;letter-spacing:0.02em;">
                    Masuk ke Dashboard e-Magang
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:28px 0 0;font-size:12px;color:#94a3b8;line-height:1.8;text-align:center;">
              Jika Anda merasa menerima email ini secara tidak sengaja atau memiliki pertanyaan,<br>
              silakan hubungi tim HRD PT TELPP melalui saluran resmi perusahaan.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 40px;text-align:center;">
            <p style="margin:0 0 4px;font-size:11px;color:#94a3b8;">e-Magang PT TanjungEnim Lestari Pulp and Paper</p>
            <p style="margin:0;font-size:11px;color:#cbd5e1;">Muara Enim, Sumatera Selatan &nbsp;&middot;&nbsp; &copy; ${new Date().getFullYear()}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "e-Magang TELPP <onboarding@resend.dev>",
      to: [actualTo],
      subject: "Akun e-Magang TELPP Anda Telah Dibuat",
      html,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Resend API error ${resp.status}: ${errText}`);
  }
}

// ── GET /api/pengajuan/saya — pengajuan milik peserta yang login ──────────────
router.get("/pengajuan/saya", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.user_id;
    const result = await pool.query(
      `SELECT id, user_id, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin,
              alamat, no_hp, email, kategori_magang, nomor_induk, asal_institusi,
              jurusan, kelas_semester, status, catatan_hrd, akun_terkirim_at, created_at, updated_at
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

// ── POST /api/pengajuan/publik — form publik tanpa login ──────────────────────
router.post("/pengajuan/publik", async (req: Request, res: Response): Promise<void> => {
  try {
    const { step1, step2 } = req.body;
    if (!step1 || !step2) {
      res.status(400).json({ message: "Data tidak lengkap (step1 dan step2 diperlukan)" });
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

    // Cek pengajuan aktif dengan email yang sama
    const existing = await pool.query(
      `SELECT id FROM pengajuan_magang WHERE email = $1 AND status NOT IN ('ditolak') LIMIT 1`,
      [email]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ message: "Email ini sudah memiliki pengajuan aktif. Silakan hubungi HRD jika ada pertanyaan." });
      return;
    }

    const result = await pool.query(
      `INSERT INTO pengajuan_magang
         (nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
          no_hp, email, kategori_magang, nomor_induk, asal_institusi, jurusan, kelas_semester)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, status, created_at`,
      [nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat,
       no_hp, email, kategori_magang, nomor_induk, asal_institusi, jurusan, kelas_semester]
    );

    res.status(201).json({
      message: "Pengajuan berhasil dikirim! Tim HRD akan menghubungi Anda melalui email setelah berkas diverifikasi.",
      data: result.rows[0],
    });
  } catch (err: any) {
    console.error("POST /api/pengajuan/publik error:", err);
    if (err.code === "22P02") {
      res.status(400).json({ message: "Nilai tidak valid untuk jenis_kelamin atau kategori_magang" });
      return;
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ── GET /api/pengajuan — list semua pengajuan (HRD/admin only) ────────────────
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
              pm.status, pm.catatan_hrd, pm.verified_at, pm.akun_terkirim_at,
              pm.created_at, pm.updated_at,
              u.email AS user_email
       FROM pengajuan_magang pm
       LEFT JOIN users u ON u.id = pm.user_id
       ORDER BY pm.created_at DESC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("GET /api/pengajuan error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ── GET /api/pengajuan/:id — detail satu pengajuan ────────────────────────────
router.get("/pengajuan/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.user_id;
    const role = req.user!.role;

    const result = await pool.query(
      `SELECT pm.id, pm.user_id, pm.nama_lengkap, pm.tempat_lahir, pm.tanggal_lahir,
              pm.jenis_kelamin, pm.alamat, pm.no_hp, pm.email, pm.kategori_magang,
              pm.nomor_induk, pm.asal_institusi, pm.jurusan, pm.kelas_semester,
              pm.status, pm.catatan_hrd, pm.verified_at, pm.akun_terkirim_at,
              pm.created_at, pm.updated_at,
              u.email AS user_email
       FROM pengajuan_magang pm
       LEFT JOIN users u ON u.id = pm.user_id
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

// ── POST /api/pengajuan — buat pengajuan (peserta login) ─────────────────────
router.post("/pengajuan", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.user_id;

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
      res.status(400).json({ message: "Nilai tidak valid untuk enum" });
      return;
    }
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

// ── PATCH /api/pengajuan/:id/status — update status (HRD/admin) ──────────────
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

// ── POST /api/pengajuan/:id/kirim-akun — HRD buat akun & kirim email ─────────
router.post(
  "/pengajuan/:id/kirim-akun",
  requireAuth,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const role = req.user!.role;
      if (!["hrd", "admin"].includes(role)) {
        res.status(403).json({ message: "Akses tidak diizinkan" });
        return;
      }
      const { id } = req.params;

      // Get pengajuan
      const pengResult = await pool.query(
        `SELECT id, nama_lengkap, email, status, akun_terkirim_at
         FROM pengajuan_magang WHERE id = $1`,
        [id]
      );
      if (pengResult.rows.length === 0) {
        res.status(404).json({ message: "Pengajuan tidak ditemukan" });
        return;
      }
      const peng = pengResult.rows[0];

      if (peng.akun_terkirim_at) {
        res.status(409).json({ message: "Akun sudah pernah dikirim untuk pengajuan ini" });
        return;
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1 LIMIT 1",
        [peng.email]
      );

      let userId: string;

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
        // Update pengajuan link user_id + akun_terkirim_at
        await pool.query(
          "UPDATE pengajuan_magang SET user_id = $1, akun_terkirim_at = NOW(), updated_at = NOW() WHERE id = $2",
          [userId, id]
        );
        res.json({ message: "Akun sudah ada, pengajuan berhasil ditautkan ke akun peserta" });
        return;
      }

      // Buat user baru
      const password = generatePassword();
      const hash = await bcrypt.hash(password, 12);

      const userResult = await pool.query(
        `INSERT INTO users (nama_lengkap, email, password_hash, role)
         VALUES ($1, $2, $3, 'peserta')
         RETURNING id`,
        [peng.nama_lengkap, peng.email, hash]
      );
      userId = userResult.rows[0].id;

      // Update pengajuan
      await pool.query(
        "UPDATE pengajuan_magang SET user_id = $1, akun_terkirim_at = NOW(), updated_at = NOW() WHERE id = $2",
        [userId, id]
      );

      // Kirim email (non-fatal jika gagal)
      try {
        await sendKredensialEmail(peng.email, peng.nama_lengkap, password);
      } catch (emailErr) {
        console.error("Gagal kirim email ke", peng.email, emailErr);
      }

      res.json({
        message: `Akun berhasil dibuat dan kredensial telah dikirim ke ${peng.email}`,
      });
    } catch (err) {
      console.error("POST /api/pengajuan/:id/kirim-akun error:", err);
      res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }
);

// ── DELETE /api/pengajuan/:id — hapus pengajuan (HRD/admin only) ──────────────
router.delete("/pengajuan/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    if (!["hrd", "admin"].includes(role)) {
      res.status(403).json({ message: "Akses tidak diizinkan" });
      return;
    }
    const { id } = req.params;

    const existing = await pool.query("SELECT id FROM pengajuan_magang WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ message: "Pengajuan tidak ditemukan" });
      return;
    }

    // Hapus dokumen, status_history, dan pengajuan (cascade sudah handle relasi)
    await pool.query("DELETE FROM pengajuan_magang WHERE id = $1", [id]);

    res.json({ message: "Pengajuan berhasil dihapus" });
  } catch (err) {
    console.error("DELETE /api/pengajuan/:id error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
