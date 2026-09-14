'use client';
import Link from 'next/link';

export default function BuyerHome() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">SkillPage</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/buyer/home" className="text-text-primary font-medium">Home</Link>
            <Link href="/buyer/jobs" className="text-text-secondary hover:text-text-primary">Jobs</Link>
            <Link href="/buyer/projects" className="text-text-secondary hover:text-text-primary">Projects</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Buyer dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Post a job</h2>
            <p className="text-text-secondary text-sm mb-4">Create a clear, hireable brief</p>
            <Link href="/buyer/jobs/new" className="btn-primary text-sm">Create job</Link>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Active jobs</h2>
            <p className="text-text-secondary text-sm mb-4">Review proposals</p>
            <Link href="/buyer/jobs" className="btn-secondary text-sm">View jobs</Link>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Active projects</h2>
            <p className="text-text-secondary text-sm mb-4">Manage ongoing work</p>
            <Link href="/buyer/projects" className="btn-secondary text-sm">View projects</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
