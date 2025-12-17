require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { testConnection, syncDatabase } = require('./utils/database');
const { errorHandler, notFoundHandler } = require('./api/middleware/errorHandler');
const routes = require('./api/routes');

// Initialize workers
require('./workers/rssFeedWorker');
require('./workers/linkConversionWorker');
require('./workers/messageDispatchWorker');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API routes
const apiPrefix = process.env.API_PREFIX || '/api/v1';
app.use(apiPrefix, routes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Affiliate Monitor API',
    version: '1.0.0',
    docs: `${apiPrefix}/health`,
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }

    // Sync database (create tables if they don't exist)
    await syncDatabase({ alter: process.env.NODE_ENV === 'development' });

    // Start schedulers
    const { initializeSchedulers } = require('./schedulers/jobScheduler');
    initializeSchedulers();

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`API endpoint: ${apiPrefix}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;

// Start server if this file is run directly
if (require.main === module) {
  startServer();
}
