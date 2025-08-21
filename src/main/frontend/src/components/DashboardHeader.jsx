import React from 'react';
import { Search, ChevronDown, Mail, Bell } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left section - Date */}
        <div className="text-gray-600 text-sm font-medium">
          Monday, January 20, 2020
        </div>

        {/* Center section - Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-gray-50"
            />
          </div>
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Right section - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          {/* Mail notification */}
          <div className="relative">
            <Mail className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </div>

          {/* Bell notification */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              7
            </span>
          </div>

          {/* User profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">RC</span>
            </div>
            <span className="text-gray-700 text-sm font-medium">Dr. Roland Collins</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;