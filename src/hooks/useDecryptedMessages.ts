// src/hooks/useDecryptedMessages.ts
import { useState, useEffect } from 'react';
import { decryptMessage } from '@/lib/crypto';

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

interface FileAttachment {
  url: string;
  type: string;
  name: string;
  size: number;
  iv?: Uint8Array;
  encrypted?: boolean;
}

export function useDecryptedMessages(
  messages: Message[],
  chatKey?: CryptoKey
): Message[] {
  const [decryptedMessages, setDecryptedMessages] = useState<Message[]>([]);

  useEffect(() => {
    let mounted = true;

    async function decryptMessages() {
      if (!chatKey) {
        if (mounted) setDecryptedMessages(messages);
        return;
      }

      try {
        const decrypted = await Promise.all(
          messages.map(async (message) => {
            if (!message.encrypted) return message;

            try {
              const decryptedContent = await decryptMessage(message.content, chatKey);
              return {
                ...message,
                content: decryptedContent,
                encrypted: false
              };
            } catch (error) {
              console.error('Failed to decrypt message:', error);
              return message;
            }
          })
        );

        if (mounted) {
          setDecryptedMessages(decrypted);
        }
      } catch (error) {
        console.error('Error decrypting messages:', error);
        if (mounted) {
          setDecryptedMessages(messages);
        }
      }
    }

    decryptMessages();

    return () => {
      mounted = false;
    };
  }, [messages, chatKey]);

  return decryptedMessages;
}