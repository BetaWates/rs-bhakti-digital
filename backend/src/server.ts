// ============================================================================
// RS Bhakti Digital SIMRS - Core Express Backend Server
// Enterprise Hospital Information System REST API & Microservice Engine
// ============================================================================

import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded regardless of process working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import { prisma } from './database/client';
import { apiRouter } from './routes/api.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Body Parsers & JSON Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enterprise CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Root Health & System Diagnostic Endpoint
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'UP',
      system: 'RS Bhakti Digital SIMRS Enterprise',
      version: '3.5',
      timestamp: new Date().toISOString(),
      database: {
        driver: 'PostgreSQL (Supabase)',
        schema_tables: 14,
        status: 'connected',
      },
      uptime: process.uptime(),
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'DEGRADED',
      system: 'RS Bhakti Digital SIMRS Enterprise',
      version: '3.5',
      timestamp: new Date().toISOString(),
      database: {
        driver: 'PostgreSQL (Supabase)',
        schema_tables: 14,
        status: 'disconnected',
        error: error.message,
      },
      uptime: process.uptime(),
    });
  }
});

// API Directory & Documentation Endpoint
app.get('/api', (_req, res) => {
  res.status(200).json({
    name: 'RS Bhakti Digital SIMRS API',
    version: 'v1',
    description: 'Enterprise REST API connecting 14 hospital core tables and clinical workflows',
    modules: {
      auth: ['POST /api/v1/auth/login', 'POST /api/v1/auth/register-pasien', 'GET /api/v1/auth/roles', 'GET /api/v1/auth/me'],
      admission: ['GET /api/v1/admission/patients', 'POST /api/v1/admission/patients', 'POST /api/v1/admission/appointments', 'GET /api/v1/admission/queue'],
      emr: ['GET /api/v1/emr/records', 'POST /api/v1/emr/records', 'GET /api/v1/emr/patient/:id/history'],
      pharmacy: ['GET /api/v1/pharmacy/medicines', 'GET /api/v1/pharmacy/prescriptions', 'POST /api/v1/pharmacy/prescriptions/:id/dispense'],
      laboratory: ['GET /api/v1/laboratory/orders', 'POST /api/v1/laboratory/orders', 'POST /api/v1/laboratory/orders/:id/results'],
      billing: ['GET /api/v1/billing/invoices', 'POST /api/v1/billing/invoices/calculate', 'POST /api/v1/billing/invoices/:id/pay'],
      emergency: ['GET /api/v1/emergency/rooms', 'PATCH /api/v1/emergency/rooms/:id/status', 'GET /api/v1/emergency/ambulances', 'POST /api/v1/emergency/ambulances/dispatch'],
    },
  });
});

// Mount Master API Router under /api/v1 and /api
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute '${req.method} ${req.originalUrl}' tidak ditemukan pada server SIMRS.`,
  });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SIMRS Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server SIMRS.',
  });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[RS Bhakti Digital SIMRS API] Server active on port ${PORT}`);
    console.log(`- Health Check: http://localhost:${PORT}/health`);
    console.log(`- API Directory: http://localhost:${PORT}/api`);
  });
}
