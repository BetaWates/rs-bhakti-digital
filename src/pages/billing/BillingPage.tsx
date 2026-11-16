import { useState } from 'react';
import type { Billing } from '@/lib/types';
import { MOCK_BILLINGS } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import logoUrl from '@/assets/logo.png';
import { printHospitalDocument } from '@/lib/tauri';

export default function BillingPage() {
  const [billings, setBillings] = useState<Billing[]>(MOCK_BILLINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);

  // Payment Processing Modal State
  const [payingBill, setPayingBill] = useState<Billing | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Billing['paymentMethod']>('QRIS');
  const [toastMessage, setToastMessage] = useState('');

  // Daily revenue metrics
  const totalRevenuePaid = billings
    .filter((b) => b.status === 'Lunas')
    .reduce((acc, b) => acc + (b.patientPay || b.sisa_bayar_pasien || 0), 0);

  const totalBpjsClaims = billings
    .filter((b) => b.status === 'Klaim BPJS' || (b.status === 'Lunas' && (b.bpjsCoverage || b.cover_bpjs || 0) > 0))
    .reduce((acc, b) => acc + (b.bpjsCoverage || b.cover_bpjs || 0), 0);

  const totalPending = billings
    .filter((b) => b.status === 'Belum Dibayar')
    .reduce((acc, b) => acc + (b.patientPay || b.sisa_bayar_pasien || 0), 0);

  // Filtered billings
  const filteredBillings = billings.filter((b) => {
    const matchesSearch =
      (b.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.patientId || b.patient_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.invoiceNumber || b.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Semua Status' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill) return;

    const paidAtStr = `${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

    const finalStatus = payingBill.insuranceType === 'BPJS Kesehatan' && payingBill.patientPay === 0 ? 'Klaim BPJS' : 'Lunas';
    const finalDbStatus = finalStatus === 'Klaim BPJS' ? 'klaim_bpjs' : 'dibayar';

    const updated: Billing = {
      ...payingBill,
      status: finalStatus,
      status_pembayaran: finalDbStatus,
      paymentMethod,
      cashierName: 'Ratna Dewi Kusuma, S.Ak',
      paidAt: paidAtStr,
    };

    setBillings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    setSelectedBilling(updated);
    setPayingBill(null);
    setToastMessage(`Pembayaran faktur ${updated.invoiceNumber} sebesar ${formatCurrency(updated.patientPay)} berhasil diproses!`);

    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Alert */}
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
                Kasir & Perbendaharaan Keuangan RS
              </span>
              <span className="text-xs text-slate-400">Point of Sales & Klaim BPJS Kesehatan</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Penagihan & Pembayaran (Billing)</h1>
            <p className="text-xs text-slate-500">
              Perhitungan tarif konsultasi, obat, tindakan, laboratorium, verifikasi penjaminan BPJS, dan cetak kwitansi.
            </p>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-xs">
          <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 block">Total Penerimaan Kas Hari Ini (Lunas)</span>
            <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-1 block">
              {formatCurrency(totalRevenuePaid)}
            </span>
            <span className="text-[10px] text-emerald-700 mt-1 block">Pembayaran tunai, debit, & QRIS</span>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <span className="text-[11px] font-semibold text-blue-800 block">Klaim Terverifikasi BPJS Kesehatan</span>
            <span className="text-2xl font-extrabold text-blue-900 font-mono mt-1 block">
              {formatCurrency(totalBpjsClaims)}
            </span>
            <span className="text-[10px] text-blue-700 mt-1 block">Siap diajukan ke BPJS e-Klaim</span>
          </div>

          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 block">Piutang Pasien Belum Dibayar</span>
            <span className="text-2xl font-extrabold text-amber-900 font-mono mt-1 block">
              {formatCurrency(totalPending)}
            </span>
            <span className="text-[10px] text-amber-700 mt-1 block">Menunggu penyelesaian di loket kasir</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pasien, No. RM, nomor invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-72 rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium">Status Pembayaran:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Belum Dibayar">Belum Dibayar</option>
              <option value="Lunas">Lunas</option>
              <option value="Klaim BPJS">Klaim BPJS Penuh</option>
            </select>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Nama Pasien</th>
                <th className="py-3 px-4">Penjamin</th>
                <th className="py-3 px-4">Total Tagihan</th>
                <th className="py-3 px-4">Dicover BPJS</th>
                <th className="py-3 px-4">Iur Bayar Pasien</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBillings.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">{bill.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{bill.patientName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{bill.patientId}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">{bill.insuranceType}</td>
                  <td className="py-3 px-4 font-mono font-semibold">{formatCurrency(bill.totalAmount)}</td>
                  <td className="py-3 px-4 font-mono text-blue-700">{formatCurrency(bill.bpjsCoverage)}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatCurrency(bill.patientPay)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        bill.status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-800'
                          : bill.status === 'Klaim BPJS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {bill.status === 'Belum Dibayar' ? (
                        <button
                          type="button"
                          onClick={() => setPayingBill(bill)}
                          className="inline-flex items-center gap-1 rounded bg-teal-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-teal-700 shadow-2xs"
                        >
                          <Icon name="wallet" size={13} />
                          Bayar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedBilling(bill)}
                          className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-teal-500 hover:text-teal-600"
                        >
                          <Icon name="printer" size={13} />
                          Kwitansi
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {payingBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Proses Pembayaran Kasir</h3>
                <p className="text-xs text-slate-500 font-mono">{payingBill.invoiceNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setPayingBill(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              {/* Billing Itemization Breakdown */}
              <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                  Rincian Biaya Layanan Medis:
                </span>
                <div className="flex justify-between">
                  <span className="text-slate-600">Jasa Konsultasi Dokter:</span>
                  <span className="font-mono">{formatCurrency(payingBill.consultationFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Biaya Farmasi & Obat:</span>
                  <span className="font-mono">{formatCurrency(payingBill.medicineFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Pemeriksaan Laboratorium:</span>
                  <span className="font-mono">{formatCurrency(payingBill.labFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tindakan Medis & Keperawatan:</span>
                  <span className="font-mono">{formatCurrency(payingBill.actionFee)}</span>
                </div>
                {(payingBill.roomFee || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Akomodasi Kamar Inap:</span>
                    <span className="font-mono">{formatCurrency(payingBill.roomFee)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-slate-800">
                  <span>Total Tagihan:</span>
                  <span className="font-mono">{formatCurrency(payingBill.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-blue-700">
                  <span>Ditanggung Penjamin (BPJS):</span>
                  <span className="font-mono">- {formatCurrency(payingBill.bpjsCoverage)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-teal-800">
                  <span>Wajib Bayar Pasien:</span>
                  <span className="font-mono">{formatCurrency(payingBill.patientPay)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-2">Pilih Metode Pembayaran:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['QRIS', 'Tunai', 'Debit', 'Kredit', 'Transfer Bank', 'Klaim BPJS Penuh'] as Billing['paymentMethod'][]).map(
                    (method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`py-2 px-2 rounded-lg text-center font-semibold border transition ${
                          paymentMethod === method
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {method}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingBill(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700 shadow-xs transition"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Kwitansi Pembayaran Resmi Modal */}
      {selectedBilling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-2xl border border-slate-200 text-xs space-y-4">
            {/* Header Kwitansi */}
            <div className="border-b-2 border-slate-800 pb-3 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="RS Bhakti Digital Logo" className="h-10 w-auto object-contain" />
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase">RS Bhakti Digital</h2>
                  <p className="text-[11px] text-slate-500">Kwitansi Pembayaran Pelayanan Rumah Sakit</p>
                  <p className="text-[10px] text-slate-400">Jl. Pemuda No. 45, Rawamangun, Jakarta Timur</p>
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">Kwitansi No:</span>
                <strong className="text-sm font-bold text-slate-900">{selectedBilling.invoiceNumber}</strong>
              </div>
            </div>

            {/* Info Pasien & Transaksi */}
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 border border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block">Telah Terima Dari:</span>
                <strong className="text-slate-900 text-xs">{selectedBilling.patientName}</strong>
                <span className="text-slate-500 block font-mono">No. RM: {selectedBilling.patientId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tanggal / Kasir:</span>
                <strong className="text-slate-900">{selectedBilling.paidAt || selectedBilling.date}</strong>
                <span className="text-slate-500 block">Petugas: {selectedBilling.cashierName || 'Kasir SIMRS'}</span>
              </div>
            </div>

            {/* Tabel Rincian */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-500 text-[11px] font-semibold">
                  <th className="py-1">Uraian Komponen Pelayanan</th>
                  <th className="py-1 text-right">Jumlah Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-1.5">Jasa Pelayanan Konsultasi Dokter</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(selectedBilling.consultationFee)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">Biaya Obat-Obatan & Farmasi (e-Resep)</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(selectedBilling.medicineFee)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">Biaya Pemeriksaan Laboratorium Medis</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(selectedBilling.labFee)}</td>
                </tr>
                <tr>
                  <td className="py-1.5">Tindakan Medis & Keperawatan</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(selectedBilling.actionFee)}</td>
                </tr>
                {(selectedBilling.roomFee || 0) > 0 && (
                  <tr>
                    <td className="py-1.5">Akomodasi Ruangan & Kamar Perawatan</td>
                    <td className="py-1.5 text-right font-mono">{formatCurrency(selectedBilling.roomFee)}</td>
                  </tr>
                )}
                <tr className="border-t font-semibold">
                  <td className="py-1.5">Subtotal Biaya Pelayanan</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(selectedBilling.totalAmount)}</td>
                </tr>
                <tr className="text-blue-700">
                  <td className="py-1.5">Klaim Ditanggung Penjamin ({selectedBilling.insuranceType})</td>
                  <td className="py-1.5 text-right font-mono">- {formatCurrency(selectedBilling.bpjsCoverage)}</td>
                </tr>
                <tr className="border-t-2 border-slate-800 text-sm font-black text-slate-900">
                  <td className="py-2">Total yang Dibayar Pasien:</td>
                  <td className="py-2 text-right font-mono text-teal-800">
                    {formatCurrency(selectedBilling.patientPay)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="rounded-md bg-teal-50 p-2.5 text-teal-900 text-center font-bold text-[11px] border border-teal-200">
              Metode Pembayaran: {selectedBilling.paymentMethod || 'LUNAS'} — STATUS: {selectedBilling.status}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => printHospitalDocument(`Kwitansi-${selectedBilling.invoiceNumber}`)}
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="printer" size={14} />
                <span>Cetak Kwitansi</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBilling(null)}
                className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white hover:bg-teal-700 cursor-pointer"
              >
                Tutup Kwitansi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { BillingPage };

