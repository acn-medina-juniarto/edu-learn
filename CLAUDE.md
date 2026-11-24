# Biz Nihongo — CLAUDE.md

A free, static website that teaches business Japanese (ビジネス日本語) to English speakers.
UI and explanations are in English; learning content is Japanese with furigana and a
toggleable English translation. Target: JLPT N5–N3 learners who need Japanese for work,
with study sections reaching N2–N1.

## Hard constraints
- 100% free: no paid APIs, no backend, no database, no login.
- Static output, deployed to GitHub Pages under base path `/edu-learn/`.
- Progress lives in `localStorage` (keys prefixed `bj:v1:`).
- All lesson content lives in `/content` (Markdown/JSON), never in components.
- Mobile-first, accessible: keyboard navigation, WCAG AA contrast, `lang="ja"` on Japanese text, tap targets ≥ 44px.

## Stack
| | |
|---|---|
| Framework | Astro 7 (static) + TypeScript (strict) |
| Interactivity | Preact islands only where needed (quiz, flashcards, email builder, keigo search, word popup) |
| Styling | Tailwind v4. Tokens are CSS variables in `src/styles/global.css` (`@theme inline`), **not** `tailwind.config` |
| Fonts | @fontsource (self-hosted): Fredoka (EN headings), Inter (EN body), Noto Sans JP (JA), Zen Maru Gothic (JA headings) |
| Audio | Web Speech API `ja-JP` (`src/lib/speech.ts`) |
| Tests | Vitest (`tests/unit`), Playwright (`tests/e2e`, runs against the built site) |

## Commands
```
npm run dev        # dev server → http://localhost:4321/edu-learn/
npm run build      # static build → dist/
npm run preview    # serve dist/
npm run check      # astro type check
npm test           # unit tests (Vitest)
npm run test:e2e   # build + flows, axe audit, screenshots at 375/768/1280 (light+dark), overflow/tap-target/contrast checks
npm run contrast   # WCAG check of every token pairing in global.css (light + dark)
```
Screenshots go to `screenshots/` (git-ignored). `/design` is the living style guide.

## Folder structure
```
content/            lesson + study content (Phase 2+)
src/lib/            pure TS, no DOM where possible, unit-tested
  furigana.ts       {漢字|かんじ|vocabId} parser → ruby HTML / plain / reading
  contrast.ts       WCAG helpers + PAIRINGS list (shared by /design and npm run contrast)
  schemas.ts        Zod schemas for all content types
  integrity.ts      cross-field content checks
  content.ts        getLessons() (validated, sorted) + reviewItems()
  inline.ts         renderInline: furigana → ruby + auto lang="ja" (no deps, safe for islands)
  richtext.ts       renderMarkdown (build time only, uses marked) + re-exports renderInline
  grading.ts        quiz grading, answer normalization, shuffling, scoring
  srs.ts            SM-2 scheduler, date keys, queue building
  email.ts          email template rendering (HTML preview / plain text)
  search.ts         search normalization (keigo reference)
  streak.ts         streak status + kind messages
  activity.ts       readActivity(): progress + deck combined (browser)
  backup.ts         export / validate / restore / reset of bj:v1:* data
  levels.ts         JLPT level metadata + accent classes
  deck.ts           bj:v1:deck storage + pure deck helpers
  progress.ts       bj:v1:progress (lessons completed, active days) + pure helpers
  labels.ts         display labels for pos / politeness / note types
src/scripts/speak-buttons.ts   global [data-speak] click handler (loaded by Base.astro)
  prefs.ts          theme / furigana / english prefs ↔ data-* on <html>
  speech.ts         Web Speech wrapper
  confetti.ts       confetti burst + animation replay (no-op with reduced motion)
  categories.ts     lesson categories → accent colors
  types.ts          shared types (Politeness, JlptLevel, Accent)
src/components/
  ui/               Button, Card, Badge, Icon, ProgressBar, SectionHeading, StreakSticker
  ja/               Ja (pure Japanese, furigana), Mixed (English + Japanese, optional Markdown), PolitenessTag
  lesson/           DialogueBubble, LessonToolbar (sticky), VocabCard, NoteBlock, WordPopup, LessonComplete
  quiz/             FeedbackPanel (static, style guide); Preact island: QuizRunner, MultipleChoiceQ,
                    FillBlankQ, SentenceOrderQ, QuizFeedback, Rich (JaText/MixedText helpers)
  flashcards/       FlashcardFace, RatingBar (static, style guide), AddCardButton;
                    Preact island: Deck, Flashcard, types
  mascot/           Tanuki (poses: wave, card, cheer, sleepy)
  design/           Sampler (forced-theme preview for /design)
src/layouts/Base.astro   html shell, fonts, pre-paint prefs script, header
src/pages/          index (home), design, lessons/index, lessons/[slug], lessons/[slug]/quiz, flashcards,
                    keigo, email, progress, study, grammar/index, grammar/[id], kanji, reading/index,
                    reading/[id], review
content/            lessons/, keigo/, emails/, grammar/n5…n1/, kanji/n5…n1.json, reading/
src/components/progress/   ProgressDashboard, ActivityChart (Preact)
src/components/ui/LiveStreak.astro   streak sticker filled from saved activity
src/components/email/EmailBuilder.tsx   Preact island
src/scripts/deck-buttons.ts    global [data-add-card] handler (loaded by Base.astro)
scripts/            check-contrast.ts (run by Node type stripping)
tests/unit, tests/e2e
```

## Design system ("Tokyo konbini pop")
- Tokens: `paper, surface, surface-2, ink, ink-soft, line, shadow, primary, on-primary, primary-soft, sakura, sunny, matcha, ramune, on-accent, success(-bg), error(-bg), focus`. Light values on `:root, [data-theme='light']`, dark on `[data-theme='dark']`. Any element can force a theme with `data-theme`.
- **Candy accents are fills only**; text on them is always `on-accent`. Japanese body text sits on `surface`/`paper`/`surface-2`, never on a saturated fill.
- Category accents via class `cat-<id>` (sets `--accent`): meetings = matcha, phone = ramune, email = sunny, keigo = sakura. Lessons 4–5 (requests, apologies) use `keigo`.
- Shapes: 16px cards (`.sticker-card`), 12px buttons (`.btn`), 999px badges (`.badge`). 2px `line` outline, hard 4px offset shadow. Buttons press down on `:active`.
- Japanese sizes: `.ja-body` 19px/2.0, `.ja-dialogue` 22px/2.05, `.ja-card` 52px/1.9. Ruby line-height must stay ≥ 1.9.
- Feedback: never color alone, always icon + text. Correct = `.anim-bounce` + confetti; wrong = `.anim-shake` + friendly explanation. All motion disabled under `prefers-reduced-motion`.
- Mascot "Pon-san" (original tanuki in a suit): home, empty states, lesson complete. One per screen max.
- Prefs: `<html data-theme data-furigana data-english>`; CSS hides `rt` / `.en-translation` when off.

## Furigana markup (used in all Japanese strings)
- `{名刺|めいし}` → ruby
- `{名刺|めいし|meishi}` → ruby + tappable, links to vocab id `meishi`
- `{はじめまして||hajimemashite}` → no ruby, tappable
- Readings are derived from the markup (`toReading`); don't duplicate them. Exception: set a dialogue line's `reading` to control pronunciation (it also drives audio).

## Content rules
- Every content file has `reviewed: false` until a native speaker checks it.
- Unsure about a reading/nuance/usage → add a `needsReview: "..."` note; never guess.
- Always state politeness: `casual | teinei (です・ます) | keigo`.
- Natural business Japanese; write everything originally (no copying textbooks/sites).
- **Quote every Japanese string in YAML** (`"..."`): a value starting with `{` is otherwise parsed as a YAML map.
- Note bodies are Markdown + furigana. Convert furigana to ruby **before** Markdown parsing, because the `|` in `{漢字|かな}` would otherwise break Markdown tables.

## Style rulings (from native-speaker review, 2026-11-24)
Follow these in all new content; don't re-flag them as needs-review.
- **いただけますでしょうか** is fine. Don't call it incorrect double keigo. Mention いただけますか as the simpler alternative.
- **了解しました** is not inherently wrong (fine among colleagues). For superiors and clients, teach **承知いたしました** (or 承知しました / かしこまりました) as the preferred, safer form. Keep the nuance.
- **とんでもございません** is acceptable in modern business Japanese. Don't mark it incorrect.
- **取り急ぎ** is acceptable for genuinely quick or preliminary messages. Explain that it can feel abrupt in more formal contexts.
- **各位** is used without 様. Never 各位様.
- **お手数** is read おてすう.
- **もしもし**: generally avoid it on formal business calls (answering or calling). Teach proper self-identification instead.
- **Business-card etiquette**: present it as common professional conventions, not rigid universal rules. Frame finer or possibly outdated customs as "some offices do this".
- **Speech (TTS)**: pronunciation is browser/OS dependent, so never claim a fixed Web Speech pronunciation. For numbers, dates and codes, set the line's `reading` to a controlled kana string; audio uses `reading` when present.

## Content schema
Zod schemas live in `src/lib/schemas.ts` (shared by the build and the tests). `src/content.config.ts` registers collections. Only `lessons` is registered so far; grammar/kanji/keigo/emails get registered when their first files exist.

**Lesson** = `content/lessons/NN-slug.md`, all structured data in frontmatter, optional Markdown body = intro paragraph.
```yaml
id, order, title, titleJa, summary
category: meetings | phone | email | keigo
level: N5..N1
politeness: casual | teinei | keigo
minutes: 3..20
objectives: [1-5 strings]
reviewed: false
vocab: [8-12 × { id, word, reading (kana only), meaning, pos, politeness (neutral|casual|teinei|keigo),
                 example: { ja, en, politeness }, related?, needsReview? }]
dialogue: { setting, speakers: [{ id, name, nameJa, role }],
            lines: [≥4 × { speaker, ja, en, politeness, reading?, note?, needsReview? }] }
notes: [{ type: grammar|keigo|culture, title, level?, body (md), needsReview? }]
quiz: [≥3 of:
  { id, type: multiple-choice, prompt, promptJa?, choices: [{ ja?|text?, correct?, feedback? }], explanation }
  { id, type: fill-blank, prompt, ja (exactly one ___), en, answers: [..], hint?, explanation }
  { id, type: sentence-order, prompt, tokens: [3-8, in correct order], en, explanation } ]
```
- `pos`: noun, suru-noun, verb-godan, verb-ichidan, verb-irregular, i-adj, na-adj, adverb, expression, counter, prefix, suffix, pronoun, conjunction.
- Vocab ids are **globally unique** (they are flashcard ids) and lowercase-kebab-case.
- Other schemas already defined: `grammarPoint`, `kanjiFile`/`kanjiEntry`, `keigoEntry`, `emailTemplate`.

**Integrity checks** (`src/lib/integrity.ts`), run by `npm test` and during the build (`getLessons()` in `src/lib/content.ts` throws):
unique vocab ids (global) and quiz ids, unique lesson `order`, known speakers, balanced furigana braces, `{x|y|id}` links that resolve to a vocab id in any lesson, no ruby whose reading equals its base, exactly one correct MC choice, and feedback on every wrong choice.

**Adding a lesson:** copy a file in `content/lessons/`, change `id`/`order`, then run `npm test`. It appears on `/lessons` and its review notes on `/review` automatically.

## Lesson page behaviour
- Order: header (badges, objectives, section links) → dialogue → vocabulary → notes (keigo, grammar, culture) → finish → prev/next.
- In dialogues, the speaker with id `me` sits on the right. Other speakers use the category accent.
- Audio: each line's `data-line-speech` = `reading` if set, else plain text. "Play dialogue" reads all lines in order and highlights the current one.
- Word popup: `{x|y|id}` renders `.vocab-word` buttons. The popup holds all site vocab, so links can point to other lessons. It's a bottom sheet under 640px; Escape restores focus.
- "Finish lesson" writes to `bj:v1:progress` and records today's date in `activeDays` (used for streaks in Phase 7).
- Use `Ja` for text that is entirely Japanese and `Mixed` for English with Japanese inside (notes, explanations, objectives), so Japanese always gets `lang="ja"`.

## Quiz
- Page: `/lessons/[slug]/quiz`, rendered by the Preact island `src/components/quiz/QuizRunner.tsx` (`client:only`, because choices and word banks are shuffled per attempt). Mascots are passed in as Astro named slots (`mascotCheer`, `mascotWave`).
- Grading is pure and unit-tested in `src/lib/grading.ts`:
  - `normalizeAnswer`: NFKC, strip markup, whitespace and edge punctuation; katakana folded to hiragana. Kanji are not converted, so list every accepted spelling in `answers`.
  - Fill-blank: a match against any listed answer. One character off an answer of 3+ characters → "Close! Check the spelling."
  - Sentence order: compares the joined text, so identical duplicate tokens work either way.
  - `shuffledIndices` never returns the original order (the correct MC choice is often listed first in content).
- Flow: one question per screen. "Check answer" is disabled until there's an answer. Feedback always gives an icon, a heading, the chosen choice's `feedback`, the correct answer, and the `explanation`. Correct → bounce + confetti; wrong → shake. Number keys 1–5 pick an MC option; Enter checks or goes next. A fill-blank answer is never submitted while a Japanese IME is composing.
- Score is saved in `bj:v1:progress.quizzes[lessonId] = { best, last }` (0..1) and records an active day. The lesson header shows the best score.
- Browser-only code (`QuizRunner` and anything it imports) must not import `richtext.ts` (it pulls in the Markdown parser). Use `inline.ts`.

## Flashcards (spaced repetition)
- Scheduler: `src/lib/srs.ts`, pure and unit-tested. SM-2 style with local calendar days (`YYYY-MM-DD`, noon-anchored so DST can't shift them):
  - **Again** (q0): lapse. reps reset, ease −0.20, due today, and the card is shown again this session (at most 2 extra times).
  - **Hard** (q3): ease −0.14, interval ×1.2 (at least +1 day, always below Good).
  - **Good** (q4): intervals 1 → 3 → previous × ease.
  - **Easy** (q5): ease +0.15, first interval 4 days, then previous × ease × 1.3.
  - Ease floor 1.3, interval cap 365 days. For a brand-new card, Hard and Good both give 1 day.
- Deck: `src/lib/deck.ts` → `bj:v1:deck = { version, cards: { [vocabId]: CardState }, reviewsByDay }`. `writeDeck` fires `deck:change` on `document`.
- Cards are added by:
  - "Finish lesson" (adds all of that lesson's vocab)
  - `AddCardButton` on vocab cards and in the word popup (`[data-add-card]`, handled globally by `src/scripts/deck-buttons.ts`)
  - "Add N words" in the deck manager on `/flashcards`
- `/flashcards` is the Preact island `src/components/flashcards/Deck.tsx` (`client:only`). Queue = overdue reviews (oldest first), then new cards (by date added). There's no daily new-card limit yet.
- The card front shows the word only. The back shows reading, meaning, politeness, example and audio. The hidden face is `inert` + `aria-hidden`. Keys: Space/Enter flips; 1–4 rate.
- Header nav (Lessons / Cards) shows a cards-due badge, updated on `deck:change`.

## Keigo reference
- Content: `content/keigo/*.json` = `{ reviewed, notes: Note[], entries: KeigoEntry[] }` (schema `keigoFile`). An entry has `id, plain, meaning, sonkeigo[], kenjougo[], teineigo, examples[], notes?, needsReview?`. An empty array means "no special form" and is shown as "—".
- Page `/keigo`: a static table that works without JS. Search runs in the browser (`src/lib/search.ts`):
  - NFKC, lower-case, katakana → hiragana
  - furigana expanded to both kanji and reading, so `いう`, `言う` and `say` all find 言う
  - every term must match; `?q=` pre-fills the search; `/` focuses the box
- Below 768px the table becomes stacked cards with `data-label` captions.

## Email builder
- Content: `content/emails/NN-id.md`, frontmatter only (`emailTemplate`): `id, order, category, title, titleJa, summary, subject, fields[{key,label,placeholder,exampleJa}], blocks[{role,ja,en,explanation,politeness}]`. `{{fieldKey}}` placeholders may appear in `subject` and block `ja`. `\n` breaks lines. The README in that folder isn't loaded (pattern `[0-9]*.md`).
- Integrity (`checkEmail`): every placeholder has a field, every field is used, keys are unique, and furigana is valid.
- Rendering (`src/lib/email.ts`, unit-tested):
  - `renderHtml`: ruby for template text, `<mark class="email-field">` for values (always escaped), and dashed `〔placeholder〕` for empty fields.
  - `renderText` / `composeEmail`: plain text for copying, with no furigana.
- Page `/email`: the Preact island `EmailBuilder.tsx` (`client:load`). Field values are saved in `bj:v1:email-fields` and shared across templates (common keys: clientCompany, clientDept, clientName, myCompany, myDept, myName, myPhone, myEmail). The template can be picked via a URL hash (`/email#apology`). If the clipboard is blocked, the "plain text" box opens instead.
- The `/review` page also lists keigo and email `needsReview` notes.

## Home, streaks and progress
- **Study day** = finished a lesson, took a quiz, or reviewed a flashcard: the union of `progress.activeDays` and the keys of `deck.reviewsByDay` (`src/lib/activity.ts` → `readActivity()`).
- **Streak** (`src/lib/streak.ts`, unit-tested). Messages are always kind, never guilt:
  - `active`: studied today
  - `pending`: studied yesterday, so the streak is still alive ("A quick session today keeps it going.")
  - `broken`: "Welcome back! Every day is a fresh start."
  - `none`: never studied
- **Home** (`/`): rendered for a first-time visitor, then personalized by an inline script.
  - Time-of-day greeting.
  - `LiveStreak` sticker.
  - Continue card with the one primary action: the next unfinished lesson, or "Review flashcards" when all are done.
  - Cards-due card.
  - Lesson path with done / next / upcoming states and best quiz score.
  - Study tools.
- **Progress** (`/progress`): the Preact island `ProgressDashboard.tsx` (`client:only`).
  - Streak and a 7-day row.
  - 4 stat tiles.
  - `ActivityChart`: reviews per day for the last 14 days. Single series so no legend, direct labels only on today and the peak, hover/focus tooltip, table view.
  - Per-lesson completion and best quiz score.
- **Backups** (`src/lib/backup.ts`, unit-tested): a JSON file `{ app: 'biz-nihongo', version: 1, exportedAt, data: { 'bj:v1:*': … } }`.
  - Restore validates the file, shows a summary in a `<dialog>`, then replaces the data.
  - Reset removes only `bj:v1:*` keys, after a confirm dialog.
  - Nothing is uploaded.
- **Header nav**: Lessons, Cards (due badge), Keigo, Email, Progress. Under 768px it sits on its own row and scrolls sideways rather than widening the page. The screen check seeds a due badge to test this worst case.

## Study sections (JLPT N5 → N1)
Levels live in `src/lib/levels.ts`: N5 matcha, N4 ramune, N3 sunny, N2 sakura, N1 primary. Use the `levelClass()` / `LevelBadge` / `LevelNav` components.
- **Grammar**: `content/grammar/<n5…n1>/<id>.md`.
  - Frontmatter (`grammarPoint`): `id, order (within level), pattern, level, meaning, formation, politeness, examples[≥2], related[], lesson?, reviewed`.
  - The Markdown body is the explanation, rendered with `renderMarkdown` so furigana works.
  - Checks: the folder must match `level`, `related` and `lesson` ids must exist, and `order` must be unique within a level.
  - Pages: `/grammar` (grouped by level) and `/grammar/[id]`.
- **Kanji**: `content/kanji/n5.json … n1.json` (`kanjiFile` = `{ level, reviewed, kanji[] }`).
  - Each entry: `char, meanings, onyomi (katakana), kunyomi (hiragana, "-" marks okurigana → shown as あ.う), strokes, examples[{word, reading, meaning}]`.
  - Checks: one file per level, no kanji listed twice, and every kanji appears in at least one of its examples.
  - JLPT has no official kanji list since 2010, so levels follow common study lists (the page says so).
  - Page: `/kanji`.
- **Reading**: `content/reading/<level>-<slug>.md`, frontmatter only (`readingPassage`): `id, level, title, titleJa, summary, genre, politeness, minutes, paragraphs[{ja, en}], glossary[{word, reading, meaning}], questions[quiz]`.
  - Pages: `/reading` and `/reading/[id]`. The detail page has a toolbar with "Play text", paragraph audio, a glossary, and `QuizRunner`.
  - Scores are saved under `progress.quizzes['reading-<id>']`.
- **Hub**: `/study` shows the three sections and a level × section matrix. The nav item "Study" is current on `/study`, `/grammar`, `/kanji` and `/reading`.
- **Sample size so far**: 2 grammar points, 3 kanji and 1 reading per level, all `reviewed: false`.

## Deploy (GitHub Pages)
- `astro.config.mjs` reads `SITE_URL` and `BASE_PATH` from the environment. When unset, local dev runs at `/edu-learn/`. An empty `BASE_PATH` means `/` (user site or custom domain).
- `.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` → check → unit tests → contrast → build (with `SITE_URL`/`BASE_PATH` from `actions/configure-pages`) → deploy. One-time setup: Settings → Pages → Source = GitHub Actions.
- `.github/workflows/ci.yml` runs on pull requests: everything above plus the Playwright suite. Screenshots are uploaded as an artifact.
- `src/pages/404.astro` → `dist/404.html` (GitHub Pages serves it for unknown URLs).
- Never hard-code `/edu-learn` in `src/`; always use `import.meta.env.BASE_URL`.

## Accessibility (enforced by tests)
- `tests/e2e/a11y.spec.ts` runs axe-core (WCAG 2.2 A/AA + best practices) on every page in light/dark at 375 and 1280px. It also covers interactive states: word popup, quiz feedback, flashcard back, reset dialog, empty search, toggles off.
- The same file checks that the skip link is the first Tab stop, and that every kana/kanji text node sits inside `lang="ja"`.
- Rules learned from the audit:
  - one `<h1>` per page (`SectionHeading level={1}`) and no skipped heading levels
  - the sticky toolbar is a labelled `region`
  - a visible button label must be the start of its accessible name: don't put `aria-label` on buttons with visible text, add `sr-only` text instead
  - scrollable containers get `tabindex="0"` + `role="region"` + a label
  - no role="button" wrapper around other buttons
  - English UI labels use romaji, not kana (`suru-verb`, `i-adjective`), so text never needs `lang="ja"` mid-label
  - dimmed quiz options use opacity 0.75, which keeps 4.5:1

## Conventions
- Small, typed components; props via `interface Props`. Shared types live in `src/lib/types.ts` (not exported from `.astro` files).
- Internal links use `import.meta.env.BASE_URL`.
- Any new color pairing → add it to `PAIRINGS` in `src/lib/contrast.ts` and run `npm run contrast`.
- Fills whose text isn't `--on-accent` (e.g. `.cat-primary`) set `--accent-ink`. `.badge` and `.btn-accent` use `var(--accent-ink, var(--on-accent))`. The e2e screen check also measures rendered contrast on `.badge`, `.btn` and `.option`.
- A link stretched over a whole card uses `.stretched-link` (the tap-target check measures the card instead). The check also skips inline links inside running text (WCAG 2.5.8 exception), and measures checkboxes/radios by their `<label>`.
- After any screen change: `npm run test:e2e` and review the screenshots.

## Roadmap
1. ✅ Scaffold + design tokens + `/design` style guide
2. ✅ Content schemas + 5 starter lessons (+ `/lessons` index, `/review` checklist)
3. ✅ Lesson page
4. ✅ Quiz (+ grading tests)
5. ✅ Flashcards (SM-2 + tests)
6. ✅ Keigo reference + email builder
7. ✅ Home + progress + backup/restore
8. ✅ Grammar / Kanji / Reading sections (N5→N1), sample content
9. ✅ Deploy workflow (GitHub Actions) + axe accessibility audit + 404, footer, meta tags, README (awaiting first push)
10. (Proposed, not decided) Optional cross-device sync: an account-free "sync code" on Cloudflare Workers + KV, with the browser kept as the main store. It would change the "no backend" constraint, so it needs the owner's go-ahead.
