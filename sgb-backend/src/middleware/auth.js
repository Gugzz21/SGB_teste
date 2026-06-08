const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * verifyToken - Middleware that extracts and verifies the JWT from the
 * Authorization: Bearer <token> header. Attaches the decoded user to req.user.
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido. Acesso negado.' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
      }
      return res.status(401).json({ error: 'Token inválido.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, nome: true, email: true, tipo: true, bairro: true, grupoSocial: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * requireBibliotecario - Middleware that ensures the authenticated user has
 * the BIBLIOTECARIO role. Must be used after verifyToken.
 */
const requireBibliotecario = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  if (req.user.tipo !== 'BIBLIOTECARIO') {
    return res.status(403).json({ error: 'Acesso restrito a bibliotecários.' });
  }

  next();
};

module.exports = { verifyToken, requireBibliotecario };
