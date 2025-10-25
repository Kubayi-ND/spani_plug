import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: {
      client_id: string;
      provider_id: string;
      rating: number;
      comment?: string;
      service_request_id?: string;
      before_image_url?: string;
      after_image_url?: string;
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      // Update provider profile stats
      await updateProviderStats(reviewData.provider_id);

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["provider-reviews", variables.provider_id] });
      queryClient.invalidateQueries({ queryKey: ["provider-profile", variables.provider_id] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

async function updateProviderStats(providerId: string) {
  // Get all reviews for this provider
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("provider_id", providerId);

  if (reviews && reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    // Update provider profile
    await supabase
      .from("provider_profiles")
      .update({
        rating: avgRating,
        review_count: reviews.length,
      })
      .eq("user_id", providerId);
  }
}

export const useReviewLikes = (reviewId: string) => {
  return useQuery({
    queryKey: ["review-likes", reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_likes")
        .select("*")
        .eq("review_id", reviewId);

      if (error) throw error;

      const likes = data?.filter(l => l.is_like).length || 0;
      const dislikes = data?.filter(l => !l.is_like).length || 0;

      return { likes, dislikes, data };
    },
    enabled: !!reviewId,
  });
};

export const useToggleReviewLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      userId,
      isLike,
    }: {
      reviewId: string;
      userId: string;
      isLike: boolean;
    }) => {
      // Check if user already liked/disliked
      const { data: existing } = await supabase
        .from("review_likes")
        .select("*")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .maybeSingle();

      if (existing) {
        // If same action, remove it; otherwise update
        if (existing.is_like === isLike) {
          await supabase
            .from("review_likes")
            .delete()
            .eq("id", existing.id);
        } else {
          await supabase
            .from("review_likes")
            .update({ is_like: isLike })
            .eq("id", existing.id);
        }
      } else {
        // Create new like/dislike
        await supabase
          .from("review_likes")
          .insert({
            review_id: reviewId,
            user_id: userId,
            is_like: isLike,
          });
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["review-likes", variables.reviewId] });
    },
  });
};

export const useReviewComments = (reviewId: string) => {
  return useQuery({
    queryKey: ["review-comments", reviewId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("review_comments")
        .select(`
          *,
          profiles!review_comments_user_id_fkey(
            full_name,
            avatar_url
          )
        `)
        .eq("review_id", reviewId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map(comment => ({
        ...comment,
        user: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
      }));
    },
    enabled: !!reviewId,
  });
};

export const useCreateReviewComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      userId,
      comment,
    }: {
      reviewId: string;
      userId: string;
      comment: string;
    }) => {
      const { data, error } = await supabase
        .from("review_comments")
        .insert({
          review_id: reviewId,
          user_id: userId,
          comment,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["review-comments", variables.reviewId] });
    },
  });
};
