import type { PortfolioDocument, SectionType } from './index';

const SECTION_TYPES: SectionType[] = ['hero','about','projects','services','experience','skills','testimonials','contact'];
const HANDLE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const URL_PROTOCOL = /^(https?:\/\/|mailto:|tel:)/i;

export function validatePortfolioDocument(value: unknown): { valid: true; document: PortfolioDocument } | { valid: false; errors: string[] } {
  const errors: string[] = [];
  if (!value || typeof value !== 'object') return { valid: false, errors: ['Document must be an object'] };
  const d = value as Partial<PortfolioDocument>;
  if (d.schemaVersion !== 1) errors.push('Unsupported schema version');
  if (!['visual','generated','uploaded_static'].includes(d.source as string)) errors.push('Invalid source');
  if (!['minimal','editorial','studio','professional','bold'].includes(d.theme as string)) errors.push('Invalid theme');
  if (!d.profile || typeof d.profile !== 'object') errors.push('Profile is required');
  if (!Array.isArray(d.sections)) errors.push('Sections are required');
  if (d.profile && typeof d.profile === 'object') {
    const p = d.profile as PortfolioDocument['profile'];
    if (!p.name?.trim()) errors.push('Name is required');
    if (!p.handle || !HANDLE.test(p.handle)) errors.push('Invalid public handle');
    if (!p.headline?.trim()) errors.push('Headline is required');
    for (const [label, list] of [['skills', p.skills],['projects',p.projects],['services',p.services],['experience',p.experience],['testimonials',p.testimonials]] as const) if (!Array.isArray(list)) errors.push(`${label} must be an array`);
    for (const link of p.links || []) if (!link.label?.trim() || !URL_PROTOCOL.test(link.href || '')) errors.push('Invalid profile link');
  }
  if (Array.isArray(d.sections)) {
    const ids = new Set<string>();
    for (const s of d.sections) {
      if (!s.id || ids.has(s.id)) errors.push('Section IDs must be unique');
      ids.add(s.id);
      if (!SECTION_TYPES.includes(s.type)) errors.push(`Invalid section type: ${s.type}`);
      if (typeof s.variant !== 'string' || typeof s.visible !== 'boolean') errors.push(`Invalid section: ${s.id}`);
    }
  }
  return errors.length ? { valid: false, errors } : { valid: true, document: value as PortfolioDocument };
}
