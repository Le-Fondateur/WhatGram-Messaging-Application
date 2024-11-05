"use client"

import React, { useState } from 'react';
import { User, Settings, LogOut, Moon, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, updateStatus } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const statusOptions = [
    { label: 'Online', value: 'online', color: 'bg-green-500' },
    { label: 'Away', value: 'away', color: 'bg-yellow-500' },
    { label: 'Offline', value: 'offline', color: 'bg-gray-500' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-gray-600" />
            )}
          </div>
          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
            statusOptions.find(s => s.value === user?.status)?.color || 'bg-gray-500'
          }`} />
        </div>
        <div className="text-left hidden sm:block">
          <div className="font-medium text-gray-700">{user?.name}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">SET STATUS</p>
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => {
                  updateStatus(status.value as 'online' | 'offline' | 'away');
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-2 py-1 rounded hover:bg-gray-50"
              >
                <div className={`h-2 w-2 rounded-full ${status.color}`} />
                <span className="text-sm text-gray-700">{status.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              // Add settings navigation here
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              // Add theme toggle functionality here
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Moon className="h-4 w-4" />
            <span>Dark mode</span>
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
  );
}