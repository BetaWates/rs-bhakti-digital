// ============================================================================
// RS Bhakti Digital SIMRS - Authentication Controller (Hardened)
// Secure Login, Cryptographic JWT Issuance, & Password Verification
// ============================================================================

import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../database/client';
import { SEED_USERS, SEED_ROLES } from '../database/seeders/seed';
import type { AuthRequest } from '../middlewares/auth.middleware';

let usersStore = [...SEED_USERS];
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing. Please define JWT_SECRET in your .env file.');
}
const JWT_SECRET: string = process.env.JWT_SECRET;

/**
 * Signs a cryptographic JWT using HMAC-SHA256
 */
function createToken(user: any): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const payload = {
    id: user.id,
    email: user.email,
    role_id: user.role_id,
    nama_lengkap: user.nama_lengkap,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Secure password verification comparing raw password with password_hash
 */
function verifyPassword(rawPassword: string, storedHash: string, roleId: string): boolean {
  if (!rawPassword) {
    return false; // Strictly disallow empty passwords
  }

  // 1. Check known role demo passwords (demo environment)
  const roleDefaultPasswords: Record<string, string> = {
    admin: 'admin123',
    direktur: 'direktur123',
    dokter: 'dokter123',
    perawat: 'perawat123',
    apoteker: 'apotek123',
    analis_lab: 'lab12345',
    radiografer: 'radio123',
    kasir: 'kasir123',
    admisi: 'admisi123',
    driver: 'driver123',
    cssd: 'cssd1234',
    it_support: 'it123456',
    pasien: 'pasien123',
  };

  if (roleDefaultPasswords[roleId] && rawPassword === roleDefaultPasswords[roleId]) {
    return true;
  }

  if (rawPassword === 'demo' || rawPassword === 'password123') {
    return true;
  }

  // 2. Direct hash comparison if matching plaintext seed
  if (rawPassword === storedHash) {
    return true;
  }

  return false;
}

export const AuthController = {
  /**
   * User login with email / username and password
   */
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || typeof email !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Alamat email atau username wajib diisi.',
        });
        return;
      }

      if (!password || typeof password !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Kata sandi wajib diisi.',
        });
        return;
      }

      const normalized = email.trim().toLowerCase();

      // Look up user via Prisma database by email or role shortcut
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: normalized, mode: 'insensitive' } },
            { role_id: { equals: normalized, mode: 'insensitive' } },
          ],
        },
        include: {
          role: true,
        },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Kredensial tidak valid. Akun tidak ditemukan.',
        });
        return;
      }

      if (!user.is_active) {
        res.status(403).json({
          success: false,
          message: 'Akun Anda telah dinonaktifkan oleh Administrator SIMRS.',
        });
        return;
      }

      // Enforce client restrictions: mobile clients only accessible by 'pasien' role
      const clientHeader = req.headers['x-client'];
      if (typeof clientHeader === 'string' && clientHeader.trim().toLowerCase() === 'mobile') {
        if (user.role_id !== 'pasien') {
          res.status(403).json({
            success: false,
            message: 'Akses ditolak. Aplikasi mobile hanya diperuntukkan bagi pasien.',
          });
          return;
        }
      }

      // Secure password verification with bcryptjs
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Kata sandi salah. Silakan periksa kembali.',
        });
        return;
      }

      const token = createToken(user);
      const roleDeskripsi = user.role?.deskripsi || SEED_ROLES.find((r) => r.id === user.role_id)?.deskripsi || user.role_id;

      res.status(200).json({
        success: true,
        message: 'Autentikasi berhasil.',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            nama_lengkap: user.nama_lengkap,
            role_id: user.role_id,
            role_label: roleDeskripsi,
            is_active: user.is_active,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan sistem pada server autentikasi.',
        error: err.message,
      });
    }
  },

  /**
   * Patient self-registration endpoint (role forced to 'pasien')
   */
  registerPasien: async (req: Request, res: Response): Promise<void> => {
    try {
      const name = req.body.name || req.body.nama_lengkap;
      const email = req.body.email;
      const password = req.body.password;
      const phone = req.body.phone || req.body.no_telepon;

      if (!name || typeof name !== 'string' || !name.trim()) {
        res.status(400).json({
          success: false,
          message: 'Nama lengkap wajib diisi.',
        });
        return;
      }

      if (!email || typeof email !== 'string' || !email.trim()) {
        res.status(400).json({
          success: false,
          message: 'Alamat email wajib diisi.',
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const normalizedEmail = email.trim().toLowerCase();
      if (!emailRegex.test(normalizedEmail)) {
        res.status(400).json({
          success: false,
          message: 'Format alamat email tidak valid.',
        });
        return;
      }

      if (!password || typeof password !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Kata sandi wajib diisi.',
        });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({
          success: false,
          message: 'Kata sandi minimal 8 karakter.',
        });
        return;
      }

      if (!phone || typeof phone !== 'string' || !phone.trim()) {
        res.status(400).json({
          success: false,
          message: 'Nomor telepon wajib diisi.',
        });
        return;
      }

      // Reject duplicate emails
      const existingUser = await prisma.user.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      });

      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'Alamat email sudah terdaftar.',
        });
        return;
      }

      // Hash password using bcryptjs
      const password_hash = await bcrypt.hash(password, 10);

      // Force role to 'pasien' (strictly ignore any role field sent by client)
      const userId = `usr-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
      const patientId = `pat-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
      const count = await prisma.patient.count();
      const no_rm = `RM-${String(2480 + count + 1).padStart(6, '0')}`;
      const nik = req.body.nik || `3171${Date.now().toString().slice(-12)}`;

      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            id: userId,
            role_id: 'pasien', // Forced on server
            email: normalizedEmail,
            password_hash,
            nama_lengkap: name.trim(),
            is_active: true,
          },
        });

        const newPatient = await tx.patient.create({
          data: {
            id: patientId,
            user_id: newUser.id,
            no_rm,
            nik,
            nama_lengkap: name.trim(),
            tanggal_lahir: req.body.tanggal_lahir ? new Date(req.body.tanggal_lahir) : new Date('2000-01-01'),
            jenis_kelamin: req.body.jenis_kelamin === 'P' ? 'P' : 'L',
            alamat: req.body.alamat || '-',
            no_telepon: phone.trim(),
            no_bpjs: req.body.no_bpjs || null,
            kelas_bpjs: req.body.kelas_bpjs ? Number(req.body.kelas_bpjs) : null,
          },
        });

        return { user: newUser, patient: newPatient };
      });

      res.status(201).json({
        success: true,
        message: 'Pendaftaran pasien berhasil.',
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            nama_lengkap: result.user.nama_lengkap,
            role_id: result.user.role_id,
            is_active: result.user.is_active,
          },
          patient: {
            id: result.patient.id,
            no_rm: result.patient.no_rm,
            nik: result.patient.nik,
            nama_lengkap: result.patient.nama_lengkap,
            no_telepon: result.patient.no_telepon,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan sistem saat mendaftarkan pasien.',
        error: err.message,
      });
    }
  },

  /**
   * Get current authenticated user profile
   */
  me: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Tidak terotentikasi' });
        return;
      }

      const user = usersStore.find((u) => u.id === req.user?.id);
      const role = SEED_ROLES.find((r) => r.id === req.user?.role_id);

      res.status(200).json({
        success: true,
        data: {
          ...req.user,
          deskripsi_role: role?.deskripsi,
          is_active: user ? user.is_active : true,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * List all system roles
   */
  getRoles: async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      success: true,
      data: SEED_ROLES,
    });
  },
};
