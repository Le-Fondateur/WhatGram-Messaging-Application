"use client"

import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onLogout: () => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const Navbar = ({ onLogout, user }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await onLogout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">SecureChat</h1>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div className="hidden md:block text-sm text-left">
                  <div className="font-medium text-gray-700">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/settings');
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;