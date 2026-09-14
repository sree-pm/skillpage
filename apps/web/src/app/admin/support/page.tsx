'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Ticket { id: string; subject: string; status: string; priority: string; created_at: string; }

export default function AdminSupport() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/support?status=open`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setTickets(d.tickets || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">SkillPage Ops</h1>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin/dashboard" className="text-text-secondary">Dashboard</Link>
            <Link href="/admin/reviews" className="text-text-secondary">Reviews</Link>
            <Link href="/admin/disputes" className="text-text-secondary">Disputes</Link>
            <Link href="/admin/support" className="text-text-primary font-medium">Support</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
        {loading ? <p className="text-text-secondary">Loading...</p> : tickets.length === 0 ? <p className="text-text-secondary">No open tickets.</p> : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left p-3">Subject</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Priority</th>
                  <th className="text-left p-3">Opened</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map(t => (
                  <tr key={t.id} className="border-b border-border">
                    <td className="p-3">{t.subject}</td>
                    <td className="p-3"><span className="px-2 py-1 bg-surface rounded text-xs">{t.status}</span></td>
                    <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${t.priority === 'urgent' ? 'bg-error text-white' : 'bg-surface'}`}>{t.priority}</span></td>
                    <td className="p-3">{new Date(t.created_at).toLocaleDateString()}</td>
                    <td className="p-3"><Link href={`/admin/support/${t.id}`} className="text-primary hover:underline">View</Link></td>
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
