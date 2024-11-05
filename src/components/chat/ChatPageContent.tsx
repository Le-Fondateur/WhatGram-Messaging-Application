"use client"

import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { useMessages } from '@/context/MessagesContext';

const ChatPageContent = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const { chats } = useMessages();

  const selectedChatData = selectedChat 
    ? chats.find(chat => chat.id === selectedChat)
    : null;

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList 
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      <ChatWindow 
        selectedChat={selectedChatData}
      />
    </div>
  );
};

export default ChatPageContent;