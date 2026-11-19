// ============================================================================
// RS Bhakti Digital SIMRS - Backend Entity Types (14 Core Tables)
// ============================================================================

export type RoleName =
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
  | 'pasien';

export interface RoleEntity {
  id: string;
  nama_role: RoleName;
  deskripsi?: string;
  created_at: string;
  updated_at: string;
}

export interface UserEntity {
  id: string;
  role_id: string;
  email: string;
  password_hash: string;
  nama_lengkap: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PatientEntity {
  id: string;
  user_id?: string | null;
  no_rm: string;
  nik: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  no_telepon: string;
  no_bpjs?: string | null;
  kelas_bpjs?: 1 | 2 | 3 | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorEntity {
  id: string;
  user_id: string;
  sip: string;
  nama_dokter: string;
  spesialisasi: string;
  jadwal_praktik: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface StaffProfileEntity {
  id: string;
  user_id: string;
  nip: string;
  nama_lengkap: string;
  departemen: string;
  no_telepon: string;
  created_at: string;
  updated_at: string;
}

export interface RoomEntity {
  id: string;
  nomor_kamar: string;
  nama_bangsal: string;
  kelas: string;
  status: 'tersedia' | 'terisi' | 'maintenance' | 'steril_cssd';
  tarif_per_hari: number;
  created_at: string;
  updated_at: string;
}

export interface AppointmentEntity {
  id: string;
  patient_id: string;
  doctor_id: string;
  tanggal_periksa: string;
  nomor_antrean: string;
  jenis_pembayaran: 'umum' | 'bpjs';
  status: 'menunggu' | 'dipanggil' | 'diperiksa' | 'selesai';
  created_at: string;
  updated_at: string;
}

export interface MedicalRecordEntity {
  id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  keluhan_utama: string;
  diagnosa: string;
  tindakan: string;
  catatan_dokter?: string | null;
  vital_signs?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface MedicineEntity {
  id: string;
  kode_obat: string;
  nama_obat: string;
  kategori: string;
  category_id?: string | null;
  stok: number;
  harga_satuan: number;
  expired_date: string;
  is_active?: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionEntity {
  id: string;
  medical_record_id: string;
  processed_by_staff_id?: string | null;
  status: 'pending' | 'diproses' | 'selesai';
  created_at: string;
  updated_at: string;
}

export interface PrescriptionDetailEntity {
  id: string;
  prescription_id: string;
  medicine_id: string;
  jumlah: number;
  aturan_pakai: string;
  created_at: string;
}

export interface LabOrderEntity {
  id: string;
  medical_record_id: string;
  processed_by_staff_id?: string | null;
  jenis_pemeriksaan: string;
  hasil_lab?: string | null;
  status: 'pending' | 'diproses' | 'selesai';
  created_at: string;
  updated_at: string;
}

export interface AmbulanceRequestEntity {
  id: string;
  patient_id: string;
  driver_staff_id?: string | null;
  jenis_kendaraan: string;
  lokasi_penjemputan: string;
  tujuan: string;
  status: 'pending' | 'dikirim' | 'selesai';
  created_at: string;
  updated_at: string;
}

export interface BillingEntity {
  id: string;
  patient_id: string;
  appointment_id: string;
  cashier_staff_id?: string | null;
  total_biaya: number;
  cover_bpjs: number;
  sisa_bayar_pasien: number;
  status_pembayaran: 'pending' | 'dibayar' | 'klaim_bpjs';
  created_at: string;
  updated_at: string;
}

export interface CategoryEntity {
  id: string;
  kode_kategori: string;
  nama_kategori: string;
  is_active: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

