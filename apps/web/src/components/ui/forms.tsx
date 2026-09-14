'use client';
import { forwardRef, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}>(({ className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-surface/80 focus:ring-primary',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error',
    ghost: 'bg-transparent text-text-primary hover:bg-surface focus:ring-primary',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin mr-2">⏳</span>}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  hint?: string;
}>(({ className = '', error, label, hint, id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full px-3 py-2 border rounded-md bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 ${
          error ? 'border-error focus:ring-error' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-text-muted text-xs mt-1">{hint}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, InputHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label?: string;
  hint?: string;
}>(({ className = '', error, label, hint, id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full px-3 py-2 border rounded-md bg-background text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 ${
          error ? 'border-error focus:ring-error' : 'border-border'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-text-muted text-xs mt-1">{hint}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, InputHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}>(({ className = '', error, label, options, id, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`w-full px-3 py-2 border rounded-md bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 ${
          error ? 'border-error focus:ring-error' : 'border-border'
        } ${className}`}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
});
Select.displayName = 'Select';
