import React, { useState } from "react";
import { Star, MapPin, Mail, Phone, Edit3, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type Doc = { id: string; type: "id" | "cert"; name: string; status: "approved" | "pending" | "declined"; previewUrl?: string; size?: number; mime?: string };
export type Review = { id: number; customerName: string; date: string; rating: number; comment: string };
export type ProviderType = {
  name: string;
  skill: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  about: string;
  skills: string[];
  email: string;
  phone: string;
  reviews: Review[];
  documents: Doc[];
};

const initialProvider: ProviderType = {
  name: "Zanele Khumalo",
  skill: "Electrician",
  location: "Umlazi",
  distance: "5.7km away",
  rating: 4.9,
  reviewCount: 38,
  imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  about: "Certified electrician providing safe and reliable electrical services. Available for emergencies 24/7.",
  skills: ["Electrician", "Wiring", "Installations", "Emergency Repairs"],
  email: "zanele.khumalo@example.com",
  phone: "+27 82 456 7890",
  reviews: [{ id: 1, customerName: "Michael Brown", date: "2025-10-12", rating: 5, comment: "Outstanding service!" }],
  documents: [],
};

export const ProfileContent: React.FC = () => {
  const [provider, setProvider] = useState<ProviderType>(initialProvider);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const StatusBadge: React.FC<{ status: Doc["status"] }> = ({ status }) => {
    const base = "inline-flex items-center px-2 py-0.5 rounded text-sm font-medium";
    if (status === "approved") return <span className={base + " bg-green-100 text-green-800"}>Approved</span>;
    if (status === "pending") return <span className={base + " bg-yellow-100 text-yellow-800"}>Pending</span>;
    return <span className={base + " bg-red-100 text-red-800"}>Declined</span>;
  };

  const handleCancel = () => {
    setProvider(initialProvider);
    setImagePreview(null);
    setEditMode(false);
  };

  const handleSave = () => {
    if (imagePreview) setProvider((p) => ({ ...p, imageUrl: imagePreview }));
    setEditMode(false);
  };

  return (
    <div>
      {/* Profile Header */}
      <h1 className="text-3xl text-gray-600 font-bold py-4">My Profile</h1>
      <Card className="mb-6">
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative">
              <img src={imagePreview ?? provider.imageUrl} alt={provider.name} className="w-32 h-32 rounded-full object-cover" />
              {editMode && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImagePreview(URL.createObjectURL(file));
                  }}
                />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  {editMode ? (
                    <Input value={provider.name} onChange={(e) => setProvider(p => ({ ...p, name: e.target.value }))} className="text-2xl font-bold" />
                  ) : (
                    <h1 className="text-2xl font-bold">{provider.name}</h1>
                  )}
                  <div className="mt-2">
                    {editMode ? (
                      <Input value={provider.skill} onChange={(e) => setProvider(p => ({ ...p, skill: e.target.value }))} />
                    ) : (
                      <Badge>{provider.skill}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span>({provider.reviewCount} reviews)</span>
                  </div>
                </div>

                {!editMode && (
                  <div className="text-right">
                    <Button variant="ghost" onClick={() => setEditMode(true)}>
                      Edit <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editMode && (
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* About */}
      <Card className="mb-6">
        <CardHeader><CardTitle>About</CardTitle></CardHeader>
        <CardContent>
          {editMode ? (
            <Textarea value={provider.about} onChange={(e) => setProvider(p => ({ ...p, about: e.target.value }))} />
          ) : (
            <p className="text-muted-foreground">{provider.about}</p>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="mb-6">
        <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">{provider.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="mb-6">
        <CardHeader><CardTitle>User Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            {editMode ? <Input value={provider.location} onChange={(e) => setProvider(p => ({ ...p, location: e.target.value }))} /> : <p>{provider.location}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            {editMode ? <Input value={provider.email} onChange={(e) => setProvider(p => ({ ...p, email: e.target.value }))} /> : <p>{provider.email}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            {editMode ? <Input value={provider.phone} onChange={(e) => setProvider(p => ({ ...p, phone: e.target.value }))} /> : <p>{provider.phone}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
