import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-1">
            <button className="lg:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <Menu className="h-6 w-6" />
            </button>
            <div className="max-w-2xl w-full lg:max-w-xs ml-4">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="search"
                  placeholder="Search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm placeholder-gray-500 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-400 ring-2 ring-white dark:ring-gray-800"></span>
              <Bell className="h-6 w-6" />
            </button>
            <button className="flex-shrink-0 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
                alt="User profile"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;