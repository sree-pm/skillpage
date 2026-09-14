export type PortfolioThemeId = 'minimal' | 'editorial' | 'studio' | 'professional' | 'bold';
export type PortfolioSource = 'visual' | 'generated' | 'uploaded_static';

export type SectionType = 'hero' | 'about' | 'projects' | 'services' | 'experience' | 'skills' | 'testimonials' | 'contact';

export interface PortfolioProject { id: string; title: string; description: string; role?: string; year?: string; imageUrl?: string; href?: string; tags: string[]; }
export interface PortfolioService { id: string; title: string; description: string; priceFrom?: string; }
export interface PortfolioExperience { id: string; company: string; role: string; period: string; description?: string; }
export interface PortfolioTestimonial { id: string; quote: string; name: string; role?: string; videoUrl?: string; }

export interface PortfolioProfile {
  name: string;
  handle: string;
  headline: string;
  bio: string;
  location?: string;
  avatarUrl?: string;
  availability?: string;
  skills: string[];
  services: PortfolioService[];
  projects: PortfolioProject[];
  experience: PortfolioExperience[];
  testimonials: PortfolioTestimonial[];
  links: Array<{ label: string; href: string }>;
}

export interface SectionNode { id: string; type: SectionType; variant: string; visible: boolean; }

export interface PortfolioTheme {
  id: PortfolioThemeId;
  name: string;
  description: string;
  tone: 'quiet' | 'editorial' | 'visual' | 'structured' | 'expressive';
  defaultSections: SectionNode[];
  previewClass: string;
}

export interface PortfolioDocument {
  schemaVersion: 1;
  source: PortfolioSource;
  theme: PortfolioThemeId;
  profile: PortfolioProfile;
  sections: SectionNode[];
  settings: { accent: string; showAvailability: boolean; showContact: boolean; seoTitle?: string; seoDescription?: string; };
}

export interface PublishedPortfolioVersion { id: string; siteId: string; version: number; document: PortfolioDocument; publishedAt?: string; }

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Introduction', about: 'About', projects: 'Selected work', services: 'Services', experience: 'Experience', skills: 'Skills', testimonials: 'Testimonials', contact: 'Contact',
};

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
  { id: 'hero', type: 'hero', variant: 'split', visible: true }, { id: 'about', type: 'about', variant: 'narrow', visible: true },
  { id: 'projects', type: 'projects', variant: 'featured-grid', visible: true }, { id: 'services', type: 'services', variant: 'three-column', visible: true },
  { id: 'experience', type: 'experience', variant: 'timeline', visible: true }, { id: 'skills', type: 'skills', variant: 'inline', visible: true },
  { id: 'testimonials', type: 'testimonials', variant: 'single-feature', visible: true }, { id: 'contact', type: 'contact', variant: 'centered', visible: true },
];

export function createStarterPortfolio(): PortfolioDocument {
  return { schemaVersion: 1, source: 'visual', theme: 'minimal', profile: { name: 'Your Name', handle: 'yourname', headline: 'Independent professional building useful things.', bio: 'Tell people what you do, who you help and what makes your work different.', skills: ['Product', 'Strategy', 'Design'], services: [], projects: [], experience: [], testimonials: [], links: [] }, sections: DEFAULT_SECTIONS.map((section) => ({ ...section })), settings: { accent: '#171717', showAvailability: true, showContact: true, seoTitle: 'Your Name | Portfolio', seoDescription: 'Professional portfolio on SkillPage.' } };
}

export function isPortfolioDocument(value: unknown): value is PortfolioDocument {
  if (!value || typeof value !== 'object') return false;
  const document = value as Partial<PortfolioDocument>;
  if (document.schemaVersion !== 1 || !document.profile || typeof document.profile !== 'object' || !Array.isArray(document.sections)) return false;
  const profile = document.profile as Partial<PortfolioProfile>;
  if (!Array.isArray(profile.skills) || !Array.isArray(profile.projects) || !Array.isArray(profile.services) || !Array.isArray(profile.experience) || !Array.isArray(profile.testimonials)) return false;
  return document.sections.every((section) => !!section && typeof section.id === 'string' && typeof section.type === 'string' && typeof section.variant === 'string' && typeof section.visible === 'boolean');
}

export function clonePortfolio(document: PortfolioDocument): PortfolioDocument { return JSON.parse(JSON.stringify(document)) as PortfolioDocument; }
