'use client';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; href: string };
  icon?: string;
}

export function EmptyState({ title, description, action, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="card p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-text-secondary mb-6">{description}</p>
      {action && (
        <Link href={action.href} className="btn-primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function JobsEmptyState() {
  return (
    <EmptyState
      title="No jobs posted yet"
      description="Create your first job to start receiving proposals from talented freelancers."
      action={{ label: 'Create job', href: '/buyer/jobs/new' }}
      icon="💼"
    />
  );
}

export function ProposalsEmptyState() {
  return (
    <EmptyState
      title="No proposals yet"
      description="Browse available jobs and submit your first proposal to start earning."
      action={{ label: 'Browse jobs', href: '/seller/discover' }}
      icon="📝"
    />
  );
}

export function ProjectsEmptyState() {
  return (
    <EmptyState
      title="No active projects"
      description="Projects will appear here once you start working with a client or freelancer."
      action={{ label: 'Find work', href: '/seller/discover' }}
      icon="🚀"
    />
  );
}

export function NotificationsEmptyState() {
  return (
    <EmptyState
      title="No notifications"
      description="You're all caught up! Check back later for updates."
      icon="🔔"
    />
  );
}
