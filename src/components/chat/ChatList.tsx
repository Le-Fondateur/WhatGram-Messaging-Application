'use client';

import React from 'react';
import { User, Search, MessageCircle } from 'lucide-react';
import { useMessages } from '@/context/MessagesContext';
import { useAuth } from '@/context/AuthContext';

interface ChatListProps {
  selectedChat: number | null;
  onSelectChat: (id: number) => void;
}

export default function ChatList({ selectedChat, onSelectChat }: ChatListProps) {
  const { chats, markAsRead } = useMessages();
  const { user } = useAuth();

  const handleSelectChat = (chatId: number) => {
    onSelectChat(chatId);
    markAsRead(chatId);
  };

  return (
    <div className="w-80 flex flex-col h-full border-r bg-white">
      {/* User Profile Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">{user?.name || 'Demo User'}</h2>
            <p className="text-sm text-gray-500">{user?.email || 'demo@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          chats.map(chat => (
            <div 
              key={chat.id}
              className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-8 w-8 mb-2" />
            <p>No chats yet</p>
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t">
        <button
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>
    </div>
  );
}