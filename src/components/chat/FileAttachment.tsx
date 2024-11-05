// src/components/chat/FileAttachment.tsx
"use client"

import React, { useState } from 'react';
import { File, Download, Paperclip, X } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const isImage = file.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isImage ? (
            <img
              src={previewUrl || ''}
              alt={file.name}
              className="h-10 w-10 object-cover rounded"
            />
          ) : (
            <File className="h-10 w-10 text-gray-400" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-sm text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

interface MessageInputProps {
  onSend: (content: string, file?: File) => void;
}

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    onSend(message, selectedFile || undefined);
    setMessage('');
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

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onRemove={() => {
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-600 rounded-full hover:bg-gray-100"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim() && !selectedFile}
        >
          Send
        </button>
      </div>
    </form>
  );
}