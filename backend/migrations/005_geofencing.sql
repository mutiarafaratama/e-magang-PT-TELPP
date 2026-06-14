-- 005_geofencing.sql
-- Tambah kolom geofencing ke absensi_config dan absensi

ALTER TABLE absensi_config
  ADD COLUMN IF NOT EXISTS kantor_lat    DECIMAL(10,8) DEFAULT -3.432194,
  ADD COLUMN IF NOT EXISTS kantor_lng    DECIMAL(11,8) DEFAULT 104.035361,
  ADD COLUMN IF NOT EXISTS radius_meter  INT           DEFAULT 1500;

ALTER TABLE absensi
  ADD COLUMN IF NOT EXISTS latitude   DECIMAL(10,8),
  ADD COLUMN IF NOT EXISTS longitude  DECIMAL(11,8);

-- Set koordinat untuk row yang sudah ada
UPDATE absensi_config
SET kantor_lat = -3.432194, kantor_lng = 104.035361, radius_meter = 1500
WHERE (kantor_lat IS NULL OR kantor_lat = 0);
