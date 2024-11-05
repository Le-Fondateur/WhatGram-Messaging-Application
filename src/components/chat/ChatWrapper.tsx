"use client"

import dynamic from 'next/dynamic';

const ClientSideChat = dynamic(() => import('./ClientSideChat'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function ChatWrapper() {
  return <ClientSideChat />;
}