'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DEFAULT_SECTIONS,
  PORTFOLIO_THEMES,
  createStarterPortfolio,
  type PortfolioDocument,
  type PortfolioThemeId,
  type SectionNode,
} from '@skillpage/portfolio-core';

const themeAccent: Record<PortfolioThemeId, string> = {
  minimal: '#171717',
  editorial: '#6b4f3a',
  studio: '#2457ff',
  professional: '#1f3a5f',
  bold: '#8a2be2',
};

function moveSection(sections: SectionNode[], index: number, direction: -1 | 1) {
  const next = index + direction;
  if (next < 0 || next >= sections.length) return sections;
  const copy = [...sections];
  [copy[index], copy[next]] = [copy[next], copy[index]];
  return copy;
}

export default function PortfolioStudio() {
  const [document, setDocument] = useState<PortfolioDocument>(() => createStarterPortfolio());
  const [activePanel, setActivePanel] = useState<'content' | 'design' | 'sections'>('content');
  const [saved, setSaved] = useState(false);

  const visibleSections = useMemo(
    () => document.sections.filter((section) => section.visible),
    [document.sections],
  );

  function updateProfile(field: 'name' | 'headline' | 'bio', value: string) {
    setSaved(false);
    setDocument((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }));
  }

  function selectTheme(theme: PortfolioThemeId) {
    setSaved(false);
    setDocument((current) => ({ ...current, theme, settings: { ...current.settings, accent: themeAccent[theme] } }));
  }

  function toggleSection(id: string) {
    setSaved(false);
    setDocument((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section,
      ),
    }));
  }

  function reorder(id: string, direction: -1 | 1) {
    setSaved(false);
    setDocument((current) => {
      const index = current.sections.findIndex((section) => section.id === id);
      return { ...current, sections: moveSection(current.sections, index, direction) };
    });
  }

  function saveDraft() {
    localStorage.setItem('skillpage:portfolio:draft', JSON.stringify(document));
    setSaved(true);
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f3f3f1]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[17px] font-semibold tracking-[-0.03em]">SkillPage</Link>
            <span className="h-4 w-px bg-black/15" />
            <span className="text-sm text-black/50">Portfolio Studio</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-black/45 sm:block">{saved ? 'Saved locally' : 'Unsaved changes'}</span>
            <button onClick={saveDraft} className="rounded-full bg-[#171717] px-4 py-2 text-sm font-medium text-white hover:bg-black/85">Save draft</button>
            <button className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-medium hover:bg-black/[0.03]">Publish</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)_320px]">
        <aside className="border-b border-black/10 bg-white lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
          <div className="flex border-b border-black/10 p-2">
            {(['content', 'design', 'sections'] as const).map((panel) => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize ${activePanel === panel ? 'bg-[#171717] text-white' : 'text-black/50 hover:bg-black/[0.04]'}`}
              >
                {panel}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activePanel === 'content' && (
              <div className="space-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">Your introduction</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Make the first impression count.</h2>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-black/55">Name</span>
                  <input value={document.profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2.5 text-sm outline-none focus:border-black/30" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-black/55">Headline</span>
                  <input value={document.profile.headline} onChange={(e) => updateProfile('headline', e.target.value)} className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2.5 text-sm outline-none focus:border-black/30" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-black/55">About</span>
                  <textarea value={document.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} rows={5} className="w-full resize-none rounded-xl border border-black/10 bg-[#fafafa] px-3 py-2.5 text-sm leading-6 outline-none focus:border-black/30" />
                </label>
              </div>
            )}

            {activePanel === 'design' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">Design system</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Choose a point of view.</h2>
                </div>
                {PORTFOLIO_THEMES.map((theme) => (
                  <button key={theme.id} onClick={() => selectTheme(theme.id)} className={`w-full rounded-2xl border p-4 text-left transition ${document.theme === theme.id ? 'border-black bg-[#fafafa] shadow-sm' : 'border-black/10 hover:border-black/25'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{theme.name}</span>
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: themeAccent[theme.id] }} />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-black/50">{theme.description}</p>
                  </button>
                ))}
              </div>
            )}

            {activePanel === 'sections' && (
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">Page structure</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Compose, don't wrestle with pixels.</h2>
                </div>
                {document.sections.map((section, index) => (
                  <div key={section.id} className="flex items-center gap-2 rounded-xl border border-black/10 p-2.5">
                    <span className="w-5 text-center text-[10px] text-black/35">{index + 1}</span>
                    <span className={`flex-1 text-sm capitalize ${section.visible ? '' : 'text-black/30 line-through'}`}>{section.type}</span>
                    <button aria-label={`Move ${section.type} up`} onClick={() => reorder(section.id, -1)} className="rounded-md px-1.5 py-1 text-xs text-black/45 hover:bg-black/5">↑</button>
                    <button aria-label={`Move ${section.type} down`} onClick={() => reorder(section.id, 1)} className="rounded-md px-1.5 py-1 text-xs text-black/45 hover:bg-black/5">↓</button>
                    <button onClick={() => toggleSection(section.id)} className="rounded-md px-2 py-1 text-[10px] font-medium text-black/50 hover:bg-black/5">{section.visible ? 'Hide' : 'Show'}</button>
                  </div>
                ))}
                <button onClick={() => setDocument((current) => ({ ...current, sections: [...current.sections, { id: `custom-${Date.now()}`, type: 'about', variant: 'narrow', visible: true }] }))} className="w-full rounded-xl border border-dashed border-black/20 px-3 py-2.5 text-sm font-medium text-black/55 hover:border-black/40 hover:text-black">+ Add section</button>
              </div>
            )}
          </div>
        </aside>

        <section className="min-h-[calc(100vh-4rem)] overflow-auto bg-[#e9e9e6] p-5 md:p-8 lg:p-12">
          <div className="mx-auto max-w-[920px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
            <PortfolioPreview document={document} sections={visibleSections} />
          </div>
        </section>

        <aside className="hidden border-l border-black/10 bg-white p-5 lg:block">
          <div className="sticky top-24 space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/40">Publishing</p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">Your site, your URL.</h2>
              <p className="mt-2 text-sm leading-6 text-black/50">Publish to a SkillPage URL now. Custom domains and code imports plug into the same publishing module later.</p>
            </div>
            <div className="rounded-2xl bg-[#f6f6f4] p-4">
              <p className="text-xs text-black/45">Preview URL</p>
              <p className="mt-1 truncate text-sm font-medium">skillpage.com/@{document.profile.handle}</p>
            </div>
            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-sm font-medium">Bring your own code</p>
              <p className="mt-1 text-xs leading-5 text-black/45">HTML, CSS, JS and assets can be imported later through the isolated static-site publishing pipeline.</p>
              <button disabled className="mt-4 w-full cursor-not-allowed rounded-xl border border-black/10 px-3 py-2 text-xs font-medium text-black/35">ZIP import — next module</button>
            </div>
            <div className="rounded-2xl bg-[#171717] p-4 text-white">
              <p className="text-sm font-medium">Built for expansion</p>
              <p className="mt-1 text-xs leading-5 text-white/55">Marketplace, projects, payments and reputation consume the published portfolio. They do not own it.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function PortfolioPreview({ document, sections }: { document: PortfolioDocument; sections: SectionNode[] }) {
  const accent = document.settings.accent;
  const isEditorial = document.theme === 'editorial';
  const isStudio = document.theme === 'studio';
  const isBold = document.theme === 'bold';

  return (
    <article className={`min-h-[900px] ${isEditorial ? 'font-serif' : 'font-sans'}`}>
      <header className="flex items-center justify-between border-b border-black/10 px-8 py-6 md:px-12">
        <span className="text-sm font-semibold tracking-[-0.02em]">{document.profile.name}</span>
        <nav className="hidden gap-5 text-[11px] text-black/45 sm:flex">
          {sections.filter((section) => section.type !== 'hero').slice(0, 4).map((section) => <span key={section.id} className="capitalize">{section.type}</span>)}
        </nav>
      </header>

      {sections.map((section) => {
        if (section.type === 'hero') return (
          <section key={section.id} className={`px-8 py-20 md:px-12 md:py-28 ${isBold ? 'bg-[#171717] text-white' : ''}`}>
            <div className={`${isStudio ? 'max-w-3xl' : 'max-w-2xl'}`}>
              {document.settings.showAvailability && <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: isBold ? '#b7b7b7' : accent }}>Available for selected projects</p>}
              <h1 className={`${isBold ? 'text-5xl md:text-7xl' : 'text-4xl md:text-6xl'} font-semibold leading-[0.98] tracking-[-0.055em]`}>{document.profile.headline}</h1>
              <p className={`mt-7 max-w-xl text-base leading-7 ${isBold ? 'text-white/60' : 'text-black/55'}`}>{document.profile.bio}</p>
              <div className="mt-8 flex gap-3">
                <button className={`rounded-full px-5 py-2.5 text-xs font-semibold ${isBold ? 'bg-white text-black' : 'text-white'}`} style={!isBold ? { backgroundColor: accent } : undefined}>View selected work</button>
                <button className={`rounded-full border px-5 py-2.5 text-xs font-semibold ${isBold ? 'border-white/20 text-white' : 'border-black/10 text-black'}`}>Get in touch</button>
              </div>
            </div>
          </section>
        );
        if (section.type === 'about') return <section key={section.id} className="border-t border-black/10 px-8 py-16 md:px-12"><p className="max-w-2xl text-xl leading-8 tracking-[-0.02em] md:text-2xl">{document.profile.bio}</p></section>;
        if (section.type === 'projects') return <section key={section.id} className="border-t border-black/10 px-8 py-16 md:px-12"><SectionHeading eyebrow="Selected work" title="Projects that show how I think." /><div className="mt-10 grid gap-5 md:grid-cols-2">{(document.profile.projects.length ? document.profile.projects : [{ id: 'p1', title: 'Your first case study', description: 'Add a project to turn this placeholder into proof of work.', tags: ['Case study'] }, { id: 'p2', title: 'Another project', description: 'Show the outcome, your role and what changed.', tags: ['Selected work'] }]).map((project) => <div key={project.id} className="group rounded-2xl border border-black/10 p-5"><div className="aspect-[1.55] rounded-xl bg-[#f0f0ed]" /><div className="mt-5 flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold tracking-[-0.03em]">{project.title}</h3><p className="mt-2 text-sm leading-6 text-black/50">{project.description}</p></div><span className="text-[10px] uppercase tracking-[0.12em] text-black/35">View</span></div></div>)}</div></section>;
        if (section.type === 'services') return <section key={section.id} className="border-t border-black/10 px-8 py-16 md:px-12"><SectionHeading eyebrow="Services" title="Ways I can help." /><div className="mt-10 grid gap-4 md:grid-cols-3">{(document.profile.services.length ? document.profile.services : [{ id: 's1', title: 'Strategy', description: 'Clarify the problem, opportunity and direction.' }, { id: 's2', title: 'Build', description: 'Turn an idea into a useful, polished product.' }, { id: 's3', title: 'Advisory', description: 'Bring product thinking to a critical decision.' }]).map((service) => <div key={service.id} className="rounded-2xl bg-[#f6f6f4] p-5"><h3 className="font-semibold tracking-[-0.02em]">{service.title}</h3><p className="mt-3 text-sm leading-6 text-black/50">{service.description}</p></div>)}</div></section>;
        if (section.type === 'experience') return <section key={section.id} className="border-t border-black/10 px-8 py-16 md:px-12"><SectionHeading eyebrow="Experience" title="A track record, not a list of buzzwords." /><div className="mt-8 space-y-0">{(document.profile.experience.length ? document.profile.experience : [{ id: 'e1', company: 'Your company', role: 'Your role', period: '2024 — Present', description: 'Add your experience and outcomes here.' }]).map((item) => <div key={item.id} className="grid gap-2 border-b border-black/10 py-6 md:grid-cols-[1fr_2fr]"><span className="text-xs text-black/40">{item.period}</span><div><h3 className="font-semibold">{item.role} · {item.company}</h3><p className="mt-2 text-sm leading-6 text-black/50">{item.description}</p></div></div>)}</div></section>;
        if (section.type === 'skills') return <section key={section.id} className="border-t border-black/10 px-8 py-16 md:px-12"><SectionHeading eyebrow="Capabilities" title="What I bring to the table." /><div className="mt-8 flex flex-wrap gap-2">{document.profile.skills.map((skill) => <span key={skill} className="rounded-full border border-black/10 px-4 py-2 text-xs">{skill}</span>)}</div></section>;
        if (section.type === 'testimonials') return <section key={section.id} className="border-t border-black/10 bg-[#f6f6f4] px-8 py-16 md:px-12"><p className="text-2xl leading-9 tracking-[-0.03em] md:text-3xl">“{document.profile.testimonials[0]?.quote || 'Add a strong client testimonial here. Specific outcomes make reputation credible.'}”</p><p className="mt-6 text-xs text-black/45">{document.profile.testimonials[0]?.name || 'Client name'}{document.profile.testimonials[0]?.role ? ` · ${document.profile.testimonials[0].role}` : ''}</p></section>;
        if (section.type === 'contact') return <section key={section.id} className="border-t border-black/10 px-8 py-20 text-center md:px-12"><p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>Start a conversation</p><h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] md:text-5xl">Have a good problem? Let's talk.</h2><button className="mt-8 rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: accent }}>Get in touch</button></section>;
        return null;
      })}
      <footer className="border-t border-black/10 px-8 py-7 text-xs text-black/40 md:px-12">{document.profile.name} · Built with SkillPage</footer>
    </article>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/35">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.045em]">{title}</h2></div>;
}
