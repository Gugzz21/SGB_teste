const express = require('express');
const router = express.Router();
const finesController = require('../controllers/fines.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// GET /api/fines  (bibliotecario only, with filters)
router.get('/', verifyToken, requireBibliotecario, finesController.listFines);

// GET /api/fines/:id  (bibliotecario only)
router.get('/:id', verifyToken, requireBibliotecario, finesController.getFine);

// PUT /api/fines/:id/pay  (bibliotecario only)
router.put('/:id/pay', verifyToken, requireBibliotecario, finesController.payFine);

module.exports = router;
