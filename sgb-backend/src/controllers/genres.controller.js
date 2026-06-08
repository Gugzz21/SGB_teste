const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/genres
 */
const listGenres = async (req, res, next) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { nome: 'asc' },
      include: { _count: { select: { books: true } } },
    });

    return res.json({
      data: genres.map((g) => ({ ...g, bookCount: g._count.books })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/genres
 */
const createGenre = async (req, res, next) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'O nome do gênero é obrigatório.' });
    }

    const genre = await prisma.genre.create({
      data: { nome, descricao: descricao || null },
    });

    return res.status(201).json({ message: 'Gênero criado com sucesso.', genre });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/genres/:id
 */
const updateGenre = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nome, descricao } = req.body;

    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Gênero não encontrado.' });
    }

    const genre = await prisma.genre.update({
      where: { id },
      data: {
        nome: nome !== undefined ? nome : existing.nome,
        descricao: descricao !== undefined ? descricao : existing.descricao,
      },
    });

    return res.json({ message: 'Gênero atualizado com sucesso.', genre });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/genres/:id
 */
const deleteGenre = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Gênero não encontrado.' });
    }

    if (existing._count.books > 0) {
      return res.status(409).json({
        error: 'Não é possível remover um gênero que possui livros cadastrados.',
      });
    }

    await prisma.genre.delete({ where: { id } });

    return res.json({ message: 'Gênero removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listGenres, createGenre, updateGenre, deleteGenre };
