const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// GET /api/books  (public - optional token for personalization)
router.get('/', booksController.listBooks);

// GET /api/books/:id  (public)
router.get('/:id', booksController.getBook);

// POST /api/books  (bibliotecario only)
router.post('/', verifyToken, requireBibliotecario, booksController.createBook);

// PUT /api/books/:id  (bibliotecario only)
router.put('/:id', verifyToken, requireBibliotecario, booksController.updateBook);

// DELETE /api/books/:id  (bibliotecario only)
router.delete('/:id', verifyToken, requireBibliotecario, booksController.deleteBook);

module.exports = router;
