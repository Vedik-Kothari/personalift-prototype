import { PageAnalysis, PersonalizationPlan, RenderedPage } from "@/lib/personalization/types";

function ensureHead(html: string) {
  if (/<head[^>]*>/i.test(html)) {
    return html;
  }

  return html.replace(/<html[^>]*>/i, "$&<head></head>");
}

function injectBase(html: string, baseUrl: string) {
  const baseTag = `<base href="${baseUrl}" />`;
  if (/<base\b/i.test(html)) {
    return html;
  }
  return html.replace(/<head[^>]*>/i, `$&${baseTag}`);
}

function injectPreviewStyle(html: string) {
  const style = `
    <style data-personalift>
      [data-personalift-changed="true"] {
        outline: 2px solid rgba(217, 119, 6, 0.72);
        outline-offset: 4px;
        border-radius: 8px;
      }
      .personalift-banner {
        margin: 12px auto 0;
        width: min(1120px, calc(100% - 32px));
        background: #fff7ed;
        color: #9a3412;
        border: 1px solid #fdba74;
        border-radius: 16px;
        padding: 14px 16px;
        font-family: Arial, sans-serif;
        font-size: 14px;
      }
      .personalift-trust {
        margin-top: 14px;
        display: inline-flex;
        padding: 10px 14px;
        border-radius: 999px;
        border: 1px solid rgba(47, 111, 95, 0.18);
        background: rgba(47, 111, 95, 0.08);
        color: #1f5548;
        font-family: Arial, sans-serif;
        font-size: 13px;
        font-weight: 700;
      }
    </style>
  `;
  return html.replace(/<head[^>]*>/i, `$&${style}`);
}

function replaceFirstTagContent(html: string, tagPattern: string, content: string) {
  const closingTag = tagPattern.split("[")[0];
  const expression = new RegExp(`(<${tagPattern}[^>]*>)([\\s\\S]*?)(</${closingTag}>)`, "i");
  return html.replace(expression, `$1<span data-personalift-changed="true">${content}</span>$3`);
}

function replaceFirstLinkOrButton(html: string, content: string) {
  return html.replace(
    /(<(?:a|button)[^>]*>)([\s\S]*?)(<\/(?:a|button)>)/i,
    `$1<span data-personalift-changed="true">${content}</span>$3`
  );
}

function replaceHeroPrimaryCta(html: string, content: string) {
  const heroSectionMatch = html.match(/<section[^>]*class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<\/section>/i);
  if (!heroSectionMatch) {
    return replaceFirstLinkOrButton(html, content);
  }

  const heroSection = heroSectionMatch[0];
  const updatedHeroSection = heroSection.replace(
    /(<a[^>]*class=["'][^"']*(?:btn-primary|primary)[^"']*["'][^>]*>)([\s\S]*?)(<\/a>)/i,
    `$1<span data-personalift-changed="true">${content}</span>$3`
  );

  if (updatedHeroSection !== heroSection) {
    return html.replace(heroSection, updatedHeroSection);
  }

  const fallbackHeroSection = heroSection.replace(
    /(<(?:a|button)[^>]*>)([\s\S]*?)(<\/(?:a|button)>)/i,
    `$1<span data-personalift-changed="true">${content}</span>$3`
  );

  return html.replace(heroSection, fallbackHeroSection);
}

function injectBanner(html: string, message: string) {
  const banner = `<div class="personalift-banner" data-personalift-changed="true">${message}</div>`;
  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body[^>]*>/i, `$&${banner}`);
  }
  return `${banner}${html}`;
}

function injectTrustPill(html: string, message: string) {
  const pill = `<div class="personalift-trust" data-personalift-changed="true">${message}</div>`;
  if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
    return html.replace(/(<h1[^>]*>[\s\S]*?<\/h1>)/i, `$1${pill}`);
  }
  return html;
}

function replaceHeroImage(html: string, newSrc: string) {
  return html.replace(/(<img[^>]*src=["'])([^"']+)(["'][^>]*>)/i, `$1${newSrc}$3`);
}

export function renderPersonalizedPage(
  pageAnalysis: PageAnalysis,
  plan: PersonalizationPlan,
  adImageDataUrl?: string
): RenderedPage {
  let personalizedHtml = ensureHead(pageAnalysis.html);
  personalizedHtml = injectBase(personalizedHtml, pageAnalysis.pageUrl);
  personalizedHtml = injectPreviewStyle(personalizedHtml);

  const headlineChange = plan.changes.find((change) => change.target === "headline");
  const subheadlineChange = plan.changes.find((change) => change.target === "subheadline");
  const ctaChange = plan.changes.find((change) => change.target === "primary-cta");
  const bannerChange = plan.changes.find((change) => change.target === "offer-highlight");
  const trustChange = plan.changes.find((change) => change.target === "trust-signal");

  if (headlineChange) {
    personalizedHtml = replaceFirstTagContent(personalizedHtml, "h1", headlineChange.after);
  }

  if (subheadlineChange) {
    personalizedHtml = replaceFirstTagContent(personalizedHtml, "p", subheadlineChange.after);
  }

  if (ctaChange) {
    personalizedHtml = replaceHeroPrimaryCta(personalizedHtml, ctaChange.after);
  }

  if (bannerChange) {
    personalizedHtml = injectBanner(personalizedHtml, bannerChange.after);
  }

  if (trustChange) {
    personalizedHtml = injectTrustPill(personalizedHtml, trustChange.after);
  }

  if (adImageDataUrl) {
    personalizedHtml = replaceHeroImage(personalizedHtml, adImageDataUrl);
  }

  return {
    originalHtml: pageAnalysis.html,
    personalizedHtml
  };
}
