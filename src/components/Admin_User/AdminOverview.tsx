import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';
import { TrendingUp, TrendingDown, Users, Star, Clock, AlertTriangle, UserPlus, MessageSquare, FileCheck } from 'lucide-react';
import { adminKPIs, recentActivity } from './mockdata/adminMockData';

export function AdminOverview() {
  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'signup':
        return <UserPlus className="w-4 h-4" />;
      case 'review':
        return <MessageSquare className="w-4 h-4" />;
      case 'profile_update':
        return <Users className="w-4 h-4" />;
      case 'verification':
        return <FileCheck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminKPIs.map((kpi, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-gray-900 mb-2">{kpi.value}</p>
                <div className="flex items-center gap-2">
                  {getChangeIcon(kpi.change)}
                  <span className={kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {kpi.changeLabel}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="mt-1 text-gray-400">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    {activity.user}
                    {activity.action && <span className="text-gray-600"> {activity.action}</span>}
                  </p>
                  {activity.role && (
                    <Badge variant="secondary" className="mt-1">
                      {activity.role}
                    </Badge>
                  )}
                </div>
                <span className="text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <div className="ml-2">
                <p className="text-gray-900">8 items pending moderation</p>
                <p className="text-gray-600">Requires attention</p>
              </div>
            </Alert>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <div className="ml-2">
                <p className="text-gray-900">Storage at 78% capacity</p>
                <p className="text-gray-600">Consider cleanup</p>
              </div>
            </Alert>
            <Alert>
              <Star className="h-4 w-4" />
              <div className="ml-2">
                <p className="text-gray-900">System running smoothly</p>
                <p className="text-gray-600">No critical issues</p>
              </div>
            </Alert>
          </div>
        </Card>
      </div>
    </div>
  );
}