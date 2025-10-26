import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select } from '../ui/select';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Filter, MoreVertical, Mail, Ban, CheckCircle, Edit, Eye, X } from 'lucide-react';
import { useAdminUsers } from '@/hooks/Admin/useAdminUsers';
import { useAdmin } from './AdminContext';

export function AdminUsers() {
  const { hasPermission } = useAdmin();
  const { data: adminUsersData, isLoading: usersLoading } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [userType, setUserType] = useState<'all' | 'provider' | 'customer'>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const allUsers = [
    ...(adminUsersData?.providers || []).map((p: any) => ({ ...p, type: 'provider' })),
    ...(adminUsersData?.customers || []).map((c: any) => ({ ...c, type: 'customer' }))
  ];

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = userType === 'all' || user.type === userType;
    return matchesSearch && matchesType;
  });

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-900">User Management</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={userType} onValueChange={(val) =>  setUserType(val as any)}>
            <option value="all">All Users</option>
            <option value="provider">Providers</option>
            <option value="customer">Customers</option>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-gray-900">{user.name}</p>
                      <p className="text-gray-600">{/*user.email ||*/ 'contact@email.com'}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.type === 'provider' ? 'default' : 'secondary'}>
                    {user.type}
                  </Badge>
                </TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>
                  {user.type === 'provider' && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-900">{/*user.rating*/}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  )}
                  {user.type === 'customer' && <span className="text-gray-400">N/A</span>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Active
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenActionMenu(openActionMenu === user.id ? null : user.id)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    {openActionMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              handleViewUser(user);
                              setOpenActionMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {hasPermission('editProfiles') && (
                            <button
                              onClick={() => setOpenActionMenu(null)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Profile
                            </button>
                          )}
                          {hasPermission('manageUsers') && (
                            <>
                              <button
                                onClick={() => setOpenActionMenu(null)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Mail className="w-4 h-4" />
                                Send Message
                              </button>
                              <button
                                onClick={() => setOpenActionMenu(null)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                              >
                                <Ban className="w-4 h-4" />
                                Suspend User
                              </button>
                            </>
                          )}
                          {user.type === 'provider' && hasPermission('verifyProvider') && (
                            <button
                              onClick={() => setOpenActionMenu(null)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Verify Provider
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* User Detail Panel - Simple slide-in instead of Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-gray-900">User Details</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedUser.photo}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email || 'contact@email.com'}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge>{selectedUser.type}</Badge>
                      {selectedUser.type === 'provider' && selectedUser.skill && (
                        <Badge variant="outline">{selectedUser.skill}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label>Location</Label>
                    <p className="text-gray-900 mt-1">{selectedUser.location}</p>
                  </div>
                  {selectedUser.type === 'provider' && (
                    <>
                      <div>
                        <Label>Rate</Label>
                        <p className="text-gray-900 mt-1">{selectedUser.rate}</p>
                      </div>
                      <div>
                        <Label>Rating</Label>
                        <p className="text-gray-900 mt-1">{selectedUser.rating} ★</p>
                      </div>
                      <div>
                        <Label>Reviews</Label>
                        <p className="text-gray-900 mt-1">{selectedUser.reviewCount || 0} reviews</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <Label>Activity Log</Label>
                  <div className="mt-2 space-y-2">
                    <p className="text-gray-600">Last login: 2 hours ago</p>
                    <p className="text-gray-600">Profile updated: 3 days ago</p>
                    <p className="text-gray-600">Account created: 45 days ago</p>
                  </div>
                </div>

                {hasPermission('manageUsers') && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}