import { AdAnalysis, AdInput } from "@/lib/personalization/types";

const DEFAULT_ANALYSIS: AdAnalysis = {
  audience: "high-intent prospects already evaluating the category",
  intent: "solution-aware",
  tone: "clear, benefits-led, and conversion-focused",
  hooks: ["Faster path to a better outcome", "Clear value proposition"],
  keywords: ["conversion", "clarity", "outcome"],
  styleGuide: "Match the ad promise with concise, confident copy and a direct primary CTA.",
  evidence: ["Used conservative fallback because no multimodal provider was configured."],
  provider: "heuristic"
};

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function titleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractReadableUrlText(url?: string) {
  if (!url) {
    return "";
  }

  try {
    const parsed = new URL(url);
    const path = `${parsed.pathname} ${parsed.search}`
      .replace(/[-_/=&?]+/g, " ")
      .replace(/\bhttps?\b/gi, "")
      .replace(/\bwww\b/gi, "")
      .replace(/\bcom\b|\bnet\b|\borg\b|\bio\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    return titleCase(path);
  } catch {
    return titleCase(
      url
        .replace(/^https?:\/\//i, "")
        .replace(/[-_/=&?]+/g, " ")
        .replace(/\bwww\b/gi, "")
        .replace(/\s+/g, " ")
        .trim()
    );
  }
}

function inferIntent(tokens: string[]): AdAnalysis["intent"] {
  if (tokens.some((token) => ["buy", "shop", "sale", "discount", "off", "today", "deal"].includes(token))) {
    return "purchase-ready";
  }

  if (tokens.some((token) => ["compare", "demo", "software", "platform", "solution", "tool"].includes(token))) {
    return "solution-aware";
  }

  return "problem-aware";
}

function inferTone(tokens: string[]) {
  if (tokens.some((token) => ["luxury", "premium", "elevated", "exclusive"].includes(token))) {
    return "premium";
  }

  if (tokens.some((token) => ["discount", "save", "sale", "deal", "off"].includes(token))) {
    return "discount-led";
  }

  if (tokens.some((token) => ["urgent", "now", "today", "limited", "ends"].includes(token))) {
    return "urgent";
  }

  if (tokens.some((token) => ["love", "feel", "confidence", "stress", "relief"].includes(token))) {
    return "emotional";
  }

  return "benefit-led";
}

function inferAudience(tokens: string[]) {
  if (tokens.some((token) => ["founder", "startup", "saas", "pipeline", "revenue"].includes(token))) {
    return "startup and revenue leaders looking for better growth efficiency";
  }

  if (tokens.some((token) => ["shopper", "beauty", "fashion", "skincare"].includes(token))) {
    return "consumer shoppers motivated by outcome, identity, and offer clarity";
  }

  if (tokens.some((token) => ["team", "manager", "leader", "ops", "software"].includes(token))) {
    return "professional buyers comparing tools for a team workflow";
  }

  return DEFAULT_ANALYSIS.audience;
}

function extractHooks(text: string) {
  return unique(
    text
      .split(/[.!?\n]/)
      .map((part) => part.trim())
      .filter((part) => part.length > 18)
      .map((part) => part.replace(/\bhttps?:\/\/\S+/gi, "").trim())
      .filter((part) => part.length > 18)
      .slice(0, 3)
  );
}

async function analyzeWithOpenRouter(input: AdInput): Promise<AdAnalysis | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "meta-llama/llama-4-maverick:free";

  if (!apiKey) {
    return null;
  }

  const prompt = [
    "You are an elite CRO strategist.",
    "Analyze this ad creative and return strict JSON with keys:",
    "audience, intent, tone, hooks, keywords, styleGuide, evidence.",
    "Allowed intent values: problem-aware, solution-aware, purchase-ready.",
    "Do not invent claims not supported by the ad input."
  ].join(" ");

  const userContent: Array<Record<string, string | object>> = [];

  if (input.adUrl) {
    userContent.push({ type: "text", text: `Ad URL: ${input.adUrl}` });
  }

  if (input.adNotes) {
    userContent.push({ type: "text", text: `Extra ad notes: ${input.adNotes}` });
  }

  if (input.adImageDataUrl) {
    userContent.push({
      type: "image_url",
      image_url: { url: input.adImageDataUrl }
    });
  }

  if (!userContent.length) {
    return null;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: userContent }
        ]
      })
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const rawContent = payload?.choices?.[0]?.message?.content;
    if (typeof rawContent !== "string") {
      return null;
    }

    const parsed = JSON.parse(rawContent) as Omit<AdAnalysis, "provider">;
    return {
      audience: parsed.audience || DEFAULT_ANALYSIS.audience,
      intent:
        parsed.intent === "problem-aware" ||
        parsed.intent === "solution-aware" ||
        parsed.intent === "purchase-ready"
          ? parsed.intent
          : DEFAULT_ANALYSIS.intent,
      tone: parsed.tone || DEFAULT_ANALYSIS.tone,
      hooks: parsed.hooks?.length ? parsed.hooks.slice(0, 4) : DEFAULT_ANALYSIS.hooks,
      keywords: parsed.keywords?.length ? parsed.keywords.slice(0, 8) : DEFAULT_ANALYSIS.keywords,
      styleGuide: parsed.styleGuide || DEFAULT_ANALYSIS.styleGuide,
      evidence: parsed.evidence?.length ? parsed.evidence.slice(0, 5) : DEFAULT_ANALYSIS.evidence,
      provider: "llm"
    };
  } catch {
    return null;
  }
}

export async function analyzeAd(input: AdInput): Promise<AdAnalysis> {
  const aiResult = await analyzeWithOpenRouter(input);
  if (aiResult) {
    return aiResult;
  }

  const readableUrl = extractReadableUrlText(input.adUrl);
  const heuristicSource = [input.adNotes, readableUrl, input.adImageName]
    .filter(Boolean)
    .join(" ");

  const tokens = tokenize(heuristicSource);
  const hooks = extractHooks(heuristicSource);
  const keywords = unique(tokens).slice(0, 8);

  return {
    audience: inferAudience(tokens),
    intent: inferIntent(tokens),
    tone: inferTone(tokens),
    hooks: hooks.length ? hooks : DEFAULT_ANALYSIS.hooks,
    keywords: keywords.length ? keywords : DEFAULT_ANALYSIS.keywords,
    styleGuide:
      input.adImageDataUrl && !process.env.OPENROUTER_API_KEY
        ? "Use a conservative style guide because image OCR is unavailable without a configured multimodal provider."
        : DEFAULT_ANALYSIS.styleGuide,
    evidence: [
      input.adUrl ? `Derived keyword clues from ad URL: ${input.adUrl}` : "",
      input.adNotes ? "Used operator notes supplied with the ad input." : "",
      input.adImageDataUrl && !process.env.OPENROUTER_API_KEY
        ? "Image was uploaded, but deep visual extraction needs an OpenRouter-compatible multimodal key."
        : ""
    ].filter(Boolean),
    provider: "heuristic"
  };
}
