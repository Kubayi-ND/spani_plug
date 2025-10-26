import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminReviews, useUpdateReviewStatus } from "@/hooks/Admin/useAdminReviews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const AdminReviews = () => {
  const { data: pendingReviews, isLoading: pendingLoading } = useAdminReviews("pending");
  const { data: approvedReviews, isLoading: approvedLoading } = useAdminReviews("approved");
  const { data: rejectedReviews, isLoading: rejectedLoading } = useAdminReviews("rejected");
  const { updateStatus } = useUpdateReviewStatus();

  const handleUpdateStatus = async (reviewId: string, status: 'approved' | 'rejected') => {
    try {
      await updateStatus(reviewId, status);
      toast.success(`Review ${status} successfully`);
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  if (pendingLoading || approvedLoading || rejectedLoading) {
    return <div>Loading...</div>;
  }

  const ReviewList = ({ reviews = [] }) => (
    <div className="space-y-4">
      {reviews.map((review: any) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">
                  {review.provider.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Reviewed by {review.client.name}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium">
                  Rating: {review.rating}/5
                </div>
                {review.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(review.id, "approved")}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(review.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
      {reviews.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No reviews found
        </div>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({pendingReviews?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({approvedReviews?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected ({rejectedReviews?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <ReviewList reviews={pendingReviews} />
      </TabsContent>
      <TabsContent value="approved">
        <ReviewList reviews={approvedReviews} />
      </TabsContent>
      <TabsContent value="rejected">
        <ReviewList reviews={rejectedReviews} />
      </TabsContent>
    </Tabs>
  );
};