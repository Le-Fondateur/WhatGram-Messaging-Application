"use client"

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
}