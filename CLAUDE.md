# CLAUDE.md

## Toolchain
- Build: `npm run build`
- Build (dev): `npm run build:dev`
- Deploy: Cloudflare Pages — push to main branch, auto-deploys
- No linter, no automated test suite — manual testing via test/index.html

## Security Rules
- Never hardcode API keys or Supabase URLs — all config comes from the widget-config endpoint at runtime
- Never log customer names, phone numbers, or addresses anywhere in the code

## Forbidden Actions
- Do not refactor the build system — esbuild config lives entirely in package.json, do not add a config file
- Do not add external CSS files — all styles are injected via shell.js

## Category 5 — Known Landmines
(empty — grows only via two-strike rule with Board Chair approval)
