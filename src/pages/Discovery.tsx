// src/pages/Discovery.tsx
import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProviderCard } from "@/components/ProviderCard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Discovery page with debounced service suggestions.
 * - Single search input (service)
 * - Suggestions from platformServices appear after 1s debounce
 * - Click suggestion to fill input
 * - Search requires declared location (modal -> current location or add address)
 * - Radius slider filters results; results sorted nearest->furthest
 */

/* platform service mock list */
const platformServices = ["Plumber", "Electrician", "Carpenter", "Gardener", "Cleaner", "Painter"];

/* mock providers (inline) */
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

  // Soweto-area providers
  {
    id: "s1",
    name: "Kgosi Mokoena",
    skill: "Plumber",
    location: "Orlando, Soweto",
    coords: { lat: -26.2445, lng: 27.854 },
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
    coords: { lat: -26.2455, lng: 27.8595 },
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
    coords: { lat: -26.265, lng: 27.842 },
    rating: 4.6,
    reviewCount: 18,
    rate: "R190/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1520201163981-1a9cb0a2d6a5?w=400&h=400&fit=crop",
  },

  // Durban-area (continued)
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

  // Braamfontein-area providers (NEW)
  {
    id: "b1",
    name: "Tebogo Molefe",
    skill: "Electrician",
    location: "Braamfontein, Johannesburg",
    coords: { lat: -26.1944, lng: 28.034 },
    rating: 4.8,
    reviewCount: 45,
    rate: "R300/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop",
  },
  {
    id: "b2",
    name: "Ayanda Ndlovu",
    skill: "Cleaner",
    location: "Braamfontein, Johannesburg",
    coords: { lat: -26.1935, lng: 28.0335 },
    rating: 4.9,
    reviewCount: 56,
    rate: "R130/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
  },
  {
    id: "b3",
    name: "Sabelo Dube",
    skill: "Painter",
    location: "Braamfontein, Johannesburg",
    coords: { lat: -26.195, lng: 28.035 },
    rating: 4.7,
    reviewCount: 28,
    rate: "R200/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    id: "b4",
    name: "Nokuthula Khosa",
    skill: "Plumber",
    location: "Braamfontein, Johannesburg",
    coords: { lat: -26.1947, lng: 28.0362 },
    rating: 4.6,
    reviewCount: 33,
    rate: "R250/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  },
  {
    id: "b5",
    name: "Kagiso Radebe",
    skill: "Gardener",
    location: "Braamfontein, Johannesburg",
    coords: { lat: -26.1928, lng: 28.0325 },
    rating: 4.5,
    reviewCount: 21,
    rate: "R170/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop",
  },
];


/* haversine distance in km */
const getDistanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
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

/* mock geocode (Soweto + Durban) */
const mockGeocode = (cityOrAddress: string) => {
  const map: Record<string, { lat: number; lng: number }> = {
    soweto: { lat: -26.2446, lng: 27.8580 },
    orlando: { lat: -26.2445, lng: 27.8540 },
    jabulani: { lat: -26.2455, lng: 27.8595 },
    meadowlands: { lat: -26.2650, lng: 27.8420 },
    durban: { lat: -29.8587, lng: 31.0218 },
    umlazi: { lat: -30.005, lng: 30.907 },
    phoenix: { lat: -29.775, lng: 31.03 },
    pinetown: { lat: -29.865, lng: 30.879 },
    chatsworth: { lat: -29.875, lng: 30.94 },
    westville: { lat: -29.84, lng: 30.92 },
  };
  const key = (cityOrAddress || "").trim().toLowerCase();
  return map[key] || map["soweto"];
};

export default function Discovery() {
  // input & suggestion states
  const [serviceQuery, setServiceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // location + providers
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [providersToShow, setProvidersToShow] = useState(mockProviders);

  // UI states
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [radius, setRadius] = useState<number>(2);

  // pending & last search
  const [pendingService, setPendingService] = useState<string | null>(null);
  const [lastServiceSearched, setLastServiceSearched] = useState<string | null>(null);

  // ref for suggestions blur handling
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  /* helper: platform services matching typed characters */
  const servicesMatchingTyped = (typed: string) => {
    const t = (typed || "").trim().toLowerCase();
    if (!t) return [];
    return platformServices.filter((s) => s.toLowerCase().includes(t));
  };

  /* debounce suggestions: when user types, wait 1s then compute suggestions */
  useEffect(() => {
    // clear previous timeout
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (!serviceQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // set new debounce
    debounceRef.current = window.setTimeout(() => {
      const matched = servicesMatchingTyped(serviceQuery);
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
      debounceRef.current = null;
    }, 1000); // 1 second debounce

    // cleanup on unmount
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [serviceQuery]);

  /* when clicking outside suggestions, hide them */
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  /* perform the search (same logic as before) */
  const performSearch = (typedService: string, coords: { lat: number; lng: number }) => {
    const matchingServices = servicesMatchingTyped(typedService);

    if (matchingServices.length === 0) {
      setNotFound(true);
      setProvidersToShow(mockProviders);
      setLastServiceSearched(typedService);
      return;
    }

    let matchingProviders = mockProviders.filter((p) =>
      matchingServices.some((s) => s.toLowerCase() === p.skill.toLowerCase())
    );

    const nearby = matchingProviders
      .map((p) => {
        const distanceKm = getDistanceKm(coords, p.coords);
        return { ...p, distanceKm, distance: `${distanceKm.toFixed(1)} km away` };
      })
      .filter((p) => p.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    if (nearby.length === 0) {
      setNotFound(true);
      setProvidersToShow(mockProviders);
    } else {
      setNotFound(false);
      setProvidersToShow(nearby);
    }

    setLastServiceSearched(typedService);
  };

  /* Search click: show modal if no location, otherwise run search */
  const handleSearchClick = () => {
    const service = serviceQuery.trim();
    if (!service) {
      setLocationError("Please enter the service you want (e.g., plumber).");
      return;
    }
    setLocationError("");

    if (location) {
      performSearch(service, location);
      return;
    }

    setPendingService(service);
    setShowLocationPrompt(true);
  };

  /* geolocation */
  const handleUseCurrentLocation = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        setShowLocationPrompt(false);
        performSearch(pendingService ?? serviceQuery, coords);
        setPendingService(null);
      },
      () => {
        setLocationError("Location access denied. Please add your address manually.");
        // keep modal open so user can choose Add Address
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* add-address */
  const handleChooseAddAddress = () => {
    setShowAddressForm(true);
    setShowLocationPrompt(false);
  };

  const handleSaveAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const street = (form.elements.namedItem("street") as HTMLInputElement)?.value || "";
    const city = (form.elements.namedItem("city") as HTMLInputElement)?.value || "";
    const postal = (form.elements.namedItem("postal") as HTMLInputElement)?.value || "";
    const full = `${street} ${city} ${postal}`.trim();
    if (!full) {
      setLocationError("Please fill in at least the city field.");
      return;
    }
    const coords = mockGeocode(city || full);
    setLocation(coords);
    setShowAddressForm(false);
    setLocationError("");
    performSearch(pendingService ?? serviceQuery, coords);
    setPendingService(null);
  };

  /* rerun search when radius changes if last search and location exist */
  useEffect(() => {
    if (lastServiceSearched && location) performSearch(lastServiceSearched, location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radius]);

  /* animation variants */
  const overlayAnim = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  const panelAnim = { initial: { y: 8, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 8, opacity: 0 } };
  const cardAnim = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 8 } };
  const suggestionAnim = { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 } };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Search input + suggestions */}
        <div className="relative max-w-3xl">
          <div className="flex gap-3">
            <Input
              placeholder="Search service... (type to see suggestions)"
              value={serviceQuery}
              onChange={(e) => {
                setServiceQuery(e.target.value);
                // immediately hide suggestions until debounce completes
                setShowSuggestions(false);
              }}
              onFocus={() => {
                // if we already have suggestions computed, show them on focus
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              className="flex-1"
            />
            <Button onClick={handleSearchClick}>Search</Button>
          </div>

          {/* Suggestions dropdown (debounced) */}
          <div ref={suggestionsRef} className="absolute left-0 right-0 mt-2 z-40">
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  key="suggestions"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={suggestionAnim}
                  className="bg-white border rounded-md shadow-lg overflow-hidden"
                  style={{ listStyle: "none", margin: 0, padding: 0 }}
                >
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      onMouseDown={(e) => {
                        // mouseDown used to prevent input blur before click handler
                        e.preventDefault();
                        setServiceQuery(s);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-slate-50 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Radius control */}
        <div className="flex items-center gap-3 mt-3 max-w-3xl">
          <label className="text-sm font-medium">Radius:</label>
          <input type="range" min={1} max={10} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="flex-1" />
          <div className="text-sm font-semibold">{radius} km</div>
        </div>

        {/* Not found message */}
        <AnimatePresence>{notFound && (<motion.div key="notfound" variants={panelAnim} initial="initial" animate="animate" exit="exit" className="my-4 max-w-3xl mx-auto border border-rose-200 rounded-lg bg-rose-50 p-4 text-center"><h3 className="text-lg font-semibold text-rose-700">Sorry — no nearby providers matched your request.</h3><p className="text-sm text-rose-600 mt-2">We couldn't find the service within {radius} km. Default providers are shown below.</p></motion.div>)}</AnimatePresence>

        {/* Location errors */}
        <AnimatePresence>{locationError && (<motion.div key="locerr" variants={panelAnim} initial="initial" animate="animate" exit="exit"><Alert variant="destructive" className="mb-2"><AlertTitle>Location required</AlertTitle><AlertDescription>{locationError}</AlertDescription></Alert></motion.div>)}</AnimatePresence>

        {/* Location prompt modal */}
        <AnimatePresence>
          {showLocationPrompt && (
            <motion.div key="locOverlay" variants={overlayAnim} initial="initial" animate="animate" exit="exit" className="fixed inset-0 z-50 flex sm:items-end md:items-center justify-center bg-black/40 p-4 sm:mb-10" onClick={() => { setShowLocationPrompt(false); setPendingService(null); }}>
              <motion.div key="locPanel" variants={panelAnim} initial="initial" animate="animate" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 25 }} className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-2">We need your location</h3>
                <p className="text-sm text-muted-foreground mb-4">To find service providers near you we need a location. Allow access to your current location or add an address manually. We will not run the search without a saved location.</p>

                <div className="flex flex-wrap gap-3 justify-end">
                  <Button variant="outline" onClick={handleUseCurrentLocation}>Use Current Location</Button>
                  <Button onClick={handleChooseAddAddress}>Add Address</Button>
                  <Button variant="ghost" onClick={() => { setShowLocationPrompt(false); setPendingService(null); }}>Cancel</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address form */}
        <AnimatePresence>
          {showAddressForm && (
            <motion.div key="addrForm" variants={panelAnim} initial="initial" animate="animate" exit="exit" className="mt-4 max-w-xl">
              <form onSubmit={handleSaveAddress} className="space-y-3 bg-white p-4 rounded shadow">
                <div>
                  <label className="block text-sm font-medium mb-1">Street address</label>
                  <Input name="street" placeholder="123 Main St" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <Input name="city" placeholder="Soweto (Orlando, Jabulani, Meadowlands)" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Postal code</label>
                  <Input name="postal" placeholder="Postal code" />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => { setShowAddressForm(false); setPendingService(null); }}>Cancel</Button>
                  <Button type="submit">Save Address & Search</Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Provider cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {providersToShow.map((p) => (
              <motion.div key={p.id} layout initial="initial" animate="animate" exit="exit" variants={cardAnim} transition={{ duration: 0.14 }}>
                <ProviderCard {...p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* fallback */}
        {providersToShow.length === 0 && (<div className="text-center py-12"><p className="text-muted-foreground">No providers to show.</p></div>)}
      </div>
    </div>
  );
}
