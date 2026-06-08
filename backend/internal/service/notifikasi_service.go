package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/telpp/emagang/internal/models"
	"github.com/telpp/emagang/internal/repository"
	ws "github.com/telpp/emagang/internal/websocket"
)

type NotifikasiService struct {
	repo *repository.NotifikasiRepository
	hub  *ws.Hub
}

func NewNotifikasiService(repo *repository.NotifikasiRepository, hub *ws.Hub) *NotifikasiService {
	return &NotifikasiService{repo: repo, hub: hub}
}

// Kirim notifikasi ke user dan push via WebSocket
func (s *NotifikasiService) Kirim(ctx context.Context, userID uuid.UUID, judul, pesan, tipe string, refID *uuid.UUID) {
	n := &models.Notifikasi{
		UserID:      userID,
		Judul:       judul,
		Pesan:       pesan,
		ReferensiID: refID,
	}
	if tipe != "" {
		n.Tipe = &tipe
	}
	s.repo.Create(ctx, n)

	// Push ke client via WebSocket jika sedang online
	s.hub.SendToUser(userID, "notifikasi", map[string]interface{}{
		"id":    n.ID,
		"judul": judul,
		"pesan": pesan,
		"tipe":  tipe,
	})
}

// Kirim notif ke semua user dengan role tertentu
func (s *NotifikasiService) KirimKeRole(ctx context.Context, role models.UserRole, judul, pesan, tipe string, refID *uuid.UUID, userIDs []uuid.UUID) {
	for _, uid := range userIDs {
		s.Kirim(ctx, uid, judul, pesan, tipe, refID)
	}
	// Broadcast badge update ke semua HRD/Admin yang online
	s.hub.SendToRole(role, "badge_update", map[string]interface{}{
		"type": tipe,
	})
}

func (s *NotifikasiService) GetAll(ctx context.Context, userID uuid.UUID, page, limit int) ([]models.Notifikasi, int, error) {
	return s.repo.FindByUserID(ctx, userID, page, limit)
}

func (s *NotifikasiService) MarkRead(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return s.repo.MarkRead(ctx, id, userID)
}

func (s *NotifikasiService) MarkAllRead(ctx context.Context, userID uuid.UUID) error {
	return s.repo.MarkAllRead(ctx, userID)
}

func (s *NotifikasiService) GetBadgeCount(ctx context.Context, userID uuid.UUID, chatRepo *repository.ChatRepository) models.NotifBadgeCount {
	return models.NotifBadgeCount{
		TotalUnread:  s.repo.CountUnread(ctx, userID),
		ChatMenunggu: chatRepo.CountMenunggu(ctx),
	}
}
