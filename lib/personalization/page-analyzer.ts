import { PageAnalysis, PageSection } from "@/lib/personalization/types";
import { SAMPLE_PAGE_HTML, SAMPLE_PAGE_URL } from "@/lib/personalization/sample-page";

const DEMO_ALIASES = new Set(["demo", "sample", "builtin-demo"]);

function stripScripts(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");
}

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanText(text: string) {
  return decodeEntities(text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function firstMatch(html: string, pattern: RegExp) {
  const match = html.match(pattern);
  return match?.[1] ? cleanText(match[1]) : "";
}

function collectMatches(html: string, pattern: RegExp, limit = 6) {
  const results: string[] = [];
  for (const match of html.matchAll(pattern)) {
    const text = cleanText(match[1] ?? "");
    if (text) {
      results.push(text);
    }
    if (results.length >= limit) {
      break;
    }
  }
  return results;
}

function classifySection(label: string): PageSection["type"] {
  const lower = label.toLowerCase();
  if (lower.includes("feature")) return "features";
  if (lower.includes("testimonial") || lower.includes("proof") || lower.includes("customer")) return "testimonials";
  if (lower.includes("pricing") || lower.includes("plan")) return "pricing";
  if (lower.includes("faq")) return "faq";
  if (lower.includes("cta") || lower.includes("demo")) return "cta";
  return "generic";
}

function sectionSummary(html: string) {
  const labels = collectMatches(html, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 8);
  if (!labels.length) {
    return [
      {
        type: "hero" as const,
        label: "Hero",
        selectorHint: "first h1"
      }
    ];
  }

  return [
    {
      type: "hero" as const,
      label: "Hero",
      selectorHint: "first h1"
    },
    ...labels.map((label, index) => ({
      type: classifySection(label),
      label,
      selectorHint: `h2[${index}]`
    }))
  ];
}

function normalizeUrl(url: string) {
  if (!url) {
    return "";
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `https://${url}`;
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "PersonaLift Prototype Bot/1.0"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  return await response.text();
}

export async function analyzePage(pageUrl: string): Promise<PageAnalysis> {
  const trimmedUrl = pageUrl.trim();
  const normalizedUrl = normalizeUrl(trimmedUrl);
  let rawHtml = SAMPLE_PAGE_HTML;
  let resolvedUrl = SAMPLE_PAGE_URL;
  let fetchMode: PageAnalysis["fetchMode"] = "sample";

  if (!trimmedUrl || DEMO_ALIASES.has(trimmedUrl.toLowerCase())) {
    return {
      pageUrl: SAMPLE_PAGE_URL,
      pageTitle: firstMatch(SAMPLE_PAGE_HTML, /<title[^>]*>([\s\S]*?)<\/title>/i) || "Untitled landing page",
      headline: firstMatch(SAMPLE_PAGE_HTML, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || "Untitled hero headline",
      subheadline: firstMatch(SAMPLE_PAGE_HTML, /<p[^>]*>([\s\S]{20,400}?)<\/p>/i),
      ctas: collectMatches(SAMPLE_PAGE_HTML, /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/gi, 5),
      sectionLabels: collectMatches(SAMPLE_PAGE_HTML, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 8),
      sections: sectionSummary(SAMPLE_PAGE_HTML),
      layoutMap: ["nav", "hero", ...collectMatches(SAMPLE_PAGE_HTML, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 8)],
      heroImage: SAMPLE_PAGE_HTML.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1],
      trustSignals: collectMatches(SAMPLE_PAGE_HTML, /<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, 5),
      html: SAMPLE_PAGE_HTML,
      fetchMode
    };
  }

  if (normalizedUrl) {
    try {
      rawHtml = await fetchHtml(normalizedUrl);
      resolvedUrl = normalizedUrl;
      fetchMode = "live";
    } catch {
      rawHtml = SAMPLE_PAGE_HTML;
      resolvedUrl = SAMPLE_PAGE_URL;
      fetchMode = "sample";
    }
  }

  const sanitizedHtml = stripScripts(rawHtml);
  const title = firstMatch(sanitizedHtml, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const headline = firstMatch(sanitizedHtml, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const subheadline = firstMatch(sanitizedHtml, /<p[^>]*>([\s\S]{20,400}?)<\/p>/i);
  const ctas = collectMatches(sanitizedHtml, /<(?:a|button)[^>]*>([\s\S]*?)<\/(?:a|button)>/gi, 5);
  const heroImage = sanitizedHtml.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1];
  const sectionLabels = collectMatches(sanitizedHtml, /<h2[^>]*>([\s\S]*?)<\/h2>/gi, 8);
  const trustSignals = collectMatches(sanitizedHtml, /<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, 5);

  return {
    pageUrl: resolvedUrl,
    pageTitle: title || "Untitled landing page",
    headline: headline || "Untitled hero headline",
    subheadline: subheadline || "",
    ctas,
    sectionLabels,
    sections: sectionSummary(sanitizedHtml),
    layoutMap: ["nav", "hero", ...sectionLabels],
    heroImage,
    trustSignals,
    html: sanitizedHtml,
    fetchMode
  };
}
