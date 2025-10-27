import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Globe, 
  Image as ImageIcon,
  BarChart3, 
  Settings, 
  FileText,
  Menu,
  X,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AdminOverview } from '../components/Admin_User/AdminOverview';
import { AdminUsers } from '../components/Admin_User/AdminUsers';
import { AdminReviews } from '../components/Admin_User/AdminReview';
import { AdminMedia } from '../components/Admin_User/AdminMedia';
import { AdminAnalytics } from '../components/Admin_User/AdminAnalytics';

import { AdminAuditLog } from '../components/Admin_User/AdminAuditLog';
import { useAdmin } from '../components/Admin_User/AdminContext';

type AdminSection = 
  | 'overview'
  | 'users'
  | 'providers'
  | 'reviews'
  | 'media'
  | 'analytics'
  | 'settings'
  | 'audit';

interface AdminDashboardProps {
  onBackToMarketplace?: () => void;
}

function  AdminDashboard({ onBackToMarketplace }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { currentAdmin, hasPermission } = useAdmin();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, permission: null },
    { id: 'users', label: 'Users', icon: Users, permission: 'manageUsers' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, permission: 'moderateReviews', badge: 2 },
    
    { id: 'media', label: 'Media', icon: ImageIcon, permission: 'moderateMedia', badge: 1 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'viewAnalytics' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'editSystemSettings' },
    { id: 'audit', label: 'Audit Logs', icon: FileText, permission: 'viewLogs' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUsers />;
      case 'reviews':
        return <AdminReviews />;
      case 'media':
        return <AdminMedia />;
      case 'analytics':
        return <AdminAnalytics />;
      // case 'settings':
      //   return <AdminSettings />;
      case 'audit':
        return <AdminAuditLog />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="text-right">
              <p className="text-gray-900">{currentAdmin?.name}</p>
              <p className="text-gray-600">{currentAdmin?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            
              {/* <Button variant="outline" size="sm" onClick={onBackToMarketplace}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button> */}
            
           
            <Button variant="ghost" size="sm" className='flex flex-col'>
              Logout
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:static lg:translate-x-0 inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out`}
          style={{ top: '57px' }}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const canAccess = !item.permission || hasPermission(item.permission as any);
              
              if (!canAccess) return null;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as AdminSection);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="destructive">{item.badge}</Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8" style={{ marginTop: '0px' }}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}


export default AdminDashboard;