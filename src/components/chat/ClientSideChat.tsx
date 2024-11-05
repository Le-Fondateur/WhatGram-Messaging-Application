"use client"

import React from 'react';
import { MessagesProvider } from '@/context/MessagesContext';
import ChatPageContent from './ChatPageContent';

const ClientSideChat = () => {
  return (
    <MessagesProvider>
      <ChatPageContent />
    </MessagesProvider>
  );
};

export default ClientSideChat;