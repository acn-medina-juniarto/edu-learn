/** Data passed from the Astro page to the flashcard island (serializable). */
export interface CardData {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  pos: string;
  politeness: { en: string; ja: string } | null;
  exampleJa: string;
  exampleEn: string;
  lessonId: string;
  lessonTitle: string;
  category: string;
}

export interface LessonInfo {
  id: string;
  order: number;
  title: string;
  category: string;
  href: string;
  vocabIds: string[];
}
