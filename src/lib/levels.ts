/** JLPT levels, easiest first, with the candy accent each one uses (fills only). */
export const LEVELS = {
  N5: { label: 'N5', name: 'Beginner', accent: 'matcha', blurb: 'Basic phrases, です・ます, everyday office words.' },
  N4: { label: 'N4', name: 'Elementary', accent: 'ramune', blurb: 'Common patterns for internal emails and meetings.' },
  N3: { label: 'N3', name: 'Intermediate', accent: 'sunny', blurb: 'Notices, polite requests, explaining reasons.' },
  N2: { label: 'N2', name: 'Upper-intermediate', accent: 'sakura', blurb: 'Formal emails, reports, contracts.' },
  N1: { label: 'N1', name: 'Advanced', accent: 'primary', blurb: 'Formal letters, announcements, near-native nuance.' },
} as const;

export type Level = keyof typeof LEVELS;
export const LEVEL_IDS = Object.keys(LEVELS) as Level[];
/** CSS class that sets --accent for a level */
export const levelClass = (l: Level) =>
  LEVELS[l].accent === 'primary' ? 'cat-primary' : `level-${LEVELS[l].accent}`;
