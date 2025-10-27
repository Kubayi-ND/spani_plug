import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      // Fetch provider_profiles with their profiles
      const providersRes: any = await ((supabase as any)
        .from("provider_profiles")
        .select(`
          *,
          profiles!inner(
            user_id,
            full_name,
            avatar_url,
            location,
            phone,
            bio
          )
        `)
        .order("rating", { ascending: false }) as any);

      if (providersRes.error) throw providersRes.error;

      const providers = (providersRes.data || []).map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        name: p.profiles?.full_name || p.profiles?.full_name || "Unknown",
        skill: p.skill,
        photo: p.profiles?.avatar_url || "",
        location: p.profiles?.location || "",
        rate: p.rate_per_hour,
        distance: 0,
        rating: p.rating,
        reviewCount: p.review_count,
        about: p.profiles?.bio || "",
        skills: [],
        reviews: [],
        type: "provider",
      }));

      // Fetch customers (profiles with role = customer)
      const customersRes: any = await ((supabase as any)
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false }) as any);

      if (customersRes.error) throw customersRes.error;

      const customers = (customersRes.data || []).map((c: any) => ({
        id: c.user_id,
        name: c.full_name || "Unknown",
        email: c.email || "",
        phone: c.phone || "",
        location: c.location || "",
        memberSince: c.created_at,
        photo: c.avatar_url || "",
        type: "customer",
      }));

      return { providers, customers };
    },
  });
};
