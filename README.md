# Biz Nihongo

A free, static website for learning business Japanese (ビジネス日本語), for English speakers.

- **Lessons**: dialogues, vocabulary, keigo / grammar / culture notes, quizzes
- **Flashcards**: spaced repetition (SM-2 style)
- **Keigo reference**: searchable 尊敬語 / 謙譲語 / 丁寧語 table
- **Email builder**: explained templates you fill in and copy
- **Study by level**: grammar, kanji and reading from JLPT N5 to N1
- **Progress**: streak, scores, activity chart, backup / restore

There's no backend, no login and no tracking. Progress lives in the learner's browser (`localStorage`), and learners can download a backup file. Audio uses the browser's built-in speech (Web Speech API).

## Run it locally

Requires Node.js 22.18 or newer (developed on Node 24).

```sh
npm install
npm run dev        # http://localhost:4321/edu-learn/
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built site |
| `npm run check` | Type check |
| `npm test` | Unit tests: SRS, grading, streaks, backups, **and validation of every content file** |
| `npm run test:e2e` | Browser tests: flows, accessibility audit (axe), screenshots at 375/768/1280 in light + dark |
| `npm run contrast` | WCAG contrast check of every color pairing |

First run of the browser tests: `npx playwright install chromium`.

If the dev server says it can't find a file you just created, restart it (`Ctrl+C`, then `npm run dev`).

## Deploy to GitHub Pages

1. Create a GitHub repository (for example `edu-learn`) and push this project to `main`.
2. In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`: type check, unit tests, contrast check, build, deploy.
   The site URL and base path come from GitHub automatically (`https://<user>.github.io/<repo>/`).

Pull requests run `.github/workflows/ci.yml`, which adds the browser tests and the accessibility audit.

A custom domain works too. Set it in Settings → Pages and the workflow builds with base path `/`.

## Adding content

Content lives in `/content` as Markdown and JSON, separate from the code:

```
content/
  lessons/          01-self-introduction.md …
  keigo/verbs.json
  emails/           01-greeting.md …
  grammar/n5 … n1/  one .md per grammar point
  kanji/            n5.json … n1.json
  reading/          n5-office-notice.md …
```

Japanese text uses furigana markup: `{漢字|かんじ}`, or `{名刺|めいし|meishi}` to make a word tappable (it links to vocabulary id `meishi`).

Every file starts with `reviewed: false` until a native speaker checks it. Uncertain points get a `needsReview: "…"` note, and `/review` lists them all. Run `npm test` after editing: it validates schemas, ids, links and quiz answers.

See [`CLAUDE.md`](CLAUDE.md) for the full content schema, design system and conventions.
