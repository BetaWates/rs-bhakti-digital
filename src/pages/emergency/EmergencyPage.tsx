import { useState } from 'react';
import type { Room, AmbulanceRequest } from '@/lib/types';
import { MOCK_ROOMS, MOCK_AMBULANCE_REQUESTS, MOCK_STAFF } from '@/lib/mock-data';
import { Icon } from '@/components/shared/Icon';

export default function EmergencyPage() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS.filter((r) => r.ward === 'IGD' || r.ward === 'ICU'));
  const [ambulances, setAmbulances] = useState<AmbulanceRequest[]>(MOCK_AMBULANCE_REQUESTS);
  const [activeTab, setActiveTab] = useState<'kamar' | 'ambulans'>('kamar');

  // Dispatch Ambulance Modal
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Assign Room Modal
  const [assignRoomModal, setAssignRoomModal] = useState<Room | null>(null);
  const [patientAssignName, setPatientAssignName] = useState('');
  const [triageCategory, setTriageCategory] = useState<'Merah' | 'Kuning' | 'Hijau'>('Merah');

  // New Dispatch Form State
  const [dispatchForm, setDispatchForm] = useState({
    requesterName: '',
    requesterPhone: '',
    pickupLocation: '',
    destination: 'IGD RS Bhakti Digital',
    urgency: 'Kritis (Merah)' as AmbulanceRequest['urgency'],
    driverName: 'Pak Dedi Sutisna',
    paramedicName: 'Ns. Bayu Aji, S.Kep',
    vehiclePlate: 'B 1128 BD (Unit Alpha 01)',
    notes: '',
  });

  const availableDrivers = [
    'Pak Dedi Sutisna',
    'Pak Joko Widodo S.',
    'Pak Slamet Riyadi',
    'Pak Agus Supriyanto',
  ];

  const availableParamedics = [
    'Ns. Bayu Aji, S.Kep',
    'Ns. Wulandari, A.Md.Kep',
    'Bdn. Fatimah, S.Tr.Keb',
    'Ns. Hendro Prabowo, S.Kep',
  ];

  const ambulanceFleet = [
    'B 1128 BD (Unit Alpha 01 - Emergency)',
    'B 1129 BD (Unit Bravo 02 - Trauma)',
    'B 1130 BD (Unit Charlie 03 - PONEK)',
    'B 1131 BD (Unit Delta 04 - Transport)',
  ];

  const handleUpdateAmbulanceStatus = (id: string, newStatus: AmbulanceRequest['status']) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setToastMessage(`Status ambulans ${id} diperbarui menjadi "${newStatus}"`);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newDispatchId = `AMB-0${ambulances.length + 1}`;
    const newDispatch: AmbulanceRequest = {
      id: newDispatchId,
      patient_id: 'RM-002481',
      driver_staff_id: 'STF-007',
      jenis_kendaraan: dispatchForm.vehiclePlate,
      lokasi_penjemputan: dispatchForm.pickupLocation,
      tujuan: dispatchForm.destination,
      code: `DISPATCH-2506-0${ambulances.length + 1}`,
      requesterName: dispatchForm.requesterName,
      requesterPhone: dispatchForm.requesterPhone,
      pickupLocation: dispatchForm.pickupLocation,
      destination: dispatchForm.destination,
      urgency: dispatchForm.urgency,
      status: 'Menuju Lokasi',
      driverName: dispatchForm.driverName,
      paramedicName: dispatchForm.paramedicName,
      vehiclePlate: dispatchForm.vehiclePlate,
      requestTime: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} WIB`,
      departureTime: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')} WIB`,
      notes: dispatchForm.notes,
    };

    setAmbulances((prev) => [newDispatch, ...prev]);
    setShowDispatchModal(false);
    setToastMessage(`Ambulans ${newDispatch.vehiclePlate} berhasil diberangkatkan ke lokasi jemput!`);

    setDispatchForm({
      requesterName: '',
      requesterPhone: '',
      pickupLocation: '',
      destination: 'IGD RS Bhakti Digital',
      urgency: 'Kritis (Merah)',
      driverName: 'Pak Dedi Sutisna',
      paramedicName: 'Ns. Bayu Aji, S.Kep',
      vehiclePlate: 'B 1128 BD (Unit Alpha 01)',
      notes: '',
    });

    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleAssignPatientToRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignRoomModal) return;

    setRooms((prev) =>
      prev.map((r) =>
        r.id === assignRoomModal.id
          ? {
              ...r,
              occupied: Math.min(r.capacity, r.occupied + 1),
              status: r.occupied + 1 >= r.capacity ? 'Penuh' : 'Tersedia',
            }
          : r
      )
    );

    setToastMessage(
      `Pasien ${patientAssignName} (Triase: ${triageCategory}) berhasil ditempatkan di ${assignRoomModal.name}`
    );
    setAssignRoomModal(null);
    setPatientAssignName('');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleReleaseBed = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              occupied: Math.max(0, r.occupied - 1),
              status: 'Tersedia',
            }
          : r
      )
    );
    setToastMessage(`1 Tempat tidur di ruangan berhasil dikosongkan.`);
    setTimeout(() => setToastMessage(''), 3000);
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

      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                Instalasi Gawat Darurat (IGD) & Trauma Center 24 Jam
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">Emergency & Dispatch Ambulans</h1>
            <p className="text-xs text-slate-500">
              Monitoring kesiapan bed resusitasi, triase darurat, penugasan kamar, dan sistem dispatch armada ambulans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDispatchModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition"
            >
              <Icon name="ambulance" size={16} />
              Dispatch Ambulans CITO
            </button>
          </div>
        </div>

        {/* Triage Protocol Info Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div className="rounded-lg bg-rose-50 p-3 border border-rose-200">
            <span className="font-bold text-rose-800 block text-xs">TRIASE MERAH (Resusitasi)</span>
            <span className="text-[11px] text-rose-600">Gawat darurat mengancam jiwa, penanganan segera &lt; 0 menit.</span>
          </div>
          <div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
            <span className="font-bold text-amber-800 block text-xs">TRIASE KUNING (Urgent)</span>
            <span className="text-[11px] text-amber-700">Darurat tidak gawat, observasi ketat &lt; 15 menit.</span>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200">
            <span className="font-bold text-emerald-800 block text-xs">TRIASE HIJAU (Non-Urgent)</span>
            <span className="text-[11px] text-emerald-700">Tidak gawat tidak darurat, penanganan &lt; 60 menit.</span>
          </div>
          <div className="rounded-lg bg-slate-100 p-3 border border-slate-300">
            <span className="font-bold text-slate-800 block text-xs">TRIASE HITAM (DOA)</span>
            <span className="text-[11px] text-slate-600">Meninggal saat tiba (Death on Arrival), transfer ke Kamar Jenazah.</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('kamar')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 transition ${
            activeTab === 'kamar'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="bed" size={16} />
          Bed & Kamar IGD ({rooms.reduce((acc, r) => acc + (r.capacity - r.occupied), 0)} Kosong)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ambulans')}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 transition ${
            activeTab === 'ambulans'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon name="ambulance" size={16} />
          Tracking Armada Ambulans ({ambulances.filter((a) => a.status !== 'Selesai').length} Misi Aktif)
        </button>
      </div>

      {/* Tab 1: Room Status Grid */}
      {activeTab === 'kamar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const availableBeds = room.capacity - room.occupied;
              const isFull = availableBeds === 0;

              return (
                <div
                  key={room.id}
                  className={`rounded-xl border p-5 shadow-xs bg-white transition ${
                    isFull ? 'border-rose-200 bg-rose-50/20' : 'border-emerald-200 bg-emerald-50/10'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-400 block">{room.number}</span>
                      <h3 className="font-bold text-slate-900 text-sm">{room.name}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isFull ? 'Penuh' : `${availableBeds} Bed Tersedia`}
                    </span>
                  </div>

                  <div className="mt-3 text-xs space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Kapasitas Bed:</span>
                      <span className="font-bold font-mono">
                        {room.occupied} / {room.capacity} Terisi
                      </span>
                    </div>

                    {/* Bed Capacity Bar */}
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isFull ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                      />
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fasilitas Medis Ruangan:</span>
                      <div className="flex flex-wrap gap-1">
                        {room.features.map((feat, i) => (
                          <span
                            key={i}
                            className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    {room.occupied > 0 && (
                      <button
                        type="button"
                        onClick={() => handleReleaseBed(room.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
                      >
                        Kosongkan 1 Bed
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={isFull}
                      onClick={() => setAssignRoomModal(room)}
                      className="ml-auto inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-40"
                    >
                      <Icon name="plus" size={13} />
                      Alokasikan Pasien
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Tracking Armada Ambulans */}
      {activeTab === 'ambulans' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs">Armada Ambulans & Status Penjemputan Lapangan</h3>
            <span className="text-[11px] text-slate-500">Live radio GPS telemetry & dispatch status</span>
          </div>

          <div className="divide-y divide-slate-100">
            {ambulances.map((amb) => (
              <div key={amb.id} className="p-5 hover:bg-slate-50/70 transition space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
                      {amb.code}
                    </span>
                    <span className="font-mono text-teal-700 font-semibold text-xs">
                      {amb.vehiclePlate}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        amb.urgency.includes('Kritis')
                          ? 'bg-rose-100 text-rose-800'
                          : amb.urgency.includes('Mendesak')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {amb.urgency}
                    </span>
                  </div>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      amb.status === 'Selesai'
                        ? 'bg-slate-100 text-slate-600'
                        : amb.status === 'Membawa Pasien'
                        ? 'bg-purple-100 text-purple-800 animate-pulse'
                        : amb.status === 'Di Lokasi'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {amb.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Pemanggil / Penanggung Jawab:</span>
                    <strong className="text-slate-800">{amb.requesterName}</strong>
                    <span className="text-slate-500 block font-mono text-[11px]">{amb.requesterPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Titik Jemput:</span>
                    <strong className="text-slate-800 block">{amb.pickupLocation}</strong>
                    <span className="text-slate-500 text-[11px]">Tujuan: {amb.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Kru Medis & Driver:</span>
                    <span className="text-slate-800 block">Driver: {amb.driverName || '-'}</span>
                    <span className="text-slate-800 block">Paramedis: {amb.paramedicName || '-'}</span>
                  </div>
                </div>

                {amb.notes && (
                  <div className="rounded bg-rose-50/60 p-2 text-xs text-rose-900 border border-rose-200/60">
                    <strong>Kondisi Medis Pasien:</strong> {amb.notes}
                  </div>
                )}

                {/* Status Advancement Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold mr-2">Update Misi:</span>
                  {(['Menuju Lokasi', 'Di Lokasi', 'Membawa Pasien', 'Selesai'] as AmbulanceRequest['status'][]).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleUpdateAmbulanceStatus(amb.id, st)}
                        disabled={amb.status === st}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition ${
                          amb.status === st
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign Room Modal */}
      {assignRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Alokasikan Pasien ke Bed IGD</h3>
                <p className="text-xs text-slate-500">{assignRoomModal.name} ({assignRoomModal.ward})</p>
              </div>
              <button
                type="button"
                onClick={() => setAssignRoomModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleAssignPatientToRoom} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nama Pasien Gawat Darurat *</label>
                <input
                  type="text"
                  placeholder="Contoh: Tn. Bambang Pratama"
                  value={patientAssignName}
                  onChange={(e) => setPatientAssignName(e.target.value)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kategori Triase Klinis *</label>
                <select
                  value={triageCategory}
                  onChange={(e) => setTriageCategory(e.target.value as any)}
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-slate-800 font-bold"
                >
                  <option value="Merah">Merah (Gawat Darurat Segera)</option>
                  <option value="Kuning">Kuning (Mendesak / Observasi)</option>
                  <option value="Hijau">Hijau (Non-Urgent)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignRoomModal(null)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-4 py-1.5 font-bold text-white hover:bg-teal-700"
                >
                  Konfirmasi Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch Ambulance Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Formulir Dispatch Ambulans Darurat (CITO)</h3>
                <p className="text-xs text-slate-500">Pemberangkatan kru paramedis & driver ke lokasi pasien</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDispatchModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Pemanggil / Pelapor *</label>
                  <input
                    type="text"
                    value={dispatchForm.requesterName}
                    onChange={(e) => setDispatchForm((f) => ({ ...f, requesterName: e.target.value }))}
                    placeholder="Nama penelpon"
                    className="h-9 w-full rounded-lg border border-slate-200 px-3"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. Telp Pelapor *</label>
                  <input
                    type="tel"
                    value={dispatchForm.requesterPhone}
                    onChange={(e) => setDispatchForm((f) => ({ ...f, requesterPhone: e.target.value }))}
                    placeholder="0812..."
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Titik Lokasi Penjemputan Pasien *</label>
                <input
                  type="text"
                  value={dispatchForm.pickupLocation}
                  onChange={(e) => setDispatchForm((f) => ({ ...f, pickupLocation: e.target.value }))}
                  placeholder="Alamat lengkap / patokan jalan..."
                  className="h-9 w-full rounded-lg border border-slate-200 px-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tingkat Kegawatan *</label>
                  <select
                    value={dispatchForm.urgency}
                    onChange={(e) =>
                      setDispatchForm((f) => ({ ...f, urgency: e.target.value as AmbulanceRequest['urgency'] }))
                    }
                    className="h-9 w-full rounded-lg border border-slate-200 px-3 font-bold text-rose-700"
                  >
                    <option value="Kritis (Merah)">Kritis (Merah - Code Blue)</option>
                    <option value="Mendesak (Kuning)">Mendesak (Kuning)</option>
                    <option value="Standar (Hijau)">Standar (Hijau - Transportasi)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pilih Unit Armada *</label>
                  <select
                    value={dispatchForm.vehiclePlate}
                    onChange={(e) => setDispatchForm((f) => ({ ...f, vehiclePlate: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3"
                  >
                    {ambulanceFleet.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pengemudi (Driver)</label>
                  <select
                    value={dispatchForm.driverName}
                    onChange={(e) => setDispatchForm((f) => ({ ...f, driverName: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3"
                  >
                    {availableDrivers.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Paramedis / Perawat On-Duty</label>
                  <select
                    value={dispatchForm.paramedicName}
                    onChange={(e) => setDispatchForm((f) => ({ ...f, paramedicName: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-slate-200 px-3"
                  >
                    {availableParamedics.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catatan Kondisi Medis Pasien</label>
                <textarea
                  rows={2}
                  value={dispatchForm.notes}
                  onChange={(e) => setDispatchForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Contoh: Sesak napas berat, kesadaran menurun, riwayat stroke..."
                  className="w-full rounded-lg border border-slate-200 p-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-5 py-2 font-bold text-white hover:bg-rose-700 shadow-xs"
                >
                  Berangkatkan Armada Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { EmergencyPage };

