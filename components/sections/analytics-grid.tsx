"use client";

import { motion } from "framer-motion";
import { LineChart, MessageSquareWarning, Radar, ShieldAlert } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { fakeAnalytics } from "@/lib/meme-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AnalyticsGrid({ chaos }: { chaos: ChaosController }) {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Engagement Command Center</CardTitle>
            <p className="mt-2 text-sm text-slate-500">
              Numbers so convincing even your manager will ask for a deck.
            </p>
          </div>
          <Badge variant={chaos.chaosLevel >= 3 ? "warning" : "default"}>
            Level {chaos.chaosLevel} chaos
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {fakeAnalytics.map((item, index) => (
            <motion.button
              key={item.label}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
              onClick={() => chaos.triggerChaos("analytics")}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                {index % 4 === 0 ? (
                  <LineChart className="h-4 w-4 text-primary" />
                ) : index % 4 === 1 ? (
                  <ShieldAlert className="h-4 w-4 text-danger" />
                ) : index % 4 === 2 ? (
                  <Radar className="h-4 w-4 text-accent" />
                ) : (
                  <MessageSquareWarning className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="mt-3 text-3xl font-black text-slate-900">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.commentary}</p>
              <Progress value={item.progress} className="mt-4" />
            </motion.button>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden bg-slate-950 text-white">
        <CardContent className="grid gap-4 p-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Crisis feed</p>
            <h3 className="mt-3 text-3xl font-black">Bro is not him dashboard telemetry</h3>
            <p className="mt-3 max-w-xl text-slate-300">
              Fake analytics spike whenever you hover too confidently. This is either
              innovation or main character energy with a budget.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Suspicion index</p>
            <p className="mt-2 text-5xl font-black">{chaos.interactionCount * 7}%</p>
            <p className="mt-3 text-sm text-slate-300">
              Ye koi tareeka hai? Apparently yes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
