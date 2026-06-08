const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/**
 * GET /api/users
 * List all users with pagination. Bibliotecário only.
 */
const listUsers = async (req, res, next) => {
  try {
    const { search, tipo, bairro, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (tipo) {
      where.tipo = tipo;
    }

    if (bairro) {
      where.bairro = { contains: bairro };
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { nome: 'asc' },
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
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Get a single user with their loan count. Bibliotecário only.
 * Does NOT include individual loan history (privacy).
 */
const getUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const user = await prisma.user.findUnique({
      where: { id },
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

    // Count pending fines separately
    const pendingFines = await prisma.fine.count({
      where: { userId: id, status: 'PENDENTE' },
    });

    return res.json({ ...user, pendingFinesCount: pendingFines });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update user. Bibliotecário only.
 */
const updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nome, email, senha, tipo, bairro, grupoSocial } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const updateData = {
      nome: nome !== undefined ? nome : existing.nome,
      email: email !== undefined ? email : existing.email,
      tipo: tipo !== undefined ? tipo : existing.tipo,
      bairro: bairro !== undefined ? bairro : existing.bairro,
      grupoSocial: grupoSocial !== undefined ? grupoSocial : existing.grupoSocial,
    };

    if (senha) {
      updateData.senha = await bcrypt.hash(senha, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        bairro: true,
        grupoSocial: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.json({ message: 'Usuário atualizado com sucesso.', user });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Delete user. Bibliotecário only.
 */
const deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            loans: true,
          },
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Prevent deleting self
    if (id === req.user.id) {
      return res.status(409).json({ error: 'Não é possível excluir o próprio usuário.' });
    }

    // Check for active loans
    const activeLoan = await prisma.loan.findFirst({
      where: { userId: id, status: 'ATIVO' },
    });

    if (activeLoan) {
      return res.status(409).json({
        error: 'Não é possível excluir um usuário com empréstimos ativos.',
      });
    }

    await prisma.user.delete({ where: { id } });

    return res.json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers, getUser, updateUser, deleteUser };
