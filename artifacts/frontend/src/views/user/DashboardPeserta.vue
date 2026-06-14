<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Peserta Magang" default-tab="beranda" ref="layout"
    @tab-change="onTabChange">
    <template #default>

      <!-- ══════════════════════════════════════════════════════════ -->
      <!--  BERANDA                                                   -->
      <!-- ══════════════════════════════════════════════════════════ -->
      <template v-if="activeTab === 'beranda'">

        <!-- ── Welcome Banner ────────────────────────────────────── -->
        <div class="welcome-banner">
          <div class="wb-left">
            <div class="wb-greeting">Selamat datang, {{ firstName }}!</div>
            <div class="wb-sub">{{ todayFull }}</div>
          </div>
          <div v-if="pelaksanaan && pelaksanaan.status === 'aktif'" class="wb-right">
            <template v-if="sisaHari > 0">
              <div class="wb-num">{{ sisaHari }}</div>
              <div class="wb-lbl">hari&nbsp;lagi</div>
            </template>
            <template v-else>
              <div class="wb-num">🎉</div>
              <div class="wb-lbl">Selesai hari ini!</div>
            </template>
            <div class="wb-progress-wrap">
              <div class="wb-progress-bar" :style="{ width: progressMagang + '%' }"></div>
            </div>
            <div class="wb-hari-ke">Hari ke-{{ hariKe }} dari {{ totalHariMagang }}</div>
          </div>
        </div>

        <!-- ── Row: Status Magang + Aksi Cepat ───────────────────── -->
        <div class="top-row">

          <!-- Status Magang -->
          <div class="card status-card">
            <div class="sc-top">
              <div class="sc-title">Status Magang</div>
              <span :class="['sc-badge', `sc-badge--${pelaksanaan?.status ?? 'none'}`]">
                {{ statusLabel }}
              </span>
            </div>
            <div v-if="pelaksanaan" class="sc-items">
              <div class="sc-item">
                <span class="sc-lbl">Divisi</span>
                <span class="sc-val">{{ pelaksanaan.divisi ?? '—' }}</span>
              </div>
              <div class="sc-item">
                <span class="sc-lbl">Periode</span>
                <span class="sc-val">{{ fmtDate(pelaksanaan.tanggal_mulai) }} – {{ fmtDate(pelaksanaan.tanggal_selesai) }}</span>
              </div>
              <div class="sc-item">
                <span class="sc-lbl">Nilai Akhir</span>
                <span class="sc-val" :style="pelaksanaan.nilai ? 'color:#16a34a;font-weight:700' : ''">
                  {{ pelaksanaan.nilai != null ? pelaksanaan.nilai.toFixed(1) : '—' }}
                </span>
              </div>
            </div>
            <div v-else class="sc-empty">Data magang belum tersedia</div>
          </div>

          <!-- Aksi Cepat -->
          <div class="card aksi-card">
            <div class="sc-title">Aksi Cepat</div>
            <div class="aksi-grid">
              <!-- Check-In / Check-Out -->
              <template v-if="pelaksanaan?.status === 'aktif'">
                <button v-if="!todayAbsensi || !todayAbsensi.jam_masuk"
                  class="aksi-btn aksi-btn--green" @click="doCheckIn" :disabled="aksiLoading">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ aksiLoading ? 'Memproses…' : 'Check-In' }}
                </button>
                <button v-else-if="todayAbsensi && !todayAbsensi.jam_keluar"
                  class="aksi-btn aksi-btn--blue" @click="doCheckOut" :disabled="aksiLoading">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ aksiLoading ? 'Memproses…' : 'Check-Out' }}
                </button>
                <div v-else class="aksi-done">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Absen selesai hari ini
                </div>
              </template>
              <div v-else class="aksi-done" style="color:#9ca3af">Magang belum aktif</div>

              <button class="aksi-btn aksi-btn--yellow" @click="switchTab('absensi')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Ajukan Izin / Sakit
              </button>

              <button class="aksi-btn aksi-btn--purple" @click="switchTab('chat')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>
                Chat Helpdesk
              </button>

              <button class="aksi-btn aksi-btn--gray" @click="switchTab('dokumen')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>
                Upload Dokumen
              </button>
            </div>

            <!-- Flash message -->
            <div v-if="aksiMsg" :class="['aksi-flash', aksiMsg.ok ? 'aksi-flash--ok' : 'aksi-flash--err']">
              {{ aksiMsg.text }}
            </div>
          </div>
        </div>

        <!-- ── Rekap Absensi Bulan Ini ────────────────────────────── -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Rekap Absensi — {{ bulanIniLabel }}</h3>
            <div v-if="absensiLoading" class="spinner spinner--sm"></div>
          </div>

          <!-- 4 chip + progress -->
          <div class="rekap-row">
            <div class="rekap-chip rekap-chip--green">
              <div class="rc-num">{{ rekapBulan.hadir }}</div>
              <div class="rc-lbl">Hadir</div>
            </div>
            <div class="rekap-chip rekap-chip--yellow">
              <div class="rc-num">{{ rekapBulan.izin }}</div>
              <div class="rc-lbl">Izin</div>
            </div>
            <div class="rekap-chip rekap-chip--blue">
              <div class="rc-num">{{ rekapBulan.sakit }}</div>
              <div class="rc-lbl">Sakit</div>
            </div>
            <div class="rekap-chip rekap-chip--red">
              <div class="rc-num">{{ rekapBulan.alpha }}</div>
              <div class="rc-lbl">Alpha</div>
            </div>
            <div class="rekap-progress">
              <div class="rp-header">
                <span class="rp-label">Kehadiran</span>
                <span class="rp-pct" :style="{ color: kehadiranPct >= 80 ? '#16a34a' : kehadiranPct >= 60 ? '#ca8a04' : '#dc2626' }">
                  {{ kehadiranPct }}%
                </span>
              </div>
              <div class="rp-track">
                <div class="rp-fill"
                  :style="{ width: kehadiranPct + '%', background: kehadiranPct >= 80 ? '#48AF4A' : kehadiranPct >= 60 ? '#eab308' : '#ef4444' }">
                </div>
              </div>
              <div class="rp-sub">{{ rekapBulan.hadir + rekapBulan.izin + rekapBulan.sakit }} dari {{ totalHariKerja }} hari kerja tercatat</div>
            </div>
          </div>

          <!-- Mini Kalender -->
          <div class="mini-cal">
            <div class="mc-days-header">
              <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span>
            </div>
            <div class="mc-grid">
              <div v-for="cell in calendarCells" :key="cell.key"
                :class="['mc-cell', cell.cls]" :title="cell.title">
                <span>{{ cell.d }}</span>
              </div>
            </div>
            <div class="mc-legend">
              <span class="mc-leg mc-leg--green">Hadir</span>
              <span class="mc-leg mc-leg--yellow">Izin</span>
              <span class="mc-leg mc-leg--blue">Sakit</span>
              <span class="mc-leg mc-leg--red">Alpha</span>
              <span class="mc-leg mc-leg--future">Akan datang</span>
            </div>
          </div>
        </div>

        <!-- ── Row: Dokumen + Notifikasi ──────────────────────────── -->
        <div class="bottom-row">

          <!-- Status Dokumen -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Status Dokumen</h3>
              <span class="dok-count">{{ dokUploaded }}/{{ dokumenStatus.length }}</span>
            </div>
            <div class="dok-list">
              <div v-for="dok in dokumenStatus" :key="dok.jenis" class="dok-item">
                <div :class="['dok-icon', dok.uploaded ? 'dok-icon--ok' : 'dok-icon--empty']">
                  <svg v-if="dok.uploaded" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>
                </div>
                <span :class="['dok-label', !dok.uploaded && 'dok-label--empty']">{{ dok.label }}</span>
                <span v-if="dok.uploaded" class="dok-ok">✓</span>
              </div>
            </div>
          </div>

          <!-- Notifikasi Terbaru -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Notifikasi Terbaru</h3>
              <button class="btn-text" @click="switchTab('profil')">Lihat semua</button>
            </div>
            <div v-if="notifLoading" class="empty-state"><div class="spinner spinner--sm"></div></div>
            <div v-else-if="recentNotif.length === 0" class="empty-state">
              <p style="font-size:12px;color:#9ca3af">Tidak ada notifikasi terbaru</p>
            </div>
            <div v-else class="notif-list">
              <div v-for="n in recentNotif" :key="n.id"
                :class="['notif-item', !n.is_read && 'notif-item--unread']">
                <div class="notif-dot" v-if="!n.is_read"></div>
                <div class="notif-body">
                  <div class="notif-title">{{ n.judul }}</div>
                  <div class="notif-msg">{{ n.pesan }}</div>
                  <div class="notif-time">{{ fmtRelative(n.created_at) }}</div>
                </div>
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

// ── Auth + layout ref ─────────────────────────────────────────
const { user } = useAuth();
const layout    = ref<InstanceType<typeof DashboardLayout> | null>(null);
const activeTab = ref("beranda");
const firstName = computed(() => user.value?.nama_lengkap?.split(" ")[0] ?? "");

// ── Today ─────────────────────────────────────────────────────
const now = new Date();
const todayISO  = now.toISOString().slice(0, 10);
const todayFull = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const bulanIniLabel = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

// ── Data refs ──────────────────────────────────────────────────
const pelaksanaan   = ref<any>(null);
const pengajuan     = ref<any>(null);
const absensiList   = ref<any[]>([]);
const absensiLoading = ref(false);
const dokumenList   = ref<any[]>([]);
const recentNotif   = ref<any[]>([]);
const notifLoading  = ref(false);
const aksiLoading   = ref(false);
const aksiMsg       = ref<{ ok: boolean; text: string } | null>(null);

// ── Status magang ──────────────────────────────────────────────
const statusLabel = computed(() => {
  const m: Record<string, string> = {
    aktif: "Aktif", selesai: "Selesai", upload_laporan: "Upload Laporan",
    penilaian: "Penilaian", none: "Belum Dimulai",
  };
  return m[pelaksanaan.value?.status ?? "none"] ?? (pelaksanaan.value?.status ?? "—");
});

// ── Countdown ─────────────────────────────────────────────────
const sisaHari = computed(() => {
  if (!pelaksanaan.value?.tanggal_selesai) return 0;
  const selesai = new Date(pelaksanaan.value.tanggal_selesai);
  return Math.max(0, Math.ceil((selesai.getTime() - now.getTime()) / 86400000));
});
const hariKe = computed(() => {
  if (!pelaksanaan.value?.tanggal_mulai) return 0;
  const mulai = new Date(pelaksanaan.value.tanggal_mulai);
  return Math.max(1, Math.ceil((now.getTime() - mulai.getTime()) / 86400000));
});
const totalHariMagang = computed(() => {
  if (!pelaksanaan.value?.tanggal_mulai || !pelaksanaan.value?.tanggal_selesai) return 0;
  const mulai   = new Date(pelaksanaan.value.tanggal_mulai);
  const selesai = new Date(pelaksanaan.value.tanggal_selesai);
  return Math.ceil((selesai.getTime() - mulai.getTime()) / 86400000);
});
const progressMagang = computed(() => {
  if (!totalHariMagang.value) return 0;
  return Math.min(100, Math.round((hariKe.value / totalHariMagang.value) * 100));
});

// ── Absensi hari ini ──────────────────────────────────────────
const todayAbsensi = computed(() =>
  absensiList.value.find(a => a.tanggal?.slice(0, 10) === todayISO) ?? null
);

// ── Rekap bulan ini ───────────────────────────────────────────
const thisYear  = now.getFullYear();
const thisMonth = now.getMonth(); // 0-indexed

const rekapBulan = computed(() => {
  const list = absensiList.value.filter(a => {
    const d = new Date(a.tanggal);
    return d.getFullYear() === thisYear && d.getMonth() === thisMonth;
  });
  return {
    hadir: list.filter(a => a.keterangan === "hadir").length,
    izin:  list.filter(a => a.keterangan === "izin").length,
    sakit: list.filter(a => a.keterangan === "sakit").length,
    alpha: list.filter(a => a.keterangan === "alpha").length,
  };
});

const totalHariKerja = computed(() => {
  const r = rekapBulan.value;
  return r.hadir + r.izin + r.sakit + r.alpha;
});

const kehadiranPct = computed(() => {
  const r = rekapBulan.value;
  const total = r.hadir + r.izin + r.sakit + r.alpha;
  if (!total) return 0;
  return Math.round((r.hadir / total) * 100);
});

// ── Mini Kalender ─────────────────────────────────────────────
const calendarCells = computed(() => {
  const year  = thisYear;
  const month = thisMonth;

  const absensiMap: Record<string, string> = {};
  for (const a of absensiList.value) {
    const d = a.tanggal?.slice(0, 10);
    if (d) absensiMap[d] = a.keterangan;
  }

  const firstDay  = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-based: Monday=0, ..., Friday=4
  let offset = firstDay.getDay() - 1; // getDay(): Sun=0,Mon=1,...
  if (offset < 0) offset = 6; // Sunday → treat as end of prev week

  const cells: any[] = [];
  // Leading empty cells (only up to 4, for Mon–Fri)
  for (let i = 0; i < offset && i < 5; i++) {
    cells.push({ key: `e-${i}`, d: "", cls: "mc-cell--empty", title: "" });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dow  = date.getDay(); // 0=Sun, 6=Sat
    if (dow === 0 || dow === 6) continue; // skip weekends

    const iso   = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const ket   = absensiMap[iso];
    const isFuture = iso > todayISO;
    const isToday  = iso === todayISO;

    let cls = "mc-cell--future";
    let title = iso;
    if (isToday && !ket) { cls = "mc-cell--today"; title = "Hari ini"; }
    else if (ket === "hadir")  { cls = "mc-cell--hadir";  title = `${iso}: Hadir`; }
    else if (ket === "izin")   { cls = "mc-cell--izin";   title = `${iso}: Izin`; }
    else if (ket === "sakit")  { cls = "mc-cell--sakit";  title = `${iso}: Sakit`; }
    else if (ket === "alpha")  { cls = "mc-cell--alpha";  title = `${iso}: Alpha`; }
    else if (!isFuture)        { cls = "mc-cell--kosong"; title = `${iso}: Tidak ada catatan`; }

    cells.push({ key: iso, d, cls, title });
  }

  return cells;
});

// ── Dokumen status ────────────────────────────────────────────
const DOK_ITEMS = [
  { jenis: "proposal_magang",  label: "Proposal Magang" },
  { jenis: "surat_pengantar",  label: "Surat Pengantar" },
  { jenis: "ktp",              label: "KTP" },
  { jenis: "ktm",              label: "KTM" },
  { jenis: "pasfoto",          label: "Pas Foto" },
  { jenis: "bpjs_kis",         label: "BPJS / KIS" },
];

const dokumenStatus = computed(() =>
  DOK_ITEMS.map(item => ({
    ...item,
    uploaded: dokumenList.value.some(d => d.jenis === item.jenis),
  }))
);

const dokUploaded = computed(() => dokumenStatus.value.filter(d => d.uploaded).length);

// ── Data fetch ────────────────────────────────────────────────
async function fetchBeranda() {
  absensiLoading.value = true;
  notifLoading.value   = true;

  const [r1, r2, r3, r4] = await Promise.allSettled([
    api.get("/api/pelaksanaan/saya"),
    api.get("/api/pengajuan/saya"),
    api.get("/api/absensi/saya"),
    api.get("/api/notifikasi"),
  ]);

  pelaksanaan.value = r1.status === "fulfilled" ? (r1.value.data?.data ?? null) : null;
  pengajuan.value   = r2.status === "fulfilled" ? (r2.value.data?.data ?? null) : null;
  absensiList.value = r3.status === "fulfilled"
    ? (Array.isArray(r3.value.data?.data) ? r3.value.data.data : []) : [];
  recentNotif.value = r4.status === "fulfilled"
    ? (Array.isArray(r4.value.data?.data) ? r4.value.data.data.slice(0, 5) : []) : [];

  absensiLoading.value = false;
  notifLoading.value   = false;

  // Fetch dokumen setelah dapat pengajuan_id
  const pengajuanID = pelaksanaan.value?.pengajuan_id ?? pengajuan.value?.id;
  if (pengajuanID) {
    try {
      const rd = await api.get(`/api/dokumen/pengajuan/${pengajuanID}`);
      dokumenList.value = Array.isArray(rd.data?.data) ? rd.data.data : [];
    } catch { dokumenList.value = []; }
  }
}

// ── Check-In / Check-Out ──────────────────────────────────────
async function doCheckIn() {
  aksiLoading.value = true; aksiMsg.value = null;
  try {
    await api.post("/api/absensi/checkin", {});
    aksiMsg.value = { ok: true, text: "Check-in berhasil! Selamat bekerja." };
    await fetchBeranda();
  } catch (e: any) {
    aksiMsg.value = { ok: false, text: e.response?.data?.message ?? "Gagal check-in" };
  } finally {
    aksiLoading.value = false;
    setTimeout(() => { aksiMsg.value = null; }, 4000);
  }
}

async function doCheckOut() {
  aksiLoading.value = true; aksiMsg.value = null;
  try {
    await api.patch("/api/absensi/checkout", {});
    aksiMsg.value = { ok: true, text: "Check-out berhasil! Sampai jumpa besok." };
    await fetchBeranda();
  } catch (e: any) {
    aksiMsg.value = { ok: false, text: e.response?.data?.message ?? "Gagal check-out" };
  } finally {
    aksiLoading.value = false;
    setTimeout(() => { aksiMsg.value = null; }, 4000);
  }
}

// ── Tab switch ────────────────────────────────────────────────
function switchTab(tab: string) {
  activeTab.value = tab;
  if (layout.value) layout.value.activeTab = tab;
}

function onTabChange(tab: string) {
  activeTab.value = tab;
  if (tab === "beranda") fetchBeranda();
}

// ── Helpers ───────────────────────────────────────────────────
function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function fmtRelative(iso: string) {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

// ── Nav ───────────────────────────────────────────────────────
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
    items: [{ key: "chat", label: "Chat Helpdesk", icon: ICON.chat }],
  },
];

onMounted(fetchBeranda);
</script>

<style scoped>
/* ── Welcome Banner ─────────────────────────────────────────── */
.welcome-banner {
  background: linear-gradient(135deg, #0d2818 0%, #1a5c20 60%, #2d7a2e 100%);
  border-radius: 14px; padding: 22px 28px; color: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.wb-left {}
.wb-greeting { font-size: 18px; font-weight: 700; }
.wb-sub { font-size: 12px; color: rgba(255,255,255,.55); margin-top: 4px; }
.wb-right { text-align: right; min-width: 130px; }
.wb-num { font-size: 36px; font-weight: 800; color: #86efac; line-height: 1; }
.wb-lbl { font-size: 11px; color: rgba(255,255,255,.65); margin-top: 2px; }
.wb-progress-wrap {
  height: 4px; background: rgba(255,255,255,.15); border-radius: 100px; margin: 8px 0 4px; overflow: hidden;
}
.wb-progress-bar { height: 100%; background: #86efac; border-radius: 100px; transition: width .6s; }
.wb-hari-ke { font-size: 10.5px; color: rgba(255,255,255,.5); }

/* ── Top row ─────────────────────────────────────────────────── */
.top-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* ── Card base ───────────────────────────────────────────────── */
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #f0faf0; }
.card-title { font-size: 13px; font-weight: 700; color: #111827; margin: 0; }

/* ── Status Card ─────────────────────────────────────────────── */
.status-card { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.sc-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.sc-title { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.sc-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
.sc-badge--aktif         { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.sc-badge--selesai       { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.sc-badge--upload_laporan { background: #fefce8; color: #a16207; border: 1px solid #fde68a; }
.sc-badge--penilaian     { background: #fdf4ff; color: #7e22ce; border: 1px solid #e9d5ff; }
.sc-badge--none          { background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb; }
.sc-items { display: flex; flex-direction: column; gap: 9px; }
.sc-item  { display: flex; justify-content: space-between; align-items: center; padding-bottom: 9px; border-bottom: 1px solid #f9fafb; }
.sc-item:last-child { border-bottom: none; padding-bottom: 0; }
.sc-lbl { font-size: 11.5px; color: #9ca3af; font-weight: 500; }
.sc-val { font-size: 12.5px; font-weight: 600; color: #111827; }
.sc-empty { font-size: 12px; color: #9ca3af; padding: 8px 0; }

/* ── Aksi Cepat ──────────────────────────────────────────────── */
.aksi-card { padding: 18px; display: flex; flex-direction: column; gap: 12px; }
.aksi-grid { display: flex; flex-direction: column; gap: 8px; }
.aksi-btn {
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 600; padding: 10px 16px;
  border-radius: 10px; cursor: pointer; font-family: inherit;
  border: 1.5px solid transparent; text-align: left; width: 100%;
  transition: all .15s;
}
.aksi-btn:disabled { opacity: .55; cursor: not-allowed; }
.aksi-btn--green  { background: #f0fdf4; color: #15803d; border-color: #86efac; }
.aksi-btn--green:hover:not(:disabled)  { background: #dcfce7; }
.aksi-btn--blue   { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.aksi-btn--blue:hover:not(:disabled)   { background: #dbeafe; }
.aksi-btn--yellow { background: #fffbeb; color: #b45309; border-color: #fde68a; }
.aksi-btn--yellow:hover:not(:disabled) { background: #fef3c7; }
.aksi-btn--purple { background: #fdf4ff; color: #7e22ce; border-color: #e9d5ff; }
.aksi-btn--purple:hover:not(:disabled) { background: #f3e8ff; }
.aksi-btn--gray   { background: #f9fafb; color: #374151; border-color: #e5e7eb; }
.aksi-btn--gray:hover:not(:disabled)   { background: #f3f4f6; }
.aksi-done { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; color: #16a34a; padding: 10px 0; }
.aksi-flash { font-size: 12px; font-weight: 500; padding: 8px 12px; border-radius: 8px; margin-top: 4px; }
.aksi-flash--ok  { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.aksi-flash--err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

/* ── Rekap chips ─────────────────────────────────────────────── */
.rekap-row { display: flex; align-items: center; gap: 12px; padding: 14px 18px; flex-wrap: wrap; }
.rekap-chip { display: flex; flex-direction: column; align-items: center; padding: 10px 20px; border-radius: 12px; min-width: 64px; }
.rc-num { font-size: 26px; font-weight: 800; line-height: 1; }
.rc-lbl { font-size: 10.5px; font-weight: 500; margin-top: 3px; color: inherit; opacity: .75; }
.rekap-chip--green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.rekap-chip--yellow { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.rekap-chip--blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.rekap-chip--red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.rekap-progress { flex: 1; min-width: 160px; }
.rp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
.rp-label { font-size: 11.5px; color: #6b7280; font-weight: 500; }
.rp-pct   { font-size: 20px; font-weight: 800; }
.rp-track { height: 8px; background: #f3f4f6; border-radius: 100px; overflow: hidden; }
.rp-fill  { height: 100%; border-radius: 100px; transition: width .6s; }
.rp-sub   { font-size: 11px; color: #9ca3af; margin-top: 5px; }

/* ── Mini Kalender ───────────────────────────────────────────── */
.mini-cal { padding: 0 18px 16px; }
.mc-days-header {
  display: grid; grid-template-columns: repeat(5, 1fr);
  text-align: center; margin-bottom: 6px;
}
.mc-days-header span { font-size: 10px; font-weight: 700; color: #9ca3af; text-transform: uppercase; padding: 4px 0; }
.mc-grid {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px;
}
.mc-cell {
  aspect-ratio: 1; border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-size: 11.5px; font-weight: 600; cursor: default;
}
.mc-cell--empty   { visibility: hidden; }
.mc-cell--hadir   { background: #f0fdf4; color: #16a34a; border: 1.5px solid #86efac; }
.mc-cell--izin    { background: #fffbeb; color: #b45309; border: 1.5px solid #fde68a; }
.mc-cell--sakit   { background: #eff6ff; color: #1d4ed8; border: 1.5px solid #bfdbfe; }
.mc-cell--alpha   { background: #fff1f2; color: #be123c; border: 1.5px solid #fecdd3; }
.mc-cell--future  { background: #f9fafb; color: #d1d5db; border: 1px solid #f3f4f6; }
.mc-cell--kosong  { background: #f3f4f6; color: #9ca3af; border: 1px dashed #e5e7eb; }
.mc-cell--today   { background: #ecfdf5; color: #059669; border: 2px solid #10b981; font-weight: 800; box-shadow: 0 0 0 2px #d1fae5; }
.mc-legend { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
.mc-leg { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 100px; }
.mc-leg--green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.mc-leg--yellow { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.mc-leg--blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.mc-leg--red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.mc-leg--future { background: #f9fafb; color: #9ca3af; border: 1px solid #e5e7eb; }

/* ── Bottom row ──────────────────────────────────────────────── */
.bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

/* ── Dokumen ─────────────────────────────────────────────────── */
.dok-count { font-size: 12px; font-weight: 700; color: #6b7280; background: #f3f4f6; padding: 2px 9px; border-radius: 100px; }
.dok-list { padding: 8px 18px 12px; display: flex; flex-direction: column; gap: 2px; }
.dok-item { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid #f9fafb; }
.dok-item:last-child { border-bottom: none; }
.dok-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dok-icon--ok    { background: #f0fdf4; color: #16a34a; border: 1.5px solid #86efac; }
.dok-icon--empty { background: #f9fafb; color: #d1d5db; border: 1.5px solid #e5e7eb; }
.dok-label { flex: 1; font-size: 12.5px; color: #374151; font-weight: 500; }
.dok-label--empty { color: #9ca3af; }
.dok-ok { font-size: 11px; font-weight: 700; color: #16a34a; }

/* ── Notifikasi ──────────────────────────────────────────────── */
.btn-text { font-size: 11.5px; font-weight: 600; color: #48AF4A; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; }
.notif-list { padding: 8px 18px 12px; display: flex; flex-direction: column; gap: 2px; }
.notif-item { display: flex; align-items: flex-start; gap: 10px; padding: 9px 0; border-bottom: 1px solid #f9fafb; }
.notif-item:last-child { border-bottom: none; }
.notif-item--unread { background: #f0fdf4; margin: 0 -18px; padding: 9px 18px; border-radius: 8px; border-bottom: 1px solid #e9f5e9; }
.notif-dot { width: 7px; height: 7px; border-radius: 50%; background: #48AF4A; flex-shrink: 0; margin-top: 5px; }
.notif-body { flex: 1; min-width: 0; }
.notif-title { font-size: 12.5px; font-weight: 600; color: #111827; }
.notif-msg   { font-size: 11.5px; color: #6b7280; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.notif-time  { font-size: 10.5px; color: #9ca3af; margin-top: 3px; }

/* ── Spinner + Empty ─────────────────────────────────────────── */
.spinner { border: 2px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .7s linear infinite; }
.spinner--sm { width: 16px; height: 16px; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty-state { display: flex; align-items: center; justify-content: center; padding: 24px; }

/* ── Responsive ──────────────────────────────────────────────── */
@media (max-width: 860px) {
  .top-row    { grid-template-columns: 1fr; }
  .bottom-row { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .wb-num { font-size: 26px; }
  .rekap-chip { padding: 8px 12px; min-width: 52px; }
  .rc-num { font-size: 20px; }
}
</style>
