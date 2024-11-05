import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface MessageVerificationProps {
  messageId: number;
  chatId: number;
  content: string;
  onVerificationComplete?: (status: 'verified' | 'failed', proof?: string) => void;
}

export default function MessageVerification({ 
  messageId, 
  chatId, 
  content,
  onVerificationComplete 
}: MessageVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');
  const [blockchainProof, setBlockchainProof] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const verifyMessage = async () => {
      try {
        // Simulate blockchain verification delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Calculate message hash (in production, this would use actual blockchain data)
        const messageHash = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(content)
        );
        const hashArray = Array.from(new Uint8Array(messageHash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        setBlockchainProof(hashHex);
        setVerificationStatus('verified');
        onVerificationComplete?.('verified', hashHex);
      } catch (error) {
        console.error('Message verification failed:', error);
        setVerificationStatus('failed');
        onVerificationComplete?.('failed');
      }
    };

    verifyMessage();
  }, [messageId, content, onVerificationComplete]);

  return (
    <div className="inline-flex items-center gap-1">
      {verificationStatus === 'pending' && (
        <button 
          className="flex items-center text-gray-400" 
          title="Verification in progress"
        >
          <Clock className="h-4 w-4 animate-spin" />
        </button>
      )}
      
      {verificationStatus === 'verified' && (
        <div className="relative">
          <button
            className="flex items-center text-green-500"
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onClick={() => setTooltipVisible(!tooltipVisible)}
          >
            <Shield className="h-4 w-4" />
          </button>
          
          {tooltipVisible && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <div className="bg-white p-3 rounded-lg shadow-lg border text-xs w-64">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Message Verified</span>
                </div>
                <div className="space-y-1 text-gray-600">
                  <p className="font-medium">Blockchain Proof:</p>
                  <p className="font-mono text-[10px] break-all bg-gray-50 p-1 rounded">
                    {blockchainProof}
                  </p>
                  <p className="text-gray-400 mt-1">
                    Timestamp: {new Date().toISOString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {verificationStatus === 'failed' && (
        <button 
          className="flex items-center text-red-500" 
          title="Verification failed"
        >
          <ShieldAlert className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}