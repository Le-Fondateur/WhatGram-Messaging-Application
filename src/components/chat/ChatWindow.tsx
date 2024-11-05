"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Phone, Video, MoreVertical, MessageCircle, Check, CheckCheck, Paperclip, Lock } from 'lucide-react';
import { useMessages } from '@/context/MessagesContext';
import FileAttachment from './FileAttachment';
import Message from './Message';
import { useDecryptedMessages } from '@/hooks/useDecryptedMessages';

interface ChatWindowProps {
  selectedChat: {
    id: number;
    name: string;
    typing?: boolean;
    status?: 'online' | 'offline' | 'away';
    lastSeen?: string;
  } | null;
}

const SendButton = () => (
  <button 
    type="submit"
    className="p-2 bg-blue-500 text-white rounded-lg"
  >
    <MessageCircle className="h-5 w-5" />
  </button>
);

const MessageInput = ({ 
  onSend, 
  fileRef, 
  selectedFile, 
  onFileSelect, 
  onFileRemove 
}: { 
  onSend: (message: string) => void;
  fileRef: React.RefObject<HTMLInputElement>;
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    onSend(message);
    setMessage('');
  };

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="space-y-2">
        {selectedFile && (
          <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="text-sm truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={onFileRemove}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex items-center gap-4">
          <input
            type="file"
            ref={fileRef}
            onChange={onFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-600 rounded-lg"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SendButton />
        </div>
      </form>
    </div>
  );
};

const ChatHeader = ({ chat }: { chat: ChatWindowProps['selectedChat'] }) => {
  if (!chat) return null;
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      default: return 'Offline';
    }
  };

  return (
    <div className="p-4 border-b bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center relative">
            <User className="h-6 w-6 text-gray-600" />
            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(chat.status)}`} />
          </div>
          <div>
            <h2 className="font-semibold">{chat.name}</h2>
            <div className="flex items-center space-x-2 text-sm">
              <Lock className="h-3 w-3 text-green-500" />
              <span className="text-green-500">Encrypted</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">
                {getStatusText(chat.status)}
                {chat.status === 'offline' && chat.lastSeen && 
                  ` • Last seen ${chat.lastSeen}`
                }
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
  );
};

const ChatWindow = ({ selectedChat }: ChatWindowProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, chatKeys } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = useMemo(() => {
    return selectedChat ? (messages[selectedChat.id] || []) : [];
  }, [selectedChat, messages]);

  const currentChatKey = useMemo(() => {
    return selectedChat ? chatKeys[selectedChat.id] : undefined;
  }, [selectedChat, chatKeys]);

  const decryptedMessages = useDecryptedMessages(chatMessages, currentChatKey);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [decryptedMessages]);

  const handleSendMessage = (message: string) => {
    if (!selectedChat) return;
    sendMessage(selectedChat.id, message, selectedFile || undefined);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle className="h-16 w-16 mx-auto mb-4" />
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader chat={selectedChat} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {decryptedMessages.map((message) => (
          <Message
            key={message.id}
            id={message.id}
            chatId={message.chatId}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            status={message.status}
            attachment={message.attachment}
          />
        ))}
        {selectedChat.typing && (
          <div className="flex justify-start">
            <div className="bg-gray-200 rounded-lg p-3 max-w-xs">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSendMessage}
        fileRef={fileInputRef}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileRemove={() => {
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      />
    </div>
  );
};

export default ChatWindow;