import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, MessageSquare, Search, MapPin, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/integrations/supabase/client";

const NotificationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, deleteMultiple } = useNotifications();

  useEffect(() => {
    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          // Notifications will be automatically refreshed by react-query
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "unread") return "bg-primary/10 text-primary";
    return "bg-muted text-muted-foreground";
  };


  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      
      switch (sortBy) {
        case 'newest':
          return dateB.getTime() - dateA.getTime();
        case 'oldest':
          return dateA.getTime() - dateB.getTime();
        case 'unread':
          if (a.status === "unread" && b.status !== "unread") return -1;
          if (a.status !== "unread" && b.status === "unread") return 1;
          return dateB.getTime() - dateA.getTime();
        default:
          return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [notifications, searchQuery, statusFilter, sortBy]);

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  return (
    <div className="min-h-screen mt-16 bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
          </div>
          
          <div className="flex gap-2">
          {selectedNotifications.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  deleteMultiple(selectedNotifications);
                  setSelectedNotifications([]);
                }}
              >
                Delete Selected ({selectedNotifications.length})
              </Button>
            )}
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => markAllAsRead()}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="unread">Unread First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`relative ${notification.status === "unread" ? 'border-l-4 border-l-primary' : ''} ${
                  selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleNotificationSelection(notification.id)}
                      className="mt-1 h-4 w-4 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h2 className="text-xl font-semibold">{notification.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>

                      <div className="mt-4 p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        {notification.status === "unread" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

          {filteredNotifications.length === 0 && !isLoading && (
            <Card className="p-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : "You're all caught up! Check back later for new updates."
                }
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Card>
          )}
      </div>
    </div>
  );
};

export default NotificationPage;