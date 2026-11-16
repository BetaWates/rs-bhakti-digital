// ============================================================================
// RS Bhakti Digital SIMRS - Clinical Laboratory Controller
// Test Order Tracking, Result Entry, & Pathology Reports
// ============================================================================

import type { Request, Response } from 'express';
import {
  SEED_LAB_ORDERS,
  SEED_MEDICAL_RECORDS,
  SEED_PATIENTS,
  SEED_DOCTORS,
} from '../database/seeders/seed';
import type { LabOrderEntity } from '../models/types';
import type { AuthRequest } from '../middlewares/auth.middleware';

let labOrdersStore: LabOrderEntity[] = [...SEED_LAB_ORDERS as any];

export const LaboratoryController = {
  /**
   * Get all laboratory test orders
   */
  getOrders: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;

      let list = labOrdersStore.map((lo) => {
        const medrec = SEED_MEDICAL_RECORDS.find((mr) => mr.id === lo.medical_record_id);
        const patient = SEED_PATIENTS.find((p) => p.id === medrec?.patient_id);
        const doctor = SEED_DOCTORS.find((d) => d.id === medrec?.doctor_id);

        return {
          ...lo,
          patient_name: patient?.nama_lengkap || 'Pasien',
          patient_rm: patient?.no_rm || '',
          doctor_name: doctor?.nama_dokter || 'Dokter Pengirim',
          diagnosa: medrec?.diagnosa || '',
        };
      });

      if (status) {
        list = list.filter((o) => o.status === status);
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
   * Submit laboratory test results and finalize order
   */
  submitResult: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { hasil_lab, status } = req.body;

      const order = labOrdersStore.find((o) => o.id === id);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order laboratorium tidak ditemukan.' });
        return;
      }

      if (!hasil_lab) {
        res.status(400).json({ success: false, message: 'Hasil pemeriksaan laboratorium wajib diisi.' });
        return;
      }

      order.hasil_lab = hasil_lab;
      order.status = (status || 'selesai') as 'pending' | 'diproses' | 'selesai';
      order.processed_by_staff_id = req.user?.id || 'staff-04';
      order.updated_at = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Hasil pemeriksaan laboratorium berhasil disimpan dan diverifikasi.',
        data: order,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Create lab test order from EMR
   */
  createOrder: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { medical_record_id, jenis_pemeriksaan } = req.body;

      if (!medical_record_id || !jenis_pemeriksaan) {
        res.status(400).json({
          success: false,
          message: 'Medical Record ID dan Jenis Pemeriksaan wajib diisi.',
        });
        return;
      }

      const newId = `lab-${String(labOrdersStore.length + 1).padStart(2, '0')}`;
      const newOrder: LabOrderEntity = {
        id: newId,
        medical_record_id,
        processed_by_staff_id: null,
        jenis_pemeriksaan,
        hasil_lab: null,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      labOrdersStore.push(newOrder);

      res.status(201).json({
        success: true,
        message: 'Permintaan uji laboratorium berhasil dibuat.',
        data: newOrder,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
