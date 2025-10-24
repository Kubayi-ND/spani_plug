import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchBarProps {
  onSkillChange?: (skill: string) => void;
  onLocationChange?: (location: string) => void;
  selectedSkill?: string;
}

export const SearchBar = ({ onSkillChange, onLocationChange, selectedSkill }: SearchBarProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-foreground">
        Find Services Near You
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by skill..."
            className="pl-10 h-12"
            onChange={(e) => onSkillChange?.(e.target.value)}
          />
        </div>

        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by location..."
            className="pl-10 h-12"
            onChange={(e) => onLocationChange?.(e.target.value)}
          />
        </div>

        <Select value={selectedSkill} onValueChange={onSkillChange}>
          <SelectTrigger className="w-full sm:w-[200px] h-12">
            <SelectValue placeholder="All Skills" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="plumber">Plumber</SelectItem>
            <SelectItem value="electrician">Electrician</SelectItem>
            <SelectItem value="carpenter">Carpenter</SelectItem>
            <SelectItem value="gardener">Gardener</SelectItem>
            <SelectItem value="cleaner">Cleaner</SelectItem>
            <SelectItem value="painter">Painter</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
