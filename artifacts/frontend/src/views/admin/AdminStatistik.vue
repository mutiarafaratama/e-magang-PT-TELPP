<template>
  <div>
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-card__icon" style="background:#eff6ff;color:#3b82f6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <div><div class="stat-card__label">Total Peserta</div><div class="stat-card__value">0</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon" style="background:#f0fdf4;color:#16a34a">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div><div class="stat-card__label">Selesai Magang</div><div class="stat-card__value">0</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon" style="background:#fefce8;color:#ca8a04">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <div><div class="stat-card__label">Rata-rata Nilai</div><div class="stat-card__value">—</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card__icon" style="background:#fff1f2;color:#e11d48">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <div><div class="stat-card__label">Sertifikat Diterbitkan</div><div class="stat-card__value">0</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h3 class="card-title">Grafik Pendaftar per Bulan</h3></div>
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="20" x2="18" y2="10" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="12" y1="20" x2="12" y2="4"  stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="6"  y1="20" x2="6"  y2="14" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <p>Belum ada data statistik.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.stat-card { background: #fff; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); }
.stat-card__icon  { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card__label { font-size: 11px; color: #6b7280; font-weight: 500; }
.stat-card__value { font-size: 20px; font-weight: 700; color: #111827; margin-top: 1px; }

.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

@media (max-width: 700px) { .stats-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 420px) { .stats-row { grid-template-columns: 1fr; } }
</style>
