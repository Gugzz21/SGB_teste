const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/reservations
 * Query params: status, bookId, userId, page, limit
 * Bibliotecário only.
 */
const listReservations = async (req, res, next) => {
  try {
    const { status, bookId, userId, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) where.status = status;
    if (bookId) where.bookId = parseInt(bookId, 10);
    if (userId) where.userId = parseInt(userId, 10);

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [{ posicaoFila: 'asc' }, { createdAt: 'asc' }],
        include: {
          user: { select: { id: true, nome: true, email: true } },
          book: {
            include: {
              author: { select: { id: true, nome: true } },
              genre: { select: { id: true, nome: true } },
            },
          },
        },
      }),
      prisma.reservation.count({ where }),
    ]);

    return res.json({
      data: reservations,
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
 * GET /api/reservations/:id
 */
const getReservation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nome: true, email: true } },
        book: {
          include: {
            author: { select: { id: true, nome: true } },
            genre: { select: { id: true, nome: true } },
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    // Only allow owner or bibliotecario to view
    if (req.user.tipo !== 'BIBLIOTECARIO' && reservation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    return res.json(reservation);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/reservations
 * Business logic:
 * 1. Check user doesn't already have a PENDENTE reservation for this book
 * 2. Calculate posicaoFila = existing PENDENTE count + 1
 * 3. Create reservation
 */
const createReservation = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    if (!bookId) {
      return res.status(400).json({ error: 'bookId é obrigatório.' });
    }

    const bookIdInt = parseInt(bookId, 10);

    // Validate book exists
    const book = await prisma.book.findUnique({ where: { id: bookIdInt } });
    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    // 1. Check for duplicate reservation
    const existingReservation = await prisma.reservation.findFirst({
      where: { userId, bookId: bookIdInt, status: 'PENDENTE' },
    });

    if (existingReservation) {
      return res.status(409).json({
        error: 'Você já possui uma reserva pendente para este livro.',
        reservationId: existingReservation.id,
        posicaoFila: existingReservation.posicaoFila,
      });
    }

    // 2. Calculate queue position
    const pendingCount = await prisma.reservation.count({
      where: { bookId: bookIdInt, status: 'PENDENTE' },
    });

    const posicaoFila = pendingCount + 1;

    // 3. Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId,
        bookId: bookIdInt,
        status: 'PENDENTE',
        posicaoFila,
      },
      include: {
        book: { select: { id: true, titulo: true } },
        user: { select: { id: true, nome: true } },
      },
    });

    return res.status(201).json({
      message: `Reserva criada com sucesso. Posição na fila: ${posicaoFila}.`,
      reservation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/reservations/:id/cancel
 * Business logic:
 * 1. Only the owner or bibliotecario can cancel
 * 2. Recalculate queue positions for remaining PENDENTE reservations of same book
 */
const cancelReservation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    // Check ownership or bibliotecario
    if (req.user.tipo !== 'BIBLIOTECARIO' && reservation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Apenas o proprietário da reserva ou um bibliotecário pode cancelar.' });
    }

    if (reservation.status !== 'PENDENTE') {
      return res.status(409).json({
        error: `Não é possível cancelar uma reserva com status "${reservation.status}".`,
      });
    }

    const canceledPosition = reservation.posicaoFila;
    const bookId = reservation.bookId;

    // Cancel the reservation
    await prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELADA' },
    });

    // Recalculate queue positions for remaining PENDENTE reservations of the same book
    const remainingReservations = await prisma.reservation.findMany({
      where: {
        bookId,
        status: 'PENDENTE',
        posicaoFila: { gt: canceledPosition },
      },
      orderBy: { posicaoFila: 'asc' },
    });

    // Decrement position for all that were behind the canceled one
    const updatePromises = remainingReservations.map((r) =>
      prisma.reservation.update({
        where: { id: r.id },
        data: { posicaoFila: r.posicaoFila - 1 },
      })
    );

    await Promise.all(updatePromises);

    return res.json({ message: 'Reserva cancelada com sucesso. Fila de espera atualizada.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/reservations/:id/attend
 * Mark reservation as ATENDIDA. Bibliotecário only.
 */
const attendReservation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const reservation = await prisma.reservation.findUnique({ where: { id } });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    if (reservation.status !== 'PENDENTE') {
      return res.status(409).json({
        error: `Não é possível atender uma reserva com status "${reservation.status}".`,
      });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status: 'ATENDIDA' },
      include: {
        user: { select: { id: true, nome: true } },
        book: { select: { id: true, titulo: true } },
      },
    });

    return res.json({ message: 'Reserva marcada como atendida.', reservation: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listReservations,
  getReservation,
  createReservation,
  cancelReservation,
  attendReservation,
};
