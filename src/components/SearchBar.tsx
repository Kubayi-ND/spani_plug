// SearchBar.tsx
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddAddressModal } from "@/Models/AddAdressModel";

// Props for communicating with parent (Discovery)
interface SearchBarProps {
  onSearch?: (query: string, location: { lat: number; lng: number } | null) => void;
  onSkillChange?: (skill: string) => void; // optional filter update
}

// Mock coordinates for demonstration (Durban)
const mockCurrentLocation = { lat: -29.8587, lng: 31.0218 };

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  // Local state for search query and location
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // When user clicks "Use My Location"
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          onSearch?.(searchTerm, coords);
        },
        () => {
          // If permission denied, fall back to mock
          setUserLocation(mockCurrentLocation);
          onSearch?.(searchTerm, mockCurrentLocation);
        }
      );
    } else {
      // No geolocation support
      setUserLocation(mockCurrentLocation);
      onSearch?.(searchTerm, mockCurrentLocation);
    }
  };

  // When user submits the search
  const handleSearch = () => {
    if (!userLocation) {
      // If no location yet, show modal
      setShowAddressModal(true);
    } else {
      // Proceed to search
      onSearch?.(searchTerm.toLowerCase(), userLocation);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-foreground">
        Find Services Near You
      </h2>

      {/* Unified Search Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search service..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <Button className="h-12" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {/* Location Buttons */}
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

      {/* Address Modal for manual address input */}
      <AddAddressModal
        open={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSave={(coords) => {
          setUserLocation(coords);
          setShowAddressModal(false);
          onSearch?.(searchTerm.toLowerCase(), coords);
        }}
      />
    </div>
  );
};