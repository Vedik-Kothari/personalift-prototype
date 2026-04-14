"use client";

import { useState } from "react";
import { Wand2, Image as ImageIcon, Link2, Sparkles, ShieldCheck, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GenerationResult, InputMode } from "@/lib/personalization/types";

interface HistoryEntry {
  id: string;
  createdAt: string;
  landingPageUrl: string;
  result: GenerationResult;
}

const DEMO_URL = "demo";

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

export function PersonalizationStudio() {
  const [inputMode, setInputMode] = useState<InputMode>("url");
  const [adUrl, setAdUrl] = useState("");
  const [landingPageUrl, setLandingPageUrl] = useState(DEMO_URL);
  const [adNotes, setAdNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setIsLoading(true);
    setError("");

    try {
      let adImageDataUrl: string | undefined;
      if (inputMode === "image" && selectedFile) {
        adImageDataUrl = await fileToDataUrl(selectedFile);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          adUrl: inputMode === "url" ? adUrl : undefined,
          adNotes,
          adImageDataUrl,
          adImageName: selectedFile?.name,
          landingPageUrl
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Generation failed.");
      }

      setResult(payload);
      setHistory((current) => [
        {
          id: `${Date.now()}`,
          createdAt: new Date().toLocaleString(),
          landingPageUrl,
          result: payload
        },
        ...current
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Generation failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="glass-outline border-[#ecdcc4] bg-[var(--panel)] text-[var(--foreground)]">
          <CardHeader className="pb-4">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-amber-300/60 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-800">
              PersonaLift Prototype
            </div>
            <CardTitle className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-[var(--ink)] md:text-6xl">
              Personalize the landing page you already have instead of rebuilding it from scratch.
            </CardTitle>
            <p className="max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
              Upload an ad image or paste an ad URL, add the landing page URL, and generate a CRO-focused
              version of the same page with safer hero, CTA, and trust edits.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-3 rounded-[24px] border border-[#e8d6b8] bg-white/80 p-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => setInputMode("url")}
                className={`rounded-[20px] border px-4 py-4 text-left transition ${
                  inputMode === "url"
                    ? "border-amber-400 bg-amber-50"
                    : "border-slate-200 bg-white hover:border-amber-200"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Link2 className="h-4 w-4" />
                  Ad URL
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Best for fast structured analysis using URL tokens, landing context, and optional notes.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("image")}
                className={`rounded-[20px] border px-4 py-4 text-left transition ${
                  inputMode === "image"
                    ? "border-emerald-400 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-emerald-200"
                }`}
              >
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ImageIcon className="h-4 w-4" />
                  Ad Image
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Uses a multimodal model when configured; otherwise falls back conservatively and keeps edits safe.
                </p>
              </button>
            </div>

            {inputMode === "url" ? (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-800">Ad creative URL</label>
                <Input
                  placeholder="https://ads.example.com/creative/founders-save-time"
                  value={adUrl}
                  onChange={(event) => setAdUrl(event.target.value)}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-slate-800">Upload ad image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-4 text-sm text-slate-700"
                />
                <p className="text-xs text-slate-500">
                  {selectedFile ? `Selected: ${selectedFile.name}` : "PNG, JPG, or WebP work well."}
                </p>
              </div>
            )}

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">Landing page URL</label>
                <Input
                  placeholder="https://your-product.com/landing or demo"
                  value={landingPageUrl}
                  onChange={(event) => setLandingPageUrl(event.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Use <span className="font-semibold">demo</span> for the built-in test page, or try
                  <span className="font-semibold"> http://localhost:3002/demo-landing</span> while testing locally.
                </p>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-slate-800">Optional campaign notes</label>
              <textarea
                value={adNotes}
                onChange={(event) => setAdNotes(event.target.value)}
                placeholder="Example: Paid social campaign for SaaS founders, highlighting faster pipeline reviews and a limited onboarding offer."
                className="min-h-28 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="rounded-[18px] bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white hover:bg-amber-600"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isLoading ? "Generating Personalized Page..." : "Generate Personalized Page"}
              </Button>
              <span className="text-sm text-slate-600">
                Safe mode only changes headline, support copy, CTA, trust, and hero image.
              </span>
            </div>

            {error ? (
              <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="glass-outline border-[#d9dfd0] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(242,248,245,0.95))] text-[var(--foreground)]">
          <CardHeader>
            <CardTitle className="text-2xl font-black tracking-[-0.03em] text-[var(--ink)]">
              Modular agent system
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {[
              {
                icon: Sparkles,
                title: "Agent 1: Ad Analyzer",
                text: "Extracts audience, intent, tone, hooks, and keywords from an ad URL or image input."
              },
              {
                icon: LayoutTemplate,
                title: "Agent 2: Page Analyzer",
                text: "Fetches the landing page, maps hero and sections, and identifies editable elements."
              },
              {
                icon: Wand2,
                title: "Agent 3: Personalization Engine",
                text: "Creates a bounded list of CRO changes instead of inventing a net-new page."
              },
              {
                icon: ShieldCheck,
                title: "Agent 4: Renderer",
                text: "Applies only whitelisted DOM changes and tags edited nodes in the preview."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="grid gap-6">
          <Card className="border-[#e8d6b8] bg-white/90">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900">Run summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-slate-700">
              {!result ? (
                <p>Generate a page to inspect the ad analysis, page map, and personalization plan.</p>
              ) : (
                <>
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Audience
                    </div>
                    <div>{result.adAnalysis.audience}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Intent</div>
                      <div className="mt-1 font-semibold text-slate-900">{result.adAnalysis.intent}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tone</div>
                      <div className="mt-1 font-semibold text-slate-900">{result.adAnalysis.tone}</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Hooks
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.adAnalysis.hooks.map((hook) => (
                        <span
                          key={hook}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800"
                        >
                          {hook}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Planned changes
                    </div>
                    <div className="grid gap-2">
                      {result.plan.changes.map((change) => (
                        <div key={change.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div className="text-sm font-semibold text-slate-900">{change.target}</div>
                          <div className="mt-1 text-xs leading-5 text-slate-600">{change.reason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {result.warnings.length ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                      {result.warnings.join(" ")}
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#dcd8ef] bg-white/90">
            <CardHeader>
              <CardTitle className="text-xl font-black text-slate-900">Version history</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700">
              {!history.length ? (
                <p>No generations yet.</p>
              ) : (
                history.slice(0, 5).map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setResult(entry.result)}
                    className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-amber-300 hover:bg-white"
                  >
                    <div className="font-semibold text-slate-900">{entry.landingPageUrl}</div>
                    <div className="mt-1 text-xs text-slate-500">{entry.createdAt}</div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#e8d6b8] bg-white/92">
          <CardHeader>
            <CardTitle className="text-2xl font-black tracking-[-0.03em] text-slate-900">
              Original vs personalized preview
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="grid gap-3">
                <div className="text-sm font-semibold text-slate-700">Original page snapshot</div>
                <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50">
                  <iframe
                    title="Original landing page"
                    srcDoc={result?.render.originalHtml ?? ""}
                    className="h-[720px] w-full bg-white"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <div className="text-sm font-semibold text-slate-700">Personalized version</div>
                <div className="overflow-hidden rounded-[24px] border border-amber-200 bg-amber-50">
                  <iframe
                    title="Personalized landing page"
                    srcDoc={result?.render.personalizedHtml ?? ""}
                    className="h-[720px] w-full bg-white"
                  />
                </div>
              </div>
            </div>

            {result ? (
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-bold text-slate-900">Page analysis</div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p><span className="font-semibold">Source:</span> {result.pageAnalysis.pageUrl}</p>
                    <p><span className="font-semibold">Headline:</span> {result.pageAnalysis.headline}</p>
                    <p><span className="font-semibold">CTAs:</span> {result.pageAnalysis.ctas.join(", ") || "None detected"}</p>
                    <p><span className="font-semibold">Sections:</span> {result.pageAnalysis.sectionLabels.join(", ") || "No h2 sections detected"}</p>
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-bold text-slate-900">System notes</div>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>Provider: {result.adAnalysis.provider}</p>
                    <p>Style guide: {result.adAnalysis.styleGuide}</p>
                    <p>Layout preserved: only whitelisted copy, CTA, trust, and hero edits are applied.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm leading-7 text-slate-600">
                The preview will appear here after the first generation. The sample URL is prefilled so you can test immediately.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
