-- Migration: add created_at and updated_at to donors
-- Backup donors table then add timestamp columns
USE blood_mate_db;

CREATE TABLE IF NOT EXISTS donors_backup LIKE donors;
INSERT INTO donors_backup SELECT * FROM donors;

ALTER TABLE donors
  ADD COLUMN created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Verify
DESCRIBE donors;
SELECT COUNT(*) AS backup_count FROM donors_backup;
SELECT id, name, firebase_uid, created_at FROM donors ORDER BY created_at DESC LIMIT 5;
