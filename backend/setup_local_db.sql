-- BloodMate Database Setup Script
-- Run this if you want to use a local MySQL database instead

CREATE DATABASE IF NOT EXISTS blood_mate_db;
USE blood_mate_db;

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  bloodgroup VARCHAR(10) NOT NULL,
  city VARCHAR(255) NOT NULL,
  firebase_uid VARCHAR(255) UNIQUE,
  status VARCHAR(50) DEFAULT 'Available',
  medical_report VARCHAR(255),
  ocr_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO donors (name, age, bloodgroup, city, firebase_uid, status) VALUES
('John Doe', 25, 'A+', 'New York', 'sample_uid_1', 'Available'),
('Jane Smith', 30, 'B+', 'Los Angeles', 'sample_uid_2', 'Available'),
('Mike Johnson', 28, 'O+', 'Chicago', 'sample_uid_3', 'Available');

SELECT 'Database setup completed successfully!' as message;