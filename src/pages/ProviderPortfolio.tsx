import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ProfileContent } from "./../components/Admin_User/portfolio/ProfileContent";
import { NotificationsContent } from "./../components/Admin_User/portfolio/NotificationContent";
import { ServiceRequestsContent } from "./../components/Admin_User/portfolio/ServiceRequestsContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Bell, ArrowLeft, Briefcase } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useServiceRequests } from "@/hooks/useServiceRequests";
import { useAuth } from "@/hooks/Admin/useAuth";

const ProviderPortfolio: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "requests">("profile");
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const { data: requests } = useServiceRequests(user?.id || "", "provider");

  const unreadCount = notifications.filter(n => n.status === "unread").length;
  const pendingRequestsCount = requests?.filter(r => r.status === "pending").length || 0;

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1 container mx-auto px-4 py-6 ">

      <Link to="/discovery" className="absolute flex items-center text-md text-gray hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> home        
        </Link>
        {/* Left Navigation */}
        <div className="w-64 mr-6 flex flex-col gap-3 mt-16">
          <Button variant={activeTab === "profile" ? "default" : "ghost"} className="justify-start" onClick={() => setActiveTab("profile")}>
            <User className="mr-2 h-4 w-4" /> My Profile
          </Button>

          <Button variant={activeTab === "requests" ? "default" : "ghost"} className="justify-start relative" onClick={() => setActiveTab("requests")}>
            <Briefcase className="mr-2 h-4 w-4" /> Service Requests
            {pendingRequestsCount > 0 && <Badge variant="destructive" className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2 text-xs">{pendingRequestsCount}</Badge>}
          </Button>

          <Button variant={activeTab === "notifications" ? "default" : "ghost"} className="justify-start relative" onClick={() => setActiveTab("notifications")}>
            <Bell className="mr-2 h-4 w-4" /> Notifications
            {unreadCount > 0 && <Badge variant="destructive" className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2 text-xs">{unreadCount}</Badge>}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "requests" && <ServiceRequestsContent />}
          {activeTab === "notifications" && <NotificationsContent />}
        </div>
      </div>
    </div>
  );
};

export default ProviderPortfolio;
