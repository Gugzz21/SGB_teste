const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Helper: get the start of a given month offset from now.
 * offset = 0 → current month, offset = -1 → last month, etc.
 */
const getMonthBoundaries = (offset = 0) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

/**
 * Helper: format a Date into "YYYY-MM" label.
 */
const monthLabel = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

/**
 * GET /api/reports/dashboard
 * Returns high-level counts for the dashboard.
 */
const dashboard = async (req, res, next) => {
  try {
    const [
      totalBooks,
      totalExemplares,
      emprestadosAtivos,
      usuariosAtivos,
      multasPendentes,
      totalMultasPendentesValor,
    ] = await Promise.all([
      prisma.book.count(),
      prisma.exemplar.count(),
      prisma.loan.count({ where: { status: 'ATIVO' } }),
      prisma.user.count({ where: { tipo: 'LEITOR' } }),
      prisma.fine.count({ where: { status: 'PENDENTE' } }),
      prisma.fine.aggregate({
        where: { status: 'PENDENTE' },
        _sum: { valor: true },
      }),
    ]);

    return res.json({
      totalBooks,
      totalExemplares,
      emprestadosAtivos,
      usuariosAtivos,
      multasPendentes,
      totalMultasPendentesValor: totalMultasPendentesValor._sum.valor || 0,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/demographics
 * Groups users by bairro and grupoSocial.
 * Returns ONLY aggregate counts — no individual user data, no reading history.
 */
const demographics = async (req, res, next) => {
  try {
    // Group by bairro
    const byBairro = await prisma.user.groupBy({
      by: ['bairro'],
      where: { tipo: 'LEITOR' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Group by grupoSocial (filter out null)
    const byGrupoSocial = await prisma.user.groupBy({
      by: ['grupoSocial'],
      where: { tipo: 'LEITOR', grupoSocial: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Count users with and without grupoSocial
    const [comGrupo, semGrupo] = await Promise.all([
      prisma.user.count({ where: { tipo: 'LEITOR', grupoSocial: { not: null } } }),
      prisma.user.count({ where: { tipo: 'LEITOR', grupoSocial: null } }),
    ]);

    return res.json({
      porBairro: byBairro.map((b) => ({
        bairro: b.bairro,
        total: b._count.id,
      })),
      porGrupoSocial: byGrupoSocial.map((g) => ({
        grupoSocial: g.grupoSocial,
        total: g._count.id,
      })),
      resumo: {
        comGrupoSocial: comGrupo,
        semGrupoSocial: semGrupo,
        total: comGrupo + semGrupo,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/loans-over-time
 * Returns empréstimos and devoluções grouped by month for the last 6 months.
 */
const loansOverTime = async (req, res, next) => {
  try {
    const months = [];

    for (let i = -5; i <= 0; i++) {
      const { start, end } = getMonthBoundaries(i);

      const [emprestimos, devolucoes] = await Promise.all([
        prisma.loan.count({
          where: {
            dataEmprestimo: { gte: start, lte: end },
          },
        }),
        prisma.loan.count({
          where: {
            dataDevolucaoEfetiva: { gte: start, lte: end },
          },
        }),
      ]);

      months.push({
        month: monthLabel(start),
        emprestimos,
        devolucoes,
      });
    }

    return res.json({ data: months });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/delays
 * Returns delayed returns grouped by month for the last 6 months,
 * including count of delayed loans and total fine value generated.
 */
const delays = async (req, res, next) => {
  try {
    const months = [];

    for (let i = -5; i <= 0; i++) {
      const { start, end } = getMonthBoundaries(i);

      // Count loans returned late in this month
      const atrasadosCount = await prisma.loan.count({
        where: {
          status: 'ATRASADO',
          dataDevolucaoEfetiva: { gte: start, lte: end },
        },
      });

      // Sum fines created in this month
      const finesSum = await prisma.fine.aggregate({
        where: {
          createdAt: { gte: start, lte: end },
        },
        _sum: { valor: true },
        _count: { id: true },
      });

      months.push({
        month: monthLabel(start),
        atrasados: atrasadosCount,
        totalMultas: finesSum._count.id,
        valorTotalMultas: finesSum._sum.valor || 0,
      });
    }

    return res.json({ data: months });
  } catch (error) {
    next(error);
  }
};

module.exports = { dashboard, demographics, loansOverTime, delays };
