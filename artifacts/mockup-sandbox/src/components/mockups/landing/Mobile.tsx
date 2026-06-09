import { useState } from "react";

const P = "#48AF4A";
const PL = "#e8f5e9";
const DARK = "#0b1c30";
const MUTED = "#64748b";

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={P} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const steps = [
  { n: "01", title: "Buat Akun", desc: "Daftar dengan email institusi." },
  { n: "02", title: "Isi Formulir", desc: "Lengkapi data diri dan akademik." },
  { n: "03", title: "Upload Berkas", desc: "Unggah dokumen sesuai kategori." },
  { n: "04", title: "Verifikasi HRD", desc: "Pemeriksaan kelayakan berkas." },
  { n: "05", title: "Mulai Magang", desc: "Terima konfirmasi dan mulai." },
];

const faqs = [
  { q: "Berapa lama proses verifikasi berkas?", a: "3–5 hari kerja setelah dokumen lengkap diunggah." },
  { q: "Apakah ada uang saku atau kompensasi?", a: "Ketentuan benefit disampaikan resmi saat penerimaan." },
  { q: "Divisi apa saja yang tersedia?", a: "30+ divisi: Produksi, IT, Keuangan, HRD, Lingkungan, Teknik, dan lainnya." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ border: `1px solid ${open ? P : "#e5e7eb"}`, borderRadius: 12, background: open ? "#f0fdf4" : "#fff", cursor: "pointer", marginBottom: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 16px", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: P, lineHeight: 1.5 }}>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", flexShrink: 0, marginTop: 2 }}>
          <path d="M19 9l-7 7-7-7" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {open && <div style={{ padding: "0 16px 14px", fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{a}</div>}
    </div>
  );
}

export function Mobile() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f9fafb", color: DARK, width: 390, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(249,250,251,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: DARK, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill={P} /></svg>
            e-Magang <span style={{ color: P, marginLeft: 3 }}>TELPP</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "none", border: "none", color: P, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", padding: "6px 10px" }}>Masuk</button>
            <button style={{ background: P, color: "#fff", border: "none", borderRadius: 100, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Daftar</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg, #0b1c30 0%, #1a3a1f 100%)", padding: "40px 20px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(72,175,74,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(72,175,74,0.15)", border: "1px solid rgba(72,175,74,0.3)", borderRadius: 100, padding: "5px 12px", marginBottom: 18, fontSize: 11, fontWeight: 600, color: "#86efac" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#86efac", display: "inline-block" }} />
            Periode III 2025 Dibuka
          </div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
            Mulai Karir<br />di <span style={{ color: "#86efac" }}>PT TELPP</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, marginBottom: 26 }}>
            Platform resmi magang PT TanjungEnim Lestari Pulp and Paper — transparan dari seleksi hingga sertifikasi.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 26 }}>
            {[["500+", "Alumni Magang"], ["30+", "Divisi Terbuka"], ["95%", "Kepuasan Peserta"], ["1–6 Bln", "Durasi"]].map(([n, l], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#86efac" }}>{n}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          <button style={{ width: "100%", background: P, color: "#fff", border: "none", borderRadius: 100, padding: 14, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", marginBottom: 10, boxShadow: "0 6px 20px rgba(72,175,74,0.35)" }}>Daftar Sekarang</button>
          <button style={{ width: "100%", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Panduan Sistem</button>
        </div>
      </section>

      {/* ALUR (horizontal scroll) */}
      <section style={{ padding: "40px 0 0", background: "#fff" }}>
        <div style={{ padding: "0 20px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Cara Daftar</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK }}>Alur Pendaftaran</h2>
        </div>
        <div style={{ display: "flex", gap: 12, padding: "4px 20px 24px", overflowX: "auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flexShrink: 0, width: 130, background: "#f9fafb", borderRadius: 14, padding: "16px 12px", textAlign: "center", border: `1.5px solid ${i < 2 ? P : "#e5e7eb"}`, boxShadow: i < 2 ? "0 4px 14px rgba(72,175,74,0.1)" : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: i < 2 ? P : "#f0f0f0", color: i < 2 ? "#fff" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, margin: "0 auto 10px" }}>{s.n}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: i < 2 ? P : "#9ca3af", letterSpacing: 1, marginBottom: 4, textTransform: "uppercase" as const }}>Langkah {s.n}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: DARK }}>{s.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JADWAL */}
      <section style={{ padding: "36px 20px", background: "#f0f4ff" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Tahun 2025</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 18 }}>Jadwal Penerimaan</h2>
        {[
          { label: "Periode I", range: "Jan – Mar 2025", status: "Tutup", color: "#9ca3af", active: false },
          { label: "Periode II", range: "Apr – Jun 2025", status: "Segera Buka", color: "#d97706", active: false },
          { label: "Periode III", range: "Jul – Sep 2025", status: "Buka", color: P, active: true },
          { label: "Periode IV", range: "Okt – Des 2025", status: "Akan Datang", color: "#60a5fa", active: false },
        ].map((p, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "16px", marginBottom: 10, border: `1.5px solid ${p.active ? P : "#e5e7eb"}`, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: p.active ? "0 4px 14px rgba(72,175,74,0.1)" : "none" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: 1 }}>{p.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DARK }}>{p.range}</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: p.color, background: p.active ? PL : "#f5f5f5", padding: "4px 12px", borderRadius: 100 }}>{p.status}</div>
          </div>
        ))}
      </section>

      {/* PERSYARATAN */}
      <section style={{ padding: "36px 20px", background: "#fff" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Dokumen Wajib</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 18 }}>Persyaratan Dokumen</h2>
        {[
          { title: "Mahasiswa D3/S1/S2", items: ["Proposal Magang", "Surat Pengantar Kampus", "KTM Aktif", "KTP", "Pasfoto 3×4", "BPJS/KIS"] },
          { title: "Siswa SMK (Prakerin)", items: ["Surat Pengantar Sekolah", "Kartu Pelajar", "KTP/KK Orang Tua", "Pasfoto 3×4"] },
        ].map((d, i) => (
          <div key={i} style={{ background: "#f9fafb", borderRadius: 14, padding: "18px", marginBottom: 12, border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 12 }}>{d.title}</h3>
            {d.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: j < d.items.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <Check />
                <span style={{ fontSize: 13, color: MUTED }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* K3 */}
      <section style={{ padding: "36px 20px", background: DARK }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#86efac", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Standar TELPP</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Budaya Kerja & K3</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 22, lineHeight: 1.65 }}>Keselamatan adalah prioritas utama di lingkungan PT TELPP.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {["Helm Safety", "Seragam Sopan", "Disiplin Waktu", "Absensi Digital", "Laporan Berkala", "Kerjasama Tim"].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
              <div style={{ width: 32, height: 32, background: "rgba(72,175,74,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke={P} strokeWidth="2" /></svg>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{item}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "36px 20px", background: "#f9fafb" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 6 }}>Pertanyaan Umum</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 18 }}>FAQ</h2>
        {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        <button style={{ width: "100%", marginTop: 14, background: "none", border: `2px solid ${P}`, color: P, borderRadius: 100, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Buka Chat Helpdesk</button>
      </section>

      {/* CTA */}
      <section style={{ padding: "40px 20px", background: `linear-gradient(135deg, ${P}, #2d8a30)`, textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Siap Memulai?</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 24, lineHeight: 1.65 }}>Bergabunglah bersama ratusan peserta magang di PT TELPP.</p>
        <button style={{ width: "100%", background: "#fff", color: P, border: "none", borderRadius: 100, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif", marginBottom: 10 }}>Daftar Gratis Sekarang</button>
        <button style={{ width: "100%", background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Lihat Panduan</button>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#061810", padding: "32px 20px 20px" }}>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#86efac", marginBottom: 8 }}>e-Magang PT TELPP</div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>Portal resmi magang terpadu untuk talenta muda Indonesia.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {[
            { title: "Menu", links: ["Alur", "Jadwal", "Syarat", "FAQ"] },
            { title: "Kontak", links: ["hrd@telpp.co.id", "+62 734 123-456", "Senin–Jumat", "08.00–16.00 WIB"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 10, fontSize: 13 }}>{col.title}</div>
              {col.links.map((l, j) => <div key={j} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          © 2025 e-Magang PT TELPP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
