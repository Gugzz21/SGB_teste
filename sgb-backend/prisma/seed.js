const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ─── Clean up ────────────────────────────────────────────────────────────────
  await prisma.fine.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.exemplar.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.author.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ───────────────────────────────────────────────────────────────────
  const hashedAdmin = await bcrypt.hash('123456', 10);
  const hashedLeitor = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      nome: 'Admin Bibliotecário',
      email: 'admin@sgb.com',
      senha: hashedAdmin,
      tipo: 'BIBLIOTECARIO',
      bairro: 'Centro',
      grupoSocial: null,
    },
  });

  const leitor1 = await prisma.user.create({
    data: {
      nome: 'Maria das Dores Silva',
      email: 'maria@leitor.com',
      senha: hashedLeitor,
      tipo: 'LEITOR',
      bairro: 'Liberdade',
      grupoSocial: 'Comunidade Afro-Brasileira',
    },
  });

  const leitor2 = await prisma.user.create({
    data: {
      nome: 'João Karai Tupã',
      email: 'joao@leitor.com',
      senha: hashedLeitor,
      tipo: 'LEITOR',
      bairro: 'Aldeota',
      grupoSocial: 'Comunidade Indígena',
    },
  });

  const leitor3 = await prisma.user.create({
    data: {
      nome: 'Ana Paula Ferreira',
      email: 'ana@leitor.com',
      senha: hashedLeitor,
      tipo: 'LEITOR',
      bairro: 'Benfica',
      grupoSocial: null,
    },
  });

  console.log(`✅ Created ${4} users`);

  // ─── Authors ─────────────────────────────────────────────────────────────────
  const author1 = await prisma.author.create({
    data: {
      nome: 'Conceição Evaristo',
      biografia:
        'Escritora, poetisa e professora afro-brasileira, conhecida por obras que abordam a vivência da mulher negra no Brasil.',
    },
  });

  const author2 = await prisma.author.create({
    data: {
      nome: 'Daniel Munduruku',
      biografia:
        'Escritor indígena brasileiro da etnia Munduruku, autor de mais de 50 livros voltados para a cultura e espiritualidade indígena.',
    },
  });

  const author3 = await prisma.author.create({
    data: {
      nome: 'Lima Barreto',
      biografia:
        'Escritor brasileiro do início do século XX, crítico da sociedade e das desigualdades raciais no Brasil.',
    },
  });

  const author4 = await prisma.author.create({
    data: {
      nome: 'Ailton Krenak',
      biografia:
        'Liderança indígena, escritor e ambientalista brasileiro da etnia Krenak, defensor dos direitos indígenas.',
    },
  });

  const author5 = await prisma.author.create({
    data: {
      nome: 'Carolina Maria de Jesus',
      biografia:
        'Escritora afro-brasileira, autora de "Quarto de Despejo", relato de sua vida na favela do Canindé, São Paulo.',
    },
  });

  console.log(`✅ Created 5 authors`);

  // ─── Genres ──────────────────────────────────────────────────────────────────
  const genre1 = await prisma.genre.create({
    data: { nome: 'Literatura Afro-Brasileira', descricao: 'Obras escritas por autores afro-brasileiros ou com temática afro-brasileira.' },
  });

  const genre2 = await prisma.genre.create({
    data: { nome: 'Literatura Indígena', descricao: 'Obras escritas por autores indígenas ou com temática das culturas originárias.' },
  });

  const genre3 = await prisma.genre.create({
    data: { nome: 'Romance', descricao: 'Narrativas ficcionais de longa extensão.' },
  });

  const genre4 = await prisma.genre.create({
    data: { nome: 'Poesia', descricao: 'Obras em verso, explorando ritmo, rima e expressão emocional.' },
  });

  const genre5 = await prisma.genre.create({
    data: { nome: 'Ensaio', descricao: 'Textos de reflexão e argumentação sobre temas variados.' },
  });

  console.log(`✅ Created 5 genres`);

  // ─── Books ───────────────────────────────────────────────────────────────────
  const book1 = await prisma.book.create({
    data: {
      titulo: 'Ponciá Vicêncio',
      isbn: '978-85-359-0277-1',
      anoPublicacao: 2003,
      isDecolonized: true,
      tags: JSON.stringify(['mulher negra', 'identidade', 'memória', 'resistência']),
      authorId: author1.id,
      genreId: genre1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      titulo: 'Becos da Memória',
      isbn: '978-85-359-0278-8',
      anoPublicacao: 2006,
      isDecolonized: true,
      tags: JSON.stringify(['favela', 'memória', 'resistência', 'mulher negra']),
      authorId: author1.id,
      genreId: genre1.id,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      titulo: 'O Sinal do Pajé',
      isbn: '978-85-260-0901-2',
      anoPublicacao: 2008,
      isDecolonized: true,
      tags: JSON.stringify(['cultura indígena', 'espiritualidade', 'pajé', 'Munduruku']),
      authorId: author2.id,
      genreId: genre2.id,
    },
  });

  const book4 = await prisma.book.create({
    data: {
      titulo: 'Histórias de Índio',
      isbn: '978-85-260-0560-1',
      anoPublicacao: 1996,
      isDecolonized: true,
      tags: JSON.stringify(['cultura indígena', 'tradição', 'ancestralidade']),
      authorId: author2.id,
      genreId: genre2.id,
    },
  });

  const book5 = await prisma.book.create({
    data: {
      titulo: 'Triste Fim de Policarpo Quaresma',
      isbn: '978-85-359-0100-2',
      anoPublicacao: 1915,
      isDecolonized: false,
      tags: JSON.stringify(['crítica social', 'Brasil', 'República', 'identidade nacional']),
      authorId: author3.id,
      genreId: genre3.id,
    },
  });

  const book6 = await prisma.book.create({
    data: {
      titulo: 'Clara dos Anjos',
      isbn: '978-85-359-0101-9',
      anoPublicacao: 1948,
      isDecolonized: false,
      tags: JSON.stringify(['preconceito racial', 'mulher', 'subúrbio carioca']),
      authorId: author3.id,
      genreId: genre3.id,
    },
  });

  const book7 = await prisma.book.create({
    data: {
      titulo: 'Ideias para Adiar o Fim do Mundo',
      isbn: '978-65-5560-140-8',
      anoPublicacao: 2019,
      isDecolonized: true,
      tags: JSON.stringify(['meio ambiente', 'povos indígenas', 'colonialismo', 'futuro']),
      authorId: author4.id,
      genreId: genre5.id,
    },
  });

  const book8 = await prisma.book.create({
    data: {
      titulo: 'A Vida Não É Útil',
      isbn: '978-65-5560-303-7',
      anoPublicacao: 2020,
      isDecolonized: true,
      tags: JSON.stringify(['filosofia indígena', 'vida', 'natureza', 'resistência']),
      authorId: author4.id,
      genreId: genre5.id,
    },
  });

  const book9 = await prisma.book.create({
    data: {
      titulo: 'Quarto de Despejo',
      isbn: '978-85-10-04105-3',
      anoPublicacao: 1960,
      isDecolonized: true,
      tags: JSON.stringify(['diário', 'favela', 'pobreza', 'mulher negra', 'resistência']),
      authorId: author5.id,
      genreId: genre1.id,
    },
  });

  const book10 = await prisma.book.create({
    data: {
      titulo: 'Casa de Alvenaria',
      isbn: '978-85-10-04106-0',
      anoPublicacao: 1961,
      isDecolonized: true,
      tags: JSON.stringify(['diário', 'ascensão social', 'mulher negra']),
      authorId: author5.id,
      genreId: genre1.id,
    },
  });

  console.log(`✅ Created 10 books`);

  // ─── Exemplares ──────────────────────────────────────────────────────────────
  const exemplares = [
    { codigo: 'EX-001', bookId: book1.id, status: 'DISPONIVEL' },
    { codigo: 'EX-002', bookId: book1.id, status: 'DISPONIVEL' },
    { codigo: 'EX-003', bookId: book2.id, status: 'DISPONIVEL' },
    { codigo: 'EX-004', bookId: book3.id, status: 'DISPONIVEL' },
    { codigo: 'EX-005', bookId: book3.id, status: 'DISPONIVEL' },
    { codigo: 'EX-006', bookId: book4.id, status: 'DISPONIVEL' },
    { codigo: 'EX-007', bookId: book5.id, status: 'DISPONIVEL' },
    { codigo: 'EX-008', bookId: book6.id, status: 'DISPONIVEL' },
    { codigo: 'EX-009', bookId: book7.id, status: 'DISPONIVEL' },
    { codigo: 'EX-010', bookId: book7.id, status: 'DISPONIVEL' },
    { codigo: 'EX-011', bookId: book8.id, status: 'DISPONIVEL' },
    { codigo: 'EX-012', bookId: book8.id, status: 'DISPONIVEL' },
    { codigo: 'EX-013', bookId: book9.id, status: 'DISPONIVEL' },
    { codigo: 'EX-014', bookId: book9.id, status: 'DISPONIVEL' },
    { codigo: 'EX-015', bookId: book10.id, status: 'DISPONIVEL' },
  ];

  await prisma.exemplar.createMany({ data: exemplares });

  console.log(`✅ Created 15 exemplares`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
