import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Loader2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useCustomerProfile, useCustomerHistory } from "@/hooks/useCustomerProfile";
import { useMyJobs } from "@/hooks/useJobs";
import { Badge } from "@/components/ui/badge";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUserId(user.id);
  };

  const { data: profile, isLoading: profileLoading } = useCustomerProfile(userId || "");
  const { data: history, isLoading: historyLoading } = useCustomerHistory(userId || "");
  const { data: jobs, isLoading: jobsLoading } = useMyJobs(userId || "");

  if (!userId || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <Skeleton className="h-10 w-24 mb-6" />
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
              <img
                src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"}
                alt={profile?.full_name || "Customer"}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground mb-1">
                  {profile?.full_name || "Customer"}
                </h2>
                <p className="text-muted-foreground">{profile?.location || "Location not set"}</p>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since {new Date(profile?.created_at || "").toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Details</h3>
              <div className="space-y-4">
                {profile?.phone && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p className="text-foreground">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile?.location && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-foreground">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={() => navigate("/post-job")}>
              Post a Job
            </Button>
          </CardContent>
        </Card>

        {/* My Jobs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              My Posted Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{job.skill_required}</Badge>
                          <Badge variant="outline">{job.status}</Badge>
                        </div>
                      </div>
                      {job.budget_max && (
                        <p className="text-sm font-medium text-foreground">R{job.budget_min}-{job.budget_max}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No jobs posted yet</p>
            )}
          </CardContent>
        </Card>

        {/* Service History */}
        <Card>
          <CardHeader>
            <CardTitle>Service History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{item.service_name}</p>
                        <p className="text-sm text-muted-foreground">by {item.service_provider_name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.service_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No service history yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfile;
