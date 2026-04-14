"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { Button } from "@/components/ui/button";

const tiles = [
  "Gigachad",
  "Spreadsheet",
  "Trollface",
  "Email",
  "KitKat",
  "Minecraft",
  "Wojak",
  "Subway Surfers",
  "Drake"
];

export function CaptchaChallenge({ chaos }: { chaos: ChaosController }) {
  return (
    <AnimatePresence>
      {chaos.showCaptcha ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[125] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="w-full max-w-2xl rounded-[32px] border border-white/80 bg-white p-6 shadow-panel"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-[24px] bg-slate-950 p-3 text-white">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                  Human verification
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">
                  {chaos.captchaPrompt}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This definitely is not a prank modal that appears at the worst possible time.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {tiles.map((tile, index) => (
                <button
                  key={tile}
                  type="button"
                  onClick={() => chaos.failCaptcha()}
                  className={`rounded-[24px] border p-5 text-left transition ${
                    index % 2 === 0
                      ? "border-slate-200 bg-slate-50 hover:border-primary/40 hover:bg-white"
                      : "border-orange-200 bg-orange-50 hover:border-orange-400"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{tile}</p>
                  <p className="mt-1 text-xs text-slate-500">possibly suspicious</p>
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="danger" onClick={() => chaos.failCaptcha()}>
                Verify definitely correctly
              </Button>
              <Button variant="ghost" onClick={() => chaos.closeCaptcha()}>
                I am overwhelmed
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
