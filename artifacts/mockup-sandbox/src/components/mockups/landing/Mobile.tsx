import { useState } from "react";

const PRIMARY = "#006e19";
const PRIMARY_LIGHT = "#e8f5e9";
const ACCENT = "#ffc857";
const DARK = "#0b1c30";

const steps = [
  { n: "01", icon: "🧑‍💻", title: "Buat Akun" },
  { n: "02", icon: "📋", title: "Isi Formulir" },
  { n: "03", icon: "📂", title: "Upload Berkas" },
  { n: "04", icon: "🔍", title: "Verifikasi HRD" },
  { n: "05", icon: "🎉", title: "Mulai Magang" },
];

const faqs = [
  { q: "Berapa lama verifikasi berkas?", a: "Proses verifikasi memakan waktu 3–5 hari kerja setelah semua dokumen lengkap." },
  { q: "Apakah ada uang saku?", a: "Ketentuan benefit akan disampaikan resmi saat proses penerimaan." },
  { q: "Divisi apa saja yang tersedia?", a: "30+ divisi: Produksi, IT, Keuangan, HRD, Lingkungan, Teknik, dan lainnya." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${open ? PRIMARY : "#e8eaf6"}`, borderRadius: 12, background: "#fff", marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 8 }}
      >
        <span style={{ fontWeight: 600, color: PRIMARY, fontSize: 13, lineHeight: 1.5 }}>{q}</span>
        <span style={{ fontSize: 18, color: PRIMARY, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
      </button>
      {open && <div style={{ padding: "0 16px 14px", color: "#546e7a", fontSize: 13, lineHeight: 1.6 }}>{a}</div>}
    </div>
  );
}

export function Mobile() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f8f9ff", color: DARK, width: 390, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav style={{ background: "rgba(248,249,255,0.97)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e8eaf6", padding: "0 16px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: PRIMARY, display: "flex", alignItems: "center", gap: 6 }}>
            🌿 e-Magang TELPP
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ fontSize: 12, fontWeight: 600, color: PRIMARY, background: "none", border: "none", cursor: "pointer", padding: "6px 10px" }}>Masuk</button>
            <button style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: PRIMARY, border: "none", borderRadius: 100, padding: "8px 16px", cursor: "pointer" }}>Daftar</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #1a3a1f 100%)`,
        padding: "40px 20px 48px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,110,25,0.2)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(117,221,113,0.15)", border: "1px solid rgba(117,221,113,0.3)",
            borderRadius: 100, padding: "5px 12px", marginBottom: 20,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#75dd71", display: "inline-block" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#91fa8b" }}>Periode III 2025 DIBUKA</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
            Mulai Karir<br />di <span style={{ color: "#91fa8b" }}>PT TELPP</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6, marginBottom: 28 }}>
            Platform resmi magang PT TanjungEnim Lestari Pulp and Paper — transparan dari seleksi hingga sertifikasi.
          </p>

          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 28 }}>
            {[["500+", "Alumni"], ["30+", "Divisi"], ["95%", "Puas"], ["1–6 bln", "Durasi"]].map(([n, l], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#91fa8b" }}>{n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button style={{ background: PRIMARY, color: "#fff", border: "none", borderRadius: 100, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,110,25,0.4)" }}>
              Daftar Sekarang ✦
            </button>
            <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Panduan Sistem →
            </button>
          </div>
        </div>
      </section>

      {/* ── 5 LANGKAH (horizontal scroll) ── */}
      <section style={{ padding: "40px 0 0" }}>
        <div style={{ padding: "0 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Cara Daftar</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK }}>Alur Pendaftaran</h2>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "4px 20px 20px", overflowX: "auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 120, background: "#fff", borderRadius: 16,
              padding: "16px 12px", textAlign: "center",
              border: `1.5px solid ${i < 2 ? PRIMARY : "#e8eaf6"}`,
              boxShadow: i < 2 ? "0 4px 16px rgba(0,110,25,0.1)" : "none",
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: i < 2 ? PRIMARY : "#bdbdbd", letterSpacing: 1, marginBottom: 4 }}>LANGKAH {s.n}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: DARK }}>{s.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JADWAL ── */}
      <section style={{ padding: "40px 20px", background: "#f0f7ff" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Tahun 2025</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 20 }}>Jadwal Penerimaan</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { label: "Periode I", range: "Jan – Mar 2025", status: "tutup", badge: "#9e9e9e" },
            { label: "Periode II", range: "Apr – Jun 2025", status: "segera", badge: ACCENT },
            { label: "Periode III", range: "Jul – Sep 2025", status: "BUKA", badge: PRIMARY, active: true },
            { label: "Periode IV", range: "Okt – Des 2025", status: "akan datang", badge: "#90caf9" },
          ].map((p, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: "16px",
              border: `1.5px solid ${p.active ? PRIMARY : "#e0e0e0"}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              boxShadow: p.active ? "0 4px 16px rgba(0,110,25,0.12)" : "none",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: p.badge, textTransform: "uppercase", letterSpacing: 1 }}>{p.label}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{p.range}</div>
              </div>
              <div style={{
                padding: "4px 12px", borderRadius: 100,
                background: p.active ? PRIMARY_LIGHT : "#f5f5f5",
                fontSize: 11, fontWeight: 700,
                color: p.active ? PRIMARY : "#9e9e9e",
                textTransform: "capitalize",
              }}>{p.status}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PERSYARATAN ── */}
      <section style={{ padding: "40px 20px", background: "#fff" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Upload Berkas</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 20 }}>Persyaratan Dokumen</h2>

        {[
          { icon: "🎓", title: "Mahasiswa D3/S1/S2", items: ["Proposal Magang", "Surat Pengantar Kampus", "KTM Aktif", "KTP", "Pasfoto 3×4", "BPJS/KIS"] },
          { icon: "🔧", title: "Siswa SMK", items: ["Surat dari Sekolah", "Kartu Pelajar", "KTP Orang Tua", "Pasfoto 3×4"] },
        ].map((k, i) => (
          <div key={i} style={{ background: "#f8f9ff", borderRadius: 16, padding: 20, marginBottom: 14, border: "1px solid #e8eaf6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 24 }}>{k.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 15, color: DARK }}>{k.title}</div>
            </div>
            {k.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: j < k.items.length - 1 ? "1px solid #e8eaf6" : "none" }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: PRIMARY_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: "#546e7a" }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ── K3 ── */}
      <section style={{ padding: "40px 20px", background: DARK }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#91fa8b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Standar TELPP</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Budaya Kerja & K3</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 24, lineHeight: 1.6 }}>Keselamatan adalah prioritas utama di lingkungan PT TELPP.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { icon: "⛑️", label: "Helm Safety" },
            { icon: "👔", label: "Seragam" },
            { icon: "🕐", label: "Disiplin" },
            { icon: "📱", label: "Absensi" },
            { icon: "📝", label: "Laporan" },
            { icon: "🤝", label: "Kerjasama" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "16px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "40px 20px", background: "#f8f9ff" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: PRIMARY, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Pertanyaan Umum</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 20 }}>FAQ</h2>
        {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        <button style={{
          width: "100%", marginTop: 16, background: "none", border: `2px solid ${PRIMARY}`,
          color: PRIMARY, borderRadius: 100, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}>💬 Buka Chat Helpdesk</button>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "40px 20px", background: `linear-gradient(135deg, ${PRIMARY}, #1b6d24)`, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🌿</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Siap Memulai?</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 24, lineHeight: 1.6 }}>Bergabunglah bersama ratusan peserta magang yang telah berkarir di PT TELPP.</p>
        <button style={{ width: "100%", background: "#fff", color: PRIMARY, border: "none", borderRadius: 100, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          Daftar Gratis Sekarang
        </button>
        <button style={{ width: "100%", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 100, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Lihat Panduan →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#061810", color: "rgba(255,255,255,0.6)", padding: "32px 20px 20px" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#91fa8b", marginBottom: 10 }}>🌿 e-Magang PT TELPP</div>
        <p style={{ fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>Portal resmi magang terpadu untuk talenta muda Indonesia.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          {[
            { title: "Menu", links: ["Alur", "Jadwal", "Syarat", "FAQ"] },
            { title: "Kontak", links: ["hrd@telpp.co.id", "+62 734 123-456", "Senin–Jumat", "08.00–16.00 WIB"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 10, fontSize: 13 }}>{col.title}</div>
              {col.links.map((l, j) => <div key={j} style={{ fontSize: 12, marginBottom: 6 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
          © 2025 e-Magang PT TELPP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
