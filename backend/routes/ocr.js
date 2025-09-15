const express = require('express');
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const router = express.Router();

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// File upload + OCR endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Only run OCR for images (for PDF, you need pdf-to-image conversion)
  const ext = path.extname(req.file.filename).toLowerCase();
  if (['.png', '.jpg', '.jpeg', '.bmp', '.tiff'].includes(ext)) {
    try {
      const result = await Tesseract.recognize(
        req.file.path,
        'eng',
        { logger: m => console.log(m) }
      );
      // Save OCR text to DB here (add your DB logic)
      // Example: await saveOCRTextToDB(req.user.id, req.file.filename, result.data.text);
      return res.json({ message: 'File uploaded and OCR complete', text: result.data.text, filename: req.file.filename });
    } catch (err) {
      return res.status(500).json({ error: 'OCR failed', details: err.message });
    }
  } else {
    // For PDF, just save file and return (OCR for PDF needs extra steps)
    return res.json({ message: 'File uploaded (no OCR for non-image)', filename: req.file.filename });
  }
});

module.exports = router;
