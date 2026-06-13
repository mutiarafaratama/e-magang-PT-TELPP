<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Staff HRD" default-tab="beranda" ref="layout"
    @tab-change="onTabChange">
    <template #default>

      <!-- BERANDA ──────────────────────────────────────────────── -->
      <template v-if="activeTab === 'beranda'">
        <div class="welcome-banner">
          <div>
            <div class="welcome-banner__greeting">Halo, {{ firstName }}! 👋</div>
            <div class="welcome-banner__sub">Kelola seleksi dan pelaksanaan magang dari sini.</div>
          </div>
          <div class="welcome-banner__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
              <circle cx="9" cy="7" r="4" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="#86efac" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M16 3.13a4 4 0 010 7.75" stroke="#86efac" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fff7ed;color:#ea580c">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div>
              <div class="stat-card__label">Total Pengajuan</div>
              <div class="stat-card__value">{{ statsLoading ? '…' : totalAll }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fefce8;color:#ca8a04">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="stat-card__label">Menunggu Verifikasi</div>
              <div class="stat-card__value">{{ statsLoading ? '…' : totalPending }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <div class="stat-card__label">Diterima</div>
              <div class="stat-card__value">{{ statsLoading ? '…' : totalDiterima }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fef2f2;color:#dc2626">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="stat-card__label">Ditolak</div>
              <div class="stat-card__value">{{ statsLoading ? '…' : totalDitolak }}</div>
            </div>
          </div>
        </div>

        <!-- Perlu ditindaklanjuti -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pengajuan Perlu Ditindaklanjuti</h3>
            <span class="badge badge--yellow">{{ totalPending }} Pending</span>
          </div>
          <div v-if="statsLoading" class="empty-state"><div class="spinner"></div></div>
          <div v-else-if="pendingItems.length === 0" class="empty-state">
            <div class="empty-state__icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#d1d5db" stroke-width="1.5"/>
                <circle cx="9" cy="7" r="4" stroke="#d1d5db" stroke-width="1.5"/>
              </svg>
            </div>
            <p>Tidak ada pengajuan yang perlu diproses saat ini.</p>
          </div>
          <div v-else class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nama</th><th>Institusi</th><th>Kategori</th>
                  <th>Tanggal</th><th>Status</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pendingItems.slice(0, 5)" :key="p.id">
                  <td class="td-name">{{ p.nama_lengkap }}</td>
                  <td>{{ p.asal_institusi }}</td>
                  <td>{{ formatKategori(p.kategori_magang) }}</td>
                  <td>{{ formatDate(p.created_at) }}</td>
                  <td><span :class="statusBadgeClass(p.status)">{{ formatStatus(p.status) }}</span></td>
                  <td><button class="btn-detail" @click="goToVerifikasi">Tinjau</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="pendingItems.length > 5" class="card-footer">
            <button class="btn-link" @click="goToVerifikasi">Lihat semua {{ pendingItems.length }} pengajuan →</button>
          </div>
        </div>
      </template>

      <!-- VERIFIKASI BERKAS ────────────────────────────────────── -->
      <template v-else-if="activeTab === 'verifikasi'">
        <HRDVerifikasi @updated="fetchPengajuan" />
      </template>

      <!-- MENUNGGU PENEMPATAN ──────────────────────────────────── -->
      <template v-else-if="activeTab === 'peserta-penempatan'">
        <HRDPenempatanMenunggu />
      </template>

      <!-- SEDANG BERLANGSUNG ───────────────────────────────────── -->
      <template v-else-if="activeTab === 'peserta-berlangsung'">
        <HRDBerlangsung />
      </template>

      <!-- PLACEHOLDER TABS ─────────────────────────────────────── -->
      <template v-else-if="activeTab === 'absensi'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Rekap Absensi</h3>
            <button class="btn-green-sm">Export PDF</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada data absensi.</p>
          </div>
        </div>
      </template>

      <template v-else-if="activeTab === 'penilaian'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Penilaian Peserta</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada peserta yang perlu dinilai.</p>
          </div>
        </div>
      </template>

      <template v-else-if="activeTab === 'sertifikat'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Generate Sertifikat</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="#d1d5db" stroke-width="1.5"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada sertifikat yang dapat di-generate.</p>
          </div>
        </div>
      </template>

      <template v-else-if="activeTab === 'chat'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Chat Helpdesk</h3>
            <span class="badge badge--gray">0 Tiket</span>
          </div>
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
import { ref, computed, onMounted } from "vue";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import HRDVerifikasi from "./HRDVerifikasi.vue";
import HRDPenempatanMenunggu from "./HRDPenempatanMenunggu.vue";
import HRDBerlangsung from "./HRDBerlangsung.vue";

// ── auth ────────────────────────────────────────────────────────────
const { user } = useAuth();
const layout    = ref(null);
const activeTab = ref("beranda");
const firstName = computed(() => (user.value?.nama_lengkap ?? "HRD").split(" ")[0]);

// ── beranda stats state ─────────────────────────────────────────────
interface Pengajuan {
  id: string; nama_lengkap: string; asal_institusi: string;
  kategori_magang: string; status: string; created_at: string;
}
const allPengajuan  = ref<Pengajuan[]>([]);
const statsLoading  = ref(false);

const totalAll      = computed(() => allPengajuan.value.length);
const totalPending  = computed(() => allPengajuan.value.filter(p => ["diajukan","menunggu_verifikasi","diproses"].includes(p.status)).length);
const totalDiterima = computed(() => allPengajuan.value.filter(p => p.status === "diterima").length);
const totalDitolak  = computed(() => allPengajuan.value.filter(p => p.status === "ditolak").length);
const pendingItems  = computed(() => allPengajuan.value.filter(p => ["diajukan","menunggu_verifikasi","diproses"].includes(p.status)));

async function fetchPengajuan() {
  statsLoading.value = true;
  try {
    const res = await api.get("/api/pengajuan?page=1&limit=200");
    allPengajuan.value = Array.isArray(res.data.data) ? res.data.data : [];
  } catch {}
  finally { statsLoading.value = false; }
}

// ── nav ─────────────────────────────────────────────────────────────
const ICON = {
  home:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>`,
  verify:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/><polyline points="9 15 11 17 15 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  users:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>`,
  star:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>`,
  award:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="6" stroke="currentColor" stroke-width="2"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke="currentColor" stroke-width="2"/></svg>`,
  chat:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>`,
};

const navGroups = computed(() => [
  { items: [{ key:"beranda", label:"Beranda", icon: ICON.home }] },
  {
    label: "Seleksi & Verifikasi",
    items: [
      { key:"verifikasi", label:"Verifikasi Berkas", icon: ICON.verify, badge: totalPending.value || undefined },
      {
        key:"peserta", label:"Peserta Aktif", icon: ICON.users,
        children: [
          { key:"peserta-penempatan", label:"Menunggu Penempatan", icon:"" },
          { key:"peserta-berlangsung", label:"Sedang Berlangsung",  icon:"" },
        ],
      },
    ],
  },
  {
    label: "Pelaksanaan",
    items: [
      { key:"absensi",   label:"Rekap Absensi",     icon: ICON.calendar },
      { key:"penilaian", label:"Penilaian Peserta",  icon: ICON.star },
      { key:"sertifikat",label:"Sertifikat",         icon: ICON.award },
    ],
  },
  { label:"Komunikasi", items: [{ key:"chat", label:"Chat Helpdesk", icon: ICON.chat }] },
]);

// ── tab change ──────────────────────────────────────────────────────
function onTabChange(tab: string) {
  activeTab.value = tab;
  if (tab === "beranda") fetchPengajuan();
}

function goToVerifikasi() {
  activeTab.value = "verifikasi";
  if (layout.value) (layout.value as any).activeTab.value = "verifikasi";
}

// ── format helpers (beranda table) ──────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" });
}
function formatStatus(s: string) {
  return ({ diajukan:"Diajukan", menunggu_verifikasi:"Menunggu Verifikasi", diproses:"Diproses", diterima:"Diterima", ditolak:"Ditolak" } as Record<string,string>)[s] ?? s;
}
function statusBadgeClass(s: string) {
  const base = "status-badge ";
  if (s === "diterima") return base + "status-badge--green";
  if (s === "ditolak")  return base + "status-badge--red";
  if (s === "diproses") return base + "status-badge--blue";
  return base + "status-badge--yellow";
}
function formatKategori(k: string) {
  return ({ siswa_smk:"Siswa SMK", mahasiswa_d3:"Mahasiswa D3", mahasiswa_s1:"Mahasiswa S1", penelitian:"Penelitian" } as Record<string,string>)[k] ?? k;
}

onMounted(fetchPengajuan);
</script>

<style scoped>
/* ── welcome ── */
.welcome-banner { background:linear-gradient(135deg,#0d2818 0%,#1a5c20 100%); border-radius:14px; padding:24px 28px; color:#fff; display:flex; align-items:center; justify-content:space-between; gap:16px; }
.welcome-banner__greeting { font-size:17px; font-weight:700; }
.welcome-banner__sub { font-size:12.5px; color:rgba(255,255,255,0.65); margin-top:4px; }
.welcome-banner__icon { opacity:0.8; }
/* ── stats ── */
.stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.stat-card { background:#fff; border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px; border:1px solid #e9f5e9; box-shadow:0 1px 3px rgba(13,40,24,0.05); }
.stat-card__icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.stat-card__label { font-size:11px; color:#6b7280; font-weight:500; }
.stat-card__value { font-size:20px; font-weight:700; color:#111827; margin-top:1px; }
/* ── card ── */
.card { background:#fff; border-radius:14px; border:1px solid #e9f5e9; box-shadow:0 1px 3px rgba(13,40,24,0.05); overflow:hidden; }
.card-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #f0faf0; gap:12px; flex-wrap:wrap; }
.card-title { font-size:13.5px; font-weight:700; color:#111827; margin:0; }
.card-footer { padding:12px 20px; border-top:1px solid #f3f4f6; text-align:center; }
.btn-link { background:none; border:none; color:#48AF4A; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit; }
.btn-link:hover { text-decoration:underline; }
/* ── table ── */
.table-wrap { overflow-x:auto; }
.data-table { width:100%; border-collapse:collapse; font-size:13px; }
.data-table th { padding:11px 16px; text-align:left; font-size:10.5px; font-weight:600; color:#6b7280; background:#f9fafb; border-bottom:1px solid #f1f5f9; text-transform:uppercase; letter-spacing:0.04em; white-space:nowrap; }
.data-table td { padding:13px 16px; border-bottom:1px solid #f9fafb; color:#374151; vertical-align:middle; }
.td-name { min-width:140px; }
/* ── btn ── */
.btn-detail { background:#f3f4f6; color:#374151; border:none; border-radius:7px; padding:5px 11px; font-size:11.5px; font-weight:600; font-family:inherit; cursor:pointer; }
.btn-detail:hover { background:#e5e7eb; }
.btn-green-sm { background:#48AF4A; color:#fff; border:none; border-radius:8px; padding:6px 14px; font-size:12px; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; display:flex; align-items:center; gap:5px; }
.btn-green-sm:hover { background:#3d9e3f; }
/* ── badges ── */
.badge { padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; }
.badge--yellow { background:#fefce8; color:#ca8a04; }
.badge--gray   { background:#f3f4f6; color:#6b7280; }
.status-badge { padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; white-space:nowrap; }
.status-badge--yellow { background:#fefce8; color:#ca8a04; }
.status-badge--green  { background:#f0fdf4; color:#16a34a; }
.status-badge--red    { background:#fef2f2; color:#dc2626; }
.status-badge--blue   { background:#eff6ff; color:#2563eb; }
/* ── empty / spinner ── */
.empty-state { display:flex; flex-direction:column; align-items:center; padding:44px 24px; gap:12px; text-align:center; }
.empty-state__icon { width:72px; height:72px; background:#f9fafb; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.empty-state p { font-size:13px; color:#9ca3af; line-height:1.7; margin:0; }
.spinner { width:24px; height:24px; border:2.5px solid #e5e7eb; border-top-color:#48AF4A; border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@media (max-width:700px) { .stats-row { grid-template-columns:1fr 1fr; } }
@media (max-width:420px) { .stats-row { grid-template-columns:1fr; } }
</style>
