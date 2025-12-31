const express = require('express');
const router = express.Router();
const StructureController = require('../controllers/StructureController');

const controller = new StructureController();

router.get('/paths', controller.listPaths);
router.get('/:id/tree', controller.getTree);

module.exports = router;
