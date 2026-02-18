import type { GitHubLanguage } from '../client/github-types';
import type { LanguageAnalysis } from '../types';
import { LANGUAGE_COLORS } from '../utils/language-utils';

export function processLanguages(languages: GitHubLanguage): LanguageAnalysis {
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  const langs = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percent: Math.round((bytes / totalBytes) * 1000) / 10,
      color: LANGUAGE_COLORS[name] ?? '#8b8b8b',
    }));

  return {
    primaryLanguage: langs[0]?.name || null,
    langs,
  };
}
