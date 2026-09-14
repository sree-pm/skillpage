'use client';
import Link from 'next/link';

export default function BuyerJobs() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background"><div className="container mx-auto px-4 py-4"><Link href="/buyer/home" className="text-sm text-text-secondary">← Back to dashboard</Link></div></header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your jobs</h1>
        <p className="text-text-secondary mb-6">No jobs posted yet.</p>
        <Link href="/buyer/jobs/new" className="btn-primary">Create your first job</Link>
      </main>
    </div>
  );
}
