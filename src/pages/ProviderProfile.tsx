import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, DollarSign, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { useProviderReviews } from "@/hooks/useProviderReviews";

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: provider, isLoading: providerLoading } = useProviderProfile(id);
  const { data: reviews, isLoading: reviewsLoading } = useProviderReviews(id || "");

  if (providerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Skeleton className="h-10 w-24 mb-6" />
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Provider not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Provider Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={provider.profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"}
                alt={provider.profile?.full_name || "Provider"}
                className="w-32 h-32 rounded-full object-cover mx-auto sm:mx-0"
              />
              
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {provider.profile?.full_name || "Unknown Provider"}
                  </h1>
                  {provider.is_verified && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
                <Badge className="mb-3">{provider.skill}</Badge>
                
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-[hsl(var(--rating))] text-[hsl(var(--rating))]" />
                  <span className="font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
                  <span>({provider.review_count} reviews)</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.profile?.location || "Location not set"}</span>
                </div>

                {provider.years_experience && (
                  <div className="mt-2 text-muted-foreground">
                    {provider.years_experience} years of experience
                  </div>
                )}
              </div>

              <div className="text-center sm:text-right">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto mb-2"
                  onClick={() => navigate('/notifications')}
                >
                  Contact Provider
                </Button>
                <p className="text-2xl font-bold text-foreground">R{provider.rate_per_hour}/hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        {provider.profile?.bio && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{provider.profile.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {provider.profile?.location && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="text-foreground">{provider.profile.location}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate</p>
                <p className="text-foreground">R{provider.rate_per_hour}/hour</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">
                      {review.client?.full_name || "Anonymous"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
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
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No reviews yet</p>
            )}
          </CardContent>
        </Card>

        {/* Newly Submitted Reviews - displayed below card */}
        {submittedReviews.length > 0 && (
          <div className="mt-4">
            {submittedReviews.map((review) => (
              <Card key={review.id} className="mb-4">
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-foreground">{review.customerName}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
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
                  <p className="text-muted-foreground">{review.comment}</p>
                  {review.imageUrl && (
                    <img
                      src={review.imageUrl}
                      alt="Review attachment"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderProfile;
