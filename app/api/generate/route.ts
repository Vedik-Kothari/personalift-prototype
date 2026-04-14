import { NextRequest, NextResponse } from "next/server";
import { analyzeAd } from "@/lib/personalization/ad-analyzer";
import { analyzePage } from "@/lib/personalization/page-analyzer";
import { createPersonalizationPlan } from "@/lib/personalization/personalization-engine";
import { renderPersonalizedPage } from "@/lib/personalization/renderer";
import { AdInput, GenerationResult } from "@/lib/personalization/types";

interface GenerateRequest extends AdInput {
  landingPageUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.landingPageUrl?.trim()) {
      return NextResponse.json({ error: "Landing page URL is required." }, { status: 400 });
    }

    const adAnalysis = await analyzeAd(body);
    const pageAnalysis = await analyzePage(body.landingPageUrl);
    const plan = createPersonalizationPlan(adAnalysis, pageAnalysis);
    const render = renderPersonalizedPage(pageAnalysis, plan, body.adImageDataUrl);

    const warnings: string[] = [];

    if (pageAnalysis.fetchMode === "sample" && body.landingPageUrl.trim().toLowerCase() !== "demo" && body.landingPageUrl.trim().toLowerCase() !== "sample" && body.landingPageUrl.trim().toLowerCase() !== "builtin-demo") {
      warnings.push(
        "Live landing page fetch failed, so the preview is using the built-in sample page structure."
      );
    }

    if (body.adImageDataUrl && adAnalysis.provider === "heuristic") {
      warnings.push(
        "Image was accepted, but deep visual extraction needs an OpenRouter-compatible multimodal API key."
      );
    }

    const result: GenerationResult = {
      adAnalysis,
      pageAnalysis: {
        pageUrl: pageAnalysis.pageUrl,
        pageTitle: pageAnalysis.pageTitle,
        headline: pageAnalysis.headline,
        subheadline: pageAnalysis.subheadline,
        ctas: pageAnalysis.ctas,
        sectionLabels: pageAnalysis.sectionLabels,
        sections: pageAnalysis.sections,
        layoutMap: pageAnalysis.layoutMap,
        heroImage: pageAnalysis.heroImage,
        trustSignals: pageAnalysis.trustSignals,
        fetchMode: pageAnalysis.fetchMode
      },
      plan,
      render,
      warnings
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate personalized page."
      },
      { status: 500 }
    );
  }
}
