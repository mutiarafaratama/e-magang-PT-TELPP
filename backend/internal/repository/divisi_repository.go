package repository

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/telpp/emagang/internal/models"
)

type DivisiRepository struct {
	db *pgxpool.Pool
}

func NewDivisiRepository(db *pgxpool.Pool) *DivisiRepository {
	return &DivisiRepository{db: db}
}

// FindAll — semua divisi, aktif saja jika onlyActive=true
func (r *DivisiRepository) FindAll(ctx context.Context, onlyActive bool) ([]models.Divisi, error) {
	query := `SELECT id, nama, is_active, urutan, created_at FROM divisi`
	if onlyActive {
		query += ` WHERE is_active = TRUE`
	}
	query += ` ORDER BY urutan ASC, nama ASC`

	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []models.Divisi
	for rows.Next() {
		var d models.Divisi
		if err := rows.Scan(&d.ID, &d.Nama, &d.IsActive, &d.Urutan, &d.CreatedAt); err != nil {
			return nil, err
		}
		list = append(list, d)
	}
	if list == nil {
		list = []models.Divisi{}
	}
	return list, nil
}

// Create — buat divisi baru
func (r *DivisiRepository) Create(ctx context.Context, nama string, urutan int) (*models.Divisi, error) {
	d := &models.Divisi{
		ID:        uuid.New(),
		Nama:      nama,
		IsActive:  true,
		Urutan:    urutan,
		CreatedAt: time.Now(),
	}
	_, err := r.db.Exec(ctx,
		`INSERT INTO divisi (id, nama, is_active, urutan, created_at) VALUES ($1, $2, $3, $4, $5)`,
		d.ID, d.Nama, d.IsActive, d.Urutan, d.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return d, nil
}

// Update — ubah nama dan urutan
func (r *DivisiRepository) Update(ctx context.Context, id uuid.UUID, nama string, urutan int) error {
	_, err := r.db.Exec(ctx,
		`UPDATE divisi SET nama=$1, urutan=$2 WHERE id=$3`,
		nama, urutan, id,
	)
	return err
}

// ToggleActive — aktifkan/nonaktifkan
func (r *DivisiRepository) ToggleActive(ctx context.Context, id uuid.UUID, isActive bool) error {
	_, err := r.db.Exec(ctx,
		`UPDATE divisi SET is_active=$1 WHERE id=$2`,
		isActive, id,
	)
	return err
}

// Delete — hapus permanen
func (r *DivisiRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `DELETE FROM divisi WHERE id=$1`, id)
	return err
}
