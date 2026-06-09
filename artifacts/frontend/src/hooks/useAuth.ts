import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/lib/api";

interface User {
  id: string;
  nama_lengkap: string;
  email: string;
  role: "peserta" | "hrd" | "admin";
}

const user = ref<User | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const storedUser = localStorage.getItem("user");
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
  }
}

export function useAuth() {
  const router = useRouter();

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");
  const isHRD = computed(() => user.value?.role === "hrd");
  const isPeserta = computed(() => user.value?.role === "peserta");

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const data = res.data.data;
      localStorage.setItem("access_token", data.access_token);
      user.value = data.user;
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        router.push("/admin/landing-settings");
      } else if (data.user.role === "hrd") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Login gagal. Periksa email dan password.";
    } finally {
      loading.value = false;
    }
  }

  async function register(payload: {
    nama_lengkap: string;
    email: string;
    password: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      await api.post("/api/auth/register", payload);
      router.push("/login?registered=1");
    } catch (err: any) {
      error.value =
        err.response?.data?.message || "Pendaftaran gagal. Coba lagi.";
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  return {
    user,
    loading,
    error,
    isLoggedIn,
    isAdmin,
    isHRD,
    isPeserta,
    login,
    register,
    logout,
  };
}
