'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, DarkModeToggle, SkeletonText, EmptyState, Input } from '@skillpage/ui';

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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/jobs?status=open`)
      .then(r => r.json())
      .then(d => {
        setJobs(d.jobs || []);
        setFilteredJobs(d.jobs || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load jobs. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (jobType) {
      filtered = filtered.filter(job => job.job_type === jobType);
    }

    setFilteredJobs(filtered);
  }, [search, jobType, jobs]);

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

        {/* Filters */}
        <div className="card p-4 mb-6 flex gap-4 flex-wrap">
          <Input
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
          <select
            value={jobType}
            onChange={e => setJobType(e.target.value)}
            className="input w-[200px]"
          >
            <option value="">All types</option>
            <option value="project">Project</option>
            <option value="part_time">Part-time</option>
            <option value="full_time">Full-time</option>
            <option value="consultation">Consultation</option>
          </select>
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
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No jobs found"
            description={search || jobType ? 'Try adjusting your search or filters' : 'Be the first to post a job!'}
            action={!search && !jobType ? { label: 'Post a job', href: '/auth/start' } : undefined}
          />
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {job.title}
                </h2>
                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex gap-4 text-xs text-text-muted flex-wrap">
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
