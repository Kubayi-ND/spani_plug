import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";

// Mock notifications data
export const notificationsData = [
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
];

export const NotificationsContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [notifications, setNotifications] = useState(notificationsData);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = useMemo(() => {
    let filtered = notifications.filter(n =>
      (n.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || n.status === statusFilter)
    );

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return sortBy === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    return filtered;
  }, [notifications, searchQuery, statusFilter, sortBy]);

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const toggleNotificationSelection = (id: number) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Notifications <Badge>{unreadCount} unread</Badge>
        </h2>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}>
              Mark All as Read
            </Button>
          )}
          {selectedNotifications.length > 0 && (
            <Button onClick={() => setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))}>
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="info">Info</SelectItem>
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
        <Card key={n.id} className={`${n.unread ? "border-l-4 border-l-primary" : ""}`}>
          <CardContent className="flex items-start gap-4">
            <input type="checkbox" checked={selectedNotifications.includes(n.id)} onChange={() => toggleNotificationSelection(n.id)} />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{n.service}</h3>
                <Badge>{n.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              {n.unread && <Button size="sm" onClick={() => handleMarkAsRead(n.id)}>Mark as Read</Button>}
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
