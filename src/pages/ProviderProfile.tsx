import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, DollarSign, Phone, Mail, Globe, Briefcase, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: provider, isLoading } = useProviderProfile(id);

  const [showReviewForm, setShowReviewForm] = useState(false);
  interface Review {
    rating: number;
    comment: string;
    image?: File;
  }

  interface SubmittedReview {
    id: number;
    customerName: string;
    date: string;
    rating: number;
    comment: string;
    imageUrl: string | null;
  }

  const [newReview, setNewReview] = useState<Review>({
    rating: 0,
    comment: "",
  });
  const [submittedReviews, setSubmittedReviews] = useState<SubmittedReview[]>([]);

  if (isLoading || !provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewReview({ ...newReview, image: e.target.files[0] });
    }
  };

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
              <Avatar className="w-32 h-32 mx-auto sm:mx-0">
                <AvatarImage src={provider.avatar_url || undefined} />
                <AvatarFallback>{provider.business_name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                  {provider.business_name}
                </h1>
                <Badge className="mb-3">{provider.skill}</Badge>
                
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-[hsl(var(--rating))] text-[hsl(var(--rating))]" />
                  <span className="font-semibold text-foreground">{provider.rating}</span>
                  <span>({provider.review_count} reviews)</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location || "Location not specified"}</span>
                </div>

                {provider.is_verified && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Verified Provider</span>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-right">
                <Button size="lg" className="w-full sm:w-auto mb-2">
                  Contact Provider
                </Button>
                <p className="text-2xl font-bold text-foreground">R{provider.rate_per_hour}/hour</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{provider.bio || "No bio provided"}</p>
            
            {provider.years_experience && (
              <div className="mt-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {provider.years_experience} years of experience
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-foreground">{provider.location || "Location not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate per Hour</p>
                <p className="text-foreground">R{provider.rate_per_hour}</p>
              </div>
            </div>
            {provider.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p className="text-foreground">{provider.phone}</p>
              </div>
            )}
            {provider.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <p className="text-foreground">{provider.website}</p>
              </div>
            )}
            {provider.social_links && Object.entries(provider.social_links).length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-muted-foreground">Social Links</p>
                <div className="flex gap-4">
                  {Object.entries(provider.social_links).map(([platform, url]) => (
                    url && (
                      <a 
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Standalone Write Review Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </Button>
            </div>

            {showReviewForm && (
              <div className="mt-4 p-4 border rounded space-y-3 bg-background">
                <h3 className="font-semibold text-lg">Your Review</h3>

                {/* Star Rating */}
                <div className="flex gap-1 justify-center">
                  {[1,2,3,4,5].map((star) => (
                   <Star
  key={star}
  className={`h-6 w-6 cursor-pointer transition-colors duration-150 stroke-black ${
    star <= newReview.rating
      ? "fill-[hsl(var(--rating))] text-[hsl(var(--rating))]"
      : "fill-white text-muted"
  }`}
  onMouseEnter={() => setNewReview({ ...newReview, rating: star })}
  onClick={() => setNewReview({ ...newReview, rating: star })}
/>

                  ))}
                </div>

                {/* Comment */}
                <textarea
                  className="w-full border p-2 rounded"
                  rows={3}
                  placeholder="Write your review here..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />

                {/* Image Upload */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                  />
                  {newReview.image && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Selected file: {newReview.image.name}
                    </p>
                  )}
                </div>

                {/* Submit & Cancel */}
                <div className="flex gap-2 justify-center mt-2">
                  <Button
                    onClick={() => {
                      const review = {
                        id: provider.reviews.length + submittedReviews.length + 1,
                        customerName: "You",
                        date: new Date().toISOString().split("T")[0],
                        rating: newReview.rating,
                        comment: newReview.comment,
                        imageUrl: newReview.image ? URL.createObjectURL(newReview.image) : null,
                      };

                      setSubmittedReviews([...submittedReviews, review]);
                      setNewReview({ rating: 0, comment: "", image: null });
                      setShowReviewForm(false);
                    }}
                  >
                    Submit
                  </Button>
                  <Button variant="ghost" onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </Button>
                </div>
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
            {provider.reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.profiles.avatar_url || undefined} />
                      <AvatarFallback>{review.profiles.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground">{review.profiles.full_name}</p>
                  </div>
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
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
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