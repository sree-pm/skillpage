'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Log { id: number; action: string; target_type: string; target_id: string; created_at: string; }

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/audit-log`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setLogs(d.logs || []); setLoading(false); }).catch(() => setLoading(false));
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
            <Link href="/admin/support" className="text-text-secondary">Support</Link>
            <Link href="/admin/users" className="text-text-secondary">Users</Link>
            <Link href="/admin/audit-log" className="text-text-primary font-medium">Audit Log</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Audit Log</h1>
        {loading ? <p className="text-text-secondary">Loading...</p> : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Target</th>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b border-border">
                    <td className="p-3 font-mono text-xs">{log.action}</td>
                    <td className="p-3">{log.target_type}</td>
                    <td className="p-3 font-mono text-xs">{log.target_id.slice(0, 8)}...</td>
                    <td className="p-3">{new Date(log.created_at).toLocaleString()}</td>
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
