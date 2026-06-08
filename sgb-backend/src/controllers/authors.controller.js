const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/authors
 */
const listAuthors = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.nome = { contains: search };
    }

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { nome: 'asc' },
        include: { _count: { select: { books: true } } },
      }),
      prisma.author.count({ where }),
    ]);

    return res.json({
      data: authors.map((a) => ({ ...a, bookCount: a._count.books })),
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
 * GET /api/authors/:id
 */
const getAuthor = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const author = await prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          include: {
            genre: { select: { id: true, nome: true } },
            _count: { select: { exemplares: true } },
          },
          orderBy: { titulo: 'asc' },
        },
      },
    });

    if (!author) {
      return res.status(404).json({ error: 'Autor não encontrado.' });
    }

    return res.json(author);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/authors
 */
const createAuthor = async (req, res, next) => {
  try {
    const { nome, biografia } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome do autor é obrigatório.' });
    }

    const author = await prisma.author.create({
      data: { nome, biografia: biografia || null },
    });

    return res.status(201).json({ message: 'Autor criado com sucesso.', author });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/authors/:id
 */
const updateAuthor = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nome, biografia } = req.body;

    const existing = await prisma.author.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Autor não encontrado.' });
    }

    const author = await prisma.author.update({
      where: { id },
      data: {
        nome: nome !== undefined ? nome : existing.nome,
        biografia: biografia !== undefined ? biografia : existing.biografia,
      },
    });

    return res.json({ message: 'Autor atualizado com sucesso.', author });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/authors/:id
 */
const deleteAuthor = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.author.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Autor não encontrado.' });
    }

    if (existing._count.books > 0) {
      return res.status(409).json({
        error: 'Não é possível remover um autor que possui livros cadastrados.',
      });
    }

    await prisma.author.delete({ where: { id } });

    return res.json({ message: 'Autor removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listAuthors, getAuthor, createAuthor, updateAuthor, deleteAuthor };
