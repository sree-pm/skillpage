'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminTicketDetail() {
  const params = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/support/${params.id}`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setTicket(d.ticket); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  async function handleReply() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/support/${params.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ content: message }),
    });
    setMessage('');
    window.location.reload();
  }

  if (loading || !ticket) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4"><Link href="/admin/support" className="text-sm text-text-secondary">← Back to tickets</Link></div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{ticket.subject}</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="card p-6">
              <h2 className="font-semibold mb-3">Messages</h2>
              {ticket.messages?.map((m: any) => (
                <div key={m.id} className={`mb-4 p-3 rounded ${m.is_internal ? 'bg-warning/10' : 'bg-surface'}`}>
                  <p className="text-sm text-text-secondary mb-1">{m.is_internal ? 'Internal note' : 'Message'} • {new Date(m.created_at).toLocaleString()}</p>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h2 className="font-semibold mb-3">Reply</h2>
              <textarea value={message} onChange={e => setMessage(e.target.value)} className="input mb-3" rows={4} placeholder="Type your reply..." />
              <button onClick={handleReply} className="btn-primary">Send reply</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Ticket Details</h2>
              <p className="text-sm text-text-secondary">Status: {ticket.status}</p>
              <p className="text-sm text-text-secondary">Priority: {ticket.priority}</p>
              <p className="text-sm text-text-secondary">Created: {new Date(ticket.created_at).toLocaleString()}</p>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Actions</h2>
              <button className="btn-secondary w-full mb-2">Assign to me</button>
              <button className="btn-secondary w-full">Mark resolved</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
