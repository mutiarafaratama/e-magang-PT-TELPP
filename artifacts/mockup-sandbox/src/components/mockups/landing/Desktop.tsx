import { useState } from "react";

const P = "#48AF4A";
const PL = "#e8f5e9";
const DARK = "#0b1c30";
const MUTED = "#64748b";

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
    <path d="M19 9l-7 7-7-7" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke={P} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CheckLine = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 13l4 4L19 7" stroke={P} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const stats = [
  { num: "500+", label: "Alumni Magang" },
  { num: "30+", label: "Divisi Terbuka" },
  { num: "95%", label: "Kepuasan Peserta" },
  { num: "1–6 Bln", label: "Durasi" },
];

const steps = [
  { n: "01", title: "Buat Akun", desc: "Daftar dengan email institusi atau pribadi." },
  { n: "02", title: "Isi Formulir", desc: "Lengkapi data diri dan akademik." },
  { n: "03", title: "Upload Berkas", desc: "Unggah dokumen sesuai kategori." },
  { n: "04", title: "Verifikasi HRD", desc: "Tim HRD memeriksa kelayakan berkas." },
  { n: "05", title: "Mulai Magang", desc: "Terima surat konfirmasi dan mulai." },
];

const periods = [
  { label: "Periode I", range: "Jan – Mar 2025", status: "Tutup", color: "#9ca3af", active: false },
  { label: "Periode II", range: "Apr – Jun 2025", status: "Segera Buka", color: "#d97706", active: false },
  { label: "Periode III", range: "Jul – Sep 2025", status: "Buka", color: P, active: true },
  { label: "Periode IV", range: "Okt – Des 2025", status: "Akan Datang", color: "#60a5fa", active: false },
];

const dokumen = [
  { title: "Mahasiswa D3/S1/S2", items: ["Proposal Magang", "Surat Pengantar Kampus", "KTM Aktif", "KTP", "Pasfoto 3×4", "BPJS/KIS"] },
  { title: "Siswa SMK (Prakerin)", items: ["Surat Pengantar Sekolah", "Kartu Pelajar", "KTP/KK Orang Tua", "Pasfoto 3×4"] },
  { title: "Penelitian (S2/S3)", items: ["Proposal Penelitian", "Surat Institusi", "CV / Riwayat Hidup", "KTP", "BPJS/KIS"] },
];

const k3Rules = [
  "Helm dan sepatu safety wajib di area produksi",
  "Seragam hitam-putih atau almamater sopan",
  "Hadir tepat waktu sesuai jadwal yang ditetapkan",
];

const k3Items = ["Helm Safety", "Seragam Sopan", "Disiplin Waktu", "Absensi Digital", "Laporan Berkala", "Kerjasama Tim"];

const faqs = [
  { q: "Berapa lama proses verifikasi berkas?", a: "Proses verifikasi berkas memakan waktu 3–5 hari kerja setelah semua dokumen lengkap diunggah ke sistem." },
  { q: "Apakah ada kompensasi atau uang saku?", a: "Ketentuan benefit akan disampaikan secara resmi saat proses penerimaan. Silakan tanyakan kepada tim HRD." },
  { q: "Divisi apa saja yang tersedia untuk magang?", a: "Tersedia lebih dari 30 divisi: Produksi, IT, Keuangan, HRD, Lingkungan, Teknik, dan banyak lagi." },
  { q: "Bagaimana cara memantau status pengajuan?", a: "Login ke dashboard portal e-Magang. Status ditampilkan secara real-time beserta riwayat setiap perubahan." },
  { q: "Apakah bisa mendaftar ulang jika ditolak?", a: "Bisa. Jika pengajuan sebelumnya ditolak, Anda dapat mengajukan kembali di periode berikutnya." },
];

const s: Record<string, React.CSSProperties> = {
  // Tokens
  fontBase: { fontFamily: "'Poppins', sans-serif", fontSize: 14, color: DARK },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ border: `1px solid ${open ? P : "#e5e7eb"}`, borderRadius: 12, background: open ? "#f0fdf4" : "#fff", cursor: "pointer", marginBottom: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 18px", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: P, lineHeight: 1.5 }}>{q}</span>
        <ChevronDown open={open} />
      </div>
      {open && <div style={{ padding: "0 18px 15px", fontSize: 13, color: MUTED, lineHeight: 1.7 }}>{a}</div>}
    </div>
  );
}

export function Desktop() {
  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#f9fafb", color: DARK, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(249,250,251,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 64px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16, color: DARK }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill={P} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={P} strokeWidth="2" strokeLinecap="round" /></svg>
            e-Magang <span style={{ color: P, marginLeft: 4 }}>PT TELPP</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {["Alur", "Jadwal", "Syarat", "FAQ"].map(l => (
              <span key={l} style={{ fontSize: 14, fontWeight: 500, color: MUTED, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button style={{ background: "none", border: "none", color: P, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 12px", fontFamily: "Poppins, sans-serif" }}>Masuk</button>
            <button style={{ background: P, color: "#fff", border: "none", borderRadius: 100, padding: "10px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Daftar Sekarang</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: 680, background: "linear-gradient(135deg, #0b1c30 0%, #1a3a1f 55%, #0d2b10 100%)", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 480, height: 480, borderRadius: "50%", background: "rgba(72,175,74,0.10)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(72,175,74,0.15)", border: "1px solid rgba(72,175,74,0.3)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#86efac", width: "fit-content" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#86efac", display: "inline-block" }} />
              Pendaftaran Periode III 2025 Dibuka
            </div>
            <h1 style={{ fontSize: 50, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: 0 }}>
              Mulai Karir<br />di <span style={{ color: "#86efac" }}>PT TELPP</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: 460, margin: 0 }}>
              Platform resmi pendaftaran magang PT TanjungEnim Lestari Pulp and Paper. Proses transparan dari seleksi hingga sertifikasi.
            </p>
            <div style={{ display: "flex", gap: 32 }}>
              {stats.map(s => (
                <div key={s.num}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#86efac" }}>{s.num}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button style={{ background: P, color: "#fff", border: "none", borderRadius: 100, padding: "13px 30px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", boxShadow: "0 6px 20px rgba(72,175,74,0.3)" }}>Daftar Sekarang</button>
              <button style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.25)", borderRadius: 100, padding: "13px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Panduan Sistem</button>
            </div>
          </div>

          {/* Steps card */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "32px 34px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", maxWidth: 360, width: "100%" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: DARK, paddingBottom: 16, borderBottom: "1px solid #f0f0f0", marginBottom: 20 }}>5 Langkah Mudah</div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < 4 ? 16 : 0, opacity: i >= 2 ? (i >= 4 ? 0.3 : 0.5) : 1 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: i === 0 ? P : i === 1 ? "#ffc857" : "#f0f0f0", color: i <= 1 ? "#fff" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{s.n}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: DARK }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 18, padding: "10px 14px", background: PL, borderRadius: 8, fontSize: 12, color: P, fontWeight: 600, textAlign: "center" }}>Kuota terbatas — daftar segera</div>
            </div>
          </div>
        </div>
      </section>

      {/* ALUR */}
      <section style={{ padding: "80px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 10 }}>Cara Daftar</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: DARK, margin: 0 }}>Alur Pendaftaran</h2>
            <p style={{ color: MUTED, marginTop: 10, fontSize: 15 }}>Ikuti prosedur digital kami untuk monitoring status secara real-time.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20, position: "relative" }}>
            <div style={{ position: "absolute", top: 37, left: "11%", right: "11%", height: 2, background: `linear-gradient(to right, ${P}, #ffc857)`, zIndex: 0 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 76, height: 76, borderRadius: "50%", margin: "0 auto 14px", background: i < 2 ? P : "#f0f0f0", border: `2px solid ${i < 2 ? P : "#e5e7eb"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: i < 2 ? "#fff" : "#9ca3af", boxShadow: i < 2 ? "0 6px 20px rgba(72,175,74,0.2)" : "none" }}>{s.n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: i < 2 ? P : "#9ca3af", letterSpacing: 1, textTransform: "uppercase" as const, marginBottom: 4 }}>Langkah {s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: DARK, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JADWAL */}
      <section style={{ padding: "80px 64px", background: "#f0f4ff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 10 }}>Tahun 2025</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: DARK, margin: 0 }}>Jadwal Penerimaan</h2>
            <p style={{ color: MUTED, marginTop: 10, fontSize: 15 }}>Kuota terbatas setiap periodenya. Daftar sebelum penuh.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
            {periods.map((p, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 22, border: `1.5px solid ${p.active ? P : "#e5e7eb"}`, position: "relative", overflow: "hidden", boxShadow: p.active ? "0 6px 24px rgba(72,175,74,0.12)" : "none" }}>
                {p.active && <div style={{ position: "absolute", top: 0, right: 0, background: P, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderBottomLeftRadius: 8 }}>Buka</div>}
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 6 }}>{p.label}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 8 }}>{p.range}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: p.color }}>{p.status}</div>
                {p.active && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 11, color: MUTED, marginBottom: 5 }}>Kuota tersisa</div>
                    <div style={{ height: 5, background: PL, borderRadius: 3, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ width: "42%", height: "100%", background: P, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: P, fontWeight: 600 }}>58% kuota tersisa</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSYARATAN */}
      <section style={{ padding: "80px 64px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 10 }}>Dokumen Wajib</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: DARK, margin: 0 }}>Persyaratan Dokumen</h2>
            <p style={{ color: MUTED, marginTop: 10, fontSize: 15 }}>Format PDF/JPG, maksimal 100MB per file. Pastikan dokumen hasil scan.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginBottom: 22 }}>
            {dokumen.map((d, i) => (
              <div key={i} style={{ background: "#f9fafb", borderRadius: 16, padding: 26, border: "1px solid #e5e7eb" }}>
                <div style={{ width: 44, height: 44, background: PL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 16 }}>{d.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: MUTED, paddingBottom: j < d.items.length - 1 ? 8 : 0, borderBottom: j < d.items.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "linear-gradient(135deg, #e8f5e9, rgba(255,200,87,0.06))", border: "1px solid rgba(72,175,74,0.2)", borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ width: 44, height: 44, background: PL, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke={P} strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: P, fontSize: 14, marginBottom: 4 }}>Tips Verifikasi Cepat</div>
              <div style={{ fontSize: 13, color: MUTED }}>Unggah dokumen hasil scan (bukan foto smartphone) agar proses verifikasi lebih lancar.</div>
            </div>
            <button style={{ marginLeft: "auto", background: "none", border: `2px solid ${P}`, color: P, borderRadius: 100, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap" }}>Panduan Unggah</button>
          </div>
        </div>
      </section>

      {/* K3 */}
      <section style={{ padding: "80px 64px", background: DARK, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: "rgba(72,175,74,0.08)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#86efac", letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 10 }}>Standar TELPP</div>
              <h2 style={{ fontSize: 34, fontWeight: 700, color: "#fff", marginBottom: 14 }}>Budaya Kerja & K3</h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 28 }}>
                Keselamatan adalah prioritas utama. Seluruh peserta wajib mengikuti standar operasional dan K3L di lingkungan PT TELPP.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {k3Rules.map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px" }}>
                    <CheckLine />
                    <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {k3Items.map((item, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "18px 12px", textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, background: "rgba(72,175,74,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke={P} strokeWidth="2" /></svg>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 64px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P, letterSpacing: 2, textTransform: "uppercase" as const, marginBottom: 10 }}>Pertanyaan Umum</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, color: DARK, margin: 0 }}>FAQ</h2>
            <p style={{ color: MUTED, marginTop: 10, fontSize: 15 }}>Belum menemukan jawaban? Hubungi HRD via Chat Helpdesk.</p>
          </div>
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <button style={{ background: "none", border: `2px solid ${P}`, color: P, borderRadius: 100, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Buka Chat Helpdesk</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 64px", background: `linear-gradient(135deg, ${P}, #2d8a30)`, textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Siap Memulai Perjalananmu?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.82)", marginBottom: 32, lineHeight: 1.6 }}>Bergabunglah bersama ratusan mahasiswa dan siswa SMK yang telah menjalani pengalaman magang di PT TELPP.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <button style={{ background: "#fff", color: P, border: "none", borderRadius: 100, padding: "13px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Daftar Gratis Sekarang</button>
            <button style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 100, padding: "13px 26px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Lihat Panduan</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#061810", padding: "56px 64px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#86efac", marginBottom: 10 }}>e-Magang PT TELPP</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 240, marginBottom: 16 }}>Portal resmi manajemen magang terpadu untuk talenta muda Indonesia.</p>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>PT TanjungEnim Lestari Pulp and Paper<br />Muara Enim, Sumatera Selatan</div>
            </div>
            {[
              { title: "Menu", links: ["Alur Pendaftaran", "Jadwal Penerimaan", "Persyaratan", "FAQ"] },
              { title: "Bantuan", links: ["Panduan Sistem", "Chat Helpdesk", "Unduh Panduan PDF", "Kebijakan Privasi"] },
              { title: "Kontak HRD", links: ["hrd@telpp.co.id", "+62 734 123-456", "Senin–Jumat 08.00–16.00 WIB"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontWeight: 700, color: "#fff", marginBottom: 14, fontSize: 13 }}>{col.title}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((l, j) => <li key={j} style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{l}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", fontSize: 11, color: "rgba(255,255,255,0.22)" }}>
            <span>© 2025 e-Magang PT TELPP. All rights reserved.</span>
            <span>Dibuat untuk Indonesia</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
