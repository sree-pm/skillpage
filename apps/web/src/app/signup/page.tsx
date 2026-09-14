'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const signupSchema = z.object({ email: z.string().email(), password: z.string().min(8), displayName: z.string().min(2), handle: z.string().min(3).regex(/^[a-z0-9-]+$/) });

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') || 'seller';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData(e.currentTarget);
      const data = signupSchema.parse({ email: formData.get('email'), password: formData.get('password'), displayName: formData.get('displayName'), handle: formData.get('handle') });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to signup');
      localStorage.setItem('token', json.token);
      router.push(intent === 'buyer' ? '/buyer/home' : '/seller/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Create your SkillPage</h1>
        <p className="text-text-secondary mb-6 text-sm">Join {intent === 'buyer' ? 'as a buyer' : 'as a seller'} — you can switch roles anytime.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input name="email" type="email" required className="input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input name="password" type="password" required className="input" placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display name</label>
            <input name="displayName" type="text" required className="input" placeholder="Your name or company" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Handle</label>
            <input name="handle" type="text" required className="input" placeholder="yourname" pattern="[a-z0-9-]+" />
            <p className="text-xs text-text-muted mt-1">Your public profile: skillpage.io/yourname</p>
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-text-secondary">Already have an account? <Link href="/login" className="text-primary">Sign in</Link></p>
      </div>
    </div>
  );
}
