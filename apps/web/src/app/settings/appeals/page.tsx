'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, DarkModeToggle, toast } from '@skillpage/ui';

export default function AppealsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    targetType: 'review' as 'review' | 'dispute' | 'ban',
    targetId: '',
    reason: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/appeals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(formData),
      });
      toast.success('Appeal submitted successfully');
      setFormData({ targetType: 'review', targetId: '', reason: '' });
    } catch (err: any) {
      toast.error(`Failed to submit appeal: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
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
        <h1 className="text-3xl font-bold mb-6">Submit an Appeal</h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">What are you appealing?</label>
            <select
              value={formData.targetType}
              onChange={e => setFormData({ ...formData, targetType: e.target.value as any })}
              className="input"
            >
              <option value="review">Review</option>
              <option value="dispute">Dispute Decision</option>
              <option value="ban">Account Ban</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target ID</label>
            <Input
              value={formData.targetId}
              onChange={e => setFormData({ ...formData, targetId: e.target.value })}
              placeholder="e.g., review-id or dispute-id"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              value={formData.reason}
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
              className="input"
              rows={6}
              placeholder="Explain why you're appealing this decision..."
              required
              minLength={20}
            />
            <p className="text-xs text-text-muted mt-1">Minimum 20 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Evidence URLs (optional)</label>
            <Input placeholder="https://..." />
            <p className="text-xs text-text-muted mt-1">Add URLs to supporting evidence</p>
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Appeal'}
          </Button>
        </form>
      </main>
    </div>
  );
}
