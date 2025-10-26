import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  created_at: string;
  provider: {
    id: string;
    name: string;
  };
  approved: boolean;
}

export const useAdminMedia = (approved?: boolean) => {
  return useQuery({
    queryKey: ["admin-media", approved],
    queryFn: async () => {
      let query = (supabase as any)
        .from("media")
        .select(`
          id,
          url,
          type,
          created_at,
          approved,
          provider_profiles!media_provider_id_fkey (
            id,
            business_name
          )
        `)
        .order("created_at", { ascending: false });

      if (approved !== undefined) {
        query = query.eq("approved", approved);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        url: item.url,
        type: item.type,
        created_at: item.created_at,
        approved: item.approved,
        provider: {
          id: item.provider_profiles?.id,
          name: item.provider_profiles?.business_name,
        },
      }));
    },
  });
};

export const useUpdateMediaStatus = () => {
  const updateStatus = async (mediaId: string, approved: boolean) => {
    const { error } = await (supabase as any)
      .from("media")
      .update({ approved })
      .eq("id", mediaId);
    
    if (error) throw error;
    return true;
  };

  return { updateStatus };
};