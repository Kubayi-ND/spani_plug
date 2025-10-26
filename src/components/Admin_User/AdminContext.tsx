import React, { createContext, useContext, useState } from 'react';

export type AdminRole = 'superadmin' | 'admin' | 'moderator' | 'readonly';

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
  }
  
  interface AdminContextType {
    currentAdmin: AdminUser | null;
    setCurrentAdmin: (admin: AdminUser | null) => void;
    hasPermission: (permission: string) => boolean;
  }
  
  const AdminContext = createContext<AdminContextType | undefined>(undefined);
  
  const PERMISSIONS = {
    manageUsers: ['superadmin', 'admin'],
    editProfiles: ['superadmin', 'admin'],
    verifyProvider: ['superadmin', 'admin'],
    moderateReviews: ['superadmin', 'admin', 'moderator'],
    viewLogs: ['superadmin', 'admin'],
    editSystemSettings: ['superadmin'],
    viewAnalytics: ['superadmin', 'admin', 'moderator', 'readonly'],
    manageTranslations: ['superadmin', 'admin'],
    moderateMedia: ['superadmin', 'admin', 'moderator'],
  };
  
  export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Mock admin - in production this would come from authentication
    const [currentAdmin, setCurrentAdmin] = useState<AdminUser>({
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@marketplace.co.za',
      role: 'superadmin',
    });
  
    const hasPermission = (permission: keyof typeof PERMISSIONS): boolean => {
      if (!currentAdmin) return false;
      return PERMISSIONS[permission]?.includes(currentAdmin.role) || false;
    };
  
    return (
      <AdminContext.Provider value={{ currentAdmin, setCurrentAdmin, hasPermission }}>
        {children}
      </AdminContext.Provider>
    );
  }
  
  export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
      throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
  }