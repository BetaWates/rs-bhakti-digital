// ============================================================================
// RS Bhakti Digital SIMRS - Foundation Layer: Application Constants
// Role-based Navigation, Status Lookups, Role Labels, & Design System
// ============================================================================

import { Role, type NavigationItem, type PageName } from '@/lib/types';

// Shared Application Version
export const APP_VERSION = '3.5';

// Array of all 13 hospital roles
export const ALL_ROLES: Role[] = [
  Role.ADMIN,
  Role.DIREKTUR,
  Role.DOKTER,
  Role.PERAWAT,
  Role.APOTEKER,
  Role.ANALIS_LAB,
  Role.RADIOGRAFER,
  Role.KASIR,
  Role.ADMISI,
  Role.DRIVER,
  Role.CSSD,
  Role.IT_SUPPORT,
  Role.PASIEN,
];

// Indonesian labels for all system roles
export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrator SIMRS',
  [Role.DIREKTUR]: 'Direktur Rumah Sakit',
  [Role.DOKTER]: 'Dokter Spesialis / Umum',
  [Role.PERAWAT]: 'Perawat Medis',
  [Role.APOTEKER]: 'Apoteker / Farmasi',
  [Role.ANALIS_LAB]: 'Analis Laboratorium',
  [Role.RADIOGRAFER]: 'Radiografer',
  [Role.KASIR]: 'Kasir & Billing',
  [Role.ADMISI]: 'Petugas Admisi & Antrean',
  [Role.DRIVER]: 'Driver Ambulans',
  [Role.CSSD]: 'Petugas CSSD & Sterilisasi',
  [Role.IT_SUPPORT]: 'IT Support & Jaringan',
  [Role.PASIEN]: 'Pasien / Keluarga Pasien',
};

// Default landing page mapped to each role upon login
export const ROLE_DASHBOARD_MAP: Record<string, any> = {
  [Role.ADMIN]: 'Overview',
  [Role.DIREKTUR]: 'Overview',
  [Role.DOKTER]: 'DoctorDashboard',
  [Role.PERAWAT]: 'Rawat Inap',
  [Role.APOTEKER]: 'Farmasi',
  [Role.ANALIS_LAB]: 'Laboratorium',
  [Role.RADIOGRAFER]: 'Laboratorium',
  [Role.KASIR]: 'Kasir & Billing',
  [Role.ADMISI]: 'Admisi & Antrian',
  [Role.DRIVER]: 'IGD & Logistik',
  [Role.CSSD]: 'IGD & Logistik',
  [Role.IT_SUPPORT]: 'Overview',
  [Role.PASIEN]: 'Overview',
  doctor: 'DoctorDashboard',
  nurse: 'Rawat Inap',
  pharmacist: 'Farmasi',
  lab_tech: 'Laboratorium',
  cashier: 'Kasir & Billing',
  admission: 'Admisi & Antrian',
};

// Navigation items matching role-based permission requirements
export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'Overview',
    label: 'Overview',
    icon: 'grid',
    allowedRoles: ALL_ROLES,
    description: 'Dashboard utama, statistik operasional, dan indikator mutu RS',
  },
  {
    id: 'Admisi & Antrian',
    label: 'Admisi & Antrian',
    icon: 'users',
    allowedRoles: [Role.ADMIN, Role.ADMISI, Role.DIREKTUR],
    badge: '18 Antrean',
    description: 'Pendaftaran pasien baru/lama, bridging BPJS, dan antrean poli',
  },
  {
    id: 'Rekam Medis',
    label: 'Rekam Medis',
    icon: 'calendar',
    allowedRoles: [Role.DOKTER, Role.PERAWAT, Role.ADMIN, Role.DIREKTUR],
    badge: 'EMR Aktif',
    description: 'Pencatatan klinis, SOAP, ICD-10, vital signs, dan riwayat medis',
  },
  {
    id: 'Farmasi',
    label: 'Farmasi',
    icon: 'pill',
    allowedRoles: [Role.APOTEKER, Role.ADMIN, Role.DIREKTUR],
    badge: '4 Pending',
    description: 'Dispensing resep obat, stok inventaris depo, dan verifikasi etiket',
  },
  {
    id: 'Laboratorium',
    label: 'Laboratorium',
    icon: 'flask',
    allowedRoles: [Role.ANALIS_LAB, Role.ADMIN, Role.DIREKTUR],
    badge: '3 Sampel',
    description: 'Permintaan tes darah, kimia klinik, hematologi, dan verifikasi hasil',
  },
  {
    id: 'Kasir & Billing',
    label: 'Kasir & Billing',
    icon: 'wallet',
    allowedRoles: [Role.KASIR, Role.ADMIN, Role.DIREKTUR],
    badge: 'Rp 42.8M',
    description: 'Pembuatan invoice, kasir loket pembayaran, dan bridging klaim BPJS',
  },
  {
    id: 'IGD & Logistik',
    label: 'IGD & Logistik',
    icon: 'activity',
    allowedRoles: [Role.ADMIN, Role.DRIVER, Role.CSSD, Role.DIREKTUR],
    badge: '2 Standby',
    description: 'Pelayanan gawat darurat, penugasan ambulans, dan sterilisasi CSSD',
  },
  {
    id: 'Rawat Inap',
    label: 'Rawat Inap',
    icon: 'bed',
    allowedRoles: [Role.PERAWAT, Role.ADMIN, Role.DIREKTUR],
    badge: '82% BOR',
    description: 'Manajemen bangsal rawat inap, monitoring tempat tidur, dan sensus harian',
  },
  {
    id: 'Dokter & Staff',
    label: 'Dokter & Staff',
    icon: 'doctor',
    allowedRoles: [Role.ADMIN, Role.DIREKTUR],
    description: 'Direktori dokter spesialis, jadwal praktik, dan kepegawaian RS',
  },
  {
    id: 'Laporan',
    label: 'Laporan',
    icon: 'chart',
    allowedRoles: [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
    description: 'Laporan eksekutif, rekapitulasi pendapatan, RL 1-5 Kemenkes RI',
  },
  {
    id: 'Pengaturan',
    label: 'Pengaturan',
    icon: 'settings',
    allowedRoles: ALL_ROLES,
    description: 'Konfigurasi akun, hak akses role, preferensi notifikasi, dan profil RS',
  },
];

// Hospital Medical & Non-Medical Departments
export const DEPARTMENTS = [
  'Poli Umum & MCU',
  'Poli Penyakit Dalam (Sp.PD)',
  'Poli Anak (Sp.A)',
  'Poli Jantung & Pembuluh Darah (Sp.JP)',
  'Poli Kebidanan & Kandungan (Sp.OG)',
  'Poli Bedah & Ortopedi (Sp.OT)',
  'Poli Saraf & Neurologi (Sp.S)',
  'Poli Mata (Sp.M)',
  'Instalasi Gawat Darurat (IGD)',
  'Instalasi Rawat Inap (IRNA)',
  'Instalasi Farmasi',
  'Laboratorium Patologi Klinik',
  'Instalasi Radiologi',
  'Sentral Sterilisasi (CSSD)',
  'Kasir & Keuangan',
] as const;

// Status Constants matching backend constraints
export const ROOM_STATUS = {
  TERSEDIA: 'tersedia',
  TERISI: 'terisi',
  MAINTENANCE: 'maintenance',
  STERIL_CSSD: 'steril_cssd',
} as const;

export const APPOINTMENT_STATUS = {
  MENUNGGU: 'menunggu',
  DIPANGGIL: 'dipanggil',
  DIPERIKSA: 'diperiksa',
  SELESAI: 'selesai',
} as const;

export const PRESCRIPTION_STATUS = {
  PENDING: 'pending',
  DIPROSES: 'diproses',
  SELESAI: 'selesai',
} as const;

export const LAB_ORDER_STATUS = {
  PENDING: 'pending',
  DIPROSES: 'diproses',
  SELESAI: 'selesai',
} as const;

export const AMBULANCE_STATUS = {
  PENDING: 'pending',
  DIKIRIM: 'dikirim',
  SELESAI: 'selesai',
} as const;

export const BILLING_STATUS = {
  PENDING: 'pending',
  DIBAYAR: 'dibayar',
  KLAIM_BPJS: 'klaim_bpjs',
} as const;

// Aggregated STATUS Object
export const STATUS = {
  ROOM: ROOM_STATUS,
  APPOINTMENT: APPOINTMENT_STATUS,
  PRESCRIPTION: PRESCRIPTION_STATUS,
  LAB_ORDER: LAB_ORDER_STATUS,
  AMBULANCE: AMBULANCE_STATUS,
  BILLING: BILLING_STATUS,
} as const;

// Status Styling and Label Mappings (Tailwind CSS v4 friendly)
export const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; border: string; badge: string; dot: string; label: string }
> = {
  tersedia: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Tersedia',
  },
  terisi: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    label: 'Terisi',
  },
  maintenance: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    label: 'Pemeliharaan',
  },
  steril_cssd: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-50 text-purple-700 border border-purple-200',
    dot: 'bg-purple-500',
    label: 'Sterilisasi CSSD',
  },
  menunggu: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    label: 'Menunggu',
  },
  dipanggil: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-200',
    badge: 'bg-sky-50 text-sky-700 border border-sky-200',
    dot: 'bg-sky-500',
    label: 'Dipanggil',
  },
  diperiksa: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    dot: 'bg-indigo-500',
    label: 'Sedang Diperiksa',
  },
  selesai: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Selesai',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
    label: 'Menunggu Proses',
  },
  diproses: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
    label: 'Sedang Diproses',
  },
  dikirim: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    badge: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    dot: 'bg-cyan-500',
    label: 'Armada Dikirim',
  },
  dibayar: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    label: 'Lunas',
  },
  klaim_bpjs: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    badge: 'bg-teal-50 text-teal-700 border border-teal-200',
    dot: 'bg-teal-500',
    label: 'Klaim BPJS',
  },
};

// Role styling for badges and avatars
export const ROLE_COLORS: Record<Role, { bg: string; text: string; border: string }> = {
  [Role.ADMIN]: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' },
  [Role.DIREKTUR]: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  [Role.DOKTER]: { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
  [Role.PERAWAT]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  [Role.APOTEKER]: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  [Role.ANALIS_LAB]: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  [Role.RADIOGRAFER]: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  [Role.KASIR]: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  [Role.ADMISI]: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-300' },
  [Role.DRIVER]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  [Role.CSSD]: { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-300' },
  [Role.IT_SUPPORT]: { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-300' },
  [Role.PASIEN]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
};

// Hospital Profile Metadata
export const HOSPITAL_INFO = {
  name: 'RS Bhakti Digital',
  shortName: 'RSBD',
  tagline: 'Sistem Informasi Manajemen Rumah Sakit Terpadu',
  accreditation: 'Akreditasi Paripurna KARS Bintang 5',
  code: '3171045',
  branch: 'Pusat Jakarta Timur',
  address: 'Jl. Pemuda No. 45, Rawamangun, Jakarta Timur, DKI Jakarta 13220',
  phone: '(021) 489-7722',
  emergency: '119 / (021) 489-9119',
  email: 'layanan@rsbhaktidigital.id',
  director: 'dr. H. Hendrawan Sp.PK, MARS',
};


// ============================================================================
// Demo Users for Quick Login & Testing
// ============================================================================
export const DEMO_USERS: Record<string, any> = {
  admin: {
    id: 'usr-01',
    role_id: Role.ADMIN,
    role: 'admin',
    nama_lengkap: 'Bambang Sudibyo, S.Kom',
    name: 'Bambang Sudibyo, S.Kom',
    email: 'admin@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Teknologi Informasi & SIMRS',
  },
  direktur: {
    id: 'usr-02',
    role_id: Role.DIREKTUR,
    role: 'direktur',
    nama_lengkap: 'dr. Hendrawan S., Sp.B, MARS',
    name: 'dr. Hendrawan S., Sp.B, MARS',
    email: 'direktur@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Direksi Rumah Sakit',
  },
  doctor: {
    id: 'usr-03',
    role_id: Role.DOKTER,
    role: 'doctor',
    nama_lengkap: 'dr. Ratna Anindita, Sp.PD',
    name: 'dr. Ratna Anindita, Sp.PD',
    email: 'dokter@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Poliklinik Penyakit Dalam',
  },
  dokter: {
    id: 'usr-03',
    role_id: Role.DOKTER,
    role: 'dokter',
    nama_lengkap: 'dr. Ratna Anindita, Sp.PD',
    name: 'dr. Ratna Anindita, Sp.PD',
    email: 'dokter@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Poliklinik Penyakit Dalam',
  },
  nurse: {
    id: 'usr-04',
    role_id: Role.PERAWAT,
    role: 'nurse',
    nama_lengkap: 'Ns. Siti Rahayu, S.Kep',
    name: 'Ns. Siti Rahayu, S.Kep',
    email: 'perawat@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Rawat Inap Melati',
  },
  perawat: {
    id: 'usr-04',
    role_id: Role.PERAWAT,
    role: 'perawat',
    nama_lengkap: 'Ns. Siti Rahayu, S.Kep',
    name: 'Ns. Siti Rahayu, S.Kep',
    email: 'perawat@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Rawat Inap Melati',
  },
  pharmacy: {
    id: 'usr-05',
    role_id: Role.APOTEKER,
    role: 'pharmacy',
    nama_lengkap: 'apt. Dewi Sartika, S.Farm',
    name: 'apt. Dewi Sartika, S.Farm',
    email: 'apoteker@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Instalasi Farmasi',
  },
  apoteker: {
    id: 'usr-05',
    role_id: Role.APOTEKER,
    role: 'apoteker',
    nama_lengkap: 'apt. Dewi Sartika, S.Farm',
    name: 'apt. Dewi Sartika, S.Farm',
    email: 'apoteker@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Instalasi Farmasi',
  },
  laboratory: {
    id: 'usr-06',
    role_id: Role.ANALIS_LAB,
    role: 'laboratory',
    nama_lengkap: 'Hendra Gunawan, A.Md.AK',
    name: 'Hendra Gunawan, A.Md.AK',
    email: 'lab@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Laboratorium Patologi Klinik',
  },
  analis_lab: {
    id: 'usr-06',
    role_id: Role.ANALIS_LAB,
    role: 'analis_lab',
    nama_lengkap: 'Hendra Gunawan, A.Md.AK',
    name: 'Hendra Gunawan, A.Md.AK',
    email: 'lab@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Laboratorium Patologi Klinik',
  },
  cashier: {
    id: 'usr-08',
    role_id: Role.KASIR,
    role: 'cashier',
    nama_lengkap: 'Maya Anggraini, S.E.',
    name: 'Maya Anggraini, S.E.',
    email: 'kasir@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Keuangan & Kasir',
  },
  kasir: {
    id: 'usr-08',
    role_id: Role.KASIR,
    role: 'kasir',
    nama_lengkap: 'Maya Anggraini, S.E.',
    name: 'Maya Anggraini, S.E.',
    email: 'kasir@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Keuangan & Kasir',
  },
  admission: {
    id: 'usr-09',
    role_id: Role.ADMISI,
    role: 'admission',
    nama_lengkap: 'Agus Purnomo',
    name: 'Agus Purnomo',
    email: 'admisi@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Admisi & Rekam Medis',
  },
  admisi: {
    id: 'usr-09',
    role_id: Role.ADMISI,
    role: 'admisi',
    nama_lengkap: 'Agus Purnomo',
    name: 'Agus Purnomo',
    email: 'admisi@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Admisi & Rekam Medis',
  },
  radiografer: {
    id: 'usr-15',
    role_id: Role.RADIOGRAFER,
    role: 'radiografer',
    nama_lengkap: 'Yoga Ramadhan, A.Md.Rad',
    name: 'Yoga Ramadhan, A.Md.Rad',
    email: 'radio.yoga@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Instalasi Radiologi',
  },
  driver: {
    id: 'usr-18',
    role_id: Role.DRIVER,
    role: 'driver',
    nama_lengkap: 'Ujang Supriatna',
    name: 'Ujang Supriatna',
    email: 'driver.ujang@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Pelayanan Ambulans & Transport',
  },
  cssd: {
    id: 'usr-19',
    role_id: Role.CSSD,
    role: 'cssd',
    nama_lengkap: 'Dewi Puspita',
    name: 'Dewi Puspita',
    email: 'cssd.dewi@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'CSSD & Sentral Sterilisasi',
  },
  it_support: {
    id: 'usr-20',
    role_id: Role.IT_SUPPORT,
    role: 'it_support',
    nama_lengkap: 'Kevin Sanjaya, S.Kom',
    name: 'Kevin Sanjaya, S.Kom',
    email: 'it.kevin@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Teknologi Informasi & SIMRS',
  },
  pasien: {
    id: 'usr-21',
    role_id: Role.PASIEN,
    role: 'pasien',
    nama_lengkap: 'Siti Nurhaliza',
    name: 'Siti Nurhaliza',
    email: 'pasien.siti@rsbhaktidigital.id',
    password: 'demo',
    is_active: true,
    department: 'Portal Pasien Terpadu',
  },
};

// ============================================================================
// Navigation Items for Sidebar
// ============================================================================
export const NAV_ITEMS = [
  { label: 'Portal Modul', icon: 'grid', count: 'RBAC', roles: ['admin', 'direktur', 'doctor', 'dokter', 'nurse', 'perawat', 'pharmacy', 'apoteker', 'laboratory', 'analis_lab', 'cashier', 'kasir', 'admission', 'admisi', 'driver', 'cssd', 'it', 'it_support', 'patient', 'pasien'] },
  { label: 'Overview', icon: 'activity', count: undefined, roles: ['admin', 'direktur', 'doctor', 'dokter', 'nurse', 'perawat', 'pharmacy', 'apoteker', 'laboratory', 'analis_lab', 'cashier', 'kasir', 'admission', 'admisi', 'driver', 'cssd', 'it', 'it_support', 'patient', 'pasien'] },
  { label: 'Admisi & Antrian', icon: 'users', count: 18, roles: ['admin', 'direktur', 'admission', 'admisi'] },
  { label: 'Rekam Medis', icon: 'calendar', count: 'EMR', roles: ['admin', 'direktur', 'doctor', 'dokter', 'nurse', 'perawat'] },
  { label: 'Farmasi', icon: 'pill', count: 4, roles: ['admin', 'direktur', 'pharmacy', 'apoteker'] },
  { label: 'Laboratorium', icon: 'flask', count: 3, roles: ['admin', 'direktur', 'laboratory', 'analis_lab'] },
  { label: 'Kasir & Billing', icon: 'wallet', count: 'Rp42M', roles: ['admin', 'direktur', 'cashier', 'kasir'] },
  { label: 'IGD & Logistik', icon: 'activity', count: 2, roles: ['admin', 'direktur', 'driver', 'cssd'] },
  { label: 'Rawat Inap', icon: 'bed', count: '82%', roles: ['admin', 'direktur', 'nurse', 'perawat'] },
  { label: 'Dokter & Staff', icon: 'doctor', count: undefined, roles: ['admin', 'direktur'] },
  { label: 'Laporan', icon: 'chart', count: undefined, roles: ['admin', 'direktur', 'cashier', 'kasir'] },
  { label: 'Pengaturan', icon: 'settings', count: undefined, roles: ['admin', 'direktur', 'doctor', 'dokter', 'nurse', 'perawat', 'pharmacy', 'apoteker', 'laboratory', 'analis_lab', 'cashier', 'kasir', 'admission', 'admisi', 'driver', 'cssd', 'it', 'it_support', 'patient', 'pasien'] },
];
