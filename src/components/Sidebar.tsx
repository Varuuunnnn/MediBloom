import React from 'react';
import { Activity, Calendar, FileText, Home, PlusCircle, Users, Bell, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', action: () => console.log('Dashboard clicked') },
    { icon: Activity, label: 'Health Metrics', action: () => console.log('Health Metrics clicked') },
    { icon: Calendar, label: 'Appointments', action: () => console.log('Appointments clicked') },
    { icon: FileText, label: 'Documents', action: () => console.log('Documents clicked') },
    { icon: Users, label: 'Caregivers', action: () => console.log('Caregivers clicked') },
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications clicked') }
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
                key={item.label}
                onClick={item.action}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
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