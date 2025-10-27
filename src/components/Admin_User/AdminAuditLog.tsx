import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, Shield, User, Settings as SettingsIcon, FileText } from 'lucide-react';
import { auditLogs } from './mockdata/adminMockData';

export function AdminAuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.context.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.adminName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('Suspended') || action.includes('Banned')) {
      return <Shield className="w-4 h-4 text-red-600" />;
    } else if (action.includes('Verified') || action.includes('Approved')) {
      return <Shield className="w-4 h-4 text-green-600" />;
    } else if (action.includes('Updated settings')) {
      return <SettingsIcon className="w-4 h-4 text-blue-600" />;
    } else {
      return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    if (action.includes('Suspended') || action.includes('Banned')) {
      return <Badge variant="destructive">Critical</Badge>;
    } else if (action.includes('Verified') || action.includes('Approved')) {
      return <Badge variant="default">Approval</Badge>;
    } else if (action.includes('Updated settings')) {
      return <Badge variant="secondary">System</Badge>;
    } else {
      return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">Audit Logs & Security</h2>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search audit logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={actionFilter} onValueChange={(val) => setActionFilter(val)}>
            <option value="all">All Actions</option>
            <option value="Suspended">Suspensions</option>
            <option value="Verified">Verifications</option>
            <option value="Approved">Approvals</option>
            <option value="Updated">Updates</option>
          </Select>
        </div>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Context</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div>
                    <p className="text-gray-900">{new Date(log.timestamp).toLocaleDateString()}</p>
                    <p className="text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{log.adminName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getActionIcon(log.action)}
                    <span className="text-gray-900">{log.action}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-gray-900">{log.context}</p>
                  {log.reason && (
                    <p className="text-gray-600">Reason: {log.reason}</p>
                  )}
                </TableCell>
                <TableCell>
                  {getActionBadge(log.action)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">Security Summary</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Actions (24h)</span>
              <span className="text-gray-900">47</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Critical Actions</span>
              <span className="text-gray-900">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Admins</span>
              <span className="text-gray-900">4</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-green-600" />
            <h3 className="text-gray-900">Login History</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Successful Logins (24h)</span>
              <span className="text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Failed Attempts</span>
              <span className="text-gray-900">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Suspicious IPs Blocked</span>
              <span className="text-gray-900">0</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <SettingsIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">System Changes</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Settings Updated (7d)</span>
              <span className="text-gray-900">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-900">2h ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">System Health</span>
              <Badge variant="default">Good</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}