import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProviderCardProps {
  provider: {
    id: string;
    business_name: string;
    skill: string;
    location: string;
    rating: number;
    review_count: number;
    rate_per_hour: number;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

export const ProviderCard = ({ provider }: ProviderCardProps) => {
  const navigate = useNavigate();
  const { 
    id, 
    business_name, 
    skill, 
    location, 
    rating, 
    review_count, 
    rate_per_hour, 
    avatar_url, 
    is_verified 
  } = provider;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Provider Image */}
          <div className="flex-shrink-0">
            <img
              src={avatar_url || "/default-avatar.png"}
              alt={business_name}
              className="w-full sm:w-24 sm:h-24 h-48 object-cover rounded-lg"
            />
          </div>

          {/* Provider Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground">
                  {business_name}
                  {is_verified && (
                    <Badge variant="default" className="ml-2">
                      Verified
                    </Badge>
                  )}
                </h3>
                <Badge variant="secondary" className="mt-1">
                  {skill}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[hsl(var(--rating))] text-[hsl(var(--rating))]" />
                <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({review_count} reviews)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-lg font-semibold text-foreground">
                R {rate_per_hour}/hr
              </p>
              <Button onClick={() => navigate(`/provider/${id}`)}>
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
