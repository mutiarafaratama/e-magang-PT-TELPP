package router

import (
        "context"
        "net/http"
        "time"

        "github.com/gin-gonic/gin"
        "github.com/telpp/emagang/internal/database"
        "github.com/telpp/emagang/internal/handler"
        "github.com/telpp/emagang/internal/middleware"
        "github.com/telpp/emagang/internal/models"
        "github.com/telpp/emagang/internal/repository"
        "github.com/telpp/emagang/internal/routes"
        "github.com/telpp/emagang/internal/service"
        ws "github.com/telpp/emagang/internal/websocket"
)

func Setup() *gin.Engine {
        r := gin.Default()

        // ============================================================
        // MIDDLEWARE GLOBAL
        // ============================================================
        r.Use(middleware.CORS())
        r.MaxMultipartMemory = 110 << 20 // 110MB

        // ============================================================
        // INISIALISASI SEMUA LAYER
        // ============================================================

        // Repositories
        userRepo            := repository.NewUserRepository(database.DB)
        pengajuanRepo       := repository.NewPengajuanRepository(database.DB)
        dokumenRepo         := repository.NewDokumenRepository(database.DB)
        pelaksanaanRepo     := repository.NewPelaksanaanRepository(database.DB)
        absensiRepo         := repository.NewAbsensiRepository(database.DB)
        absensiConfigRepo   := repository.NewAbsensiConfigRepository(database.DB)
        izinSakitRepo       := repository.NewIzinSakitRepository(database.DB)
        chatRepo            := repository.NewChatRepository(database.DB)
        notifRepo           := repository.NewNotifikasiRepository(database.DB)
        landingRepo         := repository.NewLandingRepository(database.DB)
        divisiRepo          := repository.NewDivisiRepository(database.DB)

        // Set global DB pointer (dibutuhkan oleh beberapa helper di repository)
        repository.SetDB(database.DB)

        // Services
        hub           := ws.GlobalHub
        notifSvc      := service.NewNotifikasiService(notifRepo, hub)
        authSvc       := service.NewAuthService(userRepo)
        emailSvc      := service.NewEmailService()
        pengajuanSvc  := service.NewPengajuanService(pengajuanRepo, notifSvc, userRepo, emailSvc, dokumenRepo)
        chatSvc       := service.NewChatService(chatRepo, notifSvc, userRepo, hub)
        sertifikatSvc := service.NewSertifikatService(pelaksanaanRepo, pengajuanRepo, notifSvc)

        // Handlers
        authH        := handler.NewAuthHandler(authSvc)
        pengajuanH   := handler.NewPengajuanHandler(pengajuanSvc)
        dokumenH     := handler.NewDokumenHandler(dokumenRepo, pengajuanRepo, notifSvc)
        pelaksanaanH := handler.NewPelaksanaanHandler(pelaksanaanRepo, pengajuanRepo, sertifikatSvc)
        absensiH       := handler.NewAbsensiHandler(absensiRepo, pelaksanaanRepo, pengajuanRepo, absensiConfigRepo)
        absensiConfigH := handler.NewAbsensiConfigHandler(absensiConfigRepo)
        izinSakitH     := handler.NewIzinSakitHandler(izinSakitRepo, pelaksanaanRepo)
        chatH        := handler.NewChatHandler(chatSvc)
        notifH       := handler.NewNotifikasiHandler(notifSvc, chatRepo)
        landingH     := handler.NewLandingHandler(landingRepo)
        adminH       := handler.NewAdminHandler(userRepo)
        divisiH      := handler.NewDivisiHandler(divisiRepo)

        // ============================================================
        // HEALTH CHECK
        // ============================================================
        r.GET("/api/health", func(c *gin.Context) {
                c.JSON(http.StatusOK, gin.H{"status": "ok", "app": "e-Magang TELPP"})
        })

        // ============================================================
        // ROUTE GROUPS
        // ============================================================

        // Tanpa autentikasi
        public := r.Group("/api")

        // WebSocket — token divalidasi via query param ?token= (browser tidak bisa set custom header saat WS upgrade)
        public.GET("/ws", ws.ServeWS(hub))

        // Semua user yang sudah login
        api := r.Group("/api")
        api.Use(middleware.AuthRequired())

        // Hanya role peserta
        peserta := api.Group("")
        peserta.Use(middleware.RoleRequired(models.RolePeserta))

        // Role HRD dan Admin
        hrd := api.Group("")
        hrd.Use(middleware.RoleRequired(models.RoleHRD, models.RoleAdmin))

        // Hanya role Admin (prefix /admin)
        admin := api.Group("/admin")
        admin.Use(middleware.RoleRequired(models.RoleAdmin))

        // ============================================================
        // REGISTER ROUTES PER DOMAIN
        // ============================================================
        routes.RegisterAuthRoutes(public, api, authH)
        routes.RegisterPengajuanRoutes(public, peserta, api, hrd, pengajuanH)
        routes.RegisterDokumenRoutes(public, peserta, api, hrd, dokumenH)
        routes.RegisterPelaksanaanRoutes(peserta, hrd, pelaksanaanH)
        routes.RegisterAbsensiRoutes(peserta, hrd, absensiH)
        routes.RegisterAbsensiConfigRoutes(api, admin, absensiConfigH)
        routes.RegisterIzinSakitRoutes(peserta, hrd, izinSakitH)
        routes.RegisterChatRoutes(peserta, api, hrd, chatH)
        routes.RegisterNotifikasiRoutes(api, notifH)
        routes.RegisterLandingRoutes(public, hrd, admin, landingH)
        routes.RegisterAdminRoutes(hrd, admin, adminH)
        routes.RegisterDivisiRoutes(api, admin, divisiH)

        // ============================================================
        // AUTO-UPDATE STATUS PELAKSANAAN BERDASARKAN TANGGAL
        // Berjalan sekali saat server start, lalu setiap jam.
        // ============================================================
        go func() {
                pelaksanaanRepo.AutoUpdateStatuses(context.Background())
                ticker := time.NewTicker(1 * time.Hour)
                defer ticker.Stop()
                for range ticker.C {
                        pelaksanaanRepo.AutoUpdateStatuses(context.Background())
                }
        }()

        return r
}
