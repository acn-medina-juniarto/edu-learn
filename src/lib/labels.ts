/** Human-readable labels for schema enums. */
export const POS_LABELS: Record<string, string> = {
  noun: 'noun',
  // Romaji, not kana: these labels are English text (kana would need lang="ja")
  'suru-noun': 'noun / suru-verb',
  'verb-godan': 'verb (godan)',
  'verb-ichidan': 'verb (ichidan)',
  'verb-irregular': 'verb (irregular)',
  'i-adj': 'i-adjective',
  'na-adj': 'na-adjective',
  adverb: 'adverb',
  expression: 'expression',
  counter: 'counter',
  prefix: 'prefix',
  suffix: 'suffix',
  pronoun: 'pronoun',
  conjunction: 'conjunction',
};

export const POLITENESS_LABELS = {
  neutral: { en: 'Neutral', ja: '' },
  casual: { en: 'Casual', ja: 'タメ口' },
  teinei: { en: 'Polite', ja: 'です・ます' },
  keigo: { en: 'Keigo', ja: '敬語' },
} as const;

export const NOTE_LABELS = {
  grammar: { en: 'Grammar', ja: '文法', category: 'meetings' },
  keigo: { en: 'Keigo', ja: '敬語', category: 'keigo' },
  culture: { en: 'Culture', ja: '文化', category: 'phone' },
} as const;
