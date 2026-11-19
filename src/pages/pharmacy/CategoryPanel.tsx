import { useState, useEffect, useCallback } from 'react';
import type { Category } from '@/lib/types';
import { Icon } from '@/components/shared/Icon';
import { apiFetch } from '@/lib/api';

interface CategoryPanelProps {
  canManage: boolean;
  showToast: (message: string, type?: 'success' | 'error') => void;
  onCategoriesUpdated?: () => void;
}

export function CategoryPanel({ canManage, showToast, onCategoriesUpdated }: CategoryPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'true' | 'false'>('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    kode_kategori: '',
    nama_kategori: '',
    is_active: true,
  });

  // Delete Confirmation State
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch categories with search and pagination
  const fetchCategories = useCallback(async (currentPage: number, search: string, status: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(limit));
      if (search.trim()) {
        params.set('search', search.trim());
      }
      if (status !== 'all') {
        params.set('is_active', status);
      }

      const res = await apiFetch<{
        success: boolean;
        data: Category[];
        pagination: { page: number; limit: number; total: number; total_pages: number };
      }>(`/api/pharmacy/categories?${params.toString()}`);

      if (res && res.success) {
        setCategories(res.data || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Gagal memuat daftar kategori obat dari server.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [limit, showToast]);

  useEffect(() => {
    fetchCategories(page, searchTerm, statusFilter);
  }, [fetchCategories, page, searchTerm, statusFilter]);

  // Open modal in Add mode
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      kode_kategori: '',
      nama_kategori: '',
      is_active: true,
    });
    setShowModal(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (cat: Category) => {
    setIsEditing(true);
    setEditingId(cat.id);
    setFormData({
      kode_kategori: cat.kode_kategori,
      nama_kategori: cat.nama_kategori,
      is_active: cat.is_active,
    });
    setShowModal(true);
  };

  // Submit Add or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kode_kategori.trim()) {
      showToast('Kode kategori wajib diisi!', 'error');
      return;
    }
    if (!formData.nama_kategori.trim()) {
      showToast('Nama kategori wajib diisi!', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        kode_kategori: formData.kode_kategori.trim(),
        nama_kategori: formData.nama_kategori.trim(),
        is_active: formData.is_active,
      };

      if (isEditing && editingId) {
        await apiFetch(`/api/pharmacy/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast(`Kategori "${formData.nama_kategori}" berhasil diperbarui.`);
      } else {
        await apiFetch('/api/pharmacy/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast(`Kategori "${formData.nama_kategori}" berhasil ditambahkan.`);
      }

      setShowModal(false);
      await fetchCategories(page, searchTerm, statusFilter);
      if (onCategoriesUpdated) {
        onCategoriesUpdated();
      }
    } catch (err: any) {
      const msg = err?.message || 'Gagal menyimpan kategori.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete category
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setIsDeleting(true);
      await apiFetch(`/api/pharmacy/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      });
      showToast(`Kategori "${categoryToDelete.nama_kategori}" berhasil dihapus.`);
      setCategoryToDelete(null);
      await fetchCategories(page, searchTerm, statusFilter);
      if (onCategoriesUpdated) {
        onCategoriesUpdated();
      }
    } catch (err: any) {
      const msg = err?.message || 'Gagal menghapus kategori.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const startIndex = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search, Status Filter & Add Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Icon
              name="search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Cari nama atau kode kategori..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="true">Hanya Aktif</option>
            <option value="false">Hanya Non-aktif</option>
          </select>
        </div>

        {canManage && (
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
          >
            <Icon name="plus" size={16} />
            <span>Tambah Kategori</span>
          </button>
        )}
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Icon name="refreshCw" size={20} className="animate-spin text-teal-600" />
            <span>Memuat master data kategori obat...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 text-center shadow-2xs">
          <div className="flex flex-col items-center gap-2">
            <Icon name="alertCircle" size={24} className="text-rose-600" />
            <p className="text-xs font-semibold text-rose-700">{error}</p>
            <button
              type="button"
              onClick={() => fetchCategories(page, searchTerm, statusFilter)}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition"
            >
              <Icon name="refreshCw" size={14} />
              <span>Coba Lagi</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode Kategori</th>
                <th className="px-4 py-3">Nama Kategori</th>
                <th className="px-4 py-3">Status</th>
                {canManage && <th className="px-4 py-3 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={canManage ? 4 : 3}
                    className="px-4 py-12 text-center text-xs text-slate-400"
                  >
                    Tidak ada data kategori yang sesuai dengan pencarian atau filter.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                        {cat.kode_kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800 text-xs">
                        {cat.nama_kategori}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {cat.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10.5px] font-bold text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Non-aktif
                        </span>
                      )}
                    </td>
                    {canManage && (
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(cat)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition"
                            title="Edit Kategori"
                          >
                            <Icon name="edit" size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                            title="Hapus Kategori"
                          >
                            <Icon name="trash" size={13} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 bg-slate-50/50">
            <span className="text-[11px] text-slate-500 font-medium">
              Menampilkan {startIndex} - {endIndex} dari {pagination.total} kategori
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium mr-2">
                Halaman {pagination.page} dari {pagination.total_pages || 1}
              </span>
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                disabled={pagination.page >= pagination.total_pages}
                onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {isEditing ? 'Edit Kategori Obat' : 'Tambah Kategori Obat Baru'}
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kode Kategori *
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  placeholder="Contoh: KAT-ANTIBIOTIK"
                  value={formData.kode_kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kode_kategori: e.target.value.toUpperCase() })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Maksimal 20 karakter, harus unik.
                </span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Contoh: Antibiotik & Antimikroba"
                  value={formData.nama_kategori}
                  onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Maksimal 100 karakter.
                </span>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Status Kategori Aktif
                  </span>
                </label>
                <p className="text-[10px] text-slate-400 mt-0.5 ml-6">
                  Kategori aktif dapat dipilih pada form input formularium obat.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Icon name="refreshCw" size={14} className="animate-spin" />}
                  <span>
                    {isSubmitting
                      ? (isEditing ? 'Menyimpan...' : 'Menambahkan...')
                      : (isEditing ? 'Simpan Perubahan' : 'Simpan Kategori')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Icon name="trash" size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Hapus Kategori Obat
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Apakah Anda yakin ingin menghapus kategori{' '}
                  <span className="font-bold text-slate-800">
                    "{categoryToDelete.nama_kategori}"
                  </span>{' '}
                  ({categoryToDelete.kode_kategori})?
                </p>
                <p className="text-[11px] text-rose-600 bg-rose-50 rounded-lg p-2 mt-2">
                  Perhatian: Kategori tidak dapat dihapus jika masih digunakan oleh obat aktif dalam formularium.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setCategoryToDelete(null)}
                  className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="rounded-lg bg-rose-600 px-5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeleting && <Icon name="refreshCw" size={14} className="animate-spin" />}
                  <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Kategori'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPanel;
