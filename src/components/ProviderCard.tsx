import { Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProviderCardProps {
  id: string;
  name: string;
  skill: string;
  location: string;
  distance?: string; // ✅ made optional
  rating: number;
  reviewCount: number;
  rate: string;
  imageUrl: string;
}

export const ProviderCard = ({
  id,
  name,
  skill,
  location,
  distance,
  rating,
  reviewCount,
  imageUrl,
}: ProviderCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Provider Image */}
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={name}
              className="w-full sm:w-24 sm:h-24 h-48 object-cover rounded-lg"
            />
          </div>

          {/* Provider Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {skill}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
              {/* ✅ Only show distance if provided */}
              {distance && <span className="text-muted-foreground">• {distance}</span>}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[hsl(var(--rating))] text-[hsl(var(--rating))]" />
                <span className="font-medium text-foreground">{rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
            
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

