import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userRole, setUserRole] = useState<"customer" | "provider">();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure a role is selected
    if (!userRole) {
      toast.error("Please select an account type");
      return;
    }
  
    setLoading(true);
  
    try {
      // 1. Create auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: userRole,
            email_verified: true,
          },
        },
      });
  
      if (signUpError) throw signUpError;
      if (!user) throw new Error("Failed to create user");

      // 2. Create profile record
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          full_name: fullName,
          avatar_url: null,
          bio: null,
        });

      if (profileError) throw profileError;

      // 3. If provider, create provider profile
      if (userRole === "provider") {
        const { error: providerError } = await supabase
          .from("provider_profiles")
          .insert({
            user_id: user.id,
            skill: "other", // Default skill, they can update later
            rate_per_hour: null,
            years_experience: null,
            is_verified: false,
          });

        if (providerError) throw providerError;
      }
  
      toast.success("Account created! Welcome to Spani Plug");
      navigate("/discovery");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Join Spani Plug</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup
                value={userRole}
                onValueChange={(value: "customer" | "provider") => setUserRole(value)}
                className="flex justify-around"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">Customer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="provider" id="provider" />
                  <Label htmlFor="provider">Service Provider</Label>
                </div>
              </RadioGroup>

            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
