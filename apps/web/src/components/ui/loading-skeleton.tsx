'use client';

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-surface rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <LoadingSkeleton className="h-6 w-3/4" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-5/6" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-24" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-border">
        <LoadingSkeleton className="h-6 w-1/3" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 border-b border-border last:border-0">
          <LoadingSkeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <LoadingSkeleton className="h-10 w-1/2" />
      <div className="grid md:grid-cols-3 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
