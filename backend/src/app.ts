import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Import routers
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import templateRoutes from './modules/templates/template.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import * as invoiceRoutesModule from './modules/invoices/invoice.controller';
import clientRoutes from './modules/clients/client.routes';
import pdfRoutes from './modules/pdf/pdf.routes';
import * as pdfRoutesModule from './modules/pdf/pdf.controller';

const app = express();

// 1. Sentry Request Handler (must be first)
if (env.SENTRY_DSN) {
  Sentry.init({ dsn: env.SENTRY_DSN });
  // app.use(Sentry.Handlers.requestHandler());
}

// 2. Security Headers (helmet)
app.use(helmet());

// 3. CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());

      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  })
);

// 4. Body Parsers (Blueprint requirement: json + urlencoded limit 10kb)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 5. Data Sanitization (NoSQL injection prevention - Express 5 compatible in-place sanitizer)
const sanitizeNoSql = (obj: any) => {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeNoSql(obj[key]);
    }
  }
};

app.use((req, _res, next) => {
  if (req.body) sanitizeNoSql(req.body);
  if (req.params) sanitizeNoSql(req.params);
  if (req.query) sanitizeNoSql(req.query);
  next();
});

// 6. Logging (dev only)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 7. Health & Readiness (Bypass rate limits)
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'Inkviz API',
    version: '1.0.0',
    status: 'online',
    health: '/health',
    ready: '/ready',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});
app.get('/ready', (req, res) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    res.status(200).json({ status: 'Ready' });
  } else {
    res.status(503).json({ status: 'Not Ready' });
  }
});

// 8. Global API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } },
});
app.use('/api', apiLimiter);

// 9. API Routes
app.use('/api/v1/auth', authRoutes); // Note: /api/v1/auth has its own stricter limiter defined in auth.routes.ts
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/clients', clientRoutes);

// Public routes
app.get('/api/v1/share/:token', invoiceRoutesModule.getPublicInvoice);
app.get('/api/v1/share/:token/download', pdfRoutesModule.downloadPublicInvoicePdf);

app.use('/api/v1', pdfRoutes); // registers /invoices/:id/download

// 10. Sentry Error Handler (must be before custom error handler)
if (env.SENTRY_DSN) {
  // app.use(Sentry.Handlers.errorHandler());
}

// 11. Central Error Handler (must be last)
app.use(errorHandler);

export default app;
