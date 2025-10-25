import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Star, AlertTriangle, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Providers", value: "247", change: "+12 this week", trending: "up" },
    { label: "Total Customers", value: "1823", change: "+45 this week", trending: "up" },
    { label: "MAU (30d)", value: "1456", change: "+8.5% vs last month", trending: "up" },
    { label: "New Signups (7d)", value: "57", change: "-3 vs last week", trending: "down" },
    { label: "Average Rating", value: "4.6", change: "+0.2 this month", trending: "up" },
    { label: "Open Moderation", value: "8", change: "-5 from yesterday", trending: "down" },
  ];

  const recentActivity = [
    { name: "Thabo Mokoena", role: "provider", action: "signed up", time: "2 minutes ago" },
    { name: "Sarah van der Merwe", role: "customer", action: "left a review", time: "15 minutes ago" },
    { name: "Zanele Dlamini", role: "provider", action: "updated profile", time: "1 hour ago" },
    { name: "Johan Botha", role: "customer", action: "signed up", time: "2 hours ago" },
    { name: "Nomvula Khumalo", role: "provider", action: "submitted verification docs", time: "3 hours ago" },
  ];

  const systemAlerts = [
    { message: "8 items pending moderation", severity: "warning", action: "Requires attention" },
    { message: "Storage at 78% capacity", severity: "warning", action: "Consider cleanup" },
    { message: "System running smoothly", severity: "success", action: "No critical issues" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <Badge variant="outline" className="text-sm">
            Admin User
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold mb-2 text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1">
                  {stat.trending === "up" ? (
                    <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span
                    className={`text-sm ${
                      stat.trending === "up" ? "text-[hsl(var(--success))]" : "text-destructive"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {activity.name}{" "}
                          <Badge variant="secondary" className="ml-2">
                            {activity.role}
                          </Badge>
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    {alert.severity === "warning" ? (
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--secondary))] flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
