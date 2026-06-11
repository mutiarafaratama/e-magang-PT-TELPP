package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/telpp/emagang/internal/handler"
)

// RegisterAbsensiRoutes mendaftarkan route absensi harian.
//
//	peserta : /api  (role peserta)
//	hrd     : /api  (role hrd/admin)
func RegisterAbsensiRoutes(peserta, hrd *gin.RouterGroup, h *handler.AbsensiHandler) {
	// Peserta — self-service absensi
	peserta.POST("/absensi/checkin", h.CheckIn)
	peserta.PATCH("/absensi/checkout", h.CheckOut)
	peserta.GET("/absensi/saya", h.GetMy)
	peserta.GET("/absensi/saya/pdf", h.DownloadPDF)

	// HRD / Admin — rekap & approve
	hrd.GET("/absensi/pelaksanaan/:id", h.GetByPelaksanaan)
	hrd.PATCH("/absensi/:id/approve", h.Approve)
}
