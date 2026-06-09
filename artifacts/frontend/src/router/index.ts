import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/views/LandingPage.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingPage,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginPage.vue"),
    meta: { guest: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterPage.vue"),
    meta: { guest: true },
  },
  {
    path: "/admin/landing-settings",
    name: "admin-landing-settings",
    component: () => import("@/views/admin/LandingSettings.vue"),
    meta: { requiresAuth: true, role: "admin" },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/LandingPage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  if (to.meta.requiresAuth && !token) {
    return { name: "login" };
  }

  if (to.meta.guest && token) {
    if (user?.role === "admin") return { name: "admin-landing-settings" };
    return { name: "dashboard" };
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return { name: "dashboard" };
  }
});

export default router;
