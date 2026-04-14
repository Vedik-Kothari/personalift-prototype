export type InputMode = "url" | "image";

export interface AdInput {
  adUrl?: string;
  adImageDataUrl?: string;
  adImageName?: string;
  adNotes?: string;
}

export interface AdAnalysis {
  audience: string;
  intent: "problem-aware" | "solution-aware" | "purchase-ready";
  tone: string;
  hooks: string[];
  keywords: string[];
  styleGuide: string;
  evidence: string[];
  provider: "heuristic" | "llm";
}

export interface PageSection {
  type: "hero" | "features" | "testimonials" | "pricing" | "faq" | "cta" | "generic";
  label: string;
  selectorHint: string;
}

export interface PageAnalysis {
  pageUrl: string;
  pageTitle: string;
  headline: string;
  subheadline: string;
  ctas: string[];
  sectionLabels: string[];
  sections: PageSection[];
  layoutMap: string[];
  heroImage?: string;
  trustSignals: string[];
  html: string;
  fetchMode: "live" | "sample";
}

export interface ChangeInstruction {
  id: string;
  target: "headline" | "subheadline" | "primary-cta" | "hero-image" | "trust-signal" | "offer-highlight";
  reason: string;
  before?: string;
  after: string;
}

export interface PersonalizationPlan {
  summary: string;
  changes: ChangeInstruction[];
}

export interface RenderedPage {
  originalHtml: string;
  personalizedHtml: string;
}

export interface GenerationResult {
  adAnalysis: AdAnalysis;
  pageAnalysis: Omit<PageAnalysis, "html">;
  plan: PersonalizationPlan;
  render: RenderedPage;
  warnings: string[];
}
