<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Manajemen User</h3>
      <button class="btn-green-sm">+ Tambah User</button>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Super Admin</td>
            <td>admin@telpp.co.id</td>
            <td><span class="role-chip role-chip--admin">Admin</span></td>
            <td><span class="status-chip status-chip--active">Aktif</span></td>
            <td><button class="action-btn">Edit</button></td>
          </tr>
          <tr>
            <td>Staff HRD</td>
            <td>hrd@telpp.co.id</td>
            <td><span class="role-chip role-chip--hrd">HRD</span></td>
            <td><span class="status-chip status-chip--active">Aktif</span></td>
            <td><button class="action-btn">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; white-space: nowrap; }

.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 11px 16px; text-align: left; font-size: 10.5px; font-weight: 600; color: #6b7280; background: #f9fafb; border-bottom: 1px solid #f1f5f9; text-transform: uppercase; letter-spacing: 0.04em; }
.data-table td { padding: 13px 16px; border-bottom: 1px solid #f9fafb; color: #374151; }

.role-chip         { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.role-chip--admin  { background: #f5f3ff; color: #7c3aed; }
.role-chip--hrd    { background: #eff6ff; color: #3b82f6; }

.status-chip         { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
.status-chip--active { background: #f0fdf4; color: #16a34a; }

.action-btn { background: none; border: 1px solid #e5e7eb; border-radius: 6px; padding: 4px 12px; font-size: 12px; font-family: "Poppins",sans-serif; cursor: pointer; color: #374151; transition: all 0.15s; }
.action-btn:hover { border-color: #48AF4A; color: #48AF4A; }
</style>
