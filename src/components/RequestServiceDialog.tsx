import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface RequestServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  providerName: string;
}

export const RequestServiceDialog = ({
  open,
  onOpenChange,
  providerId,
  providerName,
}: RequestServiceDialogProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to request a service");
        navigate("/login");
        return;
      }

      // ✅ Create service request with required fields
      const { data: serviceRequest, error: requestError } = await supabase
        .from("service_requests")
        .insert([
          {
            client_id: user.id,
            provider_id: providerId,
            title,
            description,
            status: "pending",
            created_at: new Date().toISOString(), // ensures timestamp is included
            media_urls: [],
          },
        ])
        .select("id, client_id, provider_id, status, created_at")
        .single();

      if (requestError) {
        console.error("Service request error:", requestError);
        throw requestError;
      }
      
      console.log("Service request created:", serviceRequest);

      // ✅ Create notification for provider
      const { data: notification, error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: providerId,
          title: "New Service Request",
          message: `You have a new service request from a customer: ${title}`,
          type: "service_request",
          status: "unread",
          related_id: serviceRequest.id,
          related_type: "service_request",
          metadata: {
            client_id: user.id,
            provider_id: providerId,
            status: "pending",
            created_at: serviceRequest.created_at,
            title,
            description,
          },
        })
        .select()
        .single();

      if (notificationError) {
        console.error("Notification error:", notificationError);
        throw notificationError;
      }

      console.log("Notification created:", notification);

      toast.success("Service request sent successfully!");
      onOpenChange(false);
      setTitle("");
      setDescription("");
    } catch (error: any) {
      console.error("Error creating service request:", error);
      toast.error(error.message || "Failed to send service request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Service from {providerName}</DialogTitle>
          <DialogDescription>
            Fill in the details below to send a service request to this provider.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              placeholder="e.g., Kitchen Plumbing Repair"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what you need help with..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
