"use client"

import React, { useState } from 'react';
import ChatList from '@/components/chat/ChatList';

const TestChatList = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  
  // Test data
  const testChats = [
    { id: 1, name: "Alice", lastMessage: "Hey there!", timestamp: "10:30 AM", unread: 2 },
    { id: 2, name: "Bob", lastMessage: "Meeting at 3?", timestamp: "9:15 AM", unread: 0 },
    { id: 3, name: "Charlie", lastMessage: "Got the files", timestamp: "Yesterday", unread: 5 },
  ];

  return (
    <div className="h-screen bg-gray-100">
      <h1 className="p-4 text-xl">Testing ChatList Component</h1>
      <div className="flex">
        <ChatList 
          chats={testChats}
          selectedChat={selectedChat}
          onSelectChat={(id) => {
            setSelectedChat(id);
            console.log('Selected chat:', id);
          }}
        />
      </div>
    </div>
  );
};

export default TestChatList;