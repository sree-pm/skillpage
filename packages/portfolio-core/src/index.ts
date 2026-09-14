export type PortfolioThemeId = 'minimal' | 'editorial' | 'studio' | 'professional' | 'bold';
export type PortfolioSource = 'visual' | 'generated' | 'uploaded_static';

export type SectionType =
  | 'hero'
  | 'about'
  | 'projects'
  | 'services'
  | 'experience'
  | 'skills'
  | 'testimonials'
  | 'contact';

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  role?: string;
  year?: string;
  imageUrl?: string;
  href?: string;
  tags: string[];
}

export interface PortfolioService {
  id: string;
  title: string;
  description: string;
  priceFrom?: string;
}

export interface PortfolioExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description?: string;
}

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
  testimonials: Array<{
    id: string;
    quote: string;
    name: string;
    role?: string;
  }>;
  links: Array<{ label: string; href: string }>;
}

export interface SectionNode {
  id: string;
  type: SectionType;
  variant: string;
  visible: boolean;
}

export interface PortfolioTheme {
  id: PortfolioThemeId;
  name: string;
  description: string;
  tone: 'quiet' | 'editorial' | 'visual' | 'structured' | 'expressive';
  defaultSections: SectionNode[];
}

export interface PortfolioDocument {
  schemaVersion: 1;
  source: PortfolioSource;
  theme: PortfolioThemeId;
  profile: PortfolioProfile;
  sections: SectionNode[];
  settings: {
    accent: string;
    showAvailability: boolean;
    showContact: boolean;
  };
}

export interface PublishedPortfolioVersion {
  id: string;
  siteId: string;
  version: number;
  document: PortfolioDocument;
  publishedAt?: string;
}

export const PORTFOLIO_THEMES: PortfolioTheme[] = [
  { id: 'minimal', name: 'Minimal', description: 'Quiet, precise and typography-led.', tone: 'quiet', defaultSections: [] },
  { id: 'editorial', name: 'Editorial', description: 'Elegant hierarchy with an editorial feel.', tone: 'editorial', defaultSections: [] },
  { id: 'studio', name: 'Studio', description: 'Project-first and visual.', tone: 'visual', defaultSections: [] },
  { id: 'professional', name: 'Professional', description: 'Structured, credible and versatile.', tone: 'structured', defaultSections: [] },
  { id: 'bold', name: 'Bold', description: 'Expressive typography with personality.', tone: 'expressive', defaultSections: [] },
];

export const DEFAULT_SECTIONS: SectionNode[] = [
  { id: 'hero', type: 'hero', variant: 'split', visible: true },
  { id: 'about', type: 'about', variant: 'narrow', visible: true },
  { id: 'projects', type: 'projects', variant: 'featured-grid', visible: true },
  { id: 'services', type: 'services', variant: 'three-column', visible: true },
  { id: 'experience', type: 'experience', variant: 'timeline', visible: true },
  { id: 'skills', type: 'skills', variant: 'inline', visible: true },
  { id: 'testimonials', type: 'testimonials', variant: 'single-feature', visible: true },
  { id: 'contact', type: 'contact', variant: 'centered', visible: true },
];

export function createStarterPortfolio(): PortfolioDocument {
  return {
    schemaVersion: 1,
    source: 'visual',
    theme: 'minimal',
    profile: {
      name: 'Your Name',
      handle: 'yourname',
      headline: 'Independent professional building useful things.',
      bio: 'Tell people what you do, who you help and what makes your work different.',
      skills: ['Product', 'Strategy', 'Design'],
      services: [],
      projects: [],
      experience: [],
      testimonials: [],
      links: [],
    },
    sections: DEFAULT_SECTIONS.map((section) => ({ ...section })),
    settings: { accent: '#171717', showAvailability: true, showContact: true },
  };
}

export function isPortfolioDocument(value: unknown): value is PortfolioDocument {
  if (!value || typeof value !== 'object') return false;
  const document = value as Partial<PortfolioDocument>;
  return document.schemaVersion === 1 && Array.isArray(document.sections) && typeof document.profile === 'object';
}
