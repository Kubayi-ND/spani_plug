import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";
import { useProviderProfiles } from "@/hooks/useProviderProfile";
import { Skeleton } from "@/components/ui/skeleton";

const Discovery = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const { data: providers, isLoading } = useProviderProfiles(selectedSkill);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <SearchBar
          onSkillChange={setSelectedSkill}
          // selectedSkill={selectedSkill}
        />

        <div className="mt-8 grid gap-4 sm:gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : providers && providers.length > 0 ? (
            providers.map((provider) => (
              <ProviderCard
                key={provider.id}
                id={provider.id}
                name={provider.profile?.full_name || "Unknown Provider"}
                skill={provider.skill}
                location={provider.profile?.location || "Location not set"}
                distance="--" // Calculate distance in future
                rating={provider.rating}
                reviewCount={provider.review_count}
                rate={`R${provider.rate_per_hour}/hour`}
                imageUrl={provider.profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No service providers found. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
