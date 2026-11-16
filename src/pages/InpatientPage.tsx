import { useState } from 'react';
import { MOCK_ROOMS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';

export function InpatientPage() {
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const wards = Array.from(new Set(MOCK_ROOMS.map((r) => r.nama_bangsal)));

  const filteredRooms = MOCK_ROOMS.filter((room) => {
    const matchesWard = selectedWard === 'ALL' || room.nama_bangsal === selectedWard;
    const matchesStatus = statusFilter === 'ALL' || room.status === statusFilter;
    return matchesWard && matchesStatus;
  });

  const totalBeds = MOCK_ROOMS.length;
  const occupiedBeds = MOCK_ROOMS.filter((r) => r.status === 'terisi').length;
  const availableBeds = MOCK_ROOMS.filter((r) => r.status === 'tersedia').length;
  const maintenanceBeds = MOCK_ROOMS.filter((r) => r.status === 'maintenance' || r.status === 'steril_cssd').length;
  const bor = Math.round((occupiedBeds / totalBeds) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'tersedia':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Tersedia
          </span>
        );
      case 'terisi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Terisi Pasien
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Maintenance
          </span>
        );
      case 'steril_cssd':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            Sterilisasi CSSD
          </span>
        );
      default:
        return <span className="text-xs text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">
            Rawat Inap & Manajemen Tempat Tidur
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Monitoring kapasitas bangsal rawat inap, Bed Occupancy Rate (BOR), dan status kamar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Icon name="plus" size={16} />
            <span>Admisi Pasien Masuk</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Total Tempat Tidur</span>
            <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Icon name="bed" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#0f172a] mt-2">{totalBeds} Bed</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Kapasitas Maksimal RS</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Bed Terisi</span>
            <span className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Icon name="users" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{occupiedBeds} Bed</p>
          <p className="text-xs text-rose-600 font-medium mt-1">Pasien Sedang Dirawat</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Bed Tersedia (Kosong)</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="bed" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{availableBeds} Bed</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Siap Menerima Pasien Baru</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Bed Occupancy Rate (BOR)</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Icon name="activity" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-teal-700 mt-2">{bor}%</p>
          <p className="text-xs text-teal-600 font-medium mt-1">Standar Kemenkes RI: 60 - 85%</p>
        </div>
      </div>

      {/* Filter and Grid */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f1f5f9] pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedWard('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedWard === 'ALL'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-[#64748b] hover:bg-[#f8fafc]'
              }`}
            >
              Semua Bangsal ({MOCK_ROOMS.length})
            </button>
            {wards.map((ward) => (
              <button
                key={ward}
                type="button"
                onClick={() => setSelectedWard(ward)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedWard === ward
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'text-[#64748b] hover:bg-[#f8fafc]'
                }`}
              >
                {ward.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-1.5 text-[#1e293b] focus:outline-none"
            >
              <option value="ALL">Semua Status Kamar</option>
              <option value="tersedia">Tersedia</option>
              <option value="terisi">Terisi</option>
              <option value="maintenance">Maintenance</option>
              <option value="steril_cssd">Sterilisasi CSSD</option>
            </select>
          </div>
        </div>

        {/* Room Bed Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {filteredRooms.map((room) => {
            const isOcc = room.status === 'terisi';
            return (
              <div
                key={room.id}
                className={`rounded-xl border p-4 transition-all ${
                  isOcc
                    ? 'bg-white border-rose-200 hover:border-rose-300'
                    : room.status === 'tersedia'
                    ? 'bg-white border-emerald-200 hover:border-emerald-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      {room.kelas}
                    </span>
                    <h3 className="text-base font-extrabold text-[#0f172a] mt-0.5">
                      Kamar #{room.nomor_kamar}
                    </h3>
                  </div>
                  {getStatusBadge(room.status)}
                </div>

                <div className="mt-3 text-xs text-[#64748b]">
                  <p className="font-medium text-[#334155]">{room.nama_bangsal}</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    Tarif: {formatCurrency(room.tarif_per_hari)} / hari
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                  {isOcc ? (
                    <button
                      type="button"
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Lihat Rekam Pasien
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                    >
                      Pesan Kamar &rarr;
                    </button>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">ID: {room.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InpatientPage;
