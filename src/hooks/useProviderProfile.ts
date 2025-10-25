import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProviderProfile {
  id: string;
  user_id: string;
  skill: string;
  rate_per_hour: number;
  years_experience: number | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  profile: {
    full_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    location: string | null;
    phone: string | null;
  };
}

export const useProviderProfile = (providerId?: string) => {
  return useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_profiles")
        .select(`
          *,
          profiles!provider_profiles_user_id_fkey(
            full_name,
            bio,
            avatar_url,
            location,
            phone
          )
        `)
        .eq("id", providerId)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        profile: Array.isArray(data.profiles) ? data.profiles[0] : data.profiles
      } as unknown as ProviderProfile;
    },
    enabled: !!providerId,
  });
};

export const useProviderProfiles = (skillFilter?: string) => {
  return useQuery({
    queryKey: ["provider-profiles", skillFilter],
    queryFn: async () => {
      let query = supabase
        .from("provider_profiles")
        .select(`
          *,
          profiles!provider_profiles_user_id_fkey(
            full_name,
            bio,
            avatar_url,
            location,
            phone
          )
        `)
        .order("rating", { ascending: false });

      if (skillFilter && skillFilter !== "all") {
        query = query.eq("skill", skillFilter as any);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        profile: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
      })) as unknown as ProviderProfile[];
    },
  });
};

export const useProviderHistory = (providerId: string) => {
  return useQuery({
    queryKey: ["provider-history", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_history")
        .select("*")
        .eq("provider_id", providerId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });
};

export const useVerificationDocs = (providerId: string) => {
  return useQuery({
    queryKey: ["verification-docs", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("verification_documents")
        .select("*")
        .eq("provider_id", providerId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });
};
