const express = require('express');
const router = express.Router();
const genresController = require('../controllers/genres.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// GET /api/genres  (public)
router.get('/', genresController.listGenres);

// POST /api/genres  (bibliotecario only)
router.post('/', verifyToken, requireBibliotecario, genresController.createGenre);

// PUT /api/genres/:id  (bibliotecario only)
router.put('/:id', verifyToken, requireBibliotecario, genresController.updateGenre);

// DELETE /api/genres/:id  (bibliotecario only)
router.delete('/:id', verifyToken, requireBibliotecario, genresController.deleteGenre);

module.exports = router;
