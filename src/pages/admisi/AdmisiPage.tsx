import { useState } from 'react';
import type { Patient, Appointment } from '@/lib/types';
import { MOCK_PATIENTS, MOCK_DOCTORS, MOCK_APPOINTMENTS } from '@/lib/mock-data';
import { formatDate, generateQueueNumber } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';

export default function AdmisiPage() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // New Registration Form Modal
  const [showRegModal, setShowRegModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Queue Ticket Modal
  const [activeTicket, setActiveTicket] = useState<{
    queueNumber: string;
    patientName: string;
    department: string;
    doctorName: string;
    time: string;
  } | null>(null);

  // New Patient Form State
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthDate: '',
    gender: 'Laki-laki' as Patient['gender'],
    bloodType: 'O' as Patient['bloodType'],
    phone: '',
    address: '',
    insuranceType: 'BPJS Kesehatan' as Patient['insuranceType'],
    bpjsNumber: '',
    emergencyName: '',
    emergencyRel: 'Keluarga',
    emergencyPhone: '',
  });

  // New Queue Form State (For existing or newly registered patient)
  const [queueForm, setQueueForm] = useState({
    selectedDoctorId: MOCK_DOCTORS[0].id,
    complaint: '',
    patientCareType: 'Rawat Jalan' as Appointment['type'],
  });

  // Filter patients by search (RM / NIK / Name)
  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.name || p.nama_lengkap || '').toLowerCase().includes(term) ||
      (p.id || p.no_rm || '').toLowerCase().includes(term) ||
      (p.nik || '').includes(term) ||
      (p.phone || p.no_telepon || '').includes(term)
    );
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.nik.length !== 16) {
      alert('NIK harus terdiri dari tepat 16 digit angka!');
      return;
    }
    if (formData.insuranceType === 'BPJS Kesehatan' && !formData.bpjsNumber) {
      alert('Nomor Kartu BPJS wajib diisi jika memilih penjamin BPJS Kesehatan!');
      return;
    }

    const newRM = `RM-${String(patients.length + 2481).padStart(6, '0')}`;
    const genderMapped: 'L' | 'P' = formData.gender === 'Perempuan' ? 'P' : 'L';
    const newPatient: Patient = {
      id: newRM,
      no_rm: newRM,
      nik: formData.nik,
      nama_lengkap: formData.name,
      tanggal_lahir: formData.birthDate,
      jenis_kelamin: genderMapped,
      alamat: formData.address,
      no_telepon: formData.phone,
      no_bpjs: formData.bpjsNumber || undefined,
      kelas_bpjs: formData.insuranceType === 'BPJS Kesehatan' ? 2 : undefined,
      name: formData.name,
      birthDate: formData.birthDate,
      gender: formData.gender,
      bloodType: formData.bloodType,
      phone: formData.phone,
      address: formData.address,
      bpjsNumber: formData.bpjsNumber,
      bpjsActive: formData.insuranceType === 'BPJS Kesehatan',
      insuranceType: formData.insuranceType,
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRel,
        phone: formData.emergencyPhone,
      },
      registeredAt: new Date().toISOString().split('T')[0],
    };

    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatient(newPatient);
    setShowRegModal(false);
    setToastMessage(`Pasien baru berhasil didaftarkan dengan Nomor RM: ${newRM}`);

    // Reset Form
    setFormData({
      name: '',
      nik: '',
      birthDate: '',
      gender: 'Laki-laki',
      bloodType: 'O',
      phone: '',
      address: '',
      insuranceType: 'BPJS Kesehatan',
      bpjsNumber: '',
      emergencyName: '',
      emergencyRel: 'Keluarga',
      emergencyPhone: '',
    });

    setTimeout(() => setToastMessage(''), 5000);
  };

  const handleCreateQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert('Pilih pasien terlebih dahulu untuk membuat nomor antrian!');
      return;
    }

    const doctor = MOCK_DOCTORS.find((d) => d.id === queueForm.selectedDoctorId) || MOCK_DOCTORS[0];
    const newQueueNum = generateQueueNumber('A', appointments.length + 1);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const patientDisplayName = selectedPatient.name || selectedPatient.nama_lengkap || 'Pasien';
    const doctorDisplayName = doctor.name || doctor.nama_dokter || 'dr. Umum';
    const doctorDept = doctor.specialty || doctor.spesialisasi || 'Poli Umum';

    const newAppointment: Appointment = {
      id: `APT-${appointments.length + 1001}`,
      patient_id: selectedPatient.id,
      doctor_id: doctor.id,
      tanggal_periksa: now.toISOString().split('T')[0],
      nomor_antrean: newQueueNum,
      jenis_pembayaran: selectedPatient.insuranceType === 'BPJS Kesehatan' ? 'bpjs' : 'umum',
      queueNumber: newQueueNum,
      patientId: selectedPatient.id,
      patientName: patientDisplayName,
      doctorId: doctor.id,
      doctorName: doctorDisplayName,
      department: doctorDept,
      date: now.toISOString().split('T')[0],
      time: timeStr,
      status: 'Menunggu',
      type: queueForm.patientCareType,
      complaint: queueForm.complaint || 'Pemeriksaan rutin / konsultasi dokter',
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setQueueForm({
      selectedDoctorId: MOCK_DOCTORS[0].id,
      complaint: '',
      patientCareType: 'Rawat Jalan',
    });

    // Show Printable Ticket
    setActiveTicket({
      queueNumber: newQueueNum,
      patientName: patientDisplayName,
      department: doctorDept,
      doctorName: doctorDisplayName,
      time: timeStr,
    });
  };

  const handleCallQueue = (aptId: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status: 'Pemeriksaan' } : a))
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-semibold text-white shadow-md animate-in fade-in">
          <Icon name="check-circle" size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Section: Header & Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 border border-teal-200">
                Front Office & Loket Pendaftaran
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Admisi Pasien & Manajemen Antrian</h1>
            <p className="text-xs text-slate-500">
              Registrasi pasien baru, verifikasi kepesertaan BPJS/Asuransi, dan penerbitan tiket antrian poli.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowRegModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition shrink-0"
          >
            <Icon name="plus" size={16} />
            Daftar Pasien Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Patient Search & Direct Queue Creator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Search Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Cari Pasien Terdaftar</h2>
            <p className="text-xs text-slate-500 mb-4">Cari berdasarkan No. Rekam Medis (RM), NIK KTP (16 Digit), atau Nama Lengkap</p>

            <div className="relative">
              <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Ketik nama, RM (contoh: RM-002481), atau 16 digit NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-xs placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Search Results Dropdown/List */}
            {searchTerm && (
              <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50/50 divide-y divide-slate-100">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className={`p-3 text-xs flex items-center justify-between cursor-pointer hover:bg-teal-50/70 transition ${
                        selectedPatient?.id === p.id ? 'bg-teal-50 border-l-4 border-teal-600' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="font-mono text-teal-700 font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                            {p.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">NIK: {p.nik}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {p.gender} · {p.birthDate} · Asuransi: <strong className="text-slate-700">{p.insuranceType}</strong>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded bg-teal-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-teal-700"
                      >
                        Pilih Pasien
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Pasien tidak ditemukan. Silakan klik tombol "Daftar Pasien Baru".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Patient & Queue Generator Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Penerbitan Tiket & Antrian Poli</h2>
            <p className="text-xs text-slate-500 mb-4">Pilih dokter tujuan dan buat nomor antrian otomatis</p>

            {selectedPatient ? (
              <form onSubmit={handleCreateQueue} className="space-y-4">
                {/* Patient Summary Badge */}
                <div className="rounded-lg bg-teal-50/70 border border-teal-200 p-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-teal-700 font-semibold block uppercase">Pasien Terpilih:</span>
                      <span className="text-base font-extrabold text-slate-900">{selectedPatient.name}</span>
                      <span className="ml-2 font-mono text-xs text-teal-800 font-bold bg-white px-2 py-0.5 rounded border border-teal-300">
                        {selectedPatient.id}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="inline-block rounded-full bg-teal-600 text-white font-medium px-2 py-0.5 text-[10px]">
                        {selectedPatient.insuranceType}
                      </span>
                      {selectedPatient.bpjsNumber && (
                        <span className="block font-mono text-[10px] text-slate-500 mt-0.5">
                          BPJS: {selectedPatient.bpjsNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Queue Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Dokter & Poli Tujuan:</label>
                    <select
                      value={queueForm.selectedDoctorId}
                      onChange={(e) => setQueueForm((prev) => ({ ...prev, selectedDoctorId: e.target.value }))}
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                    >
                      {MOCK_DOCTORS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name || d.nama_dokter} ({d.specialty || d.spesialisasi})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Jenis Layanan Perawatan:</label>
                    <select
                      value={queueForm.patientCareType}
                      onChange={(e) =>
                        setQueueForm((prev) => ({
                          ...prev,
                          patientCareType: e.target.value as Appointment['type'],
                        }))
                      }
                      className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                    >
                      <option value="Rawat Jalan">Rawat Jalan (Poliklinik)</option>
                      <option value="Rawat Inap">Rawat Inap (Kamar Bed)</option>
                      <option value="IGD">Instalasi Gawat Darurat (IGD)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Keluhan Pasien saat ini:</label>
                  <textarea
                    rows={2}
                    value={queueForm.complaint}
                    onChange={(e) => setQueueForm((prev) => ({ ...prev, complaint: e.target.value }))}
                    placeholder="Contoh: Sakit kepala hebat, mual, demam sejak kemarin..."
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Ganti Pasien
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                  >
                    <Icon name="printer" size={15} />
                    Cetak Nomor Antrian
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                <Icon name="search" size={28} className="mx-auto mb-2 text-slate-300" />
                Silakan cari dan pilih pasien di atas untuk menerbitkan nomor antrian.
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Live Today Queue Counter & Status Board */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Papan Antrian Hari Ini</h2>
              <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Total: {appointments.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-amber-50 p-3 border border-amber-200/60">
                <span className="text-xs font-medium text-amber-800">Menunggu Panggilan</span>
                <span className="font-bold text-lg text-amber-900 font-mono">
                  {appointments.filter((a) => a.status === 'Menunggu').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3 border border-blue-200/60">
                <span className="text-xs font-medium text-blue-800">Sedang Diperiksa</span>
                <span className="font-bold text-lg text-blue-900 font-mono">
                  {appointments.filter((a) => a.status === 'Pemeriksaan').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 border border-emerald-200/60">
                <span className="text-xs font-medium text-emerald-800">Selesai Dilayani</span>
                <span className="font-bold text-lg text-emerald-900 font-mono">
                  {appointments.filter((a) => a.status === 'Selesai').length}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="text-xs font-bold text-slate-800 mb-2">Antrian Menunggu Terdepan:</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {appointments.filter((a) => a.status === 'Menunggu').length > 0 ? (
                  appointments
                    .filter((a) => a.status === 'Menunggu')
                    .map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-teal-700">{apt.queueNumber}</span>
                          <span className="ml-2 font-medium text-slate-800 block sm:inline">{apt.patientName}</span>
                          <span className="text-[10px] text-slate-400 block">{apt.department}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCallQueue(apt.id)}
                          className="rounded bg-teal-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-teal-700"
                        >
                          Panggil
                        </button>
                      </div>
                    ))
                ) : (
                  <p className="text-center text-xs text-slate-400 py-3">Tidak ada antrian yang sedang menunggu.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Patient Registration Modal */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Formulir Pendaftaran Pasien Baru</h3>
                <p className="text-xs text-slate-500">Lengkapi data identitas kependudukan & penjamin pasien</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap Pasien *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Siti Rahmawati"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Induk Kependudukan (NIK 16 Digit) *</label>
                  <input
                    type="text"
                    name="nik"
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="Contoh: 3171012304890001"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenis Kelamin *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Golongan Darah</label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor Telepon / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Contoh: 0812-3456-7890"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jenis Penjamin / Asuransi *</label>
                  <select
                    name="insuranceType"
                    value={formData.insuranceType}
                    onChange={handleInputChange}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 focus:border-teal-500 focus:outline-none"
                  >
                    <option value="BPJS Kesehatan">BPJS Kesehatan</option>
                    <option value="Umum / Mandiri">Umum / Mandiri (Bayar Tunai)</option>
                    <option value="Asuransi Swasta">Asuransi Swasta (AdMedika/Prudential)</option>
                  </select>
                </div>
              </div>

              {formData.insuranceType === 'BPJS Kesehatan' && (
                <div className="rounded-lg bg-teal-50/70 p-3 border border-teal-200">
                  <label className="font-semibold text-teal-900 block mb-1">Nomor Kartu BPJS Kesehatan (13 Digit) *</label>
                  <input
                    type="text"
                    name="bpjsNumber"
                    value={formData.bpjsNumber}
                    onChange={handleInputChange}
                    placeholder="Contoh: 0001234567890"
                    className="h-9 w-full rounded-lg border border-teal-300 bg-white px-3 font-mono text-slate-800 focus:border-teal-500 focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Domisili Lengkap *</label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-slate-800 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Emergency Contact */}
              <div className="border-t border-slate-100 pt-3">
                <span className="font-bold text-slate-800 block mb-2">Kontak Darurat / Penanggung Jawab Pasien:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Nama Kontak Darurat</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleInputChange}
                      placeholder="Nama keluarga"
                      className="h-8 w-full rounded border border-slate-200 px-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Hubungan</label>
                    <input
                      type="text"
                      name="emergencyRel"
                      value={formData.emergencyRel}
                      onChange={handleInputChange}
                      placeholder="e.g. Suami / Istri / Orang Tua"
                      className="h-8 w-full rounded border border-slate-200 px-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">No. Telp Darurat</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleInputChange}
                      placeholder="0812..."
                      className="h-8 w-full rounded border border-slate-200 px-2.5 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-teal-700 transition"
                >
                  Simpan & Terbitkan No. RM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Preview Simulation Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="flex justify-center text-teal-600">
              <Icon name="hospital" size={36} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg">RS Bhakti Digital</h3>
              <p className="text-[11px] text-slate-500">Jl. Jendral Sudirman Kav. 52, Jakarta</p>
              <div className="border-b border-dashed border-slate-300 my-3" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Nomor Antrian Anda</span>
              <div className="text-4xl font-black text-teal-700 font-mono tracking-tight my-2">
                {activeTicket.queueNumber}
              </div>
              <span className="text-xs font-bold text-slate-800">{activeTicket.department}</span>
              <p className="text-[11px] text-slate-500">{activeTicket.doctorName}</p>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 text-left text-[11px] space-y-1 text-slate-600 border border-slate-100">
              <div className="flex justify-between">
                <span>Nama Pasien:</span>
                <strong className="text-slate-800">{activeTicket.patientName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Waktu Cetak:</span>
                <span className="font-mono">{activeTicket.time}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Harap perhatikan nomor antrian Anda di layar monitor ruang tunggu poliklinik. Terima kasih.
            </p>

            <button
              type="button"
              onClick={() => setActiveTicket(null)}
              className="w-full rounded-lg bg-teal-600 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { AdmisiPage };
