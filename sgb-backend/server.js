require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const bookRoutes = require('./src/routes/books.routes');
const authorRoutes = require('./src/routes/authors.routes');
const genreRoutes = require('./src/routes/genres.routes');
const userRoutes = require('./src/routes/users.routes');
const loanRoutes = require('./src/routes/loans.routes');
const reservationRoutes = require('./src/routes/reservations.routes');
const fineRoutes = require('./src/routes/fines.routes');
const reportRoutes = require('./src/routes/reports.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SGB API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/reports', reportRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 SGB API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
