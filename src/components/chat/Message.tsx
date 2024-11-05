// src/components/chat/Message.tsx
import React from 'react';
import { CheckCheck, Check } from 'lucide-react';
import FileAttachment from './FileAttachment';
import MessageVerification from './MessageVerification';

interface MessageProps {
  id: number;
  chatId: number;
  content: string;
  sender: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    url: string;
    type: string;
    name: string;
    size: number;
  };
}

export default function Message({
  id,
  chatId,
  content,
  sender,
  timestamp,
  status,
  attachment
}: MessageProps) {
  const isSentByMe = sender === 'me';

  return (
    <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
          isSentByMe 
            ? 'bg-blue-500 text-white' 
            : 'bg-white shadow'
        }`}
      >
        {/* Message Content */}
        <div>{content}</div>

        {/* File Attachment if present */}
        {attachment && (
          <FileAttachment attachment={attachment} />
        )}

        {/* Message Footer */}
        <div 
          className={`text-xs mt-1 flex items-center justify-end gap-1 ${
            isSentByMe ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <span>{timestamp}</span>
          
          {/* Message Status Indicators */}
          {isSentByMe && (
            <>
              {status === 'read' ? (
                <CheckCheck className="h-4 w-4" />
              ) : status === 'delivered' ? (
                <Check className="h-4 w-4" />
              ) : null}
            </>
          )}

          {/* Message Verification */}
          <MessageVerification
            messageId={id}
            chatId={chatId}
            content={content}
            onVerificationComplete={(status, proof) => {
              console.log(`Message ${id} verification ${status}`, proof);
              // You can add additional handling here if needed
            }}
          />
        </div>
      </div>
    </div>
  );
}