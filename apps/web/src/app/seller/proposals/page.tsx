'use client';
import Link from 'next/link';

export default function SellerProposals() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background"><div className="container mx-auto px-4 py-4"><Link href="/seller/home" className="text-sm text-text-secondary">← Back to dashboard</Link></div></header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your proposals</h1>
        <p className="text-text-secondary">No proposals yet. <Link href="/seller/discover" className="text-primary">Browse jobs</Link></p>
      </main>
    </div>
  );
}
