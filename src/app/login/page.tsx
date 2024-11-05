// src/app/login/page.tsx
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Mail, Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'demo@example.com' && password === 'password') {
        const userData = {
          email,
          name: 'Demo User',
          status: 'online',
          id: '1',
          avatar: '/placeholder-avatar.jpg'
        };

        // Store user data
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = 'user=authenticated; path=/';
        
        window.location.href = '/chat'; // Using window.location instead of router.push
      } else {
        setError('Invalid credentials. Use demo@example.com / password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-2xl shadow-lg">
              <MessageCircle size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500">Enter your credentials to access your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-center text-sm font-medium text-gray-700 mb-2">Demo Credentials</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="flex justify-between">
                <span>Email:</span>
                <code className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded">demo@example.com</code>
              </p>
              <p className="flex justify-between">
                <span>Password:</span>
                <code className="text-gray-800 bg-gray-100 px-2 py-0.5 rounded">password</code>
              </p>
            </div>
          </div>

          {/* Social Login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
              <Image src="/google.svg" alt="Google" width={20} height={20} />
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
              <Image src="/github.svg" alt="GitHub" width={20} height={20} />
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
              <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}