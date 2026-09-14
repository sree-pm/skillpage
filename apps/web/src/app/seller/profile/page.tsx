'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SellerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>({ handle: '', display_name: '', headline: '', bio: '', is_published: 0 });
  const [loading, setLoading] = useState(false);
  useEffect(() => { /* TODO: Fetch profile */ }, []);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // TODO: PATCH /api/profiles/:id
    alert('Profile updated (stub)');
    setLoading(false);
  }
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background"><div className="container mx-auto px-4 py-4"><Link href="/seller/home" className="text-sm text-text-secondary">← Back to dashboard</Link></div></header>
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Edit your SkillPage</h1>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Handle</label>
            <input name="handle" defaultValue={profile.handle} className="input" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display name</label>
            <input name="displayName" defaultValue={profile.display_name} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input name="headline" defaultValue={profile.headline || ''} className="input" placeholder="What do you do?" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea name="bio" defaultValue={profile.bio || ''} className="input" rows={5} placeholder="Tell buyers about yourself" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save changes'}</button>
            <Link href={`/${profile.handle}`} target="_blank" className="btn-secondary">Preview public page</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
