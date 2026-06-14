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
              <th>Bukti</th>
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
                <a v-if="item.bukti_path" :href="`/api/uploads/${item.bukti_path}`" target="_blank" class="bukti-link">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>
                  Lihat
                </a>
                <span v-else class="name-sub">–</span>
              </td>
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

      <div class="filter-bar">
        <div class="filter-pills">
          <button v-for="f in filters" :key="f.key"
            :class="['filter-pill', activeFilter === f.key && 'filter-pill--active']"
            @click="activeFilter = f.key">{{ f.label }}</button>
        </div>
        <input v-model="search" type="text" class="search-input" placeholder="Cari nama peserta…"/>
      </div>

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
            <tr v-for="r in filteredRows" :key="r.pelaksanaan_id"
              :class="selectedRow?.pelaksanaan_id === r.pelaksanaan_id ? 'tr-selected' : ''">
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
                  <button class="btn-aksi btn-aksi--ghost" @click="openDetail(r)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                    Detail
                  </button>
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

  </div>

  <!-- ── SIDE PANEL DETAIL ────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="side-panel">
      <div v-if="selectedRow" class="side-overlay" @click.self="selectedRow = null">
        <div class="side-panel">

          <!-- Header -->
          <div class="sp-header">
            <div class="sp-header__avatar">{{ selectedRow.nama_lengkap[0] }}</div>
            <div class="sp-header__info">
              <div class="sp-header__name">{{ selectedRow.nama_lengkap }}</div>
              <div class="sp-header__meta">
                <span v-if="selectedRow.divisi" class="sp-tag">{{ selectedRow.divisi }}</span>
                <span class="sp-header__periode">
                  {{ fmtDate(selectedRow.tanggal_mulai) }} – {{ fmtDate(selectedRow.tanggal_selesai) }}
                </span>
              </div>
            </div>
            <button class="sp-close" @click="selectedRow = null">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
          </div>

          <!-- Rekap chips -->
          <div class="sp-rekap">
            <div class="sp-rekap__item sp-rekap__item--green">
              <div class="sp-rekap__num">{{ selectedRow.hadir }}</div>
              <div class="sp-rekap__lbl">Hadir</div>
            </div>
            <div class="sp-rekap__item sp-rekap__item--yellow">
              <div class="sp-rekap__num">{{ selectedRow.izin }}</div>
              <div class="sp-rekap__lbl">Izin</div>
            </div>
            <div class="sp-rekap__item sp-rekap__item--blue">
              <div class="sp-rekap__num">{{ selectedRow.sakit }}</div>
              <div class="sp-rekap__lbl">Sakit</div>
            </div>
            <div class="sp-rekap__item sp-rekap__item--red">
              <div class="sp-rekap__num">{{ selectedRow.alpha }}</div>
              <div class="sp-rekap__lbl">Alpha</div>
            </div>
          </div>

          <!-- Progress bar kehadiran -->
          <div class="sp-progress-section">
            <div class="sp-progress-label">
              <span>Persentase Kehadiran</span>
              <strong :class="persen(selectedRow) >= 80 ? 'pct-good' : 'pct-warn'">{{ persen(selectedRow) }}%</strong>
            </div>
            <div class="sp-progress-track">
              <div class="sp-progress-fill"
                :class="persen(selectedRow) >= 80 ? 'sp-progress-fill--green' : 'sp-progress-fill--yellow'"
                :style="{ width: persen(selectedRow) + '%' }"></div>
            </div>
          </div>

          <!-- Aksi PDF -->
          <div class="sp-actions">
            <a class="sp-btn-pdf"
              :href="`/api/absensi/pelaksanaan/${selectedRow.pelaksanaan_id}/pdf`"
              target="_blank">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Unduh PDF Rekap
            </a>
          </div>

          <!-- Divider -->
          <div class="sp-divider">
            <span>Riwayat Absensi</span>
          </div>

          <!-- Tabel detail -->
          <div v-if="detailLoading" class="sp-loading">
            <div class="spinner"></div>
            <span>Memuat data…</span>
          </div>
          <div v-else-if="detailError" class="sp-error-msg">{{ detailError }}</div>
          <div v-else-if="detailList.length === 0" class="sp-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg>
            <p>Belum ada catatan absensi</p>
          </div>
          <div v-else class="sp-table-wrap">
            <table class="sp-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Masuk</th>
                  <th>Pulang</th>
                  <th>Ket.</th>
                  <th>Kegiatan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in detailList" :key="a.id">
                  <td class="td-date">{{ fmtDateShort(a.tanggal) }}</td>
                  <td class="td-time">{{ a.jam_masuk ?? '–' }}</td>
                  <td class="td-time">{{ a.jam_keluar ?? '–' }}</td>
                  <td><span :class="ketClass(a.keterangan)">{{ fmtKet(a.keterangan) }}</span></td>
                  <td class="td-kegiatan">{{ a.kegiatan ?? '–' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ── TOAST ────────────────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toastMsg" class="toast-msg">{{ toastMsg }}</div>
    </Transition>
  </Teleport>

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
  bukti_path:  string | null;
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
.tr-selected td { background: #f0fdf4; }

.name-cell { display: flex; align-items: center; gap: 10px; }
.name-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#48AF4A,#2d7a2e); color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.name-text { font-size: 13px; font-weight: 600; color: #111827; }
.name-sub  { font-size: 11.5px; color: #9ca3af; }

.tag { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 100px; font-size: 11.5px; font-weight: 600; padding: 3px 9px; }

.abs-num { font-size: 14px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
.abs-num--green  { color: #16a34a; background: #f0fdf4; }
.abs-num--yellow { color: #ca8a04; background: #fefce8; }
.abs-num--blue   { color: #2563eb; background: #eff6ff; }
.abs-num--red    { color: #dc2626; background: #fff1f2; }

.progress-wrap { height: 5px; background: #f1f5f9; border-radius: 100px; overflow: hidden; width: 60px; margin: 0 auto 3px; }
.progress-bar  { height: 100%; background: linear-gradient(90deg, #48AF4A, #16a34a); border-radius: 100px; transition: width .4s; }
.pct-label { font-size: 11px; font-weight: 600; color: #374151; }

.sp-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 100px; }
.sp-badge--green  { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.sp-badge--blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.sp-badge--orange { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.sp-badge--gray   { background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb; }

.aksi-cell { display: flex; gap: 6px; align-items: center; }
.btn-aksi { font-size: 11.5px; font-weight: 600; padding: 5px 11px; border-radius: 7px; cursor: pointer; font-family: inherit; border: 1.5px solid transparent; display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.btn-aksi--ghost { background: #f9fafb; color: #374151; border-color: #e5e7eb; }
.btn-aksi--ghost:hover { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
.btn-aksi--green { background: #f0fdf4; color: #15803d; border-color: #86efac; }
.btn-aksi--green:hover { background: #dcfce7; }
.btn-aksi--green:disabled { opacity:.5; cursor:not-allowed; }
.btn-aksi--red   { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.btn-aksi--red:hover { background: #ffe4e6; }
.btn-aksi--red:disabled { opacity:.5; cursor:not-allowed; }
.btn-aksi--blue  { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; text-decoration: none; }
.btn-aksi--blue:hover { background: #dbeafe; }

.jenis-badge { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px; }
.jenis-badge--izin  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.jenis-badge--sakit { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

.alasan-cell { font-size: 12.5px; color: #6b7280; max-width: 200px; }

.status-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 100px; }
.status-badge--pending { background: #fef9c3; color: #a16207; border: 1px solid #fde047; }
.status-badge--ok      { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.status-badge--tolak   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

.bukti-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #2563eb; text-decoration: none; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 100px; padding: 2px 8px; white-space: nowrap; }
.bukti-link:hover { background: #dbeafe; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 24px; gap: 10px; text-align: center; }
.empty-state__icon { width: 64px; height: 64px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; margin: 0; }

.ket-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 100px; }
.ket-badge--green  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.ket-badge--yellow { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.ket-badge--blue   { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.ket-badge--red    { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

/* ── Side Panel ─────────────────────────────────────────────── */
.side-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  display: flex; justify-content: flex-end;
}

.side-panel {
  width: 480px; max-width: 95vw;
  height: 100%;
  background: #fff;
  display: flex; flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.14);
  overflow: hidden;
}

/* ── Side panel header ── */
.sp-header {
  display: flex; align-items: center; gap: 14px;
  padding: 20px 22px 18px;
  border-bottom: 1px solid #f0faf0;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%);
  flex-shrink: 0;
}
.sp-header__avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, #48AF4A, #2d7a2e);
  color: #fff; font-size: 18px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: 0 2px 8px rgba(72,175,74,.3);
}
.sp-header__info { flex: 1; min-width: 0; }
.sp-header__name { font-size: 15px; font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-header__meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.sp-tag { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; border-radius: 100px; font-size: 11px; font-weight: 600; padding: 2px 8px; }
.sp-header__periode { font-size: 11.5px; color: #9ca3af; }
.sp-close {
  background: #f3f4f6; border: none; border-radius: 9px;
  width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #6b7280; flex-shrink: 0;
  transition: all .15s;
}
.sp-close:hover { background: #e5e7eb; color: #111827; }

/* ── Rekap chips ── */
.sp-rekap {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 0; padding: 0; border-bottom: 1px solid #f0faf0;
  flex-shrink: 0;
}
.sp-rekap__item {
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 8px; border-right: 1px solid #f0faf0;
  transition: background .15s;
}
.sp-rekap__item:last-child { border-right: none; }
.sp-rekap__num { font-size: 22px; font-weight: 800; }
.sp-rekap__lbl { font-size: 10.5px; color: #9ca3af; font-weight: 500; margin-top: 2px; }
.sp-rekap__item--green .sp-rekap__num { color: #16a34a; }
.sp-rekap__item--yellow .sp-rekap__num { color: #ca8a04; }
.sp-rekap__item--blue .sp-rekap__num { color: #2563eb; }
.sp-rekap__item--red .sp-rekap__num { color: #dc2626; }

/* ── Progress section ── */
.sp-progress-section { padding: 14px 22px 10px; flex-shrink: 0; }
.sp-progress-label { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280; margin-bottom: 7px; }
.pct-good { color: #16a34a; }
.pct-warn { color: #d97706; }
.sp-progress-track { height: 7px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
.sp-progress-fill { height: 100%; border-radius: 100px; transition: width .5s cubic-bezier(.4,0,.2,1); }
.sp-progress-fill--green  { background: linear-gradient(90deg, #48AF4A, #16a34a); }
.sp-progress-fill--yellow { background: linear-gradient(90deg, #f59e0b, #d97706); }

/* ── Aksi PDF ── */
.sp-actions { padding: 10px 22px 14px; flex-shrink: 0; }
.sp-btn-pdf {
  display: inline-flex; align-items: center; gap: 7px;
  background: #f0fdf4; color: #15803d;
  border: 1.5px solid #bbf7d0; border-radius: 9px;
  font-size: 12.5px; font-weight: 600; padding: 8px 16px;
  text-decoration: none; transition: all .15s;
}
.sp-btn-pdf:hover { background: #dcfce7; border-color: #86efac; }

/* ── Divider label ── */
.sp-divider {
  display: flex; align-items: center; padding: 0 22px;
  margin-bottom: 0; flex-shrink: 0;
}
.sp-divider::before, .sp-divider::after {
  content: ''; flex: 1; height: 1px; background: #f0faf0;
}
.sp-divider span {
  font-size: 10.5px; font-weight: 700; color: #9ca3af;
  text-transform: uppercase; letter-spacing: .06em;
  padding: 0 12px; white-space: nowrap;
}

/* ── Table ── */
.sp-table-wrap { flex: 1; overflow-y: auto; padding-bottom: 16px; }
.sp-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.sp-table th {
  position: sticky; top: 0; z-index: 1;
  padding: 9px 14px;
  font-size: 10px; font-weight: 700; color: #9ca3af;
  background: #f9fafb; border-bottom: 1px solid #f1f5f9;
  text-transform: uppercase; letter-spacing: .05em; text-align: left;
  white-space: nowrap;
}
.sp-table td { padding: 10px 14px; border-bottom: 1px solid #f9fafb; color: #374151; vertical-align: middle; }
.sp-table tr:last-child td { border-bottom: none; }
.sp-table tr:hover td { background: #f9fafb; }
.td-date { font-weight: 600; white-space: nowrap; font-size: 12px; }
.td-time { font-size: 12px; color: #6b7280; white-space: nowrap; }
.td-kegiatan { font-size: 11.5px; color: #6b7280; max-width: 140px; }

/* ── Loading / empty / error ── */
.sp-loading { display: flex; flex-direction: column; align-items: center; padding: 40px; gap: 12px; color: #9ca3af; font-size: 13px; }
.sp-error-msg { padding: 20px 22px; color: #dc2626; font-size: 13px; }
.sp-empty { display: flex; flex-direction: column; align-items: center; padding: 40px; gap: 12px; color: #9ca3af; }
.sp-empty p { font-size: 13px; margin: 0; }

/* ── Transition side panel ── */
.side-panel-enter-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.side-panel-leave-active { transition: all .25s cubic-bezier(.4,0,.2,1); }
.side-panel-enter-from .side-panel { transform: translateX(100%); }
.side-panel-leave-to .side-panel { transform: translateX(100%); }
.side-panel-enter-from { opacity: 0; }
.side-panel-leave-to { opacity: 0; }

/* ── Toast ── */
.toast-msg { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1a2e1a; color: #fff; font-size: 13px; font-weight: 600; padding: 10px 22px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,.18); z-index: 9999; white-space: nowrap; }
.toast-enter-active, .toast-leave-active { transition: all .3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }

/* ── Modal ── */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; backdrop-filter: blur(2px); }
.modal-box { background: #fff; border-radius: 18px; width: 100%; max-width: 420px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.modal-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 8px; }
.modal-desc  { font-size: 13px; color: #6b7280; margin-bottom: 18px; line-height: 1.6; }
.modal-field { margin-bottom: 14px; }
.modal-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 5px; }
.modal-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 13px; font-size: 13px; font-family: inherit; resize: vertical; outline: none; color: #111827; box-sizing: border-box; }
.modal-textarea:focus { border-color: #48AF4A; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-cancel { background: #f3f4f6; color: #374151; border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-cancel:hover { background: #e5e7eb; }
.btn-red { background: #dc2626; color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-red:hover { background: #b91c1c; }
.btn-red:disabled { opacity: .55; cursor: not-allowed; }

.btn-green-sm { background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; }
.btn-green-sm:hover { background: #dcfce7; }

.spinner { width: 26px; height: 26px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
