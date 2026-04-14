# PersonaLift

PersonaLift is a Next.js prototype that personalizes an existing landing page based on an ad creative while preserving the original layout, branding, and core UI.

## What it does

- Accepts either an ad URL or ad image
- Accepts a landing page URL
- Analyzes the ad for audience, tone, intent, hooks, and keywords
- Analyzes the page for hero content, CTAs, sections, and proof signals
- Applies bounded CRO-oriented changes to the same page instead of generating a net-new page
- Shows original and personalized previews side by side

## Architecture

- `app/api/generate/route.ts`: API entrypoint
- `lib/personalization/ad-analyzer.ts`: ad understanding
- `lib/personalization/page-analyzer.ts`: DOM and content analysis
- `lib/personalization/personalization-engine.ts`: bounded change planning
- `lib/personalization/renderer.ts`: safe HTML transformation
- `components/personalization-studio.tsx`: main UI

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Optional: configure multimodal ad analysis:

```bash
cp .env.example .env.local
```

Set `OPENROUTER_API_KEY` if you want the ad analyzer to use a real model for richer text and image understanding.

3. Run the app:

```bash
npm run dev
```

4. Open:

```text
http://localhost:3000
```

## Vercel deployment

1. Push this project to a Git repository.
2. Import the repository into Vercel.
3. Framework preset: `Next.js`
4. Build command: `next build`
5. Output setting: leave default for Next.js
6. Add environment variables if needed:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL`

## Notes

- The prototype includes a bundled sample landing page so demos still work when a live page cannot be fetched.
- Live fetches may fail for some sites due to anti-bot protections, CSP rules, or unusual HTML structure.
- Image-based ad analysis is conservative unless a multimodal provider is configured.
