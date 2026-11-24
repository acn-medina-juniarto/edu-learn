/** Lesson categories and their accent colors (CSS class `cat-<id>` sets --accent). */
export const CATEGORIES = {
  meetings: { label: 'Meetings', labelJa: '会議・面会', accent: 'matcha' },
  phone: { label: 'Phone', labelJa: '電話', accent: 'ramune' },
  email: { label: 'Email', labelJa: 'メール', accent: 'sunny' },
  keigo: { label: 'Keigo', labelJa: '敬語', accent: 'sakura' },
} as const;

export type Category = keyof typeof CATEGORIES;
export const CATEGORY_IDS = Object.keys(CATEGORIES) as Category[];
