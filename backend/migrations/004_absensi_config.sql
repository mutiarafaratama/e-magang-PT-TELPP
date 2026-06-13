CREATE TABLE IF NOT EXISTS absensi_config (
    id              SERIAL PRIMARY KEY,
    jam_masuk_buka  TIME NOT NULL DEFAULT '07:30:00',
    jam_masuk_tutup TIME NOT NULL DEFAULT '08:00:00',
    jam_pulang_buka  TIME NOT NULL DEFAULT '15:00:00',
    jam_pulang_tutup TIME NOT NULL DEFAULT '16:00:00',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by      UUID REFERENCES users(id) ON DELETE SET NULL
);

INSERT INTO absensi_config (jam_masuk_buka, jam_masuk_tutup, jam_pulang_buka, jam_pulang_tutup)
VALUES ('07:30:00', '08:00:00', '15:00:00', '16:00:00');
