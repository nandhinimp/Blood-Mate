const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Add donor (prevent duplicate for same firebase_uid)
router.post('/add', (req, res) => {
  const { name, age, blood_group, city, firebase_uid } = req.body;
  // Check if donor already exists for this user
  db.query('SELECT * FROM donors WHERE firebase_uid = ?', [firebase_uid], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      // Donor already exists for this user
      return res.status(400).json({ message: 'Donor already exists for this user', id: results[0].id });
    }
    // Insert new donor
    const query = `INSERT INTO donors (name, age, blood_group, city, firebase_uid) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [name, age, blood_group, city, firebase_uid], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      } else {
        // Return the new donor's id
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

// GET: Get donor by firebase_uid
router.get('/by-uid/:uid', (req, res) => {
  const { uid } = req.params;
  const query = 'SELECT * FROM donors WHERE firebase_uid = ?';
  db.query(query, [uid], (err, results) => {
    if (err) {
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
      return res.status(500).json({ message: 'Database error' });
    } else if (results.length === 0) {
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

module.exports = router;