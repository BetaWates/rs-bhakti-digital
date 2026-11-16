import { useState } from 'react';
import type { Patient, Appointment } from '@/lib/types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_ROOMS } from '@/lib/mock-data';
import { formatDate, getGreeting } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Semua Departemen');
  const [selectedStatus, setSelectedStatus] = useState('Semua Status');
  const [period, setPeriod] = useState<'Minggu Ini' | 'Bulan Ini'>('Minggu Ini');
  const [currentPage, setCurrentPage] = useState(1);
  const [chartHover, setChartHover] = useState<number | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const departments = [
    'Semua Departemen',
    'Kardiologi (Jantung)',
    'Penyakit Dalam',
    'Kebidanan & Kandungan',
    'Ortopedi & Traumatologi',
    'Kesehatan Anak (Pediatri)',
  ];

  // Calculated metrics
  const totalPatients = patients.length;
  const todayAppointments = appointments.length;
  const totalBeds = MOCK_ROOMS.reduce((acc, r) => acc + (r.capacity || 2), 0);
  const occupiedBeds = MOCK_ROOMS.reduce((acc, r) => acc + (r.occupied || 1), 0);
  const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  const availableDoctors = MOCK_DOCTORS.filter((d) => d.available).length;
  const totalDoctors = MOCK_DOCTORS.length;

  // Filter appointments
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      (apt.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (apt.patientId || apt.patient_id || '').toLowerCase().includes(search.toLowerCase()) ||
      (apt.doctorName || '').toLowerCase().includes(search.toLowerCase()) ||
      (apt.queueNumber || apt.nomor_antrean || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'Semua Departemen' || apt.department === selectedDept;
    const matchesStatus = selectedStatus === 'Semua Status' || apt.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const pageSize = 5;
  const totalPages = Math.ceil(filteredAppointments.length / pageSize) || 1;
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Chart data
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const outpatientData = period === 'Minggu Ini' ? [42, 58, 65, 48, 72, 60, 35] : [180, 210, 245, 195, 280, 230, 150];
  const inpatientData = period === 'Minggu Ini' ? [14, 18, 22, 19, 25, 20, 12] : [65, 80, 95, 78, 105, 88, 55];

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Pemeriksaan':
        return 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse';
      case 'Selesai':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Batal':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Department counts for distribution
  const deptCounts = departments.slice(1).map((dept) => {
    const count = appointments.filter((a) => a.department === dept).length;
    return { name: dept, count };
  });

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-inner">
              <Icon name="hospital" size={30} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-500/40 px-2.5 py-0.5 text-xs font-medium text-teal-100 backdrop-blur-xs">
                  Sistem Informasi Manajemen Rumah Sakit
                </span>
                <span className="flex items-center gap-1 text-xs text-teal-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Sistem Aktif
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                {getGreeting()}, {user.name}
              </h1>
              <p className="text-sm text-teal-100">
                Pusat Komando & Operasional RS Bhakti Digital hari ini.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 px-4 py-2 text-right backdrop-blur-xs">
              <div className="text-xs text-teal-200">Tanggal Hari Ini</div>
              <div className="text-sm font-semibold">{formatDate(new Date().toISOString())}</div>
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none select-none text-9xl font-black">
          +
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Pasien */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Pasien Terdaftar
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Icon name="users" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalPatients}</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center">
              <span>+12%</span>
              <span className="text-slate-400 font-normal ml-1">bln ini</span>
            </span>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span className="font-medium text-slate-700">{patients.filter(p => p.insuranceType === 'BPJS Kesehatan').length}</span>
            <span className="ml-1">pasien peserta BPJS Aktif</span>
          </div>
        </div>

        {/* Card 2: Antrian Hari Ini */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Antrian Hari Ini
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon name="calendar" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todayAppointments}</span>
            <span className="text-xs font-medium text-blue-600">
              {appointments.filter(a => a.status === 'Pemeriksaan').length} sedang dilayani
            </span>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <span className="font-medium text-amber-600">{appointments.filter(a => a.status === 'Menunggu').length}</span>
            <span className="ml-1">menunggu di ruang tunggu poli</span>
          </div>
        </div>

        {/* Card 3: Okupansi Kamar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Okupansi Tempat Tidur
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Icon name="bed" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{bedOccupancyRate}%</span>
            <span className="text-xs font-medium text-slate-500">
              ({occupiedBeds}/{totalBeds} Bed)
            </span>
          </div>
          <div className="mt-3 flex items-center text-xs text-slate-500">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${bedOccupancyRate > 85 ? 'bg-rose-500' : 'bg-purple-600'}`} 
                style={{ width: `${bedOccupancyRate}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Card 4: Dokter Tersedia */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Dokter On-Duty
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon name="doctor" size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{availableDoctors}</span>
            <span className="text-xs text-slate-500">/ {totalDoctors} Dokter Praktik</span>
          </div>
          <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />
            Semua Poli Spesialis Buka
          </div>
        </div>
      </div>

      {/* Analytics Grid: SVG Visits Chart & Patients by Department */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* SVG Chart: Kunjungan Pasien */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Grafik Kunjungan Pasien</h2>
              <p className="text-xs text-slate-500">Statistik arus pasien Rawat Jalan dan Rawat Inap</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPeriod('Minggu Ini')}
                  className={`rounded-md px-3 py-1 font-medium transition ${
                    period === 'Minggu Ini' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Minggu Ini
                </button>
                <button
                  type="button"
                  onClick={() => setPeriod('Bulan Ini')}
                  className={`rounded-md px-3 py-1 font-medium transition ${
                    period === 'Bulan Ini' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bulan Ini
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-teal-600" />
                <span className="font-medium text-slate-700">Rawat Jalan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="font-medium text-slate-700">Rawat Inap</span>
              </div>
            </div>
            <span className="text-slate-400">Puncak kunjungan: Hari Jumat</span>
          </div>

          {/* Interactive SVG Chart */}
          <div className="mt-6 relative">
            <svg viewBox="0 0 700 240" className="w-full h-56 overflow-visible">
              <defs>
                <linearGradient id="chartGradientOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 25, 50, 75, 100].map((v, i) => {
                const y = 200 - (v / 100) * 160;
                return (
                  <g key={v}>
                    <line x1="40" y1={y} x2="680" y2={y} stroke="#f1f5f9" strokeDasharray="3 3" />
                    <text x="30" y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-mono">
                      {period === 'Minggu Ini' ? v : v * 3}
                    </text>
                  </g>
                );
              })}

              {/* Area & Line for Outpatient */}
              {(() => {
                const maxVal = period === 'Minggu Ini' ? 100 : 300;
                const getX = (idx: number) => 70 + idx * 95;
                const getY = (val: number) => 200 - (val / maxVal) * 160;

                const pointsOut = outpatientData.map((d, i) => `${getX(i)},${getY(d)}`).join(' ');
                const pointsIn = inpatientData.map((d, i) => `${getX(i)},${getY(d)}`).join(' ');

                const areaPath = `M ${getX(0)} 200 L ${pointsOut.replace(/ /g, ' L ')} L ${getX(outpatientData.length - 1)} 200 Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#chartGradientOut)" />
                    <polyline
                      points={pointsIn}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points={pointsOut}
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {outpatientData.map((d, i) => {
                      const cx = getX(i);
                      const cy = getY(d);
                      const cyIn = getY(inpatientData[i]);
                      const isHovered = chartHover === i;

                      return (
                        <g key={days[i]} onMouseEnter={() => setChartHover(i)} onMouseLeave={() => setChartHover(null)}>
                          {/* Vertical guide line on hover */}
                          {isHovered && (
                            <line x1={cx} y1={25} x2={cx} y2={200} stroke="#cbd5e1" strokeDasharray="2 2" />
                          )}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 6 : 4}
                            className="fill-teal-600 stroke-white stroke-2 cursor-pointer transition-all"
                          />
                          <circle
                            cx={cx}
                            cy={cyIn}
                            r={isHovered ? 6 : 3.5}
                            className="fill-blue-500 stroke-white stroke-2 cursor-pointer transition-all"
                          />
                          <text
                            x={cx}
                            y={225}
                            textAnchor="middle"
                            className={`text-[11px] ${isHovered ? 'fill-teal-700 font-bold' : 'fill-slate-500'}`}
                          >
                            {days[i]}
                          </text>

                          {/* Hover Tooltip */}
                          {isHovered && (
                            <g transform={`translate(${Math.min(cx - 50, 560)}, ${Math.max(cy - 60, 10)})`}>
                              <rect width="105" height="52" rx="6" className="fill-slate-900/95 shadow-lg" />
                              <text x="10" y="20" className="text-[10px] fill-teal-300 font-semibold">
                                Rawat Jalan: {d}
                              </text>
                              <text x="10" y="38" className="text-[10px] fill-blue-300 font-semibold">
                                Rawat Inap: {inpatientData[i]}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Patients by Department */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Distribusi Poli</h2>
                <p className="text-xs text-slate-500">Sebaran pasien rawat jalan per poli</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Icon name="activity" size={18} />
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {deptCounts.map((dept, index) => {
                const total = appointments.length || 1;
                const percentage = Math.round((dept.count / total) * 100);
                const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'];
                return (
                  <div key={dept.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[190px]">{dept.name}</span>
                      <span className="text-slate-500 font-mono">
                        {dept.count} pasien ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-3.5 border border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Icon name="info" size={15} className="text-teal-600 shrink-0" />
              <span>Poli Kardiologi mengalami lonjakan pasien tertinggi sebesar 25% minggu ini.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Patient Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daftar Antrian & Pasien Hari Ini</h2>
              <p className="text-xs text-slate-500">Monitor status konsultasi dan panggilan medis secara real-time</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, No. RM, dokter..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-9 w-64 rounded-lg border border-slate-200 pl-9 pr-3 text-xs placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
                />
              </div>

              {/* Filter Dept */}
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-teal-500 focus:outline-none"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Filter Status */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-9 rounded-lg border border-slate-200 px-3 text-xs text-slate-700 focus:border-teal-500 focus:outline-none"
              >
                <option value="Semua Status">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Pemeriksaan">Pemeriksaan</option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. Antrian</th>
                <th className="py-3 px-4">Pasien</th>
                <th className="py-3 px-4">Departemen / Poli</th>
                <th className="py-3 px-4">Dokter Pemeriksa</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedAppointments.length > 0 ? (
                paginatedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {apt.queueNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 block">{apt.patientName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{apt.patientId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800">{apt.department}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700">{apt.doctorName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {apt.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadge(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(apt)}
                        className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-teal-500 hover:text-teal-600 transition shadow-2xs"
                      >
                        <Icon name="eye" size={13} />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Icon name="search" size={32} className="mx-auto mb-2 text-slate-300" />
                    Tidak ada antrian pasien yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-700">{filteredAppointments.length ? (currentPage - 1) * pageSize + 1 : 0}</span> sampai{' '}
            <span className="font-semibold text-slate-700">{Math.min(currentPage * pageSize, filteredAppointments.length)}</span> dari{' '}
            <span className="font-semibold text-slate-700">{filteredAppointments.length}</span> antrian
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="rounded border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-mono font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="rounded border border-slate-200 px-3 py-1 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200 text-sm">
                  {selectedAppointment.queueNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-base">Detail Antrian Konsultasi</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Pasien</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedAppointment.patientName}</span>
                  <span className="text-slate-500 block font-mono mt-0.5">{selectedAppointment.patientId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Dokter Pemeriksa</span>
                  <span className="font-bold text-slate-900">{selectedAppointment.doctorName}</span>
                  <span className="text-slate-500 block mt-0.5">{selectedAppointment.department}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Keluhan Pasien:</span>
                <p className="rounded-md bg-amber-50/70 p-3 text-slate-700 border border-amber-200/60 leading-relaxed">
                  {selectedAppointment.complaint}
                </p>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Catatan Tambahan:</span>
                  <p className="rounded-md bg-slate-50 p-3 text-slate-600 border border-slate-100">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              <div>
                <span className="font-semibold text-slate-700 block mb-2">Ubah Status Konsultasi:</span>
                <div className="grid grid-cols-4 gap-2">
                  {(['Menunggu', 'Pemeriksaan', 'Selesai', 'Batal'] as Appointment['status'][]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAppointment.id, st)}
                      className={`py-2 px-2 rounded-lg font-medium text-center border transition ${
                        selectedAppointment.status === st
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-3.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { DashboardPage };
