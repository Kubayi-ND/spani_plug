import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, ExternalLink } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const NotificationsContent: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, deleteMultiple } = useNotifications();

  useEffect(() => {
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          // Refresh notifications on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(n =>
      (n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || n.status === statusFilter)
    );

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortBy === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [notifications, searchQuery, statusFilter, sortBy]);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Notifications <Badge>{unreadCount} unread</Badge>
        </h2>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={() => markAllAsRead()}>
              Mark All as Read
            </Button>
          )}
          {selectedNotifications.length > 0 && (
            <Button onClick={() => {
              deleteMultiple(selectedNotifications);
              setSelectedNotifications([]);
            }}>
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications List */}
      {filteredNotifications.map(n => (
        <Card key={n.id} className={`${n.status === "unread" ? "border-l-4 border-l-primary" : ""}`}>
          <CardContent className="flex items-start gap-4 p-4">
            <input 
              type="checkbox" 
              checked={selectedNotifications.includes(n.id)} 
              onChange={() => toggleNotificationSelection(n.id)}
              className="mt-1" 
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant={n.status === "unread" ? "default" : "secondary"}>
                  {n.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{n.message}</p>
              <div className="flex gap-2">
                {n.related_type === "service_request" && n.related_id && (
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => {
                      handleMarkAsRead(n.id);
                      navigate("/provider-portfolio", { state: { openTab: "requests" } });
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View Request
                  </Button>
                )}
                {n.status === "unread" && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(n.id)}>
                    Mark as Read
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => deleteNotification(n.id)}
                  className="text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredNotifications.length === 0 && (
        <Card className="p-6 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p>No notifications found</p>
        </Card>
      )}
    </div>
  );
};
