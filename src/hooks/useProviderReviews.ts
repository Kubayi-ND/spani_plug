import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProviderReviews = (providerId: string) => {
  return useQuery({
    queryKey: ["provider-reviews", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          client:profiles!reviews_client_id_fkey(
            full_name
          )
        `)
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!providerId,
  });
};
