"use client";

import { motion } from "framer-motion";
import { Play, Volume2 } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { brainrotPanels } from "@/lib/meme-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrainrotDock({ chaos }: { chaos: ChaosController }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Background Focus Content</CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            Productivity-enhancing clips absolutely nobody asked for.
          </p>
        </div>
        <Badge variant={chaos.chaosLevel >= 4 ? "danger" : "warning"}>Brainrot Dock</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {brainrotPanels.map((panel, index) => (
          <motion.button
            key={panel.title}
            type="button"
            className="group grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4 text-left md:grid-cols-[0.9fr_1.1fr]"
            whileHover={{ y: -4 }}
            onClick={() => chaos.triggerChaos(panel.title)}
          >
            <div
              className="relative min-h-40 overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900"
              style={{
                backgroundImage: panel.background
              }}
            >
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/40 px-4 py-3 text-white">
                <span className="text-sm font-semibold">{panel.format}</span>
                <div className="flex items-center gap-2 text-xs">
                  <Play className="h-3.5 w-3.5" />
                  looped clip
                </div>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),transparent_22%)]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-accent" />
                <p className="text-sm font-semibold text-slate-500">Autoplay-ready panel {index + 1}</p>
              </div>
              <p className="text-2xl font-black text-slate-900">{panel.title}</p>
              <p className="text-sm leading-7 text-slate-600">{panel.description}</p>
              <div className="flex flex-wrap gap-2">
                {panel.tags.map((tag) => (
                  <Badge key={tag} variant="default">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </CardContent>
    </Card>
  );
}
