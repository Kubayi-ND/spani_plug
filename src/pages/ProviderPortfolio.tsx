import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ProfileContent } from "./../components/Admin_User/portfolio/ProfileContent";
import { NotificationsContent, notificationsData } from "./../components/Admin_User/portfolio/NotificationContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Bell, ArrowLeft } from "lucide-react";

const ProviderPortfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications">("profile");

  const unreadCount = notificationsData.filter(n => n.unread).length;

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

          <Button variant={activeTab === "notifications" ? "default" : "ghost"} className="justify-start relative" onClick={() => setActiveTab("notifications")}>
            <Bell className="mr-2 h-4 w-4" /> Notifications
            {unreadCount > 0 && <Badge variant="destructive" className="absolute top-0 right-0 -translate-x-1/2 translate-y-1/2 text-xs">{unreadCount}</Badge>}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "notifications" && <NotificationsContent />}
        </div>
      </div>
    </div>
  );
};

export default ProviderPortfolio;
