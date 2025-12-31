const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Base route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to GASPRE API',
    version: '1.0.0'
  });
});

// Database test route
router.get('/db-test', async (req, res) => {
  try {
    const result = await db.raw('SELECT 1 + 1 AS result');
    res.json({ 
      success: true, 
      message: 'Database connection works!',
      result: result[0][0].result 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Get all structures
router.get('/structures', async (req, res) => {
  try {
    const structures = await db('structures').select('*');
    res.json({ success: true, data: structures });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Create a structure
router.post('/structures', async (req, res) => {
  try {
    const { name, fk_parent_id } = req.body;
    const [id] = await db('structures').insert({ name, fk_parent_id });
    const structure = await db('structures').where('id', id).first();
    res.status(201).json({ success: true, data: structure });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
