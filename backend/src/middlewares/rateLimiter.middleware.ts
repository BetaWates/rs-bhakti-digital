// ============================================================================
// RS Bhakti Digital SIMRS - In-Memory Rate Limiter Middleware
// Rate limiting for sensitive authentication endpoints (Login & Register)
// ============================================================================

import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const hits = new Map<string, RateLimitRecord>();

  // Periodically evict expired records
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, options.windowMs);

  if (timer.unref) {
    timer.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(ip);

    if (!record || now > record.resetTime) {
      hits.set(ip, { count: 1, resetTime: now + options.windowMs });
      next();
      return;
    }

    record.count += 1;
    if (record.count > options.max) {
      res.status(429).json({
        success: false,
        message: options.message || 'Terlalu banyak permintaan. Silakan coba lagi beberapa saat lagi.',
      });
      return;
    }

    next();
  };
}

export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // 30 requests per minute
  message: 'Terlalu banyak percobaan autentikasi. Silakan tunggu sebentar sebelum mencoba lagi.',
});
