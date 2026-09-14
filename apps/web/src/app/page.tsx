import Link from 'next/link';

export default function Home() {
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
          <div className="flex gap-3">
            <Link href="/login" className="btn-secondary">Sign in</Link>
            <Link href="/signup" className="btn-primary">Create account</Link>
          </div>
        </div>
      </header>

      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Your skills deserve more than a marketplace profile.</h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">Build your SkillPage. Find trusted work. Keep 100% of your price.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup?intent=seller" className="btn-primary text-lg px-8 py-3">Create your free SkillPage</Link>
            <Link href="/signup?intent=buyer" className="btn-secondary text-lg px-8 py-3">Hire trusted talent</Link>
          </div>
          <div className="mt-12 flex gap-8 justify-center text-sm text-text-secondary">
            <span>✓ Free profiles and job posting</span>
            <span>✓ Clear processor fees</span>
            <span>✓ Funded work protection</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="font-semibold mb-2">Create profile</h3>
              <p className="text-text-secondary text-sm">Build your public SkillPage with proof of work</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="font-semibold mb-2">Agree scope</h3>
              <p className="text-text-secondary text-sm">Define deliverables, timeline, and milestones</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="font-semibold mb-2">Fund work</h3>
              <p className="text-text-secondary text-sm">Buyer funds milestone — payment is secured</p>
            </div>
            <div className="card p-6 text-center">
              <div className="text-4xl mb-4">4️⃣</div>
              <h3 className="font-semibold mb-2">Ship & get paid</h3>
              <p className="text-text-secondary text-sm">Deliver work, buyer approves, funds released</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Transparent pricing</h2>
          <div className="max-w-2xl mx-auto card p-8 text-center">
            <p className="text-5xl font-bold text-primary mb-4">£0</p>
            <p className="text-xl text-text-secondary mb-6">Platform fee — always free</p>
            <p className="text-sm text-text-muted">You only pay payment processor charges (typically 1.4% + £0.20 for UK cards). No hidden marketplace commissions.</p>
            <Link href="/fees" className="mt-6 inline-block text-primary text-sm font-medium">See fee examples →</Link>
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
          <p className="mt-12 text-center text-text-muted text-xs">© {new Date().getFullYear()} SkillPage. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
