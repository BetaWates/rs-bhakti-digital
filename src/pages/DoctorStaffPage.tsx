import { useState } from 'react';
import { MOCK_DOCTORS, MOCK_STAFF_PROFILES } from '@/lib/mock-data';
import { Icon } from '@/components/shared/Icon';

export function DoctorStaffPage() {
  const [activeTab, setActiveTab] = useState<'doctors' | 'staff'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchesSearch =
      doc.nama_dokter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.spesialisasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredStaff = MOCK_STAFF_PROFILES.filter((st) => {
    const matchesSearch =
      st.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.departemen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nip.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || st.departemen === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const uniqueDepartments = Array.from(new Set(MOCK_STAFF_PROFILES.map((s) => s.departemen)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] tracking-tight">Direktori Dokter & Tenaga Medis</h1>
          <p className="text-sm text-[#64748b] mt-0.5">
            Manajemen jadwal praktik, SIP, NIP, dan direktori kepegawaian RS Bhakti Digital
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Icon name="plus" size={16} />
            <span>Tambah Dokter / Staf</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Total Dokter Spesialis</span>
            <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Icon name="doctor" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#0f172a] mt-2">{MOCK_DOCTORS.length}</p>
          <p className="text-xs text-teal-600 font-medium mt-1">12 Poli Rawat Jalan Aktif</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Tenaga Keperawatan</span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Icon name="users" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#0f172a] mt-2">
            {MOCK_STAFF_PROFILES.filter((s) => s.departemen.includes('Rawat')).length || 18}
          </p>
          <p className="text-xs text-blue-600 font-medium mt-1">Standby 3 Shift 24 Jam</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Tenaga Penunjang Medis</span>
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Icon name="flask" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#0f172a] mt-2">
            {MOCK_STAFF_PROFILES.filter((s) => !s.departemen.includes('Rawat')).length || 14}
          </p>
          <p className="text-xs text-amber-600 font-medium mt-1">Farmasi, Lab & Radiologi</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b]">Dokter Jaga Hari Ini</span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="activity" size={18} />
            </span>
          </div>
          <p className="text-2xl font-bold text-[#0f172a] mt-2">8 Dokter</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">IGD & Rawat Jalan On-duty</p>
        </div>
      </div>

      {/* Tabs and Search Controls */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'doctors'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-[#64748b] hover:bg-[#f8fafc]'
              }`}
            >
              Dokter Spesialis & Umum ({MOCK_DOCTORS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200'
                  : 'text-[#64748b] hover:bg-[#f8fafc]'
              }`}
            >
              Tenaga Medis & Staf RS ({MOCK_STAFF_PROFILES.length})
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative min-w-[260px]">
              <input
                type="text"
                placeholder={activeTab === 'doctors' ? 'Cari nama dokter, spesialisasi, SIP...' : 'Cari nama staf, NIP, divisi...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg pl-8 pr-3 py-2 text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <span className="absolute left-2.5 top-2.5 text-[#94a3b8]">
                <Icon name="search" size={14} />
              </span>
            </div>

            {activeTab === 'staff' && (
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-3 py-2 text-[#1e293b] focus:outline-none"
              >
                <option value="ALL">Semua Departemen</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content Table / Cards */}
        {activeTab === 'doctors' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="border border-[#e2e8f0] rounded-xl p-4 bg-white hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center shrink-0 text-base shadow-2xs">
                    {doc.nama_dokter
                      .replace('dr. ', '')
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#0f172a] truncate">{doc.nama_dokter}</h3>
                    <p className="text-xs font-semibold text-teal-600 mt-0.5">{doc.spesialisasi}</p>
                    <p className="text-[11px] text-[#64748b] mt-0.5">SIP: {doc.sip}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9] space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#475569] block">Jadwal Praktik:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(doc.jadwal_praktik).map(([day, hours]) => (
                      <span
                        key={day}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200"
                      >
                        {day}: {String(hours)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between text-xs pt-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Poli Buka Hari Ini
                  </span>
                  <button
                    type="button"
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold cursor-pointer"
                  >
                    Detail Profil &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f8fafc] text-[#475569] uppercase font-semibold text-[11px] border-b border-[#e2e8f0]">
                <tr>
                  <th className="px-4 py-3">NIP</th>
                  <th className="px-4 py-3">Nama Petugas</th>
                  <th className="px-4 py-3">Departemen</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-slate-600">{staff.nip}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{staff.nama_lengkap}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-[11px] rounded bg-slate-100 font-medium text-slate-700 border border-slate-200">
                        {staff.departemen}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{staff.no_telepon}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Aktif Bertugas
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorStaffPage;
