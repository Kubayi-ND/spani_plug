import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { ProviderCard } from "@/components/ProviderCard";

// Mock data for MVP
const mockProviders = [
  {
    id: "1",
    name: "Thabo Mthembu",
    skill: "Plumber",
    location: "Durban Central",
    distance: "2.3km away",
    rating: 4.8,
    reviewCount: 24,
    rate: "R250/hour",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    name: "Zanele Khumalo",
    skill: "Electrician",
    location: "Umlazi",
    distance: "5.7km away",
    rating: 4.9,
    reviewCount: 38,
    rate: "R300/hour",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    name: "Sipho Dlamini",
    skill: "Carpenter",
    location: "Phoenix",
    distance: "8.2km away",
    rating: 4.7,
    reviewCount: 19,
    rate: "R200/hour",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
  {
    id: "4",
    name: "Nomusa Zulu",
    skill: "Gardener",
    location: "Pinetown",
    distance: "12.5km away",
    rating: 4.6,
    reviewCount: 15,
    rate: "R150/hour",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    id: "5",
    name: "Mandla Ngcobo",
    skill: "Painter",
    location: "Chatsworth",
    distance: "6.8km away",
    rating: 4.5,
    reviewCount: 22,
    rate: "R180/hour",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    id: "6",
    name: "Precious Mdluli",
    skill: "Cleaner",
    location: "Westville",
    distance: "4.1km away",
    rating: 4.9,
    reviewCount: 42,
    rate: "R120/hour",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
];

const Discovery = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  const filteredProviders =
    selectedSkill === "all"
      ? mockProviders
      : mockProviders.filter((p) => p.skill.toLowerCase() === selectedSkill);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <SearchBar
          onSkillChange={setSelectedSkill}
          selectedSkill={selectedSkill}
        />

        <div className="mt-8 grid gap-4 sm:gap-6">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} {...provider} />
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No service providers found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
