"use client";

import { Siren, Sparkles, TriangleAlert } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ChaosHud({ chaos }: { chaos: ChaosController }) {
  return (
    <Card className="sticky bottom-4 z-40 border-slate-900 bg-slate-950 text-white">
      <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_1fr_0.7fr] md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Chaos Engine</p>
          <p className="mt-2 text-2xl font-black">
            Level {chaos.chaosLevel} / 4 with {chaos.interactionCount} interactions
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Jugaad mode is {chaos.chaosLevel >= 3 ? "fully operational" : "warming up"}.
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
            <span>Browser survivability</span>
            <span>{Math.max(12, 100 - chaos.interactionCount * 4)}%</span>
          </div>
          <Progress value={Math.min(100, chaos.interactionCount * 10 + chaos.chaosLevel * 8)} />
        </div>
        <div className="flex gap-3 md:justify-end">
          <div className="rounded-2xl bg-white/10 p-3">
            <Siren className="h-5 w-5 text-accent" />
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <TriangleAlert className="h-5 w-5 text-danger" />
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
