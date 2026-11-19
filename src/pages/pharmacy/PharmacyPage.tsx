import { useState, useEffect, useCallback } from 'react';
import type { Medicine, Prescription, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { CategoryPanel } from './CategoryPanel';

const initialPrescriptions: Prescription[] = [
  {
    id: 'RX-2506-001',
    prescriptionNumber: 'RSP/20250616/001',
    appointmentId: 'APT-1001',
    patientId: 'RM-002481',
    patientName: 'Siti Nurhaliza',
    doctorName: 'dr. Andi Pratama, Sp.JP',
    date: '2025-06-16 09:00 WIB',
    status: 'Menunggu',
    items: [
      {
        medicineId: 'MED-003',
        medicineName: 'Amlodipine Besilate 5 mg',
        dosage: '1 tablet (5 mg)',
        frequency: '1x1 sehari pagi',
        quantity: 30,
        instructions: 'Diminum sesudah makan pagi',
      },
      {
        medicineId: 'MED-007',
        medicineName: 'Atorvastatin Calcium 20 mg',
        dosage: '1 tablet (20 mg)',
        frequency: '1x1 sehari malam',
        quantity: 30,
        instructions: 'Diminum malam hari sebelum tidur',
      },
    ],
    notes: 'Pasien mengeluh dada terasa berat. Kontrol 1 bulan.',
  },
  {
    id: 'RX-2506-002',
    prescriptionNumber: 'RSP/20250616/002',
    appointmentId: 'APT-1002',
    patientId: 'RM-002482',
    patientName: 'Budi Santoso',
    doctorName: 'dr. Maya Sari',
    date: '2025-06-16 09:15 WIB',
    status: 'Diproses',
    items: [
      {
        medicineId: 'MED-001',
        medicineName: 'Paracetamol 500 mg',
        dosage: '1 tablet (500 mg)',
        frequency: '3x1 sehari',
        quantity: 15,
        instructions: 'Bila demam atau nyeri kepala',
      },
      {
        medicineId: 'MED-004',
        medicineName: 'Metformin HCl 500 mg',
        dosage: '1 tablet (500 mg)',
        frequency: '2x1 sehari',
        quantity: 60,
        instructions: 'Bersama atau sesudah makan',
      },
    ],
    notes: 'Periksa GDP rutin.',
  },
  {
    id: 'RX-2506-003',
    prescriptionNumber: 'RSP/20250616/003',
    appointmentId: 'APT-1003',
    patientId: 'RM-002483',
    patientName: 'Dewi Lestari',
    doctorName: 'dr. Rina Wijaya, Sp.OG',
    date: '2025-06-16 09:30 WIB',
    status: 'Siap',
    items: [
      {
        medicineId: 'MED-006',
        medicineName: 'Asam Folat 400 mcg',
        dosage: '1 tablet',
        frequency: '1x1 sehari',
        quantity: 30,
        instructions: 'Suplemen trimester pertama',
      },
    ],
  },
  {
    id: 'RX-2506-004',
    prescriptionNumber: 'RSP/20250616/004',
    appointmentId: 'APT-1004',
    patientId: 'RM-002484',
    patientName: 'Ahmad Fauzi',
    doctorName: 'dr. Rizky Putra, Sp.OT',
    date: '2025-06-16 09:45 WIB',
    status: 'Diserahkan',
    items: [
      {
        medicineId: 'MED-005',
        medicineName: 'Ketorolac Tromethamine 10 mg',
        dosage: '1 tablet (10 mg)',
        frequency: '2x1 sehari',
        quantity: 10,
        instructions: 'Sesudah makan, maksimal 5 hari',
      },
    ],
  },
];

export function PharmacyPage() {
  const { currentRole, user } = useAuth();
  const role = ((currentRole || user?.role_id || user?.role || '') as string).toLowerCase();
  const canManageMedicines = role === 'admin' || role === 'apoteker';

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [medsError, setMedsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resep' | 'stok' | 'kategori'>('resep');

  // Categories list for dropdown and filter
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [rxStatusFilter, setRxStatusFilter] = useState('Semua Status');

  // Medicine Pagination State
  const [medPage, setMedPage] = useState(1);
  const medLimit = 10;
  const [medPagination, setMedPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 1,
  });

  // Selected Prescription for Dispensing
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  // Add / Edit Medicine Modal State
  const [showMedicineModal, setShowMedicineModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medForm, setMedForm] = useState({
    code: '',
    name: '',
    categoryId: '',
    category: '',
    dosage: '',
    unit: 'Strip (10 Tablet)',
    stock: 50,
    minStock: 20,
    price: 15000,
    expiryDate: '2027-12-31',
  });

  // Delete Medicine Confirmation State
  const [medicineToDelete, setMedicineToDelete] = useState<Medicine | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch active categories for dropdown & filter
  const fetchCategoriesList = useCallback(async () => {
    try {
      const res = await apiFetch<{
        success: boolean;
        data: Category[];
      }>('/api/pharmacy/categories?limit=100&is_active=true');
      if (res && Array.isArray(res.data)) {
        setCategoriesList(res.data);
      }
    } catch {
      // Non-blocking fallback
    }
  }, []);

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  // Load medicines from backend API with pagination
  const fetchMedicines = useCallback(
    async (pageToFetch = medPage, searchVal = searchTerm, catVal = categoryFilter) => {
      try {
        setLoadingMeds(true);
        setMedsError(null);

        const params = new URLSearchParams();
        params.set('page', String(pageToFetch));
        params.set('limit', String(medLimit));

        if (searchVal.trim() && activeTab === 'stok') {
          params.set('search', searchVal.trim());
        }
        if (catVal !== 'Semua Kategori' && activeTab === 'stok') {
          params.set('kategori', catVal);
        }

        const res = await apiFetch<{
          success: boolean;
          data: any[];
          pagination?: { page: number; limit: number; total: number; total_pages: number };
        }>(`/api/pharmacy/medicines?${params.toString()}`);

        if (res && Array.isArray(res.data)) {
          const mapped: Medicine[] = res.data.map((item) => ({
            id: item.id,
            kode_obat: item.kode_obat,
            nama_obat: item.nama_obat,
            kategori: item.kategori,
            category_id: item.category_id,
            stok: Number(item.stok ?? 0),
            harga_satuan: Number(item.harga_satuan ?? 0),
            expired_date: item.expired_date,
            // UI compatibility aliases
            name: item.nama_obat,
            category: item.kategori,
            stock: Number(item.stok ?? 0),
            minStock: item.minStock ?? 20,
            price: Number(item.harga_satuan ?? 0),
            expiryDate: item.expired_date,
            dosage: item.dosage || 'Tablet',
            unit: item.unit || 'Strip',
          }));
          setMedicines(mapped);
          if (res.pagination) {
            setMedPagination(res.pagination);
          }
        }
      } catch (err: any) {
        const msg = err?.message || 'Gagal memuat katalog obat dari server SIMRS.';
        setMedsError(msg);
        showToast(msg, 'error');
      } finally {
        setLoadingMeds(false);
      }
    },
    [medPage, medLimit, searchTerm, categoryFilter, activeTab]
  );

  useEffect(() => {
    fetchMedicines(medPage, searchTerm, categoryFilter);
  }, [fetchMedicines, medPage, searchTerm, categoryFilter]);

  // Dispense workflow action
  const handleUpdateRxStatus = (rxId: string, nextStatus: Prescription['status']) => {
    setPrescriptions((prev) =>
      prev.map((r) => (r.id === rxId ? { ...r, status: nextStatus } : r))
    );
    if (selectedRx && selectedRx.id === rxId) {
      setSelectedRx((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    showToast(`Status resep berhasil diperbarui menjadi "${nextStatus}"`);
  };

  // Open modal in Add mode
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    const defaultCat = categoriesList.length > 0 ? categoriesList[0] : null;
    setMedForm({
      code: '',
      name: '',
      categoryId: defaultCat ? defaultCat.id : '',
      category: defaultCat ? defaultCat.nama_kategori : '',
      dosage: '',
      unit: 'Strip (10 Tablet)',
      stock: 50,
      minStock: 20,
      price: 15000,
      expiryDate: '2027-12-31',
    });
    setShowMedicineModal(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (med: Medicine) => {
    setIsEditing(true);
    setEditingId(med.id);
    let matchedCatId = med.category_id || '';
    if (!matchedCatId && med.kategori) {
      const found = categoriesList.find(
        (c) => c.nama_kategori.toLowerCase() === (med.kategori || '').toLowerCase()
      );
      if (found) matchedCatId = found.id;
    }
    setMedForm({
      code: med.kode_obat || med.id || '',
      name: med.nama_obat || med.name || '',
      categoryId: matchedCatId,
      category: med.kategori || med.category || '',
      dosage: med.dosage || 'Tablet',
      unit: med.unit || 'Strip (10 Tablet)',
      stock: med.stok ?? med.stock ?? 0,
      minStock: med.minStock ?? 20,
      price: med.harga_satuan ?? med.price ?? 0,
      expiryDate: med.expired_date || med.expiryDate || new Date().toISOString().split('T')[0],
    });
    setShowMedicineModal(true);
  };

  // Submit Add or Edit
  const handleSaveMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medForm.name.trim()) {
      showToast('Nama obat wajib diisi!', 'error');
      return;
    }
    if (!medForm.code.trim()) {
      showToast('Kode obat wajib diisi!', 'error');
      return;
    }
    if (!medForm.expiryDate) {
      showToast('Tanggal kadaluarsa wajib diisi!', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: any = {
        kode_obat: medForm.code.trim(),
        nama_obat: medForm.name.trim(),
        stok: Number(medForm.stock),
        harga_satuan: Number(medForm.price),
        expired_date: medForm.expiryDate,
      };

      if (medForm.categoryId) {
        payload.category_id = medForm.categoryId;
      }
      if (medForm.category) {
        payload.kategori = medForm.category;
      }

      if (isEditing && editingId) {
        await apiFetch(`/api/pharmacy/medicines/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast(`Data obat "${medForm.name}" berhasil diperbarui.`);
      } else {
        await apiFetch('/api/pharmacy/medicines', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast(`Obat "${medForm.name}" berhasil ditambahkan ke inventaris.`);
      }

      setShowMedicineModal(false);
      await fetchMedicines(medPage, searchTerm, categoryFilter);
    } catch (err: any) {
      const msg = err?.message || 'Gagal menyimpan data obat.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!medicineToDelete) return;
    try {
      setIsDeleting(true);
      await apiFetch(`/api/pharmacy/medicines/${medicineToDelete.id}`, {
        method: 'DELETE',
      });
      showToast(`Obat "${medicineToDelete.nama_obat || medicineToDelete.name}" berhasil dihapus.`);
      setMedicineToDelete(null);
      await fetchMedicines(medPage, searchTerm, categoryFilter);
    } catch (err: any) {
      const msg = err?.message || 'Gagal menghapus obat.';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered prescriptions list
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchSearch =
      (rx.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rx.prescriptionNumber || rx.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rx.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = rxStatusFilter === 'Semua Status' || rx.status === rxStatusFilter;
    return matchSearch && matchStatus;
  });

  // Low stock alert count
  const lowStockCount = medicines.filter(
    (m) => (m.stock ?? m.stok ?? 0) <= (m.minStock ?? 20)
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 rounded-lg px-4 py-3 text-white shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce ${
            toast.type === 'error' ? 'bg-rose-600' : 'bg-teal-600'
          }`}
        >
          <Icon name={toast.type === 'error' ? 'alertCircle' : 'check'} size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Instalasi Farmasi & Apotek RS
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manajemen antrian e-Resep, peracikan obat, kategori formularium, dan monitoring stok
          </p>
        </div>
        {canManageMedicines && activeTab === 'stok' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition cursor-pointer"
            >
              <Icon name="plus" size={16} />
              <span>Tambah Obat Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Antrian Menunggu</span>
            <span className="rounded-full bg-amber-50 p-2 text-amber-600">
              <Icon name="clock" size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {prescriptions.filter((p) => p.status === 'Menunggu').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Perlu segera diproses</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sedang Diracik</span>
            <span className="rounded-full bg-blue-50 p-2 text-blue-600">
              <Icon name="refreshCw" size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {prescriptions.filter((p) => p.status === 'Diproses').length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">Di meja peracikan</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Siap Diserahkan</span>
            <span className="rounded-full bg-emerald-50 p-2 text-emerald-600">
              <Icon name="check" size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-800">
            {prescriptions.filter((p) => p.status === 'Siap').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Menunggu panggilan pasien</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peringatan Stok Menipis</span>
            <span className="rounded-full bg-rose-50 p-2 text-rose-600">
              <Icon name="alertCircle" size={18} />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-600">{lowStockCount} Item</p>
          <span className="text-[11px] text-rose-600 font-medium">Segera buat PO pengadaan</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('resep')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'resep'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Antrian e-Resep ({prescriptions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('stok')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'stok'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Katalog Stok & Formularium ({medPagination.total || medicines.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kategori')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'kategori'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Kategori Obat
        </button>
      </div>

      {/* Tab Content: Resep */}
      {activeTab === 'resep' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari no. resep, nama pasien, atau dokter pengirim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
            <select
              value={rxStatusFilter}
              onChange={(e) => setRxStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="Semua Status">Semua Status Resep</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Diproses">Diproses</option>
              <option value="Siap">Siap</option>
              <option value="Diserahkan">Diserahkan</option>
            </select>
          </div>

          {/* Prescriptions Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">No. Resep</th>
                  <th className="px-4 py-3">Pasien</th>
                  <th className="px-4 py-3">Dokter Pengirim</th>
                  <th className="px-4 py-3">Jumlah Item</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-xs text-slate-400">
                      Tidak ada antrian resep yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((rx) => {
                    const statusStyles: Record<string, string> = {
                      Menunggu: 'bg-amber-50 text-amber-700 border-amber-200',
                      Diproses: 'bg-blue-50 text-blue-700 border-blue-200',
                      Siap: 'bg-purple-50 text-purple-700 border-purple-200',
                      Diserahkan: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    };
                    return (
                      <tr key={rx.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-bold font-mono text-teal-800">
                          {rx.prescriptionNumber}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-800">{rx.patientName}</div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {rx.patientId}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{rx.doctorName}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">
                          {rx.items.length} Macam Obat
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{rx.date}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                              statusStyles[rx.status] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {rx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedRx(rx)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 transition"
                          >
                            <span>Detail & Proses</span>
                            <Icon name="arrowRight" size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Stok Obat */}
      {activeTab === 'stok' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Icon
                name="search"
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari nama obat, kode, kategori formularium..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setMedPage(1);
                }}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setMedPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.nama_kategori}>
                  {cat.nama_kategori}
                </option>
              ))}
            </select>
          </div>

          {loadingMeds ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-2xs">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Icon name="refreshCw" size={20} className="animate-spin text-teal-600" />
                <span>Memuat data katalog obat dari server...</span>
              </div>
            </div>
          ) : medsError ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-6 text-center shadow-2xs">
              <div className="flex flex-col items-center gap-2">
                <Icon name="alertCircle" size={24} className="text-rose-600" />
                <p className="text-xs font-semibold text-rose-700">{medsError}</p>
                <button
                  type="button"
                  onClick={() => fetchMedicines(medPage, searchTerm, categoryFilter)}
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
                    <th className="px-4 py-3">Nama Obat</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Kekuatan & Sediaan</th>
                    <th className="px-4 py-3">Satuan</th>
                    <th className="px-4 py-3">Sisa Stok</th>
                    <th className="px-4 py-3">Harga Satuan</th>
                    <th className="px-4 py-3">Kadaluarsa</th>
                    <th className="px-4 py-3">Status</th>
                    {canManageMedicines && (
                      <th className="px-4 py-3 text-right">Aksi</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicines.length === 0 ? (
                    <tr>
                      <td
                        colSpan={canManageMedicines ? 9 : 8}
                        className="px-4 py-12 text-center text-xs text-slate-400"
                      >
                        Tidak ada data obat yang sesuai dengan pencarian atau filter.
                      </td>
                    </tr>
                  ) : (
                    medicines.map((med) => {
                      const isLow = (med.stock ?? med.stok ?? 0) <= (med.minStock ?? 20);
                      return (
                        <tr key={med.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-800">
                              {med.name || med.nama_obat}
                            </div>
                            <span className="text-[11px] text-teal-700 font-mono font-medium block">
                              {med.kode_obat || med.id}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            {med.category || med.kategori}
                          </td>
                          <td className="px-4 py-3.5 text-slate-700">
                            {med.dosage || 'Tablet'}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500">
                            {med.unit || 'Strip'}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`font-bold ${
                                isLow ? 'text-rose-600' : 'text-slate-800'
                              }`}
                            >
                              {med.stock ?? med.stok ?? 0}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Min: {med.minStock ?? 20}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-medium text-slate-700">
                            {formatCurrency(med.price || med.harga_satuan || 0)}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500">
                            {med.expiryDate || med.expired_date}
                          </td>
                          <td className="px-4 py-3.5">
                            {isLow ? (
                              <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600 border border-rose-200">
                                Stok Menipis
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
                                Aman
                              </span>
                            )}
                          </td>
                          {canManageMedicines && (
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(med)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition"
                                  title="Edit Obat"
                                >
                                  <Icon name="edit" size={13} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setMedicineToDelete(med)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                                  title="Hapus Obat"
                                >
                                  <Icon name="trash" size={13} />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Medicine Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/50 px-4 py-3">
                <span className="text-[11px] text-slate-500 font-medium">
                  Menampilkan{' '}
                  {medPagination.total === 0 ? 0 : (medPagination.page - 1) * medPagination.limit + 1} -{' '}
                  {Math.min(medPagination.page * medPagination.limit, medPagination.total)} dari{' '}
                  <span className="font-bold text-slate-700">{medPagination.total}</span> data obat
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium mr-2">
                    Halaman {medPagination.page} dari {medPagination.total_pages || 1}
                  </span>
                  <button
                    type="button"
                    disabled={medPagination.page <= 1 || loadingMeds}
                    onClick={() => setMedPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Sebelumnya
                  </button>
                  <button
                    type="button"
                    disabled={medPagination.page >= medPagination.total_pages || loadingMeds}
                    onClick={() => setMedPage((p) => Math.min(medPagination.total_pages, p + 1))}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Kategori Obat */}
      {activeTab === 'kategori' && (
        <CategoryPanel
          canManage={canManageMedicines}
          showToast={showToast}
          onCategoriesUpdated={() => {
            fetchCategoriesList();
            fetchMedicines(medPage, searchTerm, categoryFilter);
          }}
        />
      )}

      {/* Modal Detail & Dispense Resep */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Peracikan & Penyerahan Resep
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRx.prescriptionNumber} • {selectedRx.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Patient info bar */}
              <div className="rounded-xl bg-teal-50/60 p-3.5 border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-teal-800 uppercase">
                    Pasien Penerima
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedRx.patientName} ({selectedRx.patientId})
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-teal-800 uppercase">
                    Dokter Pengirim
                  </span>
                  <p className="text-sm font-semibold text-slate-700">{selectedRx.doctorName}</p>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <span className="text-xs font-bold text-slate-700 block mb-3">
                  Progress Alur Resep:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {(['Menunggu', 'Diproses', 'Siap', 'Diserahkan'] as Prescription['status'][]).map(
                    (st, idx) => {
                      const isCurrent = selectedRx.status === st;
                      const order = ['Menunggu', 'Diproses', 'Siap', 'Diserahkan'];
                      const isPassed = order.indexOf(selectedRx.status) >= idx;
                      return (
                        <div
                          key={st}
                          className={`rounded-lg p-2.5 border transition ${
                            isCurrent
                              ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                              : isPassed
                              ? 'bg-teal-50 text-teal-700 border-teal-200 font-medium'
                              : 'bg-slate-50 text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-wider">Tahap {idx + 1}</div>
                          <div className="text-xs mt-0.5">{st}</div>
                        </div>
                      );
                    }
                  )}
                </div>

                {canManageMedicines && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-end border-t border-slate-100 pt-3">
                    {selectedRx.status === 'Menunggu' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateRxStatus(selectedRx.id, 'Diproses')}
                        className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition"
                      >
                        Mulai Meracik Obat
                      </button>
                    )}
                    {selectedRx.status === 'Diproses' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateRxStatus(selectedRx.id, 'Siap')}
                        className="rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-700 transition"
                      >
                        Obat Selesai Diracik (Siap)
                      </button>
                    )}
                    {selectedRx.status === 'Siap' && (
                      <button
                        type="button"
                        onClick={() => handleUpdateRxStatus(selectedRx.id, 'Diserahkan')}
                        className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                      >
                        Serahkan ke Pasien
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Daftar Obat Yang Diresapkan ({selectedRx.items.length})
                </h4>
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                  {selectedRx.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white flex items-center justify-between hover:bg-slate-50 transition"
                    >
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {item.medicineName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.dosage} • {item.frequency}
                        </div>
                        {item.instructions && (
                          <div className="text-[11px] text-teal-700 mt-0.5 italic">
                            Instruksi: {item.instructions}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-800">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.notes && (
                <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs text-amber-800">
                  <span className="font-bold block mb-0.5">Catatan Dokter:</span>
                  {selectedRx.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="rounded-lg bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit Obat */}
      {showMedicineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {isEditing ? 'Edit Formularium Obat' : 'Tambah Formularium Obat Baru'}
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowMedicineModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kode Obat *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MED-AMLO-5"
                  value={medForm.code}
                  onChange={(e) => setMedForm({ ...medForm, code: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Obat & Senyawa Aktif *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Amlodipine Besilate 5 mg"
                  value={medForm.name}
                  onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kategori Obat *
                  </label>
                  <select
                    required
                    value={medForm.categoryId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const found = categoriesList.find((c) => c.id === selectedId);
                      setMedForm({
                        ...medForm,
                        categoryId: selectedId,
                        category: found ? found.nama_kategori : '',
                      });
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Pilih Kategori Obat --
                    </option>
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama_kategori} ({cat.kode_kategori})
                      </option>
                    ))}
                  </select>
                  {categoriesList.length === 0 && (
                    <span className="text-[10px] text-amber-600 block mt-1">
                      Memuat data kategori...
                    </span>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kekuatan Sediaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 5 mg tablet"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Satuan Kemasan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Strip (10 Tablet)"
                    value={medForm.unit}
                    onChange={(e) => setMedForm({ ...medForm, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Harga Satuan (IDR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={medForm.price}
                    onChange={(e) =>
                      setMedForm({ ...medForm, price: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {isEditing ? 'Stok Saat Ini *' : 'Stok Awal *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={medForm.stock}
                    onChange={(e) =>
                      setMedForm({ ...medForm, stock: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min. Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={medForm.minStock}
                    onChange={(e) =>
                      setMedForm({ ...medForm, minStock: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tgl Kadaluarsa *
                  </label>
                  <input
                    type="date"
                    required
                    value={medForm.expiryDate}
                    onChange={(e) => setMedForm({ ...medForm, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowMedicineModal(false)}
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
                      ? isEditing
                        ? 'Menyimpan...'
                        : 'Menambahkan...'
                      : isEditing
                      ? 'Simpan Perubahan'
                      : 'Simpan Obat'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Obat */}
      {medicineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Icon name="trash" size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Hapus Formularium Obat
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Apakah Anda yakin ingin menghapus{' '}
                  <span className="font-bold text-slate-800">
                    {medicineToDelete.nama_obat || medicineToDelete.name}
                  </span>{' '}
                  ({medicineToDelete.kode_obat || medicineToDelete.id}) dari inventaris SIMRS?
                  Tindakan ini akan menonaktifkan obat dari formularium aktif.
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setMedicineToDelete(null)}
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
                  <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Obat'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PharmacyPage;
