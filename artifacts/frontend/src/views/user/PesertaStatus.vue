<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import api from "@/lib/api";

// ── State ──────────────────────────────────────────────────────
const pengajuanSaya  = ref<any>(null);
const pelaksanaanSaya = ref<any>(null);
const loadingPengajuan = ref(false);

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

// ── Polling ────────────────────────────────────────────────────
let pollTimer: ReturnType<typeof setInterval> | null = null;
function startPolling() { pollTimer = setInterval(refreshAll, 15000); }
function stopPolling()  { if (pollTimer !== null) { clearInterval(pollTimer); pollTimer = null; } }

onMounted(() => { refreshAll(); startPolling(); });
onUnmounted(() => stopPolling());

// ── Pipeline ───────────────────────────────────────────────────
const pipeline = computed(() => {
  const p   = pengajuanSaya.value;
  const pel = pelaksanaanSaya.value;

  const isVerified    = p   && ["diproses","diterima"].includes(p.status);
  const isDiterima    = p   && p.status === "diterima";
  const akunTerkirim  = p   && !!p.akun_terkirim_at;
  const pelAktif      = pel && ["aktif","upload_laporan","penilaian","selesai"].includes(pel.status);
  const uploadLaporan = pel && ["upload_laporan","penilaian","selesai"].includes(pel.status);
  const isPenilaian   = pel && ["penilaian","selesai"].includes(pel.status);
  const hasSertifikat = pel?.sertifikat_generated === true;

  return [
    {
      label: "Formulir Pengajuan Dikirim",
      sub: "Pengajuan berhasil diterima sistem",
      date: p ? formatTanggal(p.created_at) : null,
      done: !!p, active: false,
    },
    {
      label: "Akun Login Dikirim via Email",
      sub: "HRD mengirim akun agar Anda dapat memantau status pengajuan",
      date: akunTerkirim && p?.akun_terkirim_at ? formatTanggal(p.akun_terkirim_at) : null,
      done: akunTerkirim, active: !!p && !akunTerkirim,
    },
    {
      label: "Verifikasi Berkas HRD",
      sub: "Tim HRD mereview berkas dan upload surat balasan (3–5 hari kerja)",
      date: null,
      done: isVerified, active: akunTerkirim && !isVerified,
    },
    {
      label: "Pengajuan Diterima",
      sub: "Menunggu keputusan akhir HRD",
      date: isDiterima && p?.verified_at ? formatTanggal(p.verified_at) : null,
      done: isDiterima, active: isVerified && !isDiterima,
    },
    {
      label: "Pelaksanaan Magang Aktif",
      sub: "Jadwal magang belum ditetapkan",
      date: pelAktif && pel?.tanggal_mulai ? formatTanggal(pel.tanggal_mulai) : null,
      done: pelAktif, active: isDiterima && !pelAktif,
    },
    {
      label: "Upload Laporan Akhir",
      sub: "Upload laporan sebelum masa magang selesai",
      date: null,
      done: uploadLaporan, active: pelAktif && !uploadLaporan,
    },
    {
      label: "Penilaian Akhir oleh HRD",
      sub: "HRD akan memberikan nilai akhir",
      date: isPenilaian && pel?.dinilai_at ? formatTanggal(pel.dinilai_at) : null,
      done: isPenilaian, active: uploadLaporan && !isPenilaian,
    },
    {
      label: "Sertifikat Magang",
      sub: "Sertifikat akan di-generate setelah penilaian",
      date: hasSertifikat && pel?.sertifikat_generated_at ? formatTanggal(pel.sertifikat_generated_at) : null,
      done: hasSertifikat, active: isPenilaian && !hasSertifikat,
    },
  ];
});

// ── Helpers ────────────────────────────────────────────────────
function statusLabel(status: string) {
  const m: Record<string, string> = {
    diajukan: "Baru Diajukan", menunggu_verifikasi: "Menunggu Verifikasi",
    diproses: "Sedang Diproses", diterima: "Diterima", ditolak: "Ditolak",
  };
  return m[status] ?? status;
}

function statusBadgeClass(status: string) {
  const m: Record<string, string> = {
    diajukan: "badge badge--yellow", menunggu_verifikasi: "badge badge--yellow",
    diproses: "badge badge--blue", diterima: "badge badge--green", ditolak: "badge badge--red",
  };
  return m[status] ?? "badge badge--gray";
}

function kategoriLabel(val: string) {
  const m: Record<string, string> = {
    smk: "SMK / Sekolah Menengah Kejuruan",
    d3_s1_s2: "D3 / S1 / S2 (Perguruan Tinggi)",
    penelitian: "Penelitian / Riset",
  };
  return m[val] ?? val;
}

function formatTanggal(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
</script>

<style scoped>
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.badge--gray   { background: #f3f4f6; color: #6b7280; }
.badge--green  { background: #dcfce7; color: #16a34a; }
.badge--yellow { background: #fef9c3; color: #92400e; }
.badge--red    { background: #fef2f2; color: #dc2626; }
.badge--blue   { background: #eff6ff; color: #2563eb; }

.btn-green { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }
.btn-green:hover { background: #3d9e3f; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

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
.pipeline-item--done   .pipeline-dot { background: #0d2818; color: #86efac; border-color: #0d2818; }
.pipeline-item--active .pipeline-dot { background: #48AF4A; color: #fff; border-color: #48AF4A; box-shadow: 0 0 0 4px rgba(72,175,74,0.15); }
.pipeline-num { font-size: 11px; font-weight: 700; }
.pipeline-line { width: 2px; flex: 1; background: #e5e7eb; margin: 4px 0; min-height: 24px; }
.pipeline-line--done { background: #48AF4A; }
.pipeline-item__body { padding: 4px 0 24px; flex: 1; }
.pipeline-item:last-child .pipeline-item__body { padding-bottom: 0; }
.pipeline-item__title { font-size: 13px; font-weight: 600; color: #111827; }
.pipeline-item--done   .pipeline-item__title { color: #0d2818; }
.pipeline-item--active .pipeline-item__title { color: #0d2818; font-weight: 700; }
.pipeline-item__date { font-size: 11.5px; color: #16a34a; font-weight: 600; margin-top: 2px; }
.pipeline-item__sub  { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

.rejection-box { display: flex; align-items: center; gap: 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px 18px; }
.rejection-box__title { font-size: 14px; font-weight: 700; color: #dc2626; }
.rejection-box__sub   { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

.status-detail { padding: 20px; display: flex; flex-direction: column; gap: 18px; }
.status-detail__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.status-detail__label { font-size: 11px; color: #9ca3af; margin-bottom: 3px; }
.status-detail__value { font-size: 13.5px; font-weight: 600; color: #111827; }
.status-catatan { background: #fffbeb; border: 1px solid #fde68a; border-radius: 9px; padding: 12px 14px; }
.status-catatan__title { font-size: 11.5px; font-weight: 700; color: #92400e; margin-bottom: 5px; }
.status-catatan__body  { font-size: 13px; color: #78350f; line-height: 1.6; }
.info-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 9px; padding: 11px 14px; font-size: 12px; color: #1d4ed8; line-height: 1.6; }

.polling-bar {
  display: flex; align-items: center; gap: 6px;
  font-size: 11.5px; color: #9ca3af; padding: 10px 4px;
  border-top: 1px solid #f3f4f6; margin-top: 2px;
}

.spinner { width: 28px; height: 28px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 40px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 700px) { .status-detail__row { grid-template-columns: 1fr; } }
</style>
