<template>
  <div class="rekap-root">

    <!-- ── HEADER & FILTER ─────────────────────────────────── -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Rekap Absensi Peserta</h3>
          <p class="card-sub">Ringkasan kehadiran seluruh peserta magang</p>
        </div>
        <button class="btn-green-sm" @click="fetchRekap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Refresh
        </button>
      </div>

      <!-- Filter & search -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button
            v-for="f in filters" :key="f.key"
            :class="['filter-pill', activeFilter === f.key && 'filter-pill--active']"
            @click="activeFilter = f.key"
          >{{ f.label }}</button>
        </div>
        <input v-model="search" type="text" class="search-input" placeholder="Cari nama peserta…"/>
      </div>

      <!-- Stat chips -->
      <div v-if="!loading && rows.length" class="stat-chips">
        <div class="stat-chip stat-chip--green">
          <span class="stat-chip__val">{{ totalHadir }}</span>
          <span class="stat-chip__lbl">Total Hadir</span>
        </div>
        <div class="stat-chip stat-chip--yellow">
          <span class="stat-chip__val">{{ totalIzin }}</span>
          <span class="stat-chip__lbl">Izin</span>
        </div>
        <div class="stat-chip stat-chip--blue">
          <span class="stat-chip__val">{{ totalSakit }}</span>
          <span class="stat-chip__lbl">Sakit</span>
        </div>
        <div class="stat-chip stat-chip--red">
          <span class="stat-chip__val">{{ totalAlpha }}</span>
          <span class="stat-chip__lbl">Alpha</span>
        </div>
        <div class="stat-chip stat-chip--orange">
          <span class="stat-chip__val">{{ totalPending }}</span>
          <span class="stat-chip__lbl">Perlu Disetujui</span>
        </div>
      </div>
    </div>

    <!-- ── TABLE ────────────────────────────────────────────── -->
    <div class="card">
      <div v-if="loading" class="empty-state"><div class="spinner"></div></div>
      <div v-else-if="error" class="empty-state">
        <p style="color:#dc2626">{{ error }}</p>
        <button class="btn-green-sm" @click="fetchRekap">Coba lagi</button>
      </div>
      <div v-else-if="filteredRows.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg>
        </div>
        <p>{{ search ? 'Tidak ada peserta yang cocok.' : 'Belum ada data absensi.' }}</p>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Peserta</th>
              <th>Divisi</th>
              <th>Periode</th>
              <th>Status</th>
              <th style="text-align:center">H</th>
              <th style="text-align:center">I</th>
              <th style="text-align:center">S</th>
              <th style="text-align:center">A</th>
              <th style="text-align:center">% Hadir</th>
              <th>Perlu Disetujui</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredRows" :key="r.pelaksanaan_id">
              <td>
                <div class="name-cell">
                  <div class="name-avatar">{{ r.nama_lengkap[0] }}</div>
                  <div>
                    <div class="name-text">{{ r.nama_lengkap }}</div>
                    <div class="name-sub">{{ r.asal_institusi }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span v-if="r.divisi" class="tag">{{ r.divisi }}</span>
                <span v-else class="name-sub">–</span>
              </td>
              <td style="white-space:nowrap;font-size:12px">
                <div>{{ fmtDate(r.tanggal_mulai) }}</div>
                <div class="name-sub">s/d {{ fmtDate(r.tanggal_selesai) }}</div>
              </td>
              <td><span :class="statusClass(r.status)">{{ fmtStatus(r.status) }}</span></td>
              <td style="text-align:center"><span class="abs-num abs-num--green">{{ r.hadir }}</span></td>
              <td style="text-align:center"><span class="abs-num abs-num--yellow">{{ r.izin }}</span></td>
              <td style="text-align:center"><span class="abs-num abs-num--blue">{{ r.sakit }}</span></td>
              <td style="text-align:center"><span class="abs-num abs-num--red">{{ r.alpha }}</span></td>
              <td style="text-align:center">
                <div class="progress-wrap">
                  <div class="progress-bar" :style="{ width: persen(r) + '%' }"></div>
                </div>
                <span class="pct-label">{{ persen(r) }}%</span>
              </td>
              <td>
                <span v-if="r.pending_approval > 0" class="pending-badge">
                  {{ r.pending_approval }} pending
                </span>
                <span v-else class="approved-badge">✓ Semua</span>
              </td>
              <td>
                <div class="aksi-cell">
                  <button class="btn-aksi btn-aksi--ghost" @click="openDetail(r)">Detail</button>
                  <a
                    class="btn-aksi btn-aksi--blue"
                    :href="`/api/absensi/pelaksanaan/${r.pelaksanaan_id}/pdf`"
                    target="_blank"
                  >PDF</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── DETAIL PANEL ─────────────────────────────────────── -->
    <div v-if="selectedRow" class="detail-card card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Detail Absensi — {{ selectedRow.nama_lengkap }}</h3>
          <p class="card-sub">
            {{ fmtDate(selectedRow.tanggal_mulai) }} s/d {{ fmtDate(selectedRow.tanggal_selesai) }}
            <span v-if="selectedRow.divisi"> · {{ selectedRow.divisi }}</span>
          </p>
        </div>
        <div class="card-header-actions">
          <button class="btn-green-sm" @click="approveAll" :disabled="approvingAll || !pendingInDetail.length">
            <template v-if="approvingAll"><span class="spinner-sm"></span> Memproses…</template>
            <template v-else>✓ Setujui Semua ({{ pendingInDetail.length }})</template>
          </button>
          <button class="btn-close" @click="selectedRow = null">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>

      <!-- rekap chips detail -->
      <div class="detail-rekap">
        <div class="drk drk--green">Hadir <strong>{{ selectedRow.hadir }}</strong></div>
        <div class="drk drk--yellow">Izin <strong>{{ selectedRow.izin }}</strong></div>
        <div class="drk drk--blue">Sakit <strong>{{ selectedRow.sakit }}</strong></div>
        <div class="drk drk--red">Alpha <strong>{{ selectedRow.alpha }}</strong></div>
      </div>

      <div v-if="detailLoading" class="empty-state"><div class="spinner"></div></div>
      <div v-else-if="detailError" class="empty-state"><p style="color:#dc2626">{{ detailError }}</p></div>
      <div v-else-if="detailList.length === 0" class="empty-state">
        <p>Peserta ini belum memiliki catatan absensi.</p>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Tanggal</th><th>Masuk</th><th>Keluar</th><th>Keterangan</th><th>Kegiatan</th><th>Status TTD</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in detailList" :key="a.id">
              <td style="white-space:nowrap;font-weight:600">{{ fmtDateShort(a.tanggal) }}</td>
              <td>{{ a.jam_masuk ?? '–' }}</td>
              <td>{{ a.jam_keluar ?? '–' }}</td>
              <td><span :class="ketClass(a.keterangan)">{{ fmtKet(a.keterangan) }}</span></td>
              <td class="kegiatan-cell">{{ a.kegiatan ?? '–' }}</td>
              <td>
                <span v-if="a.approved_at" class="approved-badge">✓ Disetujui</span>
                <span v-else class="pending-badge">Belum</span>
              </td>
              <td>
                <button
                  v-if="!a.approved_at"
                  class="btn-aksi btn-aksi--green"
                  :disabled="approvingId === a.id"
                  @click="approveOne(a)"
                >{{ approvingId === a.id ? '…' : 'Setujui' }}</button>
                <span v-else class="name-sub">–</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/lib/api";

// ── types ──────────────────────────────────────────────────────
interface RekapRow {
  pelaksanaan_id: string;
  nama_lengkap:   string;
  asal_institusi: string;
  kategori_magang: string;
  divisi:          string | null;
  pembimbing:      string | null;
  tanggal_mulai:   string;
  tanggal_selesai: string;
  status:          string;
  hadir:           number;
  izin:            number;
  sakit:           number;
  alpha:           number;
  pending_approval: number;
}
interface AbsensiItem {
  id:           string;
  tanggal:      string;
  jam_masuk:    string | null;
  jam_keluar:   string | null;
  keterangan:   string;
  kegiatan:     string | null;
  ttd_pembimbing: boolean;
  approved_by:  string | null;
  approved_at:  string | null;
}

// ── state ──────────────────────────────────────────────────────
const rows    = ref<RekapRow[]>([]);
const loading = ref(false);
const error   = ref<string | null>(null);

const search       = ref("");
const activeFilter = ref("semua");

const selectedRow  = ref<RekapRow | null>(null);
const detailList   = ref<AbsensiItem[]>([]);
const detailLoading = ref(false);
const detailError  = ref<string>("");
const approvingId  = ref<string | null>(null);
const approvingAll = ref(false);

const filters = [
  { key: "semua",    label: "Semua" },
  { key: "aktif",    label: "Aktif" },
  { key: "selesai",  label: "Selesai" },
  { key: "upload_laporan", label: "Upload Laporan" },
  { key: "penilaian",     label: "Penilaian" },
];

// ── computed ───────────────────────────────────────────────────
const filteredRows = computed(() => {
  let list = rows.value;
  if (activeFilter.value !== "semua") list = list.filter(r => r.status === activeFilter.value);
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(r => r.nama_lengkap.toLowerCase().includes(q) || (r.divisi ?? "").toLowerCase().includes(q));
  }
  return list;
});

const totalHadir   = computed(() => filteredRows.value.reduce((s, r) => s + r.hadir, 0));
const totalIzin    = computed(() => filteredRows.value.reduce((s, r) => s + r.izin, 0));
const totalSakit   = computed(() => filteredRows.value.reduce((s, r) => s + r.sakit, 0));
const totalAlpha   = computed(() => filteredRows.value.reduce((s, r) => s + r.alpha, 0));
const totalPending = computed(() => filteredRows.value.reduce((s, r) => s + r.pending_approval, 0));

const pendingInDetail = computed(() => detailList.value.filter(a => !a.approved_at));

// ── data fetch ─────────────────────────────────────────────────
async function fetchRekap() {
  loading.value = true; error.value = null;
  try {
    const r = await api.get("/api/absensi/rekap");
    rows.value = Array.isArray(r.data?.data) ? r.data.data : [];
  } catch (e: any) {
    error.value = e.response?.data?.message ?? "Gagal memuat data rekap";
  } finally { loading.value = false; }
}

async function openDetail(row: RekapRow) {
  selectedRow.value = row;
  detailList.value = [];
  detailLoading.value = true;
  detailError.value = "";
  try {
    const r = await api.get(`/api/absensi/pelaksanaan/${row.pelaksanaan_id}`);
    const data = r.data?.data;
    detailList.value = Array.isArray(data?.list) ? data.list : (Array.isArray(data) ? data : []);
  } catch (e: any) {
    detailError.value = e.response?.data?.message ?? "Gagal memuat detail absensi";
  } finally { detailLoading.value = false; }
}

// ── approve ────────────────────────────────────────────────────
async function approveOne(a: AbsensiItem) {
  approvingId.value = a.id;
  try {
    await api.patch(`/api/absensi/${a.id}/approve`, {});
    a.approved_at = new Date().toISOString();
    a.ttd_pembimbing = true;
    if (selectedRow.value) {
      const idx = rows.value.findIndex(r => r.pelaksanaan_id === selectedRow.value!.pelaksanaan_id);
      if (idx !== -1 && rows.value[idx].pending_approval > 0) rows.value[idx].pending_approval--;
      selectedRow.value = { ...selectedRow.value, pending_approval: Math.max(0, selectedRow.value.pending_approval - 1) };
    }
  } catch { /* ignore */ }
  finally { approvingId.value = null; }
}

async function approveAll() {
  approvingAll.value = true;
  const pending = pendingInDetail.value.slice();
  for (const a of pending) {
    try {
      await api.patch(`/api/absensi/${a.id}/approve`, {});
      a.approved_at = new Date().toISOString();
    } catch { /* skip */ }
  }
  if (selectedRow.value) {
    const idx = rows.value.findIndex(r => r.pelaksanaan_id === selectedRow.value!.pelaksanaan_id);
    if (idx !== -1) rows.value[idx].pending_approval = 0;
    selectedRow.value = { ...selectedRow.value, pending_approval: 0 };
  }
  approvingAll.value = false;
}

// ── helpers ────────────────────────────────────────────────────
function persen(r: RekapRow) {
  const total = r.hadir + r.izin + r.sakit + r.alpha;
  if (!total) return 0;
  return Math.round((r.hadir / total) * 100);
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" });
}
function fmtDateShort(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { weekday:"short", day:"2-digit", month:"short" });
}
function fmtStatus(s: string) {
  return ({ aktif:"Aktif", upload_laporan:"Upload Lap.", penilaian:"Penilaian", selesai:"Selesai" } as Record<string,string>)[s] ?? s;
}
function statusClass(s: string) {
  if (s === "aktif")          return "sp-badge sp-badge--green";
  if (s === "upload_laporan") return "sp-badge sp-badge--blue";
  if (s === "penilaian")      return "sp-badge sp-badge--orange";
  if (s === "selesai")        return "sp-badge sp-badge--gray";
  return "sp-badge sp-badge--gray";
}
function fmtKet(k: string) {
  return ({ hadir:"Hadir", izin:"Izin", sakit:"Sakit", alpha:"Alpha" } as Record<string,string>)[k] ?? k;
}
function ketClass(k: string) {
  if (k === "hadir") return "ket-badge ket-badge--green";
  if (k === "izin")  return "ket-badge ket-badge--yellow";
  if (k === "sakit") return "ket-badge ket-badge--blue";
  return "ket-badge ket-badge--red";
}

onMounted(fetchRekap);
</script>

<style scoped>
.rekap-root { display: flex; flex-direction: column; gap: 16px; }

/* card */
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; gap: 12px; flex-wrap: wrap; }
.card-title { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }
.card-sub { font-size: 11.5px; color: #9ca3af; margin: 2px 0 0; }
.card-header-actions { display: flex; align-items: center; gap: 8px; }

/* filter */
.filter-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 20px; border-bottom: 1px solid #f9fafb; flex-wrap: wrap; }
.filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-pill { border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; font-size: 12px; font-weight: 600; padding: 5px 13px; border-radius: 100px; cursor: pointer; font-family: inherit; transition: all .15s; }
.filter-pill--active { border-color: #48AF4A; background: #f0fdf4; color: #16a34a; }
.filter-pill:hover:not(.filter-pill--active) { border-color: #d1d5db; background: #f9fafb; }
.search-input { border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 7px 13px; font-size: 12.5px; font-family: inherit; outline: none; color: #111827; min-width: 200px; }
.search-input:focus { border-color: #48AF4A; }

/* stat chips */
.stat-chips { display: flex; gap: 10px; padding: 12px 20px; flex-wrap: wrap; }
.stat-chip { display: flex; flex-direction: column; align-items: center; background: #f9fafb; border-radius: 10px; padding: 8px 18px; border: 1px solid #f1f5f9; min-width: 70px; }
.stat-chip__val { font-size: 20px; font-weight: 700; }
.stat-chip__lbl { font-size: 10.5px; color: #9ca3af; font-weight: 500; }
.stat-chip--green .stat-chip__val { color: #16a34a; }
.stat-chip--yellow .stat-chip__val { color: #ca8a04; }
.stat-chip--blue .stat-chip__val { color: #2563eb; }
.stat-chip--red .stat-chip__val { color: #dc2626; }
.stat-chip--orange .stat-chip__val { color: #ea580c; }

/* table */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 14px; text-align: left; font-size: 10.5px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
.data-table td { padding: 12px 14px; border-bottom: 1px solid #f9fafb; color: #374151; vertical-align: middle; }

/* name cell */
.name-cell { display: flex; align-items: center; gap: 10px; }
.name-avatar { width: 32px; height: 32px; border-radius: 50%; background: #dcfce7; color: #15803d; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.name-text { font-weight: 600; color: #111827; font-size: 13px; }
.name-sub { font-size: 11.5px; color: #9ca3af; }
.tag { background: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 100px; white-space: nowrap; }

/* abs num */
.abs-num { display: inline-block; min-width: 26px; text-align: center; font-size: 13px; font-weight: 700; padding: 2px 6px; border-radius: 6px; }
.abs-num--green  { color: #15803d; background: #dcfce7; }
.abs-num--yellow { color: #92400e; background: #fef9c3; }
.abs-num--blue   { color: #1d4ed8; background: #dbeafe; }
.abs-num--red    { color: #dc2626; background: #fee2e2; }

/* progress */
.progress-wrap { height: 5px; background: #f1f5f9; border-radius: 100px; overflow: hidden; margin-bottom: 3px; }
.progress-bar  { height: 100%; background: #48AF4A; border-radius: 100px; transition: width .4s; }
.pct-label { font-size: 11px; color: #6b7280; font-weight: 600; }

/* badges */
.pending-badge  { background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 100px; white-space: nowrap; }
.approved-badge { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 100px; white-space: nowrap; }
.sp-badge { display: inline-flex; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.sp-badge--green  { background: #dcfce7; color: #15803d; }
.sp-badge--blue   { background: #dbeafe; color: #1d4ed8; }
.sp-badge--orange { background: #fff7ed; color: #ea580c; }
.sp-badge--gray   { background: #f3f4f6; color: #6b7280; }
.ket-badge { display: inline-block; padding: 2px 9px; border-radius: 100px; font-size: 11px; font-weight: 700; }
.ket-badge--green  { background: #dcfce7; color: #15803d; }
.ket-badge--yellow { background: #fef9c3; color: #92400e; }
.ket-badge--blue   { background: #dbeafe; color: #1d4ed8; }
.ket-badge--red    { background: #fee2e2; color: #dc2626; }

/* action btns */
.aksi-cell { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-aksi { border: none; border-radius: 7px; padding: 5px 11px; font-size: 11.5px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap; text-decoration: none; display: inline-block; }
.btn-aksi--ghost { background: #f3f4f6; color: #374151; }
.btn-aksi--ghost:hover { background: #e5e7eb; }
.btn-aksi--green { background: #dcfce7; color: #15803d; }
.btn-aksi--green:hover:not(:disabled) { background: #bbf7d0; }
.btn-aksi--green:disabled { opacity: .5; cursor: default; }
.btn-aksi--blue  { background: #dbeafe; color: #1d4ed8; }
.btn-aksi--blue:hover  { background: #bfdbfe; }

/* btn-green-sm */
.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 5px; }
.btn-green-sm:hover:not(:disabled) { background: #3d9e3f; }
.btn-green-sm:disabled { opacity: .5; cursor: default; }
.btn-close { background: #f3f4f6; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; flex-shrink: 0; }
.btn-close:hover { background: #e5e7eb; }

/* detail panel */
.detail-card { margin-top: 0; }
.detail-rekap { display: flex; gap: 8px; padding: 12px 20px; flex-wrap: wrap; border-bottom: 1px solid #f0faf0; }
.drk { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; background: #f9fafb; border-radius: 8px; padding: 6px 14px; }
.drk strong { font-size: 16px; font-weight: 700; }
.drk--green  strong { color: #16a34a; }
.drk--yellow strong { color: #ca8a04; }
.drk--blue   strong { color: #2563eb; }
.drk--red    strong { color: #dc2626; }
.kegiatan-cell { max-width: 180px; font-size: 12px; white-space: normal; word-break: break-word; }

/* spinner */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }
.spinner { width: 28px; height: 28px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; }
.spinner-sm { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
