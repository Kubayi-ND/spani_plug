import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

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
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 bg-gradient-to-br from-primary to-[hsl(250_84%_54%)] rounded-lg">
              <Users className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">
              Spani Plug
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/discovery")}
            >
              Find Services
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/social")}
            >
              Community
            </Button>
            
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate("/post-job")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
              </>
            )}

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

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/discovery")}
                  className="justify-start"
                >
                  Find Services
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/social")}
                  className="justify-start"
                >
                  Community
                </Button>
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/post-job")}
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Post Job
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/profile")}
                      className="justify-start"
                    >
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/login")}
                      className="justify-start"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => navigate("/signup")}
                      className="justify-start"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
