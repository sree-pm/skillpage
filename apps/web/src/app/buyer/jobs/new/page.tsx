'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BuyerJobsNew() {
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // TODO: POST /api/jobs
    alert('Job created (stub)');
    router.push('/buyer/jobs');
  }
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background"><div className="container mx-auto px-4 py-4"><Link href="/buyer/jobs" className="text-sm text-text-secondary">← Back to jobs</Link></div></header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create a job</h1>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job title</label>
            <input name="title" className="input" required placeholder="e.g., Build an AI-enabled research workflow" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" className="input" rows={6} required placeholder="Describe the work, outcomes, and requirements" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job type</label>
              <select name="jobType" className="input" required>
                <option value="project">Project</option>
                <option value="part_time">Part-time</option>
                <option value="full_time">Full-time</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Budget (£)</label>
              <input name="budget" type="number" className="input" placeholder="1000" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary">Publish job</button>
            <Link href="/buyer/jobs" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
