import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, MessageSquare, Star } from "lucide-react";

interface Review {
  id: string;
  client_id: string;
  provider_id: string;
  rating: number;
  comment: string;
  before_image_url: string | null;
  after_image_url: string | null;
  likes_count: number;
  created_at: string;
  client_profile?: {
    full_name: string;
    avatar_url: string;
  };
  provider_profile?: {
    full_name: string;
  };
}

export const SocialReviewFeed = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reviewId: string, isLike: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to like reviews");
        return;
      }

      const { data: existing } = await supabase
        .from('review_likes')
        .select()
        .eq('review_id', reviewId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        await supabase
          .from('review_likes')
          .delete()
          .eq('review_id', reviewId)
          .eq('user_id', user.id);
      }

      await supabase.from('review_likes').insert({
        review_id: reviewId,
        user_id: user.id,
        is_like: isLike,
      });

      fetchReviews();
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleComment = async (reviewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to comment");
        return;
      }

      if (!commentText[reviewId]?.trim()) return;

      await supabase.from('review_comments').insert({
        review_id: reviewId,
        user_id: user.id,
        comment: commentText[reviewId],
      });

      setCommentText({ ...commentText, [reviewId]: "" });
      fetchComments(reviewId);
      toast.success("Comment added");
    } catch (error: any) {
      toast.error("Failed to add comment");
    }
  };

  const fetchComments = async (reviewId: string) => {
    try {
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments({ ...comments, [reviewId]: data || [] });
    } catch (error: any) {
      console.error(error);
    }
  };

  const toggleComments = async (reviewId: string) => {
    const newState = !showComments[reviewId];
    setShowComments({ ...showComments, [reviewId]: newState });
    
    if (newState && !comments[reviewId]) {
      await fetchComments(reviewId);
    }
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6 mt-16">
      <h2 className="text-2xl font-bold">Community Reviews</h2>
      
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar>
                <AvatarImage src={review.client_profile?.avatar_url} />
                <AvatarFallback>
                  {review.client_profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{review.client_profile?.full_name || "User"}</p>
                <p className="text-sm text-muted-foreground">
                  reviewed {review.provider_profile?.full_name || "Provider"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-[hsl(var(--rating))] text-[hsl(var(--rating))]"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mb-4">{review.comment}</p>

            {(review.before_image_url || review.after_image_url) && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {review.before_image_url && (
                  <div>
                    <p className="text-sm font-medium mb-2">Before</p>
                    <img
                      src={review.before_image_url}
                      alt="Before"
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                )}
                {review.after_image_url && (
                  <div>
                    <p className="text-sm font-medium mb-2">After</p>
                    <img
                      src={review.after_image_url}
                      alt="After"
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(review.id, true)}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(review.id, false)}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Dislike
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleComments(review.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>

            {showComments[review.id] && (
              <div className="mt-4 space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText[review.id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [review.id]: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Button onClick={() => handleComment(review.id)}>Post</Button>
                </div>

                {comments[review.id]?.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.profiles?.avatar_url} />
                      <AvatarFallback>
                        {comment.profiles?.full_name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {comment.profiles?.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
