'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const otpSchema = z.object({ email: z.string().email(), code: z.string().length(6) });

export default function AuthVerifyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const email = typeof window !== 'undefined' ? localStorage.getItem('pendingEmail') : null;

  useEffect(() => {
    if (!email) {
      router.push('/auth/start');
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [email, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData(e.currentTarget);
      const data = otpSchema.parse({ email, code: formData.get('code') });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to verify OTP');
      localStorage.setItem('token', json.token);
      localStorage.removeItem('pendingEmail');
      router.push(json.isNewUser ? '/onboarding' : '/seller/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend || !email) return;
    setCanResend(false);
    setCountdown(30);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Enter your code</h1>
        <p className="text-text-secondary mb-6 text-sm">We sent a 6-digit code to <strong>{email}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">6-digit code</label>
            <input ref={inputRef} name="code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required className="input text-center text-2xl tracking-widest" placeholder="000000" />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify & Continue'}</button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={handleResend} disabled={!canResend} className="text-primary text-sm hover:underline disabled:opacity-50">
            {canResend ? 'Resend code' : `Resend code in ${countdown}s`}
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-text-muted">Didn't receive the email? Check your spam folder.</p>
      </div>
    </div>
  );
}
