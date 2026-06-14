<template>
  <DashboardLayout :nav-groups="navGroups" role-name="Peserta Magang" default-tab="beranda" ref="layout">
    <template #default>

      <!-- ── BERANDA ── -->
      <template v-if="activeTab === 'beranda'">
        <div class="welcome-banner">
          <div class="welcome-banner__left">
            <div class="welcome-banner__greeting">Selamat datang, {{ firstName }}!</div>
            <div class="welcome-banner__sub">Pantau perjalanan magang Anda dari sini.</div>
          </div>
          <div class="welcome-banner__date">
            <div class="welcome-date__day">{{ todayDay }}</div>
            <div class="welcome-date__info">{{ todayDate }}</div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#f0fdf4;color:#16a34a">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div>
              <div class="stat-card__label">Status Pengajuan</div>
              <div class="stat-card__value">{{ statusPengajuanLabel }}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#eff6ff;color:#3b82f6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Total Absensi</div><div class="stat-card__value">0 Hari</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fefce8;color:#ca8a04">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Nilai Akhir</div><div class="stat-card__value">—</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-card__icon" style="background:#fdf4ff;color:#9333ea">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/></svg>
            </div>
            <div><div class="stat-card__label">Tiket Helpdesk</div><div class="stat-card__value">0 Aktif</div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Panduan Langkah Magang</h3>
          </div>
          <div class="steps">
            <div :class="['step', pengajuanSaya ? 'step--done' : 'step--active']">
              <div class="step__num">
                <svg v-if="pengajuanSaya" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span v-else>1</span>
              </div>
              <div class="step__body">
                <div class="step__title">{{ pengajuanSaya ? 'Formulir Terkirim' : 'Isi Formulir Pengajuan' }}</div>
                <div class="step__desc">{{ pengajuanSaya ? formatTanggal(pengajuanSaya.created_at) : 'Formulir sudah diisi via portal publik' }}</div>
              </div>
            </div>
            <div :class="['step', pengajuanSaya && ['diterima'].includes(pengajuanSaya.status) ? 'step--done' : pengajuanSaya ? 'step--active' : '']">
              <div class="step__num">2</div>
              <div class="step__body">
                <div class="step__title">Verifikasi HRD</div>
                <div class="step__desc">Tim HRD mereview berkas dalam 3–5 hari kerja</div>
              </div>
            </div>
            <div :class="['step', pengajuanSaya?.akun_terkirim_at ? 'step--done' : '']">
              <div class="step__num">3</div>
              <div class="step__body">
                <div class="step__title">Terima Akun & Upload Berkas</div>
                <div class="step__desc">{{ pengajuanSaya?.akun_terkirim_at ? 'Akun sudah dikirim ke email' : 'HRD akan mengirim akun ke email untuk pantau status' }}</div>
              </div>
            </div>
            <div :class="['step', pelaksanaanSaya ? 'step--active' : '']">
              <div class="step__num">4</div>
              <div class="step__body">
                <div class="step__title">Mulai Magang & Absensi Harian</div>
                <div class="step__desc">Lakukan absensi setiap hari selama masa magang</div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ── DOKUMEN ── -->
      <template v-else-if="activeTab === 'dokumen'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Dokumen Saya</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="#d1d5db" stroke-width="1.5"/><polyline points="17 8 12 3 7 8" stroke="#d1d5db" stroke-width="1.5"/><line x1="12" y1="3" x2="12" y2="15" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada dokumen terupload.<br/>Upload dokumen setelah magang dikonfirmasi HRD.</p>
          </div>
        </div>
      </template>

      <!-- ── ABSENSI ── -->
      <template v-else-if="activeTab === 'absensi'">

        <!-- Kartu hari ini -->
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

          <!-- Terkunci -->
          <div v-else-if="absensiState === 'locked'" class="absensi-panel">
            <div class="ap-icon ap-icon--locked"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
            <div class="ap-title">Sesi Absen Masuk Belum Dibuka</div>
            <div class="ap-desc">Dibuka pukul <strong>{{ cfg?.jam_masuk_buka }}</strong> WIB</div>
            <div class="ap-countdown">{{ countdownMasukText }}</div>
          </div>

          <!-- Checkin open -->
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

          <!-- Menunggu jam pulang -->
          <div v-else-if="absensiState === 'waiting_pulang'" class="absensi-panel">
            <div class="ap-done-row"><span class="ap-badge ap-badge--masuk">✓ Masuk</span><span class="ap-done-time">{{ todayAbsensi?.jam_masuk }} WIB</span></div>
            <div class="ap-icon ap-icon--wait" style="margin-top:20px"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
            <div class="ap-title">Menunggu Sesi Absen Pulang</div>
            <div class="ap-desc">Dibuka pukul <strong>{{ cfg?.jam_pulang_buka }}</strong> WIB</div>
            <div class="ap-countdown">{{ countdownPulangText }}</div>
          </div>

          <!-- Checkout open -->
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

          <!-- Done -->
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

          <!-- Terlewat -->
          <div v-else-if="absensiState === 'missed_checkin' || absensiState === 'missed_checkout'" class="absensi-panel">
            <div class="ap-icon ap-icon--miss"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
            <div class="ap-title">{{ absensiState === 'missed_checkin' ? 'Sesi Absen Masuk Terlewat' : 'Sesi Absen Pulang Terlewat' }}</div>
            <div class="ap-desc">Jika ada keperluan, silakan hubungi HRD.</div>
          </div>
        </div>

        <!-- Success toast -->
        <Transition name="toast">
          <div v-if="absensiSuccess" class="ap-toast">{{ absensiSuccess }}</div>
        </Transition>

        <!-- Rekap + riwayat -->
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

      </template>

      <!-- ── NOTIFIKASI ── -->
      <template v-else-if="activeTab === 'notifikasi'">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Notifikasi</h3></div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#d1d5db" stroke-width="1.5"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada notifikasi.</p>
          </div>
        </div>
      </template>

      <!-- ── CHAT ── -->
      <template v-else-if="activeTab === 'chat'">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Chat Helpdesk</h3>
            <button class="btn-green-sm">+ Buat Tiket</button>
          </div>
          <div class="empty-state">
            <div class="empty-state__icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#d1d5db" stroke-width="1.5"/></svg></div>
            <p>Belum ada tiket helpdesk.</p>
          </div>
        </div>
      </template>

      <!-- ── PROFIL ── -->
      <template v-else-if="activeTab === 'profil'">

        <!-- Hero -->
        <div class="profil-hero">
          <div class="profil-hero__av">{{ profilInitials }}</div>
          <div class="profil-hero__info">
            <div class="profil-hero__name">{{ user?.nama_lengkap }}</div>
            <div class="profil-hero__chips">
              <span class="profil-chip profil-chip--role">Peserta Magang</span>
              <span :class="['profil-chip', profileData?.is_active !== false ? 'profil-chip--ok' : 'profil-chip--off']">
                {{ profileData?.is_active !== false ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>
          </div>
          <button class="btn-ubah-pw" @click="showPasswordModal = true">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Ubah Password
          </button>
        </div>

        <!-- Grid Info -->
        <div class="profil-cols">

          <!-- Informasi Akun -->
          <div class="profil-card">
            <div class="profil-card__head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#48AF4A" stroke-width="2"/><circle cx="12" cy="7" r="4" stroke="#48AF4A" stroke-width="2"/></svg>
              Informasi Akun
            </div>
            <div class="profil-field-list">
              <div class="profil-field">
                <span class="profil-field__label">Nama Lengkap</span>
                <span class="profil-field__value">{{ profileData?.nama_lengkap ?? user?.nama_lengkap ?? '—' }}</span>
              </div>
              <div class="profil-field">
                <span class="profil-field__label">Email</span>
                <span class="profil-field__value">{{ profileData?.email ?? user?.email ?? '—' }}</span>
              </div>
              <div class="profil-field">
                <span class="profil-field__label">Status Akun</span>
                <span :class="['profil-status-badge', profileData?.is_active !== false ? 'profil-status-badge--ok' : 'profil-status-badge--off']">
                  {{ profileData?.is_active !== false ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </div>
              <div class="profil-field">
                <span class="profil-field__label">Bergabung Sejak</span>
                <span class="profil-field__value">{{ profileData?.created_at ? formatTanggal(profileData.created_at) : '—' }}</span>
              </div>
            </div>
            <div v-if="profileLoading" class="profil-skeleton">
              <div class="profil-skeleton__bar"></div><div class="profil-skeleton__bar profil-skeleton__bar--short"></div>
            </div>
          </div>

          <!-- Informasi Magang -->
          <div class="profil-card">
            <div class="profil-card__head">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="#48AF4A" stroke-width="2"/><path d="M6 12v5c3.33 1.67 8.67 1.67 12 0v-5" stroke="#48AF4A" stroke-width="2"/></svg>
              Informasi Magang
            </div>
            <template v-if="pengajuanSaya">
              <div class="profil-field-list">
                <div class="profil-field">
                  <span class="profil-field__label">Asal Institusi</span>
                  <span class="profil-field__value">{{ pengajuanSaya.asal_institusi ?? '—' }}</span>
                </div>
                <div class="profil-field">
                  <span class="profil-field__label">Jurusan / Bidang</span>
                  <span class="profil-field__value">{{ pengajuanSaya.jurusan ?? '—' }}</span>
                </div>
                <div class="profil-field">
                  <span class="profil-field__label">Kategori Magang</span>
                  <span class="profil-field__value">{{ labelKategoriMagang(pengajuanSaya.kategori_magang) }}</span>
                </div>
                <div class="profil-field">
                  <span class="profil-field__label">Status Pengajuan</span>
                  <span :class="['profil-pj-badge', `profil-pj-badge--${pengajuanSaya.status}`]">
                    {{ statusPengajuanLabel }}
                  </span>
                </div>
                <div class="profil-field">
                  <span class="profil-field__label">Tanggal Pengajuan</span>
                  <span class="profil-field__value">{{ formatTanggal(pengajuanSaya.created_at) }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="profil-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#d1d5db" stroke-width="1.5"/><polyline points="14 2 14 8 20 8" stroke="#d1d5db" stroke-width="1.5"/></svg>
                <p>Belum ada pengajuan magang</p>
              </div>
            </template>
          </div>

        </div>
      </template>

    </template>
  </DashboardLayout>

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

    <!-- Modal Ubah Password -->
    <div v-if="showPasswordModal" class="modal-backdrop" @click.self="closePasswordModal">
      <div class="modal-box modal-pw">
        <div class="modal-pw__head">
          <div class="modal-pw__title">Ubah Password</div>
          <button class="modal-pw__close" @click="closePasswordModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="pw-form">
          <div class="pw-field">
            <label class="pw-label">Password Lama <span class="ap-required">*</span></label>
            <input v-model="pwLama" type="password" class="pw-input" placeholder="Masukkan password saat ini" autocomplete="current-password" />
          </div>
          <div class="pw-field">
            <label class="pw-label">Password Baru <span class="ap-required">*</span></label>
            <input v-model="pwBaru" type="password" class="pw-input" placeholder="Min 8 karakter" autocomplete="new-password" />
            <span class="pw-hint">Min 8 karakter · harus ada huruf, angka, dan karakter spesial (!@#$%^&*...)</span>
          </div>
          <div class="pw-field">
            <label class="pw-label">Konfirmasi Password Baru <span class="ap-required">*</span></label>
            <input v-model="pwKonfirmasi" type="password" class="pw-input" placeholder="Ulangi password baru" autocomplete="new-password" @keyup.enter="changePassword" />
          </div>
          <div v-if="pwError"   class="pw-alert pw-alert--err">{{ pwError }}</div>
          <div v-if="pwSuccess" class="pw-alert pw-alert--ok">{{ pwSuccess }}</div>
        </div>
        <div class="modal-box__actions" style="margin-top:0">
          <button class="btn-cancel" @click="closePasswordModal">Batal</button>
          <button class="btn-confirm" @click="changePassword" :disabled="pwLoading">
            {{ pwLoading ? 'Menyimpan...' : 'Simpan Password' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const { user } = useAuth();
const layout    = ref<InstanceType<typeof DashboardLayout> | null>(null);
const activeTab = computed(() => layout.value?.activeTab ?? "beranda");
const firstName = computed(() => user.value?.nama_lengkap?.split(" ")[0] ?? "");

const profilInitials = computed(() => {
  const name = user.value?.nama_lengkap ?? "";
  return name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() || "?";
});

// ── Profil & Ubah Password ──────────────────────────────────
const profileData      = ref<any>(null);
const profileLoading   = ref(false);
const showPasswordModal = ref(false);
const pwLama           = ref("");
const pwBaru           = ref("");
const pwKonfirmasi     = ref("");
const pwLoading        = ref(false);
const pwError          = ref("");
const pwSuccess        = ref("");

function labelKategoriMagang(k: string) {
  const m: Record<string, string> = { smk: "SMK", d3_s1_s2: "D3 / S1 / S2", penelitian: "Penelitian" };
  return m[k] ?? k;
}

async function fetchProfile() {
  if (profileData.value) return;
  profileLoading.value = true;
  try {
    const r = await api.get("/api/auth/me");
    profileData.value = r.data?.data;
  } catch { /* silent */ } finally {
    profileLoading.value = false;
  }
}

function validateNewPassword(s: string): boolean {
  if (s.length < 8) return false;
  const special = "!@#$%^&*()_+=.,><?/";
  let hasLetter = false, hasDigit = false, hasSpecial = false;
  for (const c of s) {
    if (/[a-zA-Z]/.test(c)) hasLetter = true;
    else if (/[0-9]/.test(c)) hasDigit = true;
    else if (special.includes(c)) hasSpecial = true;
  }
  return hasLetter && hasDigit && hasSpecial;
}

async function changePassword() {
  pwError.value   = "";
  pwSuccess.value = "";
  if (!pwLama.value || !pwBaru.value || !pwKonfirmasi.value) {
    pwError.value = "Semua field wajib diisi"; return;
  }
  if (pwBaru.value !== pwKonfirmasi.value) {
    pwError.value = "Konfirmasi password baru tidak cocok"; return;
  }
  if (!validateNewPassword(pwBaru.value)) {
    pwError.value = "Password baru harus min 8 karakter, mengandung huruf, angka, dan karakter spesial"; return;
  }
  pwLoading.value = true;
  try {
    await api.post("/api/auth/change-password", { old_password: pwLama.value, new_password: pwBaru.value });
    pwSuccess.value = "Password berhasil diubah!";
    pwLama.value = ""; pwBaru.value = ""; pwKonfirmasi.value = "";
    setTimeout(() => { showPasswordModal.value = false; pwSuccess.value = ""; }, 2000);
  } catch (e: any) {
    pwError.value = e.response?.data?.message ?? "Gagal mengubah password";
  } finally {
    pwLoading.value = false;
  }
}

function closePasswordModal() {
  showPasswordModal.value = false;
  pwLama.value = ""; pwBaru.value = ""; pwKonfirmasi.value = "";
  pwError.value = ""; pwSuccess.value = "";
}

const gpsLoading    = ref(false);
const gpsError      = ref('');
const userLat       = ref(0);
const userLng       = ref(0);
const userDistanceM = ref(0);

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const now       = new Date();
const todayDay  = now.toLocaleDateString("id-ID", { weekday: "long" });
const todayDate = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

// ── Data beranda ───────────────────────────────────────────────
const pengajuanSaya   = ref<any>(null);
const pelaksanaanSaya = ref<any>(null);

async function fetchBeranda() {
  try {
    const [r1, r2] = await Promise.allSettled([
      api.get("/api/pengajuan/saya"),
      api.get("/api/pelaksanaan/saya"),
    ]);
    pengajuanSaya.value   = r1.status === "fulfilled" ? (r1.value.data?.data ?? null) : null;
    pelaksanaanSaya.value = r2.status === "fulfilled" ? (r2.value.data?.data ?? null) : null;
  } catch { /* silent */ }
}

onMounted(fetchBeranda);

// ── Absensi ──────────────────────────────────────────────────
type AbsensiCfg = { jam_masuk_buka: string; jam_masuk_tutup: string; jam_pulang_buka: string; jam_pulang_tutup: string; kantor_lat?: number; kantor_lng?: number; radius_meter?: number }

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
    const [r1, r2] = await Promise.allSettled([
      api.get('/api/absensi/config'),
      api.get('/api/absensi/saya'),
    ]);
    if (r1.status === 'fulfilled') cfg.value = r1.value.data?.data;
    if (r2.status === 'fulfilled') {
      absensiList.value = r2.value.data?.data?.list ?? [];
      rekap.value = r2.value.data?.data?.rekap ?? { hadir:0, izin:0, sakit:0, alpha:0 };
    }
  } finally {
    absensiLoading.value = false;
  }
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

      // Cek geofence langsung di sini sebelum modal muncul
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

function showToast(msg: string) {
  absensiSuccess.value = msg;
  setTimeout(() => { absensiSuccess.value = ''; }, 3000);
}

function formatTanggalShort(iso: string) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
}

watch(activeTab, (tab) => {
  if (tab === 'absensi') fetchAbsensi();
  if (tab === 'profil')  fetchProfile();
});

onMounted(() => {
  clockTimer = setInterval(() => { nowWIB.value = getNowWIB(); }, 1000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
});

const statusPengajuanLabel = computed(() => {
  if (!pengajuanSaya.value) return "Belum Diajukan";
  const m: Record<string, string> = {
    diajukan: "Baru Diajukan", menunggu_verifikasi: "Menunggu Verifikasi",
    diproses: "Sedang Diproses", diterima: "Diterima", ditolak: "Ditolak",
  };
  return m[pengajuanSaya.value.status] ?? pengajuanSaya.value.status;
});

function formatTanggal(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

// ── Nav ────────────────────────────────────────────────────────
const ICON = {
  home:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2"/></svg>`,
  upload:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" stroke-width="2"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/></svg>`,
  bell:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2"/></svg>`,
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
    items: [
      { key: "notifikasi", label: "Notifikasi",    icon: ICON.bell },
      { key: "chat",       label: "Chat Helpdesk", icon: ICON.chat },
    ],
  },
  {
    label: "Akun",
    items: [
      { key: "profil", label: "Profil Saya", icon: ICON.profil },
    ],
  },
];
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%);
  border-radius: 14px; padding: 24px 28px; color: #fff;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.welcome-banner__greeting { font-size: 17px; font-weight: 700; }
.welcome-banner__sub { font-size: 12.5px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.welcome-date__day  { font-size: 22px; font-weight: 800; color: #86efac; text-align: right; }
.welcome-date__info { font-size: 11px; color: rgba(255,255,255,0.55); text-align: right; }

.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat-card {
  background: #fff; border-radius: 12px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
  border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05);
}
.stat-card__icon  { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 13.5px; font-weight: 700; color: #111827; margin-top: 2px; }

.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.steps { padding: 8px 20px 16px; display: flex; flex-direction: column; gap: 0; }
.step { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f8faf8; }
.step:last-child { border-bottom: none; }
.step__num { width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; color: #9ca3af; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step--active .step__num { background: #48AF4A; color: #fff; }
.step--done   .step__num { background: #0d2818; color: #86efac; }
.step__body  { flex: 1; }
.step__title { font-size: 13px; font-weight: 600; color: #111827; }
.step__desc  { font-size: 11.5px; color: #9ca3af; margin-top: 2px; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.btn-green    { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 10px 22px; font-size: 13px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }
.btn-green:hover { background: #3d9e3f; }
.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }

@media (max-width: 700px) {
  .stats-row { grid-template-columns: 1fr 1fr; }
  .welcome-date__day, .welcome-date__info { display: none; }
}
@media (max-width: 420px) { .stats-row { grid-template-columns: 1fr; } }

/* ── Absensi Panel ───────────────────────── */
.today-chip { font-size: 11px; font-weight: 600; color: #48AF4A; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 100px; padding: 4px 12px; }

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
.ap-done-row { display: flex; align-items: center; gap: 10px; }
.ap-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 100px; }
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

.ap-toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: #0d2818; color: #86efac; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 100px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 9999; white-space: nowrap; }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }

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
.modal-box__title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.modal-box__desc  { font-size: 13px; color: #6b7280; line-height: 1.6; margin-bottom: 10px; }
.modal-box__geo   { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #15803d; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 7px 12px; margin-bottom: 18px; }
.modal-box__actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-cancel  { background: #f3f4f6; color: #374151; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-confirm { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-confirm:disabled { background: #d1d5db; cursor: default; }

/* Spinner */
.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .rekap-row { grid-template-columns: 1fr 1fr; }
  .abs-table th:nth-child(5), .abs-table td:nth-child(5) { display: none; }
}

/* ── Profil ─────────────────────────────────── */
.profil-hero {
  background: linear-gradient(135deg, #0d2818 0%, #1a5c20 100%);
  border-radius: 14px; padding: 24px 28px; margin-bottom: 0;
  display: flex; align-items: center; gap: 18px;
}
.profil-hero__av {
  width: 62px; height: 62px; border-radius: 16px; flex-shrink: 0;
  background: rgba(134,239,172,0.2); border: 2px solid rgba(134,239,172,0.4);
  color: #86efac; font-size: 22px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.profil-hero__info { flex: 1; min-width: 0; }
.profil-hero__name { font-size: 17px; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.profil-hero__chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.profil-chip { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 100px; }
.profil-chip--role { background: rgba(255,255,255,0.12); color: #d1fae5; }
.profil-chip--ok   { background: rgba(134,239,172,0.2); color: #86efac; border: 1px solid rgba(134,239,172,0.4); }
.profil-chip--off  { background: rgba(239,68,68,0.2);   color: #fca5a5;  border: 1px solid rgba(239,68,68,0.4); }
.btn-ubah-pw {
  display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  background: rgba(255,255,255,0.1); color: #d1fae5; border: 1px solid rgba(255,255,255,0.2);
  border-radius: 9px; padding: 9px 16px; font-size: 12.5px; font-weight: 600;
  font-family: "Poppins", sans-serif; cursor: pointer; transition: background .15s;
}
.btn-ubah-pw:hover { background: rgba(255,255,255,0.18); }

.profil-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.profil-card {
  background: #fff; border-radius: 14px; border: 1px solid #e9f5e9;
  box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden;
}
.profil-card__head {
  display: flex; align-items: center; gap: 7px; padding: 14px 20px;
  font-size: 12.5px; font-weight: 700; color: #111827;
  border-bottom: 1px solid #f0faf0; background: #fafffe;
}
.profil-field-list { padding: 6px 20px 12px; }
.profil-field {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
  padding: 11px 0; border-bottom: 1px solid #f9fafb;
}
.profil-field:last-child { border-bottom: none; }
.profil-field__label { font-size: 12px; color: #9ca3af; font-weight: 500; flex-shrink: 0; padding-top: 2px; }
.profil-field__value { font-size: 13px; color: #111827; font-weight: 600; text-align: right; word-break: break-word; }
.profil-status-badge { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 100px; }
.profil-status-badge--ok  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.profil-status-badge--off { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.profil-pj-badge { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 100px; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.profil-pj-badge--diterima   { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.profil-pj-badge--ditolak    { background: #fff1f2; color: #be123c; border-color: #fecdd3; }
.profil-pj-badge--diproses   { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
.profil-pj-badge--diajukan   { background: #fefce8; color: #92400e; border-color: #fde68a; }
.profil-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 28px; text-align: center; }
.profil-empty p { font-size: 13px; color: #9ca3af; margin: 0; }
.profil-skeleton { padding: 12px 20px; display: flex; flex-direction: column; gap: 8px; }
.profil-skeleton__bar { height: 12px; background: #f0f0f0; border-radius: 6px; animation: shimmer 1.2s infinite; }
.profil-skeleton__bar--short { width: 60%; }
@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Password Modal ──────────────────────────── */
.modal-pw { max-width: 420px; padding: 0; overflow: hidden; }
.modal-pw__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px 14px; border-bottom: 1px solid #f0faf0;
}
.modal-pw__title { font-size: 15px; font-weight: 700; color: #111827; }
.modal-pw__close {
  background: none; border: none; cursor: pointer; color: #9ca3af;
  display: flex; align-items: center; padding: 2px;
}
.modal-pw__close:hover { color: #374151; }
.pw-form { padding: 18px 22px 14px; display: flex; flex-direction: column; gap: 14px; }
.pw-field { display: flex; flex-direction: column; gap: 5px; }
.pw-label { font-size: 12px; font-weight: 600; color: #374151; }
.pw-input {
  border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px;
  font-size: 13px; font-family: "Poppins", sans-serif; outline: none; transition: border-color .15s;
}
.pw-input:focus { border-color: #48AF4A; }
.pw-hint { font-size: 11px; color: #9ca3af; line-height: 1.5; }
.pw-alert { font-size: 12.5px; padding: 9px 12px; border-radius: 8px; font-weight: 500; }
.pw-alert--err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.pw-alert--ok  { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.modal-pw .modal-box__actions { padding: 14px 22px 20px; border-top: 1px solid #f0faf0; }

@media (max-width: 700px) {
  .profil-cols { grid-template-columns: 1fr; }
  .profil-hero { flex-wrap: wrap; }
  .btn-ubah-pw { width: 100%; justify-content: center; }
}
</style>
