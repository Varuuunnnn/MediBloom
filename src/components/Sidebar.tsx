import React from 'react';
import { Activity, Calendar, FileText, Home, PlusCircle, Settings, Users, Bell, LogOut } from 'lucide-react';
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
    { icon: Bell, label: 'Notifications', action: () => console.log('Notifications clicked') },
    { icon: Settings, label: 'Settings', action: () => console.log('Settings clicked') },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <Activity className="h-8 w-8 text-primary-600" />
          <div className="ml-2">
            <span className="text-xl font-semibold text-gray-900">MediBloom</span>
            <p className="text-xs text-gray-500">Your Virtual Nurse</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors duration-200"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200 space-y-2">
            <button className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors duration-200">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Health Record
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;