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

func (s *EmailService) KirimKredensial(toEmail, namaLengkap, password string) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	if apiKey == "" {
		return fmt.Errorf("RESEND_API_KEY tidak dikonfigurasi")
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5000"
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
      <p style="font-size:15px;color:#0d2818;font-weight:700;margin:0 0 8px;">Halo, %s!</p>
      <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0 0 24px;">
        Pengajuan magang Anda telah <strong style="color:#16a34a;">diterima</strong> oleh tim HRD.
        Berikut adalah kredensial akun e-Magang Anda untuk mulai mengakses sistem:
      </p>
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
      </div>
      <a href="%s/login" style="display:block;text-align:center;background:#48AF4A;color:#fff;text-decoration:none;border-radius:10px;padding:14px 24px;font-size:14px;font-weight:700;">
        Login ke Dashboard e-Magang →
      </a>
    </div>
    <div style="padding:16px 40px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
      <p style="font-size:11px;color:#9ca3af;margin:0;">© 2025 e-Magang PT TELPP · Muara Enim, Sumatera Selatan</p>
    </div>
  </div>
</body>
</html>`, namaLengkap, toEmail, password, frontendURL)

	payload := resendEmailRequest{
		From:    "e-Magang TELPP <onboarding@resend.dev>",
		To:      []string{toEmail},
		Subject: "Akun e-Magang TELPP Anda Telah Dibuat",
		Html:    html,
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("gagal membuat request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("gagal mengirim email: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 300 {
		return fmt.Errorf("Resend API error: status %d", resp.StatusCode)
	}

	return nil
}
