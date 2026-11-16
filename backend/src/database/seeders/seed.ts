// ============================================================================
// RS Bhakti Digital SIMRS - Production Database Seeder
// Seeds all 14 Relational Tables with Realistic Indonesian Medical Data
// ============================================================================

export const SEED_ROLES = [
  { id: 'admin', nama_role: 'admin', deskripsi: 'Administrator Sistem SIMRS' },
  { id: 'direktur', nama_role: 'direktur', deskripsi: 'Direktur Utama Rumah Sakit' },
  { id: 'dokter', nama_role: 'dokter', deskripsi: 'Dokter Spesialis & Umum' },
  { id: 'perawat', nama_role: 'perawat', deskripsi: 'Perawat Bangsal & Poli' },
  { id: 'apoteker', nama_role: 'apoteker', deskripsi: 'Apoteker & Tenaga Teknis Farmasi' },
  { id: 'analis_lab', nama_role: 'analis_lab', deskripsi: 'Analis Laboratorium Patologi' },
  { id: 'radiografer', nama_role: 'radiografer', deskripsi: 'Radiografer & Teknisi Diagnostik' },
  { id: 'kasir', nama_role: 'kasir', deskripsi: 'Kasir & Keuangan Rumah Sakit' },
  { id: 'admisi', nama_role: 'admisi', deskripsi: 'Petugas Admisi & Antrean Pasien' },
  { id: 'driver', nama_role: 'driver', deskripsi: 'Driver Ambulans & Gawat Darurat' },
  { id: 'cssd', nama_role: 'cssd', deskripsi: 'Petugas Sterilisasi Sentral CSSD' },
  { id: 'it_support', nama_role: 'it_support', deskripsi: 'Teknisi IT & Jaringan' },
  { id: 'pasien', nama_role: 'pasien', deskripsi: 'Pasien & Keluarga Pasien' },
];

export const SEED_USERS = [
  { id: 'usr-01', role_id: 'admin', email: 'admin@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Bambang Sudibyo, S.Kom', is_active: true },
  { id: 'usr-02', role_id: 'direktur', email: 'direktur@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'dr. H. Hendrawan Sp.PK, MARS', is_active: true },
  { id: 'usr-03', role_id: 'dokter', email: 'dr.andi@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'dr. Andi Pratama, Sp.JP', is_active: true },
  { id: 'usr-04', role_id: 'dokter', email: 'dr.maya@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'dr. Maya Indriani, Sp.PD', is_active: true },
  { id: 'usr-05', role_id: 'dokter', email: 'dr.sarah@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'dr. Sarah Dewi, Sp.A', is_active: true },
  { id: 'usr-11', role_id: 'perawat', email: 'perawat.ani@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Ns. Ani Suryani, S.Kep', is_active: true },
  { id: 'usr-13', role_id: 'apoteker', email: 'apoteker.linda@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'apt. Linda Kusuma, S.Farm', is_active: true },
  { id: 'usr-14', role_id: 'analis_lab', email: 'lab.dimas@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Dimas Arya, A.Md.AK', is_active: true },
  { id: 'usr-15', role_id: 'radiografer', email: 'radio.yoga@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Yoga Ramadhan, A.Md.Rad', is_active: true },
  { id: 'usr-16', role_id: 'kasir', email: 'kasir.tina@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Tina Agustina, S.Ak', is_active: true },
  { id: 'usr-17', role_id: 'admisi', email: 'admisi.fajar@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Fajar Nugraha, S.Sos', is_active: true },
  { id: 'usr-18', role_id: 'driver', email: 'driver.ujang@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Ujang Supriatna', is_active: true },
  { id: 'usr-19', role_id: 'cssd', email: 'cssd.dewi@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Dewi Puspita', is_active: true },
  { id: 'usr-20', role_id: 'it_support', email: 'it.kevin@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Kevin Sanjaya, S.Kom', is_active: true },
  { id: 'usr-21', role_id: 'pasien', email: 'pasien.siti@rsbhaktidigital.id', password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyGkWy45qVpM/Lq8KqO4qX0kC0Z0yW6m', nama_lengkap: 'Siti Nurhaliza', is_active: true },
];

export const SEED_PATIENTS = [
  { id: 'pat-01', user_id: 'usr-21', no_rm: 'RM-002481', nik: '3171014503920001', nama_lengkap: 'Siti Nurhaliza', tanggal_lahir: '1992-03-15', jenis_kelamin: 'P', alamat: 'Jl. Kayu Putih Tengah No. 12, Jakarta Timur', no_telepon: '081288990011', no_bpjs: '0001234567891', kelas_bpjs: 1 },
  { id: 'pat-02', user_id: null, no_rm: 'RM-002482', nik: '3171021208790002', nama_lengkap: 'Budi Santoso', tanggal_lahir: '1979-08-12', jenis_kelamin: 'L', alamat: 'Jl. Balai Pustaka Timur No. 4A, Jakarta Timur', no_telepon: '081377881122', no_bpjs: '0001234567892', kelas_bpjs: 2 },
  { id: 'pat-03', user_id: null, no_rm: 'RM-002483', nik: '3171035506960003', nama_lengkap: 'Dewi Lestari', tanggal_lahir: '1996-06-25', jenis_kelamin: 'P', alamat: 'Jl. Cipinang Muara III No. 8, Jakarta Timur', no_telepon: '081766554433', no_bpjs: '0001234567893', kelas_bpjs: 1 },
  { id: 'pat-04', user_id: null, no_rm: 'RM-002484', nik: '3171042004680004', nama_lengkap: 'Ahmad Fauzi', tanggal_lahir: '1968-04-20', jenis_kelamin: 'L', alamat: 'Jl. Percetakan Negara II No. 15, Jakarta Pusat', no_telepon: '081544332211', no_bpjs: '0001234567894', kelas_bpjs: 3 },
  { id: 'pat-05', user_id: null, no_rm: 'RM-002485', nik: '3171056211160005', nama_lengkap: 'Putri Maharani', tanggal_lahir: '2016-11-22', jenis_kelamin: 'P', alamat: 'Jl. Utan Kayu Raya No. 42, Jakarta Timur', no_telepon: '081233445566', no_bpjs: '0001234567895', kelas_bpjs: 2 },
];

export const SEED_DOCTORS = [
  { id: 'doc-01', user_id: 'usr-03', sip: '503/SIP.DOK/2021/00142', nama_dokter: 'dr. Andi Pratama, Sp.JP', spesialisasi: 'Spesialis Jantung & Pembuluh Darah', jadwal_praktik: { Senin: '08:00 - 12:00', Rabu: '08:00 - 12:00', Jumat: '08:00 - 11:30' } },
  { id: 'doc-02', user_id: 'usr-04', sip: '503/SIP.DOK/2020/00231', nama_dokter: 'dr. Maya Indriani, Sp.PD', spesialisasi: 'Spesialis Penyakit Dalam', jadwal_praktik: { Senin: '13:00 - 17:00', Selasa: '09:00 - 14:00', Kamis: '09:00 - 14:00' } },
  { id: 'doc-03', user_id: 'usr-05', sip: '503/SIP.DOK/2022/00388', nama_dokter: 'dr. Sarah Dewi, Sp.A', spesialisasi: 'Spesialis Kesehatan Anak', jadwal_praktik: { 'Senin - Kamis': '08:30 - 13:00', Sabtu: '09:00 - 12:00' } },
];

export const SEED_STAFF_PROFILES = [
  { id: 'staff-01', user_id: 'usr-11', nip: '198904122014022001', nama_lengkap: 'Ns. Ani Suryani, S.Kep', departemen: 'Rawat Inap', no_telepon: '081288990011' },
  { id: 'staff-03', user_id: 'usr-13', nip: '199203152016042003', nama_lengkap: 'apt. Linda Kusuma, S.Farm', departemen: 'Farmasi', no_telepon: '081766554433' },
  { id: 'staff-04', user_id: 'usr-14', nip: '199311092017011004', nama_lengkap: 'Dimas Arya, A.Md.AK', departemen: 'Laboratorium', no_telepon: '081544332211' },
  { id: 'staff-06', user_id: 'usr-16', nip: '199405022018032006', nama_lengkap: 'Tina Agustina, S.Ak', departemen: 'Kasir', no_telepon: '081399887766' },
  { id: 'staff-07', user_id: 'usr-17', nip: '199512142019011007', nama_lengkap: 'Fajar Nugraha, S.Sos', departemen: 'Admisi', no_telepon: '081822334455' },
  { id: 'staff-08', user_id: 'usr-18', nip: '198707012012031008', nama_lengkap: 'Ujang Supriatna', departemen: 'Ambulans', no_telepon: '081677665544' },
  { id: 'staff-09', user_id: 'usr-19', nip: '199209192016022009', nama_lengkap: 'Dewi Puspita', departemen: 'CSSD', no_telepon: '081911223344' },
  { id: 'staff-10', user_id: 'usr-20', nip: '199602282020011010', nama_lengkap: 'Kevin Sanjaya, S.Kom', departemen: 'IT Support', no_telepon: '081255667788' },
];

export const SEED_ROOMS = [
  { id: 'room-01', nomor_kamar: 'VIP-01', nama_bangsal: 'Bangsal Melati', kelas: 'VIP', status: 'tersedia', tarif_per_hari: 1250000 },
  { id: 'room-02', nomor_kamar: 'VIP-02', nama_bangsal: 'Bangsal Melati', kelas: 'VIP', status: 'terisi', tarif_per_hari: 1250000 },
  { id: 'room-03', nomor_kamar: 'K1-101', nama_bangsal: 'Bangsal Mawar', kelas: 'Kelas 1', status: 'tersedia', tarif_per_hari: 750000 },
  { id: 'room-04', nomor_kamar: 'K2-201', nama_bangsal: 'Bangsal Anggrek', kelas: 'Kelas 2', status: 'terisi', tarif_per_hari: 450000 },
  { id: 'room-05', nomor_kamar: 'K3-301', nama_bangsal: 'Bangsal Teratai', kelas: 'Kelas 3', status: 'maintenance', tarif_per_hari: 200000 },
  { id: 'room-06', nomor_kamar: 'ICU-01', nama_bangsal: 'Intensive Care Unit', kelas: 'ICU', status: 'steril_cssd', tarif_per_hari: 2500000 },
];

export const SEED_APPOINTMENTS = [
  { id: 'apt-01', patient_id: 'pat-01', doctor_id: 'doc-01', tanggal_periksa: '2025-06-16', nomor_antrean: 'JTG-001', jenis_pembayaran: 'bpjs', status: 'selesai' },
  { id: 'apt-02', patient_id: 'pat-02', doctor_id: 'doc-02', tanggal_periksa: '2025-06-16', nomor_antrean: 'INT-001', jenis_pembayaran: 'bpjs', status: 'diperiksa' },
  { id: 'apt-03', patient_id: 'pat-03', doctor_id: 'doc-03', tanggal_periksa: '2025-06-16', nomor_antrean: 'ANK-001', jenis_pembayaran: 'umum', status: 'dipanggil' },
  { id: 'apt-04', patient_id: 'pat-04', doctor_id: 'doc-01', tanggal_periksa: '2025-06-16', nomor_antrean: 'JTG-002', jenis_pembayaran: 'bpjs', status: 'menunggu' },
];

export const SEED_MEDICAL_RECORDS = [
  { id: 'mr-01', appointment_id: 'apt-01', patient_id: 'pat-01', doctor_id: 'doc-01', keluhan_utama: 'Nyeri dada kiri seperti ditekan benda berat', diagnosa: 'I20.9 - Angina Pectoris Unspecified', tindakan: 'Pemeriksaan EKG 12 Lead, Terapi Nitrat sublingual', catatan_dokter: 'Pasien diinstruksikan istirahat total dan pantau tensi', vital_signs: { td: '135/85', nadi: 84, suhu: 36.6, rr: 18 } },
];

export const SEED_MEDICINES = [
  { id: 'med-01', kode_obat: 'MED-AMLO-5', nama_obat: 'Amlodipine Besilate 5 mg', kategori: 'Antihipertensi', stok: 240, harga_satuan: 1200, expired_date: '2026-08-30' },
  { id: 'med-02', kode_obat: 'MED-ATOR-20', nama_obat: 'Atorvastatin Calcium 20 mg', kategori: 'Antikolesterol', stok: 180, harga_satuan: 4500, expired_date: '2026-11-15' },
  { id: 'med-03', kode_obat: 'MED-METF-500', nama_obat: 'Metformin HCl 500 mg', kategori: 'Antidiabetes Oral', stok: 350, harga_satuan: 800, expired_date: '2026-05-20' },
  { id: 'med-04', kode_obat: 'MED-PARA-500', nama_obat: 'Paracetamol 500 mg', kategori: 'Analgesik & Antipiretik', stok: 500, harga_satuan: 500, expired_date: '2027-01-10' },
  { id: 'med-05', kode_obat: 'MED-AMOX-500', nama_obat: 'Amoxicillin Trihydrate 500 mg', kategori: 'Antibiotik Penicilin', stok: 42, harga_satuan: 1500, expired_date: '2025-09-12' },
];

export const SEED_PRESCRIPTIONS = [
  { id: 'rx-01', medical_record_id: 'mr-01', processed_by_staff_id: 'staff-03', status: 'selesai' },
];

export const SEED_PRESCRIPTION_DETAILS = [
  { id: 'rxd-01', prescription_id: 'rx-01', medicine_id: 'med-01', jumlah: 30, aturan_pakai: '1x1 tablet pagi hari sesudah makan' },
  { id: 'rxd-02', prescription_id: 'rx-01', medicine_id: 'med-02', jumlah: 30, aturan_pakai: '1x1 tablet malam hari sebelum tidur' },
];

export const SEED_LAB_ORDERS = [
  { id: 'lab-01', medical_record_id: 'mr-01', processed_by_staff_id: 'staff-04', jenis_pemeriksaan: 'Troponin I Kuantitatif & Profil Lipid', hasil_lab: 'Troponin I: < 0.01 ng/mL (Normal), Kolesterol Total: 215 mg/dL', status: 'selesai' },
];

export const SEED_AMBULANCE_REQUESTS = [
  { id: 'amb-01', patient_id: 'pat-01', driver_staff_id: 'staff-08', jenis_kendaraan: 'Unit Alpha 01 (Emergency ICU)', lokasi_penjemputan: 'Jl. Pemuda No. 18, Jakarta Timur', tujuan: 'IGD RS Bhakti Digital', status: 'selesai' },
  { id: 'amb-02', patient_id: 'pat-04', driver_staff_id: 'staff-08', jenis_kendaraan: 'Unit Bravo 02 (Trauma Transport)', lokasi_penjemputan: 'Puskesmas Rawamangun', tujuan: 'IGD RS Bhakti Digital', status: 'dikirim' },
];

export const SEED_BILLINGS = [
  { id: 'bil-01', patient_id: 'pat-01', appointment_id: 'apt-01', cashier_staff_id: 'staff-06', total_biaya: 485000, cover_bpjs: 485000, sisa_bayar_pasien: 0, status_pembayaran: 'klaim_bpjs' },
  { id: 'bil-02', patient_id: 'pat-03', appointment_id: 'apt-03', cashier_staff_id: 'staff-06', total_biaya: 320000, cover_bpjs: 0, sisa_bayar_pasien: 320000, status_pembayaran: 'pending' },
];

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export const ROLE_PASSWORDS: Record<string, string> = {
  admin: 'admin123',
  direktur: 'direktur123',
  dokter: 'dokter123',
  perawat: 'perawat123',
  apoteker: 'apotek123',
  analis_lab: 'lab12345',
  radiografer: 'radio123',
  kasir: 'kasir123',
  admisi: 'admisi123',
  driver: 'driver123',
  cssd: 'cssd1234',
  it_support: 'it123456',
  pasien: 'pasien123',
};

export async function runDatabaseSeed() {
  const prisma = new PrismaClient();
  try {
    console.log('Seeding RS Bhakti Digital Database...');

    for (const role of SEED_ROLES) {
      await prisma.role.upsert({
        where: { id: role.id },
        update: { nama_role: role.nama_role, deskripsi: role.deskripsi },
        create: role,
      });
    }

    for (const user of SEED_USERS) {
      const rawPassword = ROLE_PASSWORDS[user.role_id] || 'password123';
      const password_hash = await bcrypt.hash(rawPassword, 10);
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          nama_lengkap: user.nama_lengkap,
          role_id: user.role_id,
          password_hash,
          is_active: user.is_active,
        },
        create: {
          id: user.id,
          role_id: user.role_id,
          email: user.email,
          password_hash,
          nama_lengkap: user.nama_lengkap,
          is_active: user.is_active,
        },
      });
    }

    for (const pat of SEED_PATIENTS) {
      await prisma.patient.upsert({
        where: { id: pat.id },
        update: { nama_lengkap: pat.nama_lengkap, no_rm: pat.no_rm },
        create: {
          ...pat,
          tanggal_lahir: new Date(pat.tanggal_lahir),
        },
      });
    }

    for (const doc of SEED_DOCTORS) {
      await prisma.doctor.upsert({
        where: { id: doc.id },
        update: { nama_dokter: doc.nama_dokter, spesialisasi: doc.spesialisasi },
        create: doc,
      });
    }

    for (const med of SEED_MEDICINES) {
      await prisma.medicine.upsert({
        where: { id: med.id },
        update: { stok: med.stok, harga_satuan: med.harga_satuan },
        create: {
          ...med,
          expired_date: new Date(med.expired_date),
        },
      });
    }

    console.log('Database seeding successfully populated roles, users, patients, doctors, and medicines.');
  } catch (err) {
    console.error('Seeding error:', err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && process.argv[1].includes('seed.ts')) {
  runDatabaseSeed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
