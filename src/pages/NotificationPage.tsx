import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, MessageSquare, Filter, Search, MapPin, Trash2, MoreVertical, Eye, EyeOff, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";

// Mock data for notifications
const initialNotifications = [
  {
    id: 1,
    providerName: "Zanele Khumalo",
    service: "Electrical Installation",
    status: "pending",
    date: "2025-10-24",
    time: "14:30",
    location: "Umlazi, Durban",
    message: "Request sent for electrical installation service. Waiting for provider response.",
    unread: true,
    type: "request"
  },
  {
    id: 2,
    providerName: "John Smith",
    service: "Plumbing Repair",
    status: "accepted",
    date: "2025-10-24",
    time: "10:15",
    location: "Sandton, Johannesburg",
    message: "Your service request has been accepted. The provider will arrive at the scheduled time.",
    providerMessage: "I'll be there on time. Please ensure access to the main water supply.",
    unread: false,
    type: "request"
  },
  {
    id: 3,
    providerName: "Sarah Ndlovu",
    service: "House Cleaning",
    status: "declined",
    date: "2025-10-23",
    time: "09:00",
    location: "Soweto, Johannesburg",
    message: "Provider is unavailable for the requested time slot.",
    providerMessage: "I apologize, I'm fully booked for this time slot. Please try scheduling for tomorrow.",
    unread: false,
    type: "request"
  },
  {
    id: 4,
    providerName: "David Mbeki",
    service: "Garden Maintenance",
    status: "completed",
    date: "2025-10-22",
    time: "15:45",
    location: "Pretoria East",
    message: "Service has been completed. Please rate your experience.",
    unread: false,
    type: "request"
  },
  {
    id: 5,
    providerName: "System",
    service: "New Feature Available",
    status: "info",
    date: "2025-10-24",
    time: "08:00",
    location: "",
    message: "We've added new payment methods! You can now pay with credit card or mobile money.",
    unread: true,
    type: "system"
  },
  {
    id: 6,
    providerName: "Thabo Mokoena",
    service: "Carpentry Work",
    status: "accepted",
    date: "2025-10-24",
    time: "16:20",
    location: "Cape Town City Center",
    message: "Your carpentry service request has been confirmed for tomorrow.",
    providerMessage: "I have all the materials ready. Looking forward to working with you!",
    unread: true,
    type: "request"
  }
];

const NotificationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'accepted':
        return 'bg-green-500/10 text-green-500';
      case 'declined':
        return 'bg-red-500/10 text-red-500';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500';
      case 'info':
        return 'bg-purple-500/10 text-purple-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Awaiting Response';
      case 'accepted':
        return 'Request Accepted';
      case 'declined':
        return 'Request Declined';
      case 'completed':
        return 'Service Completed';
      case 'info':
        return 'Information';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(notification => {
      const matchesSearch = 
        notification.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || notification.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort notifications
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      
      switch (sortBy) {
        case 'newest':
          return dateB.getTime() - dateA.getTime();
        case 'oldest':
          return dateA.getTime() - dateB.getTime();
        case 'unread':
          if (a.unread && !b.unread) return -1;
          if (!a.unread && b.unread) return 1;
          return dateB.getTime() - dateA.getTime();
        default:
          return dateB.getTime() - dateA.getTime();
      }
    });

    return filtered;
  }, [notifications, searchQuery, statusFilter, sortBy]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, unread: false } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleDeleteSelected = () => {
    setNotifications(notifications.filter(notification => 
      !selectedNotifications.includes(notification.id)
    ));
    setSelectedNotifications([]);
  };

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id)
        ? prev.filter(notificationId => notificationId !== id)
        : [...prev, id]
    );
  };

  const handleRateService = (notificationId: number) => {
    // In a real app, this would navigate to a rating page or open a modal
    alert(`Rating service for notification #${notificationId}`);
  };

  const handleContactProvider = (providerName: string) => {
    // In a real app, this would open a chat or contact modal
    alert(`Contacting ${providerName}`);
  };

  const handleCancelRequest = (notificationId: number) => {
    if (window.confirm('Are you sure you want to cancel this request?')) {
      setNotifications(notifications.map(notification =>
        notification.id === notificationId 
          ? { ...notification, status: 'declined', message: 'Request cancelled by user.' }
          : notification
      ));
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

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
                onClick={handleDeleteSelected}
                className="text-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected ({selectedNotifications.length})
              </Button>
            )}
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="info">Information</SelectItem>
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

        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`relative ${notification.unread ? 'border-l-4 border-l-primary' : ''} ${
                selectedNotifications.includes(notification.id) ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => toggleNotificationSelection(notification.id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h2 className="text-xl font-semibold">{notification.service}</h2>
                        <p className="text-muted-foreground">Provider: {notification.providerName}</p>
                      </div>
                      <Badge className={getStatusColor(notification.status)}>
                        {getStatusText(notification.status)}
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(notification.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{notification.time}</span>
                      </div>
                      {notification.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{notification.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-4 rounded-lg bg-muted">
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>

                    {notification.providerMessage && (
                      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Provider Message</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.providerMessage}</p>
                      </div>
                    )}

                    {/* Action buttons based on status */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {notification.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRateService(notification.id)}
                          >
                            Rate Service
                          </Button>
                        )}
                        {notification.status === 'accepted' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-500"
                            onClick={() => handleContactProvider(notification.providerName)}
                          >
                            Contact Provider
                          </Button>
                        )}
                        {notification.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-yellow-500"
                            onClick={() => handleCancelRequest(notification.id)}
                          >
                            Cancel Request
                          </Button>
                        )}
                        {notification.unread && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark as Read
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notification.unread && (
                          <Badge variant="outline" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredNotifications.length === 0 && (
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

        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline">Load More</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;