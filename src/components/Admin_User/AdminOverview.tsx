import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminKPIs, useRecentActivity } from "@/hooks/Admin/useAdminDashboard";
import { Badge } from "@/components/ui/badge";

export const AdminOverview = () => {
  const { data: kpis, isLoading: kpisLoading } = useAdminKPIs();
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity();

  if (kpisLoading || activityLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpis?.map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.label}
              </CardTitle>
              <Badge variant={kpi.change > 0 ? "default" : "secondary"}>
                {kpi.changeLabel}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity?.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-500">
                      {activity.type === "signup"
                        ? `Signed up as ${activity.role}`
                        : activity.action}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};