const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const pdf = require('pdf-poppler');   

// File upload and OCR integration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });


// AI-based eligibility check

function checkEligibility(ocrText) {
  // Example rules (customize as needed)
  const ageMatch = ocrText.match(/age[:\s]+(\d+)/i);
  const hemoMatch = ocrText.match(/hemoglobin[:\s]+([\d.]+)/i);
  const hasDisease = /diabetes|cancer|hiv|hepatitis/i.test(ocrText);

  const age = ageMatch ? parseInt(ageMatch[1], 10) : null;
  const hemoglobin = hemoMatch ? parseFloat(hemoMatch[1]) : null;

  if (age && (age < 18 || age > 65)) return { eligible: false, reason: 'Age not in range 18-65' };
  if (hemoglobin && hemoglobin < 12.5) return { eligible: false, reason: 'Hemoglobin too low' };
  if (hasDisease) return { eligible: false, reason: 'Chronic disease detected' };

  return { eligible: true, reason: 'Eligible for blood donation' };
}


// POST: Add donor with file upload + OCR + eligibility check
// (This combines the first snippet + eligibility check logic)

router.post('/add-with-file', upload.single('medicalReport'), async (req, res) => {
  const { name, age, bloodgroup, city, firebase_uid, status = 'Available' } = req.body;
  let ocrText = null;
  let fileName = null;
  let eligibility = { eligible: null, reason: 'Not checked' };

  if (req.file) {
    fileName = req.file.filename;
    const ext = path.extname(fileName).toLowerCase();
    const filePath = req.file.path;

    if (ext === '.pdf') {
      // Convert PDF to images
      const outputDir = path.join(__dirname, '../uploads', path.basename(fileName, '.pdf'));
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      const opts = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: path.basename(fileName, '.pdf'),
        page: null
      };

      try {
        await pdf.convert(filePath, opts);
        // Get all generated images
        const images = fs.readdirSync(outputDir)
          .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'))
          .map(f => path.join(outputDir, f));

        let allText = '';
        for (const img of images) {
          const result = await Tesseract.recognize(img, 'eng');
          allText += result.data.text + '\n';
        }
        ocrText = allText;
        eligibility = checkEligibility(ocrText);  
      } catch (err) {
        return res.status(500).json({ message: 'PDF to image/OCR failed', details: err.message });
      }
    } else if ([".png", ".jpg", ".jpeg", ".bmp", ".tiff"].includes(ext)) {
      try {
        const result = await Tesseract.recognize(filePath, 'eng');
        ocrText = result.data.text;
        eligibility = checkEligibility(ocrText);  
      } catch (err) {
        return res.status(500).json({ message: 'OCR failed', details: err.message });
      }
    }
  }

  // Insert donor with file and OCR text
  const query = `INSERT INTO donors (name, age, bloodgroup, city, firebase_uid, status, medical_report, ocr_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [name, age, bloodgroup, city, firebase_uid, status, fileName, ocrText], (err, result) => {
    if (err) {
      console.error('Error inserting donor with file:', err);
      return res.status(500).json({ message: 'Database error' });
    } else {
      return res.status(201).json({
        message: 'Donor added successfully',
        id: result.insertId,
        file: fileName,
        ocr: ocrText,
        eligibility  
      });
    }
  });
});


// POST: Add donor (prevent duplicate for same firebase_uid)
router.post('/add', (req, res) => {
  const { name, age, bloodgroup, city, firebase_uid, status = 'Available' } = req.body;
  
  console.log('Received donor data:', { name, age, bloodgroup, city, firebase_uid, status });
  
  db.query('SELECT * FROM donors WHERE firebase_uid = ?', [firebase_uid], (err, results) => {
    if (err) {
      console.error('Error checking existing donor:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Donor already exists for this user', id: results[0].id });
    }
    
    const query = `INSERT INTO donors (name, age, bloodgroup, city, firebase_uid, status) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [name, age, bloodgroup, city, firebase_uid, status], (err, result) => {
      if (err) {
        console.error('Error inserting donor:', err);
        return res.status(500).json({ message: 'Database error' });
      } else {
        return res.status(201).json({ message: 'Donor added successfully', id: result.insertId });
      }
    });
  });
});

// GET: Fetch all donors
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM donors';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching all donors:', err);
      return res.status(500).json({ message: 'Database error' });
    } else {
      return res.status(200).json(results);
    }
  });
});

// GET: Search donors by blood group and city
router.get('/search', (req, res) => {
  const { bloodgroup, city } = req.query;
  const query = 'SELECT * FROM donors WHERE bloodgroup = ? AND city = ?';
  db.query(query, [bloodgroup, city], (err, results) => {
    if (err) {
      console.error('Error searching donors:', err);
      return res.status(500).json({ message: 'Database error' });
    } else {
      return res.status(200).json(results);
    }
  });
});

// GET: Get donor by firebase_uid
router.get('/by-uid/:uid', (req, res) => {
  const { uid } = req.params;
  const query = 'SELECT * FROM donors WHERE firebase_uid = ?';
  db.query(query, [uid], (err, results) => {
    if (err) {
      console.error('Error finding donor by UID:', err);
      return res.status(500).json({ message: 'Database error' });
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

// GET: Get single donor by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM donors WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error finding donor by ID:', err);
      return res.status(500).json({ message: 'Database error' });
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

// PUT: Update donor status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['Available', 'Recently Donated', 'Unavailable', 'Inactive'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') });
  }
  
  const query = 'UPDATE donors SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating donor status:', err);
      return res.status(500).json({ message: 'Database error' });
    } else if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      return res.status(200).json({ message: 'Status updated successfully' });
    }
  });
});

module.exports = router;
