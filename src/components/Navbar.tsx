import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Globe, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className=" px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-gradient-to-br from-primary to-[hsl(250_84%_54%)] rounded-lg">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              Spani Plug
            </span>
          </button>

          {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
            <div className="flex gap-2">
              <Button className="text-lg" variant="ghost" onClick={() => navigate("/discovery")}>
                Find Services
              </Button>
              <Button className="text-lg" variant="ghost" onClick={() => navigate("/social")}>
                Community
              </Button>
            </div>

              {/* Notifications button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/notifications")}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>

            {/* Profile & Language Dropdown */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex flex-col items-center gap-1"
                >
                  <User className="h-7 w-7" /> 
                  
                </button>

                {showDropdown && (
                  <div className="absolute left-1/2 -translate-x-1/2 w-48 bg-background border border-border rounded-md shadow-lg flex flex-col gap-2 z-50 p-1">
                    <div className="flex justify-center w-full border-b border-grey-300 p-2">
                      <span className="hidden sm:inline text-md font-semibold">
                        {user.user_metadata?.full_name || "User"}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-full h-9">
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
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>Sign Up</Button>
              </div>
            )}


          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" onClick={() => navigate("/discovery")} className="justify-start">
                  Find Services
                </Button>
                <Button variant="ghost" onClick={() => navigate("/social")} className="justify-start">
                  Community
                </Button>
                <Button variant="ghost" onClick={() => navigate("/notifications")} className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => navigate("/profile")} className="justify-start">
                      Profile
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="justify-start">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate("/login")} className="justify-start">
                      Login
                    </Button>
                    <Button onClick={() => navigate("/signup")} className="justify-start">
                      Sign Up
                    </Button>
                  </>
                )}
                <Select defaultValue="en">
                  <SelectTrigger className="w-full h-9">
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
