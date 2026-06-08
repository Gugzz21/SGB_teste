const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/fines
 * Query params: status, userId, page, limit
 */
const listFines = async (req, res, next) => {
  try {
    const { status, userId, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = parseInt(userId, 10);

    const [fines, total] = await Promise.all([
      prisma.fine.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, nome: true, email: true } },
          loan: {
            include: {
              exemplar: {
                include: {
                  book: { select: { id: true, titulo: true, isbn: true } },
                },
              },
            },
          },
        },
      }),
      prisma.fine.count({ where }),
    ]);

    // Sum total pending fines value
    const totalPendingValue = await prisma.fine.aggregate({
      where: { status: 'PENDENTE' },
      _sum: { valor: true },
    });

    return res.json({
      data: fines,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      summary: {
        totalPendingValue: totalPendingValue._sum.valor || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/fines/:id
 */
const getFine = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const fine = await prisma.fine.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nome: true, email: true, bairro: true } },
        loan: {
          include: {
            exemplar: {
              include: {
                book: {
                  include: {
                    author: { select: { id: true, nome: true } },
                    genre: { select: { id: true, nome: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!fine) {
      return res.status(404).json({ error: 'Multa não encontrada.' });
    }

    return res.json(fine);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/fines/:id/pay
 * Mark a fine as PAGA. Bibliotecário only.
 */
const payFine = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const fine = await prisma.fine.findUnique({ where: { id } });

    if (!fine) {
      return res.status(404).json({ error: 'Multa não encontrada.' });
    }

    if (fine.status === 'PAGA') {
      return res.status(409).json({ error: 'Esta multa já foi paga.' });
    }

    const updated = await prisma.fine.update({
      where: { id },
      data: { status: 'PAGA' },
      include: {
        user: { select: { id: true, nome: true, email: true } },
        loan: {
          include: {
            exemplar: {
              include: { book: { select: { id: true, titulo: true } } },
            },
          },
        },
      },
    });

    return res.json({
      message: `Multa de R$${fine.valor.toFixed(2)} paga com sucesso.`,
      fine: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listFines, getFine, payFine };
