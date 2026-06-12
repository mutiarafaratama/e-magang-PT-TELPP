package service

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type EmailService struct{}

func NewEmailService() *EmailService {
	return &EmailService{}
}

type resendAttachment struct {
	Filename string `json:"filename"`
	Content  string `json:"content"`
}

type resendEmailRequest struct {
	From        string             `json:"from"`
	To          []string           `json:"to"`
	Subject     string             `json:"subject"`
	Html        string             `json:"html"`
	Attachments []resendAttachment `json:"attachments,omitempty"`
}

func (s *EmailService) kirimViaResend(to, subject, html string, attachments []resendAttachment) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("RESEND_API_KEY tidak dikonfigurasi")
	}

	from := os.Getenv("RESEND_FROM_EMAIL")
	if from == "" {
		from = "e-Magang TELPP <onboarding@resend.dev>"
	}

	payload := resendEmailRequest{
		From:        from,
		To:          []string{to},
		Subject:     subject,
		Html:        html,
		Attachments: attachments,
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

// buatLampiranSuratBalasan — baca file PDF dari disk dan encode ke base64 untuk dilampirkan
func buatLampiranSuratBalasan(pathFile string) []resendAttachment {
	if pathFile == "" {
		return nil
	}
	data, err := os.ReadFile(pathFile)
	if err != nil {
		return nil
	}
	return []resendAttachment{
		{
			Filename: "Surat_Balasan_Magang_TELPP.pdf",
			Content:  base64.StdEncoding.EncodeToString(data),
		},
	}
}

// KirimKredensial — email pemberitahuan diterima beserta kredensial login dan surat balasan
func (s *EmailService) KirimKredensial(toEmail, namaLengkap, password, suratBalasanPath string) error {
	loginURL := frontendURL() + "/login"

	var passwordSection string
	if password != "" {
		passwordSection = fmt.Sprintf(`
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;">
          <div style="margin-bottom:14px;">
            <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Email Login</div>
            <div style="font-size:15px;font-weight:700;color:#0d2818;">%s</div>
          </div>
          <div>
            <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Password Sementara</div>
            <div style="font-size:20px;font-weight:800;color:#48AF4A;letter-spacing:0.12em;font-family:monospace;">%s</div>
          </div>
        </td></tr>
      </table>
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;margin-bottom:28px;">
        <tr><td style="padding:14px 18px;">
          <p style="font-size:12px;color:#78350f;margin:0;line-height:1.6;">
            <strong>Penting:</strong> Segera ganti password Anda setelah login pertama melalui menu Pengaturan Akun.
          </p>
        </td></tr>
      </table>`, toEmail, password)
	} else {
		passwordSection = fmt.Sprintf(`
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:12px;margin-bottom:24px;">
        <tr><td style="padding:20px 24px;">
          <div style="margin-bottom:8px;">
            <div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Email Login</div>
            <div style="font-size:15px;font-weight:700;color:#0d2818;">%s</div>
          </div>
          <div style="font-size:12.5px;color:#6b7280;">Gunakan password akun Anda yang sudah ada.</div>
        </td></tr>
      </table>`, toEmail)
	}

	suratBalasanKet := ""
	if suratBalasanPath != "" {
		suratBalasanKet = `
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:28px;">
        <tr><td style="padding:14px 18px;">
          <p style="font-size:12px;color:#1e40af;margin:0;line-height:1.6;">
            Surat balasan resmi magang terlampir pada email ini.
          </p>
        </td></tr>
      </table>`
	} else {
		suratBalasanKet = `
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:28px;">
        <tr><td style="padding:14px 18px;">
          <p style="font-size:12px;color:#1e40af;margin:0;line-height:1.6;">
            Surat balasan resmi magang dapat diunduh melalui menu <strong>Pengajuan Saya</strong> setelah login ke dashboard.
          </p>
        </td></tr>
      </table>`
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
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin-bottom:20px;">
        <tr><td style="padding:12px 18px;text-align:center;">
          <span style="font-size:13px;font-weight:700;color:#16a34a;">Pengajuan Magang Diterima</span>
        </td></tr>
      </table>
      <p style="font-size:15px;color:#0d2818;font-weight:700;margin:0 0 8px;">Yth. %s,</p>
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0 0 24px;">
        Permohonan magang Anda di <strong>PT TanjungEnim Lestari Pulp and Paper</strong> telah <strong style="color:#16a34a;">diterima</strong>.
        Gunakan akun berikut untuk masuk ke dashboard e-Magang:
      </p>
      %s
      %s
      <a href="%s" style="display:block;text-align:center;background:#48AF4A;color:#fff;text-decoration:none;border-radius:10px;padding:14px 24px;font-size:14px;font-weight:700;">
        Login ke Dashboard e-Magang
      </a>
    </div>
    <div style="padding:16px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">Hormat kami, Tim HRD PT TanjungEnim Lestari Pulp and Paper</p>
    </div>
  </div>
</body>
</html>`, namaLengkap, passwordSection, suratBalasanKet, loginURL)

	return s.kirimViaResend(toEmail, "Akun e-Magang PT TELPP Anda Sudah Siap", html, buatLampiranSuratBalasan(suratBalasanPath))
}

// KirimDitolak — email pemberitahuan penolakan beserta surat balasan
func (s *EmailService) KirimDitolak(toEmail, namaLengkap, catatan, suratBalasanPath string) error {
	var catatanSection string
	if catatan != "" {
		catatanSection = fmt.Sprintf(`
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;margin-bottom:24px;">
        <tr><td style="padding:14px 18px;">
          <div style="font-size:11px;font-weight:700;color:#9a3412;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Catatan dari Tim HRD</div>
          <p style="font-size:13px;color:#7c2d12;margin:0;line-height:1.6;">%s</p>
        </td></tr>
      </table>`, catatan)
	}

	suratBalasanKet := ""
	if suratBalasanPath != "" {
		suratBalasanKet = `
      <table width="100%%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin-bottom:24px;">
        <tr><td style="padding:14px 18px;">
          <p style="font-size:12px;color:#1e40af;margin:0;line-height:1.6;">
            Surat balasan resmi terlampir pada email ini.
          </p>
        </td></tr>
      </table>`
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
      <p style="font-size:15px;color:#0d2818;font-weight:700;margin:0 0 8px;">Yth. %s,</p>
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0 0 20px;">
        Terima kasih atas minat Anda bergabung dalam program magang di PT TanjungEnim Lestari Pulp and Paper.
        Setelah melalui proses seleksi, kami menyampaikan bahwa pengajuan magang Anda <strong style="color:#dc2626;">belum dapat kami terima</strong> pada periode ini.
      </p>
      %s
      %s
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">
        Kami mengundang Anda untuk kembali mendaftar pada periode pendaftaran berikutnya. Terima kasih atas perhatian Anda.
      </p>
    </div>
    <div style="padding:16px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">Hormat kami, Tim HRD PT TanjungEnim Lestari Pulp and Paper</p>
    </div>
  </div>
</body>
</html>`, namaLengkap, catatanSection, suratBalasanKet)

	return s.kirimViaResend(toEmail, "Informasi Hasil Seleksi Magang PT TELPP", html, buatLampiranSuratBalasan(suratBalasanPath))
}
