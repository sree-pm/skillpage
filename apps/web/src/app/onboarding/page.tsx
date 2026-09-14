'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleIntent(intent: 'seller' | 'buyer') {
    setLoading(true);
    // TODO: Save intent to user profile
    localStorage.setItem('onboardingIntent', intent);
    router.push(intent === 'buyer' ? '/buyer/home' : '/seller/home');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="card w-full max-w-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to SkillPage!</h1>
        <p className="text-text-secondary mb-8 text-lg">How do you want to use SkillPage?</p>
        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => handleIntent('seller')} disabled={loading} className="card p-8 hover:shadow-md transition-shadow text-left">
            <div className="text-4xl mb-4">🎨</div>
            <h2 className="text-xl font-semibold mb-2">Find work</h2>
            <p className="text-text-secondary text-sm">Create your SkillPage, showcase your work, and get hired by buyers.</p>
          </button>
          <button onClick={() => handleIntent('buyer')} disabled={loading} className="card p-8 hover:shadow-md transition-shadow text-left">
            <div className="text-4xl mb-4">💼</div>
            <h2 className="text-xl font-semibold mb-2">Hire talent</h2>
            <p className="text-text-secondary text-sm">Post jobs, review proposals, and work with trusted freelancers.</p>
          </button>
        </div>
        <p className="mt-8 text-xs text-text-muted">You can switch between seller and buyer modes anytime.</p>
      </div>
    </div>
  );
}
