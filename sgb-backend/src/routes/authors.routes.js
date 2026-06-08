const express = require('express');
const router = express.Router();
const authorsController = require('../controllers/authors.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// GET /api/authors  (public)
router.get('/', authorsController.listAuthors);

// GET /api/authors/:id  (public)
router.get('/:id', authorsController.getAuthor);

// POST /api/authors  (bibliotecario only)
router.post('/', verifyToken, requireBibliotecario, authorsController.createAuthor);

// PUT /api/authors/:id  (bibliotecario only)
router.put('/:id', verifyToken, requireBibliotecario, authorsController.updateAuthor);

// DELETE /api/authors/:id  (bibliotecario only)
router.delete('/:id', verifyToken, requireBibliotecario, authorsController.deleteAuthor);

module.exports = router;
