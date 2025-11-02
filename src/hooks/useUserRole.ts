import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = (userId?: string) => {
  return useQuery({
    queryKey: ["user-role", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        // If no role found, return null instead of throwing
        if (error.code === "PGRST116") return null;
        throw error;
      }
      
      return data?.role || null;
    },
    enabled: !!userId,
  });
};
