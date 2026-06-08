const express = require('express');
const router = express.Router();
const loansController = require('../controllers/loans.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// GET /api/loans  (bibliotecario only, with filters)
router.get('/', verifyToken, requireBibliotecario, loansController.listLoans);

// GET /api/loans/:id  (bibliotecario only)
router.get('/:id', verifyToken, requireBibliotecario, loansController.getLoan);

// POST /api/loans  (bibliotecario only)
router.post('/', verifyToken, requireBibliotecario, loansController.createLoan);

// PUT /api/loans/:id/return  (bibliotecario only)
router.put('/:id/return', verifyToken, requireBibliotecario, loansController.returnLoan);

module.exports = router;
