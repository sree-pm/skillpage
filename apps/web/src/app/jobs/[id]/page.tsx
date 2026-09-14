'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Job { id: string; title: string; description: string; job_type: string; budget_minor_units: number | null; budget_currency: string; duration_days: number | null; status: string; }

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/jobs/${params.id}`).then(r => r.json()).then(d => { setJob(d.job || null); setLoading(false); }).catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!job) return <div className="min-h-screen flex items-center justify-center">Job not found</div>;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/jobs" className="text-sm text-text-secondary hover:text-text-primary">← Back to jobs</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <div className="flex gap-4 text-sm text-text-secondary">
            <span>{job.job_type.replace('_', ' ')}</span>
            {job.budget_minor_units && <span>• {job.budget_currency} {(job.budget_minor_units / 100).toFixed(2)}</span>}
            {job.duration_days && <span>• {job.duration_days} days</span>}
            <span>• Status: {job.status}</span>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-3">Description</h2>
            <p className="text-text-secondary whitespace-pre-wrap">{job.description}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-6">
            <h2 className="font-semibold mb-4">Apply for this job</h2>
            <p className="text-sm text-text-secondary mb-4">Sign in to submit a proposal</p>
            <button onClick={() => router.push('/login')} className="btn-primary w-full">Sign in to apply</button>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold mb-2">Transparent fees</h2>
            <p className="text-sm text-text-secondary">Platform fee £0. You only pay payment processor charges.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
