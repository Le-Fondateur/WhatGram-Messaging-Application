"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateChatKey, exportKey, importKey, encryptMessage, decryptMessage, encryptFile, decryptFile } from '@/lib/crypto';

interface FileAttachment {
  url: string;
  type: string;
  name: string;
  size: number;
  iv?: Uint8Array;
  encrypted?: boolean;
}

interface Message {
  id: number;
  chatId: number;
  content: string;
  sender: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: FileAttachment;
  encrypted?: boolean;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  typing?: boolean;
  status?: 'online' | 'away' | 'offline'; // Add this line
}

interface MessagesContextType {
    chats: Chat[];
    messages: Record<number, Message[]>;
    chatKeys: Record<number, CryptoKey>;  // Add this line
    sendMessage: (chatId: number, content: string, attachment?: File) => Promise<void>;
    markAsRead: (chatId: number) => void;
    setTypingStatus: (chatId: number, isTyping: boolean) => void;
  }

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

const defaultData = {
  chats: [
    { id: 1, name: "Alice", lastMessage: "Hey there!", timestamp: "10:30 AM", unread: 2 },
    { id: 2, name: "Bob", lastMessage: "Meeting at 3?", timestamp: "9:15 AM", unread: 0 },
  ],
  messages: {
    1: [
      { id: 1, chatId: 1, content: "Hello! How are you?", sender: "me", timestamp: "10:30 AM", status: 'read' },
      { id: 2, chatId: 1, content: "I'm doing great, thanks! How about you?", sender: "other", timestamp: "10:31 AM", status: 'read' },
    ],
    2: [
      { id: 3, chatId: 2, content: "Meeting at 3?", sender: "other", timestamp: "9:15 AM", status: 'read' },
    ],
  }
};

const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});

const handleTyping = (chatId: number, isTyping: boolean) => {
  setTypingUsers(prev => ({...prev, [chatId]: isTyping}));
};

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [chats, setChats] = useState<Chat[]>(defaultData.chats);
  const [messages, setMessages] = useState<Record<number, Message[]>>(defaultData.messages);
  const [chatKeys, setChatKeys] = useState<Record<number, CryptoKey>>({});

  // Define setTypingStatus first since it's used in sendMessage
  const setTypingStatus = useCallback((chatId: number, isTyping: boolean) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, typing: isTyping } : chat
      )
    );
  }, []);

  // Initialize encryption keys
  useEffect(() => {
    const initializeKeys = async () => {
      if (typeof window === 'undefined') return;

      try {
        const storedKeys = localStorage.getItem('chatKeys');
        const keys: Record<number, CryptoKey> = {};

        for (const chat of chats) {
          if (storedKeys) {
            const keyData = JSON.parse(storedKeys);
            if (keyData[chat.id]) {
              keys[chat.id] = await importKey(keyData[chat.id]);
              continue;
            }
          }
          keys[chat.id] = await generateChatKey();
        }

        // Store keys
        const exportedKeys: Record<string, string> = {};
        for (const [id, key] of Object.entries(keys)) {
          exportedKeys[id] = await exportKey(key);
        }
        localStorage.setItem('chatKeys', JSON.stringify(exportedKeys));

        setChatKeys(keys);
      } catch (error) {
        console.error('Error initializing encryption keys:', error);
      }
    };

    if (!initialized) {
      initializeKeys();
    }
  }, [initialized, chats]);

  // Load data from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedChats = localStorage.getItem('chats');
        const savedMessages = localStorage.getItem('messages');

        if (savedChats) {
          setChats(JSON.parse(savedChats));
        }
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
        setInitialized(true);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setInitialized(true);
    }
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    if (!initialized) return;

    try {
      localStorage.setItem('chats', JSON.stringify(chats));
      localStorage.setItem('messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [chats, messages, initialized]);

  const sendMessage = useCallback(async (chatId: number, content: string, file?: File) => {
    const key = chatKeys[chatId];
    if (!key) {
      console.error('No encryption key found for chat:', chatId);
      return;
    }

    let attachment: FileAttachment | undefined;
    let encryptedContent: string;

    try {
      encryptedContent = await encryptMessage(content, key);

      if (file) {
        const { encryptedBlob, iv } = await encryptFile(file, key);
        const encryptedUrl = URL.createObjectURL(encryptedBlob);
        attachment = {
          url: encryptedUrl,
          type: file.type,
          name: file.name,
          size: file.size,
          iv,
          encrypted: true
        };
      }

      const newMessage: Message = {
        id: Date.now(),
        chatId,
        content: encryptedContent,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        attachment,
        encrypted: true
      };

      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));

      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId
            ? { 
                ...chat, 
                lastMessage: attachment ? `Sent ${attachment.name}` : content,
                timestamp: newMessage.timestamp 
              }
            : chat
        )
      );

      // Simulate message delivery
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [chatId]: prev[chatId].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          ),
        }));
      }, 1000);

      // Simulate typing and response
      setTimeout(() => {
        setTypingStatus(chatId, true);
        
        setTimeout(async () => {
          setTypingStatus(chatId, false);
          const response = `Reply to: ${content}`;
          const encryptedResponse = await encryptMessage(response, key);
          
          const responseMessage: Message = {
            id: Date.now(),
            chatId,
            content: encryptedResponse,
            sender: "other",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'delivered',
            encrypted: true
          };

          setMessages(prev => ({
            ...prev,
            [chatId]: [...prev[chatId], responseMessage],
          }));

          setChats(prev =>
            prev.map(chat =>
              chat.id === chatId
                ? { ...chat, lastMessage: response, timestamp: responseMessage.timestamp, unread: chat.unread + 1 }
                : chat
            )
          );
        }, 2000);
      }, 1500);

    } catch (error) {
      console.error('Error sending encrypted message:', error);
    }
  }, [chatKeys, setTypingStatus]);


  const markAsRead = useCallback((chatId: number) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );

    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId]?.map(msg => ({
        ...msg,
        status: msg.sender === 'other' ? 'read' : msg.status
      })) || []
    }));
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <MessagesContext.Provider value={{ 
      chats, 
      messages, 
      chatKeys,  // Add this line
      sendMessage, 
      markAsRead, 
      setTypingStatus 
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}