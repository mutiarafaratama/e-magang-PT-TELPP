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
            <span :class="['izin-status', `izin-status--${item.status}`]">
              {{ { pending: 'Menunggu', disetujui: 'Disetujui', ditolak: 'Ditolak' }[item.status] ?? item.status }}
            </span>
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
    <div v-if="showIzinModal" class="modal-backdrop" @click.self="closeIzinModal">
      <div class="modal-box modal-box--izin">
        <div class="modal-box__title">Ajukan Izin / Sakit</div>

        <div class="modal-field">
          <label class="modal-label">Tanggal <span class="ap-required">*</span></label>
          <input v-model="izinForm.tanggal" type="date" class="modal-input" :max="maxTanggalIzin" />
        </div>

        <div class="modal-field">
          <label class="modal-label">Jenis <span class="ap-required">*</span></label>
          <div class="radio-group">
            <label class="radio-opt" :class="{ 'radio-opt--active': izinForm.jenis === 'izin' }">
              <input type="radio" v-model="izinForm.jenis" value="izin" style="display:none" />
              Izin
            </label>
            <label class="radio-opt" :class="{ 'radio-opt--active': izinForm.jenis === 'sakit' }">
              <input type="radio" v-model="izinForm.jenis" value="sakit" style="display:none" />
              Sakit
            </label>
          </div>
        </div>

        <div class="modal-field">
          <label class="modal-label">Alasan <span class="ap-required">*</span></label>
          <textarea v-model="izinForm.alasan" class="modal-textarea" rows="3"
            :placeholder="izinForm.jenis === 'sakit' ? 'Contoh: Demam tinggi dan dianjurkan istirahat oleh dokter' : 'Contoh: Ada keperluan keluarga mendadak'">
          </textarea>
        </div>

        <div v-if="izinError" class="ap-error" style="margin-top:4px">{{ izinError }}</div>

        <div class="modal-box__actions" style="margin-top:18px">
          <button class="btn-cancel" @click="closeIzinModal">Batal</button>
          <button class="btn-confirm" @click="submitIzin" :disabled="submittingIzin || !izinForm.tanggal || !izinForm.jenis || izinForm.alasan.length < 5">
            {{ submittingIzin ? 'Mengirim...' : 'Kirim Pengajuan' }}
          </button>
        </div>
      </div>
    </div>
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
const izinForm       = ref({ tanggal: '', jenis: 'izin', alasan: '' });

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

const maxTanggalIzin = computed(() => todayStr.value);

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
  izinForm.value = { tanggal: todayStr.value, jenis: 'izin', alasan: '' };
  izinError.value = '';
  showIzinModal.value = true;
}

function closeIzinModal() {
  showIzinModal.value = false;
  izinError.value = '';
}

async function submitIzin() {
  if (!izinForm.value.tanggal || !izinForm.value.jenis || izinForm.value.alasan.length < 5) return;
  submittingIzin.value = true;
  izinError.value = '';
  try {
    await api.post('/api/izin-sakit', {
      tanggal: izinForm.value.tanggal,
      jenis: izinForm.value.jenis,
      alasan: izinForm.value.alasan.trim(),
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

.ap-done-rows { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; margin: 0 auto; }
.ap-done-row  { display: flex; align-items: center; gap: 10px; }
.ap-badge     { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }
.ap-badge--masuk  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.ap-badge--pulang { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.ap-done-time { font-size: 13px; color: #374151; font-weight: 600; }

.ap-form { width: 100%; max-width: 480px; text-align: left; margin-top: 12px; }
.ap-form-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.ap-required { color: #ef4444; }
.ap-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-family: "Poppins", sans-serif; resize: vertical; outline: none; transition: border-color .15s; box-sizing: border-box; }
.ap-textarea:focus { border-color: #48AF4A; }

.ap-kegiatan { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; width: 100%; max-width: 480px; text-align: left; margin-top: 16px; }
.ap-kegiatan__label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
.ap-kegiatan__text  { font-size: 13px; color: #374151; line-height: 1.6; white-space: pre-line; }

.btn-absen { background: #48AF4A; color: #fff; border: none; border-radius: 10px; padding: 12px 32px; font-size: 14px; font-weight: 700; font-family: "Poppins", sans-serif; cursor: pointer; margin-top: 10px; transition: background .15s; }
.btn-absen:hover { background: #3d9e3f; }
.btn-absen:disabled { background: #d1d5db; cursor: default; }
.btn-absen--pulang { background: #1d4ed8; }
.btn-absen--pulang:hover:not(:disabled) { background: #1e40af; }

.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; text-decoration: none; display: inline-block; }
.btn-green-sm:hover { background: #3d9e3f; }

.ap-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #0d2818; color: #86efac; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 100px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999; white-space: nowrap; }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }

/* Izin/Sakit list */
.izin-list { padding: 4px 0 8px; }
.izin-row { display: flex; align-items: flex-start; justify-content: space-between; padding: 11px 20px; border-bottom: 1px solid #f9fafb; gap: 12px; }
.izin-row:last-child { border-bottom: none; }
.izin-row__left { display: flex; align-items: flex-start; gap: 10px; }
.izin-row__right { text-align: right; flex-shrink: 0; }
.izin-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; white-space: nowrap; flex-shrink: 0; margin-top: 2px; }
.izin-badge--izin  { background: #eff6ff; color: #1d4ed8; }
.izin-badge--sakit { background: #fffbeb; color: #b45309; }
.izin-tanggal { font-size: 12.5px; font-weight: 600; color: #111827; }
.izin-alasan  { font-size: 12px; color: #6b7280; margin-top: 2px; max-width: 220px; }
.izin-status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; white-space: nowrap; }
.izin-status--pending   { background: #fef3c7; color: #92400e; }
.izin-status--disetujui { background: #dcfce7; color: #15803d; }
.izin-status--ditolak   { background: #fee2e2; color: #dc2626; }
.izin-catatan { font-size: 11px; color: #9ca3af; margin-top: 4px; max-width: 160px; }

/* Rekap */
.rekap-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; padding: 16px 20px; }
.rekap-item { border-radius: 12px; padding: 14px; text-align: center; border: 1.5px solid; }
.rekap-item--hadir { background: #f0fdf4; border-color: #bbf7d0; }
.rekap-item--izin  { background: #eff6ff; border-color: #bfdbfe; }
.rekap-item--sakit { background: #fffbeb; border-color: #fde68a; }
.rekap-item--alpha { background: #fff1f2; border-color: #fecdd3; }
.rekap-num { font-size: 24px; font-weight: 800; color: #111827; }
.rekap-lbl { font-size: 11px; font-weight: 600; color: #6b7280; margin-top: 2px; }

.abs-table-wrap { overflow-x: auto; padding: 0 20px 16px; }
.abs-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.abs-table th { text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .04em; border-bottom: 2px solid #f0faf0; }
.abs-table td { padding: 9px 10px; border-bottom: 1px solid #f9fafb; color: #374151; }
.td-kegiatan { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ket-badge { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 100px; }
.ket-badge--hadir { background: #f0fdf4; color: #15803d; }
.ket-badge--izin  { background: #eff6ff; color: #1d4ed8; }
.ket-badge--sakit { background: #fffbeb; color: #92400e; }
.ket-badge--alpha { background: #fff1f2; color: #be123c; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: #fff; border-radius: 16px; padding: 28px 24px; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-box--izin { max-width: 420px; }
.modal-box__title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.modal-box__desc  { font-size: 13px; color: #6b7280; line-height: 1.6; margin-bottom: 10px; }
.modal-box__geo   { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #15803d; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 7px 12px; margin-bottom: 18px; }
.modal-box__actions { display: flex; gap: 10px; justify-content: flex-end; }
.modal-field { margin-bottom: 14px; }
.modal-label { display: block; font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.modal-input { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: inherit; outline: none; box-sizing: border-box; }
.modal-input:focus { border-color: #48AF4A; }
.modal-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: inherit; outline: none; resize: vertical; box-sizing: border-box; }
.modal-textarea:focus { border-color: #48AF4A; }
.radio-group { display: flex; gap: 10px; }
.radio-opt { display: flex; align-items: center; justify-content: center; border: 1.5px solid #e5e7eb; border-radius: 8px; padding: 8px 20px; font-size: 13px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .15s; user-select: none; }
.radio-opt--active { border-color: #48AF4A; background: #f0fdf4; color: #15803d; }
.btn-cancel  { background: #f3f4f6; color: #374151; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-confirm { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-confirm:disabled { background: #d1d5db; cursor: default; }

.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .rekap-row { grid-template-columns: 1fr 1fr; }
  .abs-table th:nth-child(5), .abs-table td:nth-child(5) { display: none; }
  .izin-alasan { max-width: 140px; }
}
</style>
