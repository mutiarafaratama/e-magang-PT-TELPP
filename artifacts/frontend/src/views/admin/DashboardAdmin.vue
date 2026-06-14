<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Super Admin" default-tab="beranda" ref="layout">
    <template #default>

      <!-- ── BERANDA ── -->
      <template v-if="activeTab === 'beranda'">
        <div class="welcome-banner">
          <div>
            <div class="welcome-banner__greeting">Selamat datang, {{ firstName }}! 🛡️</div>
            <div class="welcome-banner__sub">Kelola seluruh sistem e-Magang PT TELPP dari sini.</div>
          </div>
          <div class="welcome-banner__badge">ADMIN</div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#eff6ff;color:#3b82f6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Total User</div><div class="stat-card__value">2</div><div class="stat-card__sub">Admin & HRD</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Periode Aktif</div><div class="stat-card__value">0</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fefce8;color:#ca8a04">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Landing Content</div><div class="stat-card__value">6</div><div class="stat-card__sub">item tersimpan</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fff1f2;color:#e11d48">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div><div class="stat-card__label">FAQ Aktif</div><div class="stat-card__value">6</div></div>
          </div>
        </div>

        <div class="quick-grid">
          <button class="quick-card" @click="setTab('users')">
            <div class="quick-card__icon" style="background:#eff6ff;color:#3b82f6">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div class="quick-card__label">Manajemen User</div>
          </button>
          <button class="quick-card" @click="setTab('periode')">
            <div class="quick-card__icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div class="quick-card__label">Kelola Periode</div>
          </button>
          <button class="quick-card" @click="setTab('landing')">
            <div class="quick-card__icon" style="background:#fefce8;color:#ca8a04">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div class="quick-card__label">Landing Page</div>
          </button>
          <button class="quick-card" @click="setTab('statistik')">
            <div class="quick-card__icon" style="background:#fdf4ff;color:#9333ea">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </div>
            <div class="quick-card__label">Statistik</div>
          </button>
        </div>
      </template>

      <!-- ── MANAJEMEN USER ── -->
      <AdminUsers v-else-if="activeTab === 'users'" />

      <!-- ── PERIODE ── -->
      <template v-else-if="activeTab === 'periode'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Periode Magang</h3>
            <button class="btn-green-sm">+ Tambah Periode</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#d1d5db" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada periode magang.<br/>Tambahkan periode baru untuk membuka pendaftaran.</p>
            <button class="btn-green">+ Buat Periode Baru</button>
          </div>
        </div>
      </template>

      <!-- ── LANDING ── -->
      <template v-else-if="activeTab === 'landing'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Landing Page Settings</h3>
            <button class="btn-green-sm" @click="goToLandingSettings">Buka Editor →</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d1d5db" stroke-width="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Kelola konten hero, syarat, FAQ, dan kontak dari halaman editor.</p>
            <button class="btn-green" @click="goToLandingSettings">Buka Editor Landing Page</button>
          </div>
        </div>
      </template>

      <!-- ── FAQ ── -->
      <template v-else-if="activeTab === 'faq'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Kelola FAQ</h3>
            <button class="btn-green-sm">+ Tambah FAQ</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#d1d5db" stroke-width="1.5"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/></svg></div>
            <p>Kelola daftar pertanyaan yang sering diajukan.</p>
          </div>
        </div>
      </template>

      <!-- ── JAM ABSEN ── -->
      <template v-else-if="activeTab === 'jamabsen'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pengaturan Jam Absensi</h3>
            <span class="badge-info">Berlaku untuk semua peserta aktif</span>
          </div>
          <div v-if="cfgLoading" class="empty-state"><div class="spinner"></div></div>
          <div v-else class="jam-form">
            <div class="jam-section">
              <div class="jam-section__label">Sesi Absen Masuk</div>
              <div class="jam-row">
                <div class="jam-field">
                  <label>Buka</label>
                  <input type="text" v-model="jamForm.jam_masuk_buka" class="jam-input" placeholder="HH:MM" maxlength="5" @input="autoFormatTime('jam_masuk_buka', $event)" />
                </div>
                <span class="jam-sep">–</span>
                <div class="jam-field">
                  <label>Tutup</label>
                  <input type="text" v-model="jamForm.jam_masuk_tutup" class="jam-input" placeholder="HH:MM" maxlength="5" @input="autoFormatTime('jam_masuk_tutup', $event)" />
                </div>
              </div>
            </div>
            <div class="jam-section">
              <div class="jam-section__label">Sesi Absen Pulang</div>
              <div class="jam-row">
                <div class="jam-field">
                  <label>Buka</label>
                  <input type="text" v-model="jamForm.jam_pulang_buka" class="jam-input" placeholder="HH:MM" maxlength="5" @input="autoFormatTime('jam_pulang_buka', $event)" />
                </div>
                <span class="jam-sep">–</span>
                <div class="jam-field">
                  <label>Tutup</label>
                  <input type="text" v-model="jamForm.jam_pulang_tutup" class="jam-input" placeholder="HH:MM" maxlength="5" @input="autoFormatTime('jam_pulang_tutup', $event)" />
                </div>
              </div>
            </div>

            <div class="jam-divider"></div>

            <div class="jam-section">
              <div class="jam-section__label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="display:inline;margin-right:5px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#6b7280"/></svg>
                Geofencing — Area yang Diizinkan
              </div>
              <div class="geo-desc">Peserta hanya dapat absen jika berada dalam radius yang ditentukan dari koordinat kantor.</div>
              <div class="jam-row" style="flex-wrap:wrap;gap:16px">
                <div class="jam-field">
                  <label>Latitude Kantor</label>
                  <input type="text" v-model="jamForm.kantor_lat" class="jam-input jam-input--wide" placeholder="-3.432194" />
                </div>
                <div class="jam-field">
                  <label>Longitude Kantor</label>
                  <input type="text" v-model="jamForm.kantor_lng" class="jam-input jam-input--wide" placeholder="104.035361" />
                </div>
                <div class="jam-field">
                  <label>Radius (meter)</label>
                  <input type="number" v-model.number="jamForm.radius_meter" class="jam-input jam-input--sm" min="100" max="50000" step="100" />
                </div>
              </div>
              <div class="geo-hint">
                💡 Cara dapat koordinat: Google Maps → klik kanan di kantor → salin angka pertama (lat) dan kedua (lng)
              </div>
            </div>

            <div v-if="cfgError" class="cfg-error">{{ cfgError }}</div>
            <div v-if="cfgSuccess" class="cfg-success">{{ cfgSuccess }}</div>
            <div class="jam-actions">
              <button class="btn-green" @click="saveJam" :disabled="cfgSaving">
                {{ cfgSaving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ── KELOLA DIVISI ── -->
      <template v-else-if="activeTab === 'divisi'">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Kelola Divisi</h3>
              <p class="card-sub">Daftar divisi/unit kerja untuk penempatan peserta magang</p>
            </div>
            <button class="btn-green-sm" @click="openDivisiModal(null)">+ Tambah Divisi</button>
          </div>
          <div v-if="divisiLoading" class="empty-state"><div class="spinner"></div></div>
          <div v-else-if="divisiList.length === 0" class="empty-state">
            <div class="empty-state__icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#d1d5db" stroke-width="1.5"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#d1d5db" stroke-width="1.5"/></svg>
            </div>
            <p>Belum ada divisi. Tambahkan divisi pertama.</p>
          </div>
          <div v-else class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Nama Divisi</th><th>Urutan</th><th>Status</th><th>Dibuat</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                <tr v-for="d in divisiList" :key="d.id">
                  <td class="td-nama">{{ d.nama }}</td>
                  <td><span class="urutan-badge">{{ d.urutan }}</span></td>
                  <td>
                    <span :class="d.is_active ? 'status-pill status-pill--green' : 'status-pill status-pill--gray'">
                      {{ d.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                  <td>{{ formatDate(d.created_at) }}</td>
                  <td>
                    <div class="aksi-cell">
                      <button class="btn-aksi btn-aksi--ghost" @click="openDivisiModal(d)">Edit</button>
                      <button
                        :class="d.is_active ? 'btn-aksi btn-aksi--warn' : 'btn-aksi btn-aksi--green'"
                        @click="toggleDivisi(d)"
                      >{{ d.is_active ? 'Nonaktifkan' : 'Aktifkan' }}</button>
                      <button class="btn-aksi btn-aksi--red" @click="deleteDivisi(d)">Hapus</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- ── STATISTIK ── -->
      <AdminStatistik v-else-if="activeTab === 'statistik'" />

    </template>

  </DashboardLayout>

  <!-- ── MODAL TAMBAH/EDIT DIVISI (di luar DashboardLayout agar tidak bentrok slot) ── -->
  <Teleport to="body">
    <div v-if="showDivisiModal" class="modal-overlay" @click.self="showDivisiModal = false">
      <div class="divisi-modal">
        <div class="divisi-modal__header">
          <h3 class="divisi-modal__title">{{ divisiForm.id ? 'Edit Divisi' : 'Tambah Divisi' }}</h3>
          <button class="modal-close" @click="showDivisiModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="divisi-modal__body">
          <div class="dform-group">
            <label class="dform-label">Nama Divisi <span class="dform-req">*</span></label>
            <input v-model="divisiForm.nama" type="text" class="dform-input" placeholder="contoh: IT / Sistem Informasi" :disabled="divisiSaving"/>
          </div>
          <div class="dform-group">
            <label class="dform-label">Urutan Tampil <span class="dform-opt">(opsional)</span></label>
            <input v-model.number="divisiForm.urutan" type="number" class="dform-input" placeholder="0" min="0" :disabled="divisiSaving"/>
            <span class="dform-hint">Angka kecil tampil lebih atas di dropdown</span>
          </div>
          <div v-if="divisiFormError" class="dform-error">{{ divisiFormError }}</div>
        </div>
        <div class="divisi-modal__footer">
          <button class="btn-cancel" @click="showDivisiModal = false" :disabled="divisiSaving">Batal</button>
          <button class="btn-green" @click="saveDivisi" :disabled="divisiSaving || !divisiForm.nama.trim()">
            <div v-if="divisiSaving" class="spinner-sm"></div>
            {{ divisiSaving ? 'Menyimpan…' : (divisiForm.id ? 'Simpan Perubahan' : 'Tambah Divisi') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import AdminUsers      from "./AdminUsers.vue";
import AdminStatistik  from "./AdminStatistik.vue";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const { user } = useAuth();
const router   = useRouter();
const layout   = ref<InstanceType<typeof DashboardLayout> | null>(null);
const activeTab = computed(() => layout.value?.activeTab ?? "beranda");
const firstName = computed(() => user.value?.nama_lengkap?.split(" ")[0] ?? "");

function setTab(tab: string) {
  if (layout.value) layout.value.activeTab = tab;
}
function goToLandingSettings() {
  router.push("/admin/landing-settings");
}

const ICON = {
  home:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>`,
  users:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>`,
  period: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>`,
  globe:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/></svg>`,
  faq:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  stats:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  clock:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const ICON_DIVISI = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" stroke-width="2"/></svg>`;

const navGroups = [
  { items: [{ key: "beranda", label: "Beranda", icon: ICON.home }] },
  {
    label: "Manajemen",
    items: [
      { key: "users",    label: "Manajemen User", icon: ICON.users },
      { key: "divisi",   label: "Kelola Divisi",  icon: ICON_DIVISI },
      { key: "periode",  label: "Periode Magang",  icon: ICON.period },
      { key: "jamabsen", label: "Jam Absensi",     icon: ICON.clock },
    ],
  },
  {
    label: "Konten Web",
    items: [
      { key: "landing", label: "Landing Page", icon: ICON.globe },
      { key: "faq",     label: "Kelola FAQ",   icon: ICON.faq },
    ],
  },
  {
    label: "Laporan",
    items: [
      { key: "statistik", label: "Statistik", icon: ICON.stats },
    ],
  },
];

// ── Jam Absensi Config ────────────────────────────────────────
const jamForm  = ref({
  jam_masuk_buka: '07:30', jam_masuk_tutup: '08:00',
  jam_pulang_buka: '15:00', jam_pulang_tutup: '16:00',
  kantor_lat: -3.432194, kantor_lng: 104.035361, radius_meter: 1500,
});
const cfgLoading = ref(false);
const cfgSaving  = ref(false);
const cfgError   = ref('');
const cfgSuccess = ref('');

async function fetchJam() {
  cfgLoading.value = true;
  try {
    const r = await api.get('/api/absensi/config');
    const d = r.data?.data;
    if (d) jamForm.value = {
      jam_masuk_buka: d.jam_masuk_buka, jam_masuk_tutup: d.jam_masuk_tutup,
      jam_pulang_buka: d.jam_pulang_buka, jam_pulang_tutup: d.jam_pulang_tutup,
      kantor_lat: d.kantor_lat ?? -3.432194,
      kantor_lng: d.kantor_lng ?? 104.035361,
      radius_meter: d.radius_meter ?? 1500,
    };
  } catch { /* gunakan default */ } finally { cfgLoading.value = false; }
}

function autoFormatTime(field: keyof typeof jamForm.value, e: Event) {
  let v = (e.target as HTMLInputElement).value.replace(/[^0-9]/g, '');
  if (v.length > 4) v = v.slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + ':' + v.slice(2);
  jamForm.value[field] = v;
  (e.target as HTMLInputElement).value = v;
}

async function saveJam() {
  cfgSaving.value = true; cfgError.value = ''; cfgSuccess.value = '';
  const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;
  const timeFields = ['jam_masuk_buka', 'jam_masuk_tutup', 'jam_pulang_buka', 'jam_pulang_tutup'] as const;
  if (timeFields.some(f => !timeRe.test(jamForm.value[f]))) {
    cfgError.value = 'Format jam tidak valid. Gunakan HH:MM (contoh: 07:30, 16:00)';
    cfgSaving.value = false;
    return;
  }
  if (!jamForm.value.kantor_lat || !jamForm.value.kantor_lng) {
    cfgError.value = 'Koordinat kantor harus diisi untuk geofencing';
    cfgSaving.value = false;
    return;
  }
  if (jamForm.value.radius_meter < 100) {
    cfgError.value = 'Radius minimal 100 meter';
    cfgSaving.value = false;
    return;
  }
  try {
    await api.put('/api/admin/absensi/config', jamForm.value);
    cfgSuccess.value = 'Pengaturan berhasil disimpan.';
    setTimeout(() => { cfgSuccess.value = ''; }, 3000);
  } catch (e: any) {
    cfgError.value = e.response?.data?.message ?? 'Gagal menyimpan';
  } finally { cfgSaving.value = false; }
}

watch(activeTab, (tab) => {
  if (tab === 'jamabsen') fetchJam();
  if (tab === 'divisi') fetchDivisi();
});

// ── Kelola Divisi ─────────────────────────────────────────────
interface Divisi { id: string; nama: string; is_active: boolean; urutan: number; created_at: string; }

const divisiList    = ref<Divisi[]>([]);
const divisiLoading = ref(false);
const showDivisiModal = ref(false);
const divisiSaving  = ref(false);
const divisiFormError = ref('');
const divisiForm = ref<{ id: string | null; nama: string; urutan: number }>({ id: null, nama: '', urutan: 0 });

async function fetchDivisi() {
  divisiLoading.value = true;
  try {
    const r = await api.get('/api/admin/divisi');
    divisiList.value = Array.isArray(r.data?.data) ? r.data.data : [];
  } catch { divisiList.value = []; }
  finally { divisiLoading.value = false; }
}

function openDivisiModal(d: Divisi | null) {
  divisiFormError.value = '';
  if (d) {
    divisiForm.value = { id: d.id, nama: d.nama, urutan: d.urutan };
  } else {
    divisiForm.value = { id: null, nama: '', urutan: divisiList.value.length + 1 };
  }
  showDivisiModal.value = true;
}

async function saveDivisi() {
  if (!divisiForm.value.nama.trim()) return;
  divisiSaving.value = true; divisiFormError.value = '';
  try {
    if (divisiForm.value.id) {
      await api.patch(`/api/admin/divisi/${divisiForm.value.id}`, { nama: divisiForm.value.nama.trim(), urutan: divisiForm.value.urutan });
    } else {
      await api.post('/api/admin/divisi', { nama: divisiForm.value.nama.trim(), urutan: divisiForm.value.urutan });
    }
    showDivisiModal.value = false;
    await fetchDivisi();
  } catch (e: any) {
    divisiFormError.value = e.response?.data?.message ?? 'Gagal menyimpan divisi';
  } finally { divisiSaving.value = false; }
}

async function toggleDivisi(d: Divisi) {
  try {
    await api.patch(`/api/admin/divisi/${d.id}/toggle`, { is_active: !d.is_active });
    await fetchDivisi();
  } catch { /* ignore */ }
}

async function deleteDivisi(d: Divisi) {
  if (!confirm(`Hapus divisi "${d.nama}"? Peserta yang sudah ditempatkan tidak akan terpengaruh.`)) return;
  try {
    await api.delete(`/api/admin/divisi/${d.id}`);
    await fetchDivisi();
  } catch { /* ignore */ }
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}
</script>

<style scoped>
.welcome-banner { background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%); border-radius: 14px; padding: 24px 28px; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.welcome-banner__greeting { font-size: 17px; font-weight: 700; }
.welcome-banner__sub      { font-size: 12.5px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.welcome-banner__badge    { background: rgba(72,175,74,0.25); border: 1px solid rgba(134,239,172,0.4); color: #86efac; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; padding: 6px 14px; border-radius: 100px; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat-card { background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); }
.stat-card__icon  { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 20px; font-weight: 700; color: #111827; margin-top: 1px; }
.stat-card__sub   { font-size: 10.5px; color: #9ca3af; }

.quick-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.quick-card { background: #fff; border: 1.5px solid #e9f5e9; border-radius: 14px; padding: 20px 14px; display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; font-family: "Poppins",sans-serif; transition: border-color 0.15s, box-shadow 0.15s; }
.quick-card:hover { border-color: #48AF4A; box-shadow: 0 4px 14px rgba(72,175,74,0.12); }
.quick-card__icon  { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.quick-card__label { font-size: 12px; font-weight: 600; color: #374151; text-align: center; }

.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.btn-green    { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; white-space: nowrap; }

.jam-divider { height: 1px; background: #f0faf0; margin: 4px 0; }
.geo-desc { font-size: 12px; color: #6b7280; margin-bottom: 14px; line-height: 1.6; }
.geo-hint { font-size: 11.5px; color: #9ca3af; margin-top: 12px; line-height: 1.6; }
.jam-input--wide { width: 140px; }
.jam-input--sm   { width: 100px; }

@media (max-width: 700px) { .stats-row, .quick-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 420px) { .stats-row, .quick-grid { grid-template-columns: 1fr; } }

/* ── Jam Absen Form ───────────────────────── */
.badge-info { font-size: 11px; font-weight: 600; color: #1d4ed8; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 100px; padding: 4px 12px; }
.jam-form { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.jam-section__label { font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 12px; }
.jam-row { display: flex; align-items: flex-end; gap: 12px; }
.jam-field { display: flex; flex-direction: column; gap: 4px; }
.jam-field label { font-size: 11.5px; font-weight: 600; color: #6b7280; }
.jam-input { border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 14px; font-family: "Poppins",sans-serif; outline: none; transition: border-color .15s; color: #111827; background: #fff; }
.jam-input:focus { border-color: #48AF4A; }
.jam-sep { font-size: 16px; font-weight: 600; color: #9ca3af; padding-bottom: 8px; }
.jam-actions { display: flex; justify-content: flex-end; padding-top: 4px; }
.cfg-error   { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; font-size: 12.5px; padding: 8px 14px; border-radius: 8px; }
.cfg-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 12.5px; padding: 8px 14px; border-radius: 8px; }

/* Spinner (shared) */
.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; margin: 40px auto; }
.spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Divisi table ── */
.card-sub { font-size: 11.5px; color: #9ca3af; margin: 2px 0 0; }
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
.data-table td { padding: 13px 16px; border-bottom: 1px solid #f9fafb; color: #374151; vertical-align: middle; }
.td-nama { font-weight: 600; color: #111827; }
.urutan-badge { background: #f3f4f6; color: #374151; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
.status-pill { display: inline-flex; align-items: center; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
.status-pill--green { background: #dcfce7; color: #15803d; }
.status-pill--gray  { background: #f3f4f6; color: #6b7280; }
.aksi-cell { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.btn-aksi { border: none; border-radius: 7px; padding: 5px 11px; font-size: 11.5px; font-weight: 700; font-family: inherit; cursor: pointer; white-space: nowrap; transition: opacity .15s; }
.btn-aksi--ghost { background: #f3f4f6; color: #374151; }
.btn-aksi--ghost:hover { background: #e5e7eb; }
.btn-aksi--green { background: #dcfce7; color: #15803d; }
.btn-aksi--green:hover { background: #bbf7d0; }
.btn-aksi--warn  { background: #fef9c3; color: #92400e; }
.btn-aksi--warn:hover { background: #fde68a; }
.btn-aksi--red   { background: #fee2e2; color: #dc2626; }
.btn-aksi--red:hover { background: #fecaca; }

/* ── Divisi modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
.divisi-modal { background: #fff; border-radius: 18px; width: min(440px, 100%); box-shadow: 0 24px 80px rgba(0,0,0,0.22); display: flex; flex-direction: column; overflow: hidden; }
.divisi-modal__header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 14px; border-bottom: 1px solid #f0faf0; }
.divisi-modal__title  { font-size: 15px; font-weight: 700; color: #111827; margin: 0; }
.divisi-modal__body   { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.divisi-modal__footer { display: flex; gap: 10px; padding: 14px 24px; border-top: 1px solid #f0faf0; }
.modal-close { background: #f3f4f6; border: none; border-radius: 8px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; }
.modal-close:hover { background: #e5e7eb; }
.dform-group { display: flex; flex-direction: column; gap: 5px; }
.dform-label { font-size: 12px; font-weight: 600; color: #374151; }
.dform-req   { color: #dc2626; }
.dform-opt   { color: #9ca3af; font-weight: 400; }
.dform-input { border: 1px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: inherit; color: #111827; outline: none; transition: border-color .15s; }
.dform-input:focus { border-color: #48AF4A; box-shadow: 0 0 0 3px rgba(72,175,74,.12); }
.dform-input:disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }
.dform-hint  { font-size: 11px; color: #9ca3af; }
.dform-error { font-size: 12.5px; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 9px 13px; }
.btn-cancel { flex: 1; background: #f3f4f6; color: #374151; border: none; border-radius: 9px; padding: 10px 16px; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
.btn-cancel:hover:not(:disabled) { background: #e5e7eb; }
.btn-cancel:disabled { opacity: .5; cursor: default; }
.btn-green  { flex: 1; background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; }
.btn-green:hover:not(:disabled) { background: #3d9e3f; }
.btn-green:disabled { opacity: .5; cursor: not-allowed; }
</style>
