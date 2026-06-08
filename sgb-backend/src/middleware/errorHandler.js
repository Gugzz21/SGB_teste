/**
 * Global Express error handler.
 * Returns a consistent JSON error response for all unhandled errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Prisma known errors
  if (err.code === 'P2002') {
    const field = err.meta?.target ? err.meta.target.join(', ') : 'campo';
    return res.status(409).json({
      error: `Conflito: o valor para "${field}" já está em uso.`,
      code: err.code,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro não encontrado.',
      code: err.code,
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      error: 'Violação de chave estrangeira. Registro relacionado não existe.',
      code: err.code,
    });
  }

  // Validation / business logic errors forwarded with status
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado.' });
  }

  // Default: 500 Internal Server Error
  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor.'
      : err.message || 'Erro interno do servidor.';

  res.status(status).json({ error: message });
};

module.exports = errorHandler;
