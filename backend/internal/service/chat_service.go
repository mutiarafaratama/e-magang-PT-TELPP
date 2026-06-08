package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/telpp/emagang/internal/models"
	"github.com/telpp/emagang/internal/repository"
	ws "github.com/telpp/emagang/internal/websocket"
)

type ChatService struct {
	repo      *repository.ChatRepository
	notifSvc  *NotifikasiService
	userRepo  *repository.UserRepository
	hub       *ws.Hub
}

func NewChatService(repo *repository.ChatRepository, notifSvc *NotifikasiService, userRepo *repository.UserRepository, hub *ws.Hub) *ChatService {
	return &ChatService{repo: repo, notifSvc: notifSvc, userRepo: userRepo, hub: hub}
}

func (s *ChatService) BuatTiket(ctx context.Context, userID uuid.UUID, req models.ChatBuatTiketRequest) (*models.ChatTiketDetail, error) {
	tiket := &models.ChatTiket{
		UserID:     userID,
		NomorTiket: s.repo.GenerateNomorTiket(ctx),
		Subjek:     &req.Subjek,
	}

	if err := s.repo.CreateTiket(ctx, tiket); err != nil {
		return nil, err
	}

	// Kirim pesan pertama
	pesan := &models.ChatPesan{
		TiketID:  tiket.ID,
		SenderID: userID,
		Pesan:    req.Pesan,
	}
	s.repo.AddPesan(ctx, pesan)

	// Notif ke semua HRD
	hrdList, _ := s.userRepo.FindHRDList(ctx)
	hrdIDs := make([]uuid.UUID, len(hrdList))
	for i, h := range hrdList {
		hrdIDs[i] = h.ID
	}
	s.notifSvc.KirimKeRole(ctx, models.RoleHRD,
		"Tiket Chat Baru",
		"Tiket baru "+tiket.NomorTiket+": "+req.Subjek,
		"chat", &tiket.ID, hrdIDs)

	// Push badge update ke semua HRD
	s.hub.SendToRole(models.RoleHRD, "chat_badge", map[string]interface{}{
		"count": s.repo.CountMenunggu(ctx),
	})
	s.hub.SendToRole(models.RoleAdmin, "chat_badge", map[string]interface{}{
		"count": s.repo.CountMenunggu(ctx),
	})

	return s.repo.FindTiketByID(ctx, tiket.ID)
}

func (s *ChatService) KirimPesan(ctx context.Context, tiketID uuid.UUID, senderID uuid.UUID, senderRole models.UserRole, req models.ChatKirimPesanRequest) (*models.ChatPesanDetail, error) {
	tiket, err := s.repo.FindTiketByID(ctx, tiketID)
	if err != nil {
		return nil, errors.New("tiket tidak ditemukan")
	}

	if tiket.Status == models.TiketSelesai {
		return nil, errors.New("tiket sudah ditutup")
	}

	// Peserta hanya bisa kirim ke tiket miliknya
	if senderRole == models.RolePeserta && tiket.UserID != senderID {
		return nil, errors.New("akses ditolak")
	}

	pesan := &models.ChatPesan{
		TiketID:  tiketID,
		SenderID: senderID,
		Pesan:    req.Pesan,
	}
	if err := s.repo.AddPesan(ctx, pesan); err != nil {
		return nil, err
	}

	// Notif ke pihak lain
	if senderRole == models.RolePeserta {
		// Peserta kirim → notif ke HRD yg assigned
		if tiket.AssignedTo != nil {
			s.notifSvc.Kirim(ctx, *tiket.AssignedTo,
				"Pesan Baru dari Peserta",
				"Tiket "+tiket.NomorTiket+": ada pesan baru",
				"chat", &tiketID)
		} else {
			// Broadcast ke semua HRD
			hrdList, _ := s.userRepo.FindHRDList(ctx)
			for _, h := range hrdList {
				s.hub.SendToUser(h.ID, "chat_new_message", map[string]interface{}{
					"tiket_id": tiketID,
					"nomor":    tiket.NomorTiket,
				})
			}
		}
	} else {
		// HRD/Admin kirim → notif ke peserta
		s.notifSvc.Kirim(ctx, tiket.UserID,
			"Balasan Chat dari HRD",
			"Tiket "+tiket.NomorTiket+" telah dibalas",
			"chat", &tiketID)
		s.hub.SendToUser(tiket.UserID, "chat_new_message", map[string]interface{}{
			"tiket_id": tiketID,
			"nomor":    tiket.NomorTiket,
		})
	}

	// Ambil detail pesan dengan sender info
	pesanList, err := s.repo.FindPesanByTiketID(ctx, tiketID)
	if err != nil || len(pesanList) == 0 {
		return nil, err
	}
	last := pesanList[len(pesanList)-1]
	return &last, nil
}

func (s *ChatService) GetTiketSaya(ctx context.Context, userID uuid.UUID) ([]models.ChatTiketDetail, error) {
	return s.repo.FindTiketByUserID(ctx, userID)
}

func (s *ChatService) GetAllTiket(ctx context.Context, status string, page, limit int) ([]models.ChatTiketDetail, int, error) {
	return s.repo.FindAllTiket(ctx, status, page, limit)
}

func (s *ChatService) GetPesan(ctx context.Context, tiketID uuid.UUID, readerID uuid.UUID, readerRole models.UserRole) ([]models.ChatPesanDetail, error) {
	tiket, err := s.repo.FindTiketByID(ctx, tiketID)
	if err != nil {
		return nil, errors.New("tiket tidak ditemukan")
	}

	// Peserta hanya bisa akses tiket miliknya
	if readerRole == models.RolePeserta && tiket.UserID != readerID {
		return nil, errors.New("akses ditolak")
	}

	s.repo.MarkPesanRead(ctx, tiketID, readerID)
	return s.repo.FindPesanByTiketID(ctx, tiketID)
}

func (s *ChatService) UpdateStatusTiket(ctx context.Context, tiketID uuid.UUID, status models.StatusTiket, assignedTo *uuid.UUID) error {
	return s.repo.UpdateTiketStatus(ctx, tiketID, status, assignedTo)
}

func (s *ChatService) GetKnowledge(ctx context.Context) ([]models.ChatKnowledge, error) {
	return s.repo.GetAllKnowledge(ctx)
}

func (s *ChatService) UpsertKnowledge(ctx context.Context, k *models.ChatKnowledge) error {
	return s.repo.UpsertKnowledge(ctx, k)
}
