package service

import (
        "bytes"
        "encoding/json"
        "fmt"
        "net/http"
        "os"
)

type EmailService struct{}

func NewEmailService() *EmailService {
        return &EmailService{}
}

type resendEmailRequest struct {
        From    string   `json:"from"`
        To      []string `json:"to"`
        Subject string   `json:"subject"`
        Html    string   `json:"html"`
}

func (s *EmailService) kirimViaResend(to, subject, html string) error {
        apiKey := os.Getenv("RESEND_API_KEY")
        if apiKey == "" {
                return fmt.Errorf("RESEND_API_KEY tidak dikonfigurasi")
        }

        from := os.Getenv("RESEND_FROM_EMAIL")
        if from == "" {
                from = "e-Magang TELPP <onboarding@resend.dev>"
        }

        payload := resendEmailRequest{
                From:    from,
                To:      []string{to},
                Subject: subject,
                Html:    html,
        }

        body, _ := json.Marshal(payload)
        req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(body))
        if err != nil {
                return fmt.Errorf("gagal membuat request: %w", err)
        }
        req.Header.Set("Authorization", "Bearer "+apiKey)
        req.Header.Set("Content-Type", "application/json")

        resp, err := http.DefaultClient.Do(req)
        if err != nil {
                return fmt.Errorf("gagal mengirim email: %w", err)
        }
        defer resp.Body.Close()

        if resp.StatusCode >= 300 {
                return fmt.Errorf("Resend API error: status %d", resp.StatusCode)
        }
        return nil
}

func frontendURL() string {
        u := os.Getenv("FRONTEND_URL")
        if u == "" {
                u = "http://localhost:5000"
        }
        return u
}

// KirimKredensial — email diterima + kredensial login (password bisa kosong jika akun sudah ada)
func (s *EmailService) KirimKredensial(toEmail, namaLengkap, password string) error {
        loginURL := frontendURL() + "/login"

        var passwordSection string
        if password != "" {
                passwordSection = fmt.Sprintf(`
      <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <div style="margin-bottom:14px;">
          <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Email Login</div>
          <div style="font-size:15px;font-weight:700;color:#0d2818;">%s</div>
        </div>
        <div>
          <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Password Sementara</div>
          <div style="font-size:20px;font-weight:800;color:#48AF4A;letter-spacing:0.12em;font-family:monospace;">%s</div>
        </div>
      </div>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
        <p style="font-size:12px;color:#78350f;margin:0;line-height:1.6;">
          ⚠️ <strong>Penting:</strong> Segera ganti password Anda setelah login pertama melalui menu Pengaturan Akun.
        </p>
      </div>`, toEmail, password)
        } else {
                passwordSection = fmt.Sprintf(`
      <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <div style="margin-bottom:8px;">
          <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Email Login</div>
          <div style="font-size:15px;font-weight:700;color:#0d2818;">%s</div>
        </div>
        <div style="font-size:12.5px;color:#6b7280;">Gunakan password akun Anda yang sudah ada.</div>
      </div>`, toEmail)
        }

        html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0d2818 0%%,#1a5c20 100%%);padding:32px 40px;text-align:center;">
      <h1 style="color:#fff;font-size:22px;margin:0 0 6px;font-weight:800;">e-Magang PT TELPP</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">PT TanjungEnim Lestari Pulp and Paper</p>
    </div>
    <div style="padding:36px 40px;">
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px 18px;margin-bottom:20px;text-align:center;">
        <span style="font-size:13px;font-weight:700;color:#16a34a;">🎉 Pengajuan Magang Diterima!</span>
      </div>
      <p style="font-size:15px;color:#0d2818;font-weight:700;margin:0 0 8px;">Selamat, %s!</p>
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0 0 24px;">
        Permohonan magang Anda di <strong>PT TanjungEnim Lestari Pulp and Paper</strong> telah <strong style="color:#16a34a;">diterima</strong>.
        Gunakan akun berikut untuk masuk ke dashboard e-Magang:
      </p>
      %s
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
        <p style="font-size:12px;color:#1e40af;margin:0;line-height:1.6;">
          📄 Surat balasan magang dapat diunduh melalui menu <strong>Pengajuan Saya</strong> setelah login.
        </p>
      </div>
      <a href="%s" style="display:block;text-align:center;background:#48AF4A;color:#fff;text-decoration:none;border-radius:10px;padding:14px 24px;font-size:14px;font-weight:700;">
        Login ke Dashboard e-Magang →
      </a>
    </div>
    <div style="padding:16px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">© 2025 e-Magang PT TELPP · Muara Enim, Sumatera Selatan</p>
    </div>
  </div>
</body>
</html>`, namaLengkap, passwordSection, loginURL)

        return s.kirimViaResend(toEmail, "Akun e-Magang PT TELPP Anda Sudah Siap", html)
}

// KirimDitolak — email pemberitahuan penolakan
func (s *EmailService) KirimDitolak(toEmail, namaLengkap, catatan string) error {
        var catatanSection string
        if catatan != "" {
                catatanSection = fmt.Sprintf(`
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;color:#9a3412;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Catatan dari Tim HRD</div>
        <p style="font-size:13px;color:#7c2d12;margin:0;line-height:1.6;">%s</p>
      </div>`, catatan)
        }

        html := fmt.Sprintf(`<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0d2818 0%%,#1a5c20 100%%);padding:32px 40px;text-align:center;">
      <h1 style="color:#fff;font-size:22px;margin:0 0 6px;font-weight:800;">e-Magang PT TELPP</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">PT TanjungEnim Lestari Pulp and Paper</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="font-size:15px;color:#0d2818;font-weight:700;margin:0 0 8px;">Halo, %s</p>
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0 0 20px;">
        Terima kasih atas minat Anda bergabung dalam program magang di PT TanjungEnim Lestari Pulp and Paper.
        Setelah melalui proses seleksi, kami menyampaikan bahwa pengajuan magang Anda <strong style="color:#dc2626;">belum dapat kami terima</strong> pada periode ini.
      </p>
      %s
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
        <p style="font-size:12px;color:#1e40af;margin:0;line-height:1.6;">
          📄 Surat balasan resmi dapat diunduh melalui tautan yang telah dikirimkan terpisah, atau hubungi tim HRD kami untuk informasi lebih lanjut.
        </p>
      </div>
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">
        Kami mengundang Anda untuk mencoba kembali pada periode pendaftaran berikutnya. Semoga sukses!
      </p>
    </div>
    <div style="padding:16px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">© 2025 e-Magang PT TELPP · Muara Enim, Sumatera Selatan</p>
    </div>
  </div>
</body>
</html>`, namaLengkap, catatanSection)

        return s.kirimViaResend(toEmail, "Informasi Hasil Seleksi Magang PT TELPP", html)
}
