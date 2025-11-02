import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import { jobPostSchema, validateImageFile } from "@/lib/validation";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skill_required: "",
    location: "",
    budget_min: "",
    budget_max: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validate each file (SECURITY FIX)
      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          return;
        }
      }
      
      // Limit to 5 images total
      if (images.length + files.length > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }
      
      setImages([...images, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation (SECURITY FIX)
    const validation = jobPostSchema.safeParse({
      title: formData.title,
      description: formData.description,
      location: formData.location,
      budget_min: formData.budget_min ? parseInt(formData.budget_min) : undefined,
      budget_max: formData.budget_max ? parseInt(formData.budget_max) : undefined,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to post a job");

      const imageUrls: string[] = [];
      
      // Upload images to user's folder (SECURITY FIX: enforced by RLS)
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('job-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // Get signed URL with 1 year expiration (SECURITY FIX)
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('job-images')
          .createSignedUrl(fileName, 31536000); // 1 year

        if (urlError) throw urlError;
        
        imageUrls.push(signedUrlData.signedUrl);
      }

      const { error } = await supabase.from('jobs').insert([{
        client_id: user.id,
        title: validation.data.title,
        description: validation.data.description,
        skill_required: formData.skill_required as any,
        location: validation.data.location,
        budget_min: validation.data.budget_min,
        budget_max: validation.data.budget_max,
        images: imageUrls,
      }]);

      if (error) throw error;

      toast.success("Job posted successfully!");
      navigate("/discovery");
    } catch (error: any) {
      toast.error(error.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Post a Job</CardTitle>
            <CardDescription>
              Find the right service provider for your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Fix leaking tap in kitchen"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill">Service Required</Label>
                <Select
                  value={formData.skill_required}
                  onValueChange={(value) => setFormData({ ...formData, skill_required: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumber">Plumber</SelectItem>
                    <SelectItem value="electrician">Electrician</SelectItem>
                    <SelectItem value="carpenter">Carpenter</SelectItem>
                    <SelectItem value="gardener">Gardener</SelectItem>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
                    <SelectItem value="painter">Painter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the job in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Durban Central"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Min Budget (R)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    placeholder="100"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget_max">Max Budget (R)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    placeholder="500"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Images (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload images
                    </span>
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Posting..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
