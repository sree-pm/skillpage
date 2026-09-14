'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SellerHome() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    // TODO: Fetch current user profile from /api/users/me
    setProfile({ displayName: 'Demo User', handle: 'demo' });
  }, []);
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">SkillPage</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/seller/home" className="text-text-primary font-medium">Home</Link>
            <Link href="/seller/discover" className="text-text-secondary hover:text-text-primary">Discover</Link>
            <Link href="/seller/proposals" className="text-text-secondary hover:text-text-primary">Proposals</Link>
            <Link href="/seller/projects" className="text-text-secondary hover:text-text-primary">Projects</Link>
            <Link href="/seller/profile" className="text-text-secondary hover:text-text-primary">Profile</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back, {profile.displayName}</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Profile readiness</h2>
            <p className="text-text-secondary text-sm mb-4">Your public SkillPage is {profile.is_published ? 'published' : 'unpublished'}.</p>
            <Link href={`/seller/profile`} className="btn-primary text-sm">Edit profile</Link>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Recommended jobs</h2>
            <p className="text-text-secondary text-sm mb-4">Jobs matching your skills</p>
            <Link href="/seller/discover" className="btn-secondary text-sm">Browse jobs</Link>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Active projects</h2>
            <p className="text-text-secondary text-sm mb-4">Ongoing work</p>
            <Link href="/seller/projects" className="btn-secondary text-sm">View projects</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
