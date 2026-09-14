'use client';
import Link from 'next/link';

export default function SellerDiscover() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background"><div className="container mx-auto px-4 py-4"><Link href="/seller/home" className="text-sm text-text-secondary">← Back to dashboard</Link></div></header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Discover jobs</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {['Job 1', 'Job 2', 'Job 3'].map((title, i) => (
            <Link key={i} href={`/jobs/${i}`} className="card p-6 hover:shadow-md">
              <h2 className="font-semibold mb-2">{title}</h2>
              <p className="text-text-secondary text-sm">Sample job description...</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
