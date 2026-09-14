'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, SkeletonText, MessageList, MessageInput, FileUpload, toast, DarkModeToggle } from '@skillpage/ui';

export default function ProjectWorkspace() {
  const params = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');

  useEffect(() => {
    // TODO: Fetch project details
    // For now, mock data
    setProject({ id: params.id, title: 'Sample Project', status: 'active' });
    setCurrentUserId('mock-user-id');
    setLoading(false);
  }, [params.id]);

  async function handleSendMessage(content: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ projectId: params.id, content }),
    });
  }

  async function handleFileUpload(file: File, progress: number) {
    // Get signed URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/api/uploads/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, contentType: file.type }),
    });
    const { uploadUrl, key } = await res.json();

    // Upload to R2
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    // TODO: Save to deliverables
    console.log('Uploaded:', key);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <header className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <Link href="/seller/projects" className="text-sm text-text-secondary">← Back to projects</Link>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <SkeletonText lines={2} className="mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <SkeletonText lines={5} className="h-64" />
              <SkeletonText lines={3} className="h-48" />
            </div>
            <div className="space-y-6">
              <SkeletonText lines={4} className="h-48" />
              <SkeletonText lines={3} className="h-32" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/seller/projects" className="text-sm text-text-secondary">← Back to projects</Link>
          <DarkModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project?.title}</h1>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">{project?.status}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Messages */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Messages</h2>
              <div className="h-96 overflow-y-auto mb-4">
                <MessageList projectId={params.id as string} currentUserId={currentUserId} />
              </div>
              <MessageInput projectId={params.id as string} onSend={handleSendMessage} />
            </div>

            {/* Files */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Files</h2>
              <FileUpload
                onUpload={handleFileUpload}
                accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                maxSize={25}
                multiple
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* Project Details */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Project Details</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-text-muted">Status</p>
                  <p className="font-medium">{project?.status}</p>
                </div>
                <div>
                  <p className="text-text-muted">Created</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Button variant="secondary" className="w-full">View Scope</Button>
                <Button variant="secondary" className="w-full">View Files</Button>
              </div>
            </div>

            {/* Actions */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Actions</h2>
              <div className="space-y-2">
                <Button className="w-full">Deliver Milestone</Button>
                <Button variant="secondary" className="w-full">Request Change</Button>
                <Button variant="ghost" className="w-full text-error">Open Dispute</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
