'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, DarkModeToggle, SkeletonText, ProfileMeter, toast } from '@skillpage/ui';

export default function SellerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Fetch profile from API
    setProfile({
      handle: 'demo-user',
      display_name: 'Demo User',
      headline: 'Full-stack developer',
      bio: 'Experienced developer with 5+ years...',
      is_published: 1,
    });
    setLoading(false);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    // TODO: PATCH /api/profiles/:id
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast.success('Profile updated successfully');
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/seller/home" className="text-sm text-text-secondary">← Back to dashboard</Link>
            <DarkModeToggle />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <SkeletonText lines={2} className="mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <SkeletonText lines={8} className="h-96" />
            </div>
            <div>
              <SkeletonText lines={6} className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/seller/home" className="text-sm text-text-secondary">← Back to dashboard</Link>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Edit your SkillPage</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Handle</label>
                <Input name="handle" defaultValue={profile.handle} readOnly className="bg-surface" />
                <p className="text-xs text-text-muted mt-1">Your public profile: skillpage.io/{profile.handle}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Display name</label>
                <Input name="displayName" defaultValue={profile.display_name} required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Headline</label>
                <Input name="headline" defaultValue={profile.headline || ''} placeholder="What do you do?" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  defaultValue={profile.bio || ''}
                  className="input"
                  rows={5}
                  placeholder="Tell buyers about yourself"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </Button>
                <Link href={`/${profile.handle}`} target="_blank">
                  <Button variant="secondary">Preview public page</Button>
                </Link>
              </div>
            </form>
          </div>

          <div>
            <ProfileMeter
              profile={{
                hasAvatar: false,
                hasHeadline: !!profile.headline,
                hasBio: !!profile.bio,
                hasPortfolio: false,
                hasServices: false,
                hasSkills: false,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
