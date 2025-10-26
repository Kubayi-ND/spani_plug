import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Download, TrendingUp, Users, Search, Phone } from 'lucide-react';
import { topSearchTerms, signupData, funnelData } from './mockdata/adminMockData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Analytics & Reports</h2>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(val) => setTimeRange(val)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="search">Search Analytics</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Daily Active Users</span>
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-900 mb-1">1,456</p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5%</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Total Searches</span>
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-gray-900 mb-1">3,421</p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+8.3%</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Contact Initiated</span>
                <Phone className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-900 mb-1">342</p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+15.2%</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Conversion Rate</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-gray-900 mb-1">10.0%</p>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+2.1%</span>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Signups Over Time</h3>
            <div className="space-y-3">
              {signupData.map((data, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-gray-600 w-24">{data.date}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-600">Providers</span>
                        <span className="text-gray-900">{data.providers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${(data.providers / 40) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600">Customers</span>
                        <span className="text-gray-900">{data.customers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-green-600 h-full rounded-full"
                          style={{ width: `${(data.customers / 80) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">User Growth Trends</h3>
            <div className="space-y-3">
              {signupData.map((data, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-gray-600 w-24">{data.date}</span>
                  <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-600">Providers</span>
                        <span className="text-gray-900">{data.providers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-8">
                        <div
                          className="bg-blue-600 h-full rounded"
                          style={{ width: `${(data.providers / 40) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600">Customers</span>
                        <span className="text-gray-900">{data.customers}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-8">
                        <div
                          className="bg-green-600 h-full rounded"
                          style={{ width: `${(data.customers / 80) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">User Type Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-gray-900">Providers</span>
                  </div>
                  <span className="text-gray-900">247 (12%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    <span className="text-gray-900">Customers</span>
                  </div>
                  <span className="text-gray-900">1823 (88%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div className="bg-green-600 h-full rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-gray-900 mb-4">Summary Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Total Users</span>
                  <span className="text-gray-900">2,070</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">New This Week</span>
                  <span className="text-gray-900">57</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Active (30d)</span>
                  <span className="text-gray-900">1,456 (70%)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Provider/Customer Ratio</span>
                  <span className="text-gray-900">1:7.4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Session Duration</span>
                  <span className="text-gray-900">4m 32s</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Top Search Terms</h3>
            <div className="space-y-3">
              {topSearchTerms.map((term, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-gray-600 w-24">{term.term}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded h-8 relative">
                      <div
                        className="bg-blue-600 h-full rounded flex items-center justify-end pr-2 text-white"
                        style={{ width: `${(term.count / 350) * 100}%` }}
                      >
                        {term.count}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Search Term Details</h3>
            <div className="space-y-3">
              {topSearchTerms.map((term, idx) => (
                <div key={idx} className="flex items-center justify-between pb-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-900 w-8">#{idx + 1}</span>
                    <span className="text-gray-900">{term.term}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{term.count} searches</span>
                    <div className={`flex items-center gap-1 ${term.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <TrendingUp className="w-4 h-4" />
                      <span>{term.trend > 0 ? '+' : ''}{term.trend}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">User Journey Funnel</h3>
            <div className="space-y-4">
              {funnelData.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-900">{stage.stage}</span>
                    <span className="text-gray-600">{stage.users} users ({stage.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full flex items-center justify-end pr-3 text-white transition-all"
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.percentage}%
                    </div>
                  </div>
                  {idx < funnelData.length - 1 && (
                    <p className="text-gray-600 mt-1">
                      Drop-off: {funnelData[idx].users - funnelData[idx + 1].users} users (
                      {((funnelData[idx].users - funnelData[idx + 1].users) / funnelData[idx].users * 100).toFixed(1)}%)
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h4 className="text-gray-900 mb-2">Overall Conversion</h4>
              <p className="text-gray-900 mb-1">11%</p>
              <p className="text-gray-600">Discovery → Booking</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-gray-900 mb-2">View Rate</h4>
              <p className="text-gray-900 mb-1">60%</p>
              <p className="text-gray-600">Discovery → View Provider</p>
            </Card>
            <Card className="p-6">
              <h4 className="text-gray-900 mb-2">Contact Rate</h4>
              <p className="text-gray-900 mb-1">39%</p>
              <p className="text-gray-600">View → Contact</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}