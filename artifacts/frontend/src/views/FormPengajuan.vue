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
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#dcfce7"/><path d="M7 12l3.5 3.5L17 8" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <h2>Pengajuan Berhasil Dikirim!</h2>
        <p>
          Terima kasih, <strong>{{ diri.nama_lengkap }}</strong>. Tim HRD PT TELPP akan meninjau
          pengajuan beserta dokumen Anda, kemudian mengirimkan akun login ke
          <strong>{{ diri.email }}</strong> setelah verifikasi selesai.
        </p>
        <div class="success-info">
          <div class="success-info__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#48AF4A" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#48AF4A" stroke-width="2" stroke-linecap="round"/></svg>
            Proses verifikasi 3–5 hari kerja
          </div>
          <div class="success-info__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#48AF4A" stroke-width="2"/><polyline points="22,6 12,13 2,6" stroke="#48AF4A" stroke-width="2"/></svg>
            Akun & password dikirim via email setelah diterima
          </div>
          <div class="success-info__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#48AF4A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#48AF4A" stroke-width="2" stroke-linecap="round"/></svg>
            {{ docsUploaded }} dokumen berhasil diupload
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
              <svg v-if="step > i" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
                  <div class="radio-card__icon">{{ k.icon }}</div>
                  <div class="radio-card__label">{{ k.label }}</div>
                  <div class="radio-card__sub">{{ k.sub }}</div>
                </label>
              </div>
            </div>
            <div class="field field--full">
              <label>Nama Institusi <span class="req">*</span></label>
              <input v-model="akademis.asal_institusi" type="text" placeholder="Nama universitas / sekolah / lembaga penelitian" />
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

        <!-- STEP 3: Upload Dokumen -->
        <div v-else-if="step === 2" class="form-section">
          <h3 class="section-title">Upload Dokumen</h3>
          <p class="section-sub">
            Upload dokumen persyaratan Anda. Pastikan file yang diupload jelas dan dapat terbaca.
          </p>

          <div class="upload-list">
            <!-- Proposal Magang -->
            <div class="upload-item" :class="{ 'upload-item--done': dokumenFiles.proposal_magang }">
              <div class="upload-item__left">
                <div class="upload-item__icon upload-item__icon--pdf">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                </div>
                <div class="upload-item__info">
                  <div class="upload-item__name">
                    Proposal Magang
                    <span class="badge-required">Wajib</span>
                  </div>
                  <div class="upload-item__hint">PDF, DOC, DOCX · Maks. 10MB</div>
                </div>
              </div>
              <div class="upload-item__right">
                <div v-if="dokumenFiles.proposal_magang" class="file-selected">
                  <span class="file-selected__name">{{ dokumenFiles.proposal_magang.name }}</span>
                  <button class="file-selected__remove" @click="removeFile('proposal_magang')" type="button">✕</button>
                </div>
                <label v-else class="btn-upload">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Pilih File
                  <input type="file" accept=".pdf,.doc,.docx" @change="onFilePick('proposal_magang', $event)" />
                </label>
              </div>
            </div>

            <!-- KTP (SMK) atau KTM (Mahasiswa/Penelitian) -->
            <div
              class="upload-item"
              :class="{ 'upload-item--done': akademis.kategori_magang === 'smk' ? dokumenFiles.ktp : dokumenFiles.ktm }"
            >
              <div class="upload-item__left">
                <div class="upload-item__icon upload-item__icon--id">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="2"/><path d="M14 9h4M14 12h4M14 15h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <div class="upload-item__info">
                  <div class="upload-item__name">
                    {{ akademis.kategori_magang === 'smk' ? 'KTP (Kartu Tanda Penduduk)' : 'KTM (Kartu Tanda Mahasiswa)' }}
                    <span class="badge-required">Wajib</span>
                  </div>
                  <div class="upload-item__hint">JPG, PNG, PDF · Maks. 10MB</div>
                </div>
              </div>
              <div class="upload-item__right">
                <template v-if="akademis.kategori_magang === 'smk'">
                  <div v-if="dokumenFiles.ktp" class="file-selected">
                    <span class="file-selected__name">{{ dokumenFiles.ktp.name }}</span>
                    <button class="file-selected__remove" @click="removeFile('ktp')" type="button">✕</button>
                  </div>
                  <label v-else class="btn-upload">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Pilih File
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" @change="onFilePick('ktp', $event)" />
                  </label>
                </template>
                <template v-else>
                  <div v-if="dokumenFiles.ktm" class="file-selected">
                    <span class="file-selected__name">{{ dokumenFiles.ktm.name }}</span>
                    <button class="file-selected__remove" @click="removeFile('ktm')" type="button">✕</button>
                  </div>
                  <label v-else class="btn-upload">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Pilih File
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" @change="onFilePick('ktm', $event)" />
                  </label>
                </template>
              </div>
            </div>

            <!-- Pasfoto -->
            <div class="upload-item" :class="{ 'upload-item--done': dokumenFiles.pasfoto }">
              <div class="upload-item__left">
                <div class="upload-item__icon upload-item__icon--photo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/></svg>
                </div>
                <div class="upload-item__info">
                  <div class="upload-item__name">
                    Pasfoto 3×4
                    <span class="badge-required">Wajib</span>
                  </div>
                  <div class="upload-item__hint">JPG, PNG · Maks. 5MB · Latar belakang merah/biru</div>
                </div>
              </div>
              <div class="upload-item__right">
                <div v-if="dokumenFiles.pasfoto" class="file-selected">
                  <span class="file-selected__name">{{ dokumenFiles.pasfoto.name }}</span>
                  <button class="file-selected__remove" @click="removeFile('pasfoto')" type="button">✕</button>
                </div>
                <label v-else class="btn-upload">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Pilih File
                  <input type="file" accept=".jpg,.jpeg,.png" @change="onFilePick('pasfoto', $event)" />
                </label>
              </div>
            </div>

            <!-- BPJS/KIS -->
            <div class="upload-item" :class="{ 'upload-item--done': dokumenFiles.bpjs_kis }">
              <div class="upload-item__left">
                <div class="upload-item__icon upload-item__icon--bpjs">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div class="upload-item__info">
                  <div class="upload-item__name">
                    Kartu BPJS / KIS
                    <span class="badge-optional">Opsional</span>
                  </div>
                  <div class="upload-item__hint">JPG, PNG, PDF · Maks. 5MB</div>
                </div>
              </div>
              <div class="upload-item__right">
                <div v-if="dokumenFiles.bpjs_kis" class="file-selected">
                  <span class="file-selected__name">{{ dokumenFiles.bpjs_kis.name }}</span>
                  <button class="file-selected__remove" @click="removeFile('bpjs_kis')" type="button">✕</button>
                </div>
                <label v-else class="btn-upload btn-upload--optional">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Pilih File
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" @change="onFilePick('bpjs_kis', $event)" />
                </label>
              </div>
            </div>
          </div>

          <div v-if="submitError && step === 2" class="error-banner">{{ submitError }}</div>
        </div>

        <!-- STEP 4: Review & Kirim -->
        <div v-else-if="step === 3" class="form-section">
          <h3 class="section-title">Periksa & Kirim</h3>
          <p class="review-sub">Pastikan semua data dan dokumen di bawah sudah benar.</p>

          <div class="review-block">
            <div class="review-block__title">Data Diri</div>
            <div class="review-grid">
              <div class="review-item"><span>Nama</span><strong>{{ diri.nama_lengkap }}</strong></div>
              <div class="review-item"><span>Tempat, Tgl Lahir</span><strong>{{ diri.tempat_lahir }}, {{ formatDate(diri.tanggal_lahir) }}</strong></div>
              <div class="review-item"><span>Jenis Kelamin</span><strong>{{ diri.jenis_kelamin === 'laki_laki' ? 'Laki-laki' : 'Perempuan' }}</strong></div>
              <div class="review-item"><span>No. HP</span><strong>{{ diri.no_hp }}</strong></div>
              <div class="review-item review-item--full"><span>Email</span><strong>{{ diri.email }}</strong></div>
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

          <div class="review-block">
            <div class="review-block__title">Dokumen yang Diupload</div>
            <div class="docs-review">
              <div v-for="d in docsReviewList" :key="d.jenis" class="doc-review-item">
                <div class="doc-review-item__icon" :class="d.done ? 'doc-icon--done' : 'doc-icon--missing'">
                  <svg v-if="d.done" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </div>
                <div class="doc-review-item__info">
                  <span class="doc-review-item__name">{{ d.label }}</span>
                  <span v-if="d.done" class="doc-review-item__file">{{ d.file }}</span>
                  <span v-else-if="d.required" class="doc-review-item__missing">Belum diupload</span>
                  <span v-else class="doc-review-item__optional">Tidak dilampirkan</span>
                </div>
                <span v-if="!d.required" class="badge-optional-sm">Opsional</span>
              </div>
            </div>
          </div>

          <div class="review-notice">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round"/></svg>
            Setelah pengajuan dikirim, tim HRD akan memverifikasi berkas dan mengirimkan akun login ke <strong>{{ diri.email }}</strong>.
          </div>

          <!-- Upload progress -->
          <div v-if="uploadStatus" class="upload-progress">
            <div class="upload-progress__bar">
              <div class="upload-progress__fill" :style="{ width: uploadPct + '%' }"></div>
            </div>
            <div class="upload-progress__text">{{ uploadStatus }}</div>
          </div>

          <div v-if="submitError && step === 3" class="error-banner">{{ submitError }}</div>
        </div>

        <!-- Footer actions -->
        <div class="form-footer">
          <button v-if="step > 0" class="btn-outline" @click="step--" :disabled="submitting">← Kembali</button>
          <div v-else></div>

          <button
            v-if="step < 3"
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
            {{ submitting ? uploadStatus || "Mengirim..." : "Kirim Pengajuan" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import api from "@/lib/api";

const STEPS = ["Data Diri", "Akademis", "Dokumen", "Review & Kirim"];

const KATEGORI = [
  { value: "smk",        label: "Siswa SMK",         sub: "Prakerin / PKL",           icon: "🏫" },
  { value: "d3_s1_s2",   label: "Mahasiswa D3/S1/S2", sub: "Program magang aktif",     icon: "🎓" },
  { value: "penelitian", label: "Penelitian / Riset",  sub: "Skripsi, tesis, disertasi", icon: "🔬" },
];

const step = ref(0);
const submitted = ref(false);
const submitting = ref(false);
const submitError = ref<string | null>(null);
const uploadStatus = ref("");
const uploadPct = ref(0);
const docsUploaded = ref(0);

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

const dokumenFiles = reactive<Record<string, File | null>>({
  proposal_magang: null,
  ktp: null,
  ktm: null,
  pasfoto: null,
  bpjs_kis: null,
});

function onFilePick(jenis: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  dokumenFiles[jenis] = file;
  input.value = "";
}

function removeFile(jenis: string) {
  dokumenFiles[jenis] = null;
}

const docsReviewList = computed(() => {
  const kat = akademis.kategori_magang;
  const items = [
    { jenis: "proposal_magang", label: "Proposal Magang", required: true, file: dokumenFiles.proposal_magang?.name ?? null, done: !!dokumenFiles.proposal_magang },
    ...(kat === "smk"
      ? [{ jenis: "ktp", label: "KTP", required: true, file: dokumenFiles.ktp?.name ?? null, done: !!dokumenFiles.ktp }]
      : [{ jenis: "ktm", label: "KTM", required: true, file: dokumenFiles.ktm?.name ?? null, done: !!dokumenFiles.ktm }]
    ),
    { jenis: "pasfoto", label: "Pasfoto 3×4", required: true, file: dokumenFiles.pasfoto?.name ?? null, done: !!dokumenFiles.pasfoto },
    { jenis: "bpjs_kis", label: "Kartu BPJS / KIS", required: false, file: dokumenFiles.bpjs_kis?.name ?? null, done: !!dokumenFiles.bpjs_kis },
  ];
  return items;
});

function formatDate(d: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function labelKategori(k: string) {
  return KATEGORI.find((c) => c.value === k)?.label ?? k;
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

function validateStep2(): string | null {
  if (!dokumenFiles.proposal_magang) return "Proposal Magang wajib diupload";
  if (akademis.kategori_magang === "smk" && !dokumenFiles.ktp)
    return "KTP wajib diupload untuk kategori SMK";
  if ((akademis.kategori_magang === "d3_s1_s2" || akademis.kategori_magang === "penelitian") && !dokumenFiles.ktm)
    return "KTM wajib diupload untuk mahasiswa / peneliti";
  if (!dokumenFiles.pasfoto) return "Pasfoto wajib diupload";
  return null;
}

function nextStep() {
  submitError.value = null;
  let err: string | null = null;
  if (step.value === 0) err = validateStep0();
  else if (step.value === 1) err = validateStep1();
  else if (step.value === 2) err = validateStep2();
  if (err) { submitError.value = err; return; }
  step.value++;
}

async function submitForm() {
  submitting.value = true;
  submitError.value = null;
  uploadStatus.value = "Mengirim data pengajuan...";
  uploadPct.value = 10;

  try {
    const res = await api.post("/api/pengajuan/publik", {
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

    const pengajuanId = res.data?.data?.id;
    if (!pengajuanId) throw new Error("ID pengajuan tidak diterima");

    const filesToUpload: Array<{ jenis: string; file: File }> = [];
    if (dokumenFiles.proposal_magang) filesToUpload.push({ jenis: "proposal_magang", file: dokumenFiles.proposal_magang });
    if (dokumenFiles.ktp) filesToUpload.push({ jenis: "ktp", file: dokumenFiles.ktp });
    if (dokumenFiles.ktm) filesToUpload.push({ jenis: "ktm", file: dokumenFiles.ktm });
    if (dokumenFiles.pasfoto) filesToUpload.push({ jenis: "pasfoto", file: dokumenFiles.pasfoto });
    if (dokumenFiles.bpjs_kis) filesToUpload.push({ jenis: "bpjs_kis", file: dokumenFiles.bpjs_kis });

    for (let i = 0; i < filesToUpload.length; i++) {
      const { jenis, file } = filesToUpload[i];
      uploadStatus.value = `Mengupload dokumen ${i + 1}/${filesToUpload.length}...`;
      uploadPct.value = 20 + Math.round(((i + 1) / filesToUpload.length) * 75);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("jenis", jenis);
      fd.append("pengajuan_id", pengajuanId);

      await api.post("/api/dokumen/upload-publik", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    docsUploaded.value = filesToUpload.length;
    uploadPct.value = 100;
    submitted.value = true;
  } catch (e: any) {
    submitError.value = e.response?.data?.message ?? "Terjadi kesalahan saat mengirim formulir. Silakan coba lagi.";
  } finally {
    submitting.value = false;
    uploadStatus.value = "";
  }
}
</script>

<style scoped>
/* ── layout ── */
.form-page { min-height: 100vh; background: #f0fdf4; font-family: "Poppins", "Segoe UI", sans-serif; }

/* ── navbar ── */
.form-nav { background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 20; }
.form-nav__inner { max-width: 800px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.form-nav__brand { display: flex; align-items: center; gap: 8px; text-decoration: none; font-size: 15px; font-weight: 700; color: #0b1c30; }
.form-nav__brand strong { color: #48AF4A; }
.form-nav__logo { height: 28px; width: auto; }
.form-nav__login { font-size: 13px; font-weight: 600; color: #48AF4A; text-decoration: none; }
.form-nav__login:hover { text-decoration: underline; }

/* ── success ── */
.success-wrap { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 60px); padding: 40px 24px; }
.success-card { background: #fff; border-radius: 20px; padding: 48px 40px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 4px 32px rgba(0,0,0,0.08); }
.success-icon { margin-bottom: 20px; }
.success-card h2 { font-size: 22px; font-weight: 800; color: #0d2818; margin: 0 0 12px; }
.success-card p { font-size: 14px; color: #64748b; line-height: 1.7; margin: 0 0 24px; }
.success-info { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.success-info__item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; background: #f0fdf4; border-radius: 8px; padding: 10px 14px; }

/* ── form wrap ── */
.form-wrap { display: flex; align-items: flex-start; justify-content: center; min-height: calc(100vh - 60px); padding: 40px 24px; }
.form-card { background: #fff; border-radius: 20px; padding: 40px; max-width: 760px; width: 100%; box-shadow: 0 4px 32px rgba(0,0,0,0.06); border: 1px solid #e9f5e9; margin-bottom: 40px; }

/* ── header ── */
.form-header { text-align: center; margin-bottom: 32px; }
.form-header h1 { font-size: 22px; font-weight: 800; color: #0d2818; margin: 0 0 6px; }
.form-header p { font-size: 13px; color: #6b7280; margin: 0; }

/* ── stepper ── */
.stepper { display: flex; align-items: center; justify-content: center; margin-bottom: 36px; flex-wrap: wrap; gap: 0; }
.stepper__item { display: flex; align-items: center; }
.stepper__circle {
  width: 30px; height: 30px; border-radius: 50%; border: 2px solid #d1d5db;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #9ca3af; background: #fff; flex-shrink: 0;
  transition: all 0.2s;
}
.stepper__item--active .stepper__circle { border-color: #48AF4A; color: #48AF4A; }
.stepper__item--done .stepper__circle { border-color: #48AF4A; background: #48AF4A; color: #fff; }
.stepper__label { font-size: 11.5px; font-weight: 600; color: #9ca3af; margin: 0 6px; white-space: nowrap; }
.stepper__item--active .stepper__label { color: #48AF4A; }
.stepper__item--done .stepper__label { color: #0d2818; }
.stepper__line { width: 36px; height: 2px; background: #e5e7eb; flex-shrink: 0; }
.stepper__item--done .stepper__line { background: #48AF4A; }

/* ── section title ── */
.section-title { font-size: 15px; font-weight: 700; color: #0d2818; margin: 0 0 6px; }
.section-sub { font-size: 13px; color: #6b7280; margin: 0 0 20px; }

/* ── form grid ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field label { font-size: 12.5px; font-weight: 600; color: #374151; }
.req { color: #ef4444; }
.field input, .field select, .field textarea {
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
  border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 14px 12px;
  cursor: pointer; transition: all 0.15s; display: flex; flex-direction: column; gap: 4px;
}
.radio-card input { display: none; }
.radio-card--active { border-color: #48AF4A; background: #f0fdf4; }
.radio-card__icon { font-size: 20px; margin-bottom: 4px; }
.radio-card__label { font-size: 12.5px; font-weight: 700; color: #111827; }
.radio-card__sub { font-size: 11px; color: #6b7280; line-height: 1.5; }
.radio-card--active .radio-card__label { color: #0d2818; }

/* ── upload list ── */
.upload-list { display: flex; flex-direction: column; gap: 10px; }
.upload-item {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 14px 16px;
  background: #fff; transition: border-color 0.15s;
}
.upload-item--done { border-color: #86efac; background: #f0fdf4; }
.upload-item__left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.upload-item__icon {
  width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.upload-item__icon--pdf { background: #fef2f2; color: #ef4444; }
.upload-item__icon--id { background: #eff6ff; color: #3b82f6; }
.upload-item__icon--photo { background: #f0fdf4; color: #16a34a; }
.upload-item__icon--bpjs { background: #faf5ff; color: #9333ea; }
.upload-item__info { flex: 1; min-width: 0; }
.upload-item__name { font-size: 13px; font-weight: 600; color: #0d2818; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.upload-item__hint { font-size: 11px; color: #9ca3af; margin-top: 2px; }
.upload-item__right { flex-shrink: 0; }

/* ── badge ── */
.badge-required { background: #fef2f2; color: #ef4444; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 100px; letter-spacing: 0.03em; }
.badge-optional { background: #f3f4f6; color: #6b7280; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 100px; }
.badge-optional-sm { background: #f3f4f6; color: #9ca3af; font-size: 10px; padding: 2px 6px; border-radius: 100px; flex-shrink: 0; }

/* ── btn-upload ── */
.btn-upload {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f0fdf4; border: 1.5px solid #86efac; color: #16a34a;
  border-radius: 8px; padding: 8px 14px; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap;
}
.btn-upload:hover { background: #dcfce7; border-color: #48AF4A; }
.btn-upload input { display: none; }
.btn-upload--optional { background: #f9fafb; border-color: #e5e7eb; color: #6b7280; }
.btn-upload--optional:hover { background: #f3f4f6; border-color: #d1d5db; color: #374151; }

/* ── file selected ── */
.file-selected { display: flex; align-items: center; gap: 8px; max-width: 200px; }
.file-selected__name { font-size: 12px; color: #0d2818; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
.file-selected__remove {
  width: 22px; height: 22px; border: none; background: #fee2e2; color: #ef4444;
  border-radius: 50%; font-size: 11px; cursor: pointer; display: flex; align-items: center;
  justify-content: center; flex-shrink: 0; transition: background 0.15s;
}
.file-selected__remove:hover { background: #fca5a5; }

/* ── review ── */
.review-sub { font-size: 13px; color: #6b7280; margin: 0 0 20px; }
.review-block { border: 1px solid #e9f5e9; border-radius: 12px; overflow: hidden; margin-bottom: 14px; }
.review-block__title { background: #f0fdf4; padding: 10px 16px; font-size: 11.5px; font-weight: 700; color: #0d2818; text-transform: uppercase; letter-spacing: 0.06em; }
.review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 12px 16px; }
.review-item { padding: 5px 0; }
.review-item--full { grid-column: 1 / -1; }
.review-item span { display: block; font-size: 11px; color: #9ca3af; font-weight: 500; }
.review-item strong { display: block; font-size: 13px; color: #111827; font-weight: 600; margin-top: 2px; }

/* ── docs review ── */
.docs-review { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.doc-review-item { display: flex; align-items: center; gap: 10px; }
.doc-review-item__icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.doc-icon--done { background: #dcfce7; color: #16a34a; }
.doc-icon--missing { background: #fef2f2; color: #ef4444; }
.doc-review-item__info { flex: 1; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.doc-review-item__name { font-size: 13px; font-weight: 600; color: #0d2818; }
.doc-review-item__file { font-size: 11.5px; color: #6b7280; }
.doc-review-item__missing { font-size: 11.5px; color: #ef4444; font-weight: 600; }
.doc-review-item__optional { font-size: 11.5px; color: #9ca3af; }

/* ── review notice ── */
.review-notice { display: flex; align-items: flex-start; gap: 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 10px; padding: 12px 14px; font-size: 12.5px; color: #0369a1; margin-top: 14px; }

/* ── upload progress ── */
.upload-progress { margin-top: 16px; }
.upload-progress__bar { height: 6px; background: #e5e7eb; border-radius: 100px; overflow: hidden; margin-bottom: 8px; }
.upload-progress__fill { height: 100%; background: #48AF4A; border-radius: 100px; transition: width 0.3s ease; }
.upload-progress__text { font-size: 12px; color: #48AF4A; font-weight: 600; text-align: center; }

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
.btn-outline:hover:not(:disabled) { border-color: #48AF4A; color: #48AF4A; }
.btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── spinner ── */
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── responsive ── */
@media (max-width: 600px) {
  .form-card { padding: 24px 16px; }
  .form-grid { grid-template-columns: 1fr; }
  .radio-group { grid-template-columns: 1fr; }
  .review-grid { grid-template-columns: 1fr; }
  .stepper__line { width: 20px; }
  .stepper__label { font-size: 10px; }
  .upload-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .upload-item__right { width: 100%; }
  .file-selected { max-width: 100%; }
}
</style>
