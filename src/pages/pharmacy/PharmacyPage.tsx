import { useState } from 'react';
import type { Medicine, Prescription } from '@/lib/types';
import { MOCK_MEDICINES } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';

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
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [activeTab, setActiveTab] = useState<'resep' | 'stok'>('resep');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [rxStatusFilter, setRxStatusFilter] = useState('Semua Status');

  // Selected Prescription for Dispensing
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  // Add Medicine Modal State
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [newMed, setNewMed] = useState({
    name: '',
    category: 'Analgesik & Antipiretik',
    dosage: '',
    unit: 'Strip (10 Tablet)',
    stock: 50,
    minStock: 20,
    price: 15000,
    expiryDate: '2027-12-31',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

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

  // Add medicine
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name.trim() || !newMed.dosage.trim()) {
      alert('Nama obat dan sediaan wajib diisi!');
      return;
    }

    const medCode = `MED-${Date.now().toString().slice(-4)}`;
    const created: Medicine = {
      id: medCode,
      kode_obat: medCode,
      nama_obat: newMed.name,
      kategori: newMed.category,
      stok: Number(newMed.stock),
      harga_satuan: Number(newMed.price),
      expired_date: newMed.expiryDate,
      name: newMed.name,
      category: newMed.category,
      dosage: newMed.dosage,
      unit: newMed.unit,
      stock: Number(newMed.stock),
      minStock: Number(newMed.minStock),
      price: Number(newMed.price),
      expiryDate: newMed.expiryDate,
    };

    setMedicines([created, ...medicines]);
    setShowAddMedicineModal(false);
    showToast(`Obat ${created.name} berhasil ditambahkan ke inventaris.`);
    setNewMed({
      name: '',
      category: 'Analgesik & Antipiretik',
      dosage: '',
      unit: 'Strip (10 Tablet)',
      stock: 50,
      minStock: 20,
      price: 15000,
      expiryDate: '2027-12-31',
    });
  };

  // Filtered lists
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchSearch =
      (rx.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rx.prescriptionNumber || rx.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rx.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = rxStatusFilter === 'Semua Status' || rx.status === rxStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredMedicines = medicines.filter((m) => {
    const matchSearch =
      (m.name || m.nama_obat || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.category || m.kategori || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      categoryFilter === 'Semua Kategori' || (m.category || m.kategori) === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Low stock & expiry alerts
  const lowStockCount = medicines.filter((m) => (m.stock ?? m.stok ?? 0) <= (m.minStock ?? 20)).length;
  const categories = ['Semua Kategori', ...new Set(medicines.map((m) => m.category || m.kategori || 'Umum'))];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-teal-600 px-4 py-3 text-white shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Icon name="check" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Instalasi Farmasi & Apotek RS
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manajemen antrian e-Resep, peracikan obat, dan monitoring stok formularium
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddMedicineModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 transition"
          >
            <Icon name="plus" size={16} />
            <span>Tambah Obat Baru</span>
          </button>
        </div>
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
          Katalog Stok & Formularium ({medicines.length})
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
                {filteredPrescriptions.map((rx) => (
                  <tr key={rx.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-semibold text-teal-700">
                      {rx.prescriptionNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{rx.patientName}</div>
                      <span className="text-[11px] text-slate-400">{rx.patientId}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{rx.doctorName}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      {(rx.items || []).length} Macam Obat
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{rx.date}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                          rx.status === 'Menunggu'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : rx.status === 'Diproses'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : rx.status === 'Siap'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedRx(rx)}
                        className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition"
                      >
                        Detail & Racik
                      </button>
                    </td>
                  </tr>
                ))}
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
                placeholder="Cari nama obat, kategori formularium..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const isLow = (med.stock ?? med.stok ?? 0) <= (med.minStock ?? 20);
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3.5 font-bold text-slate-800">{med.name || med.nama_obat}</td>
                      <td className="px-4 py-3.5 text-slate-600">{med.category || med.kategori}</td>
                      <td className="px-4 py-3.5 text-slate-700">{med.dosage || med.form || 'Tablet'}</td>
                      <td className="px-4 py-3.5 text-slate-500">{med.unit || 'Strip'}</td>
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
                      <td className="px-4 py-3.5 text-slate-500">{med.expiryDate || med.expired_date}</td>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
                    Dokter Pemeriksa
                  </span>
                  <p className="text-xs font-semibold text-slate-700">
                    {selectedRx.doctorName}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Daftar Obat yang Diresepkan:
                </h4>
                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden">
                  {(selectedRx.items || []).map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-white flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">
                          {item.medicineName}
                        </div>
                        <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                          {item.dosage} • {item.frequency}
                        </div>
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          Instruksi: {item.instructions}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRx.notes && (
                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                  <span className="font-bold">Catatan Khusus Dokter: </span>
                  {selectedRx.notes}
                </div>
              )}

              {/* Status Progression */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-600 block mb-2">
                  Ubah Alur Status:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateRxStatus(selectedRx.id, 'Menunggu')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedRx.status === 'Menunggu'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1. Menunggu
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateRxStatus(selectedRx.id, 'Diproses')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedRx.status === 'Diproses'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    2. Diproses (Peracikan)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateRxStatus(selectedRx.id, 'Siap')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedRx.status === 'Siap'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    3. Siap Diambil
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateRxStatus(selectedRx.id, 'Diserahkan')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedRx.status === 'Diserahkan'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    4. Selesai Diserahkan
                  </button>
                </div>
              </div>
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

      {/* Modal Tambah Obat */}
      {showAddMedicineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                Tambah Formularium Obat Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMedicineModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Obat & Senyawa Aktif *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cefixime Trihydrate 100 mg"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
                  <select
                    value={newMed.category}
                    onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Analgesik & Antipiretik">Analgesik & Antipiretik</option>
                    <option value="Antibiotik & Antimikroba">Antibiotik & Antimikroba</option>
                    <option value="Kardiovaskular & Antihipertensi">Kardiovaskular</option>
                    <option value="Antidiabetes Oral">Antidiabetes</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                    <option value="Suplemen & Vitamin">Suplemen & Vitamin</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kekuatan Sediaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 100 mg kapsul"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Satuan Kemasan</label>
                  <input
                    type="text"
                    value={newMed.unit}
                    onChange={(e) => setNewMed({ ...newMed, unit: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Harga Jual Satuan (IDR)
                  </label>
                  <input
                    type="number"
                    value={newMed.price}
                    onChange={(e) =>
                      setNewMed({ ...newMed, price: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newMed.stock}
                    onChange={(e) =>
                      setNewMed({ ...newMed, stock: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Min. Stok</label>
                  <input
                    type="number"
                    value={newMed.minStock}
                    onChange={(e) =>
                      setNewMed({ ...newMed, minStock: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tgl Kadaluarsa
                  </label>
                  <input
                    type="date"
                    value={newMed.expiryDate}
                    onChange={(e) => setNewMed({ ...newMed, expiryDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMedicineModal(false)}
                  className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700 transition"
                >
                  Simpan Obat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PharmacyPage;
