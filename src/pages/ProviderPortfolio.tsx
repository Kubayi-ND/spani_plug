import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  Edit3,
  File,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Doc = { id: string; type: "id" | "cert"; name: string; status: "approved" | "pending" | "declined"; previewUrl?: string; size?: number; mime?: string };
type Review = { id: number; customerName: string; date: string; rating: number; comment: string };
type ProviderType = {
  name: string;
  skill: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  rate: string;
  imageUrl: string;
  about: string;
  skills: string[];
  email: string;
  phone: string;
  reviews: Review[];
  documents: Doc[];
};

const ProviderPortfolio: React.FC = () => {
  const navigate = useNavigate();

  const initialProvider: ProviderType = {
    name: "Zanele Khumalo",
    skill: "Electrician",
    location: "Umlazi",
    distance: "5.7km away",
    rating: 4.9,
    reviewCount: 38,
    rate: "R300/hour",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    about: "Certified electrician providing safe and reliable electrical services. Available for emergencies 24/7.",
    skills: ["Electrician", "Wiring", "Installations", "Emergency Repairs"],
    email: "zanele.khumalo@example.com",
    phone: "+27 82 456 7890",
    reviews: [
      { id: 1, customerName: "Michael Brown", date: "2025-10-12", rating: 5, comment: "Outstanding service!" },
    ],
    documents: [
      { id: "id-1", type: "id", name: "zanele-id.jpg", status: "approved", previewUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop", mime: "image/jpeg" },
      { id: "cert-1", type: "cert", name: "electrical-cert.pdf", status: "pending", mime: "application/pdf" },
    ],
  };

  const [provider, setProvider] = useState<ProviderType>(initialProvider);
  const [editMode, setEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const StatusBadge: React.FC<{ status: Doc["status"] }> = ({ status }) => {
    const base = "inline-flex items-center px-2 py-0.5 rounded text-sm font-medium";
    if (status === "approved") return <span className={base + " bg-green-100 text-green-800"}>Approved</span>;
    if (status === "pending") return <span className={base + " bg-yellow-100 text-yellow-800"}>Pending</span>;
    return <span className={base + " bg-red-100 text-red-800"}>Declined</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h2 className="text-xl font-semibold">My Provider Portfolio</h2>
        </div>

        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="relative">
                <img src={imagePreview ?? provider.imageUrl} alt={provider.name} className="w-32 h-32 rounded-full object-cover" />
                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setImagePreview(URL.createObjectURL(f));
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                    aria-label="Change profile image"
                  />
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    {editMode ? (
                      <Input value={provider.name} onChange={(e) => setProvider((p) => ({ ...p, name: e.target.value }))} className="text-2xl font-bold" />
                    ) : (
                      <h1 className="text-2xl font-bold">{provider.name}</h1>
                    )}

                    <div className="mt-2">
                      {editMode ? (
                        <Input value={provider.skill} onChange={(e) => setProvider((p) => ({ ...p, skill: e.target.value }))} />
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

                  <div className="text-right">
                    <Button variant="ghost" onClick={() => setEditMode((v) => !v)} title={editMode ? "Exit edit" : "Edit profile"}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right">
                {editMode ? (
                  <div className="space-y-2">
                    <Input value={provider.rate} onChange={(e) => setProvider((p) => ({ ...p, rate: e.target.value }))} className="text-right" />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => { setProvider(initialProvider); setImagePreview(null); setEditMode(false); }}>Cancel</Button>
                      <Button onClick={() => { if (imagePreview) setProvider((p) => ({ ...p, imageUrl: imagePreview })); setEditMode(false); }}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Button size="lg" className="w-full sm:w-auto mb-2">Contact</Button>
                    <p className="text-2xl font-bold">{provider.rate}</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            {editMode ? (
              <Textarea value={provider.about} onChange={(e) => setProvider((p) => ({ ...p, about: e.target.value }))} />
            ) : (
              <p className="text-muted-foreground">{provider.about}</p>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                {editMode ? <Input value={provider.location} onChange={(e) => setProvider((p) => ({ ...p, location: e.target.value }))} /> : <p className="text-foreground">{provider.location}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rate</p>
                {editMode ? <Input value={provider.rate} onChange={(e) => setProvider((p) => ({ ...p, rate: e.target.value }))} /> : <p className="text-foreground">{provider.rate}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                {editMode ? <Input value={provider.email} onChange={(e) => setProvider((p) => ({ ...p, email: e.target.value }))} /> : <p className="text-foreground">{provider.email}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                {editMode ? <Input value={provider.phone} onChange={(e) => setProvider((p) => ({ ...p, phone: e.target.value }))} /> : <p className="text-foreground">{provider.phone}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">ID / Passport</h3>
                {editMode && (
                  <label className="text-sm underline cursor-pointer">
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
                        const doc: Doc = { id: `id-${Date.now()}`, type: "id", name: f.name, status: "pending", previewUrl: preview, size: f.size, mime: f.type };
                        setProvider((p) => ({ ...p, documents: [...p.documents, doc] }));
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {provider.documents.filter((d) => d.type === "id").map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-3 bg-card">
                    <div className="flex flex-col items-start gap-2">
                      {doc.previewUrl ? (
                        <img src={doc.previewUrl} alt={doc.name} className="w-full h-40 object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center rounded-md bg-muted">
                          <File className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="w-full flex items-center justify-between">
                        <div>
                          <p className="font-medium truncate max-w-[12rem]">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={doc.status} />
                        </div>
                      </div>
                      {editMode && (
                        <div className="w-full flex items-center justify-between gap-2">
                          <select value={doc.status} onChange={(e) => { const status = e.target.value as Doc["status"]; setProvider((p) => ({ ...p, documents: p.documents.map((x) => x.id === doc.id ? { ...x, status } : x) })); }} className="border rounded px-2 py-1">
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="declined">Declined</option>
                          </select>
                          <button className="text-sm text-red-600" onClick={() => setProvider((p) => ({ ...p, documents: p.documents.filter((x) => x.id !== doc.id) }))}>Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Certifications</h3>
                {editMode && (
                  <label className="text-sm underline cursor-pointer">
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
                        const doc: Doc = { id: `cert-${Date.now()}`, type: "cert", name: f.name, status: "pending", previewUrl: preview, size: f.size, mime: f.type };
                        setProvider((p) => ({ ...p, documents: [...p.documents, doc] }));
                      }}
                    />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {provider.documents.filter((d) => d.type === "cert").map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-3 bg-card">
                    <div className="flex flex-col items-start gap-2">
                      {doc.previewUrl ? (
                        <img src={doc.previewUrl} alt={doc.name} className="w-full h-40 object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center rounded-md bg-muted">
                          <File className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                      <div className="w-full flex items-center justify-between">
                        <div>
                          <p className="font-medium truncate max-w-[12rem]">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.size ? `${(doc.size / 1024).toFixed(1)} KB` : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={doc.status} />
                        </div>
                      </div>
                      {editMode && (
                        <div className="w-full flex items-center justify-between gap-2">
                          <select value={doc.status} onChange={(e) => { const status = e.target.value as Doc["status"]; setProvider((p) => ({ ...p, documents: p.documents.map((x) => x.id === doc.id ? { ...x, status } : x) })); }} className="border rounded px-2 py-1">
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                            <option value="declined">Declined</option>
                          </select>
                          <button className="text-sm text-red-600" onClick={() => setProvider((p) => ({ ...p, documents: p.documents.filter((x) => x.id !== doc.id) }))}>Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderPortfolio;
