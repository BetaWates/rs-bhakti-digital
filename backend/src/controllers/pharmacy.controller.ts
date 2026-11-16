// ============================================================================
// RS Bhakti Digital SIMRS - Pharmacy & Inventory Controller
// Prescription Validation, Inventory Stock Deduction, & Expiration Checks
// ============================================================================

import type { Request, Response } from 'express';
import {
  SEED_MEDICINES,
  SEED_PRESCRIPTIONS,
  SEED_PRESCRIPTION_DETAILS,
  SEED_MEDICAL_RECORDS,
  SEED_PATIENTS,
} from '../database/seeders/seed';
import type { MedicineEntity, PrescriptionEntity, PrescriptionDetailEntity } from '../models/types';
import type { AuthRequest } from '../middlewares/auth.middleware';

let medicinesStore: MedicineEntity[] = [...SEED_MEDICINES as any];
let prescriptionsStore: PrescriptionEntity[] = [...SEED_PRESCRIPTIONS as any];
let detailsStore: PrescriptionDetailEntity[] = [...SEED_PRESCRIPTION_DETAILS as any];

export const PharmacyController = {
  /**
   * Get medicines inventory with stock status and expiration alert flags
   */
  getMedicines: async (req: Request, res: Response): Promise<void> => {
    try {
      const { kategori, stock_warning, search } = req.query;

      let list = [...medicinesStore];

      if (search) {
        const q = (search as string).toLowerCase();
        list = list.filter(
          (m) => m.nama_obat.toLowerCase().includes(q) || m.kode_obat.toLowerCase().includes(q)
        );
      }

      if (kategori) {
        list = list.filter((m) => m.kategori.toLowerCase() === (kategori as string).toLowerCase());
      }

      const now = new Date();
      const enriched = list.map((m) => {
        const expDate = new Date(m.expired_date);
        const monthsToExpiry = (expDate.getFullYear() - now.getFullYear()) * 12 + (expDate.getMonth() - now.getMonth());
        return {
          ...m,
          is_low_stock: m.stok <= 50,
          is_expired: expDate < now,
          is_near_expiry: monthsToExpiry <= 6 && expDate >= now,
          months_to_expiry: monthsToExpiry,
        };
      });

      if (stock_warning === 'true') {
        const warnings = enriched.filter((m) => m.is_low_stock || m.is_near_expiry);
        res.status(200).json({ success: true, total: warnings.length, data: warnings });
        return;
      }

      res.status(200).json({
        success: true,
        total: enriched.length,
        data: enriched,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Get all prescriptions with items and patient details
   */
  getPrescriptions: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;

      let list = prescriptionsStore.map((rx) => {
        const medrec = SEED_MEDICAL_RECORDS.find((mr) => mr.id === rx.medical_record_id);
        const patient = SEED_PATIENTS.find((p) => p.id === medrec?.patient_id);
        const items = detailsStore
          .filter((d) => d.prescription_id === rx.id)
          .map((d) => {
            const med = medicinesStore.find((m) => m.id === d.medicine_id);
            return {
              ...d,
              nama_obat: med?.nama_obat || 'Obat',
              kode_obat: med?.kode_obat || '',
              harga_satuan: med?.harga_satuan || 0,
              stok_tersedia: med?.stok || 0,
            };
          });

        return {
          ...rx,
          patient_name: patient?.nama_lengkap || 'Pasien',
          patient_rm: patient?.no_rm || '',
          diagnosa: medrec?.diagnosa || '',
          items,
        };
      });

      if (status) {
        list = list.filter((r) => r.status === status);
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
   * Dispense prescription: validates stock, deducts inventory, and marks completed
   */
  dispensePrescription: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const rx = prescriptionsStore.find((r) => r.id === id);

      if (!rx) {
        res.status(404).json({ success: false, message: 'Resep obat tidak ditemukan.' });
        return;
      }

      if (rx.status === 'selesai') {
        res.status(400).json({ success: false, message: 'Resep ini sudah selesai didispensing sebelumnya.' });
        return;
      }

      // Check items stock availability & expiration
      const items = detailsStore.filter((d) => d.prescription_id === id);
      const stockErrors: string[] = [];

      for (const item of items) {
        const med = medicinesStore.find((m) => m.id === item.medicine_id);
        if (!med) {
          stockErrors.push(`Obat ID ${item.medicine_id} tidak ditemukan.`);
          continue;
        }

        if (new Date(med.expired_date) < new Date()) {
          stockErrors.push(`Obat ${med.nama_obat} sudah kedaluwarsa (${med.expired_date})!`);
          continue;
        }

        if (med.stok < item.jumlah) {
          stockErrors.push(`Stok obat ${med.nama_obat} tidak mencukupi (Tersedia: ${med.stok}, Diminta: ${item.jumlah}).`);
        }
      }

      if (stockErrors.length > 0) {
        res.status(422).json({
          success: false,
          message: 'Validasi stok farmasi gagal.',
          errors: stockErrors,
        });
        return;
      }

      // Perform atomic stock deduction
      for (const item of items) {
        const medIndex = medicinesStore.findIndex((m) => m.id === item.medicine_id);
        if (medIndex !== -1) {
          medicinesStore[medIndex].stok -= item.jumlah;
        }
      }

      // Update prescription status
      rx.status = 'selesai';
      rx.processed_by_staff_id = req.user?.id || 'staff-03';
      rx.updated_at = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Resep berhasil divalidasi dan obat telah dikeluarkan. Stok depo berkurang.',
        data: {
          prescription_id: rx.id,
          status: rx.status,
          dispensed_at: rx.updated_at,
          dispensed_by: req.user?.nama_lengkap || 'Apoteker Jaga',
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
