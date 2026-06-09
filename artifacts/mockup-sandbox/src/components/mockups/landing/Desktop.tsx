import { useState } from "react";

const PRIMARY = "#006e19";
const PRIMARY_LIGHT = "#e8f5e9";
const ACCENT = "#ffc857";
const DARK = "#0b1c30";

const stats = [
  { num: "500+", label: "Alumni Magang" },
  { num: "30+", label: "Divisi Terbuka" },
  { num: "95%", label: "Kepuasan Peserta" },
  { num: "1–6", label: "Bulan Durasi" },
];

const steps = [
  { n: "01", icon: "🧑‍💻", title: "Buat Akun", desc: "Daftar dengan email aktif institusi atau pribadi." },
  { n: "02", icon: "📋", title: "Isi Formulir", desc: "Lengkapi data diri & akademik dalam 2 langkah mudah." },
  { n: "03", icon: "📂", title: "Upload Berkas", desc: "Unggah dokumen sesuai kategori (SMK / D3-S2 / Penelitian)." },
  { n: "04", icon: "🔍", title: "Verifikasi HRD", desc: "Tim HRD memeriksa kelayakan berkas dalam 3–5 hari kerja." },
  { n: "05", icon: "🎉", title: "Mulai Magang", desc: "Terima surat konfirmasi & mulai perjalanan magang Anda." },
];

const periods = [
  { label: "Periode I", range: "Jan – Mar 2025", status: "tutup", color: "#9e9e9e" },
  { label: "Periode II", range: "Apr – Jun 2025", status: "segera", color: ACCENT },
  { label: "Periode III", range: "Jul – Sep 2025", status: "buka", color: PRIMARY },
  { label: "Periode IV", range: "Okt – Des 2025", status: "akan datang", color: "#90caf9" },
];

const docsKategori = [
  {
    icon: "🎓",
    title: "Mahasiswa D3/S1/S2",
    items: ["Proposal Magang", "Surat Pengantar Kampus", "KTM Aktif", "KTP", "Pasfoto 3×4", "BPJS/KIS"],
  },
  {
    icon: "🔧",
    title: "Siswa SMK (Prakerin)",
    items: ["Surat dari Sekolah", "Kartu Pelajar", "KTP/KK Orang Tua", "Pasfoto 3×4"],
  },
  {
    icon: "🔬",
    title: "Penelitian (S2/S3)",
    items: ["Proposal Penelitian", "Surat Institusi", "CV / Riwayat Hidup", "KTP", "BPJS/KIS"],
  },
];

const k3Items = [
  { icon: "⛑️", label: "Helm & Sepatu Safety" },
  { icon: "👔", label: "Seragam Hitam Putih" },
  { icon: "🕐", label: "Disiplin Waktu" },
  { icon: "📱", label: "Absensi Digital Harian" },
  { icon: "📝", label: "Laporan Berkala" },
  { icon: "🤝", label: "Kerjasama Tim" },
];

const faqs = [
  { q: "Berapa lama proses verifikasi berkas?", a: "Proses verifikasi berkas memakan waktu 3–5 hari kerja setelah semua dokumen lengkap diunggah." },
  { q: "Apakah ada uang saku/kompensasi?", a: "Ketentuan benefit akan disampaikan secara resmi saat proses penerimaan. Silakan tanyakan langsung ke HRD." },
  { q: "Divisi apa saja yang tersedia?", a: "Tersedia 30+ divisi: Produksi, IT, Keuangan, HRD, Lingkungan, Teknik, dan banyak lagi. Penempatan sesuai latar belakang pendidikan." },
  { q: "Bagaimana cara pantau status pengajuan?", a: "Login ke dashboard portal e-Magang, status pengajuan ditampilkan secara real-time dengan riwayat lengkap setiap perubahan." },
  { q: "Apakah bisa mendaftar lebih dari sekali?", a: "Bisa, jika pengajuan sebelumnya sudah ditutup atau ditolak. Satu akun hanya bisa memiliki satu pengajuan aktif." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: `1px solid ${open ? PRIMARY : "#e0e0e0"}`,
        borderRadius: 12,
        background: open ? PRIMARY_LIGHT : "#fff",
        transition: "all 0.2s",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontWeight: 600, color: PRIMARY, fontSize: 15 }}>{q}</span>
        <span style={{ fontSize: 20, color: PRIMARY, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "0 20px 16px", color: "#546e7a", fontSize: 14, lineHeight: 1.6 }}>{a}</div>
      )}
    </div>
  );
}

export function Desktop() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f8f9ff", color: DARK, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248,249,255,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e8eaf6",
        padding: "0 64px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 18, color: PRIMARY }}>
            <span style={{ fontSize: 22 }}>🌿</span>
            e-Magang <span style={{ color: DARK }}>PT TELPP</span>
          </div>
          <div style={{ display: "flex", gap: 32 }}>
            {["Alur", "Jadwal", "Syarat", "FAQ"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ fontSize: 14, fontWeight: 500, color: "#546e7a", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button style={{ fontSize: 14, fontWeight: 600, color: PRIMARY, background: "none", border: "none", cursor: "pointer", padding: "8px 16px" }}>Masuk</button>
            <button style={{
              fontSize: 14, fontWeight: 600, color: "#fff", background: PRIMARY,
              border: "none", borderRadius: 100, padding: "10px 24px", cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,110,25,0.3)",
            }}>Daftar Sekarang</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: 680,
        background: `linear-gradient(135deg, ${DARK} 0%, #1a3a1f 50%, #0d2b10 100%)`,
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "rgba(0,110,25,0.15)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,200,87,0.08)" }} />
        <div style={{ position: "absolute", top: 80, right: 180, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,110,25,0.2)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", width: "100%" }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(117,221,113,0.15)", border: "1px solid rgba(117,221,113,0.3)",
              borderRadius: 100, padding: "6px 14px", marginBottom: 24,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#75dd71", display: "inline-block", boxShadow: "0 0 0 3px rgba(117,221,113,0.3)", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#91fa8b", letterSpacing: 1 }}>Pendaftaran Periode III 2025 Dibuka</span>
            </div>

            <h1 style={{ fontSize: 52, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
              Mulai Karir<br />di <span style={{ color: "#91fa8b" }}>PT TELPP</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Platform resmi pendaftaran magang PT TanjungEnim Lestari Pulp and Paper. Proses transparan dari seleksi hingga sertifikasi dalam satu sistem terintegrasi.
            </p>

            {/* Stats bar */}
            <div style={{ display: "flex", gap: 32, marginBottom: 40 }}>
              {stats.map(s => (
                <div key={s.num}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "#91fa8b" }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <button style={{
                background: PRIMARY, color: "#fff", border: "none", borderRadius: 100,
                padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,110,25,0.4)",
              }}>Daftar Sekarang ✦</button>
              <button style={{
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.25)", borderRadius: 100,
                padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer",
              }}>Panduan Sistem →</button>
            </div>
          </div>

          {/* Right — floating card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "#fff", borderRadius: 24, padding: "32px 36px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
              maxWidth: 360, width: "100%",
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: DARK, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
                5 Langkah Mudah
              </div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 4 ? 16 : 0, opacity: i >= 2 ? (i >= 4 ? 0.35 : 0.6) : 1 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? PRIMARY : i === 1 ? ACCENT : "#f0f0f0",
                    color: i <= 1 ? "#fff" : "#999",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 800, fontSize: 13,
                  }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: DARK }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "#90a4ae" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "10px 16px", background: PRIMARY_LIGHT, borderRadius: 10, fontSize: 12, color: PRIMARY, fontWeight: 600, textAlign: "center" }}>
                📋 Kuota terbatas — Daftar segera!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ALUR PENDAFTARAN ── */}
      <section id="alur" style={{ padding: "80px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Cara Daftar</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: DARK }}>Alur Pendaftaran</h2>
            <p style={{ color: "#78909c", marginTop: 12, fontSize: 16 }}>Ikuti langkah digital kami, pantau status secara real-time.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, position: "relative" }}>
            {/* connector line */}
            <div style={{
              position: "absolute", top: 40, left: "10%", right: "10%", height: 2,
              background: `linear-gradient(to right, ${PRIMARY}, ${ACCENT})`,
              zIndex: 0,
            }} />

            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%", margin: "0 auto 16px",
                  background: i === 0 ? PRIMARY : i === 1 ? ACCENT : "#f5f5f5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28,
                  boxShadow: i < 2 ? "0 8px 24px rgba(0,110,25,0.2)" : "none",
                  border: i < 2 ? "none" : "2px solid #e0e0e0",
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: i < 2 ? PRIMARY : "#bdbdbd",
                  letterSpacing: 1, textTransform: "uppercase", marginBottom: 6,
                }}>LANGKAH {s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: DARK, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#90a4ae", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JADWAL ── */}
      <section id="jadwal" style={{ padding: "80px 64px", background: "#f0f7ff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Tahun 2025</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: DARK }}>Jadwal Penerimaan</h2>
            <p style={{ color: "#78909c", marginTop: 12, fontSize: 16 }}>Kuota terbatas setiap periodenya — daftar sebelum penuh!</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {periods.map((p, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "24px",
                border: `2px solid ${p.status === "buka" ? PRIMARY : "#e0e0e0"}`,
                boxShadow: p.status === "buka" ? "0 8px 32px rgba(0,110,25,0.15)" : "none",
                position: "relative", overflow: "hidden",
              }}>
                {p.status === "buka" && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: PRIMARY, color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "4px 12px",
                    borderBottomLeftRadius: 8,
                  }}>BUKA ●</div>
                )}
                <div style={{ fontSize: 11, fontWeight: 700, color: p.color, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: DARK, marginBottom: 8 }}>{p.range}</div>
                <div style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: 100,
                  background: p.status === "buka" ? PRIMARY_LIGHT : p.status === "tutup" ? "#f5f5f5" : "rgba(255,200,87,0.15)",
                  fontSize: 11, fontWeight: 600,
                  color: p.status === "buka" ? PRIMARY : p.status === "tutup" ? "#9e9e9e" : "#7b5800",
                  textTransform: "capitalize",
                }}>{p.status}</div>
                {p.status === "buka" && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "#78909c", marginBottom: 6 }}>Kuota tersisa</div>
                    <div style={{ height: 6, background: "#e8f5e9", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: "42%", height: "100%", background: PRIMARY, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: PRIMARY, fontWeight: 600, marginTop: 4 }}>58% kuota tersisa</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERSYARATAN DOKUMEN ── */}
      <section id="syarat" style={{ padding: "80px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Upload Berkas</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: DARK }}>Persyaratan Dokumen</h2>
            <p style={{ color: "#78909c", marginTop: 12, fontSize: 16 }}>Format PDF/JPG, maks 100MB per file. Pastikan dokumen hasil scan (bukan foto).</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {docsKategori.map((k, i) => (
              <div key={i} style={{
                background: "#f8f9ff", borderRadius: 20, padding: 28,
                border: "1px solid #e8eaf6",
                transition: "all 0.2s",
              }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{k.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 17, color: DARK, marginBottom: 16 }}>{k.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {k.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: j < k.items.length - 1 ? "1px solid #e8eaf6" : "none" }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11 }}>✓</span>
                      <span style={{ fontSize: 13, color: "#546e7a" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tips box */}
          <div style={{
            marginTop: 32, background: `linear-gradient(135deg, ${PRIMARY_LIGHT}, rgba(255,200,87,0.1))`,
            border: `1px solid ${PRIMARY}30`, borderRadius: 16, padding: "24px 32px",
            display: "flex", alignItems: "center", gap: 24,
          }}>
            <div style={{ fontSize: 48 }}>💡</div>
            <div>
              <div style={{ fontWeight: 700, color: PRIMARY, marginBottom: 4 }}>Tips Verifikasi Cepat</div>
              <div style={{ fontSize: 13, color: "#546e7a" }}>Unggah dokumen hasil scan (bukan foto smartphone) agar proses verifikasi lebih lancar. Seluruh halaman dokumen harus terbaca jelas.</div>
            </div>
            <button style={{ marginLeft: "auto", background: PRIMARY, color: "#fff", border: "none", borderRadius: 100, padding: "10px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              Panduan Unggah →
            </button>
          </div>
        </div>
      </section>

      {/* ── BUDAYA KERJA & K3 ── */}
      <section style={{ padding: "80px 64px", background: DARK, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(0,110,25,0.1)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#91fa8b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Standar TELPP</div>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Budaya Kerja & K3</h2>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, fontSize: 15, marginBottom: 32 }}>
                Keselamatan adalah prioritas utama. Seluruh peserta magang wajib mengikuti standar operasional dan Keselamatan, Kesehatan, Keamanan, dan Lingkungan (K3L) di lingkungan PT TELPP.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Helm & Sepatu Safety wajib di area produksi", "Seragam hitam-putih / almamater sopan", "Hadir tepat waktu sesuai jadwal ditetapkan"].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                    <span style={{ fontSize: 18 }}>✅</span>
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {k3Items.map((item, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16, padding: "20px 16px", textAlign: "center",
                  transition: "all 0.2s",
                }}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "80px 64px", background: "#f8f9ff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Pertanyaan Umum</div>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: DARK }}>FAQ</h2>
            <p style={{ color: "#78909c", marginTop: 12, fontSize: 16 }}>Belum ketemu jawaban? Hubungi HRD lewat fitur Chat Helpdesk.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <button style={{
              background: "none", border: `2px solid ${PRIMARY}`, color: PRIMARY,
              borderRadius: 100, padding: "12px 32px", fontSize: 14, fontWeight: 700,
              cursor: "pointer",
            }}>💬 Buka Chat Helpdesk</button>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        padding: "64px",
        background: `linear-gradient(135deg, ${PRIMARY} 0%, #1b6d24 100%)`,
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🌿</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Siap Memulai Perjalananmu?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 32 }}>
            Bergabunglah bersama ratusan mahasiswa & siswa SMK yang telah menjalani pengalaman magang berharga di PT TELPP.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button style={{
              background: "#fff", color: PRIMARY, border: "none", borderRadius: 100,
              padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer",
            }}>Daftar Gratis Sekarang</button>
            <button style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 100,
              padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer",
            }}>Lihat Panduan</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#061810", color: "rgba(255,255,255,0.7)", padding: "56px 64px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: "#91fa8b", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                🌿 e-Magang PT TELPP
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>Portal resmi manajemen magang terpadu untuk talenta muda Indonesia.</p>
              <div style={{ marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                PT TanjungEnim Lestari Pulp and Paper<br />Jl. Raya Muara Enim, Sumatera Selatan
              </div>
            </div>
            {[
              { title: "Menu", links: ["Alur Pendaftaran", "Jadwal Penerimaan", "Persyaratan", "FAQ"] },
              { title: "Bantuan", links: ["Panduan Sistem", "Chat Helpdesk", "Unduh Panduan PDF", "Kebijakan Privasi"] },
              { title: "Kontak HRD", links: ["hrd@telpp.co.id", "+62 734 123-456", "Senin–Jumat", "08.00–16.00 WIB"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 16, fontSize: 14 }}>{col.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l, j) => (
                    <li key={j} style={{ fontSize: 13, cursor: "pointer" }}>{l}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© 2025 e-Magang PT TELPP. All rights reserved.</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Dibuat dengan ❤️ untuk Indonesia</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
