'use client';
import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'bg-background border border-border shadow-lg rounded-lg p-4',
          title: 'text-sm font-medium',
          description: 'text-xs text-text-secondary mt-1',
          success: 'border-success/50',
          error: 'border-error/50',
          loading: 'border-primary/50',
        },
      }}
    />
  );
}

export { toast } from 'sonner';
