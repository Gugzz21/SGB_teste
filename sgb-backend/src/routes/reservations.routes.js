const express = require('express');
const router = express.Router();
const reservationsController = require('../controllers/reservations.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// GET /api/reservations  (bibliotecario only)
router.get('/', verifyToken, requireBibliotecario, reservationsController.listReservations);

// GET /api/reservations/:id  (authenticated)
router.get('/:id', verifyToken, reservationsController.getReservation);

// POST /api/reservations  (authenticated)
router.post('/', verifyToken, reservationsController.createReservation);

// PUT /api/reservations/:id/cancel  (authenticated - owner or bibliotecario)
router.put('/:id/cancel', verifyToken, reservationsController.cancelReservation);

// PUT /api/reservations/:id/attend  (bibliotecario only)
router.put('/:id/attend', verifyToken, requireBibliotecario, reservationsController.attendReservation);

module.exports = router;
