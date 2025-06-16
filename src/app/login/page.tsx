'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/auth';
import { BalloonAnimation } from '@/components/ui/balloon-animation';

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'signin',
            email,
            password,
          }),
        });

        const data = await response.json();
        console.log('Sign in response:', data);

        if (!response.ok) {
          setError(data.details || data.error || 'Failed to sign in');
          return;
        }

        if (data.user) {
          router.push('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Handle signup
        console.log('Attempting signup with:', { name, email, password });
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'signup',
            name,
            email,
            password,
          }),
        });

        const data = await response.json();
        console.log('Signup response:', data);

        if (!response.ok) {
          setError(data.details || data.error || 'Failed to create account');
          return;
        }

        if (data.user) {
          // Sign in the user after successful signup
          console.log('Signup successful, attempting to sign in...');
          const signInResponse = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'signin',
              email,
              password,
            }),
          });

          const signInData = await signInResponse.json();
          console.log('Sign in response:', signInData);

          if (!signInResponse.ok) {
            setError(signInData.details || signInData.error || 'Failed to sign in after signup');
            return;
          }

          if (signInData.user) {
            router.push('/dashboard');
          }
        } else {
          setError('Failed to create account');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F2F8] relative overflow-hidden">
      <BalloonAnimation />
      <div className="p-8 bg-white rounded-md shadow-md w-96 gap-4 relative z-20">
        <Image className='mb-4' src="/celebration-countdown-logo.png" alt="Logo" width={325} height={110} />

        {/* Toggle Switch */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-[#103242] p-1 bg-white">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isLogin
                ? 'bg-[#103242] text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isLogin
                ? 'bg-[#103242] text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {error && (
              <div className="text-[#ECA2AF] text-sm text-center">{error}</div>
            )}
          </div>
          {!isLogin && (
            <div className="mb-4">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="border-[#103242] focus:border-[#103242] focus:ring-[#103242] [&:-webkit-autofill]:!bg-[#1C5773] [&:-webkit-autofill]:!-webkit-text-fill-color-white [&:-webkit-autofill]:!shadow-[0_0_0_1000px_#1C5773_inset]"
              />
            </div>
          )}
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#103242] focus:border-[#103242] focus:ring-[#103242] [&:-webkit-autofill]:!bg-[#1C5773] [&:-webkit-autofill]:!-webkit-text-fill-color-white [&:-webkit-autofill]:!shadow-[0_0_0_1000px_#1C5773_inset]"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#103242] focus:border-[#103242] focus:ring-[#103242] [&:-webkit-autofill]:!bg-[#1C5773] [&:-webkit-autofill]:!-webkit-text-fill-color-white [&:-webkit-autofill]:!shadow-[0_0_0_1000px_#1C5773_inset]"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#103242] hover:bg-[#103242]/90 text-white"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        {isLogin && (
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-[#103242] hover:underline text-sm">
              Forgot your password?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 