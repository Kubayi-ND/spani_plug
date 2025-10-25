import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, MapPin, DollarSign, Phone, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    image: null as File | null,
  });

  // State for newly submitted reviews displayed below the card
  const [submittedReviews, setSubmittedReviews] = useState<
    { id: number; customerName: string; date: string; rating: number; comment: string; imageUrl: string | null }[]
  >([]);

  // Mock provider data
  const provider = {
    name: "Zanele Khumalo",
    skill: "Electrician",
    location: "Umlazi",
    distance: "5.7km away",
    rating: 4.9,
    reviewCount: 38,
    rate: "R300/hour",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    about: "Certified electrician providing safe and reliable electrical services. Available for emergencies 24/7.",
    skills: ["Electrician", "Wiring", "Installations", "Emergency Repairs"],
    email: "zanele.khumalo@example.com",
    phone: "+27 82 456 7890",
    reviews: [
      {
        id: 1,
        customerName: "Michael Brown",
        date: "2025-10-12",
        rating: 5,
        comment: "Outstanding service! Very knowledgeable and professional.",
        imageUrl: null,
      },
      {
        id: 2,
        customerName: "Sarah Johnson",
        date: "2025-09-28",
        rating: 5,
        comment: "Fixed my electrical issues quickly and efficiently. Highly recommended!",
        imageUrl: null,
      },
      {
        id: 3,
        customerName: "David Williams",
        date: "2025-09-15",
        rating: 4,
        comment: "Great work, very reliable and punctual.",
        imageUrl: null,
      },
    ],
  };

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
              <img
                src={provider.imageUrl}
                alt={provider.name}
                className="w-32 h-32 rounded-full object-cover mx-auto sm:mx-0"
              />
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2 text-foreground">
                  {provider.name}
                </h1>
                <Badge className="mb-3">{provider.skill}</Badge>
                
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 text-muted-foreground">
                  <Star className="h-4 w-4 fill-[hsl(var(--rating))] text-[hsl(var(--rating))]" />
                  <span className="font-semibold text-foreground">{provider.rating}</span>
                  <span>({provider.reviewCount} reviews)</span>
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.distance}</span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto mb-2"
                  onClick={() => navigate('/notifications')}
                >
                  Contact Provider
                </Button>
               
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
            <p className="text-muted-foreground">{provider.about}</p>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Area Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-foreground">{provider.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate</p>
                <p className="text-foreground">{provider.rate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <p className="text-foreground">{provider.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <p className="text-foreground">{provider.email}</p>
            </div>
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
