// ============================================================================
// RS Bhakti Digital SIMRS - Master API Router
// Consolidated Endpoints with RBAC Access Guards & Middleware
// ============================================================================

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { PatientPortalController } from '../controllers/patientPortal.controller';
import { AdmissionController } from '../controllers/admission.controller';
import { EMRController } from '../controllers/emr.controller';
import { PharmacyController } from '../controllers/pharmacy.controller';
import { LaboratoryController } from '../controllers/laboratory.controller';
import { BillingController } from '../controllers/billing.controller';
import { EmergencyController } from '../controllers/emergency.controller';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requireRoles } from '../middlewares/rbac.middleware';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';

export const apiRouter = Router();

// ============================================================================
// 1. AUTHENTICATION MODULE (Public & Protected)
// ============================================================================
const authRouter = Router();
authRouter.post('/login', authRateLimiter, AuthController.login);
authRouter.post('/register-pasien', authRateLimiter, AuthController.registerPasien);
authRouter.get('/roles', AuthController.getRoles);
authRouter.get('/me', authenticateJwt, AuthController.me);
apiRouter.use('/auth', authRouter);

// ============================================================================
// 1.1 PATIENT PORTAL MODULE (Protected & Strictly Scoped by JWT Token)
// ============================================================================
const patientRouter = Router();
patientRouter.use(authenticateJwt);
patientRouter.get('/profile', PatientPortalController.getProfile);
patientRouter.get('/appointments', PatientPortalController.getAppointments);
patientRouter.get('/queue', PatientPortalController.getAppointments);
patientRouter.get('/history', PatientPortalController.getHistory);
patientRouter.get('/bills', PatientPortalController.getBills);
patientRouter.get('/dashboard', PatientPortalController.getDashboard);
apiRouter.use('/patient', patientRouter);

// ============================================================================
// 2. ADMISSION & QUEUE MODULE (Admin, Direktur, Admisi)
// ============================================================================
const admissionRouter = Router();
admissionRouter.use(authenticateJwt);
admissionRouter.get('/patients', requireRoles('admin', 'direktur', 'admisi', 'dokter', 'perawat'), AdmissionController.searchPatients);
admissionRouter.get('/patients/:id', requireRoles('admin', 'direktur', 'admisi', 'dokter', 'perawat'), AdmissionController.getPatientById);
admissionRouter.post('/patients', requireRoles('admin', 'admisi'), AdmissionController.registerPatient);
admissionRouter.post('/appointments', requireRoles('admin', 'admisi'), AdmissionController.createAppointment);
admissionRouter.get('/queue', requireRoles('admin', 'direktur', 'admisi', 'dokter', 'perawat'), AdmissionController.getQueue);
apiRouter.use('/admission', admissionRouter);

// ============================================================================
// 3. ELECTRONIC MEDICAL RECORDS (EMR) MODULE (Dokter, Perawat, Admin, Direktur)
// ============================================================================
const emrRouter = Router();
emrRouter.use(authenticateJwt);
emrRouter.get('/records', requireRoles('admin', 'direktur', 'dokter', 'perawat'), EMRController.getRecords);
emrRouter.get('/records/:id', requireRoles('admin', 'direktur', 'dokter', 'perawat'), EMRController.getRecordById);
emrRouter.post('/records', requireRoles('admin', 'dokter'), EMRController.createRecord);
emrRouter.get('/patient/:patient_id/history', requireRoles('admin', 'direktur', 'dokter', 'perawat'), EMRController.getPatientHistory);
apiRouter.use('/emr', emrRouter);

// ============================================================================
// 4. PHARMACY & INVENTORY MODULE (Apoteker, Admin, Direktur)
// ============================================================================
const pharmacyRouter = Router();
pharmacyRouter.use(authenticateJwt);
pharmacyRouter.get('/medicines', requireRoles('admin', 'direktur', 'apoteker', 'dokter'), PharmacyController.getMedicines);
pharmacyRouter.get('/medicines/:id', requireRoles('admin', 'direktur', 'apoteker', 'dokter'), PharmacyController.getMedicineById);
pharmacyRouter.post('/medicines', requireRoles('admin', 'apoteker'), PharmacyController.createMedicine);
pharmacyRouter.put('/medicines/:id', requireRoles('admin', 'apoteker'), PharmacyController.updateMedicine);
pharmacyRouter.delete('/medicines/:id', requireRoles('admin', 'apoteker'), PharmacyController.deleteMedicine);
pharmacyRouter.get('/prescriptions', requireRoles('admin', 'direktur', 'apoteker', 'dokter'), PharmacyController.getPrescriptions);
pharmacyRouter.post('/prescriptions/:id/dispense', requireRoles('admin', 'apoteker'), PharmacyController.dispensePrescription);
apiRouter.use('/pharmacy', pharmacyRouter);

// ============================================================================
// 5. CLINICAL LABORATORY MODULE (Analis Lab, Radiografer, Admin, Direktur)
// ============================================================================
const labRouter = Router();
labRouter.use(authenticateJwt);
labRouter.get('/orders', requireRoles('admin', 'direktur', 'analis_lab', 'radiografer', 'dokter'), LaboratoryController.getOrders);
labRouter.post('/orders', requireRoles('admin', 'dokter'), LaboratoryController.createOrder);
labRouter.post('/orders/:id/results', requireRoles('admin', 'analis_lab', 'radiografer'), LaboratoryController.submitResult);
apiRouter.use('/laboratory', labRouter);

// ============================================================================
// 6. BILLING & CASHIER MODULE (Kasir, Admin, Direktur)
// ============================================================================
const billingRouter = Router();
billingRouter.use(authenticateJwt);
billingRouter.get('/invoices', requireRoles('admin', 'direktur', 'kasir'), BillingController.getBillings);
billingRouter.post('/invoices/calculate', requireRoles('admin', 'kasir'), BillingController.calculateBilling);
billingRouter.post('/invoices/:id/pay', requireRoles('admin', 'kasir'), BillingController.processPayment);
apiRouter.use('/billing', billingRouter);

// ============================================================================
// 7. EMERGENCY, ROOMS, & LOGISTICS (Driver, CSSD, Perawat, Admin, Direktur)
// ============================================================================
const emergencyRouter = Router();
emergencyRouter.use(authenticateJwt);
emergencyRouter.get('/rooms', requireRoles('admin', 'direktur', 'perawat', 'dokter', 'cssd', 'admisi'), EmergencyController.getRooms);
emergencyRouter.patch('/rooms/:id/status', requireRoles('admin', 'perawat', 'cssd'), EmergencyController.updateRoomStatus);
emergencyRouter.get('/ambulances', requireRoles('admin', 'direktur', 'driver', 'perawat'), EmergencyController.getAmbulanceRequests);
emergencyRouter.post('/ambulances/dispatch', requireRoles('admin', 'perawat', 'driver'), EmergencyController.dispatchAmbulance);
apiRouter.use('/emergency', emergencyRouter);
