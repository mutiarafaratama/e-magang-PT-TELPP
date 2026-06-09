<template>
  <div class="auth-layout">
    <!-- LEFT PANEL — hero -->
    <div
      class="auth-hero"
      :style="heroBg"
    >
      <div class="auth-hero__overlay"></div>
      <div class="auth-hero__content">
        <a href="/" class="auth-hero__brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="#86efac"
            />
          </svg>
          <span>e-Magang <strong>PT TELPP</strong></span>
        </a>

        <div class="auth-hero__mid">
          <h2>Selamat Datang<br />Kembali!</h2>
          <p>
            Kelola perjalanan magangmu dengan mudah — dari pendaftaran,
            absensi, hingga sertifikasi dalam satu platform.
          </p>
          <div class="auth-hero__stats">
            <div class="stat">
              <div class="stat__num">500+</div>
              <div class="stat__label">Alumni Magang</div>
            </div>
            <div class="stat">
              <div class="stat__num">30+</div>
              <div class="stat__label">Divisi Terbuka</div>
            </div>
            <div class="stat">
              <div class="stat__num">95%</div>
              <div class="stat__label">Kepuasan Peserta</div>
            </div>
          </div>
        </div>

        <div class="auth-hero__footer">
          <div class="auth-hero__quote">
            "Pengalaman nyata di industri pulp dan kertas terkemuka Indonesia."
          </div>
          <div class="auth-hero__company">PT TanjungEnim Lestari Pulp and Paper</div>
        </div>
      </div>
    </div>

    <!-- RIGHT PANEL — form -->
    <div class="auth-form-panel">
      <div class="auth-form-wrap">
        <div class="auth-form-header">
          <h1>Masuk ke Akun</h1>
          <p>Gunakan email dan password yang sudah terdaftar.</p>
        </div>

        <div v-if="registered" class="alert alert--success">
          Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="contoh@email.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrap">
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                placeholder="Masukkan password"
                autocomplete="current-password"
                required
              />
              <button type="button" class="toggle-pass" @click="showPass = !showPass">
                <svg v-if="!showPass" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="#94a3b8" stroke-width="2"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="#94a3b8" stroke-width="2"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="alert alert--error">{{ error }}</div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? "Memproses..." : "Masuk" }}
          </button>
        </form>

        <div class="auth-divider">
          <span>Belum punya akun?</span>
        </div>

        <router-link to="/register" class="btn-secondary">
          Daftar Sekarang
        </router-link>

        <div class="auth-back">
          <router-link to="/">← Kembali ke Beranda</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const route = useRoute();
const { login, loading, error } = useAuth();

const form = ref({ email: "", password: "" });
const showPass = ref(false);
const registered = computed(() => route.query.registered === "1");
const heroImageUrl = ref<string | null>(null);

const heroBg = computed(() => {
  if (heroImageUrl.value) {
    return {
      background: `url('${heroImageUrl.value}') center/cover no-repeat`,
    };
  }
  return {
    background: "linear-gradient(135deg, #0b1c30 0%, #1a3a1f 55%, #0d2b10 100%)",
  };
});

async function fetchHeroImage() {
  try {
    const res = await api.get("/api/landing/content");
    const content = res.data.data as Record<string, string>;
    if (content.hero_image) {
      heroImageUrl.value = content.hero_image;
    }
  } catch {
    // fallback ke gradient
  }
}

async function handleLogin() {
  await login(form.value.email, form.value.password);
}

onMounted(() => {
  fetchHeroImage();
});
</script>

<style scoped>
* { box-sizing: border-box; }

.auth-layout {
  display: flex;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
}

/* ── LEFT HERO ── */
.auth-hero {
  flex: 0 0 44%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.auth-hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 0;
}

.auth-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 44px 48px;
}

.auth-hero__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.auth-hero__brand strong { color: #86efac; }

.auth-hero__mid {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}

.auth-hero__mid h2 {
  font-size: 40px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
}

.auth-hero__mid p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.7;
  max-width: 340px;
}

.auth-hero__stats {
  display: flex;
  gap: 28px;
  padding-top: 8px;
}

.stat__num {
  font-size: 22px;
  font-weight: 800;
  color: #86efac;
}

.stat__label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-top: 2px;
}

.auth-hero__footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 24px;
}

.auth-hero__quote {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 8px;
}

.auth-hero__company {
  font-size: 12px;
  color: #86efac;
  font-weight: 600;
}

/* ── RIGHT FORM ── */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 60px 48px;
}

.auth-form-wrap {
  width: 100%;
  max-width: 400px;
}

.auth-form-header {
  margin-bottom: 32px;
}

.auth-form-header h1 {
  font-size: 28px;
  font-weight: 800;
  color: #0b1c30;
  margin-bottom: 8px;
}

.auth-form-header p {
  font-size: 14px;
  color: #64748b;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-family: "Poppins", sans-serif;
  color: #0b1c30;
  outline: none;
  transition: border-color 0.15s;
  background: #fafafa;
}

.form-group input:focus {
  border-color: #48AF4A;
  background: #fff;
}

.input-wrap {
  position: relative;
}

.input-wrap input {
  padding-right: 42px;
}

.toggle-pass {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.alert {
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
}

.alert--success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

.alert--error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.btn-submit {
  width: 100%;
  padding: 13px;
  background: #48AF4A;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  transition: opacity 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-submit:hover:not(:disabled) { opacity: 0.9; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.auth-divider {
  text-align: center;
  margin: 20px 0 12px;
  font-size: 13px;
  color: #94a3b8;
}

.btn-secondary {
  display: block;
  width: 100%;
  padding: 12px;
  border: 2px solid #48AF4A;
  color: #48AF4A;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  text-decoration: none;
  text-align: center;
  transition: all 0.15s;
}

.btn-secondary:hover { background: #e8f5e9; }

.auth-back {
  text-align: center;
  margin-top: 24px;
}

.auth-back a {
  font-size: 13px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.15s;
}

.auth-back a:hover { color: #48AF4A; }

@media (max-width: 768px) {
  .auth-hero { display: none; }
  .auth-form-panel { padding: 40px 24px; }
}
</style>
