import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AddAddressModal } from "@/Models/AddAdressModel";
import { ProviderCard } from "@/components/ProviderCard";
import { supabase } from "@/integrations/supabase/client";
import type { ProviderProfile } from "@/hooks/useProviderProfile";
import { useLanguage } from "@/components/context/LanguageContext";

interface SearchBarProps {
  onSkillChange?: (skill: string) => void;
}

const mockCurrentLocation = { lat: -29.8587, lng: 31.0218 };

export const SearchBar = ({ onSkillChange }: SearchBarProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(2); // 1..10 km
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
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

        // If we have a user location and providers include coordinates we can filter by radius
        let finalResults = formatted;
        if (userLocation) {
          finalResults = formatted.filter((p) => {
            const coords = parseCoords(p.location);
            if (!coords) return false; // exclude providers without parseable location
            const d = distanceKm(userLocation, coords);
            return d <= radiusKm;
          });
        }

        setResults(finalResults);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [searchTerm, userLocation, radiusKm]);

  // Utility: try to parse a provider location string into {lat, lng}
  const parseCoords = (locationStr: any): { lat: number; lng: number } | null => {
    if (!locationStr) return null;
    if (typeof locationStr === "object") {
      // could already be an object with lat/lng
      const lat = (locationStr as any).lat ?? (locationStr as any).latitude;
      const lng = (locationStr as any).lng ?? (locationStr as any).longitude;
      if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
    }

    if (typeof locationStr !== "string") return null;

    // try comma or space separated numbers
    const comma = locationStr.split(",");
    if (comma.length === 2) {
      const lat = parseFloat(comma[0].trim());
      const lng = parseFloat(comma[1].trim());
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng };
    }
    const space = locationStr.split(" ");
    if (space.length === 2) {
      const lat = parseFloat(space[0].trim());
      const lng = parseFloat(space[1].trim());
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng };
    }

    // try JSON
    try {
      const obj = JSON.parse(locationStr);
      const lat = obj.lat ?? obj.latitude;
      const lng = obj.lng ?? obj.longitude;
      if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
    } catch (e) {
      // ignore
    }

    return null;
  };

  // Haversine distance in kilometers
  const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const aVal = sinDLat * sinDLat + sinDLon * sinDLon * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  };

  const handleUseCurrentLocation = () => {
    // Check permissions first (if available) so we can show a friendly error
    const tryGetPos = () => {
      if (!navigator.geolocation) {
        window.alert("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setShowOptionsModal(false);
        },
        (err) => {
          console.error("geolocation error", err);
          if (err && err.code === err.PERMISSION_DENIED) {
            window.alert("Please allow location access in your browser to search by current location.");
          } else {
            window.alert("Unable to retrieve your location. Please try again or add your address manually.");
          }
        }
      );
    };

    // Use Permissions API when available to give nicer message
    if ((navigator as any).permissions && (navigator as any).permissions.query) {
      try {
        (navigator as any).permissions
          .query({ name: "geolocation" })
          .then((permissionStatus: any) => {
            if (permissionStatus.state === "denied") {
              window.alert("Location access has been denied. Please enable it in your browser settings.");
            } else {
              tryGetPos();
            }
          })
          .catch(() => tryGetPos());
      } catch (e) {
        tryGetPos();
      }
    } else {
      tryGetPos();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-foreground">
        {t('findServices')}
      </h2>

      <div className="grid place-items-center md:flex md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('searchSkill')}
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => {
              const v = e.target.value;
              setSearchTerm(v);
              if (v.trim()) {
                // show modal with options as soon as user types
                setShowOptionsModal(true);
              } else {
                setShowOptionsModal(false);
              }
            }}
          />
        </div>
        <div className="flex items-center gap-4 w-72">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm">Radius</label>
              <span className="text-sm font-medium">{radiusKm} km</span>
            </div>
            <div className="px-1">
              <Slider
                value={[radiusKm]}
                onValueChange={(v: number[]) => setRadiusKm(v[0] ?? 1)}
                min={1}
                max={10}
                step={1}
                aria-label="Search radius in kilometers"
              />
            </div>
          </div>

          <Button className="h-12" onClick={() => setShowResults(true)}>
            Search
          </Button>
        </div>
      </div>

      {/* Options modal appears when user types and wants to select how to provide location */}
      {showOptionsModal && !userLocation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowOptionsModal(false)} />
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md z-10">
            <h4 className="text-lg font-semibold mb-3">Location options</h4>
            <p className="text-sm text-muted-foreground mb-4">We need location information to find nearby service providers.</p>
            <p className="text-sm text-muted-foreground mb-4">Choose how you'd like to provide your location.</p>
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={handleUseCurrentLocation}>
                <MapPin className="mr-2 h-4 w-4" /> Use Current Location
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddressModal(true);
                  setShowOptionsModal(false);
                }}
              >
                Add Address
              </Button>
              <Button variant="ghost" onClick={() => setShowOptionsModal(false)}>
                Close
              </Button>
            </div>
          </div>
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
