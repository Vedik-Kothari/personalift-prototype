# PersonaLift Prototype Explanation

## 1. System Flow

1. User provides either an ad URL or an ad image, plus a landing page URL.
2. The frontend sends those inputs to `POST /api/generate`.
3. Agent 1 (`ad-analyzer.ts`) extracts audience, intent, tone, hooks, and keywords.
4. Agent 2 (`page-analyzer.ts`) fetches the landing page HTML, strips scripts, identifies hero content, CTAs, sections, and trust signals.
5. Agent 3 (`personalization-engine.ts`) creates a bounded personalization plan that preserves structure and branding.
6. Agent 4 (`renderer.ts`) applies only safe HTML changes to the existing page snapshot.
7. The frontend renders original and personalized versions side by side in `iframe` previews and shows the planned changes.

## 2. Architecture Diagram

```text
User Input
  -> Next.js Frontend (`components/personalization-studio.tsx`)
  -> API Route (`app/api/generate/route.ts`)
      -> Agent 1: Ad Analyzer
      -> Agent 2: Page Analyzer
      -> Agent 3: Personalization Engine
      -> Agent 4: Renderer
  -> JSON Result
  -> Side-by-side preview + run history + diagnostics
```

## 3. Agent Design

### Agent 1: Ad Analyzer

- Input: ad URL, optional image, optional notes
- Output:

```json
{
  "audience": "string",
  "intent": "problem-aware | solution-aware | purchase-ready",
  "tone": "string",
  "hooks": ["string"],
  "keywords": ["string"],
  "styleGuide": "string",
  "evidence": ["string"]
}
```

- Behavior:
  - Uses OpenRouter if `OPENROUTER_API_KEY` is configured.
  - Falls back to deterministic heuristics based on URL tokens and notes.
  - Does not fabricate unsupported claims.

### Agent 2: Page Analyzer

- Input: landing page URL
- Output:

```json
{
  "pageTitle": "string",
  "headline": "string",
  "subheadline": "string",
  "ctas": ["string"],
  "sectionLabels": ["string"],
  "layoutMap": ["string"],
  "trustSignals": ["string"]
}
```

- Behavior:
  - Fetches live HTML when possible.
  - Strips scripts and analyzes the DOM snapshot safely.
  - Falls back to a bundled sample landing page if fetching fails.

### Agent 3: Personalization Engine

- Input: ad analysis + page analysis
- Output: a list of change instructions
- Behavior:
  - Prioritizes hero messaging, support copy, CTA alignment, offer highlighting, and trust reinforcement.
  - Keeps changes lightweight and within CRO-safe bounds.

### Agent 4: Renderer

- Input: original HTML + change list
- Output: original and personalized HTML
- Behavior:
  - Preserves layout and CSS structure.
  - Avoids changing class names or removing containers.
  - Edits only whitelisted targets like `h1`, first supporting paragraph, first CTA, and optional hero image.

## 4. Failure Handling

### Random Changes

- Bounded renderer only updates whitelisted targets.
- No arbitrary DOM rewrite or class mutation.

### Broken UI

- CSS classes are preserved.
- Containers remain intact.
- Scripts are stripped from preview snapshots to avoid unpredictable runtime behavior inside iframes.

### Hallucinations

- Personalization engine reuses existing page context plus ad-derived intent.
- Claims are framed as messaging shifts, not new product facts.
- Image analysis is conservative unless a multimodal provider is configured.

### Inconsistency

- The ad analyzer emits a single style guide.
- That style guide informs headline, subheadline, and CTA changes together.
- Warnings surface when the system falls back to sample HTML or heuristic ad analysis.

## 5. Assumptions Made

- The prototype runs in a single Next.js app for speed and simplicity.
- Live fetches may fail on some sites due to anti-bot controls or unusual HTML structures.
- Multimodal image understanding is optional and becomes strongest when `OPENROUTER_API_KEY` is set.
- The sample page exists so the demo remains usable even without external network access.

## 6. Deployment Notes

- Frontend and API are both deployable on Vercel because the app is a standard Next.js project.
- Set `OPENROUTER_API_KEY` and optionally `OPENROUTER_MODEL` in the deployment environment for richer ad-image understanding.
- No paid-only dependency is required for the prototype itself.
