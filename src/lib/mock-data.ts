// ============================================================================
// RS Bhakti Digital SIMRS - Foundation Layer: Realistic Mock Dataset
// Relational Hospital Data: Users, Patients, Doctors, Staff, Rooms,
// Appointments, EMR, Prescriptions, Medicines, Lab, Ambulance, and Billing
// ============================================================================

import {
  Role,
  type User,
  type Patient,
  type Doctor,
  type StaffProfile,
  type Room,
  type Appointment,
  type MedicalRecord,
  type Medicine,
  type Prescription,
  type PrescriptionDetail,
  type LabOrder,
  type AmbulanceRequest,
  type Billing,
} from '@/lib/types';

// ============================================================================
// 1. System Users (21 Accounts across all 13 Roles)
// ============================================================================
export const MOCK_USERS: User[] = [
  {
    id: 'usr-01',
    role_id: Role.ADMIN,
    email: 'admin@rsbhaktidigital.id',
    password_hash: 'admin123',
    is_active: true,
    nama_lengkap: 'Bambang Sudibyo, S.Kom',
  },
  {
    id: 'usr-02',
    role_id: Role.DIREKTUR,
    email: 'direktur@rsbhaktidigital.id',
    password_hash: 'direktur123',
    is_active: true,
    nama_lengkap: 'dr. H. Hendrawan Sp.PK, MARS',
  },
  {
    id: 'usr-03',
    role_id: Role.DOKTER,
    email: 'dr.andi@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Andi Pratama, Sp.JP',
  },
  {
    id: 'usr-04',
    role_id: Role.DOKTER,
    email: 'dr.maya@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Maya Indriani, Sp.PD',
  },
  {
    id: 'usr-05',
    role_id: Role.DOKTER,
    email: 'dr.sarah@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Sarah Dewi, Sp.A',
  },
  {
    id: 'usr-06',
    role_id: Role.DOKTER,
    email: 'dr.rina@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Rina Wijaya, Sp.OG',
  },
  {
    id: 'usr-07',
    role_id: Role.DOKTER,
    email: 'dr.rizky@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Rizky Putra, Sp.OT',
  },
  {
    id: 'usr-08',
    role_id: Role.DOKTER,
    email: 'dr.bagus@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Bagus Santoso, Sp.S',
  },
  {
    id: 'usr-09',
    role_id: Role.DOKTER,
    email: 'dr.citra@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Citra Kirana, Sp.M',
  },
  {
    id: 'usr-10',
    role_id: Role.DOKTER,
    email: 'dr.budi@rsbhaktidigital.id',
    password_hash: 'dokter123',
    is_active: true,
    nama_lengkap: 'dr. Budi Setiawan',
  },
  {
    id: 'usr-11',
    role_id: Role.PERAWAT,
    email: 'perawat.ani@rsbhaktidigital.id',
    password_hash: 'perawat123',
    is_active: true,
    nama_lengkap: 'Ns. Ani Suryani, S.Kep',
  },
  {
    id: 'usr-12',
    role_id: Role.PERAWAT,
    email: 'perawat.joko@rsbhaktidigital.id',
    password_hash: 'perawat123',
    is_active: true,
    nama_lengkap: 'Ns. Joko Prasetyo, S.Kep',
  },
  {
    id: 'usr-13',
    role_id: Role.APOTEKER,
    email: 'apoteker.linda@rsbhaktidigital.id',
    password_hash: 'apotek123',
    is_active: true,
    nama_lengkap: 'apt. Linda Kusuma, S.Farm',
  },
  {
    id: 'usr-14',
    role_id: Role.ANALIS_LAB,
    email: 'lab.dimas@rsbhaktidigital.id',
    password_hash: 'lab12345',
    is_active: true,
    nama_lengkap: 'Dimas Arya, A.Md.AK',
  },
  {
    id: 'usr-15',
    role_id: Role.RADIOGRAFER,
    email: 'radio.yoga@rsbhaktidigital.id',
    password_hash: 'radio123',
    is_active: true,
    nama_lengkap: 'Yoga Ramadhan, A.Md.Rad',
  },
  {
    id: 'usr-16',
    role_id: Role.KASIR,
    email: 'kasir.tina@rsbhaktidigital.id',
    password_hash: 'kasir123',
    is_active: true,
    nama_lengkap: 'Tina Agustina, S.Ak',
  },
  {
    id: 'usr-17',
    role_id: Role.ADMISI,
    email: 'admisi.fajar@rsbhaktidigital.id',
    password_hash: 'admisi123',
    is_active: true,
    nama_lengkap: 'Fajar Nugraha, S.Sos',
  },
  {
    id: 'usr-18',
    role_id: Role.DRIVER,
    email: 'driver.ujang@rsbhaktidigital.id',
    password_hash: 'driver123',
    is_active: true,
    nama_lengkap: 'Ujang Supriatna',
  },
  {
    id: 'usr-19',
    role_id: Role.CSSD,
    email: 'cssd.dewi@rsbhaktidigital.id',
    password_hash: 'cssd1234',
    is_active: true,
    nama_lengkap: 'Dewi Puspita',
  },
  {
    id: 'usr-20',
    role_id: Role.IT_SUPPORT,
    email: 'it.kevin@rsbhaktidigital.id',
    password_hash: 'it123456',
    is_active: true,
    nama_lengkap: 'Kevin Sanjaya, S.Kom',
  },
  {
    id: 'usr-21',
    role_id: Role.PASIEN,
    email: 'pasien.siti@rsbhaktidigital.id',
    password_hash: 'pasien123',
    is_active: true,
    nama_lengkap: 'Siti Nurhaliza',
  },
];

// ============================================================================
// 2. Doctor Profiles (8 Specialists and General Practitioners)
// ============================================================================
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-01',
    user_id: 'usr-03',
    sip: '503/SIP.DOK/2021/00142',
    nama_dokter: 'dr. Andi Pratama, Sp.JP',
    spesialisasi: 'Spesialis Jantung & Pembuluh Darah',
    jadwal_praktik: {
      Senin: '08:00 - 12:00 WIB',
      Rabu: '08:00 - 12:00 WIB',
      Jumat: '08:00 - 11:30 WIB',
    },
  },
  {
    id: 'doc-02',
    user_id: 'usr-04',
    sip: '503/SIP.DOK/2020/00231',
    nama_dokter: 'dr. Maya Indriani, Sp.PD',
    spesialisasi: 'Spesialis Penyakit Dalam',
    jadwal_praktik: {
      Senin: '13:00 - 17:00 WIB',
      Selasa: '09:00 - 14:00 WIB',
      Kamis: '09:00 - 14:00 WIB',
    },
  },
  {
    id: 'doc-03',
    user_id: 'usr-05',
    sip: '503/SIP.DOK/2022/00388',
    nama_dokter: 'dr. Sarah Dewi, Sp.A',
    spesialisasi: 'Spesialis Kesehatan Anak (Pediatri)',
    jadwal_praktik: {
      'Senin - Kamis': '08:30 - 13:00 WIB',
      Sabtu: '09:00 - 12:00 WIB',
    },
  },
  {
    id: 'doc-04',
    user_id: 'usr-06',
    sip: '503/SIP.DOK/2019/00095',
    nama_dokter: 'dr. Rina Wijaya, Sp.OG',
    spesialisasi: 'Spesialis Kebidanan & Kandungan',
    jadwal_praktik: {
      Selasa: '14:00 - 18:00 WIB',
      Kamis: '14:00 - 18:00 WIB',
      Sabtu: '10:00 - 14:00 WIB',
    },
  },
  {
    id: 'doc-05',
    user_id: 'usr-07',
    sip: '503/SIP.DOK/2021/00412',
    nama_dokter: 'dr. Rizky Putra, Sp.OT',
    spesialisasi: 'Spesialis Bedah Ortopedi & Traumatologi',
    jadwal_praktik: {
      Senin: '10:00 - 15:00 WIB',
      Rabu: '10:00 - 15:00 WIB',
      Kamis: '10:00 - 15:00 WIB',
    },
  },
  {
    id: 'doc-06',
    user_id: 'usr-08',
    sip: '503/SIP.DOK/2020/00567',
    nama_dokter: 'dr. Bagus Santoso, Sp.S',
    spesialisasi: 'Spesialis Neurologi (Saraf)',
    jadwal_praktik: {
      Selasa: '08:00 - 12:00 WIB',
      Jumat: '13:00 - 16:30 WIB',
    },
  },
  {
    id: 'doc-07',
    user_id: 'usr-09',
    sip: '503/SIP.DOK/2023/00619',
    nama_dokter: 'dr. Citra Kirana, Sp.M',
    spesialisasi: 'Spesialis Mata (Oftalmologi)',
    jadwal_praktik: {
      Rabu: '08:00 - 12:00 WIB',
      Kamis: '08:00 - 12:00 WIB',
      Sabtu: '08:00 - 11:00 WIB',
    },
  },
  {
    id: 'doc-08',
    user_id: 'usr-10',
    sip: '503/SIP.DOK/2022/00701',
    nama_dokter: 'dr. Budi Setiawan',
    spesialisasi: 'Dokter Umum & Gawat Darurat (IGD)',
    jadwal_praktik: {
      'Shift Pagi': '07:00 - 14:00 WIB',
      'Shift Sore': '14:00 - 21:00 WIB',
      'Shift Malam': '21:00 - 07:00 WIB',
    },
  },
];

// ============================================================================
// 3. Hospital Staff Profiles (11 Staff Members)
// ============================================================================
export const MOCK_STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'staff-01',
    user_id: 'usr-11',
    nip: '198904122014022001',
    nama_lengkap: 'Ns. Ani Suryani, S.Kep',
    departemen: 'Instalasi Rawat Inap (IRNA)',
    no_telepon: '081288990011',
  },
  {
    id: 'staff-02',
    user_id: 'usr-12',
    nip: '199108252015031002',
    nama_lengkap: 'Ns. Joko Prasetyo, S.Kep',
    departemen: 'Instalasi Gawat Darurat (IGD)',
    no_telepon: '081377881122',
  },
  {
    id: 'staff-03',
    user_id: 'usr-13',
    nip: '199203152016042003',
    nama_lengkap: 'apt. Linda Kusuma, S.Farm',
    departemen: 'Instalasi Farmasi',
    no_telepon: '081766554433',
  },
  {
    id: 'staff-04',
    user_id: 'usr-14',
    nip: '199311092017011004',
    nama_lengkap: 'Dimas Arya, A.Md.AK',
    departemen: 'Laboratorium Patologi Klinik',
    no_telepon: '081544332211',
  },
  {
    id: 'staff-05',
    user_id: 'usr-15',
    nip: '199006182015021005',
    nama_lengkap: 'Yoga Ramadhan, A.Md.Rad',
    departemen: 'Instalasi Radiologi',
    no_telepon: '081233445566',
  },
  {
    id: 'staff-06',
    user_id: 'usr-16',
    nip: '199405022018032006',
    nama_lengkap: 'Tina Agustina, S.Ak',
    departemen: 'Kasir & Keuangan',
    no_telepon: '081399887766',
  },
  {
    id: 'staff-07',
    user_id: 'usr-17',
    nip: '199512142019011007',
    nama_lengkap: 'Fajar Nugraha, S.Sos',
    departemen: 'Admisi & Rekam Medis',
    no_telepon: '081822334455',
  },
  {
    id: 'staff-08',
    user_id: 'usr-18',
    nip: '198707012012031008',
    nama_lengkap: 'Ujang Supriatna',
    departemen: 'Pelayanan Ambulans & Transport',
    no_telepon: '081677665544',
  },
  {
    id: 'staff-09',
    user_id: 'usr-19',
    nip: '199209192016022009',
    nama_lengkap: 'Dewi Puspita',
    departemen: 'CSSD & Sentral Sterilisasi',
    no_telepon: '081911223344',
  },
  {
    id: 'staff-10',
    user_id: 'usr-20',
    nip: '199602282020011010',
    nama_lengkap: 'Kevin Sanjaya, S.Kom',
    departemen: 'Teknologi Informasi (IT)',
    no_telepon: '081255667788',
  },
  {
    id: 'staff-11',
    user_id: 'usr-01',
    nip: '198501102010011001',
    nama_lengkap: 'Bambang Sudibyo, S.Kom',
    departemen: 'Administrator Sistem SIMRS',
    no_telepon: '081122334455',
  },
];

// ============================================================================
// 4. Indonesian Patients (14 Patients with NIK, No RM, & BPJS)
// ============================================================================
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-01',
    user_id: 'usr-21',
    no_rm: 'RM-002481',
    nik: '3171014503920001',
    nama_lengkap: 'Siti Nurhaliza',
    tanggal_lahir: '1992-03-15',
    jenis_kelamin: 'P',
    alamat: 'Jl. Kayu Putih Tengah No. 12, Pulo Gadung, Jakarta Timur',
    no_telepon: '081288990011',
    no_bpjs: '0001234567891',
    kelas_bpjs: 1,
  },
  {
    id: 'pat-02',
    no_rm: 'RM-002482',
    nik: '3171021208790002',
    nama_lengkap: 'Budi Santoso',
    tanggal_lahir: '1979-08-12',
    jenis_kelamin: 'L',
    alamat: 'Jl. Balai Pustaka Timur No. 4A, Rawamangun, Jakarta Timur',
    no_telepon: '081377881122',
    no_bpjs: '0001234567892',
    kelas_bpjs: 2,
  },
  {
    id: 'pat-03',
    no_rm: 'RM-002483',
    nik: '3171035506960003',
    nama_lengkap: 'Dewi Lestari',
    tanggal_lahir: '1996-06-25',
    jenis_kelamin: 'P',
    alamat: 'Jl. Cipinang Muara III No. 8, Jatinegara, Jakarta Timur',
    no_telepon: '081766554433',
    no_bpjs: '0001234567893',
    kelas_bpjs: 1,
  },
  {
    id: 'pat-04',
    no_rm: 'RM-002484',
    nik: '3171042004680004',
    nama_lengkap: 'Ahmad Fauzi',
    tanggal_lahir: '1968-04-20',
    jenis_kelamin: 'L',
    alamat: 'Jl. Percetakan Negara II No. 15, Johar Baru, Jakarta Pusat',
    no_telepon: '081544332211',
    no_bpjs: '0001234567894',
    kelas_bpjs: 3,
  },
  {
    id: 'pat-05',
    no_rm: 'RM-002485',
    nik: '3171056211160005',
    nama_lengkap: 'Putri Maharani',
    tanggal_lahir: '2016-11-22',
    jenis_kelamin: 'P',
    alamat: 'Jl. Pramuka Raya No. 45, Utan Kayu, Jakarta Timur',
    no_telepon: '081233445566',
  },
  {
    id: 'pat-06',
    no_rm: 'RM-002486',
    nik: '3171061402830006',
    nama_lengkap: 'Hendra Wijaya',
    tanggal_lahir: '1983-02-14',
    jenis_kelamin: 'L',
    alamat: 'Jl. Matraman Raya No. 88, Matraman, Jakarta Timur',
    no_telepon: '081399887766',
    no_bpjs: '0001234567896',
    kelas_bpjs: 2,
  },
  {
    id: 'pat-07',
    no_rm: 'RM-002487',
    nik: '3171074809880007',
    nama_lengkap: 'Rina Anggraini',
    tanggal_lahir: '1988-09-18',
    jenis_kelamin: 'P',
    alamat: 'Jl. Pisangan Lama No. 22, Pulo Gadung, Jakarta Timur',
    no_telepon: '081822334455',
    no_bpjs: '0001234567897',
    kelas_bpjs: 1,
  },
  {
    id: 'pat-08',
    no_rm: 'RM-002488',
    nik: '3171080512620008',
    nama_lengkap: 'Agus Setiawan',
    tanggal_lahir: '1962-12-05',
    jenis_kelamin: 'L',
    alamat: 'Jl. Rawasari Barat No. 19, Cempaka Putih, Jakarta Pusat',
    no_telepon: '081677665544',
    no_bpjs: '0001234567898',
    kelas_bpjs: 3,
  },
  {
    id: 'pat-09',
    no_rm: 'RM-002489',
    nik: '3171097001010009',
    nama_lengkap: 'Nadia Safitri',
    tanggal_lahir: '2001-01-30',
    jenis_kelamin: 'P',
    alamat: 'Jl. Pemuda Asli No. 3, Pulo Gadung, Jakarta Timur',
    no_telepon: '081911223344',
    no_bpjs: '0001234567899',
    kelas_bpjs: 2,
  },
  {
    id: 'pat-10',
    no_rm: 'RM-002490',
    nik: '3171101905750010',
    nama_lengkap: 'Bambang Irawan',
    tanggal_lahir: '1975-05-19',
    jenis_kelamin: 'L',
    alamat: 'Jl. D.I. Panjaitan Kav. 14, Cipinang Cempedak, Jakarta Timur',
    no_telepon: '081255667788',
  },
  {
    id: 'pat-11',
    no_rm: 'RM-002491',
    nik: '3171115307940011',
    nama_lengkap: 'Eka Nurjanah',
    tanggal_lahir: '1994-07-13',
    jenis_kelamin: 'P',
    alamat: 'Jl. Utan Kayu Raya No. 102, Matraman, Jakarta Timur',
    no_telepon: '081344556677',
    no_bpjs: '0001234567901',
    kelas_bpjs: 3,
  },
  {
    id: 'pat-12',
    no_rm: 'RM-002492',
    nik: '3171122810550012',
    nama_lengkap: 'Supardi Hartono',
    tanggal_lahir: '1955-10-28',
    jenis_kelamin: 'L',
    alamat: 'Jl. Cempaka Putih Tengah No. 34, Jakarta Pusat',
    no_telepon: '081512345678',
    no_bpjs: '0001234567902',
    kelas_bpjs: 1,
  },
  {
    id: 'pat-13',
    no_rm: 'RM-002493',
    nik: '3171136104990013',
    nama_lengkap: 'Anisa Tri Wahyuni',
    tanggal_lahir: '1999-04-21',
    jenis_kelamin: 'P',
    alamat: 'Jl. Sunan Giri No. 5B, Rawamangun, Jakarta Timur',
    no_telepon: '081733221100',
  },
  {
    id: 'pat-14',
    no_rm: 'RM-002494',
    nik: '3171141006850014',
    nama_lengkap: 'Herman Susilo',
    tanggal_lahir: '1985-06-10',
    jenis_kelamin: 'L',
    alamat: 'Jl. Nangka Raya No. 40, Utan Kayu Utara, Jakarta Timur',
    no_telepon: '081299001122',
    no_bpjs: '0001234567904',
    kelas_bpjs: 2,
  },
];

// ============================================================================
// 5. Inpatient Hospital Rooms (24 Rooms across Mawar, Melati, Dahlia, ICU, VIP)
// ============================================================================
export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-01',
    nomor_kamar: '101',
    nama_bangsal: 'Mawar (Kebidanan & Kandungan)',
    kelas: 'Kelas 1',
    status: 'tersedia',
    tarif_per_hari: 450000,
  },
  {
    id: 'room-02',
    nomor_kamar: '102',
    nama_bangsal: 'Mawar (Kebidanan & Kandungan)',
    kelas: 'Kelas 1',
    status: 'terisi',
    tarif_per_hari: 450000,
  },
  {
    id: 'room-03',
    nomor_kamar: '103',
    nama_bangsal: 'Mawar (Kebidanan & Kandungan)',
    kelas: 'Kelas 2',
    status: 'tersedia',
    tarif_per_hari: 300000,
  },
  {
    id: 'room-04',
    nomor_kamar: '104',
    nama_bangsal: 'Mawar (Kebidanan & Kandungan)',
    kelas: 'Kelas 2',
    status: 'terisi',
    tarif_per_hari: 300000,
  },
  {
    id: 'room-05',
    nomor_kamar: '105',
    nama_bangsal: 'Mawar (Kebidanan & Kandungan)',
    kelas: 'Kelas 3',
    status: 'terisi',
    tarif_per_hari: 175000,
  },
  {
    id: 'room-06',
    nomor_kamar: '201',
    nama_bangsal: 'Melati (Anak & Pediatri)',
    kelas: 'Kelas 1',
    status: 'tersedia',
    tarif_per_hari: 450000,
  },
  {
    id: 'room-07',
    nomor_kamar: '202',
    nama_bangsal: 'Melati (Anak & Pediatri)',
    kelas: 'Kelas 1',
    status: 'maintenance',
    tarif_per_hari: 450000,
  },
  {
    id: 'room-08',
    nomor_kamar: '203',
    nama_bangsal: 'Melati (Anak & Pediatri)',
    kelas: 'Kelas 2',
    status: 'terisi',
    tarif_per_hari: 300000,
  },
  {
    id: 'room-09',
    nomor_kamar: '204',
    nama_bangsal: 'Melati (Anak & Pediatri)',
    kelas: 'Kelas 2',
    status: 'tersedia',
    tarif_per_hari: 300000,
  },
  {
    id: 'room-10',
    nomor_kamar: '205',
    nama_bangsal: 'Melati (Anak & Pediatri)',
    kelas: 'Kelas 3',
    status: 'terisi',
    tarif_per_hari: 175000,
  },
  {
    id: 'room-11',
    nomor_kamar: '301',
    nama_bangsal: 'Dahlia (Penyakit Dalam & Bedah)',
    kelas: 'Kelas 1',
    status: 'terisi',
    tarif_per_hari: 450000,
  },
  {
    id: 'room-12',
    nomor_kamar: '302',
    nama_bangsal: 'Dahlia (Penyakit Dalam & Bedah)',
    kelas: 'Kelas 1',
    status: 'tersedia',
    tarif_per_hari: 450000,
  },
  {
    id: 'room-13',
    nomor_kamar: '303',
    nama_bangsal: 'Dahlia (Penyakit Dalam & Bedah)',
    kelas: 'Kelas 2',
    status: 'steril_cssd',
    tarif_per_hari: 300000,
  },
  {
    id: 'room-14',
    nomor_kamar: '304',
    nama_bangsal: 'Dahlia (Penyakit Dalam & Bedah)',
    kelas: 'Kelas 2',
    status: 'terisi',
    tarif_per_hari: 300000,
  },
  {
    id: 'room-15',
    nomor_kamar: '305',
    nama_bangsal: 'Dahlia (Penyakit Dalam & Bedah)',
    kelas: 'Kelas 3',
    status: 'tersedia',
    tarif_per_hari: 175000,
  },
  {
    id: 'room-16',
    nomor_kamar: '306',
    nama_bangsal: 'Dahlia (Penyakit Dalam & Bedah)',
    kelas: 'Kelas 3',
    status: 'terisi',
    tarif_per_hari: 175000,
  },
  {
    id: 'room-17',
    nomor_kamar: 'ICU-01',
    nama_bangsal: 'ICU (Intensive Care Unit)',
    kelas: 'Intensive Care',
    status: 'terisi',
    tarif_per_hari: 1500000,
  },
  {
    id: 'room-18',
    nomor_kamar: 'ICU-02',
    nama_bangsal: 'ICU (Intensive Care Unit)',
    kelas: 'Intensive Care',
    status: 'terisi',
    tarif_per_hari: 1500000,
  },
  {
    id: 'room-19',
    nomor_kamar: 'ICU-03',
    nama_bangsal: 'ICU (Intensive Care Unit)',
    kelas: 'Intensive Care',
    status: 'tersedia',
    tarif_per_hari: 1500000,
  },
  {
    id: 'room-20',
    nomor_kamar: 'ICU-04',
    nama_bangsal: 'ICU (Intensive Care Unit)',
    kelas: 'Intensive Care',
    status: 'maintenance',
    tarif_per_hari: 1500000,
  },
  {
    id: 'room-21',
    nomor_kamar: 'VIP-01',
    nama_bangsal: 'Paviliun Kartini (VIP)',
    kelas: 'VIP Utama',
    status: 'terisi',
    tarif_per_hari: 950000,
  },
  {
    id: 'room-22',
    nomor_kamar: 'VIP-02',
    nama_bangsal: 'Paviliun Kartini (VIP)',
    kelas: 'VIP Utama',
    status: 'tersedia',
    tarif_per_hari: 950000,
  },
  {
    id: 'room-23',
    nomor_kamar: 'VVIP-01',
    nama_bangsal: 'Paviliun Kartini (VVIP)',
    kelas: 'VVIP Presidential Suite',
    status: 'tersedia',
    tarif_per_hari: 1750000,
  },
  {
    id: 'room-24',
    nomor_kamar: 'VVIP-02',
    nama_bangsal: 'Paviliun Kartini (VVIP)',
    kelas: 'VVIP Presidential Suite',
    status: 'terisi',
    tarif_per_hari: 1750000,
  },
];

// ============================================================================
// 6. Clinic Appointments (16 Appointments for Today's Schedule)
// ============================================================================
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    patient_id: 'pat-01',
    doctor_id: 'doc-01',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'A-001',
    jenis_pembayaran: 'bpjs',
    status: 'selesai',
  },
  {
    id: 'apt-02',
    patient_id: 'pat-02',
    doctor_id: 'doc-02',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'B-001',
    jenis_pembayaran: 'bpjs',
    status: 'selesai',
  },
  {
    id: 'apt-03',
    patient_id: 'pat-03',
    doctor_id: 'doc-04',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'C-001',
    jenis_pembayaran: 'bpjs',
    status: 'diperiksa',
  },
  {
    id: 'apt-04',
    patient_id: 'pat-04',
    doctor_id: 'doc-05',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'D-001',
    jenis_pembayaran: 'bpjs',
    status: 'diperiksa',
  },
  {
    id: 'apt-05',
    patient_id: 'pat-05',
    doctor_id: 'doc-03',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'E-001',
    jenis_pembayaran: 'umum',
    status: 'dipanggil',
  },
  {
    id: 'apt-06',
    patient_id: 'pat-06',
    doctor_id: 'doc-02',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'B-002',
    jenis_pembayaran: 'bpjs',
    status: 'dipanggil',
  },
  {
    id: 'apt-07',
    patient_id: 'pat-07',
    doctor_id: 'doc-01',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'A-002',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-08',
    patient_id: 'pat-08',
    doctor_id: 'doc-05',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'D-002',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-09',
    patient_id: 'pat-09',
    doctor_id: 'doc-06',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'F-001',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-10',
    patient_id: 'pat-10',
    doctor_id: 'doc-07',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'G-001',
    jenis_pembayaran: 'umum',
    status: 'menunggu',
  },
  {
    id: 'apt-11',
    patient_id: 'pat-11',
    doctor_id: 'doc-04',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'C-002',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-12',
    patient_id: 'pat-12',
    doctor_id: 'doc-01',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'A-003',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-13',
    patient_id: 'pat-13',
    doctor_id: 'doc-08',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'U-001',
    jenis_pembayaran: 'umum',
    status: 'menunggu',
  },
  {
    id: 'apt-14',
    patient_id: 'pat-14',
    doctor_id: 'doc-02',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'B-003',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-15',
    patient_id: 'pat-01',
    doctor_id: 'doc-02',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'B-004',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
  {
    id: 'apt-16',
    patient_id: 'pat-03',
    doctor_id: 'doc-07',
    tanggal_periksa: '2026-11-14',
    nomor_antrean: 'G-002',
    jenis_pembayaran: 'bpjs',
    status: 'menunggu',
  },
];

// ============================================================================
// 7. Electronic Medical Records (EMR)
// ============================================================================
export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'mr-01',
    appointment_id: 'apt-01',
    patient_id: 'pat-01',
    doctor_id: 'doc-01',
    keluhan_utama: 'Nyeri dada kiri seperti tertimpa beban berat sejak 2 hari, menjalar ke bahu',
    diagnosa: 'I20.9 - Angina Pectoris, Unspecified / CAD Susp.',
    tindakan: 'Pemeriksaan EKG 12 Lead, Lab Profil Lipid, Pemberian edukasi tirah baring',
    catatan_dokter: 'Pasien stabil pasca evaluasi EKG tanpa elevasi ST segmen akut. Teruskan terapi nitrat dan statin.',
    vital_signs: {
      tekanan_darah: '135/85',
      suhu: 36.6,
      nadi: 82,
      respirasi: 18,
      berat_badan: 58,
      tinggi_badan: 160,
    },
    created_at: '2026-11-14T09:15:00Z',
  },
  {
    id: 'mr-02',
    appointment_id: 'apt-02',
    patient_id: 'pat-02',
    doctor_id: 'doc-02',
    keluhan_utama: 'Cepat lelah, sering haus (polidipsia) dan sering kencing malam hari (nokturia)',
    diagnosa: 'E11.9 - Type 2 Diabetes Mellitus Without Complications',
    tindakan: 'Pemeriksaan Glukosa Darah Sewaktu (GDS), Konseling pola makan gizi klinis',
    catatan_dokter: 'GDS terukur 214 mg/dL. Mulai terapi Metformin 2x500mg dan jadwalkan cek HbA1c ulang.',
    vital_signs: {
      tekanan_darah: '128/80',
      suhu: 36.4,
      nadi: 76,
      respirasi: 16,
      berat_badan: 72,
      tinggi_badan: 168,
    },
    created_at: '2026-11-14T09:40:00Z',
  },
  {
    id: 'mr-03',
    appointment_id: 'apt-03',
    patient_id: 'pat-03',
    doctor_id: 'doc-04',
    keluhan_utama: 'Pemeriksaan rutin kehamilan trimester 3, usia gestasi 32 minggu',
    diagnosa: 'Z34.8 - Supervision of Other Normal Pregnancy',
    tindakan: 'USG Fetomaternal 2D, Palpasi Leopold I-IV, Pengukuran Denyut Jantung Janin',
    catatan_dokter: 'Presentasi kepala, DJJ 142 dpm reguler, perkiraan berat janin 1.850 gram. Kondisi ibu dan janin baik.',
    vital_signs: {
      tekanan_darah: '115/75',
      suhu: 36.7,
      nadi: 80,
      respirasi: 18,
      berat_badan: 64,
      tinggi_badan: 158,
    },
    created_at: '2026-11-14T10:05:00Z',
  },
  {
    id: 'mr-04',
    appointment_id: 'apt-04',
    patient_id: 'pat-04',
    doctor_id: 'doc-05',
    keluhan_utama: 'Nyeri hebat pada lutut kanan saat menekuk dan menuruni tangga selama 3 bulan',
    diagnosa: 'M17.1 - Primary Gonarthrosis, Unilateral (Osteoartritis Genu Dextra Grade II)',
    tindakan: 'Injeksi Viscosupplementation Intra-articular Genu Dextra, Edukasi fisioterapi',
    catatan_dokter: 'Krepitasi positif, efusi minimal. Hindari beban tumpuan berlebih, jadwalkan kontrol 2 minggu.',
    vital_signs: {
      tekanan_darah: '140/90',
      suhu: 36.5,
      nadi: 84,
      respirasi: 18,
      berat_badan: 80,
      tinggi_badan: 170,
    },
    created_at: '2026-11-14T10:25:00Z',
  },
];

// ============================================================================
// 8. Pharmacy Medicines (22 Medicines in Formularium RS)
// ============================================================================
export const MOCK_MEDICINES: Medicine[] = [
  {
    id: 'med-01',
    kode_obat: 'OBT-001',
    nama_obat: 'Paracetamol 500 mg Tablet',
    kategori: 'Analgesik & Antipiretik',
    stok: 1250,
    harga_satuan: 850,
    expired_date: '2027-10-15',
  },
  {
    id: 'med-02',
    kode_obat: 'OBT-002',
    nama_obat: 'Amoxicillin 500 mg Kapsul',
    kategori: 'Antibiotik Penisilin',
    stok: 840,
    harga_satuan: 1500,
    expired_date: '2027-06-30',
  },
  {
    id: 'med-03',
    kode_obat: 'OBT-003',
    nama_obat: 'Cefixime 200 mg Kapsul',
    kategori: 'Antibiotik Sefalosporin',
    stok: 320,
    harga_satuan: 8500,
    expired_date: '2026-12-31',
  },
  {
    id: 'med-04',
    kode_obat: 'OBT-004',
    nama_obat: 'Metformin 500 mg Tablet',
    kategori: 'Antidiabetes Oral',
    stok: 950,
    harga_satuan: 1100,
    expired_date: '2027-08-20',
  },
  {
    id: 'med-05',
    kode_obat: 'OBT-005',
    nama_obat: 'Amlodipine 10 mg Tablet',
    kategori: 'Antihipertensi (CCB)',
    stok: 780,
    harga_satuan: 1400,
    expired_date: '2027-11-10',
  },
  {
    id: 'med-06',
    kode_obat: 'OBT-006',
    nama_obat: 'Candesartan 8 mg Tablet',
    kategori: 'Antihipertensi (ARB)',
    stok: 430,
    harga_satuan: 4800,
    expired_date: '2027-04-18',
  },
  {
    id: 'med-07',
    kode_obat: 'OBT-007',
    nama_obat: 'Atorvastatin 20 mg Tablet',
    kategori: 'Hipolipidemik (Statin)',
    stok: 510,
    harga_satuan: 6200,
    expired_date: '2027-09-05',
  },
  {
    id: 'med-08',
    kode_obat: 'OBT-008',
    nama_obat: 'Omeprazole 20 mg Kapsul',
    kategori: 'Antasida & Antiulkus (PPI)',
    stok: 670,
    harga_satuan: 2500,
    expired_date: '2027-07-22',
  },
  {
    id: 'med-09',
    kode_obat: 'OBT-009',
    nama_obat: 'Lansoprazole 30 mg Kapsul',
    kategori: 'Antasida & Antiulkus (PPI)',
    stok: 410,
    harga_satuan: 3200,
    expired_date: '2027-03-14',
  },
  {
    id: 'med-10',
    kode_obat: 'OBT-010',
    nama_obat: 'Ibuprofen 400 mg Tablet',
    kategori: 'NSAID & Anti-inflamasi',
    stok: 600,
    harga_satuan: 1200,
    expired_date: '2027-05-30',
  },
  {
    id: 'med-11',
    kode_obat: 'OBT-011',
    nama_obat: 'Asam Mefenamat 500 mg Kapsul',
    kategori: 'NSAID & Analgesik',
    stok: 540,
    harga_satuan: 1300,
    expired_date: '2027-01-25',
  },
  {
    id: 'med-12',
    kode_obat: 'OBT-012',
    nama_obat: 'Cetirizine 10 mg Tablet',
    kategori: 'Antihistamin Alergi',
    stok: 820,
    harga_satuan: 1100,
    expired_date: '2027-12-01',
  },
  {
    id: 'med-13',
    kode_obat: 'OBT-013',
    nama_obat: 'Salbutamol 2 mg Tablet',
    kategori: 'Bronkodilator Asma',
    stok: 390,
    harga_satuan: 950,
    expired_date: '2026-11-30',
  },
  {
    id: 'med-14',
    kode_obat: 'OBT-014',
    nama_obat: 'Dexamethasone 0.5 mg Tablet',
    kategori: 'Kortikosteroid',
    stok: 730,
    harga_satuan: 750,
    expired_date: '2027-08-15',
  },
  {
    id: 'med-15',
    kode_obat: 'OBT-015',
    nama_obat: 'Ketorolac 30 mg/mL Injeksi',
    kategori: 'Analgesik Injeksi Kuat',
    stok: 180,
    harga_satuan: 18500,
    expired_date: '2026-10-10',
  },
  {
    id: 'med-16',
    kode_obat: 'OBT-016',
    nama_obat: 'Ondansetron 4 mg/2 mL Injeksi',
    kategori: 'Antiemetik (Anti-mual)',
    stok: 220,
    harga_satuan: 14000,
    expired_date: '2027-02-28',
  },
  {
    id: 'med-17',
    kode_obat: 'OBT-017',
    nama_obat: 'Ceftriaxone 1 gr Vial Injeksi',
    kategori: 'Antibiotik Sefalosporin Injeksi',
    stok: 140,
    harga_satuan: 32000,
    expired_date: '2027-04-30',
  },
  {
    id: 'med-18',
    kode_obat: 'OBT-018',
    nama_obat: 'Infus Ringer Laktat (RL) 500 mL',
    kategori: 'Cairan Infus Elektrolit',
    stok: 450,
    harga_satuan: 16000,
    expired_date: '2028-01-15',
  },
  {
    id: 'med-19',
    kode_obat: 'OBT-019',
    nama_obat: 'Infus NaCl 0.9% 500 mL',
    kategori: 'Cairan Fisiologis Infus',
    stok: 520,
    harga_satuan: 15000,
    expired_date: '2028-03-20',
  },
  {
    id: 'med-20',
    kode_obat: 'OBT-020',
    nama_obat: 'Vitamin B Kompleks Tablet',
    kategori: 'Multivitamin & Suplemen',
    stok: 1100,
    harga_satuan: 600,
    expired_date: '2027-11-30',
  },
  {
    id: 'med-21',
    kode_obat: 'OBT-021',
    nama_obat: 'Kalsium Laktat 500 mg Tablet',
    kategori: 'Suplemen Tulang & Kalsium',
    stok: 640,
    harga_satuan: 800,
    expired_date: '2027-09-12',
  },
  {
    id: 'med-22',
    kode_obat: 'OBT-022',
    nama_obat: 'Bisoprolol 2.5 mg Tablet',
    kategori: 'Beta Blocker (Jantung)',
    stok: 490,
    harga_satuan: 3500,
    expired_date: '2027-06-15',
  },
];

// ============================================================================
// 9. Prescriptions & Prescription Line Items
// ============================================================================
export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-01',
    medical_record_id: 'mr-01',
    processed_by_staff_id: 'staff-03',
    status: 'selesai',
  },
  {
    id: 'rx-02',
    medical_record_id: 'mr-02',
    processed_by_staff_id: 'staff-03',
    status: 'selesai',
  },
  {
    id: 'rx-03',
    medical_record_id: 'mr-03',
    processed_by_staff_id: 'staff-03',
    status: 'diproses',
  },
  {
    id: 'rx-04',
    medical_record_id: 'mr-04',
    processed_by_staff_id: 'staff-03',
    status: 'pending',
  },
];

export const MOCK_PRESCRIPTION_DETAILS: PrescriptionDetail[] = [
  {
    id: 'rxd-01',
    prescription_id: 'rx-01',
    medicine_id: 'med-07',
    jumlah: 30,
    aturan_pakai: '1 x 1 tablet malam hari sesudah makan',
  },
  {
    id: 'rxd-02',
    prescription_id: 'rx-01',
    medicine_id: 'med-22',
    jumlah: 30,
    aturan_pakai: '1 x 1/2 tablet pagi hari',
  },
  {
    id: 'rxd-03',
    prescription_id: 'rx-02',
    medicine_id: 'med-04',
    jumlah: 60,
    aturan_pakai: '2 x 1 tablet bersama suapan pertama makan',
  },
  {
    id: 'rxd-04',
    prescription_id: 'rx-02',
    medicine_id: 'med-20',
    jumlah: 30,
    aturan_pakai: '1 x 1 tablet pagi hari',
  },
  {
    id: 'rxd-05',
    prescription_id: 'rx-03',
    medicine_id: 'med-21',
    jumlah: 30,
    aturan_pakai: '1 x 1 tablet sesudah makan',
  },
  {
    id: 'rxd-06',
    prescription_id: 'rx-04',
    medicine_id: 'med-11',
    jumlah: 15,
    aturan_pakai: '3 x 1 kapsul sesudah makan bila nyeri',
  },
];

// ============================================================================
// 10. Clinical Laboratory Orders (9 Lab Orders)
// ============================================================================
export const MOCK_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-01',
    medical_record_id: 'mr-01',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Profil Lipid Lengkap (Kolesterol, HDL, LDL, Trigliserida)',
    hasil_lab: 'Kolesterol Total: 218 mg/dL (Tinggi), LDL: 142 mg/dL (Tinggi), HDL: 44 mg/dL, Trigliserida: 160 mg/dL',
    status: 'selesai',
  },
  {
    id: 'lab-02',
    medical_record_id: 'mr-02',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Glukosa Darah Puasa (GDP) & HbA1c',
    hasil_lab: 'GDP: 148 mg/dL (Tinggi), HbA1c: 7.4% (Tinggi / Kontrol DM Sedang)',
    status: 'selesai',
  },
  {
    id: 'lab-03',
    medical_record_id: 'mr-03',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Hematologi Lengkap & Urinalisis Rutin',
    hasil_lab: 'Hb: 12.1 g/dL, Leukosit: 8.500/uL, Trombosit: 280.000/uL, Proteinuria: Negatif (-)',
    status: 'selesai',
  },
  {
    id: 'lab-04',
    medical_record_id: 'mr-04',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Asam Urat Serum & Laju Endap Darah (LED)',
    hasil_lab: 'Asam Urat: 6.8 mg/dL (Normal Tinggi), LED 1 Jam: 24 mm/jam',
    status: 'selesai',
  },
  {
    id: 'lab-05',
    medical_record_id: 'mr-01',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Troponin I Kuantitatif & CK-MB',
    hasil_lab: 'Troponin I: < 0.01 ng/mL (Non-reaktif / Normal), CK-MB: 14 U/L (Normal)',
    status: 'selesai',
  },
  {
    id: 'lab-06',
    medical_record_id: 'mr-02',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Fungsi Ginjal (Ureum & Kreatinin Serum)',
    hasil_lab: 'Ureum: 28 mg/dL, Kreatinin: 0.9 mg/dL (eGFR: 88 mL/min/1.73m2)',
    status: 'diproses',
  },
  {
    id: 'lab-07',
    medical_record_id: 'mr-03',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Skrining TORCH & HBsAg Kualitatif',
    status: 'diproses',
  },
  {
    id: 'lab-08',
    medical_record_id: 'mr-04',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Kalsium Ion & Rheumatoid Factor (RF)',
    status: 'pending',
  },
  {
    id: 'lab-09',
    medical_record_id: 'mr-02',
    processed_by_staff_id: 'staff-04',
    jenis_pemeriksaan: 'Tes Toleransi Glukosa Oral (TTGO 75gr)',
    status: 'pending',
  },
];

// ============================================================================
// 11. Emergency Ambulance Requests (4 Requests)
// ============================================================================
export const MOCK_AMBULANCE_REQUESTS: AmbulanceRequest[] = [
  {
    id: 'amb-01',
    patient_id: 'pat-04',
    driver_staff_id: 'staff-08',
    jenis_kendaraan: 'Ambulans Emergency Type A (Advanced Life Support)',
    lokasi_penjemputan: 'Jl. Percetakan Negara II No. 15, Johar Baru, Jakarta Pusat',
    tujuan: 'IGD RS Bhakti Digital',
    status: 'selesai',
  },
  {
    id: 'amb-02',
    patient_id: 'pat-08',
    driver_staff_id: 'staff-08',
    jenis_kendaraan: 'Ambulans Transport Medis Type B',
    lokasi_penjemputan: 'Jl. Rawasari Barat No. 19, Cempaka Putih, Jakarta Pusat',
    tujuan: 'Poli Rawat Jalan RS Bhakti Digital',
    status: 'dikirim',
  },
  {
    id: 'amb-03',
    patient_id: 'pat-12',
    driver_staff_id: 'staff-08',
    jenis_kendaraan: 'Ambulans Jenazah VIP',
    lokasi_penjemputan: 'Instalasi Forensik RS Bhakti Digital',
    tujuan: 'Rumah Duka Jelambar, Jakarta Barat',
    status: 'selesai',
  },
  {
    id: 'amb-04',
    patient_id: 'pat-10',
    driver_staff_id: 'staff-08',
    jenis_kendaraan: 'Ambulans Emergency Type A (Advanced Life Support)',
    lokasi_penjemputan: 'Jl. D.I. Panjaitan Kav. 14, Cipinang, Jakarta Timur',
    tujuan: 'IGD RS Bhakti Digital',
    status: 'pending',
  },
];

// ============================================================================
// 12. Patient Billings (12 Invoice & Payment Records)
// ============================================================================
export const MOCK_BILLINGS: Billing[] = [
  {
    id: 'bill-01',
    patient_id: 'pat-01',
    appointment_id: 'apt-01',
    cashier_staff_id: 'staff-06',
    total_biaya: 485000,
    cover_bpjs: 485000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'klaim_bpjs',
  },
  {
    id: 'bill-02',
    patient_id: 'pat-02',
    appointment_id: 'apt-02',
    cashier_staff_id: 'staff-06',
    total_biaya: 360000,
    cover_bpjs: 360000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'klaim_bpjs',
  },
  {
    id: 'bill-03',
    patient_id: 'pat-03',
    appointment_id: 'apt-03',
    cashier_staff_id: 'staff-06',
    total_biaya: 520000,
    cover_bpjs: 520000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'klaim_bpjs',
  },
  {
    id: 'bill-04',
    patient_id: 'pat-04',
    appointment_id: 'apt-04',
    cashier_staff_id: 'staff-06',
    total_biaya: 875000,
    cover_bpjs: 875000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'klaim_bpjs',
  },
  {
    id: 'bill-05',
    patient_id: 'pat-05',
    appointment_id: 'apt-05',
    cashier_staff_id: 'staff-06',
    total_biaya: 285000,
    cover_bpjs: 0,
    sisa_bayar_pasien: 285000,
    status_pembayaran: 'dibayar',
  },
  {
    id: 'bill-06',
    patient_id: 'pat-06',
    appointment_id: 'apt-06',
    cashier_staff_id: 'staff-06',
    total_biaya: 340000,
    cover_bpjs: 340000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'pending',
  },
  {
    id: 'bill-07',
    patient_id: 'pat-07',
    appointment_id: 'apt-07',
    cashier_staff_id: 'staff-06',
    total_biaya: 450000,
    cover_bpjs: 450000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'pending',
  },
  {
    id: 'bill-08',
    patient_id: 'pat-08',
    appointment_id: 'apt-08',
    cashier_staff_id: 'staff-06',
    total_biaya: 620000,
    cover_bpjs: 620000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'pending',
  },
  {
    id: 'bill-09',
    patient_id: 'pat-09',
    appointment_id: 'apt-09',
    cashier_staff_id: 'staff-06',
    total_biaya: 310000,
    cover_bpjs: 310000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'pending',
  },
  {
    id: 'bill-10',
    patient_id: 'pat-10',
    appointment_id: 'apt-10',
    cashier_staff_id: 'staff-06',
    total_biaya: 420000,
    cover_bpjs: 0,
    sisa_bayar_pasien: 420000,
    status_pembayaran: 'pending',
  },
  {
    id: 'bill-11',
    patient_id: 'pat-13',
    appointment_id: 'apt-13',
    cashier_staff_id: 'staff-06',
    total_biaya: 250000,
    cover_bpjs: 0,
    sisa_bayar_pasien: 250000,
    status_pembayaran: 'dibayar',
  },
  {
    id: 'bill-12',
    patient_id: 'pat-14',
    appointment_id: 'apt-14',
    cashier_staff_id: 'staff-06',
    total_biaya: 580000,
    cover_bpjs: 580000,
    sisa_bayar_pasien: 0,
    status_pembayaran: 'pending',
  },
];

export const MOCK_STAFF = MOCK_STAFF_PROFILES;

// ============================================================================
// Post-Processing Dual Property & View Model Enrichment
// Ensures strict 14 table properties AND UI camelCase view compatibility
// ============================================================================

MOCK_PATIENTS.forEach((p) => {
  p.name = p.nama_lengkap;
  p.phone = p.no_telepon;
  p.address = p.alamat;
  p.birthDate = p.tanggal_lahir;
  p.gender = p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan';
  p.bloodType = 'O';
  p.bpjsNumber = p.no_bpjs || '';
  p.bpjsActive = Boolean(p.no_bpjs);
  p.insuranceType = p.no_bpjs ? 'BPJS Kesehatan' : 'Umum / Mandiri';
  p.emergencyContact = {
    name: 'Keluarga Pasien',
    relationship: 'Kerabat',
    phone: p.no_telepon,
  };
  p.registeredAt = '2025-01-10';
});

MOCK_ROOMS.forEach((r, idx) => {
  r.number = r.nomor_kamar;
  r.name = `Kamar ${r.nomor_kamar} - ${r.nama_bangsal}`;
  r.ward = r.nama_bangsal.includes('ICU') ? 'ICU' : (idx < 6 ? 'IGD' : 'Rawat Inap');
  r.capacity = r.kelas.includes('VIP') ? 1 : (r.kelas.includes('Kelas 1') ? 2 : 4);
  r.occupied = r.status === 'terisi' ? r.capacity : (r.status === 'tersedia' ? 0 : 1);
  r.pricePerDay = r.tarif_per_hari;
  r.features = ['Central O2', 'Nurse Call', 'Bedside Monitor', 'Kamar Mandi'];
  r.patientList = r.status === 'terisi' ? [
    { name: 'Pasien Rawat', rm: `RM-00248${idx}`, admissionDate: '2025-06-14', diagnosis: 'Observasi Klinis' }
  ] : [];
});

MOCK_APPOINTMENTS.forEach((a) => {
  const p = MOCK_PATIENTS.find((pat) => pat.id === a.patient_id);
  const d = MOCK_DOCTORS.find((doc) => doc.id === a.doctor_id);
  a.patientId = a.patient_id;
  a.patientName = p?.nama_lengkap || 'Pasien';
  a.doctorId = a.doctor_id;
  a.doctorName = d?.nama_dokter || 'Dokter Spesialis';
  a.department = d?.spesialisasi || 'Poliklinik';
  a.date = a.tanggal_periksa;
  a.time = '09:00 WIB';
  a.queueNumber = a.nomor_antrean;
  a.complaint = 'Keluhan medis umum dan pemeriksaan berkala';
  a.type = 'Rawat Jalan';
  a.priority = 'Normal';
});

MOCK_MEDICINES.forEach((m) => {
  m.name = m.nama_obat;
  m.category = m.kategori;
  m.stock = m.stok;
  m.minStock = 50;
  m.price = m.harga_satuan;
  m.unit = 'Tablet / Kapsul';
  m.form = 'Tablet';
  m.description = `${m.nama_obat} (${m.kategori})`;
});

MOCK_PRESCRIPTIONS.forEach((rx, idx) => {
  const mr = MOCK_MEDICAL_RECORDS.find((m) => m.id === rx.medical_record_id);
  const p = MOCK_PATIENTS.find((pat) => pat.id === mr?.patient_id);
  const d = MOCK_DOCTORS.find((doc) => doc.id === mr?.doctor_id);
  rx.prescriptionNumber = `RSP/20250616/00${idx + 1}`;
  rx.appointmentId = mr?.appointment_id || 'apt-01';
  rx.patientId = p?.no_rm || 'RM-002481';
  rx.patientName = p?.nama_lengkap || 'Pasien';
  rx.doctorName = d?.nama_dokter || 'dr. Andi Pratama, Sp.JP';
  rx.date = '2025-06-16 09:00 WIB';
  rx.notes = mr?.catatan_dokter || 'Kontrol rutin';
  rx.items = [
    {
      medicineId: 'med-01',
      medicineName: 'Paracetamol 500 mg Tablet',
      dosage: '1 tablet (500 mg)',
      frequency: '3x1 sehari sesudah makan',
      quantity: 15,
      instructions: 'Bila demam / nyeri',
    },
    {
      medicineId: 'med-05',
      medicineName: 'Amlodipine 10 mg Tablet',
      dosage: '1 tablet (10 mg)',
      frequency: '1x1 sehari pagi hari',
      quantity: 30,
      instructions: 'Sesudah makan pagi',
    },
  ];
});

MOCK_LAB_ORDERS.forEach((lo, idx) => {
  const mr = MOCK_MEDICAL_RECORDS.find((m) => m.id === lo.medical_record_id);
  const p = MOCK_PATIENTS.find((pat) => pat.id === mr?.patient_id);
  const d = MOCK_DOCTORS.find((doc) => doc.id === mr?.doctor_id);
  lo.orderNumber = `LAB-2025-00${idx + 1}`;
  lo.patientId = p?.no_rm || 'RM-002481';
  lo.patientName = p?.nama_lengkap || 'Pasien';
  lo.doctorName = d?.nama_dokter || 'Dokter Pengirim';
  lo.testType = lo.jenis_pemeriksaan;
  lo.orderedAt = '2025-06-16 08:30 WIB';
  lo.completedAt = lo.status === 'selesai' ? '2025-06-16 10:15 WIB' : undefined;
  lo.priority = 'Normal';
  lo.results = [
    { testName: 'Hemoglobin (Hb)', result: '13.8', normalRange: '13.0 - 17.5', unit: 'g/dL', status: 'Normal' },
    { testName: 'Leukosit', result: '7,800', normalRange: '4,000 - 10,000', unit: '/µL', status: 'Normal' },
    { testName: 'Trombosit', result: '240,000', normalRange: '150,000 - 450,000', unit: '/µL', status: 'Normal' },
  ];
});

MOCK_AMBULANCE_REQUESTS.forEach((amb, idx) => {
  const p = MOCK_PATIENTS.find((pat) => pat.id === amb.patient_id);
  const s = MOCK_STAFF_PROFILES.find((st) => st.id === amb.driver_staff_id);
  amb.code = `AMB-DISPATCH-00${idx + 1}`;
  amb.requesterName = p?.nama_lengkap || 'Keluarga Pasien';
  amb.requesterPhone = p?.no_telepon || '081288990011';
  amb.pickupLocation = amb.lokasi_penjemputan;
  amb.destination = amb.tujuan;
  amb.urgency = idx % 2 === 0 ? 'Kritis (Merah)' : 'Mendesak (Kuning)';
  amb.vehiclePlate = `B 112${idx + 1} BD (${amb.jenis_kendaraan.slice(0, 15)})`;
  amb.driverName = s?.nama_lengkap || 'Ujang Supriatna';
  amb.paramedicName = 'Ns. Joko Prasetyo, S.Kep';
  amb.requestTime = '08:45 WIB';
  amb.departureTime = '08:50 WIB';
  amb.notes = 'Pasien membutuhkan bantuan resusitasi & oksigenasi kontinu.';
});

MOCK_BILLINGS.forEach((b, idx) => {
  const p = MOCK_PATIENTS.find((pat) => pat.id === b.patient_id);
  b.invoiceNumber = `INV/20250616/${String(idx + 1).padStart(4, '0')}`;
  b.patientId = p?.no_rm || 'RM-002481';
  b.patientName = p?.nama_lengkap || 'Pasien';
  b.date = '2025-06-16';
  b.totalAmount = b.total_biaya;
  b.bpjsCoverage = b.cover_bpjs;
  b.patientPay = b.sisa_bayar_pasien;
  b.consultationFee = 150000;
  b.labFee = b.total_biaya > 400000 ? 120000 : 0;
  b.medicineFee = Math.max(0, b.total_biaya - 150000 - b.labFee);
  b.actionFee = 75000;
  b.roomFee = 0;
  b.insuranceType = b.cover_bpjs > 0 ? 'BPJS Kesehatan' : 'Umum / Mandiri';
  b.status = b.status_pembayaran === 'dibayar' ? 'Lunas' : (b.status_pembayaran === 'klaim_bpjs' ? 'Klaim BPJS' : 'Belum Dibayar');
  b.paymentMethod = b.cover_bpjs === b.total_biaya ? 'Klaim BPJS Penuh' : 'QRIS';
  b.cashierName = 'Tina Agustina, S.Ak';
  b.paidAt = b.status_pembayaran !== 'pending' ? '16/06/2025 10:30 WIB' : undefined;
});
