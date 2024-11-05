<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

=======
# 🔐 WhatGram - End-to-End Encrypted Messaging Platform

[![Maintenance](https://img.shields.io/badge/Maintained-Active-green.svg)](https://shields.io/)
[![Documentation](https://img.shields.io/badge/Documentation-Comprehensive-blue.svg)](https://shields.io/)

WhatGram is a modern, secure, and user-friendly messaging application built with Next.js, React, and blockchain technology. It combines the intuitive interface of popular messaging apps with state-of-the-art encryption and blockchain-based message verification.

## ✨ Features

### Security & Privacy
- 🔒 End-to-end encryption using AES-GCM
- 🌐 Blockchain-based message verification
- 📜 Zero-knowledge proof for message delivery
- ⏱️ Self-destructing messages option
- 🔑 Secure key management system

### User Experience
- 💬 Real-time messaging with typing indicators
- 📎 Secure file sharing with encryption
- 🔍 Message search functionality
- 👤 User presence indicators
- ✅ Read receipts and message status
- 🎯 Message reactions

### Technical Features
- ⚡ Built with Next.js for optimal performance
- 🎨 Tailwind CSS for modern styling
- 🔗 Blockchain integration for message verification
- 🛡️ TypeScript for type safety
- 📱 Responsive design for all devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or similar Web3 wallet (for blockchain features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Le-Fondateur/WhatGram-Messaging-Application.git
cd WhatGram-Messaging-Application
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Run the development server:
>>>>>>> 8fac299f83a9edf0898fcb9af179851d91b88d0d
```bash
npm run dev
# or
yarn dev
<<<<<<< HEAD
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Frontend
- **Next.js**: For server-side rendering and routing
- **React**: UI components and state management
- **TailwindCSS**: Utility-first CSS framework
- **Lucide Icons**: Modern icon set

### Security
- **AES-GCM**: For end-to-end encryption
- **Web Crypto API**: For cryptographic operations
- **Blockchain**: For message verification and proof of delivery

### State Management
- **React Context**: For global state management
- **Custom Hooks**: For reusable logic
- **Local Storage**: For persistent data

## 📁 Project Structure

```
src/
├── app/                  # Next.js app directory
├── components/          # React components
│   ├── auth/           # Authentication components
│   └── chat/           # Chat interface components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── crypto.ts       # Encryption utilities
│   └── web3.ts         # Blockchain utilities
└── types/              # TypeScript type definitions
```

## 🔒 Security Features

### End-to-End Encryption
- Messages are encrypted using AES-GCM
- Each chat has a unique encryption key
- Keys are never transmitted in plaintext

### Blockchain Integration
- Message hashes stored on blockchain
- Proof of delivery using smart contracts
- Immutable message history

## 🤝 Contributing

Please feel free to provide contributions which can improve this application!

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Lucide Icons](https://lucide.dev/) - For beautiful icons
- [Web3.js](https://web3js.org/) - For blockchain integration
>>>>>>> 8fac299f83a9edf0898fcb9af179851d91b88d0d
