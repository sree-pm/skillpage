'use client';

import type { PortfolioDocument, SectionNode } from '@skillpage/portfolio-core';
import { SECTION_LABELS } from '@skillpage/portfolio-core';

export function PortfolioRenderer({ document, preview = false }: { document: PortfolioDocument; preview?: boolean }) {
  const visible = document.sections.filter((section) => section.visible);
  const dark = document.theme === 'bold';
  const editorial = document.theme === 'editorial';
  const studio = document.theme === 'studio';
  const professional = document.theme === 'professional';
  const accent = document.settings.accent;
  const surface = dark ? 'bg-[#111] text-white' : 'bg-white text-[#151515]';
  const muted = dark ? 'text-white/55' : 'text-black/50';

  return (
    <article className={`${surface} ${editorial ? 'font-serif' : 'font-sans'} ${preview ? 'min-h-[960px]' : ''}`}>
      <header className={`flex items-center justify-between border-b px-7 py-5 md:px-11 ${dark ? 'border-white/10' : 'border-black/8'}`}>
        <span className="text-sm font-semibold tracking-[-0.03em]">{document.profile.name}</span>
        <nav className="hidden items-center gap-5 sm:flex">
          {visible.filter((s) => s.type !== 'hero').slice(0, 4).map((section) => (
            <span key={section.id} className={`text-[10px] uppercase tracking-[0.13em] ${muted}`}>{SECTION_LABELS[section.type]}</span>
          ))}
        </nav>
      </header>

      {visible.map((section) => <PortfolioSection key={section.id} section={section} document={document} dark={dark} editorial={editorial} studio={studio} professional={professional} accent={accent} muted={muted} />)}
    </article>
  );
}

function PortfolioSection({ section, document, dark, editorial, studio, professional, accent, muted }: { section: SectionNode; document: PortfolioDocument; dark: boolean; editorial: boolean; studio: boolean; professional: boolean; accent: string; muted: string }) {
  const border = dark ? 'border-white/10' : 'border-black/8';
  const inner = 'mx-auto max-w-6xl px-7 py-16 md:px-11 md:py-24';

  if (section.type === 'hero') return (
    <section className={`${inner} ${section.variant === 'centered' ? 'text-center' : ''} ${dark ? 'bg-[#111]' : ''}`}>
      <div className={`${section.variant === 'centered' ? 'mx-auto' : ''} max-w-4xl`}>
        {document.settings.showAvailability && <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent }}>{document.profile.availability || 'Available for selected projects'}</p>}
        <h1 className={`${dark ? 'text-5xl md:text-8xl' : studio ? 'text-5xl md:text-8xl' : 'text-5xl md:text-7xl'} font-semibold leading-[0.94] tracking-[-0.06em]`}>{document.profile.headline}</h1>
        <p className={`mt-7 max-w-2xl text-base leading-7 md:text-lg ${section.variant === 'centered' ? 'mx-auto' : ''} ${muted}`}>{document.profile.bio}</p>
        <div className={`mt-9 flex flex-wrap gap-3 ${section.variant === 'centered' ? 'justify-center' : ''}`}>
          <a href="#work" className="rounded-full px-5 py-3 text-xs font-semibold text-white" style={{ backgroundColor: accent }}>View selected work</a>
          <a href="#contact" className={`rounded-full border px-5 py-3 text-xs font-semibold ${border}`}>Get in touch</a>
        </div>
      </div>
    </section>
  );

  if (section.type === 'about') return <section className={`border-t ${border}`}><div className={`${inner} ${section.variant === 'statement' ? 'max-w-5xl' : ''}`}><Eyebrow text="About" muted={muted} /><p className={`${section.variant === 'statement' ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'} mt-6 max-w-4xl leading-[1.18] tracking-[-0.035em]`}>{document.profile.bio}</p>{document.profile.location && <p className={`mt-6 text-sm ${muted}`}>{document.profile.location}</p>}</div></section>;

  if (section.type === 'projects') return <section id="work" className={`border-t ${border}`}><div className={inner}><Eyebrow text="Selected work" muted={muted} /><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.045em] md:text-5xl">Proof of work, not just promises.</h2>{document.profile.projects.length === 0 ? <EmptyState text="Add your strongest case studies from the editor." /> : section.variant === 'list' ? <div className="mt-10 divide-y border-y" style={{ borderColor: dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)' }}>{document.profile.projects.map((p) => <div key={p.id} className="flex flex-col gap-3 py-7 md:flex-row md:items-center md:justify-between"><div><h3 className="text-xl font-semibold tracking-[-0.03em]">{p.title}</h3><p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>{p.description}</p></div><span className={`text-[10px] uppercase tracking-[.15em] ${muted}`}>{p.year || 'Case study'}</span></div>)}</div> : <div className="mt-10 grid gap-5 md:grid-cols-2">{document.profile.projects.map((p) => <div key={p.id} className={`overflow-hidden rounded-2xl border ${border}`}><div className={`aspect-[1.45] ${dark ? 'bg-white/5' : 'bg-[#f1f1ee]'}`}>{p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}</div><div className="p-5"><div className="flex items-start justify-between gap-4"><h3 className="text-xl font-semibold tracking-[-0.035em]">{p.title}</h3>{p.year && <span className={`text-[10px] ${muted}`}>{p.year}</span>}</div><p className={`mt-2 text-sm leading-6 ${muted}`}>{p.description}</p><div className="mt-4 flex flex-wrap gap-2">{p.tags.map((tag) => <span key={tag} className={`rounded-full border px-2.5 py-1 text-[10px] ${border}`}>{tag}</span>)}</div></div></div>)}</div>}</div></section>;

  if (section.type === 'services') return <section className={`border-t ${border}`}><div className={inner}><Eyebrow text="Services" muted={muted} /><div className={`mt-9 ${section.variant === 'list' ? 'divide-y border-y' : 'grid gap-4 md:grid-cols-3'}`}>{document.profile.services.length === 0 ? <EmptyState text="Add the services you want people to hire you for." /> : document.profile.services.map((s) => <div key={s.id} className={`${section.variant === 'list' ? 'py-6' : `rounded-2xl border p-5 ${border}`}`}><div className="flex items-start justify-between gap-4"><h3 className="font-semibold tracking-[-0.02em]">{s.title}</h3>{s.priceFrom && <span className={`text-xs ${muted}`}>From {s.priceFrom}</span>}</div><p className={`mt-3 text-sm leading-6 ${muted}`}>{s.description}</p></div>)}</div></div></section>;

  if (section.type === 'experience') return <section className={`border-t ${border}`}><div className={inner}><Eyebrow text="Experience" muted={muted} /><div className="mt-9 space-y-0">{document.profile.experience.length === 0 ? <EmptyState text="Add your relevant career history." /> : document.profile.experience.map((e) => <div key={e.id} className={`grid gap-3 border-t py-6 md:grid-cols-[150px_1fr] ${border}`}><span className={`text-xs ${muted}`}>{e.period}</span><div><h3 className="font-semibold">{e.role}</h3><p className={`mt-1 text-sm ${muted}`}>{e.company}</p>{e.description && <p className={`mt-3 max-w-2xl text-sm leading-6 ${muted}`}>{e.description}</p>}</div></div>)}</div></div></section>;

  if (section.type === 'skills') return <section className={`border-t ${border}`}><div className={inner}><Eyebrow text="Capabilities" muted={muted} /><div className="mt-7 flex flex-wrap gap-2">{document.profile.skills.map((skill) => <span key={skill} className={`rounded-full border px-4 py-2 text-sm ${border}`}>{skill}</span>)}</div></div></section>;

  if (section.type === 'testimonials') return <section className={`border-t ${border}`}><div className={inner}>{document.profile.testimonials.length === 0 ? <EmptyState text="Video testimonials will appear here after moderation." /> : <>{document.profile.testimonials.slice(0, section.variant === 'grid' ? 3 : 1).map((t) => <figure key={t.id} className={`rounded-3xl ${dark ? 'bg-white/5' : 'bg-[#f4f4f1]'} p-7 md:p-10`}><blockquote className="max-w-4xl text-2xl leading-[1.25] tracking-[-0.03em] md:text-4xl">“{t.quote}”</blockquote><figcaption className={`mt-7 text-sm ${muted}`}>{t.name}{t.role ? ` · ${t.role}` : ''}</figcaption></figure>)}</>}</div></section>;

  if (section.type === 'contact' && document.settings.showContact) return <section id="contact" className={`border-t ${border}`}><div className={`${inner} text-center`}><Eyebrow text="Contact" muted={muted} /><h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Have a project worth discussing?</h2><p className={`mx-auto mt-5 max-w-xl text-sm leading-6 ${muted}`}>Use your SkillPage profile to start a conversation without losing context.</p><a href="#" className="mt-8 inline-flex rounded-full px-5 py-3 text-xs font-semibold text-white" style={{ backgroundColor: accent }}>Start a conversation</a></div></section>;

  return null;
}

function Eyebrow({ text, muted }: { text: string; muted: string }) { return <p className={`text-[10px] font-semibold uppercase tracking-[.18em] ${muted}`}>{text}</p>; }
function EmptyState({ text }: { text: string }) { return <div className="mt-8 rounded-2xl border border-dashed border-black/10 p-8 text-sm text-black/40">{text}</div>; }
