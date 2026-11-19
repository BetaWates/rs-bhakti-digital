// ============================================================================
// RS Bhakti Digital SIMRS - Foundation Layer: TypeScript Definitions
// Database Models matching 14 SIMRS Core Tables & Application View Models
// ============================================================================

export enum Role {
  ADMIN = 'admin',
  DIREKTUR = 'direktur',
  DOKTER = 'dokter',
  PERAWAT = 'perawat',
  APOTEKER = 'apoteker',
  ANALIS_LAB = 'analis_lab',
  RADIOGRAFER = 'radiografer',
  KASIR = 'kasir',
  ADMISI = 'admisi',
  DRIVER = 'driver',
  CSSD = 'cssd',
  IT_SUPPORT = 'it_support',
  PASIEN = 'pasien',
}

// 1. User Account Table
export type User = {
  id: string;
  role_id: Role | string;
  role?: string;
  email: string;
  password_hash?: string;
  password?: string;
  is_active: boolean;
  nama_lengkap: string;
  name?: string;
  avatar?: string;
  department?: string;
  roleLabel?: string;
};

export type UserRole =
  | 'admin'
  | 'direktur'
  | 'dokter'
  | 'perawat'
  | 'apoteker'
  | 'analis_lab'
  | 'radiografer'
  | 'kasir'
  | 'admisi'
  | 'driver'
  | 'cssd'
  | 'it_support'
  | 'pasien'
  | 'doctor'
  | 'nurse'
  | 'pharmacy'
  | 'laboratory'
  | 'cashier'
  | 'admission'
  | 'it'
  | string;

// 2. Patient Master Table
export type Patient = {
  id: string;
  user_id?: string | null;
  no_rm: string;
  nik: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P' | 'Laki-laki' | 'Perempuan';
  alamat: string;
  no_telepon: string;
  no_bpjs?: string | null;
  kelas_bpjs?: 1 | 2 | 3 | null;

  // UI View Compatibility Aliases
  name?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  gender?: 'Laki-laki' | 'Perempuan' | 'L' | 'P';
  bloodType?: 'A' | 'B' | 'AB' | 'O';
  insuranceType?: string;
  bpjsNumber?: string;
  bpjsActive?: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  registeredAt?: string;
};

// 3. Doctor Profile Table
export type Doctor = {
  id: string;
  user_id?: string;
  sip?: string;
  nama_dokter?: string;
  spesialisasi?: string;
  jadwal_praktik?: Record<string, string> | any;
  name?: string;
  specialization?: string;
  specialty?: string;
  department?: string;
  available?: boolean;
  phone?: string;
  avatar?: string;
  roomNumber?: string;
};

// 4. Hospital Staff Profile Table
export type StaffProfile = {
  id: string;
  user_id?: string;
  nip?: string;
  nama_lengkap?: string;
  departemen?: string;
  no_telepon?: string;
  name?: string;
  role?: string;
};

// 5. Inpatient Room Table
export type Room = {
  id: string;
  nomor_kamar?: string;
  nama_bangsal?: string;
  kelas?: string;
  status: 'tersedia' | 'terisi' | 'maintenance' | 'steril_cssd' | 'Tersedia' | 'Penuh' | string;
  tarif_per_hari?: number;

  // UI View Compatibility Aliases
  number?: string;
  name?: string;
  ward?: string;
  capacity?: number;
  occupied?: number;
  pricePerDay?: number;
  features?: string[];
  patientList?: Array<{
    name: string;
    rm: string;
    admissionDate: string;
    diagnosis: string;
  }>;
};

// 6. Outpatient / Clinic Appointment Table
export type Appointment = {
  id: string;
  patient_id?: string;
  doctor_id?: string;
  tanggal_periksa?: string;
  nomor_antrean?: string;
  jenis_pembayaran?: 'umum' | 'bpjs' | string;
  status: 'menunggu' | 'dipanggil' | 'diperiksa' | 'selesai' | 'Menunggu' | 'Diproses' | 'Selesai' | string;

  // UI View Compatibility Aliases
  queueNumber?: string;
  patientId?: string;
  patientName?: string;
  doctorId?: string;
  doctorName?: string;
  department?: string;
  date?: string;
  time?: string;
  type?: 'Rawat Jalan' | 'IGD' | 'Konsultasi' | string;
  complaint?: string;
  notes?: string;
  priority?: 'Normal' | 'Urgent' | string;
};

// 7. Electronic Medical Record (EMR) Table
export type MedicalRecord = {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  keluhan_utama: string;
  diagnosa: string;
  tindakan: string;
  catatan_dokter: string;
  vital_signs?: VitalSigns;
  created_at: string;

  // UI View Compatibility Aliases
  date?: string;
  doctorName?: string;
  patientName?: string;
  diagnosis?: string;
  treatment?: string;
  doctorNotes?: string;
  status?: 'draft' | 'completed' | string;
};

// 8. Vital Signs Value Object Table
export type VitalSigns = {
  tekanan_darah?: string;
  suhu?: number;
  nadi?: number;
  respirasi?: number;
  berat_badan?: number;
  tinggi_badan?: number;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
};

// 9. Pharmacy Medicine Inventory Table
export type Medicine = {
  id: string;
  kode_obat?: string;
  nama_obat?: string;
  kategori?: string;
  category_id?: string | null;
  stok?: number;
  harga_satuan?: number;
  expired_date?: string;
  is_active?: boolean;
  deleted_at?: string | null;

  // UI View Compatibility Aliases
  name?: string;
  category?: string;
  stock?: number;
  minStock?: number;
  price?: number;
  unit?: string;
  form?: string;
  dosage?: string;
  expiryDate?: string;
  description?: string;
  requiresPrescription?: boolean;
};

// 9.1 Pharmacy Category Master Table
export type Category = {
  id: string;
  kode_kategori: string;
  nama_kategori: string;
  is_active: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// 10. Doctor Prescription Table
export type Prescription = {
  id: string;
  medical_record_id?: string;
  processed_by_staff_id?: string;
  status: 'pending' | 'diproses' | 'selesai' | 'Menunggu' | 'Diproses' | 'Siap' | 'Selesai' | 'Diserahkan' | string;

  // UI View Compatibility Aliases
  prescriptionNumber?: string;
  appointmentId?: string;
  patientId?: string;
  patientName?: string;
  doctorName?: string;
  date?: string;
  notes?: string;
  items?: PrescriptionItem[];
};

// 11. Prescription Line Item Detail Table
export type PrescriptionDetail = {
  id: string;
  prescription_id: string;
  medicine_id: string;
  jumlah: number;
  aturan_pakai: string;
};

// 12. Clinical Laboratory Test Order Table
export type LabOrder = {
  id: string;
  medical_record_id: string;
  processed_by_staff_id?: string;
  jenis_pemeriksaan: string;
  hasil_lab?: string;
  status: 'pending' | 'diproses' | 'selesai' | 'Menunggu' | 'Proses' | 'Selesai' | string;

  // UI View Compatibility Aliases
  orderNumber?: string;
  patientId?: string;
  patientName?: string;
  nama_pasien?: string;
  no_rm?: string;
  doctorName?: string;
  department?: string;
  notes?: string;
  testType?: string;
  orderedAt?: string;
  orderDate?: string;
  completedAt?: string;
  completedDate?: string;
  results?: LabResultItem[];
  priority?: 'Normal' | 'Cito' | string;
};

// 13. Emergency Ambulance Request Table
export type AmbulanceRequest = {
  id: string;
  patient_id: string;
  driver_staff_id?: string;
  jenis_kendaraan: string;
  lokasi_penjemputan: string;
  tujuan: string;
  status: 'pending' | 'dikirim' | 'selesai' | 'Menuju Lokasi' | 'Di Lokasi' | 'Membawa Pasien' | 'Selesai' | string;

  // UI View Compatibility Aliases
  code?: string;
  requesterName?: string;
  requesterPhone?: string;
  pickupLocation?: string;
  destination?: string;
  urgency?: 'Kritis (Merah)' | 'Mendesak (Kuning)' | 'Biasa (Hijau)' | string;
  driverName?: string;
  paramedicName?: string;
  vehiclePlate?: string;
  requestTime?: string;
  departureTime?: string;
  notes?: string;
};

// 14. Patient Billing & Payment Table
export type Billing = {
  id: string;
  patient_id?: string;
  appointment_id?: string;
  cashier_staff_id?: string;
  total_biaya?: number;
  cover_bpjs?: number;
  sisa_bayar_pasien?: number;
  status_pembayaran?: 'pending' | 'dibayar' | 'klaim_bpjs' | 'Belum Dibayar' | 'Lunas' | 'Klaim BPJS' | string;

  // UI View Compatibility Aliases
  invoiceNumber?: string;
  patientId?: string;
  patientName?: string;
  date?: string;
  totalAmount?: number;
  bpjsCoverage?: number;
  patientPay?: number;
  consultationFee?: number;
  labFee?: number;
  medicineFee?: number;
  actionFee?: number;
  roomFee?: number;
  insuranceType?: string;
  status?: string;
  paymentMethod?: 'QRIS' | 'Tunai' | 'Debit' | 'Kredit' | 'Transfer Bank' | 'Klaim BPJS Penuh' | string;
  cashierName?: string;
  paidAt?: string;
};

// ============================================================================
// SIMRS UI Navigation & Routing Types
// ============================================================================

export type PageName =
  | 'Overview'
  | 'Admisi & Antrian'
  | 'Rekam Medis'
  | 'Farmasi'
  | 'Laboratorium'
  | 'Kasir & Billing'
  | 'IGD & Logistik'
  | 'Rawat Inap'
  | 'Dokter & Staff'
  | 'Laporan'
  | 'Pengaturan'
  | 'DoctorDashboard';

export interface NavigationItem {
  id: PageName;
  label: PageName;
  icon: string;
  allowedRoles: Role[];
  badge?: string | number;
  description?: string;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage?: string;
  frequency: string;
  quantity: number;
  instructions?: string;
}

export interface LabResultItem {
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical' | 'Borderline' | 'Tinggi' | 'Rendah' | string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export type IconName =
  | 'grid'
  | 'users'
  | 'calendar'
  | 'doctor'
  | 'bed'
  | 'pill'
  | 'flask'
  | 'wallet'
  | 'chart'
  | 'settings'
  | 'help'
  | 'search'
  | 'chevron'
  | 'bell'
  | 'plus'
  | 'arrow'
  | 'download'
  | 'filter'
  | 'close'
  | 'check'
  | 'check-circle'
  | 'clock'
  | 'logout'
  | 'menu'
  | 'hospital'
  | 'activity'
  | 'ambulance'
  | 'shield'
  | 'heart'
  | 'stethoscope'
  | 'syringe'
  | 'clipboard'
  | 'truck'
  | 'key'
  | 'eye'
  | 'eyeOff'
  | 'mail'
  | 'phone'
  | 'mapPin'
  | 'alertCircle'
  | 'info'
  | 'refreshCw'
  | 'printer'
  | 'fileText'
  | 'userPlus'
  | 'logIn'
  | 'home'
  | 'barChart'
  | 'package'
  | 'thermometer'
  | 'droplet'
  | 'zap'
  | 'save'
  | 'edit'
  | 'trash'
  | string;
