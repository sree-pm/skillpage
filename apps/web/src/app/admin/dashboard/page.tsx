'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ reviews: 0, disputes: 0, tickets: 0 });
  useEffect(() => {
    // TODO: Fetch real stats from /api/admin/*
    setStats({ reviews: 5, disputes: 2, tickets: 8 });
  }, []);
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">SkillPage Ops</h1>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin/dashboard" className="text-text-primary font-medium">Dashboard</Link>
            <Link href="/admin/reviews" className="text-text-secondary">Reviews</Link>
            <Link href="/admin/disputes" className="text-text-secondary">Disputes</Link>
            <Link href="/admin/support" className="text-text-secondary">Support</Link>
            <Link href="/admin/users" className="text-text-secondary">Users</Link>
            <Link href="/admin/audit-log" className="text-text-secondary">Audit Log</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Operations Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/reviews" className="card p-6 hover:shadow-md">
            <h2 className="text-2xl font-bold text-primary mb-2">{stats.reviews}</h2>
            <p className="text-text-secondary">Reviews pending approval</p>
          </Link>
          <Link href="/admin/disputes" className="card p-6 hover:shadow-md">
            <h2 className="text-2xl font-bold text-warning mb-2">{stats.disputes}</h2>
            <p className="text-text-secondary">Open disputes</p>
          </Link>
          <Link href="/admin/support" className="card p-6 hover:shadow-md">
            <h2 className="text-2xl font-bold text-error mb-2">{stats.tickets}</h2>
            <p className="text-text-secondary">Support tickets</p>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/admin/reviews?status=pending" className="block text-primary hover:underline">→ Review pending queue</Link>
              <Link href="/admin/disputes" className="block text-primary hover:underline">→ Assign disputes</Link>
              <Link href="/admin/support?status=open" className="block text-primary hover:underline">→ Open support tickets</Link>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Platform Health</h2>
            <p className="text-text-secondary text-sm">All systems operational</p>
          </div>
        </div>
      </main>
    </div>
  );
}
