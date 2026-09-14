'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, DarkModeToggle, toast } from '@skillpage/ui';
import { z } from 'zod';

const emailSchema = z.object({ email: z.string().email() });

export default function AuthStartPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData(e.currentTarget);
      const data = emailSchema.parse({ email: formData.get('email') });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to send OTP');
      localStorage.setItem('pendingEmail', data.email);
      toast.success('Code sent! Check your email.');
      router.push('/auth/verify');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-xl font-bold text-primary">SkillPage</Link>
          <DarkModeToggle />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sign in to SkillPage</h1>
        <p className="text-text-secondary mb-6 text-sm">Passwordless auth — we'll email you a 6-digit code.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input name="email" type="email" required placeholder="you@example.com" />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Continue with Email'}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-text-muted">
          By continuing, you agree to our{' '}
          <Link href="/legal/terms" className="text-primary hover:underline">Terms</Link> and{' '}
          <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
