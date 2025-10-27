import { useState } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Save, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCustomerProfile, useCustomerHistory, useUpdateCustomerProfile } from "@/hooks/useCustomerProfile";
import { useMyJobs } from "@/hooks/useJobs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/Admin/useAuth";
import { toast } from "sonner";

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    bio: "",
    location: "",
    phone: "",
  });

  const { data: profile, isLoading: profileLoading } = useCustomerProfile(user?.id);
  const { data: history, isLoading: historyLoading } = useCustomerHistory(user?.id);
  const { data: jobs, isLoading: jobsLoading } = useMyJobs(user?.id);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateCustomerProfile();

  // Redirect if not authenticated
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  if (loading || profileLoading) {
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
    <div className="min-h-screen mt-16 bg-background">
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
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "Customer"} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "C"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                {isEditing ? (
                  <Input
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                    placeholder="Full Name"
                    className="mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {profile?.full_name || "Customer"}
                  </h2>
                )}
                {isEditing ? (
                  <Input
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    placeholder="Location"
                    className="mb-2"
                  />
                ) : (
                  <p className="text-muted-foreground">{profile?.location || "Location not set"}</p>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member Since {new Date(profile?.created_at || "").toLocaleDateString()}</span>
                </div>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => {
                  setIsEditing(true);
                  setEditForm({
                    full_name: profile?.full_name || "",
                    bio: profile?.bio || "",
                    location: profile?.location || "",
                    phone: profile?.phone || "",
                  });
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    {isEditing ? (
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Phone Number"
                      />
                    ) : (
                      <p className="text-foreground">{profile?.phone || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    {isEditing ? (
                      <Input
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        placeholder="Location"
                      />
                    ) : (
                      <p className="text-foreground">{profile?.location || "Not provided"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Edit className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Bio</p>
                    {isEditing ? (
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                      />
                    ) : (
                      <p className="text-foreground">{profile?.bio || "No bio provided"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    updateProfile(
                      { user_id: user?.id!, ...editForm },
                      {
                        onSuccess: () => {
                          setIsEditing(false);
                          toast.success("Profile updated successfully");
                        },
                        onError: (error) => {
                          toast.error("Failed to update profile");
                          console.error("Update error:", error);
                        }
                      }
                    );
                  }}
                  disabled={isUpdating}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button className="w-full" size="lg" onClick={() => navigate("/post-job")}>
                Post a Job
              </Button>
            )}
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
                  <Skeleton key={i} className="h-[140px] w-full" />
                ))}
              </div>
            ) : jobs && jobs.length > 0 ? (
              <div className="grid gap-4">
                {jobs.slice(0, 5).map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-semibold text-foreground truncate">{job.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{job.skill_required}</Badge>
                            <Badge 
                              variant={
                                job.status === "open" ? "secondary" :
                                job.status === "in_progress" ? "default" :
                                job.status === "completed" ? "outline" :
                                "outline"
                              }
                            >
                              {job.status.replace("_", " ")}
                            </Badge>
                            {job.budget_max && (
                              <Badge variant="outline">
                                R{job.budget_min}-{job.budget_max}
                              </Badge>
                            )}
                          </div>

                          {job.created_at && (
                            <p className="text-xs text-muted-foreground">
                              Posted {new Date(job.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {jobs.length > 5 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/my-jobs")}
                  >
                    View All Jobs
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
                <Button onClick={() => navigate("/post-job")}>
                  Post Your First Job
                </Button>
              </div>
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
              <div className="grid gap-3">
                {history.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">{item.service_name}</h4>
                            <Badge variant="outline">
                              {new Date(item.service_date).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">by {item.service_provider_name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">You haven't used any services yet</p>
                <Button variant="outline" onClick={() => navigate("/discovery")}>
                  Browse Service Providers
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfile;
