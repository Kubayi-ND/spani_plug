// src/pages/Discovery.tsx
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProviderCard } from "@/components/ProviderCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// ----------------------
// Mock providers (inline for now)
// Added Soweto-area providers so you can test locally
// ----------------------
const mockProviders = [
  // Durban-area (original)
  {
    id: "1",
    name: "Thabo Mthembu",
    skill: "Plumber",
    location: "Durban Central",
    coords: { lat: -29.8587, lng: 31.0218 },
    rating: 4.8,
    reviewCount: 24,
    rate: "R250/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Zanele Khumalo",
    skill: "Electrician",
    location: "Umlazi",
    coords: { lat: -30.005, lng: 30.907 },
    rating: 4.9,
    reviewCount: 38,
    rate: "R300/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  // Soweto-area providers (NEW)
  {
    id: "s1",
    name: "Kgosi Mokoena",
    skill: "Plumber",
    location: "Orlando, Soweto",
    coords: { lat: -26.2445, lng: 27.8540 }, // Orlando area approx
    rating: 4.7,
    reviewCount: 32,
    rate: "R220/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478177-8f439ea8d8b1?w=400&h=400&fit=crop",
  },
  {
    id: "s2",
    name: "Zinhle Mthethwa",
    skill: "Electrician",
    location: "Jabulani, Soweto",
    coords: { lat: -26.2455, lng: 27.8595 }, // Jabulani area approx
    rating: 4.9,
    reviewCount: 48,
    rate: "R280/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    id: "s3",
    name: "Siphiwe Ramotsoela",
    skill: "Carpenter",
    location: "Meadowlands, Soweto",
    coords: { lat: -26.2650, lng: 27.8420 }, // Meadowlands area approx
    rating: 4.6,
    reviewCount: 18,
    rate: "R190/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1520201163981-1a9cb0a2d6a5?w=400&h=400&fit=crop",
  },
  // A couple more general providers
  {
    id: "3",
    name: "Sipho Dlamini",
    skill: "Carpenter",
    location: "Phoenix",
    coords: { lat: -29.775, lng: 31.03 },
    rating: 4.7,
    reviewCount: 19,
    rate: "R200/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Nomusa Zulu",
    skill: "Gardener",
    location: "Pinetown",
    coords: { lat: -29.865, lng: 30.879 },
    rating: 4.6,
    reviewCount: 15,
    rate: "R150/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "Mandla Ngcobo",
    skill: "Painter",
    location: "Chatsworth",
    coords: { lat: -29.875, lng: 30.94 },
    rating: 4.5,
    reviewCount: 22,
    rate: "R180/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "Precious Mdluli",
    skill: "Cleaner",
    location: "Westville",
    coords: { lat: -29.84, lng: 30.92 },
    rating: 4.9,
    reviewCount: 42,
    rate: "R120/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
];

// ----------------------
// Haversine formula for distance in km
// ----------------------
const getDistanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371; // Earth radius km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2) ** 2;
  const sinLon = Math.sin(dLon / 2) ** 2;
  const aTerm = sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon;
  const c = 2 * Math.atan2(Math.sqrt(aTerm), Math.sqrt(1 - aTerm));
  return R * c;
};

// ----------------------
// Mock geocode for demo
// Added Soweto-related keys and fallback set to Soweto
// ----------------------
const mockGeocode = (cityOrAddress: string) => {
  const map: Record<string, { lat: number; lng: number }> = {
    // Durban-area
    durban: { lat: -29.8587, lng: 31.0218 },
    umlazi: { lat: -30.005, lng: 30.907 },
    phoenix: { lat: -29.775, lng: 31.03 },
    pinetown: { lat: -29.865, lng: 30.879 },
    chatsworth: { lat: -29.875, lng: 30.94 },
    westville: { lat: -29.84, lng: 30.92 },

    // Soweto-area (new)
    soweto: { lat: -26.2446, lng: 27.8580 }, // general Soweto center
    orlando: { lat: -26.2445, lng: 27.8540 },
    jabulani: { lat: -26.2455, lng: 27.8595 },
    meadowlands: { lat: -26.2650, lng: 27.8420 },
  };
  const key = cityOrAddress.trim().toLowerCase();
  // fallback to Soweto so testing for your location is easier
  return map[key] || map["soweto"];
};

// ----------------------
// Component
// ----------------------
export default function Discovery() {
  // user typed service (e.g., "plumber")
  const [serviceQuery, setServiceQuery] = useState("");

  // declared location coords (either current or saved address)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // providers currently shown (either filtered or default)
  const [providersToShow, setProvidersToShow] = useState(mockProviders);

  // UI states
  const [showLocationPrompt, setShowLocationPrompt] = useState(false); // popup asking for location
  const [showAddressForm, setShowAddressForm] = useState(false); // manual address form
  const [locationError, setLocationError] = useState(""); // permission or other errors
  const [notFound, setNotFound] = useState(false); // single "not found" message
  const [radius, setRadius] = useState(2); // km

  // temp storage for pending service when we show prompt
  const [pendingService, setPendingService] = useState<string | null>(null);

  // Perform the actual search given a service string and location coords
  const performSearch = (service: string, coords: { lat: number; lng: number }) => {
    const normalized = service.trim().toLowerCase();
    if (!normalized) {
      // if somehow empty, just show defaults
      setNotFound(false);
      setProvidersToShow(mockProviders);
      return;
    }

    // filter providers by service match (case-insensitive includes)
    const matching = mockProviders.filter((p) =>
      p.skill.toLowerCase().includes(normalized)
    );

    if (matching.length === 0) {
      // service not in system — show notFound box and default providers underneath
      setNotFound(true);
      setProvidersToShow(mockProviders);
      return;
    }

    // compute distance from declared location, filter by radius, sort nearest -> furthest
    const nearby = matching
      .map((p) => {
        const distanceKm = getDistanceKm(coords, p.coords);
        return {
          ...p,
          distanceKm,
          distance: `${distanceKm.toFixed(1)} km away`,
        };
      })
      .filter((p) => p.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    if (nearby.length === 0) {
      // service exists but none found within radius
      setNotFound(true);
      setProvidersToShow(mockProviders); // still render defaults below message
    } else {
      setNotFound(false);
      setProvidersToShow(nearby);
    }
  };

  // Called when user clicks Search
  const handleSearchClick = () => {
    const service = serviceQuery.trim();
    if (!service) {
      setLocationError("Please enter the service you want (e.g. 'Plumber').");
      return;
    }
    // If location already declared, perform search immediately
    if (location) {
      setLocationError("");
      performSearch(service, location);
      return;
    }

    // If no location declared, ask user to declare location first
    setPendingService(service);
    setShowLocationPrompt(true);
    setLocationError("");
  };

  // User chose to use current location: request geolocation and proceed only on success
  const handleUseCurrentLocation = () => {
    setLocationError("");
    // If browser doesn't support geolocation, show error
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setShowLocationPrompt(false);
        // If we had a pending service stored, search with it; otherwise use current input
        performSearch(pendingService ?? serviceQuery, coords);
        setPendingService(null);
      },
      (err) => {
        // Permission denied or other error -> do not run search
        setLocationError("Location access denied. Please add your address manually.");
        // keep the prompt open so user can choose Add Address
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // User chose to add address: show form
  const handleChooseAddAddress = () => {
    setShowAddressForm(true);
    setShowLocationPrompt(false);
  };

  // Save address from form -> mock-geocode -> perform search
  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Read values from the form fields
    const form = e.currentTarget;
    const street = (form.elements.namedItem("street") as HTMLInputElement)?.value || "";
    const city = (form.elements.namedItem("city") as HTMLInputElement)?.value || "";
    const postal = (form.elements.namedItem("postal") as HTMLInputElement)?.value || "";

    const full = `${street} ${city} ${postal}`.trim();
    if (!full) {
      setLocationError("Please fill in address fields.");
      return;
    }

    // Mock geocode using city token (default fallback -> Soweto)
    const coords = mockGeocode(city || full);
    setLocation(coords);
    setShowAddressForm(false);
    setLocationError("");
    // perform search with pendingService first, fallback to serviceQuery
    performSearch(pendingService ?? serviceQuery, coords);
    setPendingService(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* --- Search row: single input where user types service --- */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <Input
            placeholder="Search service... (e.g. plumber, electrician)"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
            className="w-full sm:w-2/3"
          />
          <Button onClick={handleSearchClick}>Search</Button>
        </div>

        {/* radius control */}
        <div className="flex items-center gap-3 mt-3">
          <label className="text-sm font-medium">Search radius:</label>
          <input
            type="range"
            min={1}
            max={10}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="flex-1"
          />
          <div className="text-sm font-semibold">{radius} km</div>
        </div>

        {/* single not found message box (only one used) */}
        {notFound && (
          <div className="my-6 max-w-2xl mx-auto border border-red-200 rounded-lg bg-red-50 p-4 text-center">
            <h3 className="text-lg font-semibold text-red-700">
              Sorry — no nearby providers matched your request.
            </h3>
            <p className="text-sm text-red-600 mt-2">
              We couldn't find the service within {radius} km. Please browse service providers below.
            </p>
            <ul>
              <li className="text-sm text-red-600 mt-2">Please Check the spelling above</li>
              <li className="text-sm text-red-600 mt-2">Please make sure you have declared you address upon search</li>
            </ul>
          </div>
        )}

        {/* location error (permission / validation) */}
        {locationError && (
          <div className="my-4">
            <Alert variant="destructive">
              <AlertTitle>Location required</AlertTitle>
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* POPUP: ask for location when user clicked Search with no declared location */}
        {showLocationPrompt && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 ">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-2">We need your location</h3>
              <p className="text-sm text-muted-foreground mb-4">
                To find service providers near you we need a location. You can either allow
                access to your current location or add an address manually. We won't proceed
                without your location.
              </p>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={handleUseCurrentLocation}>
                  Use Current Location
                </Button>
                <Button onClick={handleChooseAddAddress}>Add Address</Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowLocationPrompt(false);
                    setPendingService(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Address form shown when user chose Add Address */}
        {showAddressForm && (
          <div className="mt-6 max-w-xl">
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Street address</label>
                <Input name="street" placeholder="123 Main St" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input name="city" placeholder="Soweto (or Orlando, Jabulani)" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Postal code</label>
                <Input name="postal" placeholder="Postal code" />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddressForm(false);
                    setPendingService(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Address & Search</Button>
              </div>
            </form>
          </div>
        )}

        {/* Provider results (default or filtered) */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providersToShow.map((p) => (
            // ProviderCard will show distance if it's present in the object
            <ProviderCard key={p.id} {...p} />
          ))}
        </div>

        {/* If providersToShow is empty (unlikely because we fallback to defaults), show fallback message */}
        {providersToShow.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No providers to show.</p>
          </div>
        )}
      </div>
    </div>
  );
}
