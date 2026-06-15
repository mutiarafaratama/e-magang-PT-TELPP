<template>
  <div>
    <!-- ── ABSENSI HARI INI ─────────────────────────────────── -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Absensi Hari Ini</h3>
        <span class="today-chip">{{ todayLabel }}</span>
      </div>

      <div v-if="absensiLoading" class="empty-state"><div class="spinner"></div></div>

      <div v-else-if="absensiState === 'no_magang'" class="empty-state">
        <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
        <p>Absensi tersedia setelah jadwal magang dikonfirmasi oleh HRD.</p>
      </div>

      <div v-else-if="absensiState === 'locked'" class="absensi-panel">
        <div class="ap-icon ap-icon--locked"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div class="ap-title">Sesi Absen Masuk Belum Dibuka</div>
        <div class="ap-desc">Dibuka pukul <strong>{{ cfg?.jam_masuk_buka }}</strong> WIB</div>
        <div class="ap-countdown">{{ countdownMasukText }}</div>
      </div>

      <div v-else-if="absensiState === 'checkin_open'" class="absensi-panel">
        <div class="ap-icon ap-icon--open"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polyline points="9 11 12 14 22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="ap-title">Sesi Absen Masuk Dibuka</div>
        <div class="ap-desc">{{ cfg?.jam_masuk_buka }} – {{ cfg?.jam_masuk_tutup }} WIB</div>
        <div v-if="absensiError" class="ap-error">{{ absensiError }}</div>
        <div v-if="gpsError" class="ap-error">{{ gpsError }}</div>
        <button class="btn-absen" :disabled="gpsLoading" @click="openCheckinModal">
          <span v-if="gpsLoading" class="btn-spinner"></span>
          {{ gpsLoading ? 'Mendapatkan lokasi...' : 'Absen Masuk Sekarang' }}
        </button>
      </div>

      <div v-else-if="absensiState === 'waiting_pulang'" class="absensi-panel">
        <div class="ap-done-row"><span class="ap-badge ap-badge--masuk">✓ Masuk</span><span class="ap-done-time">{{ todayAbsensi?.jam_masuk }} WIB</span></div>
        <div class="ap-icon ap-icon--wait" style="margin-top:20px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div class="ap-title">Menunggu Sesi Absen Pulang</div>
        <div class="ap-desc">Dibuka pukul <strong>{{ cfg?.jam_pulang_buka }}</strong> WIB</div>
        <div class="ap-countdown">{{ countdownPulangText }}</div>
      </div>

      <div v-else-if="absensiState === 'checkout_open'" class="absensi-panel">
        <div class="ap-done-row"><span class="ap-badge ap-badge--masuk">✓ Masuk</span><span class="ap-done-time">{{ todayAbsensi?.jam_masuk }} WIB</span></div>
        <div class="ap-form">
          <div class="ap-form-label">Catatan Kegiatan Hari Ini <span class="ap-required">*</span></div>
          <textarea v-model="kegiatanInput" class="ap-textarea" placeholder="Tuliskan kegiatan yang kamu lakukan hari ini..." rows="4"></textarea>
        </div>
        <div v-if="absensiError" class="ap-error">{{ absensiError }}</div>
        <button class="btn-absen btn-absen--pulang" @click="doCheckout" :disabled="checkingOut || !kegiatanInput.trim()">
          {{ checkingOut ? 'Memproses...' : 'Absen Pulang' }}
        </button>
      </div>

      <div v-else-if="absensiState === 'done'" class="absensi-panel absensi-panel--done">
        <div class="ap-done-rows">
          <div class="ap-done-row"><span class="ap-badge ap-badge--masuk">✓ Masuk</span><span class="ap-done-time">{{ todayAbsensi?.jam_masuk }} WIB</span></div>
          <div class="ap-done-row"><span class="ap-badge ap-badge--pulang">✓ Pulang</span><span class="ap-done-time">{{ todayAbsensi?.jam_keluar }} WIB</span></div>
        </div>
        <div class="ap-kegiatan">
          <div class="ap-kegiatan__label">Kegiatan</div>
          <div class="ap-kegiatan__text">{{ todayAbsensi?.kegiatan || '–' }}</div>
        </div>
      </div>

      <div v-else-if="absensiState === 'missed_checkin' || absensiState === 'missed_checkout'" class="absensi-panel">
        <div class="ap-icon ap-icon--miss"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div class="ap-title">{{ absensiState === 'missed_checkin' ? 'Sesi Absen Masuk Terlewat' : 'Sesi Absen Pulang Terlewat' }}</div>
        <div class="ap-desc">Jika ada keperluan, silakan ajukan izin di bawah.</div>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="absensiSuccess" class="ap-toast">{{ absensiSuccess }}</div>
    </Transition>

    <!-- ── PENGAJUAN IZIN / SAKIT ────────────────────────────── -->
    <div v-if="pelaksanaanSaya?.status === 'aktif'" class="card" style="margin-top:14px">
      <div class="card-header">
        <div>
          <h3 class="card-title">Izin &amp; Sakit</h3>
          <p class="card-sub">Ajukan ketidakhadiran untuk tanggal tertentu</p>
        </div>
        <button class="btn-green-sm" @click="openIzinModal">
          + Ajukan
        </button>
      </div>

      <div v-if="izinLoading" class="empty-state" style="padding:28px"><div class="spinner"></div></div>
      <div v-else-if="izinList.length === 0" class="empty-state" style="padding:28px">
        <p>Belum ada riwayat pengajuan izin/sakit.</p>
      </div>
      <div v-else class="izin-list">
        <div v-for="item in izinList" :key="item.id" class="izin-row">
          <div class="izin-row__left">
            <span :class="['izin-badge', `izin-badge--${item.jenis}`]">{{ item.jenis === 'izin' ? 'Izin' : 'Sakit' }}</span>
            <div>
              <div class="izin-tanggal">{{ formatTanggalShort(item.tanggal) }}</div>
              <div class="izin-alasan">{{ item.alasan }}</div>
            </div>
          </div>
          <div class="izin-row__right">
            <div class="izin-row__right-top">
              <span :class="['izin-status', `izin-status--${item.status}`]">
                {{ { pending: 'Menunggu', disetujui: 'Disetujui', ditolak: 'Ditolak' }[item.status] ?? item.status }}
              </span>
              <a v-if="item.bukti_path" :href="`/api/uploads/${item.bukti_path}`" target="_blank" class="bukti-link">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>
                Surat Sakit
              </a>
            </div>
            <div v-if="item.catatan_hrd" class="izin-catatan">{{ item.catatan_hrd }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── REKAP ABSENSI ─────────────────────────────────────── -->
    <div class="card" style="margin-top:14px">
      <div class="card-header">
        <h3 class="card-title">Rekap Absensi</h3>
        <a href="/api/absensi/saya/pdf" class="btn-green-sm" target="_blank">Unduh PDF</a>
      </div>
      <div class="rekap-row">
        <div class="rekap-item rekap-item--hadir"><div class="rekap-num">{{ rekap.hadir }}</div><div class="rekap-lbl">Hadir</div></div>
        <div class="rekap-item rekap-item--izin"><div class="rekap-num">{{ rekap.izin }}</div><div class="rekap-lbl">Izin</div></div>
        <div class="rekap-item rekap-item--sakit"><div class="rekap-num">{{ rekap.sakit }}</div><div class="rekap-lbl">Sakit</div></div>
        <div class="rekap-item rekap-item--alpha"><div class="rekap-num">{{ rekap.alpha }}</div><div class="rekap-lbl">Alpha</div></div>
      </div>
      <div v-if="absensiList.length > 0" class="abs-table-wrap">
        <table class="abs-table">
          <thead><tr><th>Tanggal</th><th>Masuk</th><th>Pulang</th><th>Ket.</th><th>Kegiatan</th></tr></thead>
          <tbody>
            <tr v-for="a in [...absensiList].reverse()" :key="a.id">
              <td>{{ formatTanggalShort(a.tanggal) }}</td>
              <td>{{ a.jam_masuk || '–' }}</td>
              <td>{{ a.jam_keluar || '–' }}</td>
              <td><span :class="['ket-badge', `ket-badge--${a.keterangan}`]">{{ a.keterangan }}</span></td>
              <td class="td-kegiatan">{{ a.kegiatan || '–' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state" style="padding:28px">
        <p>Belum ada riwayat absensi.</p>
      </div>
    </div>
  </div>

  <!-- ── MODAL CHECKIN ──────────────────────────────────────── -->
  <Teleport to="body">
    <div v-if="showCheckinModal" class="modal-backdrop" @click.self="showCheckinModal = false">
      <div class="modal-box">
        <div class="modal-box__title">Konfirmasi Absen Masuk</div>
        <div class="modal-box__desc">Kamu akan dicatat hadir pada pukul <strong>{{ currentTimeWIB }} WIB</strong>.</div>
        <div class="modal-box__geo">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#16a34a"/></svg>
          Dalam area kantor · jarak {{ userDistanceM.toLocaleString('id-ID') }} m dari kantor
        </div>
        <div class="modal-box__actions">
          <button class="btn-cancel" @click="showCheckinModal = false">Batal</button>
          <button class="btn-confirm" @click="doCheckin" :disabled="checkingIn">{{ checkingIn ? 'Memproses...' : 'Ya, Absen Sekarang' }}</button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ── MODAL IZIN / SAKIT ─────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="showIzinModal" class="modal-backdrop" @click.self="closeIzinModal">
        <div class="modal-box modal-box--izin">
          <div class="modal-box__header">
            <div class="modal-box__title">Ajukan Izin / Sakit</div>
            <button class="modal-close-btn" @click="closeIzinModal">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
          </div>

          <!-- Pilih Jenis -->
          <div class="modal-field">
            <label class="modal-label">Jenis Ketidakhadiran <span class="ap-required">*</span></label>
            <div class="jenis-tabs">
              <button
                :class="['jenis-tab', izinForm.jenis === 'izin' && 'jenis-tab--active']"
                @click="izinForm.jenis = 'izin'; izinForm.buktiFile = null; resetFileInput()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 2v4M16 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Izin
              </button>
              <button
                :class="['jenis-tab', izinForm.jenis === 'sakit' && 'jenis-tab--active jenis-tab--sakit']"
                @click="izinForm.jenis = 'sakit'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Sakit
              </button>
            </div>
          </div>

          <!-- Tanggal -->
          <div class="modal-field">
            <label class="modal-label">Tanggal <span class="ap-required">*</span></label>
            <input v-model="izinForm.tanggal" type="date" class="modal-input" :min="minTanggalIzin" />
            <div class="modal-hint">Boleh memilih tanggal hari ini atau ke depan</div>
          </div>

          <!-- Alasan -->
          <div class="modal-field">
            <label class="modal-label">Alasan <span class="ap-required">*</span></label>
            <textarea v-model="izinForm.alasan" class="modal-textarea" rows="3"
              :placeholder="izinForm.jenis === 'sakit' ? 'Contoh: Demam tinggi dan dianjurkan istirahat oleh dokter' : 'Contoh: Ada keperluan keluarga mendadak'">
            </textarea>
          </div>

          <!-- Upload Surat Sakit (hanya untuk jenis=sakit) -->
          <Transition name="slide-down">
            <div v-if="izinForm.jenis === 'sakit'" class="modal-field">
              <label class="modal-label">
                Surat Sakit
                <span class="modal-label--optional">(opsional)</span>
              </label>
              <div
                class="upload-zone"
                :class="{ 'upload-zone--has-file': izinForm.buktiFile }"
                @click="triggerFileInput"
                @dragover.prevent
                @drop.prevent="onFileDrop">
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  style="display:none"
                  @change="onFileChange" />

                <template v-if="!izinForm.buktiFile">
                  <div class="upload-zone__icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </div>
                  <div class="upload-zone__text">Klik atau seret file ke sini</div>
                  <div class="upload-zone__hint">JPG, PNG, atau PDF · Maks. 10MB</div>
                </template>
                <template v-else>
                  <div class="upload-zone__preview">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#16a34a" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="#16a34a" stroke-width="2"/></svg>
                    <span class="upload-zone__filename">{{ izinForm.buktiFile.name }}</span>
                    <button class="upload-zone__remove" @click.stop="removeFile">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </Transition>

          <div v-if="izinError" class="ap-error" style="margin-top:4px">{{ izinError }}</div>

          <div class="modal-box__actions" style="margin-top:18px">
            <button class="btn-cancel" @click="closeIzinModal">Batal</button>
            <button class="btn-confirm" @click="submitIzin"
              :disabled="submittingIzin || !izinForm.tanggal || !izinForm.jenis || izinForm.alasan.length < 5">
              <span v-if="submittingIzin" class="btn-spinner-sm"></span>
              {{ submittingIzin ? 'Mengirim...' : 'Kirim Pengajuan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import api from "@/lib/api";

type AbsensiCfg = {
  jam_masuk_buka: string; jam_masuk_tutup: string;
  jam_pulang_buka: string; jam_pulang_tutup: string;
  kantor_lat?: number; kantor_lng?: number; radius_meter?: number;
};

interface IzinSakitItem {
  id: string;
  tanggal: string;
  jenis: string;
  alasan: string;
  status: string;
  bukti_path?: string | null;
  catatan_hrd?: string | null;
}

const cfg            = ref<AbsensiCfg | null>(null);
const absensiList    = ref<any[]>([]);
const rekap          = ref({ hadir: 0, izin: 0, sakit: 0, alpha: 0 });
const absensiLoading = ref(false);
const showCheckinModal = ref(false);
const kegiatanInput  = ref('');
const checkingIn     = ref(false);
const checkingOut    = ref(false);
const absensiError   = ref('');
const absensiSuccess = ref('');

const gpsLoading    = ref(false);
const gpsError      = ref('');
const userLat       = ref(0);
const userLng       = ref(0);
const userDistanceM = ref(0);

const pelaksanaanSaya = ref<any>(null);

// Izin/Sakit state
const izinList       = ref<IzinSakitItem[]>([]);
const izinLoading    = ref(false);
const showIzinModal  = ref(false);
const submittingIzin = ref(false);
const izinError      = ref('');
const izinForm       = ref<{ tanggal: string; jenis: string; alasan: string; buktiFile: File | null }>({
  tanggal: '', jenis: 'izin', alasan: '', buktiFile: null
});
const fileInputRef   = ref<HTMLInputElement | null>(null);

const nowWIB = ref(getNowWIB());
let clockTimer: ReturnType<typeof setInterval> | null = null;

function getNowWIB(): Date {
  const utcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
  return new Date(utcMs + 7 * 3600000);
}

function parseWinTime(hhMM: string, base: Date): Date {
  if (!hhMM) return base;
  const [h, m] = hhMM.split(':').map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
}

const todayStr = computed(() => {
  const d = nowWIB.value;
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
});

const todayLabel = computed(() =>
  nowWIB.value.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
);

const currentTimeWIB = computed(() => {
  const d = nowWIB.value;
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
});

// Tanggal minimal = hari ini (boleh ke depan)
const minTanggalIzin = computed(() => todayStr.value);

const todayAbsensi = computed(() =>
  absensiList.value.find(a => a.tanggal?.startsWith(todayStr.value)) ?? null
);

const absensiState = computed(() => {
  if (absensiLoading.value) return 'loading';
  if (!pelaksanaanSaya.value || pelaksanaanSaya.value.status !== 'aktif') return 'no_magang';
  if (!cfg.value) return 'loading';
  const now = nowWIB.value;
  const masukBuka   = parseWinTime(cfg.value.jam_masuk_buka,   now);
  const masukTutup  = parseWinTime(cfg.value.jam_masuk_tutup,  now);
  const pulangBuka  = parseWinTime(cfg.value.jam_pulang_buka,  now);
  const pulangTutup = parseWinTime(cfg.value.jam_pulang_tutup, now);
  const ta = todayAbsensi.value;
  if (ta?.jam_keluar) return 'done';
  if (ta?.jam_masuk) {
    if (now >= pulangBuka && now <= pulangTutup) return 'checkout_open';
    if (now < pulangBuka) return 'waiting_pulang';
    return 'missed_checkout';
  }
  if (now >= masukBuka && now <= masukTutup) return 'checkin_open';
  if (now < masukBuka) return 'locked';
  return 'missed_checkin';
});

function formatCountdown(ms: number): string {
  if (ms <= 0) return '–';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h} jam ${m} menit lagi`;
  if (m > 0) return `${m} menit ${sec} detik lagi`;
  return `${sec} detik lagi`;
}

const countdownMasukText = computed(() => {
  if (!cfg.value) return '';
  return formatCountdown(parseWinTime(cfg.value.jam_masuk_buka, nowWIB.value).getTime() - nowWIB.value.getTime());
});

const countdownPulangText = computed(() => {
  if (!cfg.value) return '';
  return formatCountdown(parseWinTime(cfg.value.jam_pulang_buka, nowWIB.value).getTime() - nowWIB.value.getTime());
});

async function fetchAbsensi() {
  absensiLoading.value = true;
  absensiError.value = '';
  try {
    const [r0, r1, r2] = await Promise.allSettled([
      api.get('/api/pelaksanaan/saya'),
      api.get('/api/absensi/config'),
      api.get('/api/absensi/saya'),
    ]);
    if (r0.status === 'fulfilled') pelaksanaanSaya.value = r0.value.data?.data ?? null;
    if (r1.status === 'fulfilled') cfg.value = r1.value.data?.data;
    if (r2.status === 'fulfilled') {
      absensiList.value = r2.value.data?.data?.list ?? [];
      rekap.value = r2.value.data?.data?.rekap ?? { hadir:0, izin:0, sakit:0, alpha:0 };
    }
  } finally {
    absensiLoading.value = false;
  }
}

async function fetchIzin() {
  izinLoading.value = true;
  try {
    const r = await api.get('/api/izin-sakit/saya');
    izinList.value = Array.isArray(r.data?.data) ? r.data.data : [];
  } catch {
    izinList.value = [];
  } finally {
    izinLoading.value = false;
  }
}

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function openCheckinModal() {
  gpsError.value = '';
  absensiError.value = '';
  if (!navigator.geolocation) {
    gpsError.value = 'Browser tidak mendukung GPS. Gunakan Chrome/Firefox versi terbaru.';
    return;
  }
  gpsLoading.value = true;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value = pos.coords.latitude;
      userLng.value = pos.coords.longitude;
      gpsLoading.value = false;
      const kantorLat  = cfg.value?.kantor_lat  ?? -3.432194;
      const kantorLng  = cfg.value?.kantor_lng  ?? 104.035361;
      const radiusM    = cfg.value?.radius_meter ?? 1500;
      const jarakM     = haversineM(userLat.value, userLng.value, kantorLat, kantorLng);
      userDistanceM.value = Math.round(jarakM);
      if (jarakM > radiusM) {
        const lebih = Math.round(jarakM - radiusM);
        gpsError.value = `Lokasi kamu berada ${lebih.toLocaleString('id-ID')} meter di luar area kantor. Absen hanya bisa dilakukan di dalam radius ${radiusM} meter dari kantor.`;
        return;
      }
      showCheckinModal.value = true;
    },
    (err) => {
      gpsLoading.value = false;
      if (err.code === 1)
        gpsError.value = 'Izin lokasi ditolak. Aktifkan izin lokasi di pengaturan browser untuk absen.';
      else if (err.code === 2)
        gpsError.value = 'Lokasi tidak dapat dideteksi. Pastikan GPS aktif di perangkatmu.';
      else
        gpsError.value = 'Gagal mendapatkan lokasi. Coba lagi.';
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

async function doCheckin() {
  checkingIn.value = true;
  absensiError.value = '';
  try {
    await api.post('/api/absensi/checkin', { latitude: userLat.value, longitude: userLng.value });
    showCheckinModal.value = false;
    showToast('Absen masuk berhasil!');
    await fetchAbsensi();
  } catch (e: any) {
    absensiError.value = e.response?.data?.message ?? 'Gagal absen masuk';
    showCheckinModal.value = false;
  } finally {
    checkingIn.value = false;
  }
}

async function doCheckout() {
  if (!kegiatanInput.value.trim()) return;
  checkingOut.value = true;
  absensiError.value = '';
  try {
    await api.patch('/api/absensi/checkout', { kegiatan: kegiatanInput.value.trim() });
    kegiatanInput.value = '';
    showToast('Absen pulang berhasil!');
    await fetchAbsensi();
  } catch (e: any) {
    absensiError.value = e.response?.data?.message ?? 'Gagal absen pulang';
  } finally {
    checkingOut.value = false;
  }
}

function openIzinModal() {
  izinForm.value = { tanggal: todayStr.value, jenis: 'izin', alasan: '', buktiFile: null };
  izinError.value = '';
  showIzinModal.value = true;
}

function closeIzinModal() {
  showIzinModal.value = false;
  izinError.value = '';
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) {
    izinForm.value.buktiFile = input.files[0];
  }
}

function onFileDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0];
  if (file) izinForm.value.buktiFile = file;
}

function removeFile() {
  izinForm.value.buktiFile = null;
  resetFileInput();
}

function resetFileInput() {
  if (fileInputRef.value) fileInputRef.value.value = '';
}

async function submitIzin() {
  if (!izinForm.value.tanggal || !izinForm.value.jenis || izinForm.value.alasan.length < 5) return;
  submittingIzin.value = true;
  izinError.value = '';
  try {
    const fd = new FormData();
    fd.append('tanggal', izinForm.value.tanggal);
    fd.append('jenis', izinForm.value.jenis);
    fd.append('alasan', izinForm.value.alasan.trim());
    if (izinForm.value.jenis === 'sakit' && izinForm.value.buktiFile) {
      fd.append('bukti', izinForm.value.buktiFile);
    }
    await api.post('/api/izin-sakit', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    closeIzinModal();
    showToast(`Pengajuan ${izinForm.value.jenis} berhasil dikirim!`);
    await fetchIzin();
  } catch (e: any) {
    izinError.value = e.response?.data?.message ?? 'Gagal mengirim pengajuan';
  } finally {
    submittingIzin.value = false;
  }
}

function showToast(msg: string) {
  absensiSuccess.value = msg;
  setTimeout(() => { absensiSuccess.value = ''; }, 3000);
}

function formatTanggalShort(iso: string) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
}

onMounted(() => {
  fetchAbsensi();
  fetchIzin();
  clockTimer = setInterval(() => { nowWIB.value = getNowWIB(); }, 1000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
});
</script>

<style scoped>
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }
.card-sub    { font-size: 11.5px; color: #9ca3af; margin: 2px 0 0; }

.today-chip { font-size: 11px; font-weight: 600; color: #48AF4A; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 100px; padding: 4px 12px; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.absensi-panel { display: flex; flex-direction: column; align-items: center; padding: 32px 24px 28px; gap: 10px; text-align: center; }
.absensi-panel--done { padding: 24px; }

.ap-icon { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.ap-icon--locked { background: #f3f4f6; color: #9ca3af; }
.ap-icon--open   { background: #f0fdf4; color: #16a34a; }
.ap-icon--wait   { background: #fffbeb; color: #d97706; }
.ap-icon--miss   { background: #fff7ed; color: #ea580c; }

.ap-title { font-size: 15px; font-weight: 700; color: #111827; }
.ap-desc  { font-size: 12.5px; color: #6b7280; }
.ap-countdown { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 13px; font-weight: 600; padding: 6px 18px; border-radius: 100px; margin-top: 6px; }
.ap-error { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; font-size: 12.5px; padding: 8px 14px; border-radius: 8px; width: 100%; max-width: 420px; text-align: left; }

.ap-done-rows { display: flex; flex-direction: column; gap: 8px; align-self: stretch; }
.ap-done-row  { display: flex; align-items: center; gap: 10px; }
.ap-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }
.ap-badge--masuk  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.ap-badge--pulang { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
.ap-done-time { font-size: 13px; font-weight: 600; color: #374151; }

.ap-kegiatan { background: #f9fafb; border-radius: 10px; padding: 12px 14px; align-self: stretch; text-align: left; margin-top: 8px; }
.ap-kegiatan__label { font-size: 10.5px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 4px; }
.ap-kegiatan__text  { font-size: 13px; color: #374151; line-height: 1.6; }

.ap-form { align-self: stretch; text-align: left; }
.ap-form-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.ap-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 13px; font-size: 13px; font-family: inherit; resize: vertical; outline: none; color: #111827; box-sizing: border-box; }
.ap-textarea:focus { border-color: #48AF4A; }
.ap-required { color: #ef4444; }

.btn-absen { background: #48AF4A; color: #fff; border: none; border-radius: 10px; padding: 11px 28px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-top: 4px; font-family: inherit; }
.btn-absen:disabled { opacity: .6; cursor: not-allowed; }
.btn-absen--pulang { background: #2563eb; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.btn-green-sm { background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; }
.btn-green-sm:hover { background: #dcfce7; }

.ap-toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1a2e1a; color: #fff; font-size: 13px; font-weight: 600; padding: 10px 22px; border-radius: 100px; box-shadow: 0 4px 16px rgba(0,0,0,.18); z-index: 9999; white-space: nowrap; }
.toast-enter-active, .toast-leave-active { transition: all .3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }

/* ── Izin list ── */
.izin-list { padding: 4px 0; }
.izin-row  { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 13px 20px; border-bottom: 1px solid #f9fafb; }
.izin-row:last-child { border-bottom: none; }
.izin-row__left  { display: flex; align-items: flex-start; gap: 10px; }
.izin-row__right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.izin-row__right-top { display: flex; align-items: center; gap: 8px; }
.izin-badge { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 100px; white-space: nowrap; }
.izin-badge--izin  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.izin-badge--sakit { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.izin-tanggal { font-size: 12.5px; font-weight: 600; color: #111827; }
.izin-alasan  { font-size: 12px; color: #6b7280; margin-top: 2px; }
.izin-status  { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 100px; }
.izin-status--pending   { background: #fef9c3; color: #a16207; border: 1px solid #fde047; }
.izin-status--disetujui { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }
.izin-status--ditolak   { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.izin-catatan { font-size: 11px; color: #9ca3af; max-width: 180px; text-align: right; }
.bukti-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #2563eb; text-decoration: none; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 100px; padding: 2px 8px; }
.bukti-link:hover { background: #dbeafe; }

/* ── Rekap ── */
.rekap-row  { display: flex; gap: 0; border-bottom: 1px solid #f0faf0; }
.rekap-item { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 20px 8px; border-right: 1px solid #f0faf0; }
.rekap-item:last-child { border-right: none; }
.rekap-num  { font-size: 26px; font-weight: 800; }
.rekap-lbl  { font-size: 11px; color: #9ca3af; margin-top: 2px; font-weight: 500; }
.rekap-item--hadir .rekap-num { color: #16a34a; }
.rekap-item--izin  .rekap-num { color: #ca8a04; }
.rekap-item--sakit .rekap-num { color: #2563eb; }
.rekap-item--alpha .rekap-num { color: #dc2626; }

.abs-table-wrap { overflow-x: auto; }
.abs-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.abs-table th { padding: 10px 14px; font-size: 10.5px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: .04em; text-align: left; }
.abs-table td { padding: 11px 14px; border-bottom: 1px solid #f9fafb; color: #374151; }
.td-kegiatan { font-size: 12px; color: #6b7280; max-width: 200px; }
.ket-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 100px; }
.ket-badge--hadir { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.ket-badge--izin  { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
.ket-badge--sakit { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.ket-badge--alpha { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }

/* ── Modal ── */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; backdrop-filter: blur(2px); }
.modal-box { background: #fff; border-radius: 18px; width: 100%; max-width: 440px; padding: 24px; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.modal-box--izin { max-width: 460px; }
.modal-box__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-box__title { font-size: 16px; font-weight: 700; color: #111827; }
.modal-close-btn { background: #f3f4f6; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; }
.modal-close-btn:hover { background: #e5e7eb; }
.modal-box__desc { font-size: 13.5px; color: #374151; margin-bottom: 16px; line-height: 1.6; }
.modal-box__geo  { display: flex; align-items: center; gap: 6px; background: #f0fdf4; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #15803d; margin-bottom: 16px; }
.modal-box__actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 6px; }

.modal-field { margin-bottom: 16px; }
.modal-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.modal-label--optional { font-size: 11px; font-weight: 400; color: #9ca3af; margin-left: 4px; }
.modal-hint { font-size: 11px; color: #9ca3af; margin-top: 4px; }
.modal-input { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 9px 13px; font-size: 13px; font-family: inherit; outline: none; color: #111827; box-sizing: border-box; }
.modal-input:focus { border-color: #48AF4A; }
.modal-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 13px; font-size: 13px; font-family: inherit; resize: vertical; outline: none; color: #111827; box-sizing: border-box; }
.modal-textarea:focus { border-color: #48AF4A; }

/* ── Jenis tabs ── */
.jenis-tabs { display: flex; gap: 8px; }
.jenis-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; border: 1.5px solid #e5e7eb; background: #f9fafb; color: #6b7280; font-size: 13px; font-weight: 600; padding: 10px 16px; border-radius: 10px; cursor: pointer; font-family: inherit; transition: all .15s; }
.jenis-tab:hover { border-color: #d1d5db; background: #f3f4f6; }
.jenis-tab--active { border-color: #48AF4A; background: #f0fdf4; color: #16a34a; }
.jenis-tab--sakit.jenis-tab--active { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }

/* ── Upload zone ── */
.upload-zone { border: 2px dashed #e5e7eb; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all .2s; text-align: center; min-height: 90px; justify-content: center; }
.upload-zone:hover { border-color: #93c5fd; background: #f0f9ff; }
.upload-zone--has-file { border-color: #86efac; background: #f0fdf4; border-style: solid; }
.upload-zone__icon { color: #9ca3af; }
.upload-zone__text { font-size: 13px; font-weight: 600; color: #374151; }
.upload-zone__hint { font-size: 11px; color: #9ca3af; }
.upload-zone__preview { display: flex; align-items: center; gap: 8px; width: 100%; }
.upload-zone__filename { font-size: 12.5px; font-weight: 600; color: #15803d; flex: 1; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.upload-zone__remove { background: #fee2e2; border: none; border-radius: 6px; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #dc2626; flex-shrink: 0; }
.upload-zone__remove:hover { background: #fecaca; }

/* ── Buttons ── */
.btn-cancel  { background: #f3f4f6; color: #374151; border: none; border-radius: 10px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
.btn-cancel:hover { background: #e5e7eb; }
.btn-confirm { background: #48AF4A; color: #fff; border: none; border-radius: 10px; padding: 10px 22px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 7px; }
.btn-confirm:disabled { opacity: .55; cursor: not-allowed; }
.btn-confirm:not(:disabled):hover { background: #3d9e3f; }
.btn-spinner-sm { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }

/* ── Transitions ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all .25s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(.96) translateY(8px); }

.slide-down-enter-active, .slide-down-leave-active { transition: all .2s; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; margin-bottom: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 200px; }

.spinner { width: 26px; height: 26px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .7s linear infinite; }
</style>
