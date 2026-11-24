import { defineConfig } from '@playwright/test';

// Tests run against the built static site (same files GitHub Pages serves).
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  workers: 4,
  timeout: 60_000,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4322/edu-learn/',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4322',
    url: 'http://localhost:4322/edu-learn/',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
