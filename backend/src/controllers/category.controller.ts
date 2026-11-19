// ============================================================================
// RS Bhakti Digital SIMRS - Pharmacy Category Master Controller
// Full CRUD Operations, Soft Deletion, and Relational Guardrails
// ============================================================================

import type { Request, Response } from 'express';
import { prisma } from '../database/client';

/**
 * Generate sequential category id adhering to seed data pattern (cat-01, cat-02, ...)
 */
async function generateCategoryId(): Promise<string> {
  const categories = await prisma.category.findMany({
    select: { id: true },
  });

  let maxNum = 0;
  for (const c of categories) {
    const match = c.id.match(/^cat-(\d+)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `cat-${String(nextNum).padStart(2, '0')}`;
}

export const CategoryController = {
  /**
   * GET list categories: supports pagination, search, is_active filter.
   * Excludes soft-deleted records (deleted_at is not null).
   */
  getCategories: async (req: Request, res: Response): Promise<void> => {
    try {
      const { search, is_active } = req.query;

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

      const conditions: any[] = [
        { deleted_at: null },
      ];

      if (search) {
        const q = String(search).trim();
        if (q) {
          conditions.push({
            OR: [
              { kode_kategori: { contains: q, mode: 'insensitive' } },
              { nama_kategori: { contains: q, mode: 'insensitive' } },
            ],
          });
        }
      }

      if (is_active !== undefined && is_active !== '') {
        const activeStr = String(is_active).trim().toLowerCase();
        if (activeStr === 'true' || activeStr === '1') {
          conditions.push({ is_active: true });
        } else if (activeStr === 'false' || activeStr === '0') {
          conditions.push({ is_active: false });
        }
      }

      const where = { AND: conditions };

      const total = await prisma.category.count({ where });
      const total_pages = total === 0 ? 0 : Math.ceil(total / limit);

      const skip = (page - 1) * limit;
      const data = await prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      });

      res.status(200).json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          total_pages,
        },
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
      });
    }
  },

  /**
   * GET single category by ID.
   * Returns 404 if not found or soft-deleted.
   */
  getCategoryById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const category = await prisma.category.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Data kategori tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
      });
    }
  },

  /**
   * POST create new category.
   * Validates required fields, lengths, uniqueness including soft-deleted rows.
   */
  createCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { kode_kategori, nama_kategori, is_active } = req.body;

      if (!kode_kategori || typeof kode_kategori !== 'string' || !kode_kategori.trim()) {
        res.status(400).json({
          success: false,
          message: 'Kode kategori wajib diisi.',
        });
        return;
      }

      const trimmedKode = kode_kategori.trim();
      if (trimmedKode.length > 20) {
        res.status(400).json({
          success: false,
          message: 'Kode kategori tidak boleh melebihi 20 karakter.',
        });
        return;
      }

      if (!nama_kategori || typeof nama_kategori !== 'string' || !nama_kategori.trim()) {
        res.status(400).json({
          success: false,
          message: 'Nama kategori wajib diisi.',
        });
        return;
      }

      const trimmedNama = nama_kategori.trim();
      if (trimmedNama.length > 100) {
        res.status(400).json({
          success: false,
          message: 'Nama kategori tidak boleh melebihi 100 karakter.',
        });
        return;
      }

      if (is_active !== undefined && typeof is_active !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'Status is_active harus berupa boolean.',
        });
        return;
      }

      // Check unique kode_kategori, also counting soft-deleted rows
      const existing = await prisma.category.findUnique({
        where: { kode_kategori: trimmedKode },
      });

      if (existing) {
        const msg = existing.deleted_at
          ? `Kode kategori '${trimmedKode}' sudah digunakan (termasuk pada data yang telah dihapus).`
          : `Kode kategori '${trimmedKode}' sudah terdaftar.`;
        res.status(409).json({
          success: false,
          message: msg,
        });
        return;
      }

      const id = await generateCategoryId();

      const newCategory = await prisma.category.create({
        data: {
          id,
          kode_kategori: trimmedKode,
          nama_kategori: trimmedNama,
          is_active: is_active !== undefined ? Boolean(is_active) : true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Data kategori baru berhasil ditambahkan.',
        data: newCategory,
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Kode kategori sudah digunakan.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
      });
    }
  },

  /**
   * PUT full update category.
   * Requires kode_kategori and nama_kategori.
   */
  updateCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { kode_kategori, nama_kategori, is_active } = req.body;

      const existing = await prisma.category.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!existing) {
        res.status(404).json({
          success: false,
          message: 'Data kategori tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      if (!kode_kategori || typeof kode_kategori !== 'string' || !kode_kategori.trim()) {
        res.status(400).json({
          success: false,
          message: 'Kode kategori wajib diisi.',
        });
        return;
      }

      const trimmedKode = kode_kategori.trim();
      if (trimmedKode.length > 20) {
        res.status(400).json({
          success: false,
          message: 'Kode kategori tidak boleh melebihi 20 karakter.',
        });
        return;
      }

      if (!nama_kategori || typeof nama_kategori !== 'string' || !nama_kategori.trim()) {
        res.status(400).json({
          success: false,
          message: 'Nama kategori wajib diisi.',
        });
        return;
      }

      const trimmedNama = nama_kategori.trim();
      if (trimmedNama.length > 100) {
        res.status(400).json({
          success: false,
          message: 'Nama kategori tidak boleh melebihi 100 karakter.',
        });
        return;
      }

      if (is_active !== undefined && typeof is_active !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'Status is_active harus berupa boolean.',
        });
        return;
      }

      if (trimmedKode !== existing.kode_kategori) {
        const duplicate = await prisma.category.findFirst({
          where: {
            kode_kategori: trimmedKode,
            NOT: { id },
          },
        });

        if (duplicate) {
          const msg = duplicate.deleted_at
            ? `Kode kategori '${trimmedKode}' sudah digunakan (termasuk pada data yang telah dihapus).`
            : `Kode kategori '${trimmedKode}' sudah terdaftar.`;
          res.status(409).json({
            success: false,
            message: msg,
          });
          return;
        }
      }

      const updated = await prisma.category.update({
        where: { id },
        data: {
          kode_kategori: trimmedKode,
          nama_kategori: trimmedNama,
          is_active: is_active !== undefined ? Boolean(is_active) : existing.is_active,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Data kategori berhasil diperbarui.',
        data: updated,
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Kode kategori sudah digunakan.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
      });
    }
  },

  /**
   * PATCH partial update category.
   */
  patchCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { kode_kategori, nama_kategori, is_active } = req.body;

      const existing = await prisma.category.findFirst({
        where: {
          id,
          deleted_at: null,
        },
      });

      if (!existing) {
        res.status(404).json({
          success: false,
          message: 'Data kategori tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      if (kode_kategori === undefined && nama_kategori === undefined && is_active === undefined) {
        res.status(400).json({
          success: false,
          message: 'Tidak ada data yang dikirim untuk diperbarui.',
        });
        return;
      }

      const updateData: any = {};

      if (kode_kategori !== undefined) {
        if (!kode_kategori || typeof kode_kategori !== 'string' || !kode_kategori.trim()) {
          res.status(400).json({
            success: false,
            message: 'Kode kategori tidak boleh kosong.',
          });
          return;
        }

        const trimmedKode = kode_kategori.trim();
        if (trimmedKode.length > 20) {
          res.status(400).json({
            success: false,
            message: 'Kode kategori tidak boleh melebihi 20 karakter.',
          });
          return;
        }

        if (trimmedKode !== existing.kode_kategori) {
          const duplicate = await prisma.category.findFirst({
            where: {
              kode_kategori: trimmedKode,
              NOT: { id },
            },
          });

          if (duplicate) {
            const msg = duplicate.deleted_at
              ? `Kode kategori '${trimmedKode}' sudah digunakan (termasuk pada data yang telah dihapus).`
              : `Kode kategori '${trimmedKode}' sudah terdaftar.`;
            res.status(409).json({
              success: false,
              message: msg,
            });
            return;
          }
        }

        updateData.kode_kategori = trimmedKode;
      }

      if (nama_kategori !== undefined) {
        if (!nama_kategori || typeof nama_kategori !== 'string' || !nama_kategori.trim()) {
          res.status(400).json({
            success: false,
            message: 'Nama kategori tidak boleh kosong.',
          });
          return;
        }

        const trimmedNama = nama_kategori.trim();
        if (trimmedNama.length > 100) {
          res.status(400).json({
            success: false,
            message: 'Nama kategori tidak boleh melebihi 100 karakter.',
          });
          return;
        }

        updateData.nama_kategori = trimmedNama;
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

      const updated = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json({
        success: true,
        message: 'Data kategori berhasil diperbarui.',
        data: updated,
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        res.status(409).json({
          success: false,
          message: 'Kode kategori sudah digunakan.',
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
      });
    }
  },

  /**
   * DELETE soft delete category:
   * Sets deleted_at = new Date() and is_active = false.
   * Returns 409 if active medicines still use this category.
   * Returns 404 if not found or already deleted.
   */
  deleteCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category || category.deleted_at !== null) {
        res.status(404).json({
          success: false,
          message: 'Data kategori tidak ditemukan atau telah dihapus.',
        });
        return;
      }

      // Check if active medicines still use this category (using category_id relation)
      const medicineCount = await prisma.medicine.count({
        where: {
          category_id: category.id,
        },
      });

      if (medicineCount > 0) {
        res.status(409).json({
          success: false,
          message: `Kategori '${category.nama_kategori}' tidak dapat dihapus karena masih digunakan oleh ${medicineCount} obat aktif.`,
        });
        return;
      }

      const deleted = await prisma.category.update({
        where: { id },
        data: {
          deleted_at: new Date(),
          is_active: false,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Data kategori berhasil dihapus.',
        data: deleted,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
      });
    }
  },
};
