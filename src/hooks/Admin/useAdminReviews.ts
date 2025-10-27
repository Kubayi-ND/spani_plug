import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminReviewData {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  client: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
}

export const useAdminReviews = (status?: 'pending' | 'approved' | 'rejected') => {
  return useQuery({
    queryKey: ["admin-reviews", status],
    queryFn: async () => {
      let query = (supabase as any)
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          status,
          profiles!reviews_client_id_fkey (
            id,
            full_name
          ),
          provider_profiles!reviews_provider_id_fkey (
            id,
            business_name
          )
        `)
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((review: any) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        created_at: review.created_at,
        status: review.status,
        client: {
          id: review.profiles?.id,
          name: review.profiles?.full_name,
        },
        provider: {
          id: review.provider_profiles?.id,
          name: review.provider_profiles?.business_name,
        },
      }));
    },
  });
};

export const useUpdateReviewStatus = () => {
  const updateStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    const { error } = await (supabase as any)
      .from("reviews")
      .update({ status })
      .eq("id", reviewId);
    
    if (error) throw error;
    return true;
  };

  return { updateStatus };
};