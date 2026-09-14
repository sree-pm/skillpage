'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, DarkModeToggle, SkeletonText, EmptyState } from '@skillpage/ui';

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  budget_minor_units: number | null;
  status: string;
  created_at: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/jobs?status=open`)
      .then(r => r.json())
      .then(d => {
        setJobs(d.jobs || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load jobs. Please try again.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">SkillPage</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/explore" className="text-text-secondary hover:text-text-primary">Explore</Link>
            <Link href="/jobs" className="text-text-primary font-medium">Jobs</Link>
            <Link href="/talent" className="text-text-secondary hover:text-text-primary">Talent</Link>
          </nav>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Latest opportunities</h1>
          <Link href="/auth/start"><Button>Post a job</Button></Link>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card p-6">
                <SkeletonText lines={3} />
              </div>
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon="⚠️"
            title="Unable to load jobs"
            description={error}
            action={{ label: 'Try again', href: '/jobs' }}
          />
        ) : jobs.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No jobs yet"
            description="Be the first to post a job and find talented freelancers."
            action={{ label: 'Post a job', href: '/auth/start' }}
          />
        ) : (
          <div className="grid gap-4">
            {jobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {job.title}
                </h2>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex gap-4 text-xs text-text-muted">
                  <span className="px-2 py-1 bg-surface rounded">{job.job_type.replace('_', ' ')}</span>
                  {job.budget_minor_units && (
                    <span>• £{(job.budget_minor_units / 100).toFixed(2)}</span>
                  )}
                  <span>• {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
