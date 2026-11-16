import { useState } from 'react';
import type { LabOrder, LabResultItem } from '@/lib/types';
import { MOCK_LAB_ORDERS } from '@/lib/mock-data';
import { Icon } from '@/components/shared/Icon';

export default function LaboratoryPage() {
  const [labOrders, setLabOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [activeTab, setActiveTab] = useState<'antrian' | 'riwayat'>('antrian');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

  // Result Entry Modal State
  const [entryModalOrder, setEntryModalOrder] = useState<LabOrder | null>(null);
  const [resultRows, setResultRows] = useState<LabResultItem[]>([
    {
      testName: 'Hemoglobin (Hb)',
      result: '13.8',
      normalRange: '13.0 - 17.5',
      unit: 'g/dL',
      status: 'Normal',
    },
    {
      testName: 'Leukosit',
      result: '7,800',
      normalRange: '4,000 - 10,000',
      unit: '/µL',
      status: 'Normal',
    },
    {
      testName: 'Trombosit',
      result: '240,000',
      normalRange: '150,000 - 450,000',
      unit: '/µL',
      status: 'Normal',
    },
    {
      testName: 'Hematokrit (Ht)',
      result: '42.0',
      normalRange: '40.0 - 52.0',
      unit: '%',
      status: 'Normal',
    },
  ]);

  const [toastMessage, setToastMessage] = useState('');

  // Pending vs Completed Orders
  const pendingOrders = labOrders.filter((o) => o.status === 'Menunggu' || o.status === 'Proses');
  const completedOrders = labOrders.filter((o) => o.status === 'Selesai');

  const filteredHistory = completedOrders.filter(
    (o) =>
      (o.patientName || o.nama_pasien || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.patientId || o.no_rm || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.orderNumber || o.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.testType || o.jenis_pemeriksaan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStatus = (id: string, newStatus: LabOrder['status']) => {
    setLabOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    setToastMessage(`Status order lab ${id} berhasil diubah ke "${newStatus}".`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenEntryModal = (order: LabOrder) => {
    setEntryModalOrder(order);
    if (order.results && order.results.length > 0) {
      setResultRows(order.results);
    } else {
      setResultRows([
        {
          testName: `${order.testType} (Parameter 1)`,
          result: '',
          normalRange: 'Normal',
          unit: 'mg/dL',
          status: 'Normal',
        },
      ]);
    }
  };

  const handleResultChange = (
    index: number,
    field: keyof LabResultItem,
    value: string
  ) => {
    setResultRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddResultRow = () => {
    setResultRows((prev) => [
      ...prev,
      {
        testName: '',
        result: '',
        normalRange: '',
        unit: '',
        status: 'Normal',
      },
    ]);
  };

  const handleRemoveResultRow = (index: number) => {
    setResultRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryModalOrder) return;

    const completedDate = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    setLabOrders((prev) =>
      prev.map((o) =>
        o.id === entryModalOrder.id
          ? {
              ...o,
              status: 'Selesai',
              completedDate,
              results: resultRows,
            }
          : o
      )
    );

    setToastMessage(`Hasil laboratorium untuk pasien ${entryModalOrder.patientName} berhasil disimpan dan divalidasi!`);
    setEntryModalOrder(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-semibold text-white shadow-md animate-in fade-in">
          <Icon name="check-circle" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 border border-teal-200">
                Instalasi Laboratorium Klinis & Patologi
              </span>
              <span className="text-xs text-slate-400">Pemeriksaan Diagnostik Darah, Urin, Mikrobiologi</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Manajemen Laboratorium Medis</h1>
            <p className="text-xs text-slate-500">
              Penerimaan sampel, entri hasil pengujian klinis, validasi analis laboratorium, dan pelaporan hasil.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-50 px-3.5 py-2 border border-slate-200 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Sampel CITO Hari Ini</span>
              <span className="text-sm font-extrabold text-rose-600">
                {labOrders.filter((o) => o.priority === 'Cito / Darurat' && o.status !== 'Selesai').length} Sampel Darurat
              </span>
            </div>
          </div>
        </div>

        {/* Status Counter */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-4 text-xs">
          <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">Menunggu Pengambilan Sampel</span>
            <span className="text-xl font-bold text-amber-900 font-mono">
              {labOrders.filter((o) => o.status === 'Menunggu').length}
            </span>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 border border-blue-200">
            <span className="text-[11px] font-semibold text-blue-800 block">Sedang Dianalisis di Lab</span>
            <span className="text-xl font-bold text-blue-900 font-mono">
              {labOrders.filter((o) => o.status === 'Proses').length}
            </span>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">Hasil Telah Terbit & Tervalidasi</span>
            <span className="text-xl font-bold text-emerald-900 font-mono">{completedOrders.length}</span>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-700 block">Total Permintaan Hari Ini</span>
            <span className="text-xl font-bold text-slate-900 font-mono">{labOrders.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('antrian')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 transition ${
            activeTab === 'antrian'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="clock" size={16} />
          Antrian Pemeriksaan Berjalan ({pendingOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('riwayat')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 transition ${
            activeTab === 'riwayat'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="check-circle" size={16} />
          Arsip & Hasil Pengujian Selesai ({completedOrders.length})
        </button>
      </div>

      {/* Tab 1: Antrian Pemeriksaan Berjalan */}
      {activeTab === 'antrian' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className={`rounded-xl border bg-white p-5 shadow-xs transition ${
                  order.priority === 'Cito / Darurat' ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-700 text-xs bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.priority === 'Cito / Darurat'
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      order.status === 'Proses' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-3 text-xs space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">{order.patientName}</span>
                    <span className="font-mono text-slate-400">{order.patientId}</span>
                  </div>
                  <p className="text-teal-800 font-semibold">{order.testType}</p>
                  <p className="text-slate-500 text-[11px]">
                    Dokter Pengirim: <strong className="text-slate-700">{order.doctorName}</strong> ({order.department})
                  </p>
                  {order.notes && (
                    <div className="rounded bg-slate-50 p-2 text-[11px] text-slate-600 border border-slate-100">
                      <strong>Indikasi Klinis:</strong> {order.notes}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-mono">Waktu Permintaan: {order.orderDate}</p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  {order.status === 'Menunggu' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(order.id, 'Proses')}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Mulai Proses Uji
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEntryModal(order)}
                    className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition shadow-xs"
                  >
                    <Icon name="edit" size={13} />
                    Input Hasil Lab
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pendingOrders.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
              <Icon name="check-circle" size={32} className="mx-auto mb-2 text-emerald-400" />
              Tidak ada antrian pengujian laboratorium yang sedang menunggu atau dalam proses.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Arsip & Hasil Pengujian Selesai */}
      {activeTab === 'riwayat' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="relative">
              <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pasien, no. order, jenis tes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Total Selesai: <strong>{filteredHistory.length}</strong> tes
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredHistory.map((order) => (
              <div key={order.id} className="p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-teal-800 text-xs">{order.orderNumber}</span>
                      <strong className="text-slate-900 text-sm">{order.patientName}</strong>
                      <span className="font-mono text-xs text-slate-400">({order.patientId})</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{order.testType}</p>
                    <p className="text-[11px] text-slate-500">
                      Dokter: {order.doctorName} · Selesai: <span className="font-mono font-semibold">{order.completedDate}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-600 transition"
                  >
                    <Icon name="printer" size={14} />
                    Lihat Lembar Hasil
                  </button>
                </div>

                {/* Inline Preview of Results Table */}
                {order.results && order.results.length > 0 && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 overflow-x-auto text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-200 text-[11px] font-semibold">
                          <th className="pb-1">Parameter Pemeriksaan</th>
                          <th className="pb-1">Hasil Analisis</th>
                          <th className="pb-1">Nilai Rujukan Normal</th>
                          <th className="pb-1">Satuan</th>
                          <th className="pb-1">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.results.map((res, i) => (
                          <tr key={i} className="text-slate-700">
                            <td className="py-1.5 font-medium">{res.testName}</td>
                            <td className={`py-1.5 font-mono font-bold ${res.status === 'Tinggi' ? 'text-rose-600' : 'text-slate-900'}`}>
                              {res.result}
                            </td>
                            <td className="py-1.5 text-slate-500 font-mono">{res.normalRange}</td>
                            <td className="py-1.5 text-slate-500">{res.unit}</td>
                            <td className="py-1.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  res.status === 'Tinggi'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                              >
                                {res.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result Entry Modal */}
      {entryModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Entri Hasil Pengujian Laboratorium</h3>
                <p className="text-xs text-slate-500">
                  Pasien: <strong className="text-slate-800">{entryModalOrder.patientName}</strong> ({entryModalOrder.patientId}) · Tes: {entryModalOrder.testType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEntryModalOrder(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-4 text-xs">
              <div className="rounded-lg bg-teal-50 p-3 border border-teal-200 text-teal-900 text-xs">
                Masukkan nilai parameter kuantitatif/kualitatif beserta nilai rujukan laboratorium standar.
              </div>

              <div className="space-y-3">
                {resultRows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="sm:col-span-4">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Parameter:</label>
                      <input
                        type="text"
                        placeholder="Nama parameter uji"
                        value={row.testName}
                        onChange={(e) => handleResultChange(idx, 'testName', e.target.value)}
                        className="h-8 w-full rounded border border-slate-200 bg-white px-2.5 font-medium"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Hasil:</label>
                      <input
                        type="text"
                        placeholder="Hasil"
                        value={row.result}
                        onChange={(e) => handleResultChange(idx, 'result', e.target.value)}
                        className="h-8 w-full rounded border border-slate-200 bg-white px-2 font-mono font-bold text-slate-900"
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Nilai Normal:</label>
                      <input
                        type="text"
                        placeholder="Rujukan normal"
                        value={row.normalRange}
                        onChange={(e) => handleResultChange(idx, 'normalRange', e.target.value)}
                        className="h-8 w-full rounded border border-slate-200 bg-white px-2 font-mono"
                        required
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="text-[10px] text-slate-400 block sm:hidden">Satuan:</label>
                      <input
                        type="text"
                        placeholder="Satuan"
                        value={row.unit}
                        onChange={(e) => handleResultChange(idx, 'unit', e.target.value)}
                        className="h-8 w-full rounded border border-slate-200 bg-white px-1.5 text-center font-mono"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <select
                        value={row.status}
                        onChange={(e) =>
                          handleResultChange(idx, 'status', e.target.value as LabResultItem['status'])
                        }
                        className="h-8 w-full rounded border border-slate-200 bg-white px-1 text-[11px] font-bold"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Tinggi">Tinggi</option>
                        <option value="Rendah">Rendah</option>
                        <option value="Abnormal">Abnormal</option>
                      </select>
                    </div>
                    <div className="sm:col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveResultRow(idx)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Icon name="trash" size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddResultRow}
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800"
              >
                <Icon name="plus" size={14} />
                + Tambah Parameter Uji
              </button>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEntryModalOrder(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700 shadow-xs"
                >
                  Validasi & Terbitkan Hasil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Report Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-black text-slate-900 uppercase">RS Bhakti Digital</h2>
                <p className="text-[11px] text-slate-500">Instalasi Laboratorium Klinis Terpadu</p>
                <p className="text-[10px] text-slate-400">Jl. Jendral Sudirman Kav. 52, Jakarta Selatan · Telp: (021) 555-0199</p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">No. Hasil Lab:</span>
                <strong className="text-sm font-bold text-slate-900">{selectedOrder.orderNumber}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block">Nama Pasien:</span>
                <strong className="text-slate-900 text-xs">{selectedOrder.patientName}</strong>
                <span className="block text-slate-500 font-mono">No. RM: {selectedOrder.patientId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Dokter Pengirim:</span>
                <strong className="text-slate-900">{selectedOrder.doctorName}</strong>
                <span className="block text-slate-500">Tanggal Pengujian: {selectedOrder.completedDate}</span>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 border-b pb-1 text-sm">{selectedOrder.testType}</h3>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-500 text-[11px]">
                  <th className="py-1">Parameter</th>
                  <th className="py-1">Hasil</th>
                  <th className="py-1">Nilai Rujukan</th>
                  <th className="py-1">Satuan</th>
                  <th className="py-1">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedOrder.results?.map((res, i) => (
                  <tr key={i}>
                    <td className="py-1.5 font-medium">{res.testName}</td>
                    <td className={`py-1.5 font-mono font-bold ${res.status === 'Tinggi' ? 'text-rose-600' : 'text-slate-900'}`}>
                      {res.result}
                    </td>
                    <td className="py-1.5 text-slate-500 font-mono">{res.normalRange}</td>
                    <td className="py-1.5 text-slate-500">{res.unit}</td>
                    <td className="py-1.5 font-semibold text-[11px]">{res.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
              <span className="text-[10px] text-slate-400 italic">
                Dokumen hasil laboratorium ini sah dikeluarkan secara elektronik oleh RS Bhakti Digital.
              </span>
              <div className="text-center font-mono">
                <span className="text-[10px] text-slate-400 block">Penanggung Jawab Lab:</span>
                <strong className="block text-slate-800 mt-6">dr. Spesialis Patologi Klinik</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700"
              >
                Tutup Lembar Hasil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { LaboratoryPage };

