<template>
  <div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Chat Helpdesk</h3>
        <button class="btn-green-sm" @click="showBuatTiket = true">+ Buat Tiket</button>
      </div>

      <div v-if="loading" class="empty-state"><div class="spinner"></div></div>

      <div v-else-if="tiketList.length === 0" class="empty-state">
        <div class="empty-state__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#d1d5db" stroke-width="1.5"/>
          </svg>
        </div>
        <p>Belum ada tiket helpdesk.<br/>Klik <strong>+ Buat Tiket</strong> untuk menghubungi HRD.</p>
      </div>

      <div v-else class="tiket-list">
        <div
          v-for="t in tiketList" :key="t.id"
          class="tiket-item"
          @click="bukaChat(t)"
        >
          <div class="tiket-item__header">
            <span class="tiket-nomor">{{ t.nomor_tiket }}</span>
            <span :class="['tiket-status', `tiket-status--${t.status}`]">{{ labelStatus(t.status) }}</span>
          </div>
          <div class="tiket-subjek">{{ t.subjek || '(tanpa subjek)' }}</div>
          <div class="tiket-waktu">{{ formatWaktu(t.created_at) }}</div>
        </div>
      </div>
    </div>

    <!-- Panel chat aktif -->
    <div v-if="tiketAktif" class="card chat-panel" style="margin-top:14px">
      <div class="chat-panel__header">
        <div>
          <div class="chat-panel__nomor">{{ tiketAktif.nomor_tiket }}</div>
          <div class="chat-panel__subjek">{{ tiketAktif.subjek }}</div>
        </div>
        <button class="btn-close" @click="tiketAktif = null">✕</button>
      </div>

      <div class="chat-messages" ref="msgBox">
        <div v-if="pesanLoading" class="empty-state" style="padding:20px"><div class="spinner"></div></div>
        <div v-else-if="pesanList.length === 0" class="empty-state" style="padding:20px">
          <p>Belum ada pesan. Kirim pesan pertama di bawah.</p>
        </div>
        <div v-else>
          <div v-for="p in pesanList" :key="p.id" :class="['msg-row', p.sender_id === userId ? 'msg-row--me' : 'msg-row--them']">
            <div class="msg-bubble">{{ p.pesan }}</div>
            <div class="msg-time">{{ formatWaktu(p.created_at) }}</div>
          </div>
        </div>
      </div>

      <div class="chat-input-row">
        <input
          v-model="inputPesan"
          class="chat-input"
          placeholder="Tulis pesan..."
          @keyup.enter="kirimPesan"
          :disabled="tiketAktif.status === 'selesai'"
        />
        <button class="btn-kirim" @click="kirimPesan" :disabled="!inputPesan.trim() || kirimLoading || tiketAktif.status === 'selesai'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div v-if="tiketAktif.status === 'selesai'" class="chat-closed-note">Tiket ini sudah ditutup.</div>
    </div>
  </div>

  <!-- Modal buat tiket -->
  <Teleport to="body">
    <div v-if="showBuatTiket" class="modal-backdrop" @click.self="showBuatTiket = false">
      <div class="modal-box">
        <div class="modal-box__title">Buat Tiket Baru</div>
        <div class="pw-field">
          <label class="pw-label">Subjek <span class="ap-required">*</span></label>
          <input v-model="newSubjek" class="pw-input" placeholder="Topik pertanyaan Anda..." />
        </div>
        <div class="pw-field" style="margin-top:12px">
          <label class="pw-label">Pesan Awal <span class="ap-required">*</span></label>
          <textarea v-model="newPesan" class="ap-textarea" rows="4" placeholder="Tuliskan pertanyaan atau kendala Anda..."></textarea>
        </div>
        <div v-if="buatError" class="pw-alert pw-alert--err">{{ buatError }}</div>
        <div class="modal-box__actions" style="margin-top:16px">
          <button class="btn-cancel" @click="showBuatTiket = false">Batal</button>
          <button class="btn-confirm" @click="buatTiket" :disabled="buatLoading">{{ buatLoading ? 'Mengirim...' : 'Kirim Tiket' }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const { user } = useAuth();
const userId = ref(user.value?.id ?? "");

const loading    = ref(false);
const tiketList  = ref<any[]>([]);
const tiketAktif = ref<any>(null);
const pesanList  = ref<any[]>([]);
const pesanLoading = ref(false);
const inputPesan = ref("");
const kirimLoading = ref(false);
const msgBox     = ref<HTMLElement | null>(null);

const showBuatTiket = ref(false);
const newSubjek  = ref("");
const newPesan   = ref("");
const buatLoading = ref(false);
const buatError  = ref("");

function labelStatus(s: string) {
  return ({ menunggu: "Menunggu", diproses: "Diproses", selesai: "Selesai" } as Record<string,string>)[s] ?? s;
}

function formatWaktu(iso: string) {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("id-ID", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

async function fetchTiket() {
  loading.value = true;
  try {
    const res = await api.get("/api/chat/tiket/saya");
    tiketList.value = Array.isArray(res.data?.data) ? res.data.data : [];
  } catch {
    tiketList.value = [];
  } finally {
    loading.value = false;
  }
}

async function bukaChat(t: any) {
  tiketAktif.value = t;
  pesanLoading.value = true;
  pesanList.value = [];
  try {
    const res = await api.get(`/api/chat/tiket/${t.id}/pesan`);
    pesanList.value = Array.isArray(res.data?.data) ? res.data.data : [];
  } finally {
    pesanLoading.value = false;
    await nextTick();
    if (msgBox.value) msgBox.value.scrollTop = msgBox.value.scrollHeight;
  }
}

async function kirimPesan() {
  if (!inputPesan.value.trim() || !tiketAktif.value) return;
  kirimLoading.value = true;
  try {
    await api.post(`/api/chat/tiket/${tiketAktif.value.id}/pesan`, { pesan: inputPesan.value.trim() });
    inputPesan.value = "";
    await bukaChat(tiketAktif.value);
  } catch { /* silent */ } finally {
    kirimLoading.value = false;
  }
}

async function buatTiket() {
  buatError.value = "";
  if (!newSubjek.value.trim() || !newPesan.value.trim()) {
    buatError.value = "Subjek dan pesan wajib diisi"; return;
  }
  buatLoading.value = true;
  try {
    const res = await api.post("/api/chat/tiket", { subjek: newSubjek.value.trim(), pesan: newPesan.value.trim() });
    showBuatTiket.value = false;
    newSubjek.value = ""; newPesan.value = "";
    await fetchTiket();
    if (res.data?.data) bukaChat(res.data.data);
  } catch (e: any) {
    buatError.value = e.response?.data?.message ?? "Gagal membuat tiket";
  } finally {
    buatLoading.value = false;
  }
}

onMounted(fetchTiket);
</script>

<style scoped>
.card { background: #fff; border-radius: 14px; border: 1px solid #e9f5e9; box-shadow: 0 1px 3px rgba(13,40,24,0.05); overflow: hidden; }
.card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f0faf0; }
.card-title  { font-size: 13.5px; font-weight: 700; color: #111827; margin: 0; }

.btn-green-sm { background: #48AF4A; color: #fff; border: none; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; font-family: "Poppins", sans-serif; cursor: pointer; }
.btn-green-sm:hover { background: #3d9e3f; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 44px 24px; gap: 12px; text-align: center; }
.empty-state__icon { width: 72px; height: 72px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.empty-state p { font-size: 13px; color: #9ca3af; line-height: 1.7; margin: 0; }

.spinner { width: 36px; height: 36px; border: 3px solid #e5e7eb; border-top-color: #48AF4A; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.tiket-list { padding: 8px 0; }
.tiket-item { padding: 14px 20px; border-bottom: 1px solid #f9fafb; cursor: pointer; transition: background .1s; }
.tiket-item:hover { background: #f9fafb; }
.tiket-item:last-child { border-bottom: none; }
.tiket-item__header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
.tiket-nomor  { font-size: 11px; font-weight: 700; color: #48AF4A; font-family: monospace; }
.tiket-subjek { font-size: 13px; font-weight: 600; color: #111827; }
.tiket-waktu  { font-size: 11.5px; color: #9ca3af; margin-top: 4px; }
.tiket-status { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 100px; }
.tiket-status--menunggu { background: #fefce8; color: #ca8a04; }
.tiket-status--diproses  { background: #eff6ff; color: #2563eb; }
.tiket-status--selesai   { background: #f0fdf4; color: #16a34a; }

.chat-panel__header { display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #f0faf0; }
.chat-panel__nomor  { font-size: 11px; font-weight: 700; color: #48AF4A; font-family: monospace; }
.chat-panel__subjek { font-size: 13.5px; font-weight: 700; color: #111827; margin-top: 2px; }
.btn-close { background: #f3f4f6; border: none; border-radius: 7px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #6b7280; cursor: pointer; flex-shrink: 0; }
.btn-close:hover { background: #e5e7eb; }

.chat-messages { min-height: 200px; max-height: 360px; overflow-y: auto; padding: 16px 20px; display: flex; flex-direction: column; gap: 10px; }
.msg-row { display: flex; flex-direction: column; }
.msg-row--me    { align-items: flex-end; }
.msg-row--them  { align-items: flex-start; }
.msg-bubble { max-width: 70%; background: #f3f4f6; border-radius: 12px; padding: 9px 14px; font-size: 13px; color: #111827; line-height: 1.55; }
.msg-row--me .msg-bubble { background: #f0fdf4; color: #0d2818; }
.msg-time { font-size: 10.5px; color: #9ca3af; margin-top: 3px; }

.chat-input-row { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid #f0faf0; }
.chat-input { flex: 1; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 9px 14px; font-size: 13px; font-family: "Poppins", sans-serif; outline: none; transition: border-color .15s; }
.chat-input:focus { border-color: #48AF4A; }
.chat-input:disabled { background: #f9fafb; }
.btn-kirim { background: #48AF4A; color: #fff; border: none; border-radius: 10px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
.btn-kirim:disabled { background: #d1d5db; cursor: default; }
.chat-closed-note { text-align: center; font-size: 12px; color: #9ca3af; padding: 6px 16px 12px; }

/* modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: #fff; border-radius: 16px; padding: 28px 24px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.modal-box__title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 14px; }
.modal-box__actions { display: flex; gap: 10px; justify-content: flex-end; }
.pw-field { display: flex; flex-direction: column; gap: 6px; }
.pw-label { font-size: 12px; font-weight: 600; color: #374151; }
.pw-input { border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: "Poppins", sans-serif; outline: none; transition: border-color .15s; }
.pw-input:focus { border-color: #48AF4A; }
.ap-textarea { width: 100%; border: 1.5px solid #e5e7eb; border-radius: 9px; padding: 9px 12px; font-size: 13px; font-family: "Poppins", sans-serif; resize: vertical; outline: none; transition: border-color .15s; box-sizing: border-box; }
.ap-textarea:focus { border-color: #48AF4A; }
.ap-required { color: #ef4444; }
.pw-alert { padding: 8px 12px; border-radius: 8px; font-size: 12.5px; margin-top: 10px; }
.pw-alert--err { background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; }
.btn-cancel  { background: #f3f4f6; color: #374151; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-confirm { background: #48AF4A; color: #fff; border: none; border-radius: 9px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: "Poppins",sans-serif; cursor: pointer; }
.btn-confirm:disabled { background: #d1d5db; cursor: default; }
</style>
