package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/telpp/emagang/internal/handler"
)

// RegisterAdminRoutes mendaftarkan route admin.
//
//	hrd   : /api        (role hrd/admin — untuk endpoint shared seperti hrd-list)
//	admin : /api/admin  (role admin only)
func RegisterAdminRoutes(hrd, admin *gin.RouterGroup, h *handler.AdminHandler) {
	// HRD / Admin — daftar HRD untuk keperluan assign pembimbing
	hrd.GET("/admin/hrd-list", h.GetHRDList)

	// Admin only (prefix /admin sudah ada di group)
	admin.GET("/stats", h.GetStats)
	admin.GET("/users", h.GetUsers)
	admin.POST("/users", h.CreateUser)
	admin.PATCH("/users/:id/toggle", h.ToggleUser)
}
