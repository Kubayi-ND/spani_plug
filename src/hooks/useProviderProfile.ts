import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ProviderSkill = 
  | "plumber"
  | "electrician"
  | "carpenter"
  | "gardener"
  | "cleaner"
  | "painter"
  | "other";

export interface ProviderProfile {
  id: string;
  user_id: string;
  business_name: string;
  skill: ProviderSkill;
  rate_per_hour: number;
  years_experience: number | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  } | null;
}

export const useProviderProfile = (providerId?: string) => {
  return useQuery({
    queryKey: ["provider-profile", providerId],
    queryFn: async () => {
      // Try the nested select first; if PostgREST rejects it (400), fall back to separate queries
      try {
        const { data, error } = await supabase
          .from("provider_profiles")
          .select(`
            id,
            user_id,
            skill,
            rate_per_hour,
            years_experience,
            rating,
            review_count,
            is_verified,
            profiles!provider_profiles_user_id_fkey (
              full_name,
              avatar_url,
              bio,
              location,
              phone
            ),
            reviews (
              id,
              rating,
              comment,
              created_at,
              client_id,
              profiles!reviews_client_id_fkey (
                full_name,
                avatar_url
              )
            )
          `)
          .eq("id", providerId)
          .maybeSingle();

        if (error) throw error;

        const profile = Array.isArray(data?.profiles) ? data?.profiles[0] : data?.profiles;

        return {
          id: data.id,
          user_id: data.user_id,
          business_name: profile?.full_name || "Unnamed Provider",
          skill: data.skill as ProviderSkill,
          rate_per_hour: data.rate_per_hour || 0,
          years_experience: data.years_experience,
          rating: data.rating || 0,
          review_count: data.review_count || 0,
          is_verified: data.is_verified || false,
          avatar_url: profile?.avatar_url,
          bio: profile?.bio,
          location: profile?.location,
          phone: profile?.phone,
          website: null,
          // social_links column not present on profiles table in this schema
          social_links: null,
          reviews: data?.reviews || [],
        } as ProviderProfile & { reviews: any[] };
      } catch (err: any) {
        // Log PostgREST error details to help debugging and continue with fallback
        console.error("useProviderProfile nested select failed:", err);

        // Fallback: fetch provider row
        const { data: providerRow, error: providerErr } = await supabase
          .from("provider_profiles")
          .select("id, user_id, skill, rate_per_hour, years_experience, rating, review_count, is_verified")
          .eq("id", providerId)
          .maybeSingle();

        if (providerErr) throw providerErr;
        if (!providerRow) throw new Error("Provider not found");

        // Fetch related profile
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, bio, location, phone, user_id")
          .eq("user_id", providerRow.user_id)
          .maybeSingle();

        // Fetch reviews for this provider (provider_id in reviews references profiles.user_id)
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("id, rating, comment, created_at, client_id")
          .eq("provider_id", providerRow.user_id)
          .order("created_at", { ascending: false });

        const clientIds = Array.from(new Set((reviewsData || []).map((r: any) => r.client_id).filter(Boolean)));

        let clientProfiles: any[] = [];
        if (clientIds.length > 0) {
          const { data: clients } = await supabase
            .from("profiles")
            .select("user_id, full_name, avatar_url")
            .in("user_id", clientIds as string[]);
          clientProfiles = clients || [];
        }

        const reviews = (reviewsData || []).map((r: any) => ({
          ...r,
          profiles: clientProfiles.find((c) => c.user_id === r.client_id) || null,
        }));

        return {
          id: providerRow.id,
          user_id: providerRow.user_id,
          business_name: profileRow?.full_name || "Unnamed Provider",
          skill: providerRow.skill as ProviderSkill,
          rate_per_hour: providerRow.rate_per_hour || 0,
          years_experience: providerRow.years_experience,
          rating: providerRow.rating || 0,
          review_count: providerRow.review_count || 0,
          is_verified: providerRow.is_verified || false,
          avatar_url: profileRow?.avatar_url || null,
          bio: profileRow?.bio || null,
          location: profileRow?.location || null,
          phone: profileRow?.phone || null,
          website: null,
          social_links: null,
          reviews,
        } as ProviderProfile & { reviews: any[] };
      }
    },
    enabled: !!providerId,
  });
};

export const useProviderProfiles = (skillFilter?: string | ProviderSkill) => {
  return useQuery({
    queryKey: ["provider-profiles", skillFilter],
    queryFn: async () => {
      let query = supabase
        .from("provider_profiles")
        .select(`
          id,
          user_id,
          skill,
          rate_per_hour,
          years_experience,
          rating,
          review_count,
          is_verified,
          profiles!provider_profiles_user_id_fkey (
            full_name,
            avatar_url,
            bio,
            location,
            phone
          )
        `)
        .order("rating", { ascending: false });

      if (skillFilter && skillFilter !== "all") {
        query = query.eq("skill", skillFilter as ProviderSkill);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return (data || []).map(provider => {
        const profile = Array.isArray(provider.profiles) 
          ? provider.profiles[0] 
          : provider.profiles;

        return {
          id: provider.id,
          user_id: provider.user_id,
          business_name: profile?.full_name || "Unnamed Provider",
          skill: provider.skill as ProviderSkill,
          rate_per_hour: provider.rate_per_hour || 0,
          years_experience: provider.years_experience,
          rating: provider.rating || 0,
          review_count: provider.review_count || 0,
          is_verified: provider.is_verified || false,
          avatar_url: profile?.avatar_url,
          bio: profile?.bio,
          location: profile?.location,
          phone: profile?.phone,
          website: null,
          // social_links column not present on profiles table in this schema
          social_links: null
        } as ProviderProfile;
      });
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
