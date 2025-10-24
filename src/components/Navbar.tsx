import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-gradient-to-br from-primary to-[hsl(250_84%_54%)] rounded-lg">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              ServiceHub
            </span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-foreground hover:text-primary"
            >
              Discovery
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="text-foreground hover:text-primary"
            >
              My Profile
            </Button>

            {/* Language Selector */}
            <Select defaultValue="en">
              <SelectTrigger className="w-[110px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="af">Afrikaans</SelectItem>
                <SelectItem value="zu">isiZulu</SelectItem>
                <SelectItem value="xh">isiXhosa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  );
};
