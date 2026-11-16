// ============================================================================
// RS Bhakti Digital SIMRS - Patient Portal Controller
// Read-only Patient Endpoints strictly scoped to the authenticated user token
// ============================================================================

import type { Response } from 'express';
import { prisma } from '../database/client';
import type { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Helper to resolve the authenticated patient record from JWT session
 */
async function getAuthenticatedPatient(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Akses ditolak. Sesi otentikasi tidak ditemukan.',
    });
    return null;
  }

  if (user.role_id !== 'pasien') {
    res.status(403).json({
      success: false,
      message: 'Akses ditolak. Layanan portal ini khusus untuk pasien.',
    });
    return null;
  }

  // Strictly query by user_id from token - never trust any client parameter
  const patient = await prisma.patient.findFirst({
    where: { user_id: user.id },
  });

  if (!patient) {
    res.status(404).json({
      success: false,
      message: 'Profil rekam medis pasien tidak ditemukan untuk akun ini.',
    });
    return null;
  }

  return patient;
}

export const PatientPortalController = {
  /**
   * GET /api/patient/profile
   * Returns current authenticated patient profile
   */
  getProfile: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const patient = await getAuthenticatedPatient(req, res);
      if (!patient) return;

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Gagal memuat profil pasien.',
        error: err.message,
      });
    }
  },

  /**
   * GET /api/patient/appointments
   * Returns upcoming appointments and queue tickets filtered strictly by patient_id
   */
  getAppointments: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const patient = await getAuthenticatedPatient(req, res);
      if (!patient) return;

      const appointments = await prisma.appointment.findMany({
        where: { patient_id: patient.id },
        include: {
          doctor: {
            select: {
              id: true,
              nama_dokter: true,
              spesialisasi: true,
              sip: true,
              jadwal_praktik: true,
            },
          },
          billing: {
            select: {
              id: true,
              total_biaya: true,
              status_pembayaran: true,
            },
          },
        },
        orderBy: { tanggal_periksa: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Gagal memuat daftar antrean dan janji temu.',
        error: err.message,
      });
    }
  },

  /**
   * GET /api/patient/history
   * Returns clinical records and visit history filtered strictly by patient_id
   */
  getHistory: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const patient = await getAuthenticatedPatient(req, res);
      if (!patient) return;

      const records = await prisma.medicalRecord.findMany({
        where: { patient_id: patient.id },
        include: {
          doctor: {
            select: {
              id: true,
              nama_dokter: true,
              spesialisasi: true,
            },
          },
          appointment: {
            select: {
              id: true,
              nomor_antrean: true,
              tanggal_periksa: true,
              status: true,
            },
          },
          prescriptions: {
            include: {
              details: {
                include: {
                  medicine: {
                    select: {
                      nama_obat: true,
                      kategori: true,
                    },
                  },
                },
              },
            },
          },
          labOrders: {
            select: {
              id: true,
              jenis_pemeriksaan: true,
              hasil_lab: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: records,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Gagal memuat riwayat kunjungan dan rekam medis.',
        error: err.message,
      });
    }
  },

  /**
   * GET /api/patient/bills
   * Returns invoices and billing history filtered strictly by patient_id
   */
  getBills: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const patient = await getAuthenticatedPatient(req, res);
      if (!patient) return;

      const billings = await prisma.billing.findMany({
        where: { patient_id: patient.id },
        include: {
          appointment: {
            include: {
              doctor: {
                select: {
                  nama_dokter: true,
                  spesialisasi: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: billings,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Gagal memuat tagihan dan riwayat pembayaran.',
        error: err.message,
      });
    }
  },

  /**
   * GET /api/patient/dashboard
   * Consolidated patient dashboard payload for high-performance mobile loading
   */
  getDashboard: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const patient = await getAuthenticatedPatient(req, res);
      if (!patient) return;

      const [appointments, history, bills] = await Promise.all([
        prisma.appointment.findMany({
          where: { patient_id: patient.id },
          include: {
            doctor: {
              select: {
                id: true,
                nama_dokter: true,
                spesialisasi: true,
                sip: true,
                jadwal_praktik: true,
              },
            },
          },
          orderBy: { tanggal_periksa: 'desc' },
        }),
        prisma.medicalRecord.findMany({
          where: { patient_id: patient.id },
          include: {
            doctor: {
              select: {
                id: true,
                nama_dokter: true,
                spesialisasi: true,
              },
            },
            prescriptions: {
              include: {
                details: {
                  include: {
                    medicine: {
                      select: {
                        nama_obat: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.billing.findMany({
          where: { patient_id: patient.id },
          include: {
            appointment: {
              include: {
                doctor: {
                  select: {
                    nama_dokter: true,
                    spesialisasi: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      // Active queue ticket: first appointment with status 'menunggu', 'dipanggil', or 'diperiksa'
      const activeQueue = appointments.find(
        (a) => a.status === 'menunggu' || a.status === 'dipanggil' || a.status === 'diperiksa'
      ) || null;

      res.status(200).json({
        success: true,
        data: {
          profile: patient,
          activeQueue,
          appointments,
          history,
          bills,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: 'Gagal memuat ringkasan dashboard pasien.',
        error: err.message,
      });
    }
  },
};
