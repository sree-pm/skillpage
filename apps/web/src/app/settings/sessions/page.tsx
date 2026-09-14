'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, SkeletonText, toast, DarkModeToggle } from '@skillpage/ui';

interface Session {
  id: string;
  device: string;
  ip: string;
  location: string;
  current: boolean;
  created_at: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/sessions`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(r => r.json())
      .then(d => {
        setSessions(d.sessions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleRevoke(id: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/sessions/${id}/revoke`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setSessions(prev => prev.filter(s => s.id !== id));
    toast.success('Session revoked');
  }

  async function handleRevokeAll() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/sessions/revoke-all`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setSessions(prev => prev.filter(s => s.current));
    toast.success('All other sessions revoked');
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/settings" className="text-sm text-text-secondary">← Back to settings</Link>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Active Sessions</h1>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonText key={i} lines={2} className="h-20" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-text-secondary">No active sessions</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {sessions.map(session => (
                <div key={session.id} className="card p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">💻</span>
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <span className="px-2 py-1 bg-success/10 text-success rounded text-xs">Current</span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted">
                      {session.location} • {session.ip}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      Started {new Date(session.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!session.current && (
                    <Button variant="secondary" size="sm" onClick={() => handleRevoke(session.id)}>
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="card p-6 bg-error/5 border-error/20">
              <h2 className="font-semibold mb-2 text-error">Security</h2>
              <p className="text-sm text-text-secondary mb-4">
                Revoke all other sessions if you think your account may be compromised.
              </p>
              <Button variant="secondary" onClick={handleRevokeAll}>
                Revoke All Other Sessions
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
