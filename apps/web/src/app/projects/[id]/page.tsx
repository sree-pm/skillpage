'use client';
import Link from 'next/link';

export default function ProjectWorkspace() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background"><div className="container mx-auto px-4 py-4"><Link href="/seller/projects" className="text-sm text-text-secondary">← Back to projects</Link></div></header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Project workspace</h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold mb-3">Milestones</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between"><span>Milestone 1</span><span className="text-success">Funded</span></li>
                <li className="flex justify-between"><span>Milestone 2</span><span className="text-text-muted">Pending</span></li>
              </ul>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold mb-3">Messages</h2>
              <div className="h-48 bg-surface rounded mb-3"></div>
              <input className="input" placeholder="Type a message..." />
            </div>
          </div>
          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Project details</h2>
              <p className="text-text-secondary text-sm">Scope, agreement, files</p>
            </div>
            <div className="card p-6">
              <h2 className="font-semibold mb-2">Actions</h2>
              <button className="btn-primary w-full mb-2">Deliver milestone</button>
              <button className="btn-secondary w-full">Request change</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
