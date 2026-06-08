const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// All report routes require bibliotecario
router.use(verifyToken, requireBibliotecario);

// GET /api/reports/dashboard
router.get('/dashboard', reportsController.dashboard);

// GET /api/reports/demographics
router.get('/demographics', reportsController.demographics);

// GET /api/reports/loans-over-time
router.get('/loans-over-time', reportsController.loansOverTime);

// GET /api/reports/delays
router.get('/delays', reportsController.delays);

module.exports = router;
