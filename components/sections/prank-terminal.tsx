"use client";

import { motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { fakeCommands } from "@/lib/meme-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PrankTerminal({ chaos }: { chaos: ChaosController }) {
  return (
    <Card className="overflow-hidden bg-slate-950 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TerminalSquare className="h-5 w-5 text-cyan-300" />
          Totally Normal Command Center
        </CardTitle>
        <p className="text-sm text-slate-400">
          Click any command to make the situation significantly less professional.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {fakeCommands.map((command, index) => (
          <motion.button
            key={command}
            type="button"
            whileHover={{ x: 4 }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
            onClick={() => chaos.triggerChaos(`command-${index}`)}
          >
            <span className="font-mono text-sm text-cyan-200">{command}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">run chaos</span>
          </motion.button>
        ))}
      </CardContent>
    </Card>
  );
}
