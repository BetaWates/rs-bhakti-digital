import { useState } from 'react';
import type { Appointment, Doctor, LabOrder } from '@/lib/types';
import { MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_LAB_ORDERS, MOCK_MEDICINES } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import { useAuth } from '@/contexts/AuthContext';

export default function DoctorDashboard() {
  const { currentDoctor, setDoctor } = useAuth();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(currentDoctor.id);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [activeTab, setActiveTab] = useState<'antrian' | 'laboratorium'>('antrian');

  // Quick EMR Modal State
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [quickDiagnosis, setQuickDiagnosis] = useState('');
  const [quickTreatment, setQuickTreatment] = useState('');
  const [quickMedicine, setQuickMedicine] = useState('');
  const [quickDosage, setQuickDosage] = useState('3x1 sehari sesudah makan');
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [heartRate, setHeartRate] = useState('78');
  const [temperature, setTemperature] = useState('36.5');
  const [emrSuccessToast, setEmrSuccessToast] = useState('');

  // Active doctor
  const activeDoctor = MOCK_DOCTORS.find((d) => d.id === selectedDoctorId) || currentDoctor;

  // Appointments for this doctor
  const doctorAppointments = appointments.filter((apt) => apt.doctorId === activeDoctor.id);

  // Lab orders for this doctor's patients
  const doctorLabOrders = labOrders.filter((order) => order.doctorName.includes(activeDoctor.name.split(',')[0]));

  const inConsultationPatient = doctorAppointments.find((a) => a.status === 'Pemeriksaan');
  const waitingPatients = doctorAppointments.filter((a) => a.status === 'Menunggu');
  const completedPatients = doctorAppointments.filter((a) => a.status === 'Selesai');

  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const newDoc = MOCK_DOCTORS.find((d) => d.id === docId);
    if (newDoc) {
      setDoctor(newDoc);
    }
  };

  const handleStatusChange = (aptId: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    );
  };

  const handleSaveQuickEMR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    // Mark as completed
    handleStatusChange(selectedAppointment.id, 'Selesai');
    setEmrSuccessToast(`Rekam Medis Cepat berhasil disimpan untuk ${selectedAppointment.patientName}`);
    setSelectedAppointment(null);
    setQuickDiagnosis('');
    setQuickTreatment('');
    setQuickMedicine('');

    setTimeout(() => {
      setEmrSuccessToast('');
    }, 4000);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {emrSuccessToast && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-4">
          <Icon name="check-circle" size={18} />
          <span>{emrSuccessToast}</span>
        </div>
      )}

      {/* Doctor Header & Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-700 border-2 border-teal-200 font-bold text-lg">
              {activeDoctor.name
                .replace('dr. ', '')
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                  Panel Dokter Spesialis
                </span>
                <span className="text-xs text-slate-400 font-mono">{activeDoctor.sip}</span>
              </div>
              <h1 className="mt-1 text-xl font-bold text-slate-900">{activeDoctor.name}</h1>
              <p className="text-xs text-slate-500">
                {activeDoctor.specialty} · Ruangan: <span className="font-semibold text-slate-700">{activeDoctor.roomNumber}</span>
              </p>
            </div>
          </div>

          {/* Switch Doctor Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Ganti Profil Dokter:</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-800 focus:border-teal-500 focus:outline-none"
            >
              {MOCK_DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stat Counter Bar */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <span className="text-[11px] font-medium text-slate-500 block">Total Pasien Hari Ini</span>
            <span className="text-xl font-bold text-slate-900">{doctorAppointments.length} Pasien</span>
          </div>
          <div className="rounded-lg bg-amber-50/60 p-3">
            <span className="text-[11px] font-medium text-amber-700 block">Menunggu Konsultasi</span>
            <span className="text-xl font-bold text-amber-800">{waitingPatients.length} Pasien</span>
          </div>
          <div className="rounded-lg bg-blue-50/60 p-3">
            <span className="text-[11px] font-medium text-blue-700 block">Sedang Diperiksa</span>
            <span className="text-xl font-bold text-blue-800">{inConsultationPatient ? 1 : 0} Pasien</span>
          </div>
          <div className="rounded-lg bg-emerald-50/60 p-3">
            <span className="text-[11px] font-medium text-emerald-700 block">Selesai Ditangani</span>
            <span className="text-xl font-bold text-emerald-800">{completedPatients.length} Pasien</span>
          </div>
        </div>
      </div>

      {/* Currently In-Consultation Spotlight Card */}
      {inConsultationPatient && (
        <div className="rounded-xl border-2 border-teal-500 bg-gradient-to-r from-teal-50/80 to-cyan-50/60 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-teal-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Pasien Sedang Diperiksa Saat Ini
                </span>
                <span className="font-mono font-bold text-xs bg-white text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                  {inConsultationPatient.queueNumber}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{inConsultationPatient.patientName}</h2>
              <p className="text-xs text-slate-600">
                No. RM: <span className="font-mono font-semibold">{inConsultationPatient.patientId}</span> · Waktu Masuk: {inConsultationPatient.time}
              </p>
              <div className="mt-2 rounded-lg bg-white/80 p-3 border border-teal-100 text-xs text-slate-700">
                <span className="font-semibold text-teal-900">Keluhan Pasien: </span>
                {inConsultationPatient.complaint}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedAppointment(inConsultationPatient)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
              >
                <Icon name="file-text" size={16} />
                Input EMR & Resep Cepat
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange(inConsultationPatient.id, 'Selesai')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg border border-teal-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-teal-800 hover:bg-teal-50 transition"
              >
                <Icon name="check" size={16} />
                Selesaikan Konsultasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('antrian')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 transition ${
            activeTab === 'antrian'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="calendar" size={16} />
          Jadwal & Antrian Pasien ({doctorAppointments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('laboratorium')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 transition ${
            activeTab === 'laboratorium'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="flask" size={16} />
          Hasil Laboratorium Pasien ({doctorLabOrders.length})
        </button>
      </div>

      {/* Tab 1: Antrian Pasien Dokter */}
      {activeTab === 'antrian' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs">Daftar Antrian Rawat Jalan</h3>
            <span className="text-[11px] text-slate-500">Urutan panggilan berdasarkan nomor antrian</span>
          </div>

          <div className="divide-y divide-slate-100">
            {doctorAppointments.length > 0 ? (
              doctorAppointments.map((apt) => (
                <div key={apt.id} className="p-4 hover:bg-slate-50/80 transition flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-sm font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 rounded">
                      {apt.queueNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
                        <span className="text-xs font-mono text-slate-400">({apt.patientId})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            apt.status === 'Pemeriksaan'
                              ? 'bg-blue-100 text-blue-700'
                              : apt.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        <strong className="text-slate-700">Keluhan:</strong> {apt.complaint}
                      </p>
                      <span className="mt-1 text-[11px] text-slate-400 block font-mono">
                        Jadwal: {apt.time} · {apt.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {apt.status === 'Menunggu' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(apt.id, 'Pemeriksaan')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
                      >
                        <Icon name="bell" size={14} />
                        Panggil Pasien
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedAppointment(apt)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-500 hover:text-teal-600 transition"
                    >
                      <Icon name="edit" size={14} />
                      Input EMR
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Icon name="users" size={32} className="mx-auto mb-2 text-slate-300" />
                Tidak ada pasien terdaftar untuk dokter ini hari ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Hasil Laboratorium Pasien */}
      {activeTab === 'laboratorium' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-xs">Pemeriksaan Diagnostik & Lab Pasien</h3>
            <span className="text-[11px] text-slate-500">Hasil tes lab yang dipesan untuk pasien Anda</span>
          </div>

          <div className="divide-y divide-slate-100">
            {doctorLabOrders.length > 0 ? (
              doctorLabOrders.map((lab) => (
                <div key={lab.id} className="p-4 hover:bg-slate-50/80 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{lab.patientName}</span>
                        <span className="font-mono text-xs text-slate-400">({lab.patientId})</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            lab.priority === 'Cito / Darurat' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {lab.priority}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            lab.status === 'Selesai'
                              ? 'bg-emerald-100 text-emerald-700'
                              : lab.status === 'Proses'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          Status: {lab.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-semibold text-teal-800">{lab.testType}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Dipesan: {lab.orderDate}</p>
                    </div>
                  </div>

                  {/* Render Results if Completed */}
                  {lab.results && lab.results.length > 0 && (
                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-200 font-semibold">
                            <th className="pb-1.5">Parameter Uji</th>
                            <th className="pb-1.5">Hasil</th>
                            <th className="pb-1.5">Nilai Rujukan Normal</th>
                            <th className="pb-1.5">Satuan</th>
                            <th className="pb-1.5">Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {lab.results.map((res, i) => (
                            <tr key={i} className="text-slate-700">
                              <td className="py-1.5 font-medium">{res.testName}</td>
                              <td className={`py-1.5 font-mono font-bold ${res.status === 'Tinggi' ? 'text-rose-600' : 'text-slate-900'}`}>
                                {res.result}
                              </td>
                              <td className="py-1.5 text-slate-500 font-mono">{res.normalRange}</td>
                              <td className="py-1.5 text-slate-500">{res.unit}</td>
                              <td className="py-1.5">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                    res.status === 'Tinggi'
                                      ? 'bg-rose-50 text-rose-700 font-bold'
                                      : 'bg-emerald-50 text-emerald-700'
                                  }`}
                                >
                                  {res.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Icon name="flask" size={32} className="mx-auto mb-2 text-slate-300" />
                Tidak ada pesanan tes laboratorium untuk pasien dokter ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick EMR Entry Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Entri Cepat Rekam Medis Elektronik (EMR)</h3>
                <p className="text-xs text-slate-500">
                  Pasien: <strong className="text-slate-800">{selectedAppointment.patientName}</strong> ({selectedAppointment.patientId})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEMR} className="p-6 space-y-4 text-xs">
              {/* Tanda-tanda Vital */}
              <div>
                <label className="font-bold text-slate-800 block mb-2">Tanda-tanda Vital (TTV Pasien):</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Tekanan Darah (mmHg)</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        className="h-8 w-16 rounded border border-slate-200 px-2 text-center font-mono"
                        placeholder="120"
                        required
                      />
                      <span>/</span>
                      <input
                        type="number"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                        className="h-8 w-16 rounded border border-slate-200 px-2 text-center font-mono"
                        placeholder="80"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Denyut Nadi (bpm)</span>
                    <input
                      type="number"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="h-8 w-full rounded border border-slate-200 px-2 text-center font-mono"
                      placeholder="80"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Suhu Tubuh (°C)</span>
                    <input
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="h-8 w-full rounded border border-slate-200 px-2 text-center font-mono"
                      placeholder="36.5"
                      required
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">SpO2 (%)</span>
                    <input
                      type="number"
                      defaultValue="98"
                      className="h-8 w-full rounded border border-slate-200 px-2 text-center font-mono"
                      placeholder="98"
                    />
                  </div>
                </div>
              </div>

              {/* Anamnesis / Keluhan Utama */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Anamnesis / Keluhan Pasien:</label>
                <textarea
                  defaultValue={selectedAppointment.complaint}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Diagnosis ICD-10 */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Diagnosis Klinis (ICD-10):</label>
                <input
                  type="text"
                  placeholder="Contoh: I10 - Hipertensi Esensial (Primer)"
                  value={quickDiagnosis}
                  onChange={(e) => setQuickDiagnosis(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Tindakan Medis */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Tindakan Medis / Advice Terapi:</label>
                <input
                  type="text"
                  placeholder="Contoh: Edukasi diet rendah garam, pengukuran EKG berkala"
                  value={quickTreatment}
                  onChange={(e) => setQuickTreatment(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                  required
                />
              </div>

              {/* Resep Obat Elektronik */}
              <div className="rounded-lg bg-teal-50/50 p-3.5 border border-teal-100">
                <label className="font-bold text-teal-900 block mb-2">Preskripsi Resep Farmasi (e-Prescription):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Pilih Obat dari Formularium</span>
                    <select
                      value={quickMedicine}
                      onChange={(e) => setQuickMedicine(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                    >
                      <option value="">-- Pilih Obat --</option>
                      {MOCK_MEDICINES.map((med) => (
                        <option key={med.id} value={med.name}>
                          {med.name} (Stok: {med.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Dosis & Aturan Pakai</span>
                    <input
                      type="text"
                      value={quickDosage}
                      onChange={(e) => setQuickDosage(e.target.value)}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                      placeholder="e.g. 1x1 sehari malam hari"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700 transition"
                >
                  <Icon name="save" size={15} />
                  Simpan EMR & Selesaikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { DoctorDashboard };
