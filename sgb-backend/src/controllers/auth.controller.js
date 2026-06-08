const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Generate a JWT for a given user object.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * POST /api/auth/register
 * Registers a new user (LEITOR by default).
 */
const register = async (req, res, next) => {
  try {
    const { nome, email, senha, bairro, grupoSocial, tipo } = req.body;

    if (!nome || !email || !senha || !bairro) {
      return res.status(400).json({ error: 'Nome, email, senha e bairro são obrigatórios.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const userTipo = tipo === 'BIBLIOTECARIO' ? 'BIBLIOTECARIO' : 'LEITOR';

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: hashedSenha,
        tipo: userTipo,
        bairro,
        grupoSocial: grupoSocial || null,
      },
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        bairro: user.bairro,
        grupoSocial: user.grupoSocial,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        bairro: user.bairro,
        grupoSocial: user.grupoSocial,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile.
 */
const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        bairro: true,
        grupoSocial: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            loans: true,
            reservations: true,
            fines: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me };
