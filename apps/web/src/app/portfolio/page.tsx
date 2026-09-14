'use client';

import { useEffect, useState } from 'react';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import type { PortfolioDocument } from '@skillpage/portfolio-core';

export default function PublicPortfolioPage() {
  const [document, setDocument] = useState<PortfolioDocument | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');

  useEffect(() => {
    const handle = new URLSearchParams(window.location.search).get('handle')?.trim().toLowerCase();
    if (!handle || !/^[a-z0-9-]{2,64}$/.test(handle)) { setState('missing'); return; }
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    fetch(`${base}/api/portfolio/public/${encodeURIComponent(handle)}`, { headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (response.status === 404) { setState('missing'); return; }
        if (!response.ok) throw new Error('Unable to load portfolio');
        const payload = await response.json() as { document?: PortfolioDocument };
        if (!payload.document) throw new Error('Portfolio document missing');
        setDocument(payload.document);
        setState('ready');
      })
      .catch(() => setState('error'));
  }, []);

  if (state === 'loading') return <main className="grid min-h-screen place-items-center bg-white text-sm text-black/45">Loading portfolio…</main>;
  if (state === 'missing') return <main className="grid min-h-screen place-items-center bg-white px-6 text-center"><div><h1 className="text-2xl font-semibold tracking-tight">Portfolio not found</h1><p className="mt-2 text-sm text-black/45">Use a published SkillPage handle in the format /portfolio?handle=name.</p></div></main>;
  if (state === 'error' || !document) return <main className="grid min-h-screen place-items-center bg-white px-6 text-center"><div><h1 className="text-2xl font-semibold tracking-tight">Portfolio unavailable</h1><p className="mt-2 text-sm text-black/45">The published portfolio could not be loaded. Please try again later.</p></div></main>;
  return <main className="min-h-screen bg-white"><PortfolioRenderer document={document} /></main>;
}
