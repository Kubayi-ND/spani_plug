import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("customer" | "provider" | "admin")[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { data: userRole, isLoading: roleLoading } = useUserRole(userId || undefined);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        
        if (!user) {
          setIsAuthenticated(false);
          setUserId(null);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUserId(user.id);
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        setUserId(null);
        setLoading(false);
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setIsAuthenticated(!!user);
      setUserId(user?.id || null);
      if (!user) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Wait for both auth and role checks
  useEffect(() => {
    if (isAuthenticated && !roleLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, roleLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role authorization (SECURITY FIX: query database, not client metadata)
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole as any)) {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/discovery" replace />;
    }
  }

  return <>{children}</>;
};
