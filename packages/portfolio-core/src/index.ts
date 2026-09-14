export type PortfolioThemeId = 'minimal' | 'editorial' | 'studio' | 'professional' | 'bold';
export type PortfolioSource = 'visual' | 'generated' | 'uploaded_static';
export type SectionType = 'hero' | 'about' | 'projects' | 'services' | 'experience' | 'skills' | 'testimonials' | 'contact';
export interface PortfolioProject { id: string; title: string; description: string; role?: string; year?: string; imageUrl?: string; href?: string; tags: string[]; }
export interface PortfolioService { id: string; title: string; description: string; priceFrom?: string; }
export interface PortfolioExperience { id: string; company: string; role: string; period: string; description?: string; }
export interface PortfolioTestimonial { id: string; quote: string; name: string; role?: string; videoUrl?: string; }
export interface PortfolioProfile { name: string; handle: string; headline: string; bio: string; location?: string; avatarUrl?: string; availability?: string; skills: string[]; services: PortfolioService[]; projects: PortfolioProject[]; experience: PortfolioExperience[]; testimonials: PortfolioTestimonial[]; links: Array<{ label: string; href: string }>; }
export interface SectionNode { id: string; type: SectionType; variant: string; visible: boolean; }
export interface PortfolioTheme { id: PortfolioThemeId; name: string; description: string; tone: 'quiet' | 'editorial' | 'visual' | 'structured' | 'expressive'; defaultSections: SectionNode[]; previewClass: string; }
export interface PortfolioDocument { schemaVersion: 1; source: PortfolioSource; theme: PortfolioThemeId; profile: PortfolioProfile; sections: SectionNode[]; settings: { accent: string; showAvailability: boolean; showContact: boolean; seoTitle?: string; seoDescription?: string; }; }
export interface PublishedPortfolioVersion { id: string; siteId: string; version: number; document: PortfolioDocument; publishedAt?: string; }
export const SECTION_LABELS: Record<SectionType, string> = { hero: 'Introduction', about: 'About', projects: 'Selected work', services: 'Services', experience: 'Experience', skills: 'Skills', testimonials: 'Testimonials', contact: 'Contact' };
export const SECTION_VARIANTS: Record<SectionType, Array<{ id: string; name: string; description: string }>> = {
  hero: [{ id: 'split', name: 'Split', description: 'Large statement with supporting copy and actions.' }, { id: 'centered', name: 'Centered', description: 'Focused introduction with generous whitespace.' }],
  about: [{ id: 'narrow', name: 'Narrow', description: 'Editorial reading width.' }, { id: 'statement', name: 'Statement', description: 'Large, confident positioning statement.' }],
  projects: [{ id: 'featured-grid', name: 'Featured grid', description: 'Two-column case study grid.' }, { id: 'list', name: 'Project list', description: 'Compact work index for experienced professionals.' }],
  services: [{ id: 'three-column', name: 'Three columns', description: 'Clear service cards with optional starting price.' }, { id: 'list', name: 'Service list', description: 'Editorial list with concise descriptions.' }],
  experience: [{ id: 'timeline', name: 'Timeline', description: 'Structured career history.' }, { id: 'compact', name: 'Compact', description: 'Dense experience list.' }],
  skills: [{ id: 'inline', name: 'Inline', description: 'Simple skill cloud with restrained styling.' }, { id: 'grouped', name: 'Grouped', description: 'Skills presented as grouped capabilities.' }],
  testimonials: [{ id: 'single-feature', name: 'Featured', description: 'One strong testimonial at a time.' }, { id: 'grid', name: 'Grid', description: 'Multiple testimonials in a compact grid.' }],
  contact: [{ id: 'centered', name: 'Centered', description: 'Simple final call to action.' }, { id: 'split', name: 'Split', description: 'CTA alongside contact details and links.' }],
};
export const PORTFOLIO_THEMES: PortfolioTheme[] = [
  { id: 'minimal', name: 'Minimal', description: 'Quiet, precise and typography-led.', tone: 'quiet', previewClass: 'minimal', defaultSections: [] },
  { id: 'editorial', name: 'Editorial', description: 'Elegant hierarchy with an editorial feel.', tone: 'editorial', previewClass: 'editorial', defaultSections: [] },
  { id: 'studio', name: 'Studio', description: 'Project-first and visual.', tone: 'visual', previewClass: 'studio', defaultSections: [] },
  { id: 'professional', name: 'Professional', description: 'Structured, credible and versatile.', tone: 'structured', previewClass: 'professional', defaultSections: [] },
  { id: 'bold', name: 'Bold', description: 'Expressive typography with personality.', tone: 'expressive', previewClass: 'bold', defaultSections: [] },
];
export const DEFAULT_SECTIONS: SectionNode[] = [
  { id: 'hero', type: 'hero', variant: 'split', visible: true }, { id: 'about', type: 'about', variant: 'narrow', visible: true }, { id: 'projects', type: 'projects', variant: 'featured-grid', visible: true }, { id: 'services', type: 'services', variant: 'three-column', visible: true }, { id: 'experience', type: 'experience', variant: 'timeline', visible: true }, { id: 'skills', type: 'skills', variant: 'inline', visible: true }, { id: 'testimonials', type: 'testimonials', variant: 'single-feature', visible: true }, { id: 'contact', type: 'contact', variant: 'centered', visible: true },
];
export function createStarterPortfolio(): PortfolioDocument { return { schemaVersion: 1, source: 'visual', theme: 'minimal', profile: { name: 'Your Name', handle: 'yourname', headline: 'Independent professional building useful things.', bio: 'Tell people what you do, who you help and what makes your work different.', skills: ['Product', 'Strategy', 'Design'], services: [], projects: [], experience: [], testimonials: [], links: [] }, sections: DEFAULT_SECTIONS.map((section) => ({ ...section })), settings: { accent: '#171717', showAvailability: true, showContact: true, seoTitle: 'Your Name | Portfolio', seoDescription: 'Professional portfolio on SkillPage.' } }; }
export function isPortfolioDocument(value: unknown): value is PortfolioDocument { if (!value || typeof value !== 'object') return false; const d = value as Partial<PortfolioDocument>; return d.schemaVersion === 1 && !!d.profile && typeof d.profile === 'object' && Array.isArray(d.sections); }
export function clonePortfolio(document: PortfolioDocument): PortfolioDocument { return JSON.parse(JSON.stringify(document)) as PortfolioDocument; }

const SECTION_TYPES: SectionType[] = ['hero','about','projects','services','experience','skills','testimonials','contact'];
const HANDLE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const URL_PROTOCOL = /^(https?:\/\/|mailto:|tel:)/i;
const THEMES: PortfolioThemeId[] = ['minimal','editorial','studio','professional','bold'];
const SOURCES: PortfolioSource[] = ['visual','generated','uploaded_static'];
const text = (value: unknown, max: number) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const optionalText = (value: unknown, max: number) => value === undefined || (typeof value === 'string' && value.length <= max);
export function validatePortfolioDocument(value: unknown): { valid: true; document: PortfolioDocument } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  if (!isPortfolioDocument(value)) return { valid: false, errors: ['Malformed portfolio document'] };
  const d = value as PortfolioDocument;
  if (!SOURCES.includes(d.source)) errors.push('Invalid source');
  if (!THEMES.includes(d.theme)) errors.push('Invalid theme');
  const p = d.profile;
  if (!text(p.name, 120)) errors.push('Name is required and must be 120 characters or fewer');
  if (!HANDLE.test(p.handle)) errors.push('Invalid public handle');
  if (!text(p.headline, 180)) errors.push('Headline is required and must be 180 characters or fewer');
  if (!text(p.bio, 5000)) errors.push('About text is required and must be 5000 characters or fewer');
  if (!optionalText(p.location, 160) || !optionalText(p.availability, 160) || !optionalText(p.avatarUrl, 2048)) errors.push('Invalid profile metadata');
  if (!Array.isArray(p.skills) || p.skills.length > 50 || p.skills.some((s) => !text(s, 80))) errors.push('Invalid skills');
  if (!Array.isArray(p.projects) || p.projects.length > 30) errors.push('Invalid projects');
  else for (const item of p.projects) if (!text(item.id, 100) || !text(item.title, 160) || !text(item.description, 3000) || !Array.isArray(item.tags) || item.tags.length > 20 || item.tags.some((tag) => !text(tag, 60)) || !optionalText(item.role, 120) || !optionalText(item.year, 40) || !optionalText(item.imageUrl, 2048) || !optionalText(item.href, 2048)) errors.push('Invalid project');
  if (!Array.isArray(p.services) || p.services.length > 20) errors.push('Invalid services');
  else for (const item of p.services) if (!text(item.id, 100) || !text(item.title, 160) || !text(item.description, 2000) || !optionalText(item.priceFrom, 80)) errors.push('Invalid service');
  if (!Array.isArray(p.experience) || p.experience.length > 50) errors.push('Invalid experience');
  else for (const item of p.experience) if (!text(item.id, 100) || !text(item.company, 160) || !text(item.role, 160) || !text(item.period, 100) || !optionalText(item.description, 3000)) errors.push('Invalid experience');
  if (!Array.isArray(p.testimonials) || p.testimonials.length > 30) errors.push('Invalid testimonials');
  else for (const item of p.testimonials) if (!text(item.id, 100) || !text(item.quote, 1500) || !text(item.name, 160) || !optionalText(item.role, 160) || !optionalText(item.videoUrl, 2048)) errors.push('Invalid testimonial');
  if (!Array.isArray(p.links) || p.links.length > 20) errors.push('Invalid profile links');
  else for (const link of p.links) if (!text(link.label, 80) || !URL_PROTOCOL.test(link.href || '') || (link.href || '').length > 2048) errors.push('Invalid profile link');
  if (!Array.isArray(d.sections) || d.sections.length > 30) errors.push('Invalid sections');
  const ids = new Set<string>();
  for (const s of d.sections || []) {
    if (!text(s.id, 100) || ids.has(s.id)) errors.push('Section IDs must be unique');
    ids.add(s.id);
    if (!SECTION_TYPES.includes(s.type) || !SECTION_VARIANTS[s.type].some((variant) => variant.id === s.variant) || typeof s.visible !== 'boolean') errors.push(`Invalid section: ${s.id}`);
  }
  if (!/^#[0-9a-f]{6}$/i.test(d.settings?.accent || '') || typeof d.settings?.showAvailability !== 'boolean' || typeof d.settings?.showContact !== 'boolean' || !optionalText(d.settings?.seoTitle, 180) || !optionalText(d.settings?.seoDescription, 320)) errors.push('Invalid portfolio settings');
  return errors.length ? { valid: false, errors: [...new Set(errors)].slice(0, 25) } : { valid: true, document: d };
}
