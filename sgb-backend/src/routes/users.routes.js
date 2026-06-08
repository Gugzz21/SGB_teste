const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { verifyToken, requireBibliotecario } = require('../middleware/auth');

// All users routes require authentication AND bibliotecario role
router.use(verifyToken, requireBibliotecario);

// GET /api/users  (bibliotecario only, paginated)
router.get('/', usersController.listUsers);

// GET /api/users/:id  (bibliotecario only)
router.get('/:id', usersController.getUser);

// PUT /api/users/:id  (bibliotecario only)
router.put('/:id', usersController.updateUser);

// DELETE /api/users/:id  (bibliotecario only)
router.delete('/:id', usersController.deleteUser);

module.exports = router;
