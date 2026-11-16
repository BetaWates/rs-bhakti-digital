// ============================================================================
// RS Bhakti Digital SIMRS - Electronic Medical Record (EMR) Controller
// Clinical Notes, SOAP, Vital Signs, ICD-10 Diagnosis, & Treatment History
// ============================================================================

import type { Request, Response } from 'express';
import {
  SEED_MEDICAL_RECORDS,
  SEED_PATIENTS,
  SEED_DOCTORS,
  SEED_APPOINTMENTS,
} from '../database/seeders/seed';
import type { MedicalRecordEntity } from '../models/types';
import type { AuthRequest } from '../middlewares/auth.middleware';

let medicalRecordsStore: MedicalRecordEntity[] = [...SEED_MEDICAL_RECORDS as any];

export const EMRController = {
  /**
   * Get all medical records with patient and doctor details
   */
  getRecords: async (req: Request, res: Response): Promise<void> => {
    try {
      const { patient_id } = req.query;

      let records = medicalRecordsStore.map((mr) => {
        const patient = SEED_PATIENTS.find((p) => p.id === mr.patient_id);
        const doctor = SEED_DOCTORS.find((d) => d.id === mr.doctor_id);
        return {
          ...mr,
          patient_name: patient?.nama_lengkap || 'Pasien',
          patient_rm: patient?.no_rm || '',
          doctor_name: doctor?.nama_dokter || '',
          spesialisasi: doctor?.spesialisasi || '',
        };
      });

      if (patient_id) {
        records = records.filter((r) => r.patient_id === patient_id || r.patient_rm === patient_id);
      }

      res.status(200).json({
        success: true,
        total: records.length,
        data: records,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Get specific medical record by ID
   */
  getRecordById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const record = medicalRecordsStore.find((r) => r.id === id);

      if (!record) {
        res.status(404).json({ success: false, message: 'Rekam medis tidak ditemukan.' });
        return;
      }

      const patient = SEED_PATIENTS.find((p) => p.id === record.patient_id);
      const doctor = SEED_DOCTORS.find((d) => d.id === record.doctor_id);

      res.status(200).json({
        success: true,
        data: {
          ...record,
          patient,
          doctor,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Create or update medical record for an appointment
   */
  createRecord: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const {
        appointment_id,
        patient_id,
        doctor_id,
        keluhan_utama,
        diagnosa,
        tindakan,
        catatan_dokter,
        vital_signs,
      } = req.body;

      if (!appointment_id || !patient_id || !keluhan_utama || !diagnosa || !tindakan) {
        res.status(400).json({
          success: false,
          message: 'Appointment ID, Patient ID, keluhan, diagnosa, dan tindakan wajib diisi.',
        });
        return;
      }

      const activeDoctorId = doctor_id || (req.user?.role_id === 'dokter' ? req.user.id : 'doc-01');

      const newId = `mr-${String(medicalRecordsStore.length + 1).padStart(2, '0')}`;
      const newRecord: MedicalRecordEntity = {
        id: newId,
        appointment_id,
        patient_id,
        doctor_id: activeDoctorId,
        keluhan_utama,
        diagnosa,
        tindakan,
        catatan_dokter: catatan_dokter || null,
        vital_signs: vital_signs || {
          tekanan_darah: '120/80 mmHg',
          suhu: 36.5,
          nadi: 80,
          respirasi: 18,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      medicalRecordsStore.push(newRecord);

      res.status(201).json({
        success: true,
        message: 'Pencatatan rekam medis elektronik (RME) berhasil disimpan.',
        data: newRecord,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Get patient lifetime medical history (kronologis)
   */
  getPatientHistory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { patient_id } = req.params;
      const history = medicalRecordsStore
        .filter((r) => r.patient_id === patient_id)
        .map((r) => {
          const doc = SEED_DOCTORS.find((d) => d.id === r.doctor_id);
          return {
            ...r,
            doctor_name: doc?.nama_dokter || 'Dokter Spesialis',
            spesialisasi: doc?.spesialisasi || '',
          };
        })
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      res.status(200).json({
        success: true,
        patient_id,
        total: history.length,
        data: history,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
