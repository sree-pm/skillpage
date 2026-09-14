'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Review { id: string; project_title: string; reviewer_email: string; rating: number; created_at: string; moderation_status: string; }

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/admin/reviews?status=pending`, {
      headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` },
    }).then(r => r.json()).then(d => { setReviews(d.reviews || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">SkillPage Ops</h1>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin/dashboard" className="text-text-secondary">Dashboard</Link>
            <Link href="/admin/reviews" className="text-text-primary font-medium">Reviews</Link>
            <Link href="/admin/disputes" className="text-text-secondary">Disputes</Link>
            <Link href="/admin/support" className="text-text-secondary">Support</Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reviews Queue</h1>
        {loading ? <p className="text-text-secondary">Loading...</p> : reviews.length === 0 ? <p className="text-text-secondary">No pending reviews.</p> : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left p-3">Project</th>
                  <th className="text-left p-3">Reviewer</th>
                  <th className="text-left p-3">Rating</th>
                  <th className="text-left p-3">Submitted</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id} className="border-b border-border">
                    <td className="p-3">{review.project_title}</td>
                    <td className="p-3">{review.reviewer_email}</td>
                    <td className="p-3">{'⭐'.repeat(review.rating)}</td>
                    <td className="p-3">{new Date(review.created_at).toLocaleDateString()}</td>
                    <td className="p-3"><Link href={`/admin/reviews/${review.id}`} className="text-primary hover:underline">Review</Link></td>
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
