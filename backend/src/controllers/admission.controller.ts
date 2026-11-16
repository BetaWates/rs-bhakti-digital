// ============================================================================
// RS Bhakti Digital SIMRS - Admission & Queue Controller
// Patient Registration, NIK/RM Search, BPJS Bridging, & Automated Queue
// ============================================================================

import type { Request, Response } from 'express';
import { SEED_PATIENTS, SEED_APPOINTMENTS, SEED_DOCTORS } from '../database/seeders/seed';
import type { PatientEntity, AppointmentEntity } from '../models/types';

let patientsStore: PatientEntity[] = [...SEED_PATIENTS as any];
let appointmentsStore: AppointmentEntity[] = [...SEED_APPOINTMENTS as any];

export const AdmissionController = {
  /**
   * Search patients by Name, NIK, or No RM
   */
  searchPatients: async (req: Request, res: Response): Promise<void> => {
    try {
      const q = ((req.query.q as string) || '').toLowerCase();

      const results = patientsStore.filter(
        (p) =>
          p.nama_lengkap.toLowerCase().includes(q) ||
          p.nik.includes(q) ||
          p.no_rm.toLowerCase().includes(q) ||
          p.no_telepon.includes(q)
      );

      res.status(200).json({
        success: true,
        total: results.length,
        data: results,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Get patient detail by ID or No RM
   */
  getPatientById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const patient = patientsStore.find(
        (p) => p.id === id || p.no_rm === id || p.nik === id
      );

      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Data pasien tidak ditemukan.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: patient,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Register a new patient with NIK validation and auto-generated No RM
   */
  registerPatient: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        nik,
        nama_lengkap,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        no_telepon,
        no_bpjs,
        kelas_bpjs,
      } = req.body;

      // Validation
      if (!nik || nik.length !== 16 || !/^\d+$/.test(nik)) {
        res.status(400).json({
          success: false,
          message: 'NIK wajib terdiri dari tepat 16 digit angka.',
        });
        return;
      }

      if (!nama_lengkap || !tanggal_lahir || !jenis_kelamin || !alamat || !no_telepon) {
        res.status(400).json({
          success: false,
          message: 'Semua kolom identitas wajib diisi.',
        });
        return;
      }

      // Check duplicate NIK
      const exists = patientsStore.find((p) => p.nik === nik);
      if (exists) {
        res.status(409).json({
          success: false,
          message: `Pasien dengan NIK ${nik} sudah terdaftar dengan No. RM ${exists.no_rm}.`,
          data: exists,
        });
        return;
      }

      // Generate next No RM (e.g. RM-002486)
      const nextNumber = patientsStore.length + 2481;
      const no_rm = `RM-${String(nextNumber).padStart(6, '0')}`;
      const newId = `pat-${String(patientsStore.length + 1).padStart(2, '0')}`;

      const newPatient: PatientEntity = {
        id: newId,
        user_id: null,
        no_rm,
        nik,
        nama_lengkap,
        tanggal_lahir,
        jenis_kelamin,
        alamat,
        no_telepon,
        no_bpjs: no_bpjs || null,
        kelas_bpjs: kelas_bpjs ? Number(kelas_bpjs) as 1 | 2 | 3 : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      patientsStore.push(newPatient);

      res.status(201).json({
        success: true,
        message: 'Pasien baru berhasil didaftarkan ke SIMRS.',
        data: newPatient,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Create clinic appointment and automated queue numbering
   */
  createAppointment: async (req: Request, res: Response): Promise<void> => {
    try {
      const { patient_id, doctor_id, tanggal_periksa, jenis_pembayaran } = req.body;

      if (!patient_id || !doctor_id) {
        res.status(400).json({
          success: false,
          message: 'Data pasien dan dokter wajib ditentukan.',
        });
        return;
      }

      const patient = patientsStore.find((p) => p.id === patient_id || p.no_rm === patient_id);
      if (!patient) {
        res.status(404).json({ success: false, message: 'Pasien tidak ditemukan.' });
        return;
      }

      const doctor = SEED_DOCTORS.find((d) => d.id === doctor_id);
      if (!doctor) {
        res.status(404).json({ success: false, message: 'Dokter tidak ditemukan.' });
        return;
      }

      // Department queue prefix mapping
      const prefixMap: Record<string, string> = {
        'Spesialis Jantung & Pembuluh Darah': 'JTG',
        'Spesialis Penyakit Dalam': 'INT',
        'Spesialis Kesehatan Anak': 'ANK',
        'Spesialis Kebidanan & Kandungan': 'OBG',
      };
      const prefix = prefixMap[doctor.spesialisasi] || 'POL';

      // Count appointments for doctor today
      const today = tanggal_periksa || new Date().toISOString().split('T')[0];
      const todayCount = appointmentsStore.filter(
        (a) => a.doctor_id === doctor_id && a.tanggal_periksa === today
      ).length + 1;

      const nomor_antrean = `${prefix}-${String(todayCount).padStart(3, '0')}`;
      const newId = `apt-${String(appointmentsStore.length + 1).padStart(2, '0')}`;

      const appointment: AppointmentEntity = {
        id: newId,
        patient_id: patient.id,
        doctor_id: doctor.id,
        tanggal_periksa: today,
        nomor_antrean,
        jenis_pembayaran: (jenis_pembayaran || (patient.no_bpjs ? 'bpjs' : 'umum')) as 'umum' | 'bpjs',
        status: 'menunggu',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      appointmentsStore.push(appointment);

      res.status(201).json({
        success: true,
        message: 'Nomor antrean berhasil diterbitkan.',
        data: {
          appointment,
          patient,
          doctor,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Get queue listing with optional date and doctor filter
   */
  getQueue: async (req: Request, res: Response): Promise<void> => {
    try {
      const { doctor_id, tanggal } = req.query;

      let queue = appointmentsStore.map((apt) => {
        const patient = patientsStore.find((p) => p.id === apt.patient_id);
        const doctor = SEED_DOCTORS.find((d) => d.id === apt.doctor_id);
        return {
          ...apt,
          patient_name: patient?.nama_lengkap || 'Pasien',
          patient_rm: patient?.no_rm || '',
          doctor_name: doctor?.nama_dokter || '',
          spesialisasi: doctor?.spesialisasi || '',
        };
      });

      if (doctor_id) {
        queue = queue.filter((q) => q.doctor_id === doctor_id);
      }
      if (tanggal) {
        queue = queue.filter((q) => q.tanggal_periksa === tanggal);
      }

      res.status(200).json({
        success: true,
        total: queue.length,
        data: queue,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
