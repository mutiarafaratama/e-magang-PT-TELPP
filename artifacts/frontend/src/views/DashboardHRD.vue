<template>
  <div class="dashboard">
    <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">
      <div class="sidebar__header">
        <div class="sidebar__brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#86efac"/>
          </svg>
          <span>e-Magang <strong>PT TELPP</strong></span>
        </div>
        <button class="sidebar__close" @click="sidebarOpen = false">✕</button>
      </div>

      <div class="sidebar__user">
        <div class="sidebar__avatar">{{ initials }}</div>
        <div class="sidebar__userinfo">
          <div class="sidebar__username">{{ user?.nama_lengkap }}</div>
          <div class="sidebar__role">Staff HRD</div>
        </div>
      </div>

      <nav class="sidebar__nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ 'nav-item--active': activeTab === item.key }"
          @click="activeTab = item.key; sidebarOpen = false"
        >
          <span class="nav-item__icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </button>
      </nav>

      <button class="sidebar__logout" @click="logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Keluar
      </button>
    </aside>

    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <div class="main">
      <header class="topbar">
        <button class="topbar__menu" @click="sidebarOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <div class="topbar__title">{{ currentTabLabel }}</div>
        <div class="topbar__badge">HRD</div>
      </header>

      <div class="content">
        <!-- Beranda -->
        <template v-if="activeTab === 'beranda'">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Total Pendaftar</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Menunggu Verifikasi</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Peserta Aktif</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Tiket Helpdesk</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-card__header">
              <h3>Pengajuan Perlu Ditindaklanjuti</h3>
              <span class="badge badge--yellow">0 Pending</span>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#d1d5db" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Tidak ada pengajuan yang perlu diproses saat ini.</p>
            </div>
          </div>
        </template>

        <!-- Verifikasi Berkas -->
        <template v-else-if="activeTab === 'verifikasi'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Verifikasi Berkas Peserta</h3>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nama Peserta</th>
                    <th>Institusi</th>
                    <th>Kategori</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td colspan="5" class="table-empty">Belum ada data pengajuan</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- Peserta Aktif -->
        <template v-else-if="activeTab === 'peserta'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Peserta Magang Aktif</h3>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#d1d5db" stroke-width="1.5"/><circle cx="9" cy="7" r="4" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada peserta magang aktif.</p>
            </div>
          </div>
        </template>

        <!-- Absensi -->
        <template v-else-if="activeTab === 'absensi'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Rekap Absensi</h3>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada data absensi.</p>
            </div>
          </div>
        </template>

        <!-- Penilaian -->
        <template v-else-if="activeTab === 'penilaian'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Penilaian Peserta</h3>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada peserta yang perlu dinilai.</p>
            </div>
          </div>
        </template>

        <!-- Chat -->
        <template v-else-if="activeTab === 'chat'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Chat Helpdesk</h3>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada tiket masuk dari peserta.</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth } from "@/hooks/useAuth";

const { user, logout } = useAuth();
const activeTab = ref("beranda");
const sidebarOpen = ref(false);

const initials = computed(() => {
  const name = user.value?.nama_lengkap ?? "";
  return name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
});

const navItems = [
  { key: "beranda", label: "Beranda", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "verifikasi", label: "Verifikasi Berkas", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/><polyline points="9 15 11 17 15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
  { key: "peserta", label: "Peserta Aktif", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "absensi", label: "Absensi", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "penilaian", label: "Penilaian", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "chat", label: "Chat Helpdesk", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>` },
];

const currentTabLabel = computed(() => navItems.find(i => i.key === activeTab.value)?.label ?? "Dashboard HRD");
</script>

<style scoped>
* { box-sizing: border-box; }

.dashboard { display: flex; min-height: 100vh; background: #f8fafc; font-family: "Poppins", sans-serif; }

.sidebar { width: 240px; flex-shrink: 0; background: #1a3a6e; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }

.sidebar__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }

.sidebar__brand { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 13px; font-weight: 700; }
.sidebar__brand strong { color: #93c5fd; }
.sidebar__close { display: none; background: none; border: none; color: #fff; cursor: pointer; font-size: 16px; }

.sidebar__user { display: flex; align-items: center; gap: 11px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sidebar__avatar { width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sidebar__username { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
.sidebar__role { font-size: 11px; color: #93c5fd; margin-top: 2px; }

.sidebar__nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }

.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; background: none; border: none; color: rgba(255,255,255,0.65); font-size: 13px; font-family: "Poppins", sans-serif; font-weight: 500; cursor: pointer; text-align: left; transition: background 0.15s, color 0.15s; width: 100%; }
.nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-item--active { background: rgba(59,130,246,0.25); color: #93c5fd; }
.nav-item__icon { display: flex; align-items: center; flex-shrink: 0; }

.nav-badge { margin-left: auto; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; border-radius: 100px; padding: 1px 7px; }

.sidebar__logout { display: flex; align-items: center; gap: 8px; padding: 14px 22px; margin: 8px; border-radius: 8px; background: none; border: none; color: rgba(255,255,255,0.4); font-size: 13px; font-family: "Poppins", sans-serif; cursor: pointer; transition: color 0.15s, background 0.15s; }
.sidebar__logout:hover { color: #fca5a5; background: rgba(239,68,68,0.1); }

.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

.topbar { display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 60px; background: #fff; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 10; }
.topbar__menu { display: none; background: none; border: none; cursor: pointer; color: #374151; padding: 4px; }
.topbar__title { font-size: 15px; font-weight: 700; color: #111827; flex: 1; }
.topbar__badge { background: #eff6ff; color: #3b82f6; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }

.content { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

.stat-card { background: #fff; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
.stat-card__icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__icon--orange { background: #fff7ed; color: #ea580c; }
.stat-card__icon--yellow { background: #fefce8; color: #ca8a04; }
.stat-card__icon--green { background: #f0fdf4; color: #16a34a; }
.stat-card__icon--purple { background: #faf5ff; color: #9333ea; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 18px; font-weight: 700; color: #111827; margin-top: 2px; }

.section-card { background: #fff; border-radius: 14px; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
.section-card__header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f1f5f9; }
.section-card__header h3 { font-size: 14px; font-weight: 700; color: #111827; margin: 0; }

.badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.badge--yellow { background: #fefce8; color: #ca8a04; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px 24px; gap: 12px; text-align: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.04em; }
.data-table td { padding: 14px 16px; border-bottom: 1px solid #f9fafb; color: #374151; }
.table-empty { text-align: center; color: #9ca3af; padding: 32px 16px; }

.sidebar-overlay { display: none; }

@media (max-width: 768px) {
  .sidebar { position: fixed; left: -240px; top: 0; z-index: 50; transition: left 0.25s ease; height: 100vh; }
  .sidebar--open { left: 0; }
  .sidebar__close { display: block; }
  .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 49; }
  .topbar__menu { display: flex; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .content { padding: 16px; }
}
</style>
