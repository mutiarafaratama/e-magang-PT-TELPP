<template>
  <div class="form-page">
    <!-- Navbar minimal -->
    <nav class="form-nav">
      <div class="form-nav__inner">
        <router-link to="/" class="form-nav__brand">
          <img src="/logotel.png" alt="PT TELPP" class="form-nav__logo" />
          <span>e-Magang <strong>PT TELPP</strong></span>
        </router-link>
        <router-link to="/login" class="form-nav__login">Sudah punya akun? Masuk →</router-link>
      </div>
    </nav>

    <!-- Success screen -->
    <div v-if="submitted" class="success-wrap">
      <div class="success-card">
        <div class="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#dcfce7"/><path d="M7 12l3.5 3.5L17 8" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2>Pengajuan Berhasil Dikirim!</h2>
        <p>
          Terima kasih, <strong>{{ diri.nama_lengkap }}</strong>. Tim HRD PT TELPP akan meninjau
          pengajuan Anda dan mengirimkan akun login ke
          <strong>{{ diri.email }}</strong> setelah verifikasi selesai.
        </p>
        <div class="success-info">
          <div class="success-info__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#48AF4A" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#48AF4A" stroke-width="2" stroke-linecap="round"/></svg>
            Proses verifikasi 3–5 hari kerja
          </div>
          <div class="success-info__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#48AF4A" stroke-width="2"/><polyline points="22,6 12,13 2,6" stroke="#48AF4A" stroke-width="2"/></svg>
            Notifikasi dikirim via email
          </div>
        </div>
        <router-link to="/" class="btn-primary">Kembali ke Halaman Utama</router-link>
      </div>
    </div>

    <!-- Form -->
    <div v-else class="form-wrap">
      <div class="form-card">
        <!-- Header -->
        <div class="form-header">
          <h1>Formulir Pengajuan Magang</h1>
          <p>PT TanjungEnim Lestari Pulp and Paper · Muara Enim, Sumatera Selatan</p>
        </div>

        <!-- Stepper -->
        <div class="stepper">
          <div
            v-for="(s, i) in STEPS"
            :key="i"
            class="stepper__item"
            :class="{
              'stepper__item--active': step === i,
              'stepper__item--done': step > i,
            }"
          >
            <div class="stepper__circle">
              <svg v-if="step > i" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <div class="stepper__label">{{ s }}</div>
            <div v-if="i < STEPS.length - 1" class="stepper__line"></div>
          </div>
        </div>

        <!-- STEP 1: Data Diri -->
        <div v-if="step === 0" class="form-section">
          <h3 class="section-title">Data Diri</h3>
          <div class="form-grid">
            <div class="field field--full">
              <label>Nama Lengkap <span class="req">*</span></label>
              <input v-model="diri.nama_lengkap" type="text" placeholder="Sesuai KTP/KTM" />
            </div>
            <div class="field">
              <label>Tempat Lahir <span class="req">*</span></label>
              <input v-model="diri.tempat_lahir" type="text" placeholder="Kota kelahiran" />
            </div>
            <div class="field">
              <label>Tanggal Lahir <span class="req">*</span></label>
              <input v-model="diri.tanggal_lahir" type="date" />
            </div>
            <div class="field">
              <label>Jenis Kelamin <span class="req">*</span></label>
              <select v-model="diri.jenis_kelamin">
                <option value="">-- Pilih --</option>
                <option value="laki_laki">Laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
            <div class="field">
              <label>No. HP / WhatsApp <span class="req">*</span></label>
              <input v-model="diri.no_hp" type="tel" placeholder="08xxxxxxxxxx" />
            </div>
            <div class="field">
              <label>Email Aktif <span class="req">*</span></label>
              <input v-model="diri.email" type="email" placeholder="email@contoh.com" />
              <div class="field-hint">Akun login akan dikirim ke email ini</div>
            </div>
            <div class="field field--full">
              <label>Alamat Lengkap <span class="req">*</span></label>
              <textarea v-model="diri.alamat" rows="3" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kab/Kota"></textarea>
            </div>
          </div>
        </div>

        <!-- STEP 2: Data Akademis -->
        <div v-else-if="step === 1" class="form-section">
          <h3 class="section-title">Data Akademis</h3>
          <div class="form-grid">
            <div class="field field--full">
              <label>Kategori Magang <span class="req">*</span></label>
              <div class="radio-group">
                <label
                  v-for="k in KATEGORI"
                  :key="k.value"
                  class="radio-card"
                  :class="{ 'radio-card--active': akademis.kategori_magang === k.value }"
                >
                  <input type="radio" :value="k.value" v-model="akademis.kategori_magang" />
                  <div class="radio-card__label">{{ k.label }}</div>
                  <div class="radio-card__sub">{{ k.sub }}</div>
                </label>
              </div>
            </div>
            <div class="field field--full">
              <label>Nama Institusi <span class="req">*</span></label>
              <input v-model="akademis.asal_institusi" type="text" placeholder="Nama universitas / sekolah" />
            </div>
            <div class="field">
              <label>Jurusan / Program Studi <span class="req">*</span></label>
              <input v-model="akademis.jurusan" type="text" placeholder="Teknik Informatika, Akuntansi, dll" />
            </div>
            <div class="field">
              <label>Semester / Kelas <span class="req">*</span></label>
              <input v-model="akademis.kelas_semester" type="text" placeholder="Semester 6 / Kelas XII TKJ" />
            </div>
            <div class="field field--full">
              <label>NIM / NIS <span class="req">*</span></label>
              <input v-model="akademis.nomor_induk" type="text" placeholder="Nomor induk mahasiswa / siswa" />
            </div>
          </div>
        </div>

        <!-- STEP 3: Review & Kirim -->
        <div v-else-if="step === 2" class="form-section">
          <h3 class="section-title">Periksa & Kirim</h3>
          <p class="review-sub">Pastikan semua data di bawah sudah benar sebelum mengirim.</p>

          <div class="review-block">
            <div class="review-block__title">Data Diri</div>
            <div class="review-grid">
              <div class="review-item"><span>Nama</span><strong>{{ diri.nama_lengkap }}</strong></div>
              <div class="review-item"><span>Tempat, Tgl Lahir</span><strong>{{ diri.tempat_lahir }}, {{ formatDate(diri.tanggal_lahir) }}</strong></div>
              <div class="review-item"><span>Jenis Kelamin</span><strong>{{ diri.jenis_kelamin === 'laki_laki' ? 'Laki-laki' : 'Perempuan' }}</strong></div>
              <div class="review-item"><span>No. HP</span><strong>{{ diri.no_hp }}</strong></div>
              <div class="review-item"><span>Email</span><strong>{{ diri.email }}</strong></div>
              <div class="review-item review-item--full"><span>Alamat</span><strong>{{ diri.alamat }}</strong></div>
            </div>
          </div>

          <div class="review-block">
            <div class="review-block__title">Data Akademis</div>
            <div class="review-grid">
              <div class="review-item"><span>Kategori</span><strong>{{ labelKategori(akademis.kategori_magang) }}</strong></div>
              <div class="review-item"><span>Institusi</span><strong>{{ akademis.asal_institusi }}</strong></div>
              <div class="review-item"><span>Jurusan</span><strong>{{ akademis.jurusan }}</strong></div>
              <div class="review-item"><span>Semester/Kelas</span><strong>{{ akademis.kelas_semester }}</strong></div>
              <div class="review-item"><span>NIM/NIS</span><strong>{{ akademis.nomor_induk }}</strong></div>
            </div>
          </div>

          <div class="review-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round"/></svg>
            Setelah pengajuan dikirim, tim HRD akan mengirimkan akun login ke <strong>{{ diri.email }}</strong>.
          </div>

          <div v-if="submitError" class="error-banner">{{ submitError }}</div>
        </div>

        <!-- Footer actions -->
        <div class="form-footer">
          <button v-if="step > 0" class="btn-outline" @click="step--">← Kembali</button>
          <div v-else></div>

          <button
            v-if="step < 2"
            class="btn-primary"
            @click="nextStep"
          >
            Lanjut →
          </button>
          <button
            v-else
            class="btn-primary"
            :disabled="submitting"
            @click="submitForm"
          >
            <span v-if="submitting" class="spinner-sm"></span>
            {{ submitting ? "Mengirim..." : "Kirim Pengajuan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import api from "@/lib/api";

const STEPS = ["Data Diri", "Akademis", "Review & Kirim"];

const KATEGORI = [
  { value: "smk",           label: "Siswa SMK (Prakerin)",    sub: "Praktik kerja industri bagi siswa SMK" },
  { value: "d3_s1_s2",      label: "Mahasiswa D3/S1/S2",      sub: "Program magang untuk mahasiswa aktif" },
  { value: "penelitian",    label: "Penelitian / Riset",      sub: "Penelitian skripsi, tesis, atau disertasi" },
];

const step = ref(0);
const submitted = ref(false);
const submitting = ref(false);
const submitError = ref<string | null>(null);

const diri = reactive({
  nama_lengkap: "",
  tempat_lahir: "",
  tanggal_lahir: "",
  jenis_kelamin: "",
  no_hp: "",
  email: "",
  alamat: "",
});

const akademis = reactive({
  kategori_magang: "",
  asal_institusi: "",
  jurusan: "",
  kelas_semester: "",
  nomor_induk: "",
});

function formatDate(d: string) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function labelKategori(k: string) {
  return KATEGORI.find(c => c.value === k)?.label ?? k;
}

function validateStep0(): string | null {
  if (!diri.nama_lengkap.trim()) return "Nama lengkap wajib diisi";
  if (!diri.tempat_lahir.trim()) return "Tempat lahir wajib diisi";
  if (!diri.tanggal_lahir) return "Tanggal lahir wajib diisi";
  if (!diri.jenis_kelamin) return "Jenis kelamin wajib dipilih";
  if (!diri.no_hp.trim()) return "Nomor HP wajib diisi";
  if (!diri.email.trim() || !diri.email.includes("@")) return "Email aktif wajib diisi";
  if (!diri.alamat.trim()) return "Alamat lengkap wajib diisi";
  return null;
}

function validateStep1(): string | null {
  if (!akademis.kategori_magang) return "Kategori magang wajib dipilih";
  if (!akademis.asal_institusi.trim()) return "Nama institusi wajib diisi";
  if (!akademis.jurusan.trim()) return "Jurusan wajib diisi";
  if (!akademis.kelas_semester.trim()) return "Semester/kelas wajib diisi";
  if (!akademis.nomor_induk.trim()) return "NIM/NIS wajib diisi";
  return null;
}

function nextStep() {
  submitError.value = null;
  const err = step.value === 0 ? validateStep0() : validateStep1();
  if (err) {
    submitError.value = err;
    return;
  }
  submitError.value = null;
  step.value++;
}

async function submitForm() {
  submitting.value = true;
  submitError.value = null;
  try {
    await api.post("/api/pengajuan/publik", {
      step1: {
        nama_lengkap: diri.nama_lengkap,
        tempat_lahir: diri.tempat_lahir,
        tanggal_lahir: diri.tanggal_lahir,
        jenis_kelamin: diri.jenis_kelamin,
        no_hp: diri.no_hp,
        email: diri.email,
        alamat: diri.alamat,
      },
      step2: {
        kategori_magang: akademis.kategori_magang,
        asal_institusi: akademis.asal_institusi,
        jurusan: akademis.jurusan,
        kelas_semester: akademis.kelas_semester,
        nomor_induk: akademis.nomor_induk,
      },
    });
    submitted.value = true;
  } catch (e: any) {
    submitError.value = e.response?.data?.message ?? "Terjadi kesalahan saat mengirim formulir. Silakan coba lagi.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* ── layout ── */
.form-page { min-height: 100vh; background: #f0fdf4; font-family: "Poppins", "Segoe UI", sans-serif; }

/* ── navbar ── */
.form-nav { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 20; }
.form-nav__inner { max-width: 760px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.form-nav__brand { display: flex; align-items: center; gap: 8px; text-decoration: none; font-size: 15px; font-weight: 700; color: #0b1c30; }
.form-nav__brand strong { color: #48AF4A; }
.form-nav__logo { height: 28px; width: auto; }
.form-nav__login { font-size: 13px; font-weight: 600; color: #48AF4A; text-decoration: none; }
.form-nav__login:hover { text-decoration: underline; }

/* ── success ── */
.success-wrap { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 60px); padding: 40px 24px; }
.success-card { background: #fff; border-radius: 20px; padding: 48px 40px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 4px 32px rgba(0,0,0,0.08); }
.success-icon { margin-bottom: 20px; }
.success-card h2 { font-size: 22px; font-weight: 800; color: #0d2818; margin: 0 0 12px; }
.success-card p { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0 0 24px; }
.success-info { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.success-info__item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; background: #f0fdf4; border-radius: 8px; padding: 10px 14px; }

/* ── form wrap ── */
.form-wrap { display: flex; align-items: flex-start; justify-content: center; min-height: calc(100vh - 60px); padding: 40px 24px; }
.form-card { background: #fff; border-radius: 20px; padding: 40px; max-width: 720px; width: 100%; box-shadow: 0 4px 32px rgba(0,0,0,0.06); border: 1px solid #e9f5e9; }

/* ── header ── */
.form-header { text-align: center; margin-bottom: 32px; }
.form-header h1 { font-size: 22px; font-weight: 800; color: #0d2818; margin: 0 0 6px; }
.form-header p { font-size: 13px; color: #6b7280; margin: 0; }

/* ── stepper ── */
.stepper { display: flex; align-items: flex-start; justify-content: center; gap: 0; margin-bottom: 36px; }
.stepper__item { display: flex; align-items: center; position: relative; }
.stepper__circle {
  width: 32px; height: 32px; border-radius: 50%; border: 2px solid #d1d5db;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #9ca3af; background: #fff; flex-shrink: 0;
  transition: all 0.2s;
}
.stepper__item--active .stepper__circle { border-color: #48AF4A; color: #48AF4A; }
.stepper__item--done .stepper__circle { border-color: #48AF4A; background: #48AF4A; color: #fff; }
.stepper__label { font-size: 12px; font-weight: 600; color: #9ca3af; margin: 0 8px; white-space: nowrap; }
.stepper__item--active .stepper__label { color: #48AF4A; }
.stepper__item--done .stepper__label { color: #0d2818; }
.stepper__line { width: 48px; height: 2px; background: #e5e7eb; margin: 0; flex-shrink: 0; }
.stepper__item--done .stepper__line { background: #48AF4A; }

/* ── section title ── */
.section-title { font-size: 15px; font-weight: 700; color: #0d2818; margin: 0 0 20px; }

/* ── form grid ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field label { font-size: 12.5px; font-weight: 600; color: #374151; }
.req { color: #ef4444; }
.field input,
.field select,
.field textarea {
  border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 10px 12px;
  font-size: 13px; font-family: inherit; color: #111827; outline: none;
  transition: border-color 0.15s; background: #fff;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: #48AF4A; }
.field textarea { resize: vertical; }
.field-hint { font-size: 11px; color: #9ca3af; }

/* ── radio kategori ── */
.radio-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.radio-card {
  border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 14px 12px;
  cursor: pointer; transition: all 0.15s; display: flex; flex-direction: column; gap: 4px;
}
.radio-card input { display: none; }
.radio-card--active { border-color: #48AF4A; background: #f0fdf4; }
.radio-card__label { font-size: 12.5px; font-weight: 700; color: #111827; }
.radio-card__sub { font-size: 11px; color: #6b7280; line-height: 1.5; }
.radio-card--active .radio-card__label { color: #0d2818; }

/* ── review ── */
.review-sub { font-size: 13px; color: #6b7280; margin: 0 0 20px; }
.review-block { border: 1px solid #e9f5e9; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.review-block__title { background: #f0fdf4; padding: 10px 16px; font-size: 12px; font-weight: 700; color: #0d2818; text-transform: uppercase; letter-spacing: 0.06em; }
.review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 12px 16px; }
.review-item { padding: 6px 0; }
.review-item--full { grid-column: 1 / -1; }
.review-item span { display: block; font-size: 11px; color: #9ca3af; font-weight: 500; }
.review-item strong { display: block; font-size: 13px; color: #111827; font-weight: 600; margin-top: 2px; }
.review-notice { display: flex; align-items: flex-start; gap: 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 12px 14px; font-size: 12.5px; color: #0369a1; margin-top: 16px; }

/* ── errors ── */
.error-banner { background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #dc2626; margin-top: 16px; }

/* ── footer ── */
.form-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 28px; padding-top: 20px; border-top: 1px solid #f3f4f6; }
.btn-primary {
  background: #48AF4A; color: #fff; border: none; border-radius: 100px;
  padding: 11px 28px; font-size: 14px; font-weight: 700; cursor: pointer;
  font-family: inherit; display: inline-flex; align-items: center; gap: 6px;
  text-decoration: none; transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline {
  background: none; border: 1.5px solid #d1d5db; border-radius: 100px;
  padding: 10px 24px; font-size: 13.5px; font-weight: 600; color: #374151;
  cursor: pointer; font-family: inherit; transition: border-color 0.15s;
}
.btn-outline:hover { border-color: #48AF4A; color: #48AF4A; }

/* ── spinner ── */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── responsive ── */
@media (max-width: 600px) {
  .form-card { padding: 24px 16px; }
  .form-grid { grid-template-columns: 1fr; }
  .radio-group { grid-template-columns: 1fr; }
  .review-grid { grid-template-columns: 1fr; }
  .stepper__line { width: 24px; }
}
</style>
