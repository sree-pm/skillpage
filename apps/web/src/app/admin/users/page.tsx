'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User { id: string; email: string; role: string; is_banned: number; created_at: string; }

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/users`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setUsers(d.users || []); setLoading(false); }).catch(() => setLoading(false));
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
            <Link href="/admin/users" className="text-text-primary font-medium">Users</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Users Directory</h1>
        {loading ? <p className="text-text-secondary">Loading...</p> : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-border">
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.is_banned ? <span className="text-error">Banned</span> : <span className="text-success">Active</span>}</td>
                    <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
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
