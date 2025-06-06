import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, Bell, User, Plus, CheckCircle, Clock, AlertCircle, BarChart3, Users, FileText, Wallet, CreditCard } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    title: 'Study "Mobile App UX Survey" completed',
    message: '150 responses collected. View results now.',
    time: '2 hours ago',
    type: 'success',
    unread: true
  },
  {
    id: '2',
    title: 'New participant joined',
    message: 'Sarah Johnson has joined your participant pool.',
    time: '4 hours ago',
    type: 'info',
    unread: true
  },
  {
    id: '3',
    title: 'Study approval pending',
    message: 'Your study "Brand Perception" needs review.',
    time: '1 day ago',
    type: 'warning',
    unread: false
  }
];

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={16} />;
      case 'warning': return <AlertCircle className="text-orange-500" size={16} />;
      default: return <Clock className="text-blue-500" size={16} />;
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Research Platform
            </Link>
            
            <nav className="hidden md:flex items-center space-x-2">
              <Link 
                to="/" 
                className={`header-nav-link ${isActive('/') ? 'header-nav-link-active' : ''}`}
              >
                <BarChart3 size={16} />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/analytics" 
                className={`header-nav-link ${isActive('/analytics') ? 'header-nav-link-active' : ''}`}
              >
                <BarChart3 size={16} />
                <span>Analytics</span>
              </Link>
              <Link 
                to="/participants" 
                className={`header-nav-link ${isActive('/participants') ? 'header-nav-link-active' : ''}`}
              >
                <Users size={16} />
                <span>Participants</span>
              </Link>
              <Link 
                to="/payment-management" 
                className={`header-nav-link ${isActive('/payment-management') ? 'header-nav-link-active' : ''}`}
              >
                <CreditCard size={16} />
                <span>Payments</span>
              </Link>
              <Link 
                to="/wallet-dashboard" 
                className={`header-nav-link ${isActive('/wallet-dashboard') ? 'header-nav-link-active' : ''}`}
              >
                <Wallet size={16} />
                <span>Wallet Dashboard</span>
              </Link>
              <Link 
                to="/templates" 
                className={`header-nav-link ${isActive('/templates') ? 'header-nav-link-active' : ''}`}
              >
                <FileText size={16} />
                <span>Templates</span>
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search studies, participants..."
                className="search-input"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/create-study')}
              className="btn-primary"
            >
              <Plus size={18} />
              <span className="hidden sm:inline ml-2">New Research</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="notification-bell"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Mark all read
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${notification.unread ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 text-center border-t border-gray-100">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="avatar">
                <User size={16} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">John Researcher</p>
                <p className="text-xs text-gray-500">Premium Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        ></div>
      )}
    </header>
  );
}; 