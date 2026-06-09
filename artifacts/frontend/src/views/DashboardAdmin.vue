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
          <div class="sidebar__role">Super Admin</div>
        </div>
      </div>

      <nav class="sidebar__nav">
        <button
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ 'nav-item--active': activeTab === item.key }"
          @click="handleNav(item)"
        >
          <span class="nav-item__icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
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
        <div class="topbar__badge">Admin</div>
      </header>

      <div class="content">
        <!-- Beranda -->
        <template v-if="activeTab === 'beranda'">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Total User</div>
                <div class="stat-card__value">2</div>
                <div class="stat-card__sub">Admin & HRD</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Periode Aktif</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Landing Content</div>
                <div class="stat-card__value">6</div>
                <div class="stat-card__sub">item tersimpan</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div>
                <div class="stat-card__label">FAQ Aktif</div>
                <div class="stat-card__value">6</div>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h3 class="quick-actions__title">Akses Cepat</h3>
            <div class="quick-actions__grid">
              <button class="quick-btn" @click="activeTab = 'users'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
                Manajemen User
              </button>
              <button class="quick-btn" @click="activeTab = 'periode'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>
                Kelola Periode
              </button>
              <button class="quick-btn" @click="goToLandingSettings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/></svg>
                Edit Landing Page
              </button>
              <button class="quick-btn" @click="activeTab = 'statistik'">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Statistik
              </button>
            </div>
          </div>
        </template>

        <!-- Manajemen User -->
        <template v-else-if="activeTab === 'users'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Manajemen User</h3>
              <button class="btn-primary-sm">+ Tambah User</button>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Super Admin</td>
                    <td>admin@telpp.co.id</td>
                    <td><span class="role-badge role-badge--admin">Admin</span></td>
                    <td><span class="status-badge status-badge--active">Aktif</span></td>
                    <td><button class="action-btn">Edit</button></td>
                  </tr>
                  <tr>
                    <td>Staff HRD</td>
                    <td>hrd@telpp.co.id</td>
                    <td><span class="role-badge role-badge--hrd">HRD</span></td>
                    <td><span class="status-badge status-badge--active">Aktif</span></td>
                    <td><button class="action-btn">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>

        <!-- Periode Magang -->
        <template v-else-if="activeTab === 'periode'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Periode Magang</h3>
              <button class="btn-primary-sm">+ Tambah Periode</button>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada periode magang.<br/>Tambahkan periode baru untuk membuka pendaftaran.</p>
              <button class="btn-primary-sm">+ Buat Periode Baru</button>
            </div>
          </div>
        </template>

        <!-- Landing Page -->
        <template v-else-if="activeTab === 'landing'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Landing Page Settings</h3>
              <button class="btn-primary-sm" @click="goToLandingSettings">Buka Editor →</button>
            </div>
            <div class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d1d5db" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Kelola konten landing page dari halaman editor.</p>
              <button class="btn-primary-sm" @click="goToLandingSettings">Buka Editor Landing Page</button>
            </div>
          </div>
        </template>

        <!-- Statistik -->
        <template v-else-if="activeTab === 'statistik'">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Total Peserta</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Selesai Magang</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Rata-rata Nilai</div>
                <div class="stat-card__value">—</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--red">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div>
                <div class="stat-card__label">Sertifikat Diterbitkan</div>
                <div class="stat-card__value">0</div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/hooks/useAuth";

const { user, logout } = useAuth();
const router = useRouter();
const activeTab = ref("beranda");
const sidebarOpen = ref(false);

const initials = computed(() => {
  const name = user.value?.nama_lengkap ?? "";
  return name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase();
});

function goToLandingSettings() {
  router.push("/admin/landing-settings");
}

function handleNav(item: { key: string; label: string; route?: string }) {
  if (item.route) {
    router.push(item.route);
  } else {
    activeTab.value = item.key;
    sidebarOpen.value = false;
  }
}

const navItems = [
  { key: "beranda", label: "Beranda", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "users", label: "Manajemen User", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "periode", label: "Periode Magang", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "landing", label: "Landing Page", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "statistik", label: "Statistik", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
];

const currentTabLabel = computed(() => navItems.find(i => i.key === activeTab.value)?.label ?? "Dashboard Admin");
</script>

<style scoped>
* { box-sizing: border-box; }

.dashboard { display: flex; min-height: 100vh; background: #f8fafc; font-family: "Poppins", sans-serif; }

.sidebar { width: 240px; flex-shrink: 0; background: #1e1b4b; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }

.sidebar__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sidebar__brand { display: flex; align-items: center; gap: 8px; color: #fff; font-size: 13px; font-weight: 700; }
.sidebar__brand strong { color: #c4b5fd; }
.sidebar__close { display: none; background: none; border: none; color: #fff; cursor: pointer; font-size: 16px; }

.sidebar__user { display: flex; align-items: center; gap: 11px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
.sidebar__avatar { width: 36px; height: 36px; border-radius: 50%; background: #7c3aed; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sidebar__username { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
.sidebar__role { font-size: 11px; color: #c4b5fd; margin-top: 2px; }

.sidebar__nav { flex: 1; padding: 12px 10px; display: flex; flex-direction: column; gap: 2px; }

.nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; background: none; border: none; color: rgba(255,255,255,0.65); font-size: 13px; font-family: "Poppins", sans-serif; font-weight: 500; cursor: pointer; text-align: left; transition: background 0.15s, color 0.15s; width: 100%; }
.nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
.nav-item--active { background: rgba(124,58,237,0.25); color: #c4b5fd; }
.nav-item__icon { display: flex; align-items: center; flex-shrink: 0; }

.sidebar__logout { display: flex; align-items: center; gap: 8px; padding: 14px 22px; margin: 8px; border-radius: 8px; background: none; border: none; color: rgba(255,255,255,0.4); font-size: 13px; font-family: "Poppins", sans-serif; cursor: pointer; transition: color 0.15s, background 0.15s; }
.sidebar__logout:hover { color: #fca5a5; background: rgba(239,68,68,0.1); }

.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

.topbar { display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 60px; background: #fff; border-bottom: 1px solid #f1f5f9; position: sticky; top: 0; z-index: 10; }
.topbar__menu { display: none; background: none; border: none; cursor: pointer; color: #374151; padding: 4px; }
.topbar__title { font-size: 15px; font-weight: 700; color: #111827; flex: 1; }
.topbar__badge { background: #f5f3ff; color: #7c3aed; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }

.content { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: #fff; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
.stat-card__icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__icon--blue { background: #eff6ff; color: #3b82f6; }
.stat-card__icon--green { background: #f0fdf4; color: #16a34a; }
.stat-card__icon--yellow { background: #fefce8; color: #ca8a04; }
.stat-card__icon--red { background: #fff1f2; color: #e11d48; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 18px; font-weight: 700; color: #111827; margin-top: 2px; }
.stat-card__sub { font-size: 11px; color: #9ca3af; }

.quick-actions { }
.quick-actions__title { font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 12px; }
.quick-actions__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.quick-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 20px 12px; background: #fff; border: 1.5px solid #f1f5f9; border-radius: 12px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; color: #374151; cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s; text-align: center; }
.quick-btn:hover { border-color: #7c3aed; color: #7c3aed; box-shadow: 0 4px 12px rgba(124,58,237,0.1); }

.section-card { background: #fff; border-radius: 14px; border: 1px solid #f1f5f9; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
.section-card__header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #f1f5f9; }
.section-card__header h3 { font-size: 14px; font-weight: 700; color: #111827; margin: 0; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px 24px; gap: 12px; text-align: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.04em; }
.data-table td { padding: 14px 16px; border-bottom: 1px solid #f9fafb; color: #374151; }

.role-badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.role-badge--admin { background: #f5f3ff; color: #7c3aed; }
.role-badge--hrd { background: #eff6ff; color: #3b82f6; }

.status-badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.status-badge--active { background: #f0fdf4; color: #16a34a; }

.action-btn { background: none; border: 1px solid #e5e7eb; border-radius: 6px; padding: 4px 12px; font-size: 12px; font-family: "Poppins", sans-serif; cursor: pointer; color: #374151; transition: all 0.15s; }
.action-btn:hover { border-color: #7c3aed; color: #7c3aed; }

.btn-primary-sm { background: #7c3aed; color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }

.sidebar-overlay { display: none; }

@media (max-width: 768px) {
  .sidebar { position: fixed; left: -240px; top: 0; z-index: 50; transition: left 0.25s ease; height: 100vh; }
  .sidebar--open { left: 0; }
  .sidebar__close { display: block; }
  .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 49; }
  .topbar__menu { display: flex; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .quick-actions__grid { grid-template-columns: 1fr 1fr; }
  .content { padding: 16px; }
}
</style>
