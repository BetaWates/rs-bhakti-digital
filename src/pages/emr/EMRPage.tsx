import { useState } from 'react';
import type { Patient, Appointment, MedicalRecord, PrescriptionItem } from '@/lib/types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_DOCTORS, MOCK_MEDICINES } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Icon } from '@/components/shared/Icon';
import { useAuth } from '@/contexts/AuthContext';

export default function EMRPage() {
  const { currentDoctor } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedAptId, setSelectedAptId] = useState<string>(MOCK_APPOINTMENTS[0].id);

  // Active appointment and patient
  const selectedAppointment = appointments.find((a) => a.id === selectedAptId) || appointments[0];
  const patient = MOCK_PATIENTS.find((p) => p.id === selectedAppointment.patientId) || MOCK_PATIENTS[0];

  // Vital Signs Form
  const [vitalSigns, setVitalSigns] = useState({
    systolic: 120,
    diastolic: 80,
    heartRate: 78,
    temperature: 36.5,
    respiratoryRate: 18,
    oxygenSaturation: 98,
    weight: 65,
    height: 168,
  });

  // Clinical Records Form
  const [chiefComplaint, setChiefComplaint] = useState(selectedAppointment.complaint || '');
  const [anamnesis, setAnamnesis] = useState(
    'Pasien mengeluhkan gejala sejak 3 hari yang lalu. Tidak ada riwayat alergi obat penisilin.'
  );
  const [diagnosisCode, setDiagnosisCode] = useState('I10');
  const [diagnosis, setDiagnosis] = useState('Hipertensi Esensial (Primer)');
  const [treatment, setTreatment] = useState('Edukasi gaya hidup sehat, restriksi garam < 5g/hari');
  const [doctorNotes, setDoctorNotes] = useState('Kontrol ulang 2 minggu lagi atau jika keluhan memburuk.');

  // e-Prescription items
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicineId: 'MED-003',
      medicineName: 'Amlodipine Besilate 5 mg',
      dosage: '1 tablet (5 mg)',
      frequency: '1x1 sehari (pagi hari)',
      quantity: 30,
      instructions: 'Diminum sesudah makan pagi',
    },
  ]);

  // Selected Lab Tests
  const [labOrders, setLabOrders] = useState<string[]>(['Profil Lipid Lengkap']);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabModal, setShowLabModal] = useState(false);
  const [successNotification, setSuccessNotification] = useState('');

  // Prescription Form modal state
  const [newMedId, setNewMedId] = useState(MOCK_MEDICINES[0].id);
  const [newMedFrequency, setNewMedFrequency] = useState('3x1 sehari sesudah makan');
  const [newMedQty, setNewMedQty] = useState(10);
  const [newMedInstructions, setNewMedInstructions] = useState('Habiskan');

  // Past Medical Records Mock
  const [pastRecords, setPastRecords] = useState<Partial<MedicalRecord>[]>([
    {
      id: 'REC-2025-001',
      date: '2025-03-12',
      doctorName: 'dr. Andi Pratama, Sp.JP',
      diagnosis: 'I10 - Hipertensi Stadium 1',
      treatment: 'Terapi Amlodipine 5 mg, Cek EKG normal',
      doctorNotes: 'Kepatuhan minum obat baik',
    },
    {
      id: 'REC-2024-089',
      date: '2024-11-20',
      doctorName: 'dr. Maya Sari, Sp.PD',
      diagnosis: 'K29.7 - Gastritis Akut',
      treatment: 'Antasida sirup 3x1 Cth, Omeprazole 20mg 2x1',
      doctorNotes: 'Keluhan membaik setelah 5 hari terapi',
    },
  ]);

  // BMI Calculation
  const heightInMeters = vitalSigns.height / 100;
  const bmi = heightInMeters > 0 ? (vitalSigns.weight / (heightInMeters * heightInMeters)).toFixed(1) : '0';

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const med = MOCK_MEDICINES.find((m) => m.id === newMedId) || MOCK_MEDICINES[0];
    const newItem: PrescriptionItem = {
      medicineId: med.id,
      medicineName: med.name,
      dosage: med.form,
      frequency: newMedFrequency,
      quantity: Number(newMedQty),
      instructions: newMedInstructions,
    };
    setPrescriptions((prev) => [...prev, newItem]);
    setShowPrescriptionModal(false);
    setNewMedQty(10);
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleLab = (testName: string) => {
    setLabOrders((prev) =>
      prev.includes(testName) ? prev.filter((t) => t !== testName) : [...prev, testName]
    );
  };

  const handleSaveRecord = (status: 'draft' | 'completed') => {
    const doctorDisplayName = currentDoctor?.name || currentDoctor?.nama_dokter || 'dr. Dokter Jaga';
    const patientDisplayName = patient?.name || patient?.nama_lengkap || 'Pasien';

    const newRecord: Partial<MedicalRecord> = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      appointment_id: selectedAppointment?.id,
      patient_id: patient?.id,
      doctor_id: currentDoctor?.id || 'DOC-001',
      date: new Date().toISOString().split('T')[0],
      doctorName: doctorDisplayName,
      diagnosis: `${diagnosisCode} - ${diagnosis}`,
      treatment,
      doctorNotes,
      status,
    };

    setPastRecords((prev) => [newRecord, ...prev]);

    // Update appointment status to 'Selesai' if completed
    if (status === 'completed') {
      setAppointments((prev) =>
        prev.map((a) => (a.id === selectedAppointment.id ? { ...a, status: 'Selesai' } : a))
      );
    }

    setSuccessNotification(
      status === 'completed'
        ? `Rekam medis pasien ${patientDisplayName} berhasil disimpan dan disahkan!`
        : `Draf rekam medis berhasil disimpan!`
    );

    setTimeout(() => setSuccessNotification(''), 4500);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Toast Alert */}
      {successNotification && (
        <div className="flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-xs font-semibold text-white shadow-md animate-in fade-in">
          <Icon name="check-circle" size={18} />
          <span>{successNotification}</span>
        </div>
      )}

      {/* Header & Patient Queue Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700 border border-teal-200">
                Instalasi Rekam Medis Elektronik (RME)
              </span>
              <span className="text-xs text-slate-400">Standar SATUSEHAT Kemenkes RI</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Pencatatan EMR & Pelayanan Klinis</h1>
            <p className="text-xs text-slate-500">
              Dokter Pemeriksa: <strong className="text-slate-800">{currentDoctor.name}</strong> ({currentDoctor.specialty})
            </p>
          </div>

          {/* Quick Patient Switcher from today's appointments */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Pilih Pasien Konsultasi:</label>
            <select
              value={selectedAptId}
              onChange={(e) => {
                setSelectedAptId(e.target.value);
                const apt = appointments.find((a) => a.id === e.target.value);
                if (apt) setChiefComplaint(apt.complaint);
              }}
              className="h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-800 focus:border-teal-500 focus:outline-none"
            >
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.queueNumber} - {a.patientName} ({a.department}) [{a.status}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Patient Identity Card */}
        <div className="mt-6 rounded-lg bg-slate-50 p-4 border border-slate-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">No. Rekam Medis</span>
              <span className="font-mono font-bold text-teal-700">{patient.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nama Pasien</span>
              <span className="font-bold text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jenis Kelamin / Gol.</span>
              <span className="text-slate-700">{patient.gender} ({patient.bloodType})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tanggal Lahir</span>
              <span className="text-slate-700">{patient.birthDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Penjamin Biaya</span>
              <span className="font-semibold text-emerald-700">{patient.insuranceType}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Status Antrian</span>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                {selectedAppointment.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main EMR Form Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Vital Signs Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="heart" size={18} className="text-rose-500" />
                <h2 className="text-sm font-bold text-slate-900">Tanda-tanda Vital Pasien (TTV)</h2>
              </div>
              <span className="text-xs font-mono font-medium text-slate-500">
                Indeks Massa Tubuh (BMI): <strong className="text-teal-700 font-bold">{bmi} kg/m²</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Tekanan Darah (mmHg)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={vitalSigns.systolic}
                    onChange={(e) =>
                      setVitalSigns((v) => ({ ...v, systolic: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                    placeholder="120"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={vitalSigns.diastolic}
                    onChange={(e) =>
                      setVitalSigns((v) => ({ ...v, diastolic: Number(e.target.value) }))
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                    placeholder="80"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Denyut Nadi (bpm)
                </label>
                <input
                  type="number"
                  value={vitalSigns.heartRate}
                  onChange={(e) =>
                    setVitalSigns((v) => ({ ...v, heartRate: Number(e.target.value) }))
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                  placeholder="78"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Suhu Tubuh (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalSigns.temperature}
                  onChange={(e) =>
                    setVitalSigns((v) => ({ ...v, temperature: Number(e.target.value) }))
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                  placeholder="36.5"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Pernapasan (x/menit)
                </label>
                <input
                  type="number"
                  value={vitalSigns.respiratoryRate}
                  onChange={(e) =>
                    setVitalSigns((v) => ({ ...v, respiratoryRate: Number(e.target.value) }))
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                  placeholder="18"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Saturasi O2 (%)
                </label>
                <input
                  type="number"
                  value={vitalSigns.oxygenSaturation}
                  onChange={(e) =>
                    setVitalSigns((v) => ({ ...v, oxygenSaturation: Number(e.target.value) }))
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                  placeholder="98"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  value={vitalSigns.weight}
                  onChange={(e) =>
                    setVitalSigns((v) => ({ ...v, weight: Number(e.target.value) }))
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                  placeholder="65"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  value={vitalSigns.height}
                  onChange={(e) =>
                    setVitalSigns((v) => ({ ...v, height: Number(e.target.value) }))
                  }
                  className="h-9 w-full rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-800"
                  placeholder="168"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Examination (Anamnesis, Diagnosis ICD-10, Tindakan) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Pemeriksaan Klinis & Catatan Dokter
            </h2>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Keluhan Utama *</label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800 focus:border-teal-500 focus:outline-none"
                placeholder="Keluhan utama yang dirasakan pasien"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Anamnesis & Riwayat Penyakit Terdahulu / Alergi
              </label>
              <textarea
                rows={3}
                value={anamnesis}
                onChange={(e) => setAnamnesis(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none leading-relaxed"
                placeholder="Riwayat penyakit sekarang, penyakit keluarga, alergi obat..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Kode ICD-10 *</label>
                <input
                  type="text"
                  value={diagnosisCode}
                  onChange={(e) => setDiagnosisCode(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 font-mono font-bold text-xs text-slate-800 uppercase"
                  placeholder="I10"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Diagnosis Utama (Deskripsi) *</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800"
                  placeholder="Contoh: Hipertensi Esensial"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Tindakan Medis / Prosedur Terapi</label>
              <input
                type="text"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs text-slate-800"
                placeholder="Tindakan atau intervensi medis yang dilakukan..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Catatan Khusus Dokter / Rencana Perawatan</label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800"
                placeholder="Instruksi perawatan, diet, edukasi kontrol..."
              />
            </div>
          </div>

          {/* Section 3: e-Prescription & Lab Orders */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Peresepan Obat & Permintaan Laboratorium</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100"
                >
                  <Icon name="pill" size={14} />
                  + Tambah Resep
                </button>
                <button
                  type="button"
                  onClick={() => setShowLabModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <Icon name="flask" size={14} />
                  + Order Lab
                </button>
              </div>
            </div>

            {/* Prescriptions List */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 mb-2">Daftar Obat e-Resep:</h3>
              {prescriptions.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                  {prescriptions.map((p, i) => (
                    <div key={i} className="p-3 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 block">{p.medicineName}</strong>
                        <span className="text-[11px] text-slate-500">
                          {p.dosage} · Aturan: <strong className="text-teal-800">{p.frequency}</strong> ({p.instructions})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border">
                          Jumlah: {p.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePrescription(i)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Icon name="trash" size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada obat yang diresepkan.</p>
              )}
            </div>

            {/* Lab Orders List */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 mb-2">Pemeriksaan Lab yang Diminta:</h3>
              {labOrders.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {labOrders.map((test) => (
                    <span
                      key={test}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200"
                    >
                      <Icon name="flask" size={13} />
                      {test}
                      <button
                        type="button"
                        onClick={() => handleToggleLab(test)}
                        className="hover:text-blue-900 font-bold ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Tidak ada order tes laboratorium.</p>
              )}
            </div>

            {/* Action Buttons: Save Record */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleSaveRecord('draft')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Simpan Sebagai Draf
              </button>
              <button
                type="button"
                onClick={() => handleSaveRecord('completed')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-teal-700"
              >
                <Icon name="check-circle" size={16} />
                Sahkan & Selesaikan Konsultasi
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Patient Past History & Diagnoses */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
              Riwayat Rekam Medis Pasien
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {pastRecords.map((rec) => (
                <div key={rec.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                    <span>{rec.date}</span>
                    <span className="font-semibold text-teal-700">{rec.id}</span>
                  </div>
                  <strong className="text-slate-900 block">{rec.diagnosis}</strong>
                  <p className="text-slate-600 text-[11px]">
                    <span className="font-semibold text-slate-700">Tindakan:</span> {rec.treatment}
                  </p>
                  <p className="text-slate-500 text-[11px] italic">
                    "{rec.doctorNotes}"
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-200/60">
                    Oleh: {rec.doctorName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal e-Prescription */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Tambah Resep Obat (e-Resep)</h3>
              <button
                type="button"
                onClick={() => setShowPrescriptionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleAddPrescription} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pilih Obat dari Formularium</label>
                <select
                  value={newMedId}
                  onChange={(e) => setNewMedId(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800"
                >
                  {MOCK_MEDICINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.form}) - Sisa Stok: {m.stock}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Frekuensi & Aturan Pakai</label>
                <input
                  type="text"
                  value={newMedFrequency}
                  onChange={(e) => setNewMedFrequency(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3"
                  placeholder="Contoh: 3x1 sehari sesudah makan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jumlah Obat</label>
                  <input
                    type="number"
                    value={newMedQty}
                    onChange={(e) => setNewMedQty(Number(e.target.value))}
                    min={1}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Instruksi Khusus</label>
                  <input
                    type="text"
                    value={newMedInstructions}
                    onChange={(e) => setNewMedInstructions(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3"
                    placeholder="e.g. Habiskan"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 font-bold text-white hover:bg-teal-700"
                >
                  Tambahkan ke Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lab Orders Selector */}
      {showLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Pilih Pemeriksaan Laboratorium</h3>
              <button
                type="button"
                onClick={() => setShowLabModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                'Darah Lengkap (Hematologi Rutin)',
                'Profil Lipid Lengkap (Kolesterol, HDL, LDL, TG)',
                'Gula Darah Puasa (GDP) & HbA1c',
                'Fungsi Ginjal (Ureum, Kreatinin)',
                'Fungsi Hati (SGOT, SGPT)',
                'Urinalisis Lengkap',
                'Elektrolit Serum (Na, K, Cl)',
                'Tes Cepat Dengue (NS1 Antigen)',
              ].map((testName) => {
                const isSelected = labOrders.includes(testName);
                return (
                  <div
                    key={testName}
                    onClick={() => handleToggleLab(testName)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{testName}</span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-blue-600 pointer-events-none"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setShowLabModal(false)}
                className="rounded-lg bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
              >
                Selesai Memilih ({labOrders.length} Tes)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { EMRPage };
