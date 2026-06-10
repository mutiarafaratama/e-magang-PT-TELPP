import { useState, useRef } from "react";

const STEPS = [
  { id: 1, label: "Data Diri" },
  { id: 2, label: "Akademis" },
  { id: 3, label: "Dokumen" },
  { id: 4, label: "Review & Kirim" },
];

const KATEGORI = [
  { value: "smk",        label: "SMK / Sekolah Menengah Kejuruan" },
  { value: "d3_s1_s2",  label: "D3 / S1 / S2 (Perguruan Tinggi)" },
  { value: "penelitian", label: "Penelitian / Riset" },
];

const DOKUMEN_LIST = [
  { key: "proposal_magang", label: "Proposal Magang",      required: true,  accept: ".pdf,.doc,.docx", hint: "PDF atau Word, maks 10 MB" },
  { key: "ktp",             label: "KTP / Kartu Identitas", required: true,  accept: "image/*,.pdf",   hint: "JPG, PNG, atau PDF" },
  { key: "ktm",             label: "KTM / Kartu Pelajar",   required: false, accept: "image/*,.pdf",   hint: "JPG, PNG, atau PDF" },
  { key: "pasfoto",         label: "Pasfoto 3×4",           required: true,  accept: "image/*",        hint: "JPG atau PNG, latar merah/biru" },
  { key: "bpjs_kis",        label: "BPJS / KIS",            required: true,  accept: "image/*,.pdf",   hint: "Foto kartu atau PDF" },
];

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div className="field">
      <label className="field-label">
        {label}{required && <span style={{ color: "#e11d48" }}> *</span>}
      </label>
      {children}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="inp" {...props} />;
}

function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select className="inp" {...props}>{children}</select>;
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="inp" rows={3} {...props} />;
}

/* ─── Step 1: Data Diri ─────────────── */
function StepDataDiri({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) {
  return (
    <div className="step-body">
      <div className="step-head">
        <div className="step-head__info">
          <div className="step-title">Data Diri</div>
          <div className="step-sub">Lengkapi informasi pribadi sesuai KTP</div>
        </div>
      </div>
      <div className="form-grid-2">
        <Field label="Nama Lengkap" required>
          <Input placeholder="Sesuai KTP" value={data.nama_lengkap} onChange={e => onChange("nama_lengkap", e.target.value)} />
        </Field>
        <Field label="Jenis Kelamin" required>
          <Select value={data.jenis_kelamin} onChange={e => onChange("jenis_kelamin", e.target.value)}>
            <option value="">-- Pilih --</option>
            <option value="laki_laki">Laki-laki</option>
            <option value="perempuan">Perempuan</option>
          </Select>
        </Field>
        <Field label="Tempat Lahir" required>
          <Input placeholder="Kota kelahiran" value={data.tempat_lahir} onChange={e => onChange("tempat_lahir", e.target.value)} />
        </Field>
        <Field label="Tanggal Lahir" required>
          <Input type="date" value={data.tanggal_lahir} onChange={e => onChange("tanggal_lahir", e.target.value)} />
        </Field>
        <Field label="Nomor HP / WhatsApp" required>
          <Input placeholder="08xxxxxxxxxx" value={data.no_hp} onChange={e => onChange("no_hp", e.target.value)} />
        </Field>
        <Field label="Email Aktif" required>
          <Input type="email" placeholder="nama@email.com" value={data.email} onChange={e => onChange("email", e.target.value)} />
        </Field>
      </div>
      <Field label="Alamat Lengkap" required>
        <Textarea placeholder="Jalan, nomor, kelurahan, kecamatan, kota, provinsi" value={data.alamat} onChange={e => onChange("alamat", e.target.value)} />
      </Field>
    </div>
  );
}

/* ─── Step 2: Akademis ──────────────── */
function StepAkademis({ data, onChange }: { data: any; onChange: (k: string, v: string) => void }) {
  return (
    <div className="step-body">
      <div className="step-head">
        <div className="step-head__info">
          <div className="step-title">Informasi Akademis</div>
          <div className="step-sub">Data institusi dan program studi Anda</div>
        </div>
      </div>
      <Field label="Kategori Magang" required>
        <div className="kategori-grid">
          {KATEGORI.map(k => (
            <button
              key={k.value}
              className={`kategori-btn${data.kategori_magang === k.value ? " kategori-btn--active" : ""}`}
              onClick={() => onChange("kategori_magang", k.value)}
            >
              <span className="kategori-radio" />
              <span>{k.label}</span>
            </button>
          ))}
        </div>
      </Field>
      <div className="form-grid-2">
        <Field label="Asal Institusi / Sekolah" required>
          <Input placeholder="Nama sekolah / universitas" value={data.asal_institusi} onChange={e => onChange("asal_institusi", e.target.value)} />
        </Field>
        <Field label="Jurusan / Program Studi" required>
          <Input placeholder="Teknik Informatika" value={data.jurusan} onChange={e => onChange("jurusan", e.target.value)} />
        </Field>
        <Field label={data.kategori_magang === "smk" ? "Kelas" : "Semester"} required>
          <Input placeholder={data.kategori_magang === "smk" ? "XI / XII" : "Semester 5"} value={data.kelas_semester} onChange={e => onChange("kelas_semester", e.target.value)} />
        </Field>
        <Field label={data.kategori_magang === "smk" ? "NIS / NISN" : "NIM"} required>
          <Input placeholder="Nomor induk" value={data.nomor_induk} onChange={e => onChange("nomor_induk", e.target.value)} />
        </Field>
      </div>
      <div className="info-box">
        Kategori magang menentukan dokumen yang perlu diunggah pada langkah berikutnya.
      </div>
    </div>
  );
}

/* ─── Step 3: Dokumen ───────────────── */
function FileDropZone({ dok, file, onFile }: { dok: typeof DOKUMEN_LIST[0]; file: File | null; onFile: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const fmt = (b: number) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;

  return (
    <div
      className={`dropzone${drag ? " dropzone--drag" : ""}${file ? " dropzone--done" : ""}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      onClick={() => ref.current?.click()}
    >
      <input ref={ref} type="file" accept={dok.accept} style={{ display: "none" }} onChange={e => onFile(e.target.files?.[0] ?? null)} />
      {file ? (
        <div className="dropzone-done">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" fill="#48AF4A" />
            <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="dropzone-done__info">
            <div className="dropzone-done__name">{file.name}</div>
            <div className="dropzone-done__size">{fmt(file.size)}</div>
          </div>
          <button className="dropzone-done__remove" onClick={e => { e.stopPropagation(); onFile(null); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      ) : (
        <div className="dropzone-empty">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: "#9ca3af" }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <div>
            <div className="dropzone-empty__text">Klik atau drag file ke sini</div>
            <div className="dropzone-empty__hint">{dok.hint}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDokumen({ files, onFile }: { files: Record<string, File | null>; onFile: (k: string, f: File | null) => void }) {
  return (
    <div className="step-body">
      <div className="step-head">
        <div className="step-head__info">
          <div className="step-title">Upload Dokumen</div>
          <div className="step-sub">Unggah semua berkas yang diperlukan</div>
        </div>
      </div>
      <div className="dok-grid">
        {DOKUMEN_LIST.map(dok => (
          <div key={dok.key} className="dok-item">
            <div className="dok-item__header">
              <span className="dok-item__label">{dok.label}</span>
              {dok.required
                ? <span className="badge-required">Wajib</span>
                : <span className="badge-optional">Opsional</span>}
            </div>
            <FileDropZone dok={dok} file={files[dok.key] ?? null} onFile={f => onFile(dok.key, f)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 4: Review ────────────────── */
function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="review-row">
      <div className="review-row__label">{label}</div>
      <div className="review-row__value">{value || <span style={{ color: "#d1d5db" }}>—</span>}</div>
    </div>
  );
}

function StepReview({ diri, akademis, files }: { diri: any; akademis: any; files: Record<string, File | null> }) {
  const kategoriLabel = KATEGORI.find(k => k.value === akademis.kategori_magang)?.label ?? akademis.kategori_magang;
  const uploaded = DOKUMEN_LIST.filter(d => files[d.key]).length;
  const requiredMissing = DOKUMEN_LIST.filter(d => d.required && !files[d.key]);

  return (
    <div className="step-body">
      <div className="step-head">
        <div className="step-head__info">
          <div className="step-title">Review & Kirim</div>
          <div className="step-sub">Periksa kembali data sebelum mengirim pengajuan</div>
        </div>
      </div>

      <div className="review-section">
        <div className="review-section__title">Data Diri</div>
        <div className="review-grid">
          <ReviewRow label="Nama Lengkap"  value={diri.nama_lengkap} />
          <ReviewRow label="Jenis Kelamin" value={diri.jenis_kelamin === "laki_laki" ? "Laki-laki" : diri.jenis_kelamin === "perempuan" ? "Perempuan" : ""} />
          <ReviewRow label="Tempat Lahir"  value={diri.tempat_lahir} />
          <ReviewRow label="Tanggal Lahir" value={diri.tanggal_lahir} />
          <ReviewRow label="No. HP"        value={diri.no_hp} />
          <ReviewRow label="Email"         value={diri.email} />
          <ReviewRow label="Alamat"        value={diri.alamat} />
        </div>
      </div>

      <div className="review-section">
        <div className="review-section__title">Data Akademis</div>
        <div className="review-grid">
          <ReviewRow label="Kategori"      value={kategoriLabel} />
          <ReviewRow label="Institusi"     value={akademis.asal_institusi} />
          <ReviewRow label="Jurusan"       value={akademis.jurusan} />
          <ReviewRow label="Kelas/Semester" value={akademis.kelas_semester} />
          <ReviewRow label="Nomor Induk"   value={akademis.nomor_induk} />
        </div>
      </div>

      <div className="review-section">
        <div className="review-section__title">Dokumen</div>
        <div className="dok-status-grid">
          {DOKUMEN_LIST.map(d => (
            <div key={d.key} className={`dok-status${files[d.key] ? " dok-status--ok" : d.required ? " dok-status--miss" : ""}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                {files[d.key]
                  ? <><circle cx="12" cy="12" r="10" fill="#16a34a"/><path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></>
                  : d.required
                    ? <><circle cx="12" cy="12" r="10" fill="#fecaca"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/></>
                    : <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="1.5" fill="none"/>
                }
              </svg>
              <span>{d.label}</span>
              {d.required && !files[d.key] && <span className="dok-missing">Belum upload</span>}
            </div>
          ))}
        </div>
      </div>

      {requiredMissing.length > 0 && (
        <div className="alert-warn">
          Masih ada {requiredMissing.length} dokumen wajib yang belum diunggah. Kembali ke langkah Dokumen untuk melengkapinya.
        </div>
      )}

      <div className="review-note">
        Pastikan semua data sudah benar. Pengajuan yang sudah dikirim tidak dapat diedit. Tim HRD akan memverifikasi berkas dalam <strong>3–5 hari kerja</strong>.
      </div>

      <div style={{ position: "relative", marginTop: 4 }}>
        <div className="upload-bar">
          <div className="upload-bar__fill" style={{ width: `${Math.round(uploaded / DOKUMEN_LIST.length * 100)}%` }} />
        </div>
        <div className="upload-bar__label">{uploaded}/{DOKUMEN_LIST.length} dokumen diunggah</div>
      </div>
    </div>
  );
}

/* ─── MAIN ──────────────────────────── */
export default function FormPengajuan() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [diri, setDiri] = useState({
    nama_lengkap: "Budi Santoso", tempat_lahir: "Palembang",
    tanggal_lahir: "2003-05-12", jenis_kelamin: "laki_laki",
    no_hp: "081234567890", email: "budi@student.ac.id",
    alamat: "Jl. Mawar No.12, Kel. Ilir, Kec. Ilir Barat, Palembang, Sumatera Selatan",
  });
  const [akademis, setAkademis] = useState({
    kategori_magang: "d3_s1_s2", asal_institusi: "Universitas Sriwijaya",
    jurusan: "Teknik Informatika", kelas_semester: "Semester 5",
    nomor_induk: "09021282025082",
  });
  const [files, setFiles] = useState<Record<string, File | null>>({
    proposal_magang: null, ktp: null, ktm: null, pasfoto: null, bpjs_kis: null,
  });

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", fontFamily: "Poppins, sans-serif" }}>
        <div style={{ textAlign: "center", padding: "48px 40px", background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(13,40,24,0.10)", maxWidth: 460 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#48AF4A"/>
              <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#0d2818", marginBottom: 8 }}>Pengajuan Berhasil Dikirim</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, lineHeight: 1.7 }}>
            Pengajuan magang Anda telah diterima sistem.<br />
            Tim HRD akan memverifikasi berkas dalam <strong>3–5 hari kerja</strong>.
          </div>
          <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 20px", fontSize: 13, color: "#16a34a", fontWeight: 600, marginBottom: 20 }}>
            Status: Menunggu Verifikasi
          </div>
          <button style={{ background: "#48AF4A", color: "#fff", border: "none", borderRadius: 10, padding: "11px 28px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif" }} onClick={() => setSubmitted(false)}>
            Lihat Status Pengajuan
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0fdf4; font-family: 'Poppins', sans-serif; }

        .shell {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 28px 16px 48px;
          background: linear-gradient(160deg, #f0fdf4 0%, #e8f5e9 100%);
        }
        .card {
          width: 100%;
          max-width: 760px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 32px rgba(13,40,24,0.09), 0 1px 4px rgba(13,40,24,0.05);
          overflow: hidden;
        }

        /* Header */
        .card-header {
          background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%);
          padding: 20px 28px 18px;
        }
        .card-header__title { font-size: 15px; font-weight: 800; color: #fff; }
        .card-header__sub   { font-size: 11.5px; color: rgba(255,255,255,0.50); margin-top: 3px; }

        /* Stepper */
        .stepper {
          display: flex;
          align-items: flex-start;
          padding: 20px 28px 16px;
          border-bottom: 1px solid #f0faf0;
          gap: 0;
        }
        .stepper-item { flex: 1; display: flex; align-items: flex-start; }
        .stepper-item:last-child .stepper-line { display: none; }
        .stepper-col { display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .stepper-dot {
          width: 30px; height: 30px; border-radius: 50%;
          background: #f3f4f6; color: #9ca3af;
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s;
          border: 2px solid transparent;
        }
        .stepper-dot--active { background: #48AF4A; color: #fff; border-color: #48AF4A; box-shadow: 0 0 0 4px rgba(72,175,74,0.15); }
        .stepper-dot--done   { background: #0d2818; color: #86efac; border-color: #0d2818; }
        .stepper-label { font-size: 10px; font-weight: 600; color: #d1d5db; white-space: nowrap; }
        .stepper-label--active { color: #48AF4A; }
        .stepper-label--done   { color: #374151; }
        .stepper-line {
          flex: 1; height: 2px; background: #e5e7eb;
          margin: 14px 6px 0; transition: background 0.2s;
        }
        .stepper-line--done { background: #48AF4A; }

        /* Body */
        .step-body { padding: 22px 28px; display: flex; flex-direction: column; gap: 16px; }
        .step-head { display: flex; align-items: center; gap: 12px; margin-bottom: 2px; }
        .step-head__info {}
        .step-title { font-size: 14px; font-weight: 800; color: #0d2818; }
        .step-sub   { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

        /* Fields */
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label { font-size: 11.5px; font-weight: 600; color: #374151; }
        .field-hint  { font-size: 10.5px; color: #9ca3af; }
        .inp {
          border: 1.5px solid #e5e7eb; border-radius: 9px;
          padding: 9px 12px; font-size: 13px; font-family: 'Poppins', sans-serif;
          color: #111827; outline: none; width: 100%; background: #fff;
          transition: border-color 0.15s; appearance: none;
        }
        .inp:focus { border-color: #48AF4A; box-shadow: 0 0 0 3px rgba(72,175,74,0.10); }
        textarea.inp { resize: vertical; }

        /* Kategori picker */
        .kategori-grid { display: flex; flex-direction: column; gap: 7px; }
        .kategori-btn {
          display: flex; align-items: center; gap: 11px;
          padding: 11px 14px; border-radius: 9px;
          border: 1.5px solid #e5e7eb; background: #fff;
          font-size: 13px; font-family: 'Poppins', sans-serif;
          color: #374151; cursor: pointer; text-align: left;
          transition: all 0.15s;
        }
        .kategori-btn--active { border-color: #48AF4A; background: #f0fdf4; color: #0d2818; font-weight: 600; }
        .kategori-radio {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid #d1d5db; flex-shrink: 0;
          transition: all 0.15s;
        }
        .kategori-btn--active .kategori-radio {
          border-color: #48AF4A; background: #48AF4A;
          box-shadow: inset 0 0 0 3px #fff;
        }

        /* Info box */
        .info-box {
          background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9px;
          padding: 11px 14px; font-size: 12px; color: #1d4ed8; line-height: 1.6;
        }

        /* Dokumen */
        .dok-grid { display: flex; flex-direction: column; gap: 12px; }
        .dok-item { display: flex; flex-direction: column; gap: 5px; }
        .dok-item__header { display: flex; align-items: center; gap: 7px; }
        .dok-item__label { font-size: 12px; font-weight: 600; color: #374151; }
        .badge-required { background: #fef2f2; color: #dc2626; border-radius: 100px; padding: 2px 8px; font-size: 10px; font-weight: 700; }
        .badge-optional { background: #f3f4f6; color: #6b7280;  border-radius: 100px; padding: 2px 8px; font-size: 10px; font-weight: 600; }

        .dropzone {
          border: 2px dashed #d1d5db; border-radius: 9px;
          padding: 12px 14px; cursor: pointer; transition: all 0.15s; background: #fafafa;
        }
        .dropzone:hover, .dropzone--drag { border-color: #48AF4A; background: #f0fdf4; }
        .dropzone--done { border-style: solid; border-color: #48AF4A; background: #f0fdf4; }
        .dropzone-empty { display: flex; align-items: center; gap: 10px; }
        .dropzone-empty__text { font-size: 12.5px; color: #374151; font-weight: 500; }
        .dropzone-empty__hint { font-size: 11px; color: #9ca3af; margin-top: 1px; }
        .dropzone-done { display: flex; align-items: center; gap: 10px; }
        .dropzone-done__info { flex: 1; }
        .dropzone-done__name { font-size: 12.5px; font-weight: 600; color: #0d2818; }
        .dropzone-done__size { font-size: 11px; color: #6b7280; }
        .dropzone-done__remove {
          background: none; border: none; color: #9ca3af;
          cursor: pointer; padding: 4px; border-radius: 4px;
          display: flex; align-items: center;
        }
        .dropzone-done__remove:hover { background: #fee2e2; color: #dc2626; }

        /* Review */
        .review-section { background: #fafafa; border-radius: 11px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
        .review-section__title { font-size: 11.5px; font-weight: 700; color: #0d2818; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
        .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .review-row { display: flex; flex-direction: column; gap: 2px; }
        .review-row__label { font-size: 10.5px; color: #9ca3af; }
        .review-row__value { font-size: 12.5px; font-weight: 600; color: #111827; }
        .dok-status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .dok-status { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #6b7280; }
        .dok-status--ok   { color: #16a34a; font-weight: 600; }
        .dok-status--miss { color: #dc2626; }
        .dok-missing { font-size: 10px; color: #dc2626; font-weight: 600; margin-left: auto; }

        .review-note {
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 9px; padding: 11px 14px; font-size: 12px; color: #78350f; line-height: 1.6;
        }
        .alert-warn {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 9px; padding: 11px 14px; font-size: 12px; color: #dc2626;
        }
        .upload-bar { background: #e5e7eb; border-radius: 100px; height: 6px; overflow: hidden; }
        .upload-bar__fill { height: 100%; background: #48AF4A; border-radius: 100px; transition: width 0.3s; }
        .upload-bar__label { font-size: 10.5px; color: #6b7280; margin-top: 5px; text-align: right; }

        /* Footer */
        .card-footer {
          padding: 14px 28px;
          border-top: 1px solid #f0faf0;
          display: flex; align-items: center; justify-content: space-between;
          background: #fafafa;
        }
        .step-counter { font-size: 11px; color: #9ca3af; }
        .btn-back {
          background: #fff; border: 1.5px solid #e5e7eb; color: #374151;
          border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600;
          font-family: 'Poppins', sans-serif; cursor: pointer; transition: all 0.15s;
        }
        .btn-back:hover { border-color: #48AF4A; color: #0d2818; }
        .btn-next {
          background: #48AF4A; color: #fff; border: none;
          border-radius: 9px; padding: 9px 24px;
          font-size: 13px; font-weight: 700;
          font-family: 'Poppins', sans-serif; cursor: pointer;
          transition: background 0.15s;
        }
        .btn-next:hover { background: #3d9e3f; }
        .btn-submit { background: #0d2818; }
        .btn-submit:hover { background: #1a5c20; }
      `}</style>

      <div className="shell">
        <div className="card">
          <div className="card-header">
            <div className="card-header__title">Formulir Pengajuan Magang</div>
            <div className="card-header__sub">PT TanjungEnim Lestari Pulp and Paper (TELPP)</div>
          </div>

          <div className="stepper">
            {STEPS.map((s, i) => {
              const done   = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="stepper-item">
                  <div className="stepper-col">
                    <div className={`stepper-dot${active ? " stepper-dot--active" : done ? " stepper-dot--done" : ""}`}>
                      {done
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : s.id
                      }
                    </div>
                    <div className={`stepper-label${active ? " stepper-label--active" : done ? " stepper-label--done" : ""}`}>
                      {s.label}
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`stepper-line${done ? " stepper-line--done" : ""}`} />
                  )}
                </div>
              );
            })}
          </div>

          {step === 1 && <StepDataDiri  data={diri}    onChange={(k,v) => setDiri(p => ({...p,[k]:v}))} />}
          {step === 2 && <StepAkademis data={akademis} onChange={(k,v) => setAkademis(p => ({...p,[k]:v}))} />}
          {step === 3 && <StepDokumen  files={files}   onFile={(k,f) => setFiles(p => ({...p,[k]:f}))} />}
          {step === 4 && <StepReview   diri={diri}     akademis={akademis} files={files} />}

          <div className="card-footer">
            <div>
              {step > 1 && <button className="btn-back" onClick={() => setStep(s => s - 1)}>Kembali</button>}
            </div>
            <div className="step-counter">Langkah {step} dari {STEPS.length}</div>
            <button
              className={`btn-next${step === 4 ? " btn-submit" : ""}`}
              onClick={() => step < 4 ? setStep(s => s + 1) : setSubmitted(true)}
            >
              {step === 4 ? "Kirim Pengajuan" : "Lanjut"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
