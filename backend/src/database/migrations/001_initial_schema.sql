-- ============================================================================
-- RS Bhakti Digital SIMRS - Master Database Migration (PostgreSQL / MySQL)
-- 14 Core Relational Tables with Foreign Keys, Unique Keys, and Indexes
-- ============================================================================

-- 1. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    nama_role VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    role_id VARCHAR(50) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NULL UNIQUE,
    no_rm VARCHAR(50) NOT NULL UNIQUE,
    nik VARCHAR(20) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(255) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin VARCHAR(1) NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
    alamat TEXT NOT NULL,
    no_telepon VARCHAR(50) NOT NULL,
    no_bpjs VARCHAR(50) NULL,
    kelas_bpjs INT NULL CHECK (kelas_bpjs IN (1, 2, 3)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS doctors (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    sip VARCHAR(100) NOT NULL UNIQUE,
    nama_dokter VARCHAR(255) NOT NULL,
    spesialisasi VARCHAR(150) NOT NULL,
    jadwal_praktik JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. STAFF PROFILES TABLE
CREATE TABLE IF NOT EXISTS staff_profiles (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL UNIQUE,
    nip VARCHAR(100) NOT NULL UNIQUE,
    nama_lengkap VARCHAR(255) NOT NULL,
    departemen VARCHAR(150) NOT NULL,
    no_telepon VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. ROOMS TABLE
CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    nomor_kamar VARCHAR(50) NOT NULL,
    nama_bangsal VARCHAR(100) NOT NULL,
    kelas VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('tersedia', 'terisi', 'maintenance', 'steril_cssd')),
    tarif_per_hari DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    tanggal_periksa DATE NOT NULL,
    nomor_antrean VARCHAR(50) NOT NULL,
    jenis_pembayaran VARCHAR(50) NOT NULL CHECK (jenis_pembayaran IN ('umum', 'bpjs')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('menunggu', 'dipanggil', 'diperiksa', 'selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT
);

-- 8. MEDICAL RECORDS TABLE (EMR)
CREATE TABLE IF NOT EXISTS medical_records (
    id VARCHAR(50) PRIMARY KEY,
    appointment_id VARCHAR(50) NOT NULL UNIQUE,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    keluhan_utama TEXT NOT NULL,
    diagnosa VARCHAR(255) NOT NULL,
    tindakan TEXT NOT NULL,
    catatan_dokter TEXT,
    vital_signs JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medrec_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
    CONSTRAINT fk_medrec_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_medrec_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT
);

-- 9. MEDICINES TABLE
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(50) PRIMARY KEY,
    kode_obat VARCHAR(100) NOT NULL UNIQUE,
    nama_obat VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    stok INT NOT NULL DEFAULT 0 CHECK (stok >= 0),
    harga_satuan DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    expired_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    medical_record_id VARCHAR(50) NOT NULL,
    processed_by_staff_id VARCHAR(50) NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'diproses', 'selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prescriptions_medrec FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_prescriptions_staff FOREIGN KEY (processed_by_staff_id) REFERENCES staff_profiles(id) ON DELETE SET NULL
);

-- 11. PRESCRIPTION DETAILS TABLE
CREATE TABLE IF NOT EXISTS prescription_details (
    id VARCHAR(50) PRIMARY KEY,
    prescription_id VARCHAR(50) NOT NULL,
    medicine_id VARCHAR(50) NOT NULL,
    jumlah INT NOT NULL DEFAULT 1,
    aturan_pakai VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_detail_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    CONSTRAINT fk_detail_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE RESTRICT
);

-- 12. LAB ORDERS TABLE
CREATE TABLE IF NOT EXISTS lab_orders (
    id VARCHAR(50) PRIMARY KEY,
    medical_record_id VARCHAR(50) NOT NULL,
    processed_by_staff_id VARCHAR(50) NULL,
    jenis_pemeriksaan VARCHAR(255) NOT NULL,
    hasil_lab TEXT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'diproses', 'selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lab_medrec FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_lab_staff FOREIGN KEY (processed_by_staff_id) REFERENCES staff_profiles(id) ON DELETE SET NULL
);

-- 13. AMBULANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS ambulance_requests (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    driver_staff_id VARCHAR(50) NULL,
    jenis_kendaraan VARCHAR(100) NOT NULL,
    lokasi_penjemputan TEXT NOT NULL,
    tujuan TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'dikirim', 'selesai')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ambulance_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_ambulance_driver FOREIGN KEY (driver_staff_id) REFERENCES staff_profiles(id) ON DELETE SET NULL
);

-- 14. BILLINGS TABLE
CREATE TABLE IF NOT EXISTS billings (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    appointment_id VARCHAR(50) NOT NULL UNIQUE,
    cashier_staff_id VARCHAR(50) NULL,
    total_biaya DECIMAL(14, 2) NOT NULL DEFAULT 0.00 CHECK (total_biaya >= 0.00),
    cover_bpjs DECIMAL(14, 2) NOT NULL DEFAULT 0.00 CHECK (cover_bpjs >= 0.00),
    sisa_bayar_pasien DECIMAL(14, 2) NOT NULL DEFAULT 0.00 CHECK (sisa_bayar_pasien >= 0.00),
    status_pembayaran VARCHAR(50) NOT NULL CHECK (status_pembayaran IN ('pending', 'dibayar', 'klaim_bpjs')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_billings_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_billings_appointment FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_billings_cashier FOREIGN KEY (cashier_staff_id) REFERENCES staff_profiles(id) ON DELETE SET NULL
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_patients_nik ON patients(nik);
CREATE INDEX IF NOT EXISTS idx_patients_no_rm ON patients(no_rm);
CREATE INDEX IF NOT EXISTS idx_appointments_tanggal ON appointments(tanggal_periksa);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_medicines_kode ON medicines(kode_obat);
CREATE INDEX IF NOT EXISTS idx_billings_status ON billings(status_pembayaran);
