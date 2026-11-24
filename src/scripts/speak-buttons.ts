/**
 * Global handler: any element with data-speak="…" plays that Japanese text.
 * Loaded once from Base.astro. Uses event delegation, so buttons rendered
 * later (e.g. inside the word popup) work too.
 */
import { speak } from '@/lib/speech';

document.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-speak]');
  if (!btn) return;
  const text = btn.dataset.speak ?? '';
  if (!text) return;
  speak(text);
});
