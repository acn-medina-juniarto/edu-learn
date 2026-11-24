// Run with: npm run contrast   (Node >= 22.18 runs .ts via type stripping)
import { readFileSync } from 'node:fs';
import { checkPairings, parseThemeTokens } from '../src/lib/contrast.ts';

const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const results = checkPairings(parseThemeTokens(css));

let failed = 0;
for (const r of results) {
  const mark = r.pass ? 'PASS' : 'FAIL';
  if (!r.pass) failed++;
  console.log(
    `${mark}  ${r.theme.padEnd(5)}  ${r.ratio.toFixed(2).padStart(5)}:1 (min ${r.min})  ` +
      `${r.fg} ${r.fgHex} on ${r.bg} ${r.bgHex}  — ${r.use}`,
  );
}
console.log(`\n${results.length - failed}/${results.length} pairings pass.`);
process.exit(failed ? 1 : 0);
