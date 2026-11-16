// ============================================================================
// RS Bhakti Digital SIMRS - Emergency & Logistics Controller
// Room Bed Census Monitoring, CSSD Sterilization, & Ambulance Fleet Tracking
// ============================================================================

import type { Request, Response } from 'express';
import {
  SEED_ROOMS,
  SEED_AMBULANCE_REQUESTS,
  SEED_PATIENTS,
  SEED_STAFF_PROFILES,
} from '../database/seeders/seed';
import type { RoomEntity, AmbulanceRequestEntity } from '../models/types';
import type { AuthRequest } from '../middlewares/auth.middleware';

let roomsStore: RoomEntity[] = [...SEED_ROOMS as any];
let ambulanceStore: AmbulanceRequestEntity[] = [...SEED_AMBULANCE_REQUESTS as any];

export const EmergencyController = {
  /**
   * Get all inpatient rooms with bed occupancy rate (BOR)
   */
  getRooms: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, kelas, bangsal } = req.query;

      let list = [...roomsStore];

      if (status) {
        list = list.filter((r) => r.status === status);
      }
      if (kelas) {
        list = list.filter((r) => r.kelas.toLowerCase() === (kelas as string).toLowerCase());
      }
      if (bangsal) {
        list = list.filter((r) => r.nama_bangsal.toLowerCase().includes((bangsal as string).toLowerCase()));
      }

      const totalBeds = roomsStore.length;
      const occupiedBeds = roomsStore.filter((r) => r.status === 'terisi').length;
      const availableBeds = roomsStore.filter((r) => r.status === 'tersedia').length;
      const sterilizingBeds = roomsStore.filter((r) => r.status === 'steril_cssd').length;
      const bor = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

      res.status(200).json({
        success: true,
        summary: {
          total_tempat_tidur: totalBeds,
          terisi: occupiedBeds,
          tersedia: availableBeds,
          steril_cssd: sterilizingBeds,
          bed_occupancy_rate: `${bor}%`,
        },
        data: list,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Update room status (e.g. transfer to steril_cssd, maintenance, or tersedia)
   */
  updateRoomStatus: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = ['tersedia', 'terisi', 'maintenance', 'steril_cssd'];
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Status tidak valid. Pilihan: ${allowedStatuses.join(', ')}`,
        });
        return;
      }

      const room = roomsStore.find((r) => r.id === id);
      if (!room) {
        res.status(404).json({ success: false, message: 'Ruangan tidak ditemukan.' });
        return;
      }

      room.status = status;
      room.updated_at = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: `Status kamar ${room.nomor_kamar} berhasil diperbarui menjadi "${status}".`,
        data: room,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Get all ambulance dispatch requests and fleet tracking
   */
  getAmbulanceRequests: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.query;

      let list = ambulanceStore.map((amb) => {
        const patient = SEED_PATIENTS.find((p) => p.id === amb.patient_id);
        const driver = SEED_STAFF_PROFILES.find((s) => s.id === amb.driver_staff_id);

        return {
          ...amb,
          patient_name: patient?.nama_lengkap || 'Pasien Gawat Darurat',
          patient_phone: patient?.no_telepon || '',
          driver_name: driver?.nama_lengkap || 'Driver Standby',
        };
      });

      if (status) {
        list = list.filter((a) => a.status === status);
      }

      res.status(200).json({
        success: true,
        total: list.length,
        data: list,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * Dispatch ambulance with driver assignment
   */
  dispatchAmbulance: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { patient_id, jenis_kendaraan, lokasi_penjemputan, tujuan, driver_staff_id } = req.body;

      if (!patient_id || !lokasi_penjemputan || !tujuan) {
        res.status(400).json({
          success: false,
          message: 'Patient ID, Lokasi Penjemputan, dan Tujuan wajib diisi.',
        });
        return;
      }

      const newId = `amb-${String(ambulanceStore.length + 1).padStart(2, '0')}`;
      const newRequest: AmbulanceRequestEntity = {
        id: newId,
        patient_id,
        driver_staff_id: driver_staff_id || 'staff-08',
        jenis_kendaraan: jenis_kendaraan || 'Unit Alpha 01 (Emergency)',
        lokasi_penjemputan,
        tujuan,
        status: 'dikirim',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      ambulanceStore.push(newRequest);

      res.status(201).json({
        success: true,
        message: 'Armada ambulans telah ditugaskan dan meluncur ke lokasi.',
        data: newRequest,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
