// Records video/v2-sidebar-mock.html frame by frame (exact, not real time).
// Mock timeline: video t = 17.0 to 46.0 at 30 fps = 870 frames, written as frames/f0000.png ... f0869.png.
// Run with NODE_PATH pointing at a node_modules that has playwright.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const T_START = 17.0;
const T_END = 46.0;
const OUT_DIR = process.argv[2] || 'frames';

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const url = 'file://' + path.resolve(__dirname, 'v2-sidebar-mock.html') + '?manual';
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  const frames = Math.round((T_END - T_START) * FPS);
  for (let i = 0; i < frames; i++) {
    const t = T_START + i / FPS;
    await page.evaluate((s) => {
      window.__seek(s);
      return new Promise((r) => requestAnimationFrame(() => r()));
    }, t);
    await page.screenshot({ path: path.join(OUT_DIR, 'f' + String(i).padStart(4, '0') + '.png'), type: 'png' });
  }
  await browser.close();
  console.log('recorded ' + frames + ' frames to ' + OUT_DIR);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
