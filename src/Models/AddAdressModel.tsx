// AddAddressModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (coords: { lat: number; lng: number }) => void;
}

export const AddAddressModal = ({ open, onClose, onSave }: AddAddressModalProps) => {
  // Basic address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Mock coordinates based on city for MVP
  const mockCityCoords: Record<string, { lat: number; lng: number }> = {
    durban: { lat: -29.8587, lng: 31.0218 },
    umlazi: { lat: -29.9700, lng: 30.8800 },
    phoenix: { lat: -29.6950, lng: 31.0000 },
  };

  const handleSave = () => {
    const coords = mockCityCoords[city.toLowerCase()] || mockCityCoords["durban"];
    onSave(coords);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input placeholder="Street Address" value={street} onChange={(e) => setStreet(e.target.value)} />
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <Input placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Address</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};