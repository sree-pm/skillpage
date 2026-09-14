'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PORTFOLIO_THEMES,
  SECTION_LABELS,
  SECTION_VARIANTS,
  clonePortfolio,
  createStarterPortfolio,
  type PortfolioDocument,
  type PortfolioThemeId,
  type SectionNode,
  type SectionType,
} from '@skillpage/portfolio-core';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';

type Panel = 'content' | 'design' | 'sections' | 'settings';
type Device = 'desktop' | 'tablet' | 'mobile';

const THEME_ACCENTS: Record<PortfolioThemeId, string> = { minimal: '#171717', editorial: '#8b5e3c', studio: '#2457ff', professional: '#1f4f78', bold: '#9b4dca' };
const STORAGE_KEY = 'skillpage:portfolio:v2';

export default function PortfolioStudio() {
  const [document, setDocument] = useState<PortfolioDocument>(() => createStarterPortfolio());
  const [history, setHistory] = useState<PortfolioDocument[]>([]);
  const [future, setFuture] = useState<PortfolioDocument[]>([]);
  const [panel, setPanel] = useState<Panel>('content');
  const [device, setDevice] = useState<Device>('desktop');
  const [selectedSection, setSelectedSection] = useState('hero');
  const [status, setStatus] = useState<'saved' | 'dirty' | 'saving' | 'published'>('dirty');
  const [dragged, setDragged] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setDocument(JSON.parse(saved) as PortfolioDocument);
    } catch { /* keep starter */ }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
      if (status !== 'published') setStatus('saved');
    }, 700);
    return () => window.clearTimeout(timer);
  }, [document]);

  function commit(next: PortfolioDocument) {
    setHistory((items) => [...items.slice(-39), clonePortfolio(document)]);
    setFuture([]);
    setDocument(next);
    setStatus('dirty');
  }

  function patchProfile(field: 'name' | 'handle' | 'headline' | 'bio' | 'location' | 'availability', value: string) {
    commit({ ...document, profile: { ...document.profile, [field]: value } });
  }

  function patchSettings(field: 'seoTitle' | 'seoDescription' | 'showAvailability' | 'showContact', value: string | boolean) {
    commit({ ...document, settings: { ...document.settings, [field]: value } });
  }

  function selectTheme(theme: PortfolioThemeId) {
    commit({ ...document, theme, settings: { ...document.settings, accent: THEME_ACCENTS[theme] } });
  }

  function updateSection(id: string, patch: Partial<SectionNode>) {
    commit({ ...document, sections: document.sections.map((section) => section.id === id ? { ...section, ...patch } : section) });
  }

  function moveSection(fromId: string, toId: string) {
    if (fromId === toId) return;
    const next = [...document.sections];
    const from = next.findIndex((s) => s.id === fromId);
    const to = next.findIndex((s) => s.id === toId);
    if (from < 0 || to < 0) return;
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit({ ...document, sections: next });
  }

  function addSection(type: SectionType) {
    const variant = SECTION_VARIANTS[type][0]?.id || 'default';
    const section: SectionNode = { id: `${type}-${Date.now()}`, type, variant, visible: true };
    commit({ ...document, sections: [...document.sections, section] });
    setSelectedSection(section.id);
    setShowAdd(false);
  }

  function removeSection(id: string) {
    if (document.sections.length <= 1) return;
    commit({ ...document, sections: document.sections.filter((s) => s.id !== id) });
    setSelectedSection(document.sections.find((s) => s.id !== id)?.id || 'hero');
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((items) => [clonePortfolio(document), ...items].slice(0, 40));
    setHistory((items) => items.slice(0, -1));
    setDocument(previous);
    setStatus('dirty');
  }

  function redo() {
    const next = future[0];
    if (!next) return;
    setHistory((items) => [...items, clonePortfolio(document)].slice(-40));
    setFuture((items) => items.slice(1));
    setDocument(next);
    setStatus('dirty');
  }

  async function saveToServer(publish = false) {
    setStatus('saving');
    try {
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const response = await fetch(`${base}/api/portfolio/${publish ? 'publish' : 'document'}`, { method: 'POST', headers, body: JSON.stringify({ document }) });
      if (!response.ok) throw new Error(`Save failed: ${response.status}`);
      setStatus(publish ? 'published' : 'saved');
    } catch {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(document));
      setStatus('saved');
    }
  }

  const selected = document.sections.find((section) => section.id === selectedSection) || document.sections[0];
  const previewWidth = device === 'mobile' ? 'max-w-[390px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[1100px]';
  const visibleCount = document.sections.filter((s) => s.visible).length;

  return (
    <main className="min-h-screen bg-[#f3f3f1] text-[#171717]">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f3f3f1]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="shrink-0 text-[16px] font-semibold tracking-[-.04em]">SkillPage</Link>
            <span className="hidden h-4 w-px bg-black/15 sm:block" />
            <span className="hidden truncate text-sm text-black/45 sm:block">Portfolio Studio</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="mr-2 hidden text-[11px] text-black/40 md:block">{status === 'dirty' ? 'Unsaved changes' : status === 'saving' ? 'Saving…' : status === 'published' ? 'Published' : 'Saved'}</span>
            <button title="Undo" disabled={!history.length} onClick={undo} className="hidden rounded-lg px-2.5 py-2 text-sm text-black/50 hover:bg-black/5 disabled:opacity-20 md:block">↶</button>
            <button title="Redo" disabled={!future.length} onClick={redo} className="hidden rounded-lg px-2.5 py-2 text-sm text-black/50 hover:bg-black/5 disabled:opacity-20 md:block">↷</button>
            <button onClick={() => saveToServer(false)} className="rounded-full border border-black/12 bg-white px-3.5 py-2 text-xs font-semibold hover:bg-black/[.03]">Save</button>
            <button onClick={() => saveToServer(true)} className="rounded-full bg-[#171717] px-4 py-2 text-xs font-semibold text-white hover:bg-black/85">Publish</button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[310px_minmax(0,1fr)_290px]">
        <aside className="order-2 border-t border-black/10 bg-white lg:order-1 lg:border-r lg:border-t-0">
          <div className="grid grid-cols-4 border-b border-black/10 p-1.5">
            {(['content', 'design', 'sections', 'settings'] as Panel[]).map((item) => <button key={item} onClick={() => setPanel(item)} className={`rounded-lg px-2 py-2.5 text-[10px] font-semibold capitalize tracking-[.02em] ${panel === item ? 'bg-[#171717] text-white' : 'text-black/45 hover:bg-black/[.04]'}`}>{item}</button>)}
          </div>
          <div className="max-h-[calc(100vh-6rem)] overflow-auto p-5">
            {panel === 'content' && <ContentPanel document={document} patchProfile={patchProfile} />}
            {panel === 'design' && <DesignPanel document={document} selectTheme={selectTheme} />}
            {panel === 'sections' && <SectionsPanel document={document} selected={selectedSection} setSelected={setSelectedSection} dragged={dragged} setDragged={setDragged} moveSection={moveSection} updateSection={updateSection} removeSection={removeSection} showAdd={showAdd} setShowAdd={setShowAdd} addSection={addSection} />}
            {panel === 'settings' && <SettingsPanel document={document} patchSettings={patchSettings} />}
          </div>
        </aside>

        <section className="order-1 min-h-[calc(100vh-4rem)] overflow-auto bg-[#e8e8e5] px-3 py-5 md:px-6 lg:order-2 lg:px-10 lg:py-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-full bg-white/70 p-1 shadow-sm">
              {(['desktop', 'tablet', 'mobile'] as Device[]).map((item) => <button key={item} onClick={() => setDevice(item)} className={`rounded-full px-3 py-1.5 text-[10px] font-semibold capitalize ${device === item ? 'bg-[#171717] text-white' : 'text-black/45'}`}>{item}</button>)}
            </div>
            <span className="text-[10px] uppercase tracking-[.15em] text-black/35">{visibleCount} sections live</span>
          </div>
          <div className={`mx-auto overflow-hidden rounded-[22px] bg-white shadow-[0_30px_100px_rgba(0,0,0,.13)] transition-all ${previewWidth}`}>
            <PortfolioRenderer document={document} preview />
          </div>
        </section>

        <aside className="order-3 hidden border-l border-black/10 bg-white lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-auto p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-black/35">Inspector</p>
              <h2 className="mt-2 text-lg font-semibold tracking-[-.035em]">{selected ? SECTION_LABELS[selected.type] : 'Section'}</h2>
            </div>
            {selected && <SectionInspector section={selected} updateSection={updateSection} />}
            <div className="mt-8 border-t border-black/8 pt-6">
              <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-black/35">Publishing</p>
              <p className="mt-2 text-sm leading-6 text-black/50">Your visual portfolio and future code-import site use the same publishing boundary.</p>
              <div className="mt-4 rounded-xl bg-[#f5f5f2] p-3"><p className="text-[10px] text-black/40">SkillPage URL</p><p className="mt-1 truncate text-xs font-semibold">skillpage.com/@{document.profile.handle}</p></div>
              <button disabled className="mt-3 w-full rounded-xl border border-dashed border-black/12 px-3 py-2.5 text-xs text-black/35">ZIP import · next publishing module</button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function ContentPanel({ document, patchProfile }: { document: PortfolioDocument; patchProfile: (field: 'name' | 'handle' | 'headline' | 'bio' | 'location' | 'availability', value: string) => void }) {
  return <div className="space-y-6"><PanelIntro eyebrow="Content" title="Make the work speak." copy="Start with the positioning people should remember. Detailed case studies and services can be added as you build." />
    <Field label="Name" value={document.profile.name} onChange={(v) => patchProfile('name', v)} />
    <Field label="Headline" value={document.profile.headline} onChange={(v) => patchProfile('headline', v)} />
    <TextArea label="About" value={document.profile.bio} onChange={(v) => patchProfile('bio', v)} />
    <Field label="Location" value={document.profile.location || ''} onChange={(v) => patchProfile('location', v)} placeholder="Leicester, UK" />
    <Field label="Availability" value={document.profile.availability || ''} onChange={(v) => patchProfile('availability', v)} placeholder="Available for selected projects" />
    <Field label="Public handle" value={document.profile.handle} onChange={(v) => patchProfile('handle', v.toLowerCase().replace(/[^a-z0-9-]/g, ''))} prefix="@" />
  </div>;
}

function DesignPanel({ document, selectTheme }: { document: PortfolioDocument; selectTheme: (theme: PortfolioThemeId) => void }) {
  return <div className="space-y-5"><PanelIntro eyebrow="Design" title="Choose a point of view." copy="Each theme is a system, not a skin. Typography, spacing, surfaces and hierarchy change together." />
    <div className="space-y-3">{PORTFOLIO_THEMES.map((theme) => <button key={theme.id} onClick={() => selectTheme(theme.id)} className={`group w-full rounded-2xl border p-4 text-left transition ${document.theme === theme.id ? 'border-black bg-[#fafaf8] shadow-sm' : 'border-black/9 hover:border-black/25'}`}><div className="flex items-center justify-between"><span className="text-sm font-semibold tracking-[-.02em]">{theme.name}</span><span className="h-4 w-4 rounded-full ring-4 ring-black/[.03]" style={{ backgroundColor: THEME_ACCENTS[theme.id] }} /></div><p className="mt-1.5 text-xs leading-5 text-black/45">{theme.description}</p><div className="mt-3 flex gap-1.5"><span className="h-1.5 w-10 rounded-full bg-black/10" /><span className="h-1.5 w-5 rounded-full bg-black/5" /><span className="h-1.5 w-8 rounded-full bg-black/5" /></div></button>)}</div>
  </div>;
}

function SectionsPanel({ document, selected, setSelected, dragged, setDragged, moveSection, updateSection, removeSection, showAdd, setShowAdd, addSection }: { document: PortfolioDocument; selected: string; setSelected: (id: string) => void; dragged: string | null; setDragged: (id: string | null) => void; moveSection: (from: string, to: string) => void; updateSection: (id: string, patch: Partial<SectionNode>) => void; removeSection: (id: string) => void; showAdd: boolean; setShowAdd: (value: boolean) => void; addSection: (type: SectionType) => void }) {
  return <div className="space-y-5"><PanelIntro eyebrow="Structure" title="Compose, don't wrestle with pixels." copy="Reorder sections with drag and drop. Keep the page deliberate and let the design system handle the details." />
    <div className="space-y-2">{document.sections.map((section, index) => <div key={section.id} draggable onDragStart={() => setDragged(section.id)} onDragEnd={() => setDragged(null)} onDragOver={(e) => e.preventDefault()} onDrop={() => { if (dragged) moveSection(dragged, section.id); }} className={`group flex items-center gap-2 rounded-xl border p-2.5 transition ${selected === section.id ? 'border-black/25 bg-[#fafaf8]' : 'border-black/8'} ${dragged === section.id ? 'opacity-40' : ''}`}><button onClick={() => setSelected(section.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left"><span className="w-5 text-[9px] text-black/25">{String(index + 1).padStart(2, '0')}</span><span className={`truncate text-xs font-medium ${section.visible ? '' : 'text-black/30 line-through'}`}>{SECTION_LABELS[section.type]}</span></button><button aria-label="Toggle section" onClick={() => updateSection(section.id, { visible: !section.visible })} className="rounded-md px-1.5 py-1 text-[9px] text-black/40 hover:bg-black/5">{section.visible ? 'On' : 'Off'}</button><button aria-label="Remove section" onClick={() => removeSection(section.id)} className="rounded-md px-1.5 py-1 text-[11px] text-black/25 hover:bg-black/5 hover:text-black">×</button></div>)}</div>
    <div className="relative"><button onClick={() => setShowAdd(!showAdd)} className="w-full rounded-xl border border-dashed border-black/15 px-3 py-2.5 text-xs font-semibold text-black/50 hover:border-black/30 hover:text-black">+ Add section</button>{showAdd && <div className="absolute z-10 mt-2 grid w-full grid-cols-2 gap-1 rounded-2xl border border-black/10 bg-white p-2 shadow-xl">{(Object.keys(SECTION_LABELS) as SectionType[]).map((type) => <button key={type} onClick={() => addSection(type)} className="rounded-xl px-3 py-2.5 text-left text-[11px] font-medium hover:bg-black/[.04]">{SECTION_LABELS[type]}</button>)}</div>}</div>
  </div>;
}

function SectionInspector({ section, updateSection }: { section: SectionNode; updateSection: (id: string, patch: Partial<SectionNode>) => void }) {
  const variants = SECTION_VARIANTS[section.type];
  return <div className="mt-5 space-y-4"><div><p className="mb-2 text-[10px] font-medium text-black/40">Layout variant</p><div className="space-y-2">{variants.map((variant) => <button key={variant.id} onClick={() => updateSection(section.id, { variant: variant.id })} className={`w-full rounded-xl border p-3 text-left ${section.variant === variant.id ? 'border-black bg-[#fafaf8]' : 'border-black/8'}`}><span className="text-xs font-semibold">{variant.name}</span><p className="mt-1 text-[10px] leading-4 text-black/40">{variant.description}</p></button>)}</div></div><div className="rounded-xl bg-[#f5f5f2] p-3 text-[10px] leading-5 text-black/45">Content for this section is edited from the Content area and rendered consistently across all themes.</div></div>;
}

function SettingsPanel({ document, patchSettings }: { document: PortfolioDocument; patchSettings: (field: 'seoTitle' | 'seoDescription' | 'showAvailability' | 'showContact', value: string | boolean) => void }) {
  return <div className="space-y-6"><PanelIntro eyebrow="Settings" title="Ready for publishing." copy="SEO and visibility controls stay separate from the visual design so future publishing targets can reuse the same document." /><Field label="SEO title" value={document.settings.seoTitle || ''} onChange={(v) => patchSettings('seoTitle', v)} /><TextArea label="SEO description" value={document.settings.seoDescription || ''} onChange={(v) => patchSettings('seoDescription', v)} rows={4} /><Toggle label="Show availability" checked={document.settings.showAvailability} onChange={(v) => patchSettings('showAvailability', v)} /><Toggle label="Show contact section" checked={document.settings.showContact} onChange={(v) => patchSettings('showContact', v)} /><div className="rounded-2xl border border-black/8 p-4"><p className="text-xs font-semibold">Publishing architecture</p><p className="mt-1.5 text-[10px] leading-5 text-black/45">Visual sites, imported static sites and later custom domains can share the versioned publishing boundary without coupling the editor to marketplace or payment modules.</p></div></div>;
}

function PanelIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) { return <div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-black/35">{eyebrow}</p><h2 className="mt-2 text-lg font-semibold tracking-[-.035em]">{title}</h2><p className="mt-2 text-xs leading-5 text-black/45">{copy}</p></div>; }
function Field({ label, value, onChange, placeholder, prefix }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; prefix?: string }) { return <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.08em] text-black/40">{label}</span><div className="flex items-center overflow-hidden rounded-xl border border-black/9 bg-[#fafafa] focus-within:border-black/25">{prefix && <span className="pl-3 text-sm text-black/30">{prefix}</span>}<input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent px-3 py-2.5 text-xs outline-none placeholder:text-black/25" /></div></label>; }
function TextArea({ label, value, onChange, rows = 5 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) { return <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[.08em] text-black/40">{label}</span><textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="w-full resize-none rounded-xl border border-black/9 bg-[#fafafa] px-3 py-2.5 text-xs leading-5 outline-none focus:border-black/25" /></label>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl border border-black/8 p-3 text-left"><span className="text-xs font-medium">{label}</span><span className={`h-5 w-9 rounded-full p-0.5 transition ${checked ? 'bg-[#171717]' : 'bg-black/10'}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-4' : ''}`} /></span></button>; }
