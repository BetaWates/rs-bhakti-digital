import { useState, useMemo } from 'react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import logoUrl from '@/assets/logo.png';
import { printHospitalDocument } from '@/lib/tauri';

interface DepartmentReport {
  id: string;
  department: string;
  totalVisits: number;
  avgWaitTime: string;
  bpjsCount: number;
  generalCount: number;
  privateInsuranceCount: number;
  revenue: number;
  satisfactionRate: number;
  targetAchievement: number;
}

interface MorbidityItem {
  rank: number;
  icdCode: string;
  diagnosisName: string;
  category: string;
  outpatientCases: number;
  inpatientCases: number;
  totalCases: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface FinancialSummary {
  category: string;
  transactionsCount: number;
  bpjsClaim: number;
  cashPayment: number;
  insurancePayment: number;
  totalAmount: number;
  reconciliationStatus: 'Terverifikasi' | 'Menunggu Klaim' | 'Dalam Proses';
}

const INITIAL_DEPT_REPORTS: DepartmentReport[] = [
  {
    id: 'D01',
    department: 'Poli Penyakit Dalam',
    totalVisits: 342,
    avgWaitTime: '15 Menit',
    bpjsCount: 246,
    generalCount: 72,
    privateInsuranceCount: 24,
    revenue: 68400000,
    satisfactionRate: 95.8,
    targetAchievement: 106.8,
  },
  {
    id: 'D02',
    department: 'Poli Kardiologi (Jantung)',
    totalVisits: 254,
    avgWaitTime: '18 Menit',
    bpjsCount: 198,
    generalCount: 38,
    privateInsuranceCount: 18,
    revenue: 94500000,
    satisfactionRate: 98.2,
    targetAchievement: 112.5,
  },
  {
    id: 'D03',
    department: 'Poli Anak (Pediatri)',
    totalVisits: 289,
    avgWaitTime: '12 Menit',
    bpjsCount: 182,
    generalCount: 92,
    privateInsuranceCount: 15,
    revenue: 52100000,
    satisfactionRate: 94.0,
    targetAchievement: 98.4,
  },
  {
    id: 'D04',
    department: 'Poli Kandungan & Kebidanan (Obgyn)',
    totalVisits: 215,
    avgWaitTime: '14 Menit',
    bpjsCount: 140,
    generalCount: 55,
    privateInsuranceCount: 20,
    revenue: 58800000,
    satisfactionRate: 97.4,
    targetAchievement: 104.2,
  },
  {
    id: 'D05',
    department: 'Poli Bedah & Ortopedi',
    totalVisits: 178,
    avgWaitTime: '20 Menit',
    bpjsCount: 122,
    generalCount: 36,
    privateInsuranceCount: 20,
    revenue: 86400000,
    satisfactionRate: 96.0,
    targetAchievement: 101.5,
  },
  {
    id: 'D06',
    department: 'Instalasi Gawat Darurat (IGD)',
    totalVisits: 312,
    avgWaitTime: '4 Menit',
    bpjsCount: 218,
    generalCount: 74,
    privateInsuranceCount: 20,
    revenue: 115200000,
    satisfactionRate: 93.5,
    targetAchievement: 115.0,
  },
  {
    id: 'D07',
    department: 'Instalasi Rawat Inap (Inpatient)',
    totalVisits: 186,
    avgWaitTime: '25 Menit',
    bpjsCount: 144,
    generalCount: 28,
    privateInsuranceCount: 14,
    revenue: 167500000,
    satisfactionRate: 96.8,
    targetAchievement: 105.4,
  },
];

const INITIAL_MORBIDITY: MorbidityItem[] = [
  {
    rank: 1,
    icdCode: 'I10',
    diagnosisName: 'Hipertensi Esensial (Primer)',
    category: 'Sistem Sirkulasi Darah',
    outpatientCases: 214,
    inpatientCases: 38,
    totalCases: 252,
    trend: 'up',
    percentage: 14.2,
  },
  {
    rank: 2,
    icdCode: 'E11.9',
    diagnosisName: 'Diabetes Melitus Tipe 2 Tanpa Komplikasi',
    category: 'Endokrin & Metabolik',
    outpatientCases: 176,
    inpatientCases: 24,
    totalCases: 200,
    trend: 'stable',
    percentage: 11.3,
  },
  {
    rank: 3,
    icdCode: 'J06.9',
    diagnosisName: 'Infeksi Saluran Pernapasan Akut (ISPA)',
    category: 'Sistem Pernapasan',
    outpatientCases: 165,
    inpatientCases: 12,
    totalCases: 177,
    trend: 'up',
    percentage: 10.0,
  },
  {
    rank: 4,
    icdCode: 'K30',
    diagnosisName: 'Dispepsia Fungsional',
    category: 'Sistem Pencernaan',
    outpatientCases: 132,
    inpatientCases: 18,
    totalCases: 150,
    trend: 'down',
    percentage: 8.5,
  },
  {
    rank: 5,
    icdCode: 'I20.0',
    diagnosisName: 'Angina Pectoris Tidak Stabil (UAP)',
    category: 'Sistem Sirkulasi Darah',
    outpatientCases: 42,
    inpatientCases: 56,
    totalCases: 98,
    trend: 'up',
    percentage: 5.5,
  },
  {
    rank: 6,
    icdCode: 'J18.9',
    diagnosisName: 'Pneumonia Tidak Spesifik',
    category: 'Sistem Pernapasan',
    outpatientCases: 38,
    inpatientCases: 48,
    totalCases: 86,
    trend: 'down',
    percentage: 4.8,
  },
  {
    rank: 7,
    icdCode: 'A09',
    diagnosisName: 'Gastroenteritis Akut (GEA)',
    category: 'Penyakit Infeksi',
    outpatientCases: 54,
    inpatientCases: 28,
    totalCases: 82,
    trend: 'stable',
    percentage: 4.6,
  },
  {
    rank: 8,
    icdCode: 'M54.5',
    diagnosisName: 'Nyeri Punggung Bawah (Low Back Pain)',
    category: 'Muskuloskeletal',
    outpatientCases: 68,
    inpatientCases: 6,
    totalCases: 74,
    trend: 'up',
    percentage: 4.2,
  },
  {
    rank: 9,
    icdCode: 'O80',
    diagnosisName: 'Persalinan Tunggal Spontan',
    category: 'Obstetri & Kebidanan',
    outpatientCases: 14,
    inpatientCases: 48,
    totalCases: 62,
    trend: 'stable',
    percentage: 3.5,
  },
  {
    rank: 10,
    icdCode: 'S82.2',
    diagnosisName: 'Fraktur Tertutup Tulang Tibia',
    category: 'Trauma & Cedera',
    outpatientCases: 12,
    inpatientCases: 36,
    totalCases: 48,
    trend: 'down',
    percentage: 2.7,
  },
];

const INITIAL_FINANCIAL: FinancialSummary[] = [
  {
    category: 'Layanan Rawat Inap & Kamar',
    transactionsCount: 186,
    bpjsClaim: 128500000,
    cashPayment: 24500000,
    insurancePayment: 14500000,
    totalAmount: 167500000,
    reconciliationStatus: 'Terverifikasi',
  },
  {
    category: 'Instalasi Gawat Darurat (IGD)',
    transactionsCount: 312,
    bpjsClaim: 78200000,
    cashPayment: 26000000,
    insurancePayment: 11000000,
    totalAmount: 115200000,
    reconciliationStatus: 'Terverifikasi',
  },
  {
    category: 'Tindakan Medis & Bedah',
    transactionsCount: 94,
    bpjsClaim: 82400000,
    cashPayment: 18500000,
    insurancePayment: 25500000,
    totalAmount: 126400000,
    reconciliationStatus: 'Dalam Proses',
  },
  {
    category: 'Farmasi & Resep Obat',
    transactionsCount: 840,
    bpjsClaim: 64200000,
    cashPayment: 28400000,
    insurancePayment: 6800000,
    totalAmount: 99400000,
    reconciliationStatus: 'Terverifikasi',
  },
  {
    category: 'Laboratorium Klinis & Patologi',
    transactionsCount: 388,
    bpjsClaim: 32500000,
    cashPayment: 14200000,
    insurancePayment: 5800000,
    totalAmount: 52500000,
    reconciliationStatus: 'Terverifikasi',
  },
  {
    category: 'Konsultasi Poli Rawat Jalan',
    transactionsCount: 1180,
    bpjsClaim: 52800000,
    cashPayment: 24100000,
    insurancePayment: 4600000,
    totalAmount: 81500000,
    reconciliationStatus: 'Menunggu Klaim',
  },
];

const MONTHLY_TREND = [
  { month: 'Jan', outpatient: 1120, inpatient: 195, igd: 280, revenue: 540 },
  { month: 'Feb', outpatient: 1040, inpatient: 180, igd: 265, revenue: 510 },
  { month: 'Mar', outpatient: 1240, inpatient: 210, igd: 310, revenue: 610 },
  { month: 'Apr', outpatient: 1180, inpatient: 198, igd: 295, revenue: 585 },
  { month: 'Mei', outpatient: 1310, inpatient: 225, igd: 330, revenue: 650 },
  { month: 'Jun', outpatient: 1428, inpatient: 238, igd: 345, revenue: 712 },
  { month: 'Jul', outpatient: 1390, inpatient: 230, igd: 335, revenue: 690 },
  { month: 'Agu', outpatient: 1450, inpatient: 245, igd: 360, revenue: 735 },
  { month: 'Sep', outpatient: 1380, inpatient: 228, igd: 340, revenue: 695 },
  { month: 'Okt', outpatient: 1490, inpatient: 250, igd: 375, revenue: 760 },
  { month: 'Nov', outpatient: 1540, inpatient: 260, igd: 390, revenue: 790 },
  { month: 'Des', outpatient: 1610, inpatient: 275, igd: 410, revenue: 830 },
];

export function ReportsPage() {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | 'month' | 'quarter' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState('2025-06-01');
  const [endDate, setEndDate] = useState('2025-06-16');
  const [selectedDept, setSelectedDept] = useState('Semua Departemen');
  const [selectedInsurance, setSelectedInsurance] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'departemen' | 'morbiditas' | 'keuangan' | 'indikator'>('departemen');

  const [chartMetric, setChartMetric] = useState<'kunjungan' | 'pendapatan'>('kunjungan');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showCustomReportModal, setShowCustomReportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [customReportForm, setCustomReportForm] = useState({
    title: '',
    category: 'Rawat Jalan',
    format: 'CSV',
    dateFrom: '2025-06-01',
    dateTo: '2025-06-16',
    includePatientDetails: true,
    aggregation: 'Harian',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredDeptReports = useMemo(() => {
    return INITIAL_DEPT_REPORTS.filter((item) => {
      const matchSearch =
        item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === 'Semua Departemen' || item.department.includes(selectedDept);
      return matchSearch && matchDept;
    });
  }, [searchQuery, selectedDept]);

  const filteredMorbidity = useMemo(() => {
    return INITIAL_MORBIDITY.filter((item) => {
      return (
        item.diagnosisName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.icdCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  const filteredFinancial = useMemo(() => {
    return INITIAL_FINANCIAL.filter((item) => {
      return item.category.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const totalVisits = useMemo(() => {
    return filteredDeptReports.reduce((acc, curr) => acc + curr.totalVisits, 0);
  }, [filteredDeptReports]);

  const totalRevenue = useMemo(() => {
    return filteredFinancial.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [filteredFinancial]);

  const totalBPJSClaims = useMemo(() => {
    return filteredFinancial.reduce((acc, curr) => acc + curr.bpjsClaim, 0);
  }, [filteredFinancial]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeTab === 'departemen') {
      csvContent += 'ID Departemen,Nama Instalasi / Departemen,Total Kunjungan,Rata-rata Waktu Tunggu,Pasien BPJS,Pasien Umum,Pasien Asuransi Swasta,Total Pendapatan (IDR),Tingkat Kepuasan (%),Pencapaian Target (%)\r\n';
      filteredDeptReports.forEach((row) => {
        csvContent += `"${row.id}","${row.department}",${row.totalVisits},"${row.avgWaitTime}",${row.bpjsCount},${row.generalCount},${row.privateInsuranceCount},${row.revenue},${row.satisfactionRate}%,${row.targetAchievement}%\r\n`;
      });
    } else if (activeTab === 'morbiditas') {
      csvContent += 'Peringkat,Kode ICD-10,Nama Diagnosis Penyakit,Kategori,Kasus Rawat Jalan,Kasus Rawat Inap,Total Kasus,Persentase (%)\r\n';
      filteredMorbidity.forEach((row) => {
        csvContent += `${row.rank},"${row.icdCode}","${row.diagnosisName}","${row.category}",${row.outpatientCases},${row.inpatientCases},${row.totalCases},${row.percentage}%\r\n`;
      });
    } else {
      csvContent += 'Kategori Layanan,Jumlah Transaksi,Klaim BPJS (IDR),Bayar Mandiri / Kasir (IDR),Asuransi Swasta (IDR),Total Pendapatan (IDR),Status Rekonsiliasi\r\n';
      filteredFinancial.forEach((row) => {
        csvContent += `"${row.category}",${row.transactionsCount},${row.bpjsClaim},${row.cashPayment},${row.insurancePayment},${row.totalAmount},"${row.reconciliationStatus}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Laporan_RS_Bhakti_Digital_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Laporan ${activeTab.toUpperCase()} berhasil diekspor ke format CSV.`);
  };

  const handleCustomReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!customReportForm.title.trim()) {
      errors.title = 'Judul laporan wajib diisi';
    } else if (customReportForm.title.length < 5) {
      errors.title = 'Judul laporan minimal 5 karakter';
    }

    if (!customReportForm.dateFrom) {
      errors.dateFrom = 'Tanggal awal wajib ditentukan';
    }
    if (!customReportForm.dateTo) {
      errors.dateTo = 'Tanggal akhir wajib ditentukan';
    } else if (customReportForm.dateFrom && customReportForm.dateTo < customReportForm.dateFrom) {
      errors.dateTo = 'Tanggal akhir tidak boleh lebih awal dari tanggal mulai';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setShowCustomReportModal(false);
      showToast(`Laporan kustom "${customReportForm.title}" berhasil di-generate (${customReportForm.format}).`);
      setCustomReportForm({
        title: '',
        category: 'Rawat Jalan',
        format: 'CSV',
        dateFrom: '2025-06-01',
        dateTo: '2025-06-16',
        includePatientDetails: true,
        aggregation: 'Harian',
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 lg:p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl font-medium animate-bounce">
          <Icon name="check" size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 uppercase tracking-wider mb-1">
            <Icon name="chart" size={16} />
            <span>Manajemen Informasi & Analitik SIMRS</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Laporan Eksekutif & Kinerja RS
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitoring indikator mutu pelayanan, sensus pasien, efisiensi operasional, dan rekonsiliasi keuangan RS Bhakti Digital.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCustomReportModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs cursor-pointer"
          >
            <Icon name="edit" size={16} />
            <span>Kustomisasi Laporan</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-xs cursor-pointer"
          >
            <Icon name="printer" size={16} />
            <span>Cetak PDF / Pratinjau</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
          >
            <Icon name="download" size={16} />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Periode */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Rentang Waktu
            </label>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
              {[
                { key: 'today', label: 'Hari Ini' },
                { key: '7days', label: '7 Hari' },
                { key: 'month', label: 'Bulan Ini' },
                { key: 'quarter', label: 'Kuartal' },
                { key: 'year', label: 'Tahun' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTimeRange(item.key as any)}
                  className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
                    timeRange === item.key
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Departemen */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Departemen / Instalasi
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700"
            >
              <option value="Semua Departemen">Semua Departemen & Poli</option>
              <option value="Penyakit Dalam">Poli Penyakit Dalam</option>
              <option value="Kardiologi">Poli Kardiologi (Jantung)</option>
              <option value="Anak">Poli Anak (Pediatri)</option>
              <option value="Kandungan">Poli Kandungan & Obgyn</option>
              <option value="Bedah">Poli Bedah & Ortopedi</option>
              <option value="IGD">Instalasi Gawat Darurat (IGD)</option>
              <option value="Rawat Inap">Instalasi Rawat Inap</option>
            </select>
          </div>

          {/* Penjamin */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
              Penjamin Pasien
            </label>
            <select
              value={selectedInsurance}
              onChange={(e) => setSelectedInsurance(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700"
            >
              <option value="all">Semua Penjamin (BPJS & Umum)</option>
              <option value="BPJS">BPJS Kesehatan (JKN)</option>
              <option value="Umum">Umum / Pasien Mandiri</option>
              <option value="Asuransi">Asuransi Komersial / Swasta</option>
            </select>
          </div>

          {/* Tanggal Kustom */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">
                Sampai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-9 px-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Kunjungan Pasien
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
              <Icon name="users" size={20} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {totalVisits.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center font-semibold text-emerald-600">
              +14.2%
            </span>
            <span>vs bulan sebelumnya</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rawat Jalan: 1.180</span>
            <span className="text-slate-300">|</span>
            <span>Rawat Inap: 186</span>
            <span className="text-slate-300">|</span>
            <span>IGD: 312</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Pendapatan & Omset
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Icon name="wallet" size={20} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center font-semibold text-emerald-600">
              +8.7%
            </span>
            <span>Klaim Terverifikasi</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>BPJS: {formatCurrency(totalBPJSClaims)}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Bed Occupancy Rate (BOR)
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Icon name="bed" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">76.8%</div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Ideal (60-85%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '76.8%' }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Terisi: 96 / 125 Tempat Tidur</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Rata-rata Waktu Rawat (ALOS)
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Icon name="clock" size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">3.2</div>
            <span className="text-sm font-semibold text-slate-500">Hari / Pasien</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center font-semibold text-emerald-600">
              Efisiensi Tinggi
            </span>
            <span>Standar Kemenkes: 3-5 Hari</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>TOI: 1.4 Hari</span>
            <span className="text-slate-300">|</span>
            <span>BTO: 44.2 Kali</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Chart: Multi-series Patient Visits / Revenue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Tren Perkembangan Pelayanan (Tahun 2025)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Volume kunjungan pasien Rawat Jalan, Rawat Inap, dan IGD per bulan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-0.5 rounded-lg flex text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setChartMetric('kunjungan')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    chartMetric === 'kunjungan'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Kunjungan Pasien
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('pendapatan')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    chartMetric === 'pendapatan'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Pendapatan (Juta Rp)
                </button>
              </div>
            </div>
          </div>

          {/* SVG Trend Chart */}
          <div className="relative w-full h-72">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 240"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="70" x2="580" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="210" x2="580" y2="210" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="32" y="24" textAnchor="end" fontSize="10" fill="#94a3b8">
                {chartMetric === 'kunjungan' ? '1.8k' : '900jt'}
              </text>
              <text x="32" y="74" textAnchor="end" fontSize="10" fill="#94a3b8">
                {chartMetric === 'kunjungan' ? '1.4k' : '700jt'}
              </text>
              <text x="32" y="124" textAnchor="end" fontSize="10" fill="#94a3b8">
                {chartMetric === 'kunjungan' ? '1.0k' : '500jt'}
              </text>
              <text x="32" y="174" textAnchor="end" fontSize="10" fill="#94a3b8">
                {chartMetric === 'kunjungan' ? '500' : '250jt'}
              </text>
              <text x="32" y="214" textAnchor="end" fontSize="10" fill="#94a3b8">
                0
              </text>

              {/* Bar or Series Lines */}
              {MONTHLY_TREND.map((item, idx) => {
                const x = 55 + idx * 44;
                const maxVal = chartMetric === 'kunjungan' ? 1800 : 900;

                const valOut = chartMetric === 'kunjungan' ? item.outpatient : item.revenue;
                const barHeight = (valOut / maxVal) * 190;
                const barY = 210 - barHeight;

                const valIn = chartMetric === 'kunjungan' ? item.inpatient : item.revenue * 0.3;
                const inHeight = (valIn / maxVal) * 190;
                const inY = 210 - inHeight;

                const isHovered = hoveredPoint === idx;

                return (
                  <g
                    key={item.month}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Background hover bar */}
                    <rect
                      x={x - 14}
                      y="15"
                      width="34"
                      height="195"
                      fill={isHovered ? 'rgba(241, 245, 249, 0.7)' : 'transparent'}
                      rx="4"
                    />

                    {/* Outpatient Bar */}
                    <rect
                      x={x - 10}
                      y={barY}
                      width="12"
                      height={barHeight}
                      fill={isHovered ? '#0d9488' : '#14b8a6'}
                      rx="3"
                    />

                    {/* Inpatient Bar */}
                    <rect
                      x={x + 4}
                      y={inY}
                      width="10"
                      height={inHeight}
                      fill={isHovered ? '#2563eb' : '#60a5fa'}
                      rx="3"
                    />

                    {/* X Month Label */}
                    <text
                      x={x + 3}
                      y="226"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight={isHovered ? 'bold' : 'normal'}
                      fill={isHovered ? '#0f172a' : '#64748b'}
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint !== null && (
              <div
                className="absolute z-10 bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoveredPoint * 44 + 55) / 6}%`,
                  top: '40%',
                }}
              >
                <div className="font-bold border-b border-slate-700 pb-1 mb-1.5 text-teal-300">
                  {MONTHLY_TREND[hoveredPoint].month} 2025
                </div>
                {chartMetric === 'kunjungan' ? (
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4">
                      <span className="text-teal-400">Rawat Jalan:</span>
                      <span className="font-semibold">
                        {MONTHLY_TREND[hoveredPoint].outpatient} Pasien
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-blue-400">Rawat Inap:</span>
                      <span className="font-semibold">
                        {MONTHLY_TREND[hoveredPoint].inpatient} Pasien
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-amber-400">IGD:</span>
                      <span className="font-semibold">
                        {MONTHLY_TREND[hoveredPoint].igd} Pasien
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between gap-4">
                    <span className="text-emerald-400">Pendapatan:</span>
                    <span className="font-semibold">
                      Rp {MONTHLY_TREND[hoveredPoint].revenue} Juta
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-teal-500 inline-block" />
              <span className="text-slate-600 font-medium">Rawat Jalan (Poliklinik)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-blue-400 inline-block" />
              <span className="text-slate-600 font-medium">Rawat Inap (Bangsal & ICU)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
              <span className="text-slate-600 font-medium">IGD & Ambulans</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Service Category Breakdown & Insurance Share */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Distribusi Pendapatan & Pasien
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Komposisi per instalasi & porsi penjamin klaim
            </p>

            {/* Category breakdown bars */}
            <div className="space-y-3.5 mb-6">
              {[
                { name: 'Rawat Inap & Tindakan Operasi', percentage: 38, color: 'bg-teal-600' },
                { name: 'Instalasi Gawat Darurat (IGD)', percentage: 22, color: 'bg-blue-600' },
                { name: 'Farmasi & Apotek Resep', percentage: 18, color: 'bg-indigo-500' },
                { name: 'Poliklinik Rawat Jalan', percentage: 12, color: 'bg-amber-500' },
                { name: 'Laboratorium & Radiologi', percentage: 10, color: 'bg-rose-500' },
              ].map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{cat.name}</span>
                    <span className="font-semibold">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`${cat.color} h-2 rounded-full`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Distribution Box */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Proporsi Penjamin Pasien
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-lg font-bold text-teal-700">68%</div>
                <div className="text-[10px] text-slate-500 font-medium">BPJS Kesehatan</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-lg font-bold text-blue-700">24%</div>
                <div className="text-[10px] text-slate-500 font-medium">Umum / Kasir</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-lg font-bold text-purple-700">8%</div>
                <div className="text-[10px] text-slate-500 font-medium">Asuransi Swasta</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Efficiency Indicators (Barber Johnson Standards) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Indikator Mutu & Efisiensi Pelayanan (Standar Depkes / Kemenkes RI)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi parameter Barber Johnson untuk mengukur efektivitas pemanfaatan tempat tidur
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Status: Rumah Sakit Sangat Efisien (Zona Hijau)
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              code: 'BOR',
              name: 'Bed Occupancy Rate',
              value: '76.8%',
              target: '60 - 85%',
              status: 'Optimal',
              statusColor: 'text-emerald-700 bg-emerald-50',
            },
            {
              code: 'ALOS',
              name: 'Avg Length of Stay',
              value: '3.2 Hari',
              target: '3 - 5 Hari',
              status: 'Optimal',
              statusColor: 'text-emerald-700 bg-emerald-50',
            },
            {
              code: 'TOI',
              name: 'Turn Over Interval',
              value: '1.4 Hari',
              target: '1 - 3 Hari',
              status: 'Sangat Baik',
              statusColor: 'text-teal-700 bg-teal-50',
            },
            {
              code: 'BTO',
              name: 'Bed Turn Over',
              value: '44 Kali',
              target: '40 - 50 Kali',
              status: 'Sesuai Target',
              statusColor: 'text-blue-700 bg-blue-50',
            },
            {
              code: 'NDR',
              name: 'Net Death Rate',
              value: '1.2‰',
              target: '< 25‰',
              status: 'Sangat Rendah',
              statusColor: 'text-emerald-700 bg-emerald-50',
            },
            {
              code: 'GDR',
              name: 'Gross Death Rate',
              value: '1.9‰',
              target: '< 45‰',
              status: 'Sangat Rendah',
              statusColor: 'text-emerald-700 bg-emerald-50',
            },
          ].map((item) => (
            <div
              key={item.code}
              className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800">{item.code}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-xs ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
              <div className="text-xl font-black text-slate-900 mb-1">{item.value}</div>
              <div className="text-[11px] text-slate-500 line-clamp-1">{item.name}</div>
              <div className="text-[10px] text-slate-400 mt-1">Standar: {item.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs and Tabular Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers and Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: 'departemen', label: 'Kinerja Departemen & Poli', icon: 'hospital' },
              { id: 'morbiditas', label: '10 Besar Penyakit (ICD-10)', icon: 'activity' },
              { id: 'keuangan', label: 'Rekapitulasi Keuangan & Klaim', icon: 'wallet' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon name={tab.icon as any} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari data laporan..."
              className="w-full h-9 pl-9 pr-4 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <Icon name="search" size={16} />
            </div>
          </div>
        </div>

        {/* Tab 1: Department Performance Table */}
        {activeTab === 'departemen' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Kode & Instalasi</th>
                  <th className="px-4 py-3.5 text-center">Total Kunjungan</th>
                  <th className="px-4 py-3.5 text-center">Waktu Tunggu</th>
                  <th className="px-4 py-3.5 text-center">Pasien BPJS</th>
                  <th className="px-4 py-3.5 text-center">Pasien Umum</th>
                  <th className="px-5 py-3.5 text-right">Total Pendapatan</th>
                  <th className="px-4 py-3.5 text-center">Kepuasan</th>
                  <th className="px-4 py-3.5 text-center">Target Capaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDeptReports.length > 0 ? (
                  filteredDeptReports.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {dept.id}
                          </span>
                          <span className="font-semibold text-slate-900">{dept.department}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-slate-900">
                        {dept.totalVisits}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          {dept.avgWaitTime}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-teal-700 font-semibold">
                        {dept.bpjsCount}
                      </td>
                      <td className="px-4 py-4 text-center text-slate-700">
                        {dept.generalCount}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {formatCurrency(dept.revenue)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold text-emerald-600">
                          {dept.satisfactionRate}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            dept.targetAchievement >= 100
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {dept.targetAchievement}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      Tidak ada data departemen yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Morbidity Top 10 Table */}
        {activeTab === 'morbiditas' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 text-center">No</th>
                  <th className="px-4 py-3.5">Kode ICD-10</th>
                  <th className="px-5 py-3.5">Nama Diagnosis Penyakit</th>
                  <th className="px-4 py-3.5">Kategori Penyakit</th>
                  <th className="px-4 py-3.5 text-center">Rawat Jalan</th>
                  <th className="px-4 py-3.5 text-center">Rawat Inap</th>
                  <th className="px-4 py-3.5 text-center">Total Kasus</th>
                  <th className="px-4 py-3.5 text-center">Porsi (%)</th>
                  <th className="px-4 py-3.5 text-center">Tren</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMorbidity.length > 0 ? (
                  filteredMorbidity.map((item) => (
                    <tr key={item.icdCode} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-4 text-center font-bold text-slate-400">
                        {item.rank}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded-xs">
                          {item.icdCode}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {item.diagnosisName}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {item.category}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-700">
                        {item.outpatientCases}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-700">
                        {item.inpatientCases}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-teal-700">
                        {item.totalCases}
                      </td>
                      <td className="px-4 py-4 text-center font-semibold text-slate-800">
                        {item.percentage}%
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.trend === 'up' && (
                          <span className="inline-flex items-center text-rose-600 font-semibold text-xs">
                            ↑ Naik
                          </span>
                        )}
                        {item.trend === 'down' && (
                          <span className="inline-flex items-center text-emerald-600 font-semibold text-xs">
                            ↓ Turun
                          </span>
                        )}
                        {item.trend === 'stable' && (
                          <span className="inline-flex items-center text-slate-400 font-semibold text-xs">
                            — Stabil
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      Tidak ada data diagnosis yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Financial Summary Table */}
        {activeTab === 'keuangan' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Kategori Transaksi Layanan</th>
                  <th className="px-4 py-3.5 text-center">Jml Transaksi</th>
                  <th className="px-5 py-3.5 text-right">Klaim BPJS (IDR)</th>
                  <th className="px-5 py-3.5 text-right">Kasir Mandiri (IDR)</th>
                  <th className="px-5 py-3.5 text-right">Asuransi Swasta (IDR)</th>
                  <th className="px-5 py-3.5 text-right">Total Nilai Layanan</th>
                  <th className="px-4 py-3.5 text-center">Status Rekonsiliasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFinancial.length > 0 ? (
                  filteredFinancial.map((fin, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {fin.category}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-slate-700">
                        {fin.transactionsCount}
                      </td>
                      <td className="px-5 py-4 text-right text-teal-700 font-semibold">
                        {formatCurrency(fin.bpjsClaim)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700">
                        {formatCurrency(fin.cashPayment)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700">
                        {formatCurrency(fin.insurancePayment)}
                      </td>
                      <td className="px-5 py-4 text-right font-extrabold text-slate-900">
                        {formatCurrency(fin.totalAmount)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            fin.reconciliationStatus === 'Terverifikasi'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : fin.reconciliationStatus === 'Menunggu Klaim'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {fin.reconciliationStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      Tidak ada data keuangan yang cocok dengan pencarian.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Printable Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Icon name="printer" size={20} className="text-teal-600" />
                <h3 className="font-bold text-slate-800 text-lg">Pratinjau Dokumen Eksekutif</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Modal Body - Printable Document Preview */}
            <div className="p-8 overflow-y-auto space-y-6 text-slate-800">
              {/* Hospital Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 text-center relative flex items-center justify-center gap-4">
                <img src={logoUrl} alt="RS Bhakti Digital Logo" className="h-14 w-auto object-contain shrink-0" />
                <div className="text-left">
                  <div className="text-xl font-black uppercase tracking-wider text-teal-800">
                    Rumah Sakit Umum Bhakti Digital
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Jl. Pemuda No. 45, Rawamangun, Jakarta Timur 13220 | Telp: (021) 489-7722 | Email: layanan@rsbhaktidigital.id
                  </div>
                  <div className="text-[11px] text-slate-500 italic mt-0.5">
                    Akreditasi Paripurna KARS Bintang 5 · Fasilitas Rujukan Tingkat Lanjutan BPJS Kesehatan
                  </div>
                </div>
              </div>

              {/* Document Meta */}
              <div className="flex justify-between items-start text-xs border-b border-slate-200 pb-3">
                <div>
                  <div className="font-bold text-slate-700">LAPORAN MUTU & KINERJA PELAYANAN RS</div>
                  <div className="text-slate-500">Nomor Dokumen: RSBD/LPR/{new Date().getFullYear()}/06/0042</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-500">Periode Laporan: 01 Juni 2025 - 16 Juni 2025</div>
                  <div className="text-slate-500">Tanggal Cetak: {formatDate(new Date())}</div>
                </div>
              </div>

              {/* Executive Summary Stats */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  I. Ringkasan Eksekutif Operasional
                </h4>
                <div className="grid grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div>
                    <div className="text-slate-500">Total Kunjungan</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{totalVisits} Pasien</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Total Omset</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">{formatCurrency(totalRevenue)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">BOR Kamar</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">76.8% (Ideal)</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Rata-rata ALOS</div>
                    <div className="text-base font-bold text-slate-900 mt-0.5">3.2 Hari</div>
                  </div>
                </div>
              </div>

              {/* Department Highlights */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  II. Rekapitulasi Pelayanan Instalasi
                </h4>
                <table className="w-full text-xs text-left border border-slate-200">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2 border-b border-slate-200">Instalasi / Departemen</th>
                      <th className="p-2 border-b border-slate-200 text-center">Pasien</th>
                      <th className="p-2 border-b border-slate-200 text-center">Waktu Tunggu</th>
                      <th className="p-2 border-b border-slate-200 text-right">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDeptReports.slice(0, 5).map((row) => (
                      <tr key={row.id}>
                        <td className="p-2 font-medium">{row.department}</td>
                        <td className="p-2 text-center">{row.totalVisits}</td>
                        <td className="p-2 text-center">{row.avgWaitTime}</td>
                        <td className="p-2 text-right">{formatCurrency(row.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 pt-8 text-center text-xs">
                <div>
                  <div className="text-slate-500 mb-16">Mengetahui,<br />Direktur Medis & Keperawatan</div>
                  <div className="font-bold text-slate-900 underline">dr. Maya Sari, M.Kes</div>
                  <div className="text-slate-500">NIP. 19780412 200312 2 001</div>
                </div>
                <div>
                  <div className="text-slate-500 mb-16">Jakarta, {formatDate(new Date())}<br />Manajer Keuangan & Akuntansi</div>
                  <div className="font-bold text-slate-900 underline">Budi Hartono, S.E., Ak., M.Ak.</div>
                  <div className="text-slate-500">NIP. 19820915 200701 1 004</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  printHospitalDocument('Laporan-Eksekutif-RSBD');
                  showToast('Perintah cetak laporan berhasil dikirim ke printer.');
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs cursor-pointer"
              >
                <Icon name="printer" size={16} />
                <span>Cetak Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Generator Modal */}
      {showCustomReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Icon name="edit" size={20} className="text-teal-600" />
                <h3 className="font-bold text-slate-800 text-base">Buat Laporan Kustom</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomReportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCustomReportSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul Laporan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Laporan Kunjungan Rawat Jalan Triwulan II"
                  value={customReportForm.title}
                  onChange={(e) =>
                    setCustomReportForm({ ...customReportForm, title: e.target.value })
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.title
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-rose-500 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Modul / Instalasi
                  </label>
                  <select
                    value={customReportForm.category}
                    onChange={(e) =>
                      setCustomReportForm({ ...customReportForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Rawat Jalan">Rawat Jalan (Poli)</option>
                    <option value="Rawat Inap">Rawat Inap & ICU</option>
                    <option value="Farmasi">Farmasi & Resep</option>
                    <option value="Keuangan">Billing & Keuangan</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="IGD">Gawat Darurat (IGD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Format Dokumen
                  </label>
                  <select
                    value={customReportForm.format}
                    onChange={(e) =>
                      setCustomReportForm({ ...customReportForm, format: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="CSV">Excel / CSV (.csv)</option>
                    <option value="PDF">Dokumen PDF (.pdf)</option>
                    <option value="JSON">Data JSON API (.json)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periode Awal <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={customReportForm.dateFrom}
                    onChange={(e) =>
                      setCustomReportForm({ ...customReportForm, dateFrom: e.target.value })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.dateFrom
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-teal-500'
                    }`}
                  />
                  {formErrors.dateFrom && (
                    <p className="text-xs text-rose-500 mt-1">{formErrors.dateFrom}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periode Akhir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={customReportForm.dateTo}
                    onChange={(e) =>
                      setCustomReportForm({ ...customReportForm, dateTo: e.target.value })
                    }
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.dateTo
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:ring-teal-500'
                    }`}
                  />
                  {formErrors.dateTo && (
                    <p className="text-xs text-rose-500 mt-1">{formErrors.dateTo}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agregasi Periode
                </label>
                <div className="flex gap-2">
                  {['Harian', 'Mingguan', 'Bulanan'].map((agg) => (
                    <button
                      type="button"
                      key={agg}
                      onClick={() =>
                        setCustomReportForm({ ...customReportForm, aggregation: agg })
                      }
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        customReportForm.aggregation === agg
                          ? 'bg-teal-50 border-teal-600 text-teal-700 font-semibold'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {agg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={customReportForm.includePatientDetails}
                    onChange={(e) =>
                      setCustomReportForm({
                        ...customReportForm,
                        includePatientDetails: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span>Sertakan rincian data medis & demografi pasien (anonim)</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCustomReportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Icon name="refreshCw" size={16} className="animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="download" size={16} />
                      <span>Buat & Unduh Laporan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
