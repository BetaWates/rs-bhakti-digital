import { useState } from 'react';
import { Icon } from '@/components/shared/Icon';
import { useAuth } from '@/contexts/AuthContext';

export function SettingsPage() {
  const { user, updateUserProfile, currentRole, setRole } = useAuth();

  // Profile Form State
  const [name, setName] = useState(user?.name || user?.nama_lengkap || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@rsbhaktidigital.id');
  const [phone, setPhone] = useState('0812-3456-7890');
  const [department, setDepartment] = useState('Teknologi Informasi & SIMRS');

  // Notification Preferences
  const [notifLabCito, setNotifLabCito] = useState(true);
  const [notifQueue, setNotifQueue] = useState(true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifDailyReport, setNotifDailyReport] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);

  // System & Security
  const [sessionTimeout, setSessionTimeout] = useState('30 Menit');
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const [toastMessage, setToastMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama lengkap tidak boleh kosong!');
      return;
    }
    updateUserProfile?.({ name, email });
    setToastMessage('Profil pengguna dan preferensi SIMRS berhasil diperbarui!');
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-semibold text-white shadow-md animate-in fade-in">
          <Icon name="check-circle" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 border border-teal-200">
            Konfigurasi & Akun Pengguna
          </span>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Pengaturan Sistem & Profil Pengguna</h1>
        <p className="text-xs text-slate-500">
          Kelola profil identitas Anda, peran akses modul SIMRS, notifikasi operasional, dan parameter keamanan.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: User Profile & Role Switcher */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Informasi Profil Pengguna
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-2xl border-4 border-teal-50">
              {user?.avatar || 'AP'}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-slate-900">{user?.name || user?.nama_lengkap || 'Administrator'}</h3>
              <p className="text-xs text-slate-500">{user?.email || 'admin@rsbhaktidigital.id'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold text-teal-800 border border-teal-200">
                  {user?.roleLabel || user?.role || user?.role_id || 'Staff'}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                  Unit: {department}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alamat Email Resmi *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp / Kontak</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 font-mono text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unit Kerja / Instalasi</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800"
              />
            </div>
          </div>

          {/* Role Access Testing Switcher */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 mt-4">
            <label className="font-bold text-slate-800 block text-xs mb-1">
              Simulasi Peran Hak Akses (Role Permission):
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Ubah peran pengguna ini untuk menguji hak akses halaman (Dokter, Admin, Kasir, Apoteker).
            </p>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as any)}
              className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 focus:border-teal-500"
            >
              <option value="admin">Administrator SIMRS (Hak Akses Penuh)</option>
              <option value="doctor">Dokter Spesialis (Akses EMR, Resep, Lab)</option>
              <option value="admission">Petugas Admisi (Pendaftaran & Antrian)</option>
              <option value="pharmacist">Apoteker Farmasi (Dispensing & Stok)</option>
              <option value="lab_tech">Pranata Laboratorium (Validasi Uji Lab)</option>
              <option value="cashier">Kasir Keuangan (Billing & Kwitansi)</option>
            </select>
          </div>
        </div>

        {/* Section 2: Notification Preferences */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Preferensi Pemberitahuan & Notifikasi
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Pemberitahuan Hasil Lab CITO / Kritis</strong>
                <span className="text-slate-500 text-[11px]">Munculkan notifikasi pop-up saat hasil lab darurat selesai diverifikasi.</span>
              </div>
              <input
                type="checkbox"
                checked={notifLabCito}
                onChange={(e) => setNotifLabCito(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Suara Panggilan & Audio Antrian</strong>
                <span className="text-slate-500 text-[11px]">Putar suara 'Ding-Dong' saat memanggil nomor antrian pasien ke poliklinik.</span>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Integrasi Notifikasi WhatsApp Pasien</strong>
                <span className="text-slate-500 text-[11px]">Kirim nomor antrian dan jadwal kontrol otomatis via WhatsApp Gateway RS.</span>
              </div>
              <input
                type="checkbox"
                checked={notifWhatsApp}
                onChange={(e) => setNotifWhatsApp(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
              <div>
                <strong className="text-slate-800 block">Laporan Ringkasan Pendapatan Harian</strong>
                <span className="text-slate-500 text-[11px]">Kirim rekapitulasi penutupan kas kasir harian pukul 21:00 WIB ke email.</span>
              </div>
              <input
                type="checkbox"
                checked={notifDailyReport}
                onChange={(e) => setNotifDailyReport(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Security & Session Settings */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Keamanan Akun & Waktu Sesi SIMRS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Batas Waktu Sesi Otomatis (Auto-Logout)</label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800"
              >
                <option value="15 Menit">15 Menit Tidak Aktif</option>
                <option value="30 Menit">30 Menit Tidak Aktif (Direkomendasikan)</option>
                <option value="60 Menit">60 Menit</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Autentikasi 2-Faktor (2FA OTP)</label>
              <div className="flex items-center justify-between h-9 px-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="font-medium text-slate-700">Status 2FA Google Authenticator</span>
                <span className="font-bold text-emerald-700">AKTIF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
          >
            <Icon name="save" size={15} />
            Simpan Perubahan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsPage;
