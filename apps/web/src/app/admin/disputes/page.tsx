'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Dispute { id: string; milestone_id: string; reason: string; status: string; created_at: string; }

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/disputes`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setDisputes(d.disputes || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">SkillPage Ops</h1>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin/dashboard" className="text-text-secondary">Dashboard</Link>
            <Link href="/admin/reviews" className="text-text-secondary">Reviews</Link>
            <Link href="/admin/disputes" className="text-text-primary font-medium">Disputes</Link>
            <Link href="/admin/support" className="text-text-secondary">Support</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Disputes Queue</h1>
        {loading ? <p className="text-text-secondary">Loading...</p> : disputes.length === 0 ? <p className="text-text-secondary">No open disputes.</p> : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left p-3">Milestone ID</th>
                  <th className="text-left p-3">Reason</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Opened</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map(d => (
                  <tr key={d.id} className="border-b border-border">
                    <td className="p-3 font-mono text-xs">{d.milestone_id.slice(0, 8)}...</td>
                    <td className="p-3">{d.reason}</td>
                    <td className="p-3"><span className="px-2 py-1 bg-warning/10 text-warning rounded text-xs">{d.status}</span></td>
                    <td className="p-3">{new Date(d.created_at).toLocaleDateString()}</td>
                    <td className="p-3"><button className="text-primary hover:underline">Assign</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
