import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, XCircle, Phone, Mail } from "lucide-react";
import { useServiceRequests, useUpdateServiceRequest } from "@/hooks/useServiceRequests";
import { useAuth } from "@/hooks/Admin/useAuth";
import { toast } from "sonner";

export const ServiceRequestsContent: React.FC = () => {
  const { user } = useAuth();
  const { data: requests, isLoading } = useServiceRequests(user?.id || "", "provider");
  const { mutate: updateRequest, isPending } = useUpdateServiceRequest();

  const handleStatusUpdate = (id: string, status: string) => {
    updateRequest(
      { id, status },
      {
        onSuccess: () => {
          toast.success(`Request ${status}`);
        },
        onError: () => {
          toast.error("Failed to update request");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const pendingRequests = requests?.filter((r) => r.status === "pending") || [];
  const acceptedRequests = requests?.filter((r) => r.status === "accepted") || [];
  const completedRequests = requests?.filter((r) => r.status === "completed") || [];
  const rejectedRequests = requests?.filter((r) => r.status === "rejected") || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Service Requests</h2>
        <div className="flex gap-2">
          <Badge variant="secondary">{pendingRequests.length} Pending</Badge>
          <Badge variant="default">{acceptedRequests.length} Accepted</Badge>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Pending Requests
          </h3>
          {pendingRequests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.client?.avatar_url || undefined} />
                    <AvatarFallback>{request.client?.full_name?.charAt(0) || "C"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg">{request.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        From {request.client?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{request.description}</p>
                    {request.client?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{request.client.phone}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleStatusUpdate(request.id, "accepted")}
                        disabled={isPending}
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(request.id, "rejected")}
                        disabled={isPending}
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Accepted Requests */}
      {acceptedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Accepted Requests
          </h3>
          {acceptedRequests.map((request) => (
            <Card key={request.id} className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.client?.avatar_url || undefined} />
                    <AvatarFallback>{request.client?.full_name?.charAt(0) || "C"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg">{request.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        From {request.client?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-muted-foreground">{request.description}</p>
                    {request.client?.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{request.client.phone}</span>
                      </div>
                    )}
                    <Button
                      onClick={() => handleStatusUpdate(request.id, "completed")}
                      disabled={isPending}
                      size="sm"
                    >
                      Mark as Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            Completed Requests
          </h3>
          {completedRequests.map((request) => (
            <Card key={request.id} className="opacity-75">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.client?.avatar_url || undefined} />
                    <AvatarFallback>{request.client?.full_name?.charAt(0) || "C"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-semibold">{request.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        From {request.client?.full_name || "Unknown"}
                      </p>
                      <Badge variant="outline" className="mt-1">Completed</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {requests?.length === 0 && (
        <Card className="p-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No service requests yet</p>
        </Card>
      )}
    </div>
  );
};
