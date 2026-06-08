const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/books
 * Query params: search, genreId, authorId, isDecolonized, tags, page, limit
 */
const listBooks = async (req, res, next) => {
  try {
    const {
      search,
      genreId,
      authorId,
      isDecolonized,
      tags,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (search) {
      where.titulo = { contains: search };
    }

    if (genreId) {
      where.genreId = parseInt(genreId, 10);
    }

    if (authorId) {
      where.authorId = parseInt(authorId, 10);
    }

    if (isDecolonized !== undefined && isDecolonized !== '') {
      where.isDecolonized = isDecolonized === 'true' || isDecolonized === '1';
    }

    if (tags) {
      // tags is a JSON string stored as text; do a substring search
      where.tags = { contains: tags };
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { titulo: 'asc' },
        include: {
          author: { select: { id: true, nome: true } },
          genre: { select: { id: true, nome: true } },
          _count: { select: { exemplares: true } },
        },
      }),
      prisma.book.count({ where }),
    ]);

    // Parse tags JSON for each book
    const booksWithParsedTags = books.map((book) => ({
      ...book,
      tags: book.tags ? JSON.parse(book.tags) : [],
      exemplarCount: book._count.exemplares,
    }));

    return res.json({
      data: booksWithParsedTags,
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
 * GET /api/books/:id
 */
const getBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
        genre: true,
        exemplares: {
          orderBy: { codigo: 'asc' },
        },
        _count: { select: { exemplares: true, reservations: true } },
      },
    });

    if (!book) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    return res.json({
      ...book,
      tags: book.tags ? JSON.parse(book.tags) : [],
      exemplarCount: book._count.exemplares,
      reservationCount: book._count.reservations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/books
 */
const createBook = async (req, res, next) => {
  try {
    const { titulo, isbn, anoPublicacao, isDecolonized, tags, authorId, genreId } = req.body;

    if (!titulo || !authorId || !genreId) {
      return res.status(400).json({ error: 'Título, authorId e genreId são obrigatórios.' });
    }

    // Validate author and genre exist
    const [author, genre] = await Promise.all([
      prisma.author.findUnique({ where: { id: parseInt(authorId, 10) } }),
      prisma.genre.findUnique({ where: { id: parseInt(genreId, 10) } }),
    ]);

    if (!author) return res.status(404).json({ error: 'Autor não encontrado.' });
    if (!genre) return res.status(404).json({ error: 'Gênero não encontrado.' });

    const tagsString = Array.isArray(tags)
      ? JSON.stringify(tags)
      : typeof tags === 'string'
      ? tags
      : null;

    const book = await prisma.book.create({
      data: {
        titulo,
        isbn: isbn || null,
        anoPublicacao: anoPublicacao ? parseInt(anoPublicacao, 10) : null,
        isDecolonized: Boolean(isDecolonized),
        tags: tagsString,
        authorId: parseInt(authorId, 10),
        genreId: parseInt(genreId, 10),
      },
      include: {
        author: { select: { id: true, nome: true } },
        genre: { select: { id: true, nome: true } },
      },
    });

    return res.status(201).json({
      message: 'Livro criado com sucesso.',
      book: { ...book, tags: book.tags ? JSON.parse(book.tags) : [] },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/books/:id
 */
const updateBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { titulo, isbn, anoPublicacao, isDecolonized, tags, authorId, genreId } = req.body;

    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    const tagsString =
      tags !== undefined
        ? Array.isArray(tags)
          ? JSON.stringify(tags)
          : typeof tags === 'string'
          ? tags
          : null
        : existing.tags;

    const book = await prisma.book.update({
      where: { id },
      data: {
        titulo: titulo !== undefined ? titulo : existing.titulo,
        isbn: isbn !== undefined ? isbn : existing.isbn,
        anoPublicacao:
          anoPublicacao !== undefined
            ? parseInt(anoPublicacao, 10)
            : existing.anoPublicacao,
        isDecolonized:
          isDecolonized !== undefined ? Boolean(isDecolonized) : existing.isDecolonized,
        tags: tagsString,
        authorId: authorId !== undefined ? parseInt(authorId, 10) : existing.authorId,
        genreId: genreId !== undefined ? parseInt(genreId, 10) : existing.genreId,
      },
      include: {
        author: { select: { id: true, nome: true } },
        genre: { select: { id: true, nome: true } },
      },
    });

    return res.json({
      message: 'Livro atualizado com sucesso.',
      book: { ...book, tags: book.tags ? JSON.parse(book.tags) : [] },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/books/:id
 */
const deleteBook = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const existing = await prisma.book.findUnique({
      where: { id },
      include: { _count: { select: { exemplares: true } } },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Livro não encontrado.' });
    }

    if (existing._count.exemplares > 0) {
      return res.status(409).json({
        error: 'Não é possível excluir um livro que possui exemplares cadastrados. Remova os exemplares primeiro.',
      });
    }

    await prisma.book.delete({ where: { id } });

    return res.json({ message: 'Livro removido com sucesso.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { listBooks, getBook, createBook, updateBook, deleteBook };
