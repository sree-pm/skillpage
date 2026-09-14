import { describe, expect, it } from 'vitest';
import { DEFAULT_SECTIONS, clonePortfolio, createStarterPortfolio, isPortfolioDocument } from './index';

describe('portfolio document', () => {
  it('creates a valid starter document', () => {
    const document = createStarterPortfolio();
    expect(isPortfolioDocument(document)).toBe(true);
    expect(document.sections).toHaveLength(DEFAULT_SECTIONS.length);
  });

  it('deep clones documents', () => {
    const original = createStarterPortfolio();
    const copy = clonePortfolio(original);
    copy.profile.name = 'Changed';
    expect(original.profile.name).toBe('Your Name');
  });

  it('rejects malformed documents', () => {
    expect(isPortfolioDocument({ schemaVersion: 2 })).toBe(false);
    expect(isPortfolioDocument({ schemaVersion: 1, profile: {}, sections: [] })).toBe(false);
  });
});
