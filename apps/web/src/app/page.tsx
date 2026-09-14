'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, DarkModeToggle, SkeletonText } from '@skillpage/ui';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">SkillPage</Link>
          <nav className="hidden md:flex gap-6 text-sm">
            <Link href="/explore" className="text-text-secondary hover:text-text-primary">Explore</Link>
            <Link href="/jobs" className="text-text-secondary hover:text-text-primary">Jobs</Link>
            <Link href="/talent" className="text-text-secondary hover:text-text-primary">Talent</Link>
            <Link href="/how-it-works" className="text-text-secondary hover:text-text-primary">How it works</Link>
            <Link href="/trust" className="text-text-secondary hover:text-text-primary">Trust</Link>
          </nav>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link href="/auth/start"><Button variant="secondary">Sign in</Button></Link>
            <Link href="/auth/start"><Button>Create account</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          {loading ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <SkeletonText lines={2} className="h-12" />
              <SkeletonText lines={2} className="h-6" />
              <div className="flex gap-4 justify-center mt-8">
                <SkeletonText className="h-12 w-48" />
                <SkeletonText className="h-12 w-48" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Your skills deserve more than a marketplace profile.
              </h1>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Build your SkillPage. Find trusted work. Keep 100% of your price.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/start?intent=seller">
                  <Button size="lg" className="px-8 py-3 text-lg">Create your free SkillPage</Button>
                </Link>
                <Link href="/auth/start?intent=buyer">
                  <Button variant="secondary" size="lg" className="px-8 py-3 text-lg">Hire trusted talent</Button>
                </Link>
              </div>
              <div className="mt-12 flex gap-8 justify-center text-sm text-text-secondary">
                <span>✓ Free profiles and job posting</span>
                <span>✓ Clear processor fees</span>
                <span>✓ Funded work protection</span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {['1️⃣', '2️⃣', '3️⃣', '4️⃣'].map((icon, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-semibold mb-2">
                  {['Create profile', 'Agree scope', 'Fund work', 'Ship & get paid'][i]}
                </h3>
                <p className="text-text-secondary text-sm">
                  {[
                    'Build your public SkillPage with proof of work',
                    'Define deliverables, timeline, and milestones',
                    'Buyer funds milestone — payment is secured',
                    'Deliver work, buyer approves, funds released',
                  ][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Transparent pricing</h2>
          <div className="max-w-2xl mx-auto card p-8 text-center hover:shadow-lg transition-shadow">
            <p className="text-5xl font-bold text-primary mb-4"> £0</p>
            <p className="text-xl text-text-secondary mb-6">Platform fee — always free</p>
            <p className="text-sm text-text-muted">
              You only pay payment processor charges (typically 1.4% + £0.20 for UK cards). No hidden marketplace commissions.
            </p>
            <Link href="/fees" className="mt-6 inline-block text-primary text-sm font-medium hover:underline">
              See fee examples →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link href="/explore" className="hover:text-text-primary">Explore</Link></li>
                <li><Link href="/jobs" className="hover:text-text-primary">Jobs</Link></li>
                <li><Link href="/talent" className="hover:text-text-primary">Talent</Link></li>
                <li><Link href="/pricing" className="hover:text-text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Trust</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link href="/trust" className="hover:text-text-primary">Trust centre</Link></li>
                <li><Link href="/fees" className="hover:text-text-primary">Transparent fees</Link></li>
                <li><Link href="/legal/disputes" className="hover:text-text-primary">Dispute policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link href="/resources" className="hover:text-text-primary">Guides</Link></li>
                <li><Link href="/help" className="hover:text-text-primary">Help centre</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-text-secondary">
                <li><Link href="/legal/terms" className="hover:text-text-primary">Terms</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-text-primary">Privacy</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-text-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-12 text-center text-text-muted text-xs">
            © {new Date().getFullYear()} SkillPage. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
