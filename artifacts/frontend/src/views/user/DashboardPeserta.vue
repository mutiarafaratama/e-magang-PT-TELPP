<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Peserta Magang" default-tab="beranda" ref="layout">
    <template #default>

      <!-- ── BERANDA ── -->
      <template v-if="activeTab === 'beranda'">
        <div class="welcome-banner">
          <div class="welcome-banner__left">
            <div class="welcome-banner__greeting">Selamat datang, {{ firstName }}!</div>
            <div class="welcome-banner__sub">Pantau perjalanan magang Anda dari sini.</div>
          </div>
          <div class="welcome-banner__date">
            <div class="welcome-date__day">{{ todayDay }}</div>
            <div class="welcome-date__info">{{ todayDate }}</div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div>
              <div class="stat-card__label">Status Pengajuan</div>
              <div class="stat-card__value">{{ statusPengajuanLabel }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#eff6ff;color:#3b82f6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Total Absensi</div><div class="stat-card__value">0 Hari</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fefce8;color:#ca8a04">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Nilai Akhir</div><div class="stat-card__value">—</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fdf4ff;color:#9333ea">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Tiket Helpdesk</div><div class="stat-card__value">0 Aktif</div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Panduan Langkah Magang</h3>
          </div>
          <div class="steps">
            <div :class="['step', pengajuanSaya ? 'step--done' : 'step--active']">
              <div class="step__num">
                <svg v-if="pengajuanSaya" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span v-else>1</span>
              </div>
              <div class="step__body">
                <div class="step__title">{{ pengajuanSaya ? 'Formulir Terkirim' : 'Isi Formulir Pengajuan' }}</div>
                <div class="step__desc">{{ pengajuanSaya ? formatTanggal(pengajuanSaya.created_at) : 'Formulir sudah diisi via portal publik' }}</div>
              </div>
            </div>
            <div :class="['step', pengajuanSaya && ['diterima'].includes(pengajuanSaya.status) ? 'step--done' : pengajuanSaya ? 'step--active' : '']">
              <div class="step__num">2</div>
              <div class="step__body">
                <div class="step__title">Verifikasi HRD</div>
                <div class="step__desc">Tim HRD mereview berkas dalam 3–5 hari kerja</div>
              </div>
            </div>
            <div :class="['step', pengajuanSaya?.akun_terkirim_at ? 'step--done' : '']">
              <div class="step__num">3</div>
              <div class="step__body">
                <div class="step__title">Terima Akun & Upload Berkas</div>
                <div class="step__desc">{{ pengajuanSaya?.akun_terkirim_at ? 'Akun sudah dikirim ke email' : 'Akun login dikirim ke email setelah diterima' }}</div>
              </div>
            </div>
            <div :class="['step', pelaksanaanSaya ? 'step--active' : '']">
              <div class="step__num">4</div>
              <div class="step__body">
                <div class="step__title">Mulai Magang & Absensi Harian</div>
                <div class="step__desc">Lakukan absensi setiap hari selama masa magang</div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ── STATUS MAGANG ── -->
      <template v-else-if="activeTab === 'status'">
        <div v-if="loadingPengajuan" class="card">
          <div class="empty-state"><div class="spinner"></div></div>
        </div>

        <!-- Tidak ada pengajuan -->
        <div v-else-if="!pengajuanSaya" class="card">
          <div class="empty-state">
            <div class="empty-state__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#d1d5db" stroke-width="1.5"/><polyline points="14 2 14 8 20 8" stroke="#d1d5db" stroke-width="1.5"/></svg>
            </div>
            <p>Belum ada data pengajuan yang terhubung ke akun Anda.<br/>Silakan isi formulir di halaman publik.</p>
            <a href="/" class="btn-green" style="text-decoration:none">Ke Halaman Utama →</a>
          </div>
        </div>

        <!-- Ditolak -->
        <div v-else-if="pengajuanSaya.status === 'ditolak'" class="card">
          <div class="card-header">
            <h3 class="card-title">Status Pengajuan</h3>
            <span class="badge badge--red">Ditolak</span>
          </div>
          <div class="status-detail">
            <div class="rejection-box">
              <div class="rejection-box__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#dc2626" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div>
                <div class="rejection-box__title">Pengajuan Tidak Dapat Diterima</div>
                <div class="rejection-box__sub">Dikirim {{ formatTanggal(pengajuanSaya.created_at) }}</div>
              </div>
            </div>
            <div v-if="pengajuanSaya.catatan_hrd" class="status-catatan">
              <div class="status-catatan__title">Catatan dari HRD:</div>
              <div class="status-catatan__body">{{ pengajuanSaya.catatan_hrd }}</div>
            </div>
            <div class="info-box">
              Anda dapat mengajukan kembali pada periode berikutnya melalui halaman utama.
            </div>
          </div>
        </div>

        <!-- Status pipeline -->
        <div v-else class="card">
          <div class="card-header">
            <h3 class="card-title">Status Magang Saya</h3>
            <span :class="['badge', statusBadgeClass(pengajuanSaya.status)]">{{ statusLabel(pengajuanSaya.status) }}</span>
          </div>
          <div class="pipeline">
            <div
              v-for="(item, i) in pipeline"
              :key="i"
              :class="['pipeline-item', item.done ? 'pipeline-item--done' : item.active ? 'pipeline-item--active' : '']"
            >
              <div class="pipeline-item__left">
                <div class="pipeline-dot">
                  <svg v-if="item.done" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else-if="item.active" width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>
                  <span v-else class="pipeline-num">{{ i + 1 }}</span>
                </div>
                <div v-if="i < pipeline.length - 1" class="pipeline-line" :class="item.done ? 'pipeline-line--done' : ''"></div>
              </div>
              <div class="pipeline-item__body">
                <div class="pipeline-item__title">{{ item.label }}</div>
                <div v-if="item.date" class="pipeline-item__date">{{ item.date }}</div>
                <div v-else class="pipeline-item__sub">{{ item.sub }}</div>
              </div>
            </div>
          </div>

          <div v-if="pengajuanSaya.catatan_hrd" class="status-catatan" style="margin:0 20px 16px">
            <div class="status-catatan__title">Catatan dari HRD:</div>
            <div class="status-catatan__body">{{ pengajuanSaya.catatan_hrd }}</div>
          </div>
        </div>

        <!-- Info detail pengajuan -->
        <div v-if="pengajuanSaya" class="card">
          <div class="card-header"><h3 class="card-title">Detail Pengajuan</h3></div>
          <div class="status-detail">
            <div class="status-detail__row">
              <div class="status-detail__item">
                <div class="status-detail__label">Nama Lengkap</div>
                <div class="status-detail__value">{{ pengajuanSaya.nama_lengkap }}</div>
              </div>
              <div class="status-detail__item">
                <div class="status-detail__label">Institusi</div>
                <div class="status-detail__value">{{ pengajuanSaya.asal_institusi }}</div>
              </div>
              <div class="status-detail__item">
                <div class="status-detail__label">Jurusan</div>
                <div class="status-detail__value">{{ pengajuanSaya.jurusan }}</div>
              </div>
              <div class="status-detail__item">
                <div class="status-detail__label">Kategori</div>
                <div class="status-detail__value">{{ kategoriLabel(pengajuanSaya.kategori_magang) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auto-refresh indicator -->
        <div class="polling-bar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Diperbarui otomatis setiap 15 detik
          <span v-if="lastRefreshedText"> · {{ lastRefreshedText }}</span>
        </div>
      </template>

      <!-- ── DOKUMEN ── -->
      <template v-else-if="activeTab === 'dokumen'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Dokumen Saya</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#d1d5db" stroke-width="1.5"/><polyline points="17 8 12 3 7 8" stroke="#d1d5db" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="15" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada dokumen terupload.<br/>Upload dokumen setelah magang dikonfirmasi HRD.</p>
          </div>
        </div>
      </template>

      <!-- ── ABSENSI ── -->
      <template v-else-if="activeTab === 'absensi'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Absensi Harian</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Absensi tersedia setelah magang dimulai.</p>
          </div>
        </div>
      </template>

      <!-- ── NOTIFIKASI ── -->
      <template v-else-if="activeTab === 'notifikasi'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Notifikasi</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#d1d5db" stroke-width="1.5"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada notifikasi.</p>
          </div>
        </div>
      </template>

      <!-- ── CHAT ── -->
      <template v-else-if="activeTab === 'chat'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Chat Helpdesk</h3>
            <button class="btn-green-sm">+ Buat Tiket</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada tiket helpdesk.</p>
          </div>
        </div>
      </template>

    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const { user } = useAuth();
const layout = ref<InstanceType<typeof DashboardLayout> | null>(null);
const activeTab = computed(() => layout.value?.activeTab ?? "beranda");

const firstName = computed(() => user.value?.nama_lengkap?.split(" ")[0] ?? "");

const now = new Date();
const todayDay = now.toLocaleDateString("id-ID", { weekday: "long" });
const todayDate = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// ── Pengajuan state ──────────────────────────────────────────
const pengajuanSaya = ref<any>(null);
const loadingPengajuan = ref(false);
const pelaksanaanSaya = ref<any>(null);

const lastRefreshed = ref<Date | null>(null);
const lastRefreshedText = computed(() => {
  if (!lastRefreshed.value) return "";
  const diff = Math.floor((Date.now() - lastRefreshed.value.getTime()) / 1000);
  if (diff < 5) return "Baru saja";
  if (diff < 60) return `${diff} detik lalu`;
  return `${Math.floor(diff / 60)} menit lalu`;
});

async function fetchPengajuanSaya() {
  try {
    loadingPengajuan.value = true;
    const res = await api.get("/api/pengajuan/saya");
    pengajuanSaya.value = res.data?.data ?? null;
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 204) {
      pengajuanSaya.value = null;
    }
  } finally {
    loadingPengajuan.value = false;
  }
}

async function fetchPelaksanaanSaya() {
  try {
    const res = await api.get("/api/pelaksanaan/saya");
    pelaksanaanSaya.value = res.data?.data ?? null;
  } catch {
    pelaksanaanSaya.value = null;
  }
}

async function refreshAll() {
  await Promise.all([fetchPengajuanSaya(), fetchPelaksanaanSaya()]);
  lastRefreshed.value = new Date();
}

// ── Polling 15 detik ─────────────────────────────────────────
let pollTimer: ReturnType<typeof setInterval> | null = null;

function startPolling() {
  stopPolling();
  pollTimer = setInterval(() => { refreshAll(); }, 15000);
}

function stopPolling() {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

onMounted(() => {
  refreshAll();
  startPolling();
});

onUnmounted(() => {
  stopPolling();
});

// ── Pipeline computed ────────────────────────────────────────
const pipeline = computed(() => {
  const p = pengajuanSaya.value;
  const pel = pelaksanaanSaya.value;

  const isVerified   = p && ["diproses", "diterima"].includes(p.status);
  const isDiterima   = p && p.status === "diterima";
  const akunTerkirim = p && !!p.akun_terkirim_at;
  const pelAktif     = pel && ["aktif","upload_laporan","penilaian","selesai"].includes(pel.status);
  const uploadLaporan = pel && ["upload_laporan","penilaian","selesai"].includes(pel.status);
  const isPenilaian  = pel && ["penilaian","selesai"].includes(pel.status);
  const isSelesai    = pel && pel.status === "selesai";
  const hasSertifikat = pel?.sertifikat_generated === true;

  const items = [
    {
      label: "Formulir Pengajuan Dikirim",
      sub: "Pengajuan berhasil diterima sistem",
      date: p ? formatTanggal(p.created_at) : null,
      done: !!p,
      active: false,
    },
    {
      label: "Verifikasi Berkas HRD",
      sub: "Sedang diproses tim HRD (3–5 hari kerja)",
      date: null,
      done: isVerified,
      active: !isVerified && !!p,
    },
    {
      label: "Pengajuan Diterima",
      sub: "Menunggu keputusan HRD",
      date: isDiterima && p?.verified_at ? formatTanggal(p.verified_at) : null,
      done: isDiterima,
      active: isVerified && !isDiterima,
    },
    {
      label: "Akun Login Dikirim via Email",
      sub: "HRD akan membuat dan mengirim akun login",
      date: akunTerkirim && p?.akun_terkirim_at ? formatTanggal(p.akun_terkirim_at) : null,
      done: akunTerkirim,
      active: isDiterima && !akunTerkirim,
    },
    {
      label: "Pelaksanaan Magang Aktif",
      sub: "Jadwal magang belum ditetapkan",
      date: pelAktif && pel?.tanggal_mulai ? formatTanggal(pel.tanggal_mulai) : null,
      done: pelAktif,
      active: akunTerkirim && !pelAktif,
    },
    {
      label: "Upload Laporan Akhir",
      sub: "Upload laporan sebelum masa magang selesai",
      date: null,
      done: uploadLaporan,
      active: pelAktif && !uploadLaporan,
    },
    {
      label: "Penilaian Akhir oleh HRD",
      sub: "HRD akan memberikan nilai akhir",
      date: isPenilaian && pel?.dinilai_at ? formatTanggal(pel.dinilai_at) : null,
      done: isPenilaian,
      active: uploadLaporan && !isPenilaian,
    },
    {
      label: "Sertifikat Magang",
      sub: "Sertifikat akan di-generate setelah penilaian",
      date: hasSertifikat && pel?.sertifikat_generated_at ? formatTanggal(pel.sertifikat_generated_at) : null,
      done: hasSertifikat,
      active: isPenilaian && !hasSertifikat,
    },
  ];

  return items;
});

const statusPengajuanLabel = computed(() => {
  if (!pengajuanSaya.value) return "Belum Diajukan";
  return statusLabel(pengajuanSaya.value.status);
});

// ── Formatting helpers ───────────────────────────────────────
function statusLabel(status: string) {
  const m: Record<string, string> = {
    diajukan:            "Baru Diajukan",
    menunggu_verifikasi: "Menunggu Verifikasi",
    diproses:            "Sedang Diproses",
    diterima:            "Diterima",
    ditolak:             "Ditolak",
  };
  return m[status] ?? status;
}

function statusBadgeClass(status: string) {
  const m: Record<string, string> = {
    diajukan:            "badge badge--yellow",
    menunggu_verifikasi: "badge badge--yellow",
    diproses:            "badge badge--blue",
    diterima:            "badge badge--green",
    ditolak:             "badge badge--red",
  };
  return m[status] ?? "badge badge--gray";
}

function kategoriLabel(val: string) {
  const m: Record<string, string> = {
    smk:        "SMK / Sekolah Menengah Kejuruan",
    d3_s1_s2:  "D3 / S1 / S2 (Perguruan Tinggi)",
    penelitian: "Penelitian / Riset",
  };
  return m[val] ?? val;
}

function formatTanggal(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// ── Nav ──────────────────────────────────────────────────────
const ICON = {
  home:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>`,
  status:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  upload:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>`,
  bell:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2"/></svg>`,
  chat:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>`,
};

const navGroups = [
  {
    items: [
      { key: "beranda", label: "Beranda", icon: ICON.home },
    ],
  },
  {
    label: "Magang Saya",
    items: [
      { key: "status",   label: "Status Magang", icon: ICON.status },
      { key: "dokumen",  label: "Dokumen Saya",  icon: ICON.upload },
      { key: "absensi",  label: "Absensi Harian", icon: ICON.calendar },
    ],
  },
  {
    label: "Komunikasi",
    items: [
      { key: "notifikasi", label: "Notifikasi",    icon: ICON.bell },
      { key: "chat",       label: "Chat Helpdesk", icon: ICON.chat },
    ],
  },
];
</script>

<style scoped>
/* ── Banner & Stats ─────────────────────────────────────────── */
.welcome-banner {
  background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%);
  border-radius: 14px; padding: 24px 28px; color: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.welcome-banner__greeting { font-size: 17px; font-weight: 700; }
.welcome-banner__sub { font-size: 12.5px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.welcome-date__day { font-size: 22px; font-weight: 800; color: #86efac; text-align: right; }
.welcome-date__info { font-size: 11px; color: rgba(255,255,255,0.55); text-align: right; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat-card {
  background: #fff; border-radius: 12px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
  border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05);
}
.stat-card__icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 13.5px; font-weight: 700; color: #111827; margin-top: 2px; }

/* ── Card ───────────────────────────────────────────────────── */
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

/* ── Badges ─────────────────────────────────────────────────── */
.badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.badge--gray   { background: #f3f4f6; color: #6b7280; }
.badge--green  { background: #dcfce7; color: #16a34a; }
.badge--yellow { background: #fef9c3; color: #92400e; }
.badge--red    { background: #fef2f2; color: #dc2626; }
.badge--blue   { background: #eff6ff; color: #2563eb; }

/* ── Steps (panduan beranda) ────────────────────────────────── */
.steps { padding: 8px 20px 16px; display: flex; flex-direction: column; gap: 0; }
.step { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8faf8; }
.step:last-child { border-bottom: none; }
.step__num { width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; color: #9ca3af; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step--active .step__num { background: #48AF4A; color: #fff; }
.step--done .step__num { background: #0d2818; color: #86efac; }
.step__body { flex: 1; }
.step__title { font-size: 13px; font-weight: 600; color: #111827; }
.step__desc { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

/* ── Empty state ────────────────────────────────────────────── */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

/* ── Buttons ────────────────────────────────────────────────── */
.btn-green { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }
.btn-green:hover { background: #3d9e3f; }
.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }

/* ── Pipeline ───────────────────────────────────────────────── */
.pipeline { padding: 20px 24px; display: flex; flex-direction: column; gap: 0; }
.pipeline-item { display: flex; gap: 14px; }
.pipeline-item__left { display: flex; flex-direction: column; align-items: center; }
.pipeline-dot {
  width: 28px; height: 28px; border-radius: 50%;
  background: #f3f4f6; color: #9ca3af;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 11px; font-weight: 700; border: 2px solid #e5e7eb;
  transition: all 0.2s;
}
.pipeline-item--done .pipeline-dot { background: #0d2818; color: #86efac; border-color: #0d2818; }
.pipeline-item--active .pipeline-dot { background: #48AF4A; color: #fff; border-color: #48AF4A; box-shadow: 0 0 0 4px rgba(72,175,74,0.15); }
.pipeline-num { font-size: 11px; font-weight: 700; }
.pipeline-line { width: 2px; flex: 1; background: #e5e7eb; margin: 4px 0; min-height: 24px; }
.pipeline-line--done { background: #48AF4A; }
.pipeline-item__body { padding: 4px 0 24px; flex: 1; }
.pipeline-item:last-child .pipeline-item__body { padding-bottom: 0; }
.pipeline-item__title { font-size: 13px; font-weight: 600; color: #111827; }
.pipeline-item--done .pipeline-item__title { color: #0d2818; }
.pipeline-item--active .pipeline-item__title { color: #0d2818; font-weight: 700; }
.pipeline-item__date { font-size: 11.5px; color: #16a34a; font-weight: 600; margin-top: 2px; }
.pipeline-item__sub { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

/* ── Rejection box ──────────────────────────────────────────── */
.rejection-box { display: flex; align-items: center; gap: 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px 18px; }
.rejection-box__title { font-size: 14px; font-weight: 700; color: #dc2626; }
.rejection-box__sub { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

/* ── Status detail ──────────────────────────────────────────── */
.status-detail { padding: 20px; display: flex; flex-direction: column; gap: 18px; }
.status-detail__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.status-detail__label { font-size: 11px; color: #9ca3af; margin-bottom: 3px; }
.status-detail__value { font-size: 13.5px; font-weight: 600; color: #111827; }
.status-catatan { background: #fffbeb; border: 1px solid #fde68a; border-radius: 9px; padding: 12px 14px; }
.status-catatan__title { font-size: 11.5px; font-weight: 700; color: #92400e; margin-bottom: 5px; }
.status-catatan__body { font-size: 13px; color: #78350f; line-height: 1.6; }
.info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9px; padding: 11px 14px; font-size: 12px; color: #1d4ed8; line-height: 1.6; }

/* ── Polling bar ────────────────────────────────────────────── */
.polling-bar {
  display: flex; align-items: center; gap: 6px;
  font-size: 11.5px; color: #9ca3af; padding: 10px 4px;
  border-top: 1px solid #f3f4f6; margin-top: 2px;
}

/* ── Spinner ────────────────────────────────────────────────── */
.spinner { width: 28px; height: 28px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 40px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Responsive ─────────────────────────────────────────────── */
@media (max-width: 700px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .welcome-date__day, .welcome-date__info { display: none; }
  .status-detail__row { grid-template-columns: 1fr; }
}
@media (max-width: 420px) {
  .stats-row { grid-template-columns: 1fr; }
}
</style>
