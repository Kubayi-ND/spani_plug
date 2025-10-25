import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle, XCircle } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProvider, setIsProvider] = useState(false);

  // Profile data
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");

  // Provider-specific data
  const [skill, setSkill] = useState("");
  const [ratePerHour, setRatePerHour] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");

  // History data
  const [completedJobs, setCompletedJobs] = useState("");
  const [pendingJobs, setPendingJobs] = useState("");

  // Verification data
  const [certifiedId, setCertifiedId] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "none">("none");

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    await loadProviderData(user.id);
  };

  const loadProviderData = async (userId: string) => {
    try {
      // Load profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
        setBio(profile.bio || "");
        setLocation(profile.location || "");
        setPhone(profile.phone || "");
      }

      // Load provider profile
      const { data: providerProfile } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (providerProfile) {
        setIsProvider(true);
        setSkill(providerProfile.skill);
        setRatePerHour(providerProfile.rate_per_hour?.toString() || "");
        setYearsExperience(providerProfile.years_experience?.toString() || "");
      }

      // Load provider history
      const { data: history } = await supabase
        .from("provider_history")
        .select("*")
        .eq("provider_id", userId)
        .maybeSingle();

      if (history) {
        setCompletedJobs(history.completed_jobs?.toString() || "0");
        setPendingJobs(history.pending_jobs?.toString() || "0");
      }

      // Load verification docs
      const { data: verification } = await supabase
        .from("verification_documents")
        .select("*")
        .eq("provider_id", userId)
        .maybeSingle();

      if (verification) {
        setCertifiedId(verification.certified_id);
        setVerificationStatus(verification.verified_at ? "verified" : "pending");
      }
    } catch (error) {
      console.error("Error loading provider data:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Update or insert profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: fullName,
          bio,
          location,
          phone,
        });

      if (profileError) throw profileError;

      // Update or insert provider profile
      if (skill && ratePerHour) {
        const { error: providerError } = await supabase
          .from("provider_profiles")
          .upsert({
            user_id: user.id,
            skill: skill as any,
            rate_per_hour: parseInt(ratePerHour),
            years_experience: yearsExperience ? parseInt(yearsExperience) : null,
          });

        if (providerError) throw providerError;

        // Update or insert provider history
        const { error: historyError } = await supabase
          .from("provider_history")
          .upsert({
            provider_id: user.id,
            completed_jobs: parseInt(completedJobs) || 0,
            pending_jobs: parseInt(pendingJobs) || 0,
          });

        if (historyError) throw historyError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setIsProvider(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitVerification = async () => {
    if (!user || !certifiedId) {
      toast({
        title: "Error",
        description: "Please enter your certification ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("verification_documents")
        .upsert({
          provider_id: user.id,
          certified_id: certifiedId,
        });

      if (error) throw error;

      setVerificationStatus("pending");
      toast({
        title: "Success",
        description: "Verification request submitted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Provider Dashboard</h1>

        {/* Basic Profile Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell customers about yourself"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Durban, KwaZulu-Natal"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 82 456 7890"
              />
            </div>
          </CardContent>
        </Card>

        {/* Provider Information Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Provider Information</CardTitle>
            <CardDescription>Details about your services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="skill">Primary Skill</Label>
              <Select value={skill} onValueChange={setSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary skill" />
                </SelectTrigger>
                <SelectContent>
                  {Constants.public.Enums.skill_category.map((skillOption) => (
                    <SelectItem key={skillOption} value={skillOption}>
                      {skillOption.charAt(0).toUpperCase() + skillOption.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rate">Rate Per Hour (R)</Label>
              <Input
                id="rate"
                type="number"
                value={ratePerHour}
                onChange={(e) => setRatePerHour(e.target.value)}
                placeholder="e.g., 250"
              />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Job History Section */}
        {isProvider && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job History</CardTitle>
              <CardDescription>Track your completed and pending jobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="completed">Completed Jobs</Label>
                <Input
                  id="completed"
                  type="number"
                  value={completedJobs}
                  onChange={(e) => setCompletedJobs(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="pending">Pending Jobs</Label>
                <Input
                  id="pending"
                  type="number"
                  value={pendingJobs}
                  onChange={(e) => setPendingJobs(e.target.value)}
                  placeholder="0"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Section */}
        {isProvider && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Verification Status
                {verificationStatus === "verified" && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {verificationStatus === "pending" && (
                  <Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
                )}
                {verificationStatus === "none" && (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
              <CardDescription>
                {verificationStatus === "verified" && "You are verified!"}
                {verificationStatus === "pending" && "Verification pending review"}
                {verificationStatus === "none" && "Get verified to build trust with customers"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="certId">Certification ID</Label>
                <Input
                  id="certId"
                  value={certifiedId}
                  onChange={(e) => setCertifiedId(e.target.value)}
                  placeholder="Enter your certification ID"
                  disabled={verificationStatus === "verified"}
                />
              </div>
              {verificationStatus !== "verified" && (
                <Button
                  onClick={handleSubmitVerification}
                  disabled={loading || !certifiedId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSaveProfile}
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Profile"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProviderDashboard;
