-- Migration: add medical_report and ocr_text columns to donors
USE blood_mate_db;

ALTER TABLE donors
  ADD COLUMN medical_report VARCHAR(255) NULL,
  ADD COLUMN ocr_text TEXT NULL;

-- Verify
DESCRIBE donors;
SELECT id, name, medical_report, LEFT(ocr_text, 200) AS ocr_preview FROM donors ORDER BY id DESC LIMIT 5;
