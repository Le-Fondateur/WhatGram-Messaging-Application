"use client"

import React, { useState, useEffect } from 'react';
import { User, Search, MessageCircle, Phone, Video, MoreVertical, Paperclip, Check, Lock, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Types
interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status?: 'online' | 'offline' | 'away';
}

interface Message {
  id: number;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

// Demo data
const demoChats: Chat[] = [
  { id: 1, name: "Alice", lastMessage: "Hey there!", timestamp: "10:30 AM", unread: 2, status: 'online' },
  { id: 2, name: "Bob", lastMessage: "Meeting at 3?", timestamp: "9:15 AM", unread: 0, status: 'offline' },
];

const demoMessages: Record<number, Message[]> = {
  1: [
    { id: 1, content: "Hello! How are you?", sender: "me", timestamp: "10:30 AM", status: 'read' },
    { id: 2, content: "I'm doing great, thanks!", sender: "other", timestamp: "10:31 AM" },
  ],
  2: [
    { id: 3, content: "Meeting at 3?", sender: "other", timestamp: "9:15 AM" },
  ],
};

const ChatPageContent = () => {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(demoMessages);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Add effect to handle authentication state
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const selectedChatData = selectedChat ? demoChats.find(chat => chat.id === selectedChat) : null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      setIsDropdownOpen(false); // Close dropdown before logout

      // Call the logout function from auth context
      await logout();
      
      // Use replace instead of push to prevent back navigation
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const newMsg: Message = {
      id: Date.now(),
      content: newMessage.trim(),
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }));
    setNewMessage('');
  };

  // Show loading state if authentication is being checked
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
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
                  disabled={isLoggingOut}
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      {user?.avatar ? (
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
                    <div className="font-medium text-gray-700">{user?.name || 'Demo User'}</div>
                    <div className="text-xs text-gray-500">{user?.email || 'demo@example.com'}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'Demo User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'demo@example.com'}</p>
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
                      disabled={isLoggingOut}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Chat Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List Sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white">
          <div className="flex flex-col h-full">
            {/* Search */}
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
              {demoChats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      chat.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
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
              ))}
            </div>

            {/* New Chat Button */}
            <div className="p-4 border-t mt-auto">
              <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span>New Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {selectedChatData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-600" />
                      </div>
                      <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        selectedChatData.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div>
                      <h2 className="font-semibold">{selectedChatData.name}</h2>
                      <div className="flex items-center space-x-2 text-sm">
                        <Lock className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">Encrypted</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {selectedChatData.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-gray-600 cursor-pointer" />
                    <Video className="h-5 w-5 text-gray-600 cursor-pointer" />
                    <MoreVertical className="h-5 w-5 text-gray-600 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages[selectedChatData.id]?.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 max-w-xs ${
                      message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white shadow'
                    }`}>
                      <div>{message.content}</div>
                      <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span>{message.timestamp}</span>
                        {message.sender === 'me' && message.status && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 text-gray-500 hover:text-gray-600"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button>
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-lg hover:
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    <MessageCircle className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPageContent;