'use client';
import Link from 'next/link';
import { DarkModeToggle } from '@skillpage/ui';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/seller/home" className="text-sm text-text-secondary">← Back to dashboard</Link>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="card divide-y">
          <Link href="/settings/sessions" className="block p-4 hover:bg-surface transition-colors">
            <h3 className="font-medium">Active Sessions</h3>
            <p className="text-sm text-text-secondary">Manage your logged-in devices</p>
          </Link>

          <Link href="/settings/appeals" className="block p-4 hover:bg-surface transition-colors">
            <h3 className="font-medium">Appeals</h3>
            <p className="text-sm text-text-secondary">Submit an appeal for reviews, disputes, or bans</p>
          </Link>

          <Link href="/seller/profile" className="block p-4 hover:bg-surface transition-colors">
            <h3 className="font-medium">Profile</h3>
            <p className="text-sm text-text-secondary">Edit your public SkillPage</p>
          </Link>

          <div className="p-4">
            <h3 className="font-medium mb-2">Notifications</h3>
            <p className="text-sm text-text-secondary mb-2">Email notifications are enabled</p>
            <button className="text-primary text-sm hover:underline">Manage preferences</button>
          </div>
        </div>
      </main>
    </div>
  );
}
