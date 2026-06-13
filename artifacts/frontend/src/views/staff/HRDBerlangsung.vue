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
              <!-- Tombol aksi berdasarkan status -->
              <div class="aksi-cell">
                <button
                  v-if="pl.status === 'menunggu_mulai'"
                  class="btn-aksi btn-aksi--green"
                  :disabled="updatingId === pl.id"
                  @click="updateStatus(pl.id, 'aktif')"
                >
                  {{ updatingId === pl.id ? '...' : 'Aktifkan' }}
                </button>
                <button
                  v-else-if="pl.status === 'aktif'"
                  class="btn-aksi btn-aksi--blue"
                  :disabled="updatingId === pl.id"
                  @click="updateStatus(pl.id, 'upload_laporan')"
                >
                  {{ updatingId === pl.id ? '...' : 'Upload Laporan' }}
                </button>
                <button
                  v-else-if="pl.status === 'upload_laporan'"
                  class="btn-aksi btn-aksi--orange"
                  :disabled="updatingId === pl.id"
                  @click="updateStatus(pl.id, 'penilaian')"
                >
                  {{ updatingId === pl.id ? '...' : 'Ke Penilaian' }}
                </button>
                <span v-else class="name-sub">–</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Error toast -->
    <div v-if="updateError" class="update-error">{{ updateError }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "@/lib/api";

interface Pengajuan { id: string; nama_lengkap: string; asal_institusi: string; jurusan: string; kategori_magang: string; }
interface Pelaksanaan { id: string; pengajuan_id: string; tanggal_mulai: string; tanggal_selesai: string; divisi: string | null; status: string; nilai: number | null; }
interface Row extends Pelaksanaan { nama_lengkap: string; asal_institusi: string; jurusan: string; kategori_magang: string; }

const allPelaksanaan = ref<Pelaksanaan[]>([]);
const allPengajuan   = ref<Pengajuan[]>([]);
const loading        = ref(false);
const error          = ref<string | null>(null);
const updatingId     = ref<string | null>(null);
const updateError    = ref('');

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

async function updateStatus(id: string, status: string) {
  updatingId.value = id;
  updateError.value = '';
  try {
    await api.patch(`/api/pelaksanaan/${id}/status`, { status });
    // Update lokal langsung tanpa refetch
    const idx = allPelaksanaan.value.findIndex(p => p.id === id);
    if (idx !== -1) allPelaksanaan.value[idx].status = status;
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
.progress-wrap  { display:flex; flex-direction:column; gap:4px; }
.progress-bar   { height:6px; background:#e5e7eb; border-radius:100px; overflow:hidden; }
.progress-fill  { height:100%; background:linear-gradient(90deg,#48AF4A,#22c55e); border-radius:100px; transition:width 0.4s; }
.progress-label { font-size:10.5px; color:#6b7280; font-weight:600; }
.sisa-hari       { font-size:12px; font-weight:700; color:#374151; }
.sisa-hari--warn { color:#ea580c; }
.sisa-hari--over { color:#dc2626; }

/* Aksi */
.aksi-cell { display:flex; align-items:center; }
.btn-aksi { border:none; border-radius:7px; padding:5px 12px; font-size:11.5px; font-weight:700; font-family:inherit; cursor:pointer; white-space:nowrap; transition:opacity .15s; }
.btn-aksi:disabled { opacity:0.5; cursor:default; }
.btn-aksi--green  { background:#dcfce7; color:#15803d; }
.btn-aksi--green:hover:not(:disabled)  { background:#bbf7d0; }
.btn-aksi--blue   { background:#dbeafe; color:#1d4ed8; }
.btn-aksi--blue:hover:not(:disabled)   { background:#bfdbfe; }
.btn-aksi--orange { background:#ffedd5; color:#c2410c; }
.btn-aksi--orange:hover:not(:disabled) { background:#fed7aa; }

.update-error { margin:12px 16px; background:#fff1f2; border:1px solid #fecdd3; color:#be123c; font-size:12.5px; padding:8px 14px; border-radius:8px; }
</style>
