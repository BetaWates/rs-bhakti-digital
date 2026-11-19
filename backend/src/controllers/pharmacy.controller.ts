// ============================================================================
// RS Bhakti Digital SIMRS - Pharmacy & Inventory Controller
// Prescription Validation, Inventory Stock Deduction, & Expiration Checks
// ============================================================================

import type { Request, Response } from 'express';
import { prisma } from '../database/client';
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

/**
 * Format Prisma Medicine records to match frontend expectations & add calculated warning flags
 */
function formatMedicine(m: any) {
  const expDate = new Date(m.expired_date);
  const now = new Date();
  const monthsToExpiry = (expDate.getFullYear() - now.getFullYear()) * 12 + (expDate.getMonth() - now.getMonth());

  return {
    id: m.id,
    kode_obat: m.kode_obat,
    nama_obat: m.nama_obat,
    kategori: m.kategori,
    category_id: m.category_id !== undefined ? m.category_id : null,
    stok: m.stok,
    harga_satuan: Number(m.harga_satuan),
    expired_date: m.expired_date instanceof Date
      ? m.expired_date.toISOString().split('T')[0]
      : String(m.expired_date).split('T')[0],
    is_active: m.is_active !== undefined ? m.is_active : true,
    deleted_at: m.deleted_at ? (m.deleted_at instanceof Date ? m.deleted_at.toISOString() : String(m.deleted_at)) : null,
    is_low_stock: m.stok <= 50,
    is_expired: expDate < now,
    is_near_expiry: monthsToExpiry <= 6 && expDate >= now,
    months_to_expiry: monthsToExpiry,
    ...(m.createdAt && { createdAt: m.createdAt }),
    ...(m.updatedAt && { updatedAt: m.updatedAt }),
  };
}

/**
 * Generate sequential medicine id adhering to seed data pattern (med-01, med-02, ...)
 */
async function generateMedicineId(): Promise<string> {
  const medicines = await prisma.medicine.findMany({
    select: { id: true },
  });

  let maxNum = 0;
  for (const m of medicines) {
    const match = m.id.match(/^med-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `med-${String(nextNum).padStart(2, '0')}`;
}

export const PharmacyController = {
  /**
   * Get medicines inventory from Prisma with stock status and expiration alert flags.
   * Excludes soft-deleted medicines. Supports optional pagination (?page= and ?limit=).
   * If pagination params are not supplied, returns all rows with { success, total, data } exactly as before.
   */
  getMedicines: async (req: Request, res: Response): Promise<void> => {
    try {
      const { kategori, stock_warning, search } = req.query;

      const conditions: any[] = [
        { deleted_at: null },
      ];

      if (search) {
        const q = String(search).trim();
        if (q) {
          conditions.push({
            OR: [
              { nama_obat: { contains: q, mode: 'insensitive' } },
              { kode_obat: { contains: q, mode: 'insensitive' } },
            ],
          });
        }
      }

      if (kategori) {
        conditions.push({
          kategori: { equals: String(kategori).trim(), mode: 'insensitive' },
        });
      }

      const where = { AND: conditions };

      const isPaginationRequested = req.query.page !== undefined || req.query.limit !== undefined;

      if (isPaginationRequested) {
        let page = parseInt(req.query.page as string, 10);
        if (isNaN(page) || page < 1) {
          page = 1;
        }

        let limit = parseInt(req.query.limit as string, 10);
        if (isNaN(limit) || limit < 1) {
          limit = 20;
        }
        if (limit > 100) {
          limit = 100;
        }

        const total = await prisma.medicine.count({ where });
        const total_pages = total === 0 ? 0 : Math.ceil(total / limit);

        const medicines = await prisma.medicine.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { id: 'asc' },
        });

        const enriched = medicines.map(formatMedicine);

        if (stock_warning === 'true') {
          const warnings = enriched.filter((m) => m.is_low_stock || m.is_near_expiry);
          res.status(200).json({
            success: true,
            total: warnings.length,
            data: warnings,
            pagination: {
              page,
              limit,
              total,
              total_pages,
            },
          });
          return;
        }

        res.status(200).json({
          success: true,
          data: enriched,
          pagination: {
            page,
            limit,
            total,
            total_pages,
          },
        });
        return;
      }

      const medicines = await prisma.medicine.findMany({
        where,
        orderBy: { id: 'asc' },
      });

      const enriched = medicines.map(formatMedicine);

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
   * Get medicine by ID from Prisma.
   * Excludes soft-deleted medicines (404 if deleted or not found).
   */
  getMedicineById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicine = await prisma.medicine.findFirst({
        where: { id, deleted_at: null },
      });

      if (!medicine) {
        res.status(404).json({
          success: false,
          message: 'Data obat tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: formatMedicine(medicine),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Create new medicine in Prisma
   */
  createMedicine: async (req: Request, res: Response): Promise<void> => {
    try {
      const { kode_obat, nama_obat, kategori, category_id, stok, harga_satuan, expired_date } = req.body;

      if (!nama_obat || typeof nama_obat !== 'string' || !nama_obat.trim()) {
        res.status(400).json({
          success: false,
          message: 'Nama obat wajib diisi.',
        });
        return;
      }

      if (!kode_obat || typeof kode_obat !== 'string' || !kode_obat.trim()) {
        res.status(400).json({
          success: false,
          message: 'Kode obat wajib diisi.',
        });
        return;
      }

      let resolvedKategori = (kategori && String(kategori).trim()) || 'Umum';
      let resolvedCategoryId: string | null = null;

      if (category_id !== undefined && category_id !== null) {
        if (typeof category_id !== 'string' || !category_id.trim()) {
          res.status(400).json({
            success: false,
            message: 'category_id harus berupa string yang valid.',
          });
          return;
        }

        const cat = await prisma.category.findFirst({
          where: {
            id: category_id.trim(),
            deleted_at: null,
          },
        });

        if (!cat) {
          res.status(400).json({
            success: false,
            message: 'Kategori dengan category_id yang diberikan tidak valid atau telah dihapus.',
          });
          return;
        }

        resolvedCategoryId = cat.id;
        resolvedKategori = cat.nama_kategori;
      } else if (kategori && typeof kategori === 'string' && kategori.trim()) {
        const cat = await prisma.category.findFirst({
          where: {
            nama_kategori: { equals: kategori.trim(), mode: 'insensitive' },
            deleted_at: null,
          },
        });
        if (cat) {
          resolvedCategoryId = cat.id;
        }
      }

      const parsedStok = Number(stok);
      if (
        stok === undefined ||
        stok === null ||
        typeof stok === 'boolean' ||
        isNaN(parsedStok) ||
        !Number.isInteger(parsedStok) ||
        parsedStok < 0
      ) {
        res.status(400).json({
          success: false,
          message: 'Stok obat harus berupa bilangan bulat lebih besar atau sama dengan 0.',
        });
        return;
      }

      const parsedHarga = Number(harga_satuan);
      if (
        harga_satuan === undefined ||
        harga_satuan === null ||
        typeof harga_satuan === 'boolean' ||
        isNaN(parsedHarga) ||
        parsedHarga < 0
      ) {
        res.status(400).json({
          success: false,
          message: 'Harga satuan harus berupa angka lebih besar atau sama dengan 0.',
        });
        return;
      }

      if (!expired_date || isNaN(new Date(expired_date).getTime())) {
        res.status(400).json({
          success: false,
          message: 'Tanggal kedaluwarsa (expired_date) harus berupa tanggal yang valid.',
        });
        return;
      }

      const trimmedKode = kode_obat.trim();
      const existing = await prisma.medicine.findUnique({
        where: { kode_obat: trimmedKode },
      });

      if (existing) {
        const msg = existing.deleted_at
          ? `Kode obat '${trimmedKode}' sudah digunakan (termasuk pada data yang telah dihapus).`
          : `Obat dengan kode '${trimmedKode}' sudah terdaftar.`;
        res.status(409).json({
          success: false,
          message: msg,
        });
        return;
      }

      const id = await generateMedicineId();

      const newMedicine = await prisma.medicine.create({
        data: {
          id,
          kode_obat: trimmedKode,
          nama_obat: nama_obat.trim(),
          kategori: resolvedKategori,
          category_id: resolvedCategoryId,
          stok: parsedStok,
          harga_satuan: parsedHarga,
          expired_date: new Date(expired_date),
          is_active: req.body.is_active !== undefined ? Boolean(req.body.is_active) : true,
        },
      });

      medicinesStore.push(formatMedicine(newMedicine) as any);

      res.status(201).json({
        success: true,
        message: 'Data obat baru berhasil ditambahkan.',
        data: formatMedicine(newMedicine),
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Kode obat sudah digunakan oleh obat lain.',
        });
        return;
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Update existing medicine in Prisma
   */
  updateMedicine: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { kode_obat, nama_obat, kategori, category_id, stok, harga_satuan, expired_date, is_active } = req.body;

      const existing = await prisma.medicine.findFirst({
        where: { id, deleted_at: null },
      });

      if (!existing) {
        res.status(404).json({
          success: false,
          message: 'Data obat tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      const updateData: any = {};

      if (nama_obat !== undefined) {
        if (!nama_obat || typeof nama_obat !== 'string' || !nama_obat.trim()) {
          res.status(400).json({
            success: false,
            message: 'Nama obat tidak boleh kosong.',
          });
          return;
        }
        updateData.nama_obat = nama_obat.trim();
      }

      if (kode_obat !== undefined) {
        if (!kode_obat || typeof kode_obat !== 'string' || !kode_obat.trim()) {
          res.status(400).json({
            success: false,
            message: 'Kode obat tidak boleh kosong.',
          });
          return;
        }
        const trimmedKode = kode_obat.trim();
        const duplicate = await prisma.medicine.findFirst({
          where: {
            kode_obat: trimmedKode,
            NOT: { id },
          },
        });
        if (duplicate) {
          const msg = duplicate.deleted_at
            ? `Kode obat '${trimmedKode}' sudah digunakan (termasuk pada data yang telah dihapus).`
            : `Obat dengan kode '${trimmedKode}' sudah terdaftar.`;
          res.status(409).json({
            success: false,
            message: msg,
          });
          return;
        }
        updateData.kode_obat = trimmedKode;
      }

      if (category_id !== undefined) {
        if (category_id === null) {
          updateData.category_id = null;
        } else {
          if (typeof category_id !== 'string' || !category_id.trim()) {
            res.status(400).json({
              success: false,
              message: 'category_id harus berupa string yang valid.',
            });
            return;
          }

          const cat = await prisma.category.findFirst({
            where: {
              id: category_id.trim(),
              deleted_at: null,
            },
          });

          if (!cat) {
            res.status(400).json({
              success: false,
              message: 'Kategori dengan category_id yang diberikan tidak valid atau telah dihapus.',
            });
            return;
          }

          updateData.category_id = cat.id;
          updateData.kategori = cat.nama_kategori;
        }
      } else if (kategori !== undefined) {
        const trimmedKategori = String(kategori).trim();
        updateData.kategori = trimmedKategori;
        const cat = await prisma.category.findFirst({
          where: {
            nama_kategori: { equals: trimmedKategori, mode: 'insensitive' },
            deleted_at: null,
          },
        });
        if (cat) {
          updateData.category_id = cat.id;
        }
      }

      if (stok !== undefined) {
        const parsedStok = Number(stok);
        if (typeof stok === 'boolean' || isNaN(parsedStok) || !Number.isInteger(parsedStok) || parsedStok < 0) {
          res.status(400).json({
            success: false,
            message: 'Stok obat harus berupa bilangan bulat lebih besar atau sama dengan 0.',
          });
          return;
        }
        updateData.stok = parsedStok;
      }

      if (harga_satuan !== undefined) {
        const parsedHarga = Number(harga_satuan);
        if (typeof harga_satuan === 'boolean' || isNaN(parsedHarga) || parsedHarga < 0) {
          res.status(400).json({
            success: false,
            message: 'Harga satuan harus berupa angka lebih besar atau sama dengan 0.',
          });
          return;
        }
        updateData.harga_satuan = parsedHarga;
      }

      if (expired_date !== undefined) {
        if (!expired_date || isNaN(new Date(expired_date).getTime())) {
          res.status(400).json({
            success: false,
            message: 'Tanggal kedaluwarsa (expired_date) harus berupa tanggal yang valid.',
          });
          return;
        }
        updateData.expired_date = new Date(expired_date);
      }

      if (is_active !== undefined) {
        if (typeof is_active !== 'boolean') {
          res.status(400).json({
            success: false,
            message: 'Status is_active harus berupa boolean.',
          });
          return;
        }
        updateData.is_active = is_active;
      }

      const updated = await prisma.medicine.update({
        where: { id },
        data: updateData,
      });

      const storeIdx = medicinesStore.findIndex((m) => m.id === id);
      if (storeIdx !== -1) {
        medicinesStore[storeIdx] = {
          ...medicinesStore[storeIdx],
          ...formatMedicine(updated),
        } as any;
      }

      res.status(200).json({
        success: true,
        message: 'Data obat berhasil diperbarui.',
        data: formatMedicine(updated),
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Kode obat sudah digunakan oleh obat lain.',
        });
        return;
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Partial update medicine (PATCH)
   */
  patchMedicine: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { kode_obat, nama_obat, kategori, category_id, stok, harga_satuan, expired_date, is_active } = req.body;

      const existing = await prisma.medicine.findFirst({
        where: { id, deleted_at: null },
      });

      if (!existing) {
        res.status(404).json({
          success: false,
          message: 'Data obat tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      if (
        kode_obat === undefined &&
        nama_obat === undefined &&
        kategori === undefined &&
        category_id === undefined &&
        stok === undefined &&
        harga_satuan === undefined &&
        expired_date === undefined &&
        is_active === undefined
      ) {
        res.status(400).json({
          success: false,
          message: 'Tidak ada data yang dikirim untuk diperbarui.',
        });
        return;
      }

      const updateData: any = {};

      if (nama_obat !== undefined) {
        if (!nama_obat || typeof nama_obat !== 'string' || !nama_obat.trim()) {
          res.status(400).json({
            success: false,
            message: 'Nama obat tidak boleh kosong.',
          });
          return;
        }
        updateData.nama_obat = nama_obat.trim();
      }

      if (kode_obat !== undefined) {
        if (!kode_obat || typeof kode_obat !== 'string' || !kode_obat.trim()) {
          res.status(400).json({
            success: false,
            message: 'Kode obat tidak boleh kosong.',
          });
          return;
        }
        const trimmedKode = kode_obat.trim();
        const duplicate = await prisma.medicine.findFirst({
          where: {
            kode_obat: trimmedKode,
            NOT: { id },
          },
        });
        if (duplicate) {
          const msg = duplicate.deleted_at
            ? `Kode obat '${trimmedKode}' sudah digunakan (termasuk pada data yang telah dihapus).`
            : `Obat dengan kode '${trimmedKode}' sudah terdaftar.`;
          res.status(409).json({
            success: false,
            message: msg,
          });
          return;
        }
        updateData.kode_obat = trimmedKode;
      }

      if (category_id !== undefined) {
        if (category_id === null) {
          updateData.category_id = null;
        } else {
          if (typeof category_id !== 'string' || !category_id.trim()) {
            res.status(400).json({
              success: false,
              message: 'category_id harus berupa string yang valid.',
            });
            return;
          }

          const cat = await prisma.category.findFirst({
            where: {
              id: category_id.trim(),
              deleted_at: null,
            },
          });

          if (!cat) {
            res.status(400).json({
              success: false,
              message: 'Kategori dengan category_id yang diberikan tidak valid atau telah dihapus.',
            });
            return;
          }

          updateData.category_id = cat.id;
          updateData.kategori = cat.nama_kategori;
        }
      } else if (kategori !== undefined) {
        const trimmedKategori = String(kategori).trim();
        updateData.kategori = trimmedKategori;
        const cat = await prisma.category.findFirst({
          where: {
            nama_kategori: { equals: trimmedKategori, mode: 'insensitive' },
            deleted_at: null,
          },
        });
        if (cat) {
          updateData.category_id = cat.id;
        }
      }

      if (stok !== undefined) {
        const parsedStok = Number(stok);
        if (typeof stok === 'boolean' || isNaN(parsedStok) || !Number.isInteger(parsedStok) || parsedStok < 0) {
          res.status(400).json({
            success: false,
            message: 'Stok obat harus berupa bilangan bulat lebih besar atau sama dengan 0.',
          });
          return;
        }
        updateData.stok = parsedStok;
      }

      if (harga_satuan !== undefined) {
        const parsedHarga = Number(harga_satuan);
        if (typeof harga_satuan === 'boolean' || isNaN(parsedHarga) || parsedHarga < 0) {
          res.status(400).json({
            success: false,
            message: 'Harga satuan harus berupa angka lebih besar atau sama dengan 0.',
          });
          return;
        }
        updateData.harga_satuan = parsedHarga;
      }

      if (expired_date !== undefined) {
        if (!expired_date || isNaN(new Date(expired_date).getTime())) {
          res.status(400).json({
            success: false,
            message: 'Tanggal kedaluwarsa (expired_date) harus berupa tanggal yang valid.',
          });
          return;
        }
        updateData.expired_date = new Date(expired_date);
      }

      if (is_active !== undefined) {
        if (typeof is_active !== 'boolean') {
          res.status(400).json({
            success: false,
            message: 'Status is_active harus berupa boolean.',
          });
          return;
        }
        updateData.is_active = is_active;
      }

      const updated = await prisma.medicine.update({
        where: { id },
        data: updateData,
      });

      const storeIdx = medicinesStore.findIndex((m) => m.id === id);
      if (storeIdx !== -1) {
        medicinesStore[storeIdx] = {
          ...medicinesStore[storeIdx],
          ...formatMedicine(updated),
        } as any;
      }

      res.status(200).json({
        success: true,
        message: 'Data obat berhasil diperbarui.',
        data: formatMedicine(updated),
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Kode obat sudah digunakan oleh obat lain.',
        });
        return;
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Delete medicine from Prisma with soft delete and relational constraint checks
   */
  deleteMedicine: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const medicine = await prisma.medicine.findUnique({
        where: { id },
        include: {
          _count: {
            select: { prescriptionDetails: true },
          },
        },
      });

      if (!medicine || medicine.deleted_at !== null) {
        res.status(404).json({
          success: false,
          message: 'Data obat tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      const isReferencedInStore = detailsStore.some((d) => d.medicine_id === id);
      if (medicine._count.prescriptionDetails > 0 || isReferencedInStore) {
        res.status(409).json({
          success: false,
          message: 'Obat tidak dapat dihapus karena masih digunakan pada data resep obat.',
        });
        return;
      }

      const updated = await prisma.medicine.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          is_active: false,
        },
      });

      medicinesStore = medicinesStore.filter((m) => m.id !== id);

      res.status(200).json({
        success: true,
        message: 'Data obat berhasil dihapus dari SIMRS.',
        data: formatMedicine(updated),
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
