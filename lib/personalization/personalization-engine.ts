import {
  AdAnalysis,
  ChangeInstruction,
  PageAnalysis,
  PersonalizationPlan
} from "@/lib/personalization/types";

function pickHook(ad: AdAnalysis, page: PageAnalysis) {
  const hook = ad.hooks[0] || page.headline;
  if (hook.length <= 12) {
    return `${hook} with less friction`;
  }
  return hook;
}

function buildHeadline(ad: AdAnalysis, page: PageAnalysis) {
  const hook = pickHook(ad, page);
  const keywords = ad.keywords.slice(0, 2).join(" ");
  const existing = page.headline.replace(/\.$/, "");
  const safeHook = hook
    .replace(/\bhttps?\b/gi, "")
    .replace(/\bcom\b|\bnet\b|\borg\b|\bio\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (safeHook.length > 90) {
    return existing;
  }

  if (ad.intent === "purchase-ready") {
    return `${safeHook}. Start with the offer that gets you there.`;
  }

  if (safeHook.length > 24) {
    return safeHook.replace(/\.$/, "");
  }

  if (keywords) {
    return `${existing} for ${keywords}.`;
  }

  return existing.length > 18 ? existing : hook;
}

function buildSubheadline(ad: AdAnalysis, page: PageAnalysis) {
  const basis = page.subheadline || page.pageTitle;
  const tone = ad.tone.toLowerCase();
  const audience = ad.audience;

  if (tone.includes("discount")) {
    return `${basis} Reframe the page for ${audience} and make the value of the offer obvious above the fold.`;
  }

  if (tone.includes("premium")) {
    return `${basis} Keep the promise polished, specific, and aligned with what ${audience} expects from a higher-trust buying experience.`;
  }

  return `${basis} Tighten the message so ${audience} instantly sees the match between the ad promise and the landing page.`;
}

function buildPrimaryCta(ad: AdAnalysis, page: PageAnalysis) {
  const fallback = page.ctas[0] || "Get Started";

  if (ad.intent === "purchase-ready") {
    return "Claim the Offer";
  }

  if (ad.intent === "problem-aware") {
    return "See How It Works";
  }

  if (fallback.toLowerCase().includes("demo")) {
    return "Book Your Personalized Demo";
  }

  return "Get the Tailored Plan";
}

function buildOfferHighlight(ad: AdAnalysis) {
  if (ad.tone.toLowerCase().includes("urgent") || ad.intent === "purchase-ready") {
    return "High-intent visitors from this ad are seeing a tailored path with a sharper offer focus.";
  }

  return "This page has been personalized to echo the ad promise without changing the core layout.";
}

export function createPersonalizationPlan(
  adAnalysis: AdAnalysis,
  pageAnalysis: PageAnalysis
): PersonalizationPlan {
  const headline = buildHeadline(adAnalysis, pageAnalysis);
  const subheadline = buildSubheadline(adAnalysis, pageAnalysis);
  const cta = buildPrimaryCta(adAnalysis, pageAnalysis);
  const changes: ChangeInstruction[] = [
    {
      id: "headline",
      target: "headline",
      reason: "Match the hero promise with the ad hook.",
      before: pageAnalysis.headline,
      after: headline
    },
    {
      id: "subheadline",
      target: "subheadline",
      reason: "Reinforce the same promise for the inferred audience.",
      before: pageAnalysis.subheadline,
      after: subheadline
    },
    {
      id: "primary-cta",
      target: "primary-cta",
      reason: "Align the main CTA with visitor intent from the ad.",
      before: pageAnalysis.ctas[0],
      after: cta
    },
    {
      id: "offer-highlight",
      target: "offer-highlight",
      reason: "Add a lightweight CRO callout without rebuilding the page.",
      after: buildOfferHighlight(adAnalysis)
    }
  ];

  if (!pageAnalysis.trustSignals.length) {
    changes.push({
      id: "trust-signal",
      target: "trust-signal",
      reason: "Add trust context near the hero when proof is thin above the fold.",
      after: "Trusted by teams already comparing solutions and looking for a faster path to confidence."
    });
  }

  return {
    summary:
      "Preserve the original layout and branding, but tighten the hero promise, supporting copy, and CTA around the ad's audience and intent.",
    changes
  };
}
