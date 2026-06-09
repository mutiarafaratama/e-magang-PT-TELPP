<template>
  <div class="dashboard">
    <!-- Sidebar -->
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
          <div class="sidebar__role">Peserta Magang</div>
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
        </button>
      </nav>

      <button class="sidebar__logout" @click="logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Keluar
      </button>
    </aside>

    <!-- Overlay mobile -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Main -->
    <div class="main">
      <header class="topbar">
        <button class="topbar__menu" @click="sidebarOpen = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <div class="topbar__title">{{ currentTabLabel }}</div>
        <div class="topbar__right">
          <button class="topbar__notif">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </header>

      <div class="content">
        <!-- Dashboard Overview -->
        <template v-if="activeTab === 'beranda'">
          <div class="welcome-banner">
            <div>
              <div class="welcome-banner__greeting">Selamat datang, {{ user?.nama_lengkap?.split(' ')[0] }}! 👋</div>
              <div class="welcome-banner__sub">Pantau perjalanan magangmu di sini.</div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__label">Status Pengajuan</div>
                <div class="stat-card__value">Belum Diajukan</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__label">Total Absensi</div>
                <div class="stat-card__value">0 Hari</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--yellow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__label">Nilai Akhir</div>
                <div class="stat-card__value">—</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-card__icon stat-card__icon--purple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.22 2.37a2 2 0 012-2.18H5a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2"/></svg>
              </div>
              <div class="stat-card__info">
                <div class="stat-card__label">Tiket Helpdesk</div>
                <div class="stat-card__value">0 Aktif</div>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-card__header">
              <h3>Langkah Selanjutnya</h3>
            </div>
            <div class="steps-list">
              <div class="step-item step-item--active">
                <div class="step-item__num">1</div>
                <div class="step-item__info">
                  <div class="step-item__title">Buat Pengajuan Magang</div>
                  <div class="step-item__desc">Lengkapi data diri dan informasi akademis Anda</div>
                </div>
                <button class="step-item__btn" @click="activeTab = 'pengajuan'">Mulai →</button>
              </div>
              <div class="step-item">
                <div class="step-item__num">2</div>
                <div class="step-item__info">
                  <div class="step-item__title">Upload Dokumen</div>
                  <div class="step-item__desc">KTP, KTM, proposal magang, dan dokumen pendukung</div>
                </div>
              </div>
              <div class="step-item">
                <div class="step-item__num">3</div>
                <div class="step-item__info">
                  <div class="step-item__title">Tunggu Verifikasi HRD</div>
                  <div class="step-item__desc">Tim HRD akan memverifikasi berkas Anda (3–5 hari kerja)</div>
                </div>
              </div>
              <div class="step-item">
                <div class="step-item__num">4</div>
                <div class="step-item__info">
                  <div class="step-item__title">Mulai Magang & Absensi Harian</div>
                  <div class="step-item__desc">Lakukan absensi setiap hari selama masa magang</div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Pengajuan -->
        <template v-else-if="activeTab === 'pengajuan'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Pengajuan Magang</h3>
              <span class="badge badge--gray">Belum Diajukan</span>
            </div>
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#d1d5db" stroke-width="1.5"/><polyline points="14 2 14 8 20 8" stroke="#d1d5db" stroke-width="1.5"/><line x1="16" y1="13" x2="8" y2="13" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/><polyline points="10 9 9 9 8 9" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/></svg>
              <p>Belum ada pengajuan magang.<br/>Silakan buat pengajuan baru.</p>
              <button class="btn-green">+ Buat Pengajuan</button>
            </div>
          </div>
        </template>

        <!-- Dokumen -->
        <template v-else-if="activeTab === 'dokumen'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Dokumen Saya</h3>
            </div>
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#d1d5db" stroke-width="1.5"/><polyline points="17 8 12 3 7 8" stroke="#d1d5db" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="15" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada dokumen terupload.<br/>Upload dokumen setelah mengisi pengajuan.</p>
            </div>
          </div>
        </template>

        <!-- Absensi -->
        <template v-else-if="activeTab === 'absensi'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Absensi Harian</h3>
            </div>
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="16" y1="2" x2="16" y2="6" stroke="#d1d5db" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Absensi harian tersedia setelah magang dimulai.</p>
            </div>
          </div>
        </template>

        <!-- Notifikasi -->
        <template v-else-if="activeTab === 'notifikasi'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Notifikasi</h3>
            </div>
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#d1d5db" stroke-width="1.5"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada notifikasi.</p>
            </div>
          </div>
        </template>

        <!-- Chat -->
        <template v-else-if="activeTab === 'chat'">
          <div class="section-card">
            <div class="section-card__header">
              <h3>Chat Helpdesk</h3>
              <button class="btn-green-sm">+ Buat Tiket</button>
            </div>
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#d1d5db" stroke-width="1.5"/></svg>
              <p>Belum ada tiket helpdesk.<br/>Buat tiket jika ada pertanyaan.</p>
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
  { key: "pengajuan", label: "Pengajuan Magang", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "dokumen", label: "Dokumen", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "absensi", label: "Absensi", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "notifikasi", label: "Notifikasi", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2"/></svg>` },
  { key: "chat", label: "Chat Helpdesk", icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>` },
];

const currentTabLabel = computed(() => navItems.find(i => i.key === activeTab.value)?.label ?? "Dashboard");
</script>

<style scoped>
* { box-sizing: border-box; }

.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
  font-family: "Poppins", sans-serif;
}

/* ── SIDEBAR ── */
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #0f2d14;
  display: flex;
  flex-direction: column;
  padding: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}
.sidebar__brand strong { color: #86efac; }

.sidebar__close { display: none; background: none; border: none; color: #fff; cursor: pointer; font-size: 16px; }

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.sidebar__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #48AF4A;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar__username {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.sidebar__role {
  font-size: 11px;
  color: #86efac;
  margin-top: 2px;
}

.sidebar__nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.65);
  font-size: 13px;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;
  width: 100%;
}

.nav-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
.nav-item--active { background: rgba(72,175,74,0.2); color: #86efac; }
.nav-item--active:hover { background: rgba(72,175,74,0.25); }

.nav-item__icon { display: flex; align-items: center; flex-shrink: 0; }

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  margin: 8px;
  border-radius: 8px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  font-size: 13px;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.sidebar__logout:hover { color: #fca5a5; background: rgba(239,68,68,0.1); }

/* ── MAIN ── */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 10;
}

.topbar__menu { display: none; background: none; border: none; cursor: pointer; color: #374151; padding: 4px; }
.topbar__title { font-size: 15px; font-weight: 700; color: #111827; flex: 1; }

.topbar__right { display: flex; align-items: center; gap: 8px; }
.topbar__notif { background: none; border: none; cursor: pointer; color: #6b7280; padding: 6px; border-radius: 8px; }
.topbar__notif:hover { background: #f3f4f6; }

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-banner {
  background: linear-gradient(135deg, #0f2d14, #1a4d1e);
  border-radius: 14px;
  padding: 24px 28px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-banner__greeting { font-size: 18px; font-weight: 700; }
.welcome-banner__sub { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
}

.stat-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-card__icon--blue { background: #eff6ff; color: #3b82f6; }
.stat-card__icon--green { background: #f0fdf4; color: #16a34a; }
.stat-card__icon--yellow { background: #fefce8; color: #ca8a04; }
.stat-card__icon--purple { background: #faf5ff; color: #9333ea; }

.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 14px; font-weight: 700; color: #111827; margin-top: 2px; }

.section-card {
  background: #fff;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  overflow: hidden;
}

.section-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #f1f5f9;
}

.section-card__header h3 {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.badge {
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
}
.badge--gray { background: #f3f4f6; color: #6b7280; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  gap: 12px;
  text-align: center;
}

.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.steps-list { padding: 16px 22px; display: flex; flex-direction: column; gap: 0; }

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #f8fafc;
}
.step-item:last-child { border-bottom: none; }

.step-item__num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.step-item--active .step-item__num { background: #48AF4A; color: #fff; }

.step-item__info { flex: 1; }
.step-item__title { font-size: 13px; font-weight: 600; color: #111827; }
.step-item__desc { font-size: 12px; color: #9ca3af; margin-top: 2px; }

.step-item__btn {
  background: #48AF4A;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  white-space: nowrap;
}

.btn-green {
  background: #48AF4A;
  color: #fff;
  border: none;
  border-radius: 9px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
}

.btn-green-sm {
  background: #48AF4A;
  color: #fff;
  border: none;
  border-radius: 7px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
}

.sidebar-overlay { display: none; }

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -240px;
    top: 0;
    z-index: 50;
    transition: left 0.25s ease;
    height: 100vh;
  }
  .sidebar--open { left: 0; }
  .sidebar__close { display: block; }
  .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 49; }
  .topbar__menu { display: flex; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .content { padding: 16px; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
