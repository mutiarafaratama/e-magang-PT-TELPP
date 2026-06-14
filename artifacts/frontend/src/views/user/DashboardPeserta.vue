<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Peserta Magang" default-tab="beranda" ref="layout"
    @tab-change="onTabChange">
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
                <div class="step__desc">{{ pengajuanSaya?.akun_terkirim_at ? 'Akun sudah dikirim ke email' : 'HRD akan mengirim akun ke email untuk pantau status' }}</div>
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

      <!-- ── DOKUMEN ── -->
      <template v-else-if="activeTab === 'dokumen'">
        <PesertaDokumen />
      </template>

      <!-- ── ABSENSI ── -->
      <template v-else-if="activeTab === 'absensi'">
        <PesertaAbsensi />
      </template>

      <!-- ── CHAT ── -->
      <template v-else-if="activeTab === 'chat'">
        <PesertaChat />
      </template>

      <!-- ── PROFIL ── -->
      <template v-else-if="activeTab === 'profil'">
        <PesertaProfil />
      </template>

    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import PesertaDokumen from "./PesertaDokumen.vue";
import PesertaAbsensi from "./PesertaAbsensi.vue";
import PesertaChat    from "./PesertaChat.vue";
import PesertaProfil  from "./PesertaProfil.vue";

const { user } = useAuth();
const layout    = ref<InstanceType<typeof DashboardLayout> | null>(null);
const activeTab = ref("beranda");
const firstName = computed(() => user.value?.nama_lengkap?.split(" ")[0] ?? "");

const now       = new Date();
const todayDay  = now.toLocaleDateString("id-ID", { weekday: "long" });
const todayDate = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

const pengajuanSaya   = ref<any>(null);
const pelaksanaanSaya = ref<any>(null);

const statusPengajuanLabel = computed(() => {
  if (!pengajuanSaya.value) return "Belum Diajukan";
  const m: Record<string, string> = {
    diajukan: "Baru Diajukan", menunggu_verifikasi: "Menunggu Verifikasi",
    diproses: "Sedang Diproses", diterima: "Diterima", ditolak: "Ditolak",
  };
  return m[pengajuanSaya.value.status] ?? pengajuanSaya.value.status;
});

function formatTanggal(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

async function fetchBeranda() {
  try {
    const [r1, r2] = await Promise.allSettled([
      api.get("/api/pengajuan/saya"),
      api.get("/api/pelaksanaan/saya"),
    ]);
    pengajuanSaya.value   = r1.status === "fulfilled" ? (r1.value.data?.data ?? null) : null;
    pelaksanaanSaya.value = r2.status === "fulfilled" ? (r2.value.data?.data ?? null) : null;
  } catch { /* silent */ }
}

function onTabChange(tab: string) {
  activeTab.value = tab;
  if (tab === "beranda") fetchBeranda();
}

const ICON = {
  home:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>`,
  upload:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>`,
  chat:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>`,
  profil:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>`,
};

const navGroups = [
  { items: [{ key: "beranda", label: "Beranda", icon: ICON.home }] },
  {
    label: "Magang Saya",
    items: [
      { key: "dokumen",  label: "Dokumen Saya",   icon: ICON.upload },
      { key: "absensi",  label: "Absensi Harian", icon: ICON.calendar },
    ],
  },
  {
    label: "Komunikasi",
    items: [
      { key: "chat", label: "Chat Helpdesk", icon: ICON.chat },
    ],
  },
  {
    label: "Akun",
    items: [
      { key: "profil", label: "Profil Saya", icon: ICON.profil },
    ],
  },
];

onMounted(fetchBeranda);
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%);
  border-radius: 14px; padding: 24px 28px; color: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.welcome-banner__greeting { font-size: 17px; font-weight: 700; }
.welcome-banner__sub { font-size: 12.5px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.welcome-date__day  { font-size: 22px; font-weight: 800; color: #86efac; text-align: right; }
.welcome-date__info { font-size: 11px; color: rgba(255,255,255,0.55); text-align: right; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat-card {
  background: #fff; border-radius: 12px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
  border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05);
}
.stat-card__icon  { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 13.5px; font-weight: 700; color: #111827; margin-top: 2px; }

.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.steps { padding: 8px 20px 16px; display: flex; flex-direction: column; gap: 0; }
.step { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8faf8; }
.step:last-child { border-bottom: none; }
.step__num { width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; color: #9ca3af; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step--active .step__num { background: #48AF4A; color: #fff; }
.step--done   .step__num { background: #0d2818; color: #86efac; }
.step__body  { flex: 1; }
.step__title { font-size: 13px; font-weight: 600; color: #111827; }
.step__desc  { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

@media (max-width: 700px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .welcome-date__day, .welcome-date__info { display: none; }
}
@media (max-width: 420px) { .stats-row { grid-template-columns: 1fr; } }
</style>
