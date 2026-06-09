<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Staff HRD" default-tab="beranda" ref="layout">
    <template #default>

      <!-- ── BERANDA ── -->
      <template v-if="activeTab === 'beranda'">
        <div class="welcome-banner">
          <div>
            <div class="welcome-banner__greeting">Halo, {{ firstName }}! 👋</div>
            <div class="welcome-banner__sub">Kelola seleksi dan pelaksanaan magang dari sini.</div>
          </div>
          <div class="welcome-banner__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke="#86efac" stroke-width="1.5" stroke-linecap="round"/><path d="M16 3.13a4 4 0 010 7.75" stroke="#86efac" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fff7ed;color:#ea580c">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Total Pendaftar</div><div class="stat-card__value">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fefce8;color:#ca8a04">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div><div class="stat-card__label">Menunggu Verifikasi</div><div class="stat-card__value">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <div><div class="stat-card__label">Peserta Aktif</div><div class="stat-card__value">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fdf4ff;color:#9333ea">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Tiket Helpdesk</div><div class="stat-card__value">0</div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pengajuan Perlu Ditindaklanjuti</h3>
            <span class="badge badge--yellow">0 Pending</span>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#d1d5db" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Tidak ada pengajuan yang perlu diproses saat ini.</p>
          </div>
        </div>
      </template>

      <!-- ── VERIFIKASI ── -->
      <template v-else-if="activeTab === 'verifikasi'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Verifikasi Berkas Peserta</h3>
            <span class="badge badge--yellow">0 Menunggu</span>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Nama Peserta</th><th>Institusi</th><th>Kategori</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody><tr><td colspan="6" class="table-empty">Belum ada data pengajuan</td></tr></tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ── PESERTA AKTIF ── -->
      <template v-else-if="activeTab === 'peserta'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Peserta Magang Aktif</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#d1d5db" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada peserta magang aktif.</p>
          </div>
        </div>
      </template>

      <!-- ── ABSENSI ── -->
      <template v-else-if="activeTab === 'absensi'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Rekap Absensi</h3>
            <button class="btn-green-sm">Export PDF</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada data absensi.</p>
          </div>
        </div>
      </template>

      <!-- ── PENILAIAN ── -->
      <template v-else-if="activeTab === 'penilaian'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Penilaian Peserta</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada peserta yang perlu dinilai.</p>
          </div>
        </div>
      </template>

      <!-- ── SERTIFIKAT ── -->
      <template v-else-if="activeTab === 'sertifikat'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Generate Sertifikat</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="#d1d5db" stroke-width="1.5"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada sertifikat yang dapat di-generate.</p>
          </div>
        </div>
      </template>

      <!-- ── CHAT ── -->
      <template v-else-if="activeTab === 'chat'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Chat Helpdesk</h3><span class="badge badge--gray">0 Tiket</span></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada tiket masuk dari peserta.</p>
          </div>
        </div>
      </template>

    </template>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuth } from "@/hooks/useAuth";

const { user } = useAuth();
const layout = ref<InstanceType<typeof DashboardLayout> | null>(null);
const activeTab = computed(() => layout.value?.activeTab ?? "beranda");
const firstName = computed(() => user.value?.nama_lengkap?.split(" ")[0] ?? "");

const ICON = {
  home:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>`,
  verify:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/><polyline points="9 15 11 17 15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  users:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>`,
  calendar:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>`,
  star:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>`,
  award:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="2"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" stroke-width="2"/></svg>`,
  chat:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>`,
};

const navGroups = [
  {
    items: [
      { key: "beranda", label: "Beranda", icon: ICON.home },
    ],
  },
  {
    label: "Seleksi & Verifikasi",
    items: [
      { key: "verifikasi", label: "Verifikasi Berkas", icon: ICON.verify },
      { key: "peserta",    label: "Peserta Aktif",     icon: ICON.users },
    ],
  },
  {
    label: "Pelaksanaan",
    items: [
      { key: "absensi",    label: "Rekap Absensi",     icon: ICON.calendar },
      { key: "penilaian",  label: "Penilaian Peserta", icon: ICON.star },
      { key: "sertifikat", label: "Sertifikat",        icon: ICON.award },
    ],
  },
  {
    label: "Komunikasi",
    items: [
      { key: "chat", label: "Chat Helpdesk", icon: ICON.chat },
    ],
  },
];
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%);
  border-radius: 14px;
  padding: 24px 28px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.welcome-banner__greeting { font-size: 17px; font-weight: 700; }
.welcome-banner__sub { font-size: 12.5px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.welcome-banner__icon { opacity: 0.8; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat-card { background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); }
.stat-card__icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 20px; font-weight: 700; color: #111827; margin-top: 1px; }

.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.badge--yellow { background: #fefce8; color: #ca8a04; }
.badge--gray { background: #f3f4f6; color: #6b7280; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.04em; }
.data-table td { padding: 13px 16px; border-bottom: 1px solid #f9fafb; color: #374151; }
.table-empty { text-align: center; color: #9ca3af; padding: 32px 16px; }

.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; white-space: nowrap; }

@media (max-width: 700px) { .stats-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 420px) { .stats-row { grid-template-columns: 1fr; } }
</style>
