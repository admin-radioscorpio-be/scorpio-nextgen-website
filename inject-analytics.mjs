import { readFileSync, writeFileSync } from 'fs';

const BEACON = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "4fc7f960d6ed4dd18f3c206380c11b5b", "spa": true}'></script>`;
const file = 'dist/client/index.html';

const html = readFileSync(file, 'utf8');
if (html.includes('cloudflareinsights')) {
  console.log('Analytics beacon already present in', file);
} else {
  writeFileSync(file, html.replace('</head>', `  ${BEACON}\n</head>`));
  console.log('Analytics beacon injected into', file);
}
