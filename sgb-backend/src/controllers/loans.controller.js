const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/loans
 * Query params: status, userId, exemplarId, page, limit
 */
const listLoans = async (req, res, next) => {
  try {
    const { status, userId, exemplarId, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = parseInt(userId, 10);
    if (exemplarId) where.exemplarId = parseInt(exemplarId, 10);

    const [loans, total] = await Promise.all([
      prisma.loan.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, nome: true, email: true } },
          exemplar: {
            include: {
              book: {
                select: {
                  id: true,
                  titulo: true,
                  isbn: true,
                  author: { select: { id: true, nome: true } },
                },
              },
            },
          },
          fines: true,
        },
      }),
      prisma.loan.count({ where }),
    ]);

    return res.json({
      data: loans,
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
 * GET /api/loans/:id
 */
const getLoan = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, nome: true, email: true, bairro: true } },
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
        fines: true,
      },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Empréstimo não encontrado.' });
    }

    return res.json(loan);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/loans
 * Business logic:
 * 1. Check exemplar is DISPONIVEL
 * 2. Check no PENDENTE reservation for ANOTHER user
 * 3. Check user has no PENDENTE fines
 * 4. Create Loan (ATIVO), set dataPrevisaoDevolucao = now + 14 days
 * 5. Update Exemplar status to EMPRESTADO
 */
const createLoan = async (req, res, next) => {
  try {
    const { userId, exemplarId } = req.body;

    if (!userId || !exemplarId) {
      return res.status(400).json({ error: 'userId e exemplarId são obrigatórios.' });
    }

    const userIdInt = parseInt(userId, 10);
    const exemplarIdInt = parseInt(exemplarId, 10);

    // Fetch user
    const user = await prisma.user.findUnique({ where: { id: userIdInt } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Fetch exemplar
    const exemplar = await prisma.exemplar.findUnique({
      where: { id: exemplarIdInt },
      include: { book: true },
    });
    if (!exemplar) {
      return res.status(404).json({ error: 'Exemplar não encontrado.' });
    }

    // 1. Check exemplar is DISPONIVEL
    if (exemplar.status !== 'DISPONIVEL') {
      const statusMessages = {
        EMPRESTADO: 'Este exemplar já está emprestado.',
        RESERVADO: 'Este exemplar está reservado.',
        MANUTENCAO: 'Este exemplar está em manutenção.',
      };
      return res.status(409).json({
        error: statusMessages[exemplar.status] || 'Exemplar não disponível para empréstimo.',
      });
    }

    // 2. Check if exemplar is RESERVADO for another user (by bookId)
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        bookId: exemplar.bookId,
        status: 'PENDENTE',
        userId: { not: userIdInt },
      },
      orderBy: { posicaoFila: 'asc' },
    });

    if (conflictingReservation) {
      return res.status(409).json({
        error: 'Este livro possui uma reserva pendente para outro usuário. A reserva deve ser atendida primeiro.',
      });
    }

    // 3. Check if user has any PENDENTE fines
    const pendingFine = await prisma.fine.findFirst({
      where: { userId: userIdInt, status: 'PENDENTE' },
    });

    if (pendingFine) {
      return res.status(409).json({
        error: 'Usuário possui multas pendentes. É necessário regularizar as multas antes de realizar um novo empréstimo.',
        pendingFineId: pendingFine.id,
        valor: pendingFine.valor,
      });
    }

    // 4. Calculate return date (14 days from now)
    const dataPrevisaoDevolucao = new Date();
    dataPrevisaoDevolucao.setDate(dataPrevisaoDevolucao.getDate() + 14);

    // 5. Create loan and update exemplar in a transaction
    const [loan] = await prisma.$transaction([
      prisma.loan.create({
        data: {
          userId: userIdInt,
          exemplarId: exemplarIdInt,
          status: 'ATIVO',
          dataPrevisaoDevolucao,
        },
        include: {
          user: { select: { id: true, nome: true, email: true } },
          exemplar: {
            include: { book: { select: { id: true, titulo: true } } },
          },
        },
      }),
      prisma.exemplar.update({
        where: { id: exemplarIdInt },
        data: { status: 'EMPRESTADO' },
      }),
    ]);

    // If there was a pending reservation for THIS user for this book, mark it as ATENDIDA
    const userReservation = await prisma.reservation.findFirst({
      where: { bookId: exemplar.bookId, userId: userIdInt, status: 'PENDENTE' },
    });

    if (userReservation) {
      await prisma.reservation.update({
        where: { id: userReservation.id },
        data: { status: 'ATENDIDA' },
      });
    }

    return res.status(201).json({
      message: 'Empréstimo criado com sucesso.',
      loan,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/loans/:id/return
 * Business logic:
 * 1. Find the loan
 * 2. Set dataDevolucaoEfetiva = now
 * 3. Calculate if late; if so, create Fine at R$1/day
 * 4. Update Loan status to DEVOLVIDO or ATRASADO
 * 5. Update Exemplar to DISPONIVEL
 * 6. Check if there's a PENDENTE reservation for this book → mark exemplar RESERVADO
 */
const returnLoan = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: { exemplar: { include: { book: true } } },
    });

    if (!loan) {
      return res.status(404).json({ error: 'Empréstimo não encontrado.' });
    }

    if (loan.status !== 'ATIVO') {
      return res.status(409).json({ error: 'Este empréstimo já foi devolvido.' });
    }

    const now = new Date();
    const dataPrevisao = new Date(loan.dataPrevisaoDevolucao);

    // Calculate delay in days
    const diffMs = now.getTime() - dataPrevisao.getTime();
    const diasAtraso = diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
    const isLate = diasAtraso > 0;
    const newLoanStatus = isLate ? 'ATRASADO' : 'DEVOLVIDO';

    const operations = [];

    // Update loan
    operations.push(
      prisma.loan.update({
        where: { id },
        data: {
          status: newLoanStatus,
          dataDevolucaoEfetiva: now,
        },
      })
    );

    // Update exemplar to DISPONIVEL initially
    operations.push(
      prisma.exemplar.update({
        where: { id: loan.exemplarId },
        data: { status: 'DISPONIVEL' },
      })
    );

    // Create fine if late
    if (isLate) {
      const valor = diasAtraso * 1.0; // R$1.00 per day
      operations.push(
        prisma.fine.create({
          data: {
            userId: loan.userId,
            loanId: loan.id,
            valor,
            diasAtraso,
            status: 'PENDENTE',
          },
        })
      );
    }

    const results = await prisma.$transaction(operations);
    const updatedLoan = results[0];

    // After transaction: check for pending reservation for this book
    const nextReservation = await prisma.reservation.findFirst({
      where: {
        bookId: loan.exemplar.bookId,
        status: 'PENDENTE',
      },
      orderBy: { posicaoFila: 'asc' },
    });

    if (nextReservation) {
      // Mark exemplar as RESERVADO and hold for this user
      await prisma.exemplar.update({
        where: { id: loan.exemplarId },
        data: { status: 'RESERVADO' },
      });
    }

    return res.json({
      message: isLate
        ? `Devolução registrada com atraso de ${diasAtraso} dia(s). Multa gerada: R$${diasAtraso.toFixed(2)}.`
        : 'Devolução registrada com sucesso.',
      loan: updatedLoan,
      diasAtraso,
      multaGerada: isLate,
      valorMulta: isLate ? diasAtraso * 1.0 : 0,
      proximaReserva: nextReservation
        ? { userId: nextReservation.userId, reservationId: nextReservation.id }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listLoans, getLoan, createLoan, returnLoan };
