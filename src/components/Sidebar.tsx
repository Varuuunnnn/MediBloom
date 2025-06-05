import React from 'react';
import { Activity, Calendar, FileText, Home, PlusCircle, Users, Bell, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentPage }) => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', id: 'dashboard' },
    { icon: Activity, label: 'Health Metrics', id: 'health-metrics' },
    { icon: Calendar, label: 'Appointments', id: 'appointments' },
    { icon: FileText, label: 'Documents', id: 'documents' },
    { icon: Users, label: 'Caregivers', id: 'caregivers' },
    { icon: Bell, label: 'Notifications', id: 'notifications' }
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
          <Activity className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <div className="ml-2">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">MediBloom</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your Virtual Nurse</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <button className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-primary-600 dark:bg-primary-500 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Health Record
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;