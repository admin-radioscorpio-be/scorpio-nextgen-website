import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { defineConfig, fontProviders } from "astro/config";

// To add EmDash CMS back:
// 1. npm install emdash @emdash-cms/cloudflare @emdash-cms/plugin-forms
// 2. Import: import emdash from "emdash/astro"; import { d1, r2, sandbox } from "@emdash-cms/cloudflare";
// 3. Add to integrations: emdash({ database: d1({ binding: "DB" }), storage: r2({ binding: "MEDIA" }), ... })
// 4. Restore D1 + R2 + worker_loaders bindings in wrangler.jsonc

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-sans",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
