// ============================================================================
// RS Bhakti Digital SIMRS - Lightweight i18n Dictionary
// Indonesian (id) & English (en) translations for the Login experience
// ============================================================================

import { APP_VERSION } from '@/lib/constants';

export type Language = 'id' | 'en';

export const translations = {
  id: {
    // Left Showcase / Facility Section
    hospitalName: 'RS Bhakti Digital',
    tagline: 'Melayani dengan Teknologi, Menjaga dengan Hati',
    headlinePart1: 'Platform Digital Terpadu',
    headlinePart2: 'untuk Pelayanan',
    headlineHighlight: 'Rumah Sakit Modern',
    description:
      'Sistem Informasi Manajemen Rumah Sakit (SIMRS) terintegrasi menghubungkan administrasi & antrean, poliklinik, rekam medis (RME), farmasi, laboratorium, dan billing secara terpadu.',

    // Feature Cards
    featureRmeTitle: 'Rekam Medis (RME)',
    featureRmeDesc: 'Pencatatan klinis elektronik terpadu dengan standar ICD-10 & SatuSehat.',
    featureAdmissionTitle: 'Administrasi & Antrean',
    featureAdmissionDesc: 'Pendaftaran kuota pasien, alokasi nomor antrean, & matching BPJS.',
    featurePharmacyTitle: 'Instalasi Farmasi',
    featurePharmacyDesc: 'Validasi e-Resep real-time, dispensing etiket, & kontrol stok obat FIFO.',
    featureBillingTitle: 'Kasir & Billing',
    featureBillingDesc: 'Kalkulasi tagihan rawat inap/jalan & integrasi bridging klaim BPJS.',

    // Left Footer
    copyright: '© 2025 RS Bhakti Digital. Hak Cipta Dilindungi.',
    version: `SIMRS v${APP_VERSION}`,
    complianceBadge: 'Terkoneksi SatuSehat Kemenkes - Bridging BPJS Kesehatan',

    // Top Controls
    selectLanguage: 'Pilih Bahasa / Select Language',
    langId: 'Bahasa (ID)',
    langEn: 'English (EN)',
    themeLight: 'Mode Terang',
    themeDark: 'Mode Gelap',

    // Main Login Card
    welcomeTitle: 'Selamat Datang di SIMRS',
    welcomeSubtitle: 'Masuk untuk mengakses sistem informasi rumah sakit.',
    emailLabel: 'Alamat Email / NIP / Username',
    emailPlaceholder: 'example@rsbhaktidigital.id',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan kata sandi Anda',
    hidePassword: 'Sembunyikan kata sandi',
    showPassword: 'Tampilkan kata sandi',
    rememberMe: 'Ingat saya di perangkat ini',
    forgotPassword: 'Lupa kata sandi?',
    forgotPasswordTooltip: "Pilih salah satu kartu pada 'Pengujian Cepat RBAC' di bawah untuk login instan.",
    loginButton: 'Masuk ke Portal SIMRS',
    orSeparator: 'atau',
    ssoButton: 'Login dengan SSO Rumah Sakit',

    // Validation / Form Errors
    errorEmailRequired: 'Silakan masukkan Alamat Email / NIP / Username Anda.',
    errorPasswordRequired: 'Silakan masukkan Kata Sandi Anda.',
    errorSystem: 'Terjadi kendala sistem saat mencoba masuk. Silakan coba lagi.',
    errorQuickLogin: 'Gagal masuk dengan akun pengujian RBAC.',
    errorSsoLogin: 'Gagal masuk via SSO.',

    // RBAC Section
    rbacTitle: 'Pengujian Cepat RBAC (13 Peran Otomatis)',
    rbacClose: 'Tutup (13 Peran) ▲',
    rbacOpen: 'Buka (13 Peran) ▼',

    // Primary Roles
    roleAdminLabel: 'Admin RS',
    roleAdminDesc: 'Akses Manajerial & Konfigurasi',
    roleDokterLabel: 'Dokter Spesialis',
    roleDokterDesc: 'Poli, RME, & Order Lab/Farmasi',
    rolePerawatLabel: 'Perawat Medis',
    rolePerawatDesc: 'Rawat Inap & Bed Monitoring',
    roleApotekerLabel: 'Apoteker / Depo',
    roleApotekerDesc: 'Dispensing Resep & Stok Obat',

    // Additional Roles
    roleAnalisLabLabel: 'Analis Lab',
    roleAnalisLabDept: 'Patologi Klinik',
    roleRadiograferLabel: 'Radiografer',
    roleRadiograferDept: 'Instalasi Radiologi',
    roleKasirLabel: 'Kasir & Billing',
    roleKasirDept: 'Loket Pembayaran',
    roleAdmisiLabel: 'Petugas Admisi',
    roleAdmisiDept: 'Pendaftaran Pasien',
    roleDriverLabel: 'Driver Ambulans',
    roleDriverDept: 'Pelayanan Ambulans',
    roleCssdLabel: 'Petugas CSSD',
    roleCssdDept: 'Sentral Sterilisasi',
    roleItSupportLabel: 'IT Support',
    roleItSupportDept: 'Infrastruktur Jaringan',
    rolePasienLabel: 'Pasien Mandiri',
    rolePasienDept: 'Portal Pasien',
    roleDirekturLabel: 'Direktur RS',
    roleDirekturDept: 'Direksi Rumah Sakit',

    // Right Footer
    footerSupport: 'Support to examstation • Support • RBAC & Opporrt',

    // SSO Modal
    ssoTitle: 'Single Sign-On (SSO) RSBD',
    ssoBadge: 'Kemenkes SatuSehat ID · SAML 2.0 Identity Server',
    ssoDescription:
      'Verifikasi identitas resmi pegawai dan tenaga medis rumah sakit menggunakan kredensial federasi institusi sebelum mengakses modul SIMRS.',
    ssoNipLabel: 'NIP Pegawai / Email Domain Institusi',
    ssoRoleLabel: 'Pilih Akun / Peran Terverifikasi',
    ssoOptionDokter: 'dr. Ratna Anindita, Sp.PD — Dokter Spesialis',
    ssoOptionAdmin: 'Bambang Sudibyo, S.Kom — Administrator SIMRS',
    ssoOptionPerawat: 'Ns. Siti Rahayu, S.Kep — Perawat Medis',
    ssoOptionApoteker: 'apt. Dewi Sartika, S.Farm — Apoteker',
    ssoOptionDirektur: 'dr. Hendrawan S., Sp.B, MARS — Direktur RS',
    ssoOptionAnalisLab: 'Hendra Gunawan, A.Md.AK — Analis Lab',
    ssoOptionKasir: 'Maya Anggraini, S.E. — Kasir & Billing',
    ssoOptionAdmisi: 'Agus Purnomo — Petugas Admisi',
    ssoSecurityBadge: 'Enkripsi TLS 1.3 & Verifikasi 2-Faktor Aktif (Kepatuhan HIPAA)',
    ssoStatusConnecting: 'Menghubungkan ke identity server Kemenkes & RSID...',
    ssoStatusVerifying: 'Memverifikasi token sertifikat SAML 2.0 & izin RBAC...',
    ssoCancel: 'Batalkan',
    ssoSubmit: 'Verifikasi & Masuk SSO',
  },
  en: {
    // Left Showcase / Facility Section
    hospitalName: 'RS Bhakti Digital',
    tagline: 'Serving with Technology, Caring with Heart',
    headlinePart1: 'Integrated Digital Platform',
    headlinePart2: 'for Modern',
    headlineHighlight: 'Hospital Care',
    description:
      'Integrated Hospital Management Information System (SIMRS) seamlessly connecting administration & queueing, polyclinics, electronic medical records (EMR), pharmacy, laboratory, and billing.',

    // Feature Cards
    featureRmeTitle: 'Medical Records (EMR)',
    featureRmeDesc: 'Integrated electronic clinical documentation with ICD-10 & SatuSehat standards.',
    featureAdmissionTitle: 'Administration & Queue',
    featureAdmissionDesc: 'Patient quota registration, queue number allocation, & BPJS matching.',
    featurePharmacyTitle: 'Pharmacy Installation',
    featurePharmacyDesc: 'Real-time e-Prescription validation, dispensing labels, & FIFO stock control.',
    featureBillingTitle: 'Cashier & Billing',
    featureBillingDesc: 'Inpatient/outpatient bill calculation & BPJS claim bridging integration.',

    // Left Footer
    copyright: '© 2025 RS Bhakti Digital. All Rights Reserved.',
    version: `SIMRS v${APP_VERSION}`,
    complianceBadge: 'Connected to SatuSehat MoH - BPJS Kesehatan Bridging',

    // Top Controls
    selectLanguage: 'Select Language / Pilih Bahasa',
    langId: 'Bahasa (ID)',
    langEn: 'English (EN)',
    themeLight: 'Light Mode',
    themeDark: 'Dark Mode',

    // Main Login Card
    welcomeTitle: 'Welcome to SIMRS',
    welcomeSubtitle: 'Sign in to access the hospital information system.',
    emailLabel: 'Email Address / Employee ID / Username',
    emailPlaceholder: 'example@rsbhaktidigital.id',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    rememberMe: 'Remember me on this device',
    forgotPassword: 'Forgot password?',
    forgotPasswordTooltip: "Select one of the cards under 'RBAC Quick Testing' below for instant login.",
    loginButton: 'Sign In to SIMRS Portal',
    orSeparator: 'or',
    ssoButton: 'Sign in with Hospital SSO',

    // Validation / Form Errors
    errorEmailRequired: 'Please enter your Email Address / Employee ID / Username.',
    errorPasswordRequired: 'Please enter your Password.',
    errorSystem: 'A system error occurred while signing in. Please try again.',
    errorQuickLogin: 'Failed to sign in with RBAC test account.',
    errorSsoLogin: 'Failed to sign in via SSO.',

    // RBAC Section
    rbacTitle: 'RBAC Quick Testing (13 Automated Roles)',
    rbacClose: 'Close (13 Roles) ▲',
    rbacOpen: 'Open (13 Roles) ▼',

    // Primary Roles
    roleAdminLabel: 'Hospital Admin',
    roleAdminDesc: 'Managerial Access & Configuration',
    roleDokterLabel: 'Specialist Doctor',
    roleDokterDesc: 'Clinic, EMR, & Lab/Rx Orders',
    rolePerawatLabel: 'Medical Nurse',
    rolePerawatDesc: 'Inpatient & Bed Monitoring',
    roleApotekerLabel: 'Pharmacist / Depot',
    roleApotekerDesc: 'Prescription Dispensing & Stock',

    // Additional Roles
    roleAnalisLabLabel: 'Lab Analyst',
    roleAnalisLabDept: 'Clinical Pathology',
    roleRadiograferLabel: 'Radiographer',
    roleRadiograferDept: 'Radiology Installation',
    roleKasirLabel: 'Cashier & Billing',
    roleKasirDept: 'Payment Counter',
    roleAdmisiLabel: 'Admission Officer',
    roleAdmisiDept: 'Patient Registration',
    roleDriverLabel: 'Ambulance Driver',
    roleDriverDept: 'Ambulance Service',
    roleCssdLabel: 'CSSD Officer',
    roleCssdDept: 'Central Sterilization',
    roleItSupportLabel: 'IT Support',
    roleItSupportDept: 'Network Infrastructure',
    rolePasienLabel: 'Self-Service Patient',
    rolePasienDept: 'Patient Portal',
    roleDirekturLabel: 'Hospital Director',
    roleDirekturDept: 'Hospital Executive Board',

    // Right Footer
    footerSupport: 'Technical Support • SIMRS Helpdesk • RBAC Compliance',

    // SSO Modal
    ssoTitle: 'RSBD Single Sign-On (SSO)',
    ssoBadge: 'MoH SatuSehat ID · SAML 2.0 Identity Server',
    ssoDescription:
      'Verify official identity of hospital staff and clinicians using institutional federated credentials before accessing SIMRS modules.',
    ssoNipLabel: 'Employee ID / Institutional Domain Email',
    ssoRoleLabel: 'Select Verified Account / Role',
    ssoOptionDokter: 'dr. Ratna Anindita, Sp.PD — Specialist Doctor',
    ssoOptionAdmin: 'Bambang Sudibyo, S.Kom — SIMRS Administrator',
    ssoOptionPerawat: 'Ns. Siti Rahayu, S.Kep — Medical Nurse',
    ssoOptionApoteker: 'apt. Dewi Sartika, S.Farm — Pharmacist',
    ssoOptionDirektur: 'dr. Hendrawan S., Sp.B, MARS — Hospital Director',
    ssoOptionAnalisLab: 'Hendra Gunawan, A.Md.AK — Lab Analyst',
    ssoOptionKasir: 'Maya Anggraini, S.E. — Cashier & Billing',
    ssoOptionAdmisi: 'Agus Purnomo — Admission Officer',
    ssoSecurityBadge: 'TLS 1.3 Encryption & 2-Factor Verification Active (HIPAA Compliant)',
    ssoStatusConnecting: 'Connecting to MoH & RSID identity server...',
    ssoStatusVerifying: 'Verifying SAML 2.0 certificate token & RBAC permissions...',
    ssoCancel: 'Cancel',
    ssoSubmit: 'Verify & Sign In with SSO',
  },
} as const;

export default translations;
