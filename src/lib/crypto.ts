// src/lib/crypto.ts

// Generate a random encryption key for each chat
export async function generateChatKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // Export key to string format for storage
  export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }
  
  // Import key from string format
  export async function importKey(keyStr: string): Promise<CryptoKey> {
    const keyData = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      'AES-GCM',
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // Encrypt message content
  export async function encryptMessage(content: string, key: CryptoKey): Promise<string> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedContent = new TextEncoder().encode(content);
  
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encodedContent
    );
  
    // Combine IV and encrypted content
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);
  
    return btoa(String.fromCharCode(...combined));
  }
  
  // Decrypt message content
  export async function decryptMessage(encrypted: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const content = combined.slice(12);
  
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      content
    );
  
    return new TextDecoder().decode(decrypted);
  }
  
  // Encrypt file data
  export async function encryptFile(file: File, key: CryptoKey): Promise<{ encryptedBlob: Blob, iv: Uint8Array }> {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const fileData = await file.arrayBuffer();
  
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      fileData
    );
  
    return {
      encryptedBlob: new Blob([encryptedContent]),
      iv
    };
  }
  
  // Decrypt file data
  export async function decryptFile(
    encryptedBlob: Blob,
    iv: Uint8Array,
    key: CryptoKey
  ): Promise<Blob> {
    const encryptedData = await encryptedBlob.arrayBuffer();
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      encryptedData
    );
  
    return new Blob([decryptedContent]);
  }