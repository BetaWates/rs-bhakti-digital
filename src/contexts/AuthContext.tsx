// ============================================================================
// RS Bhakti Digital SIMRS - Foundation Layer: Authentication Context
// Global Auth State, Role-Based Access Control (RBAC), and LocalStorage Sync
// ============================================================================

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Role, type User, type Doctor, type UserRole } from '@/lib/types';
import { MOCK_USERS, MOCK_DOCTORS } from '@/lib/mock-data';
import { DEMO_USERS } from '@/lib/constants';
import { api, setAuthToken } from '@/lib/api';

export const DEMO_CREDENTIALS: Record<string, { identifier: string; password: string }> = {
  admin: { identifier: 'admin@rsbhaktidigital.id', password: 'admin123' },
  direktur: { identifier: 'direktur@rsbhaktidigital.id', password: 'direktur123' },
  dokter: { identifier: 'dr.andi@rsbhaktidigital.id', password: 'dokter123' },
  doctor: { identifier: 'dr.andi@rsbhaktidigital.id', password: 'dokter123' },
  perawat: { identifier: 'perawat.ani@rsbhaktidigital.id', password: 'perawat123' },
  nurse: { identifier: 'perawat.ani@rsbhaktidigital.id', password: 'perawat123' },
  apoteker: { identifier: 'apoteker.linda@rsbhaktidigital.id', password: 'apotek123' },
  pharmacy: { identifier: 'apoteker.linda@rsbhaktidigital.id', password: 'apotek123' },
  analis_lab: { identifier: 'lab.dimas@rsbhaktidigital.id', password: 'lab12345' },
  laboratory: { identifier: 'lab.dimas@rsbhaktidigital.id', password: 'lab12345' },
  radiografer: { identifier: 'radio.yoga@rsbhaktidigital.id', password: 'radio123' },
  kasir: { identifier: 'kasir.tina@rsbhaktidigital.id', password: 'kasir123' },
  cashier: { identifier: 'kasir.tina@rsbhaktidigital.id', password: 'kasir123' },
  admisi: { identifier: 'admisi.fajar@rsbhaktidigital.id', password: 'admisi123' },
  admission: { identifier: 'admisi.fajar@rsbhaktidigital.id', password: 'admisi123' },
  driver: { identifier: 'driver.ujang@rsbhaktidigital.id', password: 'driver123' },
  cssd: { identifier: 'cssd.dewi@rsbhaktidigital.id', password: 'cssd1234' },
  it_support: { identifier: 'it.kevin@rsbhaktidigital.id', password: 'it123456' },
  pasien: { identifier: 'pasien.siti@rsbhaktidigital.id', password: 'pasien123' },
};

export interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  currentRole?: Role | string;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register?: (data: {
    nama_lengkap: string;
    email: string;
    role_id: string;
    no_telepon?: string;
    nik?: string;
    password?: string;
  }) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  quickLogin: (role: any) => Promise<User | null> | User | null;
  hasPermission: (roles: Role[]) => boolean;
  switchUserByRole: (role: Role | string) => boolean | User | null;
  setRole?: (role: any) => void;
  updateUserProfile?: (profile: Partial<User>) => void;
  currentDoctor?: Doctor;
  setDoctor?: (doc: Doctor) => void;
}

const STORAGE_KEY = 'rsbhakti_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state directly with persistence verification
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return MOCK_USERS[0];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'logged_out') {
        return null;
      }
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        const matched = MOCK_USERS.find((u) => u.id === parsed.id || u.email === parsed.email);
        return matched || parsed;
      }
    } catch (error) {
      console.warn('Failed to parse stored auth user from localStorage:', error);
    }
    // Default to unauthenticated until user logs in or selects a role
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => currentUser !== null);
  const [currentDoctor, setDoctor] = useState<Doctor>(MOCK_DOCTORS[0]);

  // Sync to localStorage whenever currentUser changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        setIsAuthenticated(true);
      } else {
        localStorage.setItem(STORAGE_KEY, 'logged_out');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error synchronizing auth state to localStorage:', error);
    }
  }, [currentUser]);

  /**
   * Authenticates user against backend API (POST /api/auth/login).
   */
  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await api.post<{
        success: boolean;
        message: string;
        data: {
          token: string;
          user: {
            id: string;
            email: string;
            nama_lengkap: string;
            role_id: string;
            role_label?: string;
            is_active: boolean;
          };
        };
      }>('/api/auth/login', {
        email: email.trim(),
        password,
      });

      if (response?.success && response.data) {
        const { token, user: backendUser } = response.data;
        setAuthToken(token);

        const matched = MOCK_USERS.find(
          (u) =>
            u.id === backendUser.id ||
            u.email.toLowerCase() === backendUser.email.toLowerCase()
        );

        const enrichedUser: User = {
          ...(matched || {}),
          id: backendUser.id,
          email: backendUser.email,
          nama_lengkap: backendUser.nama_lengkap,
          name: backendUser.nama_lengkap,
          role_id: backendUser.role_id,
          role: backendUser.role_id,
          roleLabel: backendUser.role_label || backendUser.role_id,
          is_active: backendUser.is_active,
        };

        setCurrentUser(enrichedUser);
        setIsAuthenticated(true);

        if (backendUser.role_id === 'dokter' || backendUser.role_id === 'doctor') {
          const doc =
            MOCK_DOCTORS.find((d) => d.user_id === backendUser.id) ||
            MOCK_DOCTORS[0];
          setDoctor(doc);
        }

        return { success: true, user: enrichedUser };
      }

      return {
        success: false,
        error: response?.message || 'Autentikasi gagal. Silakan periksa kembali kredensial Anda.',
      };
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || 'Terjadi kesalahan sistem saat mencoba masuk.';
      return {
        success: false,
        error: errorMsg,
      };
    }
  };

  /**
   * Registers a new user account into the SIMRS platform
   */
  const register = async (data: {
    nama_lengkap: string;
    email: string;
    role_id: string;
    no_telepon?: string;
    nik?: string;
    password?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    if (!data.email || !data.nama_lengkap) {
      return { success: false, error: 'Nama lengkap dan alamat email wajib diisi.' };
    }

    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      email: data.email.toLowerCase().trim(),
      password_hash: data.password || 'password123',
      nama_lengkap: data.nama_lengkap,
      name: data.nama_lengkap,
      role_id: data.role_id as Role,
      role: data.role_id as Role,
      is_active: true,
      roleLabel: data.role_id,
    };

    MOCK_USERS.unshift(newUser);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  };

  /**
   * Terminates the current session and clears persisted state.
   */
  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Evaluates if the authenticated user has any of the specified roles.
   */
  const hasPermission = (roles: Role[]): boolean => {
    if (!currentUser || !currentUser.is_active) {
      return false;
    }
    return roles.includes(currentUser.role_id as Role);
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...profile };
    setCurrentUser(updated);
  };

  /**
   * Helper to quickly switch active persona during development and testing.
   */
  const switchUserByRole = (role: Role | string): User | null => {
    const roleKey = String(role).toLowerCase();
    
    // Check DEMO_USERS first
    if (DEMO_USERS[roleKey]) {
      const u = DEMO_USERS[roleKey] as User;
      setCurrentUser(u);
      setIsAuthenticated(true);
      return u;
    }

    // Check MOCK_USERS
    const targetUser = MOCK_USERS.find(
      (u) =>
        u.role_id === role ||
        u.role_id.toLowerCase() === roleKey ||
        (u.role && u.role.toLowerCase() === roleKey)
    );
    if (targetUser) {
      const enrichedUser: User = {
        ...targetUser,
        role: targetUser.role || targetUser.role_id,
        name: targetUser.name || targetUser.nama_lengkap,
      };
      setCurrentUser(enrichedUser);
      setIsAuthenticated(true);
      return enrichedUser;
    }
    return null;
  };

  const quickLogin = async (role: any): Promise<User | null> => {
    const roleKey = String(role).toLowerCase();
    const creds = DEMO_CREDENTIALS[roleKey] || { identifier: roleKey, password: 'demo' };
    const res = await login(creds.identifier, creds.password);
    return res.user || null;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        currentRole: currentUser?.role_id || currentUser?.role,
        isAuthenticated,
        login,
        register,
        logout,
        quickLogin,
        hasPermission,
        switchUserByRole,
        setRole: (role: any) => switchUserByRole(role),
        updateUserProfile,
        currentDoctor,
        setDoctor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to consume SIMRS authentication context.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
