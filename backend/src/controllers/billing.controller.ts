// ============================================================================
// RS Bhakti Digital SIMRS - Billing & Cashier Controller
// Consolidated Invoicing, BPJS Claim Coverage Adjustment, & Payment Execution
// ============================================================================

import type { Request, Response } from 'express';
import {
  SEED_BILLINGS,
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  SEED_DOCTORS,
} from '../database/seeders/seed';
import type { BillingEntity } from '../models/types';
import type { AuthRequest } from '../middlewares/auth.middleware';

let billingsStore: BillingEntity[] = [...SEED_BILLINGS as any];

export const BillingController = {
  /**
   * Get all billings with patient and appointment metadata
   */
  getBillings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;

      let list = billingsStore.map((b) => {
        const patient = SEED_PATIENTS.find((p) => p.id === b.patient_id);
        const apt = SEED_APPOINTMENTS.find((a) => a.id === b.appointment_id);
        const doc = SEED_DOCTORS.find((d) => d.id === apt?.doctor_id);

        return {
          ...b,
          patient_name: patient?.nama_lengkap || 'Pasien',
          patient_rm: patient?.no_rm || '',
          no_bpjs: patient?.no_bpjs || null,
          jenis_pembayaran: apt?.jenis_pembayaran || 'umum',
          doctor_name: doc?.nama_dokter || 'Dokter',
        };
      });

      if (status) {
        list = list.filter((b) => b.status_pembayaran === status);
      }

      res.status(200).json({
        success: true,
        total: list.length,
        data: list,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Process payment for a billing record (Cash, QRIS, Transfer, or BPJS Claim)
   */
  processPayment: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { payment_method, nominal_bayar } = req.body;

      const billing = billingsStore.find((b) => b.id === id);
      if (!billing) {
        res.status(404).json({ success: false, message: 'Faktur tagihan tidak ditemukan.' });
        return;
      }

      if (billing.status_pembayaran === 'dibayar' || billing.status_pembayaran === 'klaim_bpjs') {
        res.status(400).json({
          success: false,
          message: 'Tagihan ini sudah lunas atau telah diajukan klaim BPJS sebelumnya.',
        });
        return;
      }

      // If BPJS covers 100% of the bill
      if (billing.sisa_bayar_pasien === 0 && billing.cover_bpjs > 0) {
        billing.status_pembayaran = 'klaim_bpjs';
      } else {
        billing.status_pembayaran = 'dibayar';
      }

      billing.cashier_staff_id = req.user?.id || 'staff-06';
      billing.updated_at = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: `Pembayaran faktur ${billing.id} berhasil diproses. Kuitansi resmi diterbitkan.`,
        data: {
          ...billing,
          payment_method: payment_method || 'QRIS Dinamis',
          nominal_diterima: nominal_bayar || billing.sisa_bayar_pasien,
          kasir: req.user?.nama_lengkap || 'Kasir Loket 1',
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Recalculate consolidated billing for an appointment
   */
  calculateBilling: async (req: Request, res: Response): Promise<void> => {
    try {
      const { appointment_id } = req.body;
      const apt = SEED_APPOINTMENTS.find((a) => a.id === appointment_id);

      if (!apt) {
        res.status(404).json({ success: false, message: 'Janji temu / appointment tidak ditemukan.' });
        return;
      }

      const patient = SEED_PATIENTS.find((p) => p.id === apt.patient_id);
      const isBpjs = apt.jenis_pembayaran === 'bpjs' && !!patient?.no_bpjs;

      // Base hospital charges
      const jasaKonsultasi = 150000;
      const tindakanMedis = 120000;
      const obatDepo = 185000;
      const totalBiaya = jasaKonsultasi + tindakanMedis + obatDepo;

      const coverBpjs = isBpjs ? totalBiaya : 0;
      const sisaBayar = totalBiaya - coverBpjs;

      const newId = `bil-${String(billingsStore.length + 1).padStart(2, '0')}`;
      const newBilling: BillingEntity = {
        id: newId,
        patient_id: apt.patient_id,
        appointment_id: apt.id,
        cashier_staff_id: null,
        total_biaya: totalBiaya,
        cover_bpjs: coverBpjs,
        sisa_bayar_pasien: sisaBayar,
        status_pembayaran: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      billingsStore.push(newBilling);

      res.status(201).json({
        success: true,
        message: 'Kalkulasi tagihan billing terpadu selesai.',
        data: {
          ...newBilling,
          rincian: {
            jasa_konsultasi: jasaKonsultasi,
            tindakan_medis: tindakanMedis,
            biaya_obat: obatDepo,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
