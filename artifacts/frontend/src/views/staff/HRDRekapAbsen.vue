<template>
  <div class="rekap-root">

    <!-- ── PANEL IZIN & SAKIT (persetujuan pending) ────────────── -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Persetujuan Izin &amp; Sakit</h3>
          <p class="card-sub">Pengajuan dari peserta yang menunggu konfirmasi</p>
        </div>
        <button class="btn-green-sm" @click="fetchIzinSakit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Refresh
        </button>
      </div>

      <!-- Filter izin/sakit -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button v-for="f in izinFilters" :key="f.key"
            :class="['filter-pill', izinActiveFilter === f.key && 'filter-pill--active']"
            @click="izinActiveFilter = f.key">{{ f.label }}</button>
        </div>
      </div>

      <div v-if="izinLoading" class="empty-state"><div class="spinner"></div></div>
      <div v-else-if="izinError" class="empty-state"><p style="color:#dc2626">{{ izinError }}</p></div>
      <div v-else-if="filteredIzin.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="#d1d5db" stroke-width="1.5"/></svg>
        </div>
        <p>{{ izinActiveFilter === 'pending' ? 'Tidak ada pengajuan yang menunggu.' : 'Tidak ada data.' }}</p>
      </div>
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Peserta</th>
              <th>Tanggal</th>
              <th>Jenis</th>
              <th>Alasan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredIzin" :key="item.id">
              <td>
                <div class="name-cell">
                  <div class="name-avatar">{{ item.nama_peserta[0] }}</div>
                  <div>
                    <div class="name-text">{{ item.nama_peserta }}</div>
                    <div class="name-sub">{{ item.divisi ?? '–' }}</div>
                  </div>
                </div>
              </td>
              <td style="white-space:nowrap;font-weight:600">{{ fmtDate(item.tanggal) }}</td>
              <td>
                <span :class="['jenis-badge', `jenis-badge--${item.jenis}`]">
                  {{ item.jenis === 'izin' ? 'Izin' : 'Sakit' }}
                </span>
              </td>
              <td class="alasan-cell">{{ item.alasan }}</td>
              <td>
                <span v-if="item.status === 'pending'"    class="status-badge status-badge--pending">Menunggu</span>
                <span v-else-if="item.status === 'disetujui'" class="status-badge status-badge--ok">Disetujui</span>
                <span v-else class="status-badge status-badge--tolak">Ditolak</span>
              </td>
              <td>
                <div v-if="item.status === 'pending'" class="aksi-cell">
                  <button class="btn-aksi btn-aksi--green" :disabled="processingId === item.id"
                    @click="approve(item)">
                    {{ processingId === item.id ? '…' : '✓ Setujui' }}
                  </button>
                  <button class="btn-aksi btn-aksi--red" :disabled="processingId === item.id"
                    @click="openTolakModal(item)">
                    ✕ Tolak
                  </button>
                </div>
                <span v-else class="name-sub">–</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── REKAP ABSENSI PESERTA ────────────────────────────────── -->
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
          <button v-for="f in filters" :key="f.key"
            :class="['filter-pill', activeFilter === f.key && 'filter-pill--active']"
            @click="activeFilter = f.key">{{ f.label }}</button>
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
      </div>

      <!-- Table -->
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
                <div class="aksi-cell">
                  <button class="btn-aksi btn-aksi--ghost" @click="openDetail(r)">Detail</button>
                  <a class="btn-aksi btn-aksi--blue"
                    :href="`/api/absensi/pelaksanaan/${r.pelaksanaan_id}/pdf`"
                    target="_blank">PDF</a>
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
        <button class="btn-close" @click="selectedRow = null">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
        </button>
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
            <tr><th>Tanggal</th><th>Masuk</th><th>Keluar</th><th>Keterangan</th><th>Kegiatan</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in detailList" :key="a.id">
              <td style="white-space:nowrap;font-weight:600">{{ fmtDateShort(a.tanggal) }}</td>
              <td>{{ a.jam_masuk ?? '–' }}</td>
              <td>{{ a.jam_keluar ?? '–' }}</td>
              <td><span :class="ketClass(a.keterangan)">{{ fmtKet(a.keterangan) }}</span></td>
              <td class="kegiatan-cell">{{ a.kegiatan ?? '–' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <!-- ── MODAL TOLAK ─────────────────────────────────────────── -->
  <Teleport to="body">
    <div v-if="showTolakModal" class="modal-backdrop" @click.self="closeTolakModal">
      <div class="modal-box">
        <div class="modal-title">Tolak Pengajuan</div>
        <div class="modal-desc">
          Pengajuan <strong>{{ tolakTarget?.jenis }}</strong> dari <strong>{{ tolakTarget?.nama_peserta }}</strong>
          untuk tanggal <strong>{{ tolakTarget ? fmtDate(tolakTarget.tanggal) : '' }}</strong>.
        </div>
        <div class="modal-field">
          <label class="modal-label">Catatan (opsional)</label>
          <textarea v-model="tolakCatatan" class="modal-textarea" rows="3"
            placeholder="Tulis alasan penolakan jika diperlukan..."></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="closeTolakModal">Batal</button>
          <button class="btn-red" @click="submitTolak" :disabled="processingId === tolakTarget?.id">
            {{ processingId === tolakTarget?.id ? '…' : 'Ya, Tolak' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/lib/api";

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
  id:         string;
  tanggal:    string;
  jam_masuk:  string | null;
  jam_keluar: string | null;
  keterangan: string;
  kegiatan:   string | null;
}
interface IzinSakitItem {
  id:          string;
  tanggal:     string;
  jenis:       string;
  alasan:      string;
  status:      string;
  nama_peserta: string;
  divisi:      string | null;
  catatan_hrd?: string | null;
}

// ── Rekap state ─────────────────────────────────────────────
const rows    = ref<RekapRow[]>([]);
const loading = ref(false);
const error   = ref<string | null>(null);
const search       = ref("");
const activeFilter = ref("semua");
const selectedRow  = ref<RekapRow | null>(null);
const detailList   = ref<AbsensiItem[]>([]);
const detailLoading = ref(false);
const detailError  = ref<string>("");

const filters = [
  { key: "semua",    label: "Semua" },
  { key: "aktif",    label: "Aktif" },
  { key: "selesai",  label: "Selesai" },
  { key: "upload_laporan", label: "Upload Laporan" },
  { key: "penilaian",     label: "Penilaian" },
];

// ── Izin/Sakit state ─────────────────────────────────────────
const izinList        = ref<IzinSakitItem[]>([]);
const izinLoading     = ref(false);
const izinError       = ref<string | null>(null);
const izinActiveFilter = ref("pending");
const processingId    = ref<string | null>(null);
const showTolakModal  = ref(false);
const tolakTarget     = ref<IzinSakitItem | null>(null);
const tolakCatatan    = ref("");

const izinFilters = [
  { key: "pending",   label: "Menunggu" },
  { key: "disetujui", label: "Disetujui" },
  { key: "ditolak",   label: "Ditolak" },
  { key: "semua",     label: "Semua" },
];

// ── Computed ─────────────────────────────────────────────────
const filteredRows = computed(() => {
  let list = rows.value;
  if (activeFilter.value !== "semua") list = list.filter(r => r.status === activeFilter.value);
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(r => r.nama_lengkap.toLowerCase().includes(q) || (r.divisi ?? "").toLowerCase().includes(q));
  }
  return list;
});

const totalHadir = computed(() => filteredRows.value.reduce((s, r) => s + r.hadir, 0));
const totalIzin  = computed(() => filteredRows.value.reduce((s, r) => s + r.izin, 0));
const totalSakit = computed(() => filteredRows.value.reduce((s, r) => s + r.sakit, 0));
const totalAlpha = computed(() => filteredRows.value.reduce((s, r) => s + r.alpha, 0));

const filteredIzin = computed(() => {
  if (izinActiveFilter.value === "semua") return izinList.value;
  return izinList.value.filter(i => i.status === izinActiveFilter.value);
});

// ── Data fetch ──────────────────────────────────────────────
async function fetchRekap() {
  loading.value = true; error.value = null;
  try {
    const r = await api.get("/api/absensi/rekap");
    rows.value = Array.isArray(r.data?.data) ? r.data.data : [];
  } catch (e: any) {
    error.value = e.response?.data?.message ?? "Gagal memuat data rekap";
  } finally { loading.value = false; }
}

async function fetchIzinSakit() {
  izinLoading.value = true; izinError.value = null;
  try {
    const r = await api.get("/api/izin-sakit");
    izinList.value = Array.isArray(r.data?.data) ? r.data.data : [];
  } catch (e: any) {
    izinError.value = e.response?.data?.message ?? "Gagal memuat data izin/sakit";
  } finally { izinLoading.value = false; }
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

// ── Izin/Sakit actions ───────────────────────────────────────
async function approve(item: IzinSakitItem) {
  processingId.value = item.id;
  try {
    await api.patch(`/api/izin-sakit/${item.id}/approve`, {});
    item.status = "disetujui";
    showToast(`Pengajuan ${item.jenis} ${item.nama_peserta} disetujui`);
    // refresh rekap setelah approve karena absensi sudah berubah
    fetchRekap();
  } catch (e: any) {
    alert(e.response?.data?.message ?? "Gagal menyetujui");
  } finally { processingId.value = null; }
}

function openTolakModal(item: IzinSakitItem) {
  tolakTarget.value = item;
  tolakCatatan.value = "";
  showTolakModal.value = true;
}

function closeTolakModal() {
  showTolakModal.value = false;
  tolakTarget.value = null;
  tolakCatatan.value = "";
}

async function submitTolak() {
  if (!tolakTarget.value) return;
  processingId.value = tolakTarget.value.id;
  try {
    await api.patch(`/api/izin-sakit/${tolakTarget.value.id}/tolak`, { catatan_hrd: tolakCatatan.value });
    tolakTarget.value.status = "ditolak";
    closeTolakModal();
    showToast("Pengajuan ditolak");
  } catch (e: any) {
    alert(e.response?.data?.message ?? "Gagal menolak");
  } finally { processingId.value = null; }
}

const toastMsg = ref("");
function showToast(msg: string) {
  toastMsg.value = msg;
  setTimeout(() => { toastMsg.value = ""; }, 3000);
}

// ── Helpers ─────────────────────────────────────────────────
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

onMounted(() => {
  fetchRekap();
  fetchIzinSakit();
});
</script>

<style scoped>
.rekap-root { display: flex; flex-direction: column; gap: 16px; }

.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; gap: 12px; flex-wrap: wrap; }
.card-title { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }
.card-sub { font-size: 11.5px; color: #9ca3af; margin: 2px 0 0; }

.filter-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 20px; border-bottom: 1px solid #f9fafb; flex-wrap: wrap; }
.filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-pill { border: 1.5px solid #e5e7eb; background: #fff; color: #6b7280; font-size: 12px; font-weight: 600; padding: 5px 13px; border-radius: 100px; cursor: pointer; font-family: inherit; transition: all .15s; }
.filter-pill--active { border-color: #48AF4A; background: #f0fdf4; color: #16a34a; }
.filter-pill:hover:not(.filter-pill--active) { border-color: #d1d5db; background: #f9fafb; }
.search-input { border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 7px 13px; font-size: 12.5px; font-family: inherit; outline: none; color: #111827; min-width: 200px; }
.search-input:focus { border-color: #48AF4A; }

.stat-chips { display: flex; gap: 10px; padding: 12px 20px; flex-wrap: wrap; }
.stat-chip { display: flex; flex-direction: column; align-items: center; background: #f9fafb; border-radius: 10px; padding: 8px 18px; border: 1px solid #f1f5f9; min-width: 70px; }
.stat-chip__val { font-size: 20px; font-weight: 700; }
.stat-chip__lbl { font-size: 10.5px; color: #9ca3af; font-weight: 500; }
.stat-chip--green .stat-chip__val { color: #16a34a; }
.stat-chip--yellow .stat-chip__val { color: #ca8a04; }
.stat-chip--blue .stat-chip__val { color: #2563eb; }
.stat-chip--red .stat-chip__val { color: #dc2626; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 10px 14px; text-align: left; font-size: 10.5px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
.data-table td { padding: 12px 14px; border-bottom: 1px solid #f9fafb; color: #374151; vertical-align: middle; }

.name-cell { display: flex; align-items: center; gap: 10px; }
.name-avatar { width: 32px; height: 32px; border-radius: 50%; background: #dcfce7; color: #15803d; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.name-text { font-weight: 600; color: #111827; font-size: 13px; }
.name-sub { font-size: 11.5px; color: #9ca3af; }
.tag { background: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 100px; white-space: nowrap; }

.abs-num { display: inline-block; min-width: 26px; text-align: center; font-size: 13px; font-weight: 700; padding: 2px 6px; border-radius: 6px; }
.abs-num--green  { color: #15803d; background: #dcfce7; }
.abs-num--yellow { color: #92400e; background: #fef9c3; }
.abs-num--blue   { color: #1d4ed8; background: #dbeafe; }
.abs-num--red    { color: #dc2626; background: #fee2e2; }

.progress-wrap { height: 5px; background: #f1f5f9; border-radius: 100px; overflow: hidden; margin-bottom: 3px; }
.progress-bar  { height: 100%; background: #48AF4A; border-radius: 100px; transition: width .4s; }
.pct-label { font-size: 11px; color: #6b7280; font-weight: 600; }

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

.jenis-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
.jenis-badge--izin  { background: #eff6ff; color: #1d4ed8; }
.jenis-badge--sakit { background: #fffbeb; color: #b45309; }

.status-badge { display: inline-block; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
.status-badge--pending { background: #fef3c7; color: #92400e; }
.status-badge--ok      { background: #dcfce7; color: #15803d; }
.status-badge--tolak   { background: #fee2e2; color: #dc2626; }

.alasan-cell { max-width: 200px; font-size: 12px; color: #6b7280; white-space: normal; word-break: break-word; }
.aksi-cell { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.btn-aksi { border: none; border-radius: 7px; padding: 5px 11px; font-size: 11.5px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap; text-decoration: none; display: inline-block; }
.btn-aksi--ghost { background: #f3f4f6; color: #374151; }
.btn-aksi--ghost:hover { background: #e5e7eb; }
.btn-aksi--green { background: #dcfce7; color: #15803d; }
.btn-aksi--green:hover:not(:disabled) { background: #bbf7d0; }
.btn-aksi--green:disabled { opacity: .5; cursor: default; }
.btn-aksi--red { background: #fee2e2; color: #dc2626; }
.btn-aksi--red:hover:not(:disabled) { background: #fecaca; }
.btn-aksi--red:disabled { opacity: .5; cursor: default; }
.btn-aksi--blue { background: #dbeafe; color: #1d4ed8; }
.btn-aksi--blue:hover { background: #bfdbfe; }

.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: inherit; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 5px; }
.btn-green-sm:hover:not(:disabled) { background: #3d9e3f; }
.btn-close { background: #f3f4f6; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; flex-shrink: 0; }
.btn-close:hover { background: #e5e7eb; }

.detail-card { margin-top: 0; }
.detail-rekap { display: flex; gap: 8px; padding: 12px 20px; flex-wrap: wrap; border-bottom: 1px solid #f0faf0; }
.drk { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; background: #f9fafb; border-radius: 8px; padding: 6px 14px; }
.drk strong { font-size: 16px; font-weight: 700; }
.drk--green  strong { color: #16a34a; }
.drk--yellow strong { color: #ca8a04; }
.drk--blue   strong { color: #2563eb; }
.drk--red    strong { color: #dc2626; }
.kegiatan-cell { max-width: 180px; font-size: 12px; white-space: normal; word-break: break-word; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }
.spinner { width: 28px; height: 28px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal tolak */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: #fff; border-radius: 16px; padding: 28px 24px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.modal-desc { font-size: 13px; color: #6b7280; margin-bottom: 16px; line-height: 1.6; }
.modal-field { margin-bottom: 14px; }
.modal-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.modal-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: inherit; outline: none; resize: vertical; box-sizing: border-box; }
.modal-textarea:focus { border-color: #48AF4A; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-cancel { background: #f3f4f6; color: #374151; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.btn-red { background: #fee2e2; color: #dc2626; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 700; font-family: inherit; cursor: pointer; }
.btn-red:hover:not(:disabled) { background: #fecaca; }
.btn-red:disabled { opacity: .5; cursor: default; }
</style>
