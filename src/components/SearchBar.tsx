import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddAddressModal } from "@/Models/AddAdressModel";
import { ProviderCard } from "@/components/ProviderCard";
import { supabase } from "@/integrations/supabase/client";
import type { ProviderProfile } from "@/hooks/useProviderProfile";

interface SearchBarProps {
  onSkillChange?: (skill: string) => void;
}

const mockCurrentLocation = { lat: -29.8587, lng: 31.0218 };

export const SearchBar = ({ onSkillChange }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [results, setResults] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      setShowResults(true);

      try {
        // ✅ Correct OR filter syntax: comma-separated, no parentheses
        const filter = `skill.ilike.%${searchTerm}%,profiles.full_name.ilike.%${searchTerm}%`;

        const { data, error } = await supabase
          .from("provider_profiles")
          .select(`
            id,
            user_id,
            skill,
            rate_per_hour,
            years_experience,
            rating,
            review_count,
            is_verified,
            profiles!provider_profiles_user_id_fkey (
              full_name,
              avatar_url,
              bio,
              location,
              phone
            )
          `)
          .or(filter)
          .order("rating", { ascending: false });

        if (error) throw error;

        const formatted = (data || []).map((provider) => {
          const profile = Array.isArray(provider.profiles)
            ? provider.profiles[0]
            : provider.profiles;

          return {
            id: provider.id,
            user_id: provider.user_id,
            business_name: profile?.full_name || "Unnamed Provider",
            skill: provider.skill,
            rate_per_hour: provider.rate_per_hour || 0,
            years_experience: provider.years_experience,
            rating: provider.rating || 0,
            review_count: provider.review_count || 0,
            is_verified: provider.is_verified || false,
            avatar_url: profile?.avatar_url || null,
            bio: profile?.bio || null,
            location: profile?.location || "Location not set",
            phone: profile?.phone || null,
            website: null,
            social_links: null,
          } as ProviderProfile;
        });

        setResults(formatted);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [searchTerm]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(mockCurrentLocation)
      );
    } else {
      setUserLocation(mockCurrentLocation);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-foreground">
        Find Services Near You
      </h2>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by skill or name..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="h-12" onClick={() => setShowResults(true)}>
          Search
        </Button>
      </div>

      {!userLocation && (
        <div className="flex justify-center gap-4 mt-2">
          <Button variant="outline" onClick={handleUseCurrentLocation}>
            <MapPin className="mr-2 h-4 w-4" /> Use Current Location
          </Button>
          <Button variant="secondary" onClick={() => setShowAddressModal(true)}>
            Add Address
          </Button>
        </div>
      )}

      <AddAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={(coords) => {
          setUserLocation(coords);
          setShowAddressModal(false);
        }}
      />

      {showResults && (
        <div className="mt-6 p-4 border rounded-lg bg-muted/40">
          <h3 className="text-lg font-semibold mb-3">Search Results</h3>
          {loading ? (
            <p className="text-muted-foreground">Searching...</p>
          ) : results.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No matching providers found for “{searchTerm}”. Explore other services below.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
