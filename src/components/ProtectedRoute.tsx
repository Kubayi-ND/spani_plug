import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("customer" | "provider" | "admin")[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted) return;
        if (!user) {
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          return;
        }

        setIsAuthenticated(true);

        if (allowedRoles && allowedRoles.length > 0) {
          const role = (user.user_metadata as any)?.role || null;
          if (!role || !allowedRoles.includes(role)) {
            setHasRequiredRole(false);
            toast.error("You don't have permission to access this page");
          } else {
            setHasRequiredRole(true);
          }
        } else {
          setHasRequiredRole(true);
        }
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
      } finally {
        setLoading(false);
      }
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setIsAuthenticated(!!user);
      if (user && allowedRoles && allowedRoles.length > 0) {
        const role = (user.user_metadata as any)?.role || null;
        setHasRequiredRole(!!role && allowedRoles.includes(role));
      } else if (!allowedRoles || allowedRoles.length === 0) {
        setHasRequiredRole(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [allowedRoles]);

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

  if (!hasRequiredRole) {
    return <Navigate to="/discovery" replace />;
  }

  return <>{children}</>;
};
