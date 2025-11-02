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
  // SECURITY FIX: Load admin from database, not hardcoded
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  React.useEffect(() => {
    // In production, this would fetch the actual admin user from the database
    // based on the authenticated user's role in the user_roles table
    // For now, this is a placeholder that should be implemented with proper auth
    const loadAdmin = async () => {
      // TODO: Implement proper admin loading from user_roles table
      // This should check if the authenticated user has admin/superadmin role
      // Example:
      // const { data: { user } } = await supabase.auth.getUser();
      // const { data: role } = await supabase.from('user_roles').select('role').eq('user_id', user?.id).single();
      // if (role?.role in ['admin', 'superadmin']) { setCurrentAdmin(...) }
    };
    loadAdmin();
  }, []);

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