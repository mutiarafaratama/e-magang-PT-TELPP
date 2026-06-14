<template>
  <div class="card">
    <div class="card-header">
      <div>
        <h3 class="card-title">Sedang Berlangsung</h3>
        <p class="card-subtitle">Peserta yang sudah memiliki jadwal magang aktif</p>
      </div>
      <div class="card-header-actions">
        <span v-if="!loading" class="count-badge">{{ rows.length }} peserta</span>
        <button class="btn-green-sm" @click="fetchData">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 20v-6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="empty-state"><div class="spinner"></div></div>
    <div v-else-if="error" class="empty-state">
      <p class="text-red">{{ error }}</p>
      <button class="btn-green-sm" @click="fetchData">Coba lagi</button>
    </div>
    <div v-else-if="rows.length === 0" class="empty-state">
      <div class="empty-state__icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#d1d5db" stroke-width="1.5"/>
          <circle cx="9" cy="7" r="4" stroke="#d1d5db" stroke-width="1.5"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M16 3.13a4 4 0 010 7.75" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <p>Belum ada peserta dengan jadwal magang aktif.</p>
    </div>
    <div v-else class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Peserta</th><th>Divisi</th><th>Periode</th>
            <th>Progress</th><th>Status</th><th>Sisa Hari</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pl in rows" :key="pl.id">
            <td>
              <div class="name-cell">
                <div class="name-avatar">{{ pl.nama_lengkap[0] }}</div>
                <div>
                  <div class="name-text">{{ pl.nama_lengkap }}</div>
                  <div class="name-sub">{{ pl.asal_institusi }}</div>
                  <div class="name-sub">{{ formatKategori(pl.kategori_magang) }}</div>
                </div>
              </div>
            </td>
            <td>
              <span v-if="pl.divisi" class="tag">{{ pl.divisi }}</span>
              <span v-else class="name-sub">–</span>
            </td>
            <td>
              <div class="name-text" style="font-size:12px;white-space:nowrap">{{ formatDate(pl.tanggal_mulai) }}</div>
              <div class="name-sub" style="white-space:nowrap">s/d {{ formatDate(pl.tanggal_selesai) }}</div>
            </td>
            <td style="min-width:110px">
              <div class="progress-wrap">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressPersen(pl.tanggal_mulai, pl.tanggal_selesai) + '%' }"></div>
                </div>
                <span class="progress-label">{{ progressPersen(pl.tanggal_mulai, pl.tanggal_selesai) }}%</span>
              </div>
            </td>
            <td><span :class="statusClass(pl.status)">{{ formatStatus(pl.status) }}</span></td>
            <td>
              <span v-if="sisaHari(pl.tanggal_selesai) < 0" class="sisa-hari sisa-hari--over">Lewat {{ Math.abs(sisaHari(pl.tanggal_selesai)) }}h</span>
              <span v-else-if="sisaHari(pl.tanggal_selesai) <= 7" class="sisa-hari sisa-hari--warn">{{ sisaHari(pl.tanggal_selesai) }} hari</span>
              <span v-else class="sisa-hari">{{ sisaHari(pl.tanggal_selesai) }} hari</span>
            </td>
            <td>
              <div class="aksi-cell">
                <!-- Workflow buttons -->
                <button
                  v-if="pl.status === 'menunggu_mulai'"
                  class="btn-aksi btn-aksi--green"
                  :disabled="updatingId === pl.id"
                  @click="updateStatus(pl.id, 'aktif')"
                >{{ updatingId === pl.id ? '...' : 'Aktifkan' }}</button>
                <button
                  v-else-if="pl.status === 'upload_laporan'"
                  class="btn-aksi btn-aksi--orange"
                  :disabled="updatingId === pl.id"
                  @click="updateStatus(pl.id, 'penilaian')"
                >{{ updatingId === pl.id ? '...' : 'Ke Penilaian' }}</button>

                <!-- Selalu tampil: Detail + Lihat Absensi -->
                <button class="btn-aksi btn-aksi--ghost" @click="openDetail(pl)">Detail</button>
                <button class="btn-aksi btn-aksi--ghost-blue" @click="openAbsensi(pl)">Absensi</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="updateError" class="update-error">{{ updateError }}</div>
  </div>

  <!-- ── Drawer: Detail Peserta ─────────────────────────────── -->
  <Teleport to="body">
    <div v-if="showDetail" class="drawer-overlay" @click.self="showDetail = false">
      <div class="drawer">
        <div class="drawer-header">
          <div>
            <h2 class="drawer-title">Detail Peserta</h2>
            <p class="drawer-sub" v-if="selected">{{ selected.nama_lengkap }}</p>
          </div>
          <button class="drawer-close" @click="showDetail = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div v-if="selected" class="drawer-body">
          <!-- Avatar + nama -->
          <div class="profile-banner">
            <div class="profile-avatar">{{ selected.nama_lengkap[0] }}</div>
            <div>
              <div class="profile-name">{{ selected.nama_lengkap }}</div>
              <div class="profile-sub">{{ selected.asal_institusi }}</div>
              <div class="profile-sub">{{ selected.jurusan }}</div>
            </div>
          </div>

          <!-- Info grid -->
          <div class="info-section">
            <div class="info-section__title">Informasi Magang</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Kategori</div>
                <div class="info-value">{{ formatKategori(selected.kategori_magang) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Divisi</div>
                <div class="info-value">{{ selected.divisi ?? '–' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tanggal Mulai</div>
                <div class="info-value">{{ formatDate(selected.tanggal_mulai) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Tanggal Selesai</div>
                <div class="info-value">{{ formatDate(selected.tanggal_selesai) }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Status</div>
                <div class="info-value"><span :class="statusClass(selected.status)">{{ formatStatus(selected.status) }}</span></div>
              </div>
              <div class="info-item">
                <div class="info-label">Sisa Hari</div>
                <div class="info-value">
                  <span v-if="sisaHari(selected.tanggal_selesai) < 0" class="sisa-hari sisa-hari--over">Lewat {{ Math.abs(sisaHari(selected.tanggal_selesai)) }} hari</span>
                  <span v-else-if="sisaHari(selected.tanggal_selesai) <= 7" class="sisa-hari sisa-hari--warn">{{ sisaHari(selected.tanggal_selesai) }} hari</span>
                  <span v-else class="sisa-hari">{{ sisaHari(selected.tanggal_selesai) }} hari</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress -->
          <div class="info-section">
            <div class="info-section__title">Progress Magang</div>
            <div class="progress-wrap-lg">
              <div class="progress-bar-lg">
                <div class="progress-fill" :style="{ width: progressPersen(selected.tanggal_mulai, selected.tanggal_selesai) + '%' }"></div>
              </div>
              <span class="progress-pct">{{ progressPersen(selected.tanggal_mulai, selected.tanggal_selesai) }}%</span>
            </div>
          </div>

          <!-- Nilai (jika sudah ada) -->
          <div v-if="selected.nilai !== null" class="info-section">
            <div class="info-section__title">Penilaian</div>
            <div class="nilai-display">
              <div class="nilai-score">{{ selected.nilai }}</div>
              <div class="nilai-label">/ 100</div>
            </div>
          </div>

          <!-- Tombol Lihat Absensi dari sini juga -->
          <button class="btn-absensi-link" @click="showDetail = false; openAbsensi(selected)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Lihat Rekap Absensi
          </button>
        </div>

        <!-- Footer: workflow action -->
        <div v-if="selected && ['menunggu_mulai','upload_laporan'].includes(selected.status)" class="drawer-footer">
          <button
            v-if="selected.status === 'menunggu_mulai'"
            class="btn-full btn-full--green"
            :disabled="updatingId === selected.id"
            @click="updateStatus(selected.id, 'aktif')"
          >{{ updatingId === selected.id ? 'Memproses...' : 'Aktifkan Magang' }}</button>
          <button
            v-else-if="selected.status === 'upload_laporan'"
            class="btn-full btn-full--orange"
            :disabled="updatingId === selected.id"
            @click="updateStatus(selected.id, 'penilaian')"
          >{{ updatingId === selected.id ? 'Memproses...' : 'Pindah ke Tahap Penilaian' }}</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ── Drawer: Rekap Absensi ──────────────────────────────── -->
  <Teleport to="body">
    <div v-if="showAbsensi" class="drawer-overlay" @click.self="showAbsensi = false">
      <div class="drawer drawer--wide">
        <div class="drawer-header">
          <div>
            <h2 class="drawer-title">Rekap Absensi</h2>
            <p class="drawer-sub" v-if="absensiTarget">{{ absensiTarget.nama_lengkap }}</p>
          </div>
          <button class="drawer-close" @click="showAbsensi = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
        </div>

        <div class="drawer-body">
          <!-- Ringkasan -->
          <div v-if="!absensiLoading && absensiList.length" class="rekap-summary">
            <div class="rekap-chip rekap-chip--green">✓ Hadir {{ absensiList.filter(a => a.status === 'hadir').length }}</div>
            <div class="rekap-chip rekap-chip--yellow">~ Izin {{ absensiList.filter(a => a.status === 'izin').length }}</div>
            <div class="rekap-chip rekap-chip--blue">+ Sakit {{ absensiList.filter(a => a.status === 'sakit').length }}</div>
            <div class="rekap-chip rekap-chip--red">✗ Alpha {{ absensiList.filter(a => a.status === 'alpha').length }}</div>
          </div>

          <div v-if="absensiLoading" class="empty-state" style="padding:40px 0"><div class="spinner"></div></div>
          <div v-else-if="absensiError" class="empty-state" style="padding:40px 0">
            <p class="text-red">{{ absensiError }}</p>
          </div>
          <div v-else-if="absensiList.length === 0" class="empty-state" style="padding:40px 0">
            <p>Belum ada data absensi.</p>
          </div>
          <div v-else class="abs-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Tanggal</th><th>Jam Masuk</th><th>Jam Keluar</th>
                  <th>Status</th><th>Kegiatan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in absensiList" :key="a.id">
                  <td style="white-space:nowrap">{{ formatDate(a.tanggal) }}</td>
                  <td>{{ a.jam_masuk ?? '–' }}</td>
                  <td>{{ a.jam_keluar ?? '–' }}</td>
                  <td><span :class="absensiStatusClass(a.status)">{{ formatAbsensiStatus(a.status) }}</span></td>
                  <td class="td-kegiatan">{{ a.kegiatan ?? '–' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/lib/api";

interface Pengajuan { id: string; nama_lengkap: string; asal_institusi: string; jurusan: string; kategori_magang: string; }
interface Pelaksanaan { id: string; pengajuan_id: string; tanggal_mulai: string; tanggal_selesai: string; divisi: string | null; status: string; nilai: number | null; }
interface Row extends Pelaksanaan { nama_lengkap: string; asal_institusi: string; jurusan: string; kategori_magang: string; }
interface Absensi { id: string; tanggal: string; jam_masuk: string | null; jam_keluar: string | null; kegiatan: string | null; status: string; }

const allPelaksanaan = ref<Pelaksanaan[]>([]);
const allPengajuan   = ref<Pengajuan[]>([]);
const loading        = ref(false);
const error          = ref<string | null>(null);
const updatingId     = ref<string | null>(null);
const updateError    = ref('');

// Detail drawer
const showDetail = ref(false);
const selected   = ref<Row | null>(null);

// Absensi drawer
const showAbsensi    = ref(false);
const absensiTarget  = ref<Row | null>(null);
const absensiList    = ref<Absensi[]>([]);
const absensiLoading = ref(false);
const absensiError   = ref('');

const rows = computed<Row[]>(() => {
  const pMap = new Map(allPengajuan.value.map(p => [p.id, p]));
  return allPelaksanaan.value
    .filter(pl => pl.status !== "selesai")
    .map(pl => {
      const pj = pMap.get(pl.pengajuan_id);
      return { ...pl, nama_lengkap: pj?.nama_lengkap ?? "–", asal_institusi: pj?.asal_institusi ?? "–", jurusan: pj?.jurusan ?? "–", kategori_magang: pj?.kategori_magang ?? "–" };
    });
});

async function fetchData() {
  loading.value = true; error.value = null;
  try {
    const [rPl, rPj] = await Promise.all([
      api.get("/api/pelaksanaan?page=1&limit=200"),
      api.get("/api/pengajuan?page=1&limit=200"),
    ]);
    allPelaksanaan.value = Array.isArray(rPl.data.data) ? rPl.data.data : [];
    allPengajuan.value   = Array.isArray(rPj.data.data) ? rPj.data.data : [];
  } catch (e: any) {
    error.value = e.response?.data?.message ?? "Gagal memuat data.";
  } finally { loading.value = false; }
}

function openDetail(row: Row) {
  selected.value = row;
  showDetail.value = true;
}

async function openAbsensi(row: Row) {
  absensiTarget.value = row;
  absensiList.value = [];
  absensiError.value = '';
  showAbsensi.value = true;
  absensiLoading.value = true;
  try {
    const r = await api.get(`/api/absensi/pelaksanaan/${row.id}`);
    absensiList.value = Array.isArray(r.data.data) ? r.data.data : [];
  } catch (e: any) {
    absensiError.value = e.response?.data?.message ?? 'Gagal memuat data absensi.';
  } finally {
    absensiLoading.value = false;
  }
}

async function updateStatus(id: string, status: string) {
  updatingId.value = id;
  updateError.value = '';
  try {
    await api.patch(`/api/pelaksanaan/${id}/status`, { status });
    const idx = allPelaksanaan.value.findIndex(p => p.id === id);
    if (idx !== -1) allPelaksanaan.value[idx].status = status;
    if (selected.value?.id === id) selected.value = { ...selected.value, status };
  } catch (e: any) {
    updateError.value = e.response?.data?.message ?? 'Gagal memperbarui status';
    setTimeout(() => { updateError.value = ''; }, 4000);
  } finally {
    updatingId.value = null;
  }
}

function sisaHari(selesai: string): number {
  const s = new Date(selesai); s.setHours(0,0,0,0);
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.ceil((s.getTime() - t.getTime()) / 86400000);
}
function progressPersen(mulai: string, selesai: string): number {
  const start = new Date(mulai).getTime(), end = new Date(selesai).getTime(), now = Date.now();
  if (now <= start) return 0; if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}
function formatStatus(s: string) {
  return ({ menunggu_mulai:"Belum Mulai", aktif:"Aktif", upload_laporan:"Upload Laporan", penilaian:"Penilaian", selesai:"Selesai" } as Record<string,string>)[s] ?? s;
}
function statusClass(s: string) {
  if (s === "aktif")          return "sp-badge sp-badge--green";
  if (s === "menunggu_mulai") return "sp-badge sp-badge--gray";
  if (s === "upload_laporan") return "sp-badge sp-badge--blue";
  if (s === "penilaian")      return "sp-badge sp-badge--orange";
  return "sp-badge sp-badge--gray";
}
function formatAbsensiStatus(s: string) {
  return ({ hadir:"Hadir", izin:"Izin", sakit:"Sakit", alpha:"Alpha" } as Record<string,string>)[s] ?? s;
}
function absensiStatusClass(s: string) {
  if (s === "hadir") return "abs-badge abs-badge--green";
  if (s === "izin")  return "abs-badge abs-badge--yellow";
  if (s === "sakit") return "abs-badge abs-badge--blue";
  if (s === "alpha") return "abs-badge abs-badge--red";
  return "abs-badge";
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric" });
}
function formatKategori(k: string) {
  return ({ siswa_smk:"Siswa SMK", mahasiswa_d3:"Mahasiswa D3", mahasiswa_s1:"Mahasiswa S1", penelitian:"Penelitian" } as Record<string,string>)[k] ?? k;
}

onMounted(fetchData);
</script>

<style scoped>
.card { background:#fff; border-radius:14px; border:1px solid #e9f5e9; box-shadow:0 1px 3px rgba(13,40,24,0.05); overflow:hidden; }
.card-header { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; border-bottom:1px solid #f0faf0; gap:12px; flex-wrap:wrap; }
.card-title { font-size:13.5px; font-weight:700; color:#111827; margin:0; }
.card-subtitle { font-size:12px; color:#9ca3af; margin:2px 0 0; }
.card-header-actions { display:flex; align-items:center; gap:8px; }
.count-badge { background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; font-size:11px; font-weight:700; padding:4px 12px; border-radius:100px; }
.btn-green-sm { background:#48AF4A; color:#fff; border:none; border-radius:8px; padding:6px 14px; font-size:12px; font-weight:600; font-family:inherit; cursor:pointer; white-space:nowrap; display:flex; align-items:center; gap:5px; }
.btn-green-sm:hover { background:#3d9e3f; }

.table-wrap { overflow-x:auto; }
.data-table { width:100%; border-collapse:collapse; font-size:13px; }
.data-table th { padding:11px 16px; text-align:left; font-size:10.5px; font-weight:600; color:#6b7280; background:#f9fafb; border-bottom:1px solid #f1f5f9; text-transform:uppercase; letter-spacing:0.04em; white-space:nowrap; }
.data-table td { padding:13px 16px; border-bottom:1px solid #f9fafb; color:#374151; vertical-align:middle; }
.td-kegiatan { max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

.name-cell { display:flex; align-items:center; gap:10px; }
.name-avatar { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,#48AF4A,#2d8f30); color:#fff; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.name-text { font-weight:600; color:#111827; font-size:12.5px; }
.name-sub { font-size:11px; color:#9ca3af; }
.tag { background:#eff6ff; color:#1d4ed8; border-radius:6px; padding:2px 8px; font-size:11px; font-weight:600; white-space:nowrap; }

.empty-state { display:flex; flex-direction:column; align-items:center; padding:44px 24px; gap:12px; text-align:center; }
.empty-state__icon { width:72px; height:72px; background:#f9fafb; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.empty-state p { font-size:13px; color:#9ca3af; line-height:1.7; margin:0; }
.text-red { color:#dc2626; font-size:13px; }
.spinner { width:24px; height:24px; border:2.5px solid #e5e7eb; border-top-color:#48AF4A; border-radius:50%; animation:spin 0.7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.sp-badge { display:inline-flex; align-items:center; font-size:11px; font-weight:700; padding:3px 9px; border-radius:100px; white-space:nowrap; }
.sp-badge--green  { background:#dcfce7; color:#16a34a; }
.sp-badge--gray   { background:#f3f4f6; color:#6b7280; }
.sp-badge--blue   { background:#dbeafe; color:#2563eb; }
.sp-badge--orange { background:#ffedd5; color:#ea580c; }

.abs-badge { display:inline-flex; align-items:center; font-size:11px; font-weight:700; padding:3px 9px; border-radius:100px; }
.abs-badge--green  { background:#dcfce7; color:#15803d; }
.abs-badge--yellow { background:#fef9c3; color:#a16207; }
.abs-badge--blue   { background:#dbeafe; color:#1d4ed8; }
.abs-badge--red    { background:#fee2e2; color:#dc2626; }

.progress-wrap  { display:flex; flex-direction:column; gap:4px; }
.progress-bar   { height:6px; background:#e5e7eb; border-radius:100px; overflow:hidden; }
.progress-fill  { height:100%; background:linear-gradient(90deg,#48AF4A,#22c55e); border-radius:100px; transition:width 0.4s; }
.progress-label { font-size:10.5px; color:#6b7280; font-weight:600; }
.sisa-hari       { font-size:12px; font-weight:700; color:#374151; }
.sisa-hari--warn { color:#ea580c; }
.sisa-hari--over { color:#dc2626; }

.aksi-cell { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.btn-aksi { border:none; border-radius:7px; padding:5px 11px; font-size:11.5px; font-weight:700; font-family:inherit; cursor:pointer; white-space:nowrap; transition:opacity .15s; }
.btn-aksi:disabled { opacity:0.5; cursor:default; }
.btn-aksi--green      { background:#dcfce7; color:#15803d; }
.btn-aksi--green:hover:not(:disabled)      { background:#bbf7d0; }
.btn-aksi--orange     { background:#ffedd5; color:#c2410c; }
.btn-aksi--orange:hover:not(:disabled)     { background:#fed7aa; }
.btn-aksi--ghost      { background:#f3f4f6; color:#374151; }
.btn-aksi--ghost:hover { background:#e5e7eb; }
.btn-aksi--ghost-blue  { background:#eff6ff; color:#1d4ed8; }
.btn-aksi--ghost-blue:hover { background:#dbeafe; }

.update-error { margin:12px 16px; background:#fff1f2; border:1px solid #fecdd3; color:#be123c; font-size:12.5px; padding:8px 14px; border-radius:8px; }

/* ── Drawer ────────────────────────────────────────────────── */
.drawer-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(2px); z-index:200; display:flex; justify-content:flex-end; }
.drawer { width:min(480px,100vw); height:100vh; background:#fff; display:flex; flex-direction:column; box-shadow:-4px 0 24px rgba(0,0,0,0.12); overflow:hidden; }
.drawer--wide { width:min(620px,100vw); }
.drawer-header { display:flex; align-items:flex-start; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid #f0faf0; flex-shrink:0; }
.drawer-title { font-size:16px; font-weight:700; color:#111827; margin:0 0 2px; }
.drawer-sub { font-size:12.5px; color:#6b7280; margin:0; }
.drawer-close { background:#f3f4f6; border:none; border-radius:8px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#6b7280; flex-shrink:0; margin-top:2px; }
.drawer-close:hover { background:#e5e7eb; color:#111827; }
.drawer-body { flex:1; overflow-y:auto; padding:20px 24px; display:flex; flex-direction:column; gap:20px; }
.drawer-footer { flex-shrink:0; padding:16px 24px; border-top:1px solid #f0faf0; background:#fff; }

/* Profile banner */
.profile-banner { display:flex; align-items:center; gap:14px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px; }
.profile-avatar { width:48px; height:48px; border-radius:12px; background:linear-gradient(135deg,#48AF4A,#2d8f30); color:#fff; font-size:20px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.profile-name { font-size:15px; font-weight:700; color:#111827; }
.profile-sub  { font-size:12px; color:#6b7280; margin-top:2px; }

/* Info section */
.info-section { display:flex; flex-direction:column; gap:10px; }
.info-section__title { font-size:11px; font-weight:700; color:#6b7280; text-transform:uppercase; letter-spacing:0.06em; }
.info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.info-item { background:#f9fafb; border:1px solid #f1f5f9; border-radius:10px; padding:10px 14px; }
.info-label { font-size:11px; color:#9ca3af; font-weight:500; margin-bottom:3px; }
.info-value { font-size:13px; font-weight:600; color:#111827; }

/* Progress large */
.progress-wrap-lg { display:flex; align-items:center; gap:12px; }
.progress-bar-lg { flex:1; height:10px; background:#e5e7eb; border-radius:100px; overflow:hidden; }
.progress-pct { font-size:13px; font-weight:700; color:#48AF4A; white-space:nowrap; }

/* Nilai */
.nilai-display { display:flex; align-items:baseline; gap:6px; }
.nilai-score { font-size:36px; font-weight:800; color:#48AF4A; }
.nilai-label { font-size:14px; color:#9ca3af; }

/* Link ke absensi */
.btn-absensi-link { display:flex; align-items:center; gap:8px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; border-radius:10px; padding:11px 16px; font-size:13px; font-weight:600; font-family:inherit; cursor:pointer; width:100%; justify-content:center; }
.btn-absensi-link:hover { background:#dbeafe; }

/* Full-width buttons drawer footer */
.btn-full { width:100%; border:none; border-radius:10px; padding:12px; font-size:13.5px; font-weight:700; font-family:inherit; cursor:pointer; }
.btn-full:disabled { opacity:0.5; cursor:default; }
.btn-full--green  { background:#48AF4A; color:#fff; }
.btn-full--green:hover:not(:disabled) { background:#3d9e3f; }
.btn-full--orange { background:#ea580c; color:#fff; }
.btn-full--orange:hover:not(:disabled) { background:#c2410c; }

/* Rekap summary chips */
.rekap-summary { display:flex; gap:8px; flex-wrap:wrap; }
.rekap-chip { font-size:11.5px; font-weight:700; padding:5px 12px; border-radius:100px; }
.rekap-chip--green  { background:#dcfce7; color:#15803d; }
.rekap-chip--yellow { background:#fef9c3; color:#a16207; }
.rekap-chip--blue   { background:#dbeafe; color:#1d4ed8; }
.rekap-chip--red    { background:#fee2e2; color:#dc2626; }

.abs-table-wrap { overflow-x:auto; border:1px solid #f1f5f9; border-radius:10px; }

@media (max-width:600px) { .info-grid { grid-template-columns:1fr; } .drawer, .drawer--wide { width:100vw; } }
</style>
