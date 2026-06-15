package routes

import (
        "github.com/gin-gonic/gin"
        "github.com/telpp/emagang/internal/handler"
)

// RegisterLandingRoutes mendaftarkan route landing page CMS.
//
//      public : /api        (tanpa auth)
//      hrd    : /api        (role hrd/admin)
//      admin  : /api/admin  (role admin only)
func RegisterLandingRoutes(public, hrd, admin *gin.RouterGroup, h *handler.LandingHandler) {
        // Publik
        public.GET("/landing/content", h.GetContent)
        public.GET("/landing/faq", h.GetFAQ)
        public.GET("/landing/periode", h.GetPeriodeAktif)

        // HRD / Admin — kelola konten & FAQ
        hrd.PUT("/landing/content", h.UpdateContent)
        hrd.GET("/landing/faq/all", h.GetFAQAll)
        hrd.POST("/landing/faq", h.UpsertFAQ)
        hrd.DELETE("/landing/faq/:id", h.DeleteFAQ)

        // Admin only — kelola periode magang (prefix /admin sudah ada di group)
        admin.GET("/periode", h.GetAllPeriode)
        admin.POST("/periode", h.CreatePeriode)
        admin.PATCH("/periode/:id/aktif", h.SetPeriodeAktif)

        // Publik — alur pendaftaran
        public.GET("/landing/alur", h.GetAlur)

        // Admin only — kelola item alur
        admin.POST("/alur/upload", h.UploadGambarAlur)
        admin.POST("/alur", h.CreateAlur)
        admin.PUT("/alur/:id", h.UpdateAlur)
        admin.DELETE("/alur/:id", h.DeleteAlur)
}
