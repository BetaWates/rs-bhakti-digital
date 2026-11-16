// ============================================================================
// RS Bhakti Digital SIMRS - Role-Based Access Control (RBAC) Middleware
// Restricts Endpoint Execution to Authorized Roles
// ============================================================================

import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './auth.middleware';

/**
 * Higher-order middleware function to enforce strict RBAC on endpoints.
 * @param allowedRoles Array of role identifiers permitted to access the resource
 */
export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Pengguna belum terautentikasi.',
      });
      return;
    }

    const userRole = (req.user.role_id || '').toLowerCase();

    // System Administrator and Hospital Director have unrestricted bypass access
    if (userRole === 'admin' || userRole === 'direktur') {
      next();
      return;
    }

    const isAuthorized = allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

    if (!isAuthorized) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak. Peran '${userRole}' tidak memiliki hak akses untuk modul ini.`,
        required_roles: allowedRoles,
      });
      return;
    }

    next();
  };
}
