const express = require('express');
const router = express.Router();
const structuresRouter = require('./structures');

// Base route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to GASPRE API',
    version: '1.0.0',
  });
});

// Mount routes
router.use('/structures', structuresRouter);

module.exports = router;
