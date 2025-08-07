const express = require('express');
const router = express.Router();
const db = require('../db');

// POST: Add donor (prevent duplicate for same firebase_uid)
router.post('/add', (req, res) => {
  const { name, age, bloodgroup, city, firebase_uid, status = 'Available' } = req.body;
  
  // Debug logging
  console.log('Received donor data:', { name, age, bloodgroup, city, firebase_uid, status });
  
  // Check if donor already exists for this user
  db.query('SELECT * FROM donors WHERE firebase_uid = ?', [firebase_uid], (err, results) => {
    if (err) {
      console.error('Error checking existing donor:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    
    console.log('Existing donor check results:', results);
    
    if (results.length > 0) {
      // Donor already exists for this user
      console.log('Donor already exists for firebase_uid:', firebase_uid);
      return res.status(400).json({ message: 'Donor already exists for this user', id: results[0].id });
    }
    
    // Insert new donor
    const query = `INSERT INTO donors (name, age, bloodgroup, city, firebase_uid, status) VALUES (?, ?, ?, ?, ?, ?)`;
    console.log('Executing insert query with values:', [name, age, bloodgroup, city, firebase_uid, status]);
    
    db.query(query, [name, age, bloodgroup, city, firebase_uid, status], (err, result) => {
      if (err) {
        console.error('Error inserting donor:', err);
        return res.status(500).json({ message: 'Database error' });
      } else {
        console.log('Donor inserted successfully with ID:', result.insertId);
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
      console.error('Error fetching all donors:', err);
      return res.status(500).json({ message: 'Database error' });
    } else {
      console.log('Fetched all donors, count:', results.length);
      return res.status(200).json(results);
    }
  });
});

// GET: Search donors by blood group and city
router.get('/search', (req, res) => {
  const { bloodgroup, city } = req.query;
  console.log('Searching donors with bloodgroup:', bloodgroup, 'and city:', city);
  
  const query = 'SELECT * FROM donors WHERE bloodgroup = ? AND city = ?';
  db.query(query, [bloodgroup, city], (err, results) => {
    if (err) {
      console.error('Error searching donors:', err);
      return res.status(500).json({ message: 'Database error' });
    } else {
      console.log('Search results count:', results.length);
      return res.status(200).json(results);
    }
  });
});

// GET: Get donor by firebase_uid
router.get('/by-uid/:uid', (req, res) => {
  const { uid } = req.params;
  console.log('Searching donor by firebase_uid:', uid);
  
  const query = 'SELECT * FROM donors WHERE firebase_uid = ?';
  db.query(query, [uid], (err, results) => {
    if (err) {
      console.error('Error finding donor by UID:', err);
      return res.status(500).json({ message: 'Database error' });
    } else if (results.length === 0) {
      console.log('No donor found for firebase_uid:', uid);
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      console.log('Found donor for firebase_uid:', uid);
      return res.status(200).json(results[0]);
    }
  });
});

// GET: Get single donor by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log('Searching donor by ID:', id);
  
  const query = 'SELECT * FROM donors WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error finding donor by ID:', err);
      return res.status(500).json({ message: 'Database error' });
    } else if (results.length === 0) {
      console.log('No donor found with ID:', id);
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      console.log('Found donor with ID:', id);
      return res.status(200).json(results[0]);
    }
  });
});

// PUT: Update donor status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log('Updating donor status for ID:', id, 'to:', status);
  
  // Validate status
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
      console.log('No donor found with ID:', id);
      return res.status(404).json({ message: 'Donor not found' });
    } else {
      console.log('Updated donor status successfully');
      return res.status(200).json({ message: 'Status updated successfully' });
    }
  });
});

module.exports = router; 
