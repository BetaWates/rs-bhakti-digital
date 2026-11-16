import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { LoginPage } from '@/pages/auth/LoginPage';
import { AppShell } from '@/components/layout/AppShell';
import { RoleGatewayPage } from '@/pages/gateway/RoleGatewayPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { DoctorDashboard } from '@/pages/dashboard/DoctorDashboard';
import { AdmisiPage } from '@/pages/admisi/AdmisiPage';
import { EMRPage } from '@/pages/emr/EMRPage';
import { PharmacyPage } from '@/pages/pharmacy/PharmacyPage';
import { LaboratoryPage } from '@/pages/laboratory/LaboratoryPage';
import { BillingPage } from '@/pages/billing/BillingPage';
import { EmergencyPage } from '@/pages/emergency/EmergencyPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { DoctorStaffPage } from '@/pages/DoctorStaffPage';
import { InpatientPage } from '@/pages/InpatientPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { Role } from '@/lib/types';

// Module-level RBAC permissions matrix
const MODULE_PERMISSIONS: Record<string, Role[]> = {
  'Portal Modul': Object.values(Role),
  'Gateway': Object.values(Role),
  'Overview': Object.values(Role),
  'Dashboard': Object.values(Role),
  'DoctorDashboard': [Role.ADMIN, Role.DIREKTUR, Role.DOKTER],
  'Admisi & Antrian': [Role.ADMIN, Role.DIREKTUR, Role.ADMISI],
  'Patients': [Role.ADMIN, Role.DIREKTUR, Role.ADMISI],
  'Appointments': [Role.ADMIN, Role.DIREKTUR, Role.ADMISI],
  'Rekam Medis': [Role.ADMIN, Role.DIREKTUR, Role.DOKTER, Role.PERAWAT],
  'EMR': [Role.ADMIN, Role.DIREKTUR, Role.DOKTER, Role.PERAWAT],
  'Farmasi': [Role.ADMIN, Role.DIREKTUR, Role.APOTEKER],
  'Pharmacy': [Role.ADMIN, Role.DIREKTUR, Role.APOTEKER],
  'Laboratorium': [Role.ADMIN, Role.DIREKTUR, Role.ANALIS_LAB, Role.RADIOGRAFER],
  'Laboratory': [Role.ADMIN, Role.DIREKTUR, Role.ANALIS_LAB, Role.RADIOGRAFER],
  'Kasir & Billing': [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
  'Billing & payments': [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
  'IGD & Logistik': [Role.ADMIN, Role.DIREKTUR, Role.DRIVER, Role.CSSD, Role.PERAWAT],
  'Emergency': [Role.ADMIN, Role.DIREKTUR, Role.DRIVER, Role.CSSD, Role.PERAWAT],
  'Rawat Inap': [Role.ADMIN, Role.DIREKTUR, Role.PERAWAT, Role.DOKTER],
  'Inpatient & beds': [Role.ADMIN, Role.DIREKTUR, Role.PERAWAT, Role.DOKTER],
  'Dokter & Staff': [Role.ADMIN, Role.DIREKTUR, Role.IT_SUPPORT],
  'Doctors & staff': [Role.ADMIN, Role.DIREKTUR, Role.IT_SUPPORT],
  'Laporan': [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
  'Reports & analytics': [Role.ADMIN, Role.DIREKTUR, Role.KASIR],
  'Pengaturan': [Role.ADMIN, Role.DIREKTUR, Role.IT_SUPPORT],
  'Settings': [Role.ADMIN, Role.DIREKTUR, Role.IT_SUPPORT],
};

type AppLifecycle = 'splash' | 'login' | 'app';

function AppContent() {
  const { currentUser, isAuthenticated, logout, switchUserByRole } = useAuth();

  // Strict linear lifecycle state machine:
  // Step 1 ('splash') -> Step 2 ('login') -> Step 3 ('app')
  const [appLifecycle, setAppLifecycle] = useState<AppLifecycle>('splash');
  const [currentPage, setCurrentPage] = useState<string>('Portal Modul');

  // Sync permissions when role changes
  useEffect(() => {
    if (isAuthenticated && currentUser?.role_id) {
      const allowedRoles = MODULE_PERMISSIONS[currentPage];
      const hasAccessToCurrent =
        !allowedRoles ||
        allowedRoles.includes(currentUser.role_id as Role) ||
        currentUser.role_id === Role.ADMIN ||
        currentUser.role_id === Role.DIREKTUR;

      // If user navigated to a page they are not allowed to view, redirect back to Gateway
      if (!hasAccessToCurrent) {
        setCurrentPage('Portal Modul');
      }
    }
  }, [isAuthenticated, currentUser?.id, currentUser?.role_id, currentPage]);

  // Step 1: SplashScreen (Always initiated first upon start or refresh)
  if (appLifecycle === 'splash') {
    return (
      <SplashScreen
        durationMs={3000}
        onComplete={() => setAppLifecycle('login')}
      />
    );
  }

  // Step 2: LoginPage (rendered ONLY after SplashScreen finishes)
  if (appLifecycle === 'login') {
    return (
      <LoginPage
        onSuccess={() => {
          setAppLifecycle('app');
          setCurrentPage('Portal Modul');
        }}
      />
    );
  }

  // Step 3: AppShell / Dashboard Gateway (rendered ONLY after successful authentication)
  const allowedRoles = MODULE_PERMISSIONS[currentPage];
  const hasAccess =
    !currentUser ||
    !allowedRoles ||
    allowedRoles.includes(currentUser.role_id as Role) ||
    currentUser.role_id === Role.ADMIN ||
    currentUser.role_id === Role.DIREKTUR;

  const renderCurrentRoute = () => {
    if (!currentUser) return null;

    if (!hasAccess) {
      return (
        <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-slate-800">Akses Modul Terbatas</h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Peran akun Anda (<span className="font-semibold text-slate-800">{currentUser.role_id}</span>)
            tidak memiliki izin akses untuk modul <span className="font-semibold text-slate-800">&quot;{currentPage}&quot;</span>.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentPage('Portal Modul')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Kembali ke Portal Modul (Gateway)
            </button>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'Portal Modul':
      case 'Gateway':
        return (
          <RoleGatewayPage
            currentUser={currentUser}
            onNavigate={(page) => setCurrentPage(page)}
            onSwitchRole={(roleKey) => switchUserByRole?.(roleKey)}
          />
        );

      case 'Overview':
      case 'Dashboard':
        return currentUser.role_id === Role.DOKTER ? <DoctorDashboard /> : <DashboardPage />;

      case 'DoctorDashboard':
      case 'Dokter Jaga':
        return <DoctorDashboard />;

      case 'Admisi & Antrian':
      case 'Admisi':
      case 'Patients':
      case 'Appointments':
        return <AdmisiPage />;

      case 'Rekam Medis':
      case 'EMR':
      case 'Medical Records':
        return <EMRPage />;

      case 'Farmasi':
      case 'Pharmacy':
        return <PharmacyPage />;

      case 'Laboratorium':
      case 'Laboratory':
      case 'Lab':
        return <LaboratoryPage />;

      case 'Kasir & Billing':
      case 'Billing & payments':
      case 'Billing':
        return <BillingPage />;

      case 'IGD & Logistik':
      case 'Emergency':
      case 'IGD':
        return <EmergencyPage />;

      case 'Rawat Inap':
      case 'Inpatient & beds':
      case 'Inpatient':
        return <InpatientPage />;

      case 'Dokter & Staff':
      case 'Doctors & staff':
      case 'Staff':
        return <DoctorStaffPage />;

      case 'Laporan':
      case 'Reports & analytics':
      case 'Reports':
        return <ReportsPage />;

      case 'Pengaturan':
      case 'Settings':
        return <SettingsPage />;

      default:
        return (
          <RoleGatewayPage
            currentUser={currentUser}
            onNavigate={(page) => setCurrentPage(page)}
            onSwitchRole={(roleKey) => switchUserByRole?.(roleKey)}
          />
        );
    }
  };

  return (
    <AppShell
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page)}
      currentUser={currentUser}
      onLogout={() => {
        logout();
        setAppLifecycle('login');
        setCurrentPage('Portal Modul');
      }}
    >
      {renderCurrentRoute()}
    </AppShell>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
