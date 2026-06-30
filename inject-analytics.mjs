import { readFileSync, writeFileSync } from 'fs';

const GA4 = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-24S74GYS8J"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-24S74GYS8J',{client_storage:'none',anonymize_ip:true,send_page_view:false});gtag('config','AW-670065704');</script>`;

const BEACON = `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "4fc7f960d6ed4dd18f3c206380c11b5b", "spa": true}'></script>`;

const file = 'dist/client/index.html';
let html = readFileSync(file, 'utf8');

if (!html.includes('G-24S74GYS8J')) {
  html = html.replace('</head>', `  ${GA4}\n</head>`);
  console.log('GA4 injected into', file);
} else {
  console.log('GA4 already present in', file);
}

if (!html.includes('cloudflareinsights')) {
  html = html.replace('</head>', `  ${BEACON}\n</head>`);
  console.log('Cloudflare beacon injected into', file);
} else {
  console.log('Cloudflare beacon already present in', file);
}

writeFileSync(file, html);
