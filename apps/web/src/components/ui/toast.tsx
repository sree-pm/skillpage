'use client';
import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

const toastIcons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], title: string, message?: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`card p-4 shadow-lg min-w-[300px] border-l-4 ${
            toast.type === 'success' ? 'border-success bg-success/5' :
            toast.type === 'error' ? 'border-error bg-error/5' :
            toast.type === 'warning' ? 'border-warning bg-warning/5' : 'border-primary bg-primary/5'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="text-xl">{toastIcons[toast.type]}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{toast.title}</h4>
              {toast.message && <p className="text-text-secondary text-xs mt-1">{toast.message}</p>}
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-text-primary">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function toast() {
  // Global toast function (requires ToastProvider at app root)
  return {
    success: (title: string, message?: string) => console.log('Toast success:', title, message),
    error: (title: string, message?: string) => console.log('Toast error:', title, message),
    info: (title: string, message?: string) => console.log('Toast info:', title, message),
    warning: (title: string, message?: string) => console.log('Toast warning:', title, message),
  };
}
