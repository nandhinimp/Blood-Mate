const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Add donor
router.post('/add', (req, res) => {
  const { name, age, blood_group, city } = req.body;
  const query = `INSERT INTO donors (name, age, blood_group, city) VALUES (?, ?, ?, ?)`;
  db.query(query, [name, age, blood_group, city], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    } else {
      return res.status(201).json({ message: 'Donor added successfully' });
    }
  });
});

// GET: Fetch all donors
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM donors';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    } else {
      return res.status(200).json(results);
    }
  });
});

// GET: Search donors by blood group and city
router.get('/search', (req, res) => {
  const { blood_group, city } = req.query;
  const query = 'SELECT * FROM donors WHERE blood_group = ? AND city = ?';
  db.query(query, [blood_group, city], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = router;
