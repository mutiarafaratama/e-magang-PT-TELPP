<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Dokumen Saya</h3>
    </div>

    <div v-if="loading" class="empty-state"><div class="spinner"></div></div>

    <div v-else-if="dokumenList.length === 0" class="empty-state">
      <div class="empty-state__icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#d1d5db" stroke-width="1.5"/>
          <polyline points="17 8 12 3 7 8" stroke="#d1d5db" stroke-width="1.5"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke="#d1d5db" stroke-width="1.5"/>
        </svg>
      </div>
      <p>Belum ada dokumen terupload.<br/>Upload dokumen setelah magang dikonfirmasi HRD.</p>
    </div>

    <div v-else class="dok-list">
      <div v-for="d in dokumenList" :key="d.id" class="dok-item">
        <div class="dok-item__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#48AF4A" stroke-width="2"/>
            <polyline points="14 2 14 8 20 8" stroke="#48AF4A" stroke-width="2"/>
          </svg>
        </div>
        <div class="dok-item__info">
          <div class="dok-item__name">{{ d.nama_file }}</div>
          <div class="dok-item__meta">{{ labelJenis(d.jenis) }} · {{ formatUkuran(d.ukuran_bytes) }}</div>
        </div>
        <a :href="`/api/dokumen/${d.id}/download`" class="btn-download" target="_blank">Unduh</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/lib/api";

const loading     = ref(false);
const dokumenList = ref<any[]>([]);

const JENIS_LABEL: Record<string, string> = {
  proposal_magang: "Proposal Magang",
  ktp:             "KTP",
  ktm:             "KTM",
  pasfoto:         "Pasfoto",
  bpjs_kis:        "BPJS / KIS",
  surat_balasan:   "Surat Balasan",
  laporan_magang:  "Laporan Magang",
  sertifikat:      "Sertifikat",
};

function labelJenis(j: string) {
  return JENIS_LABEL[j] ?? j;
}

function formatUkuran(bytes: number) {
  if (!bytes) return "–";
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

async function fetchDokumen() {
  loading.value = true;
  try {
    const res = await api.get("/api/dokumen/pengajuan/saya");
    dokumenList.value = Array.isArray(res.data?.data) ? res.data.data : [];
  } catch {
    dokumenList.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDokumen);
</script>

<style scoped>
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.dok-list { padding: 8px 0; }
.dok-item { display: flex; align-items: center; gap: 14px; padding: 12px 20px; border-bottom: 1px solid #f9fafb; }
.dok-item:last-child { border-bottom: none; }
.dok-item__icon { width: 38px; height: 38px; background: #f0fdf4; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.dok-item__info { flex: 1; min-width: 0; }
.dok-item__name { font-size: 13px; font-weight: 600; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dok-item__meta { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }
.btn-download { background: #f3f4f6; color: #374151; border: none; border-radius: 7px; padding: 5px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; text-decoration: none; white-space: nowrap; flex-shrink: 0; }
.btn-download:hover { background: #e5e7eb; }
</style>
