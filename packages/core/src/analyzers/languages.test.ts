import { describe, expect, it } from 'bun:test';

import { processLanguages } from './languages';

describe('processLanguages', () => {
  it('sorts languages by bytes and computes percentages', () => {
    const result = processLanguages({ TypeScript: 600, JavaScript: 400 });

    expect(result.primaryLanguage).toBe('TypeScript');
    expect(result.langs[0]?.name).toBe('TypeScript');
    expect(result.langs[0]?.percent).toBe(60);
    expect(result.langs[1]?.percent).toBe(40);
  });

  it('uses fallback color for unknown language', () => {
    const result = processLanguages({ UnknownLang: 100 });
    expect(result.langs[0]?.color).toBe('#8b8b8b');
  });
});
