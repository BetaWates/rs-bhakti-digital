// ============================================================================
// RS Bhakti Digital SIMRS - Authentication Middleware (Hardened)
// Cryptographic JWT Signature Verification & Token Validation (HMAC-SHA256)
// ============================================================================

import type { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role_id: string;
  nama_lengkap: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing. Please define JWT_SECRET in your .env file.');
}
const JWT_SECRET: string = process.env.JWT_SECRET;

/**
 * Validates JWT cryptographic signature and expiration
 */
export function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Verify HMAC-SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signatureB64);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return null;
    }

    // Decode and parse payload
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    // Check Token Expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role_id: payload.role_id,
      nama_lengkap: payload.nama_lengkap,
    };
  } catch (err) {
    return null;
  }
}

export function authenticateJwt(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Token otorisasi tidak ditemukan.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);

  if (!user) {
    res.status(403).json({
      success: false,
      message: 'Token otorisasi tidak valid, rusak, atau telah kedaluwarsa.',
    });
    return;
  }

  req.user = user;
  next();
}
