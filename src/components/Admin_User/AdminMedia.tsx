import { Card, CardContent } from "@/components/ui/card";
import { useAdminMedia, useUpdateMediaStatus } from "@/hooks/Admin/useAdminMedia";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export const AdminMedia = () => {
  const { data: pendingMedia, isLoading: pendingLoading } = useAdminMedia(false);
  const { data: approvedMedia, isLoading: approvedLoading } = useAdminMedia(true);
  const { updateStatus } = useUpdateMediaStatus();

  const handleUpdateStatus = async (mediaId: string, approved: boolean) => {
    try {
      await updateStatus(mediaId, approved);
      toast.success(`Media ${approved ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error("Failed to update media status");
    }
  };

  if (pendingLoading || approvedLoading) {
    return <div>Loading...</div>;
  }

  const MediaGrid = ({ items = [] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item: any) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            {item.type === 'image' ? (
              <img
                src={item.url}
                alt={`Upload by ${item.provider.name}`}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            ) : (
              <video
                src={item.url}
                controls
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium truncate">{item.provider.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              {!item.approved && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(item.id, true)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleUpdateStatus(item.id, false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center text-gray-500 py-8">
          No media found
        </div>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({pendingMedia?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({approvedMedia?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <MediaGrid items={pendingMedia} />
      </TabsContent>
      <TabsContent value="approved">
        <MediaGrid items={approvedMedia} />
      </TabsContent>
    </Tabs>
  );
};