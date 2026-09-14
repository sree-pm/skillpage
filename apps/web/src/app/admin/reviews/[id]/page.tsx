'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminReviewDetail() {
  const params = useParams();
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<'approve' | 'reject' | 'redact' | null>(null);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/reviews/${params.id}`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setReview(d.review); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  async function handleAction() {
    if (!action) return;
    const endpoint = `/api/admin/reviews/${params.id}/${action}`;
    const body = action === 'reject' ? { reason } : action === 'redact' ? { notes: reason } : {};
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(body),
    });
    router.push('/admin/reviews');
  }

  if (loading || !review) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4"><Link href="/admin/reviews" className="text-sm text-text-secondary">← Back to reviews</Link></div>
      </header>
      <main className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Review for {review.project_title}</h1>
          <div className="card p-6 mb-4">
            <h2 className="font-semibold mb-3">Video Review</h2>
            <video controls className="w-full rounded mb-3" src={review.media_url} />
            <p className="text-sm text-text-secondary">Duration: {review.duration_seconds}s | Rating: {'⭐'.repeat(review.rating)}</p>
          </div>
          {review.comment && (
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Summary</h2>
              <p className="text-text-secondary">{review.comment}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Moderation Actions</h2>
            <div className="space-y-3">
              <button onClick={() => { setAction('approve'); handleAction(); }} className="btn-primary w-full">Approve & Publish</button>
              <button onClick={() => setAction('reject')} className="btn-secondary w-full">Reject</button>
              <button onClick={() => setAction('redact')} className="btn-secondary w-full">Redact</button>
            </div>
            {(action === 'reject' || action === 'redact') && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">{action === 'reject' ? 'Rejection reason' : 'Redaction notes'}</label>
                <input value={reason} onChange={e => setReason(e.target.value)} className="input" placeholder="e.g., PII detected" />
                <button onClick={handleAction} className="btn-primary w-full mt-3">Confirm {action}</button>
              </div>
            )}
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Metadata</h2>
            <p className="text-sm text-text-secondary">Submitted: {new Date(review.created_at).toLocaleString()}</p>
            <p className="text-sm text-text-secondary">Status: {review.moderation_status}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
