"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { Button } from "@/components/ui/button";

export function PopupLayer({ chaos }: { chaos: ChaosController }) {
  return (
    <>
      <AnimatePresence>
        {chaos.popups.map((popup) => (
          <motion.div
            key={popup.id}
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="fixed z-[110] w-[300px] max-w-[88vw] overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-panel"
            style={{ left: popup.x, top: popup.y }}
          >
            <div className="flex items-center justify-between bg-slate-950 px-4 py-3 text-white">
              <p className="text-sm font-bold">{popup.title}</p>
              <button type="button" onClick={() => chaos.dismissPopup(popup.id)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <p className="text-sm leading-6 text-slate-600">{popup.body}</p>
              <div className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold text-slate-800">
                {popup.caption}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="danger" onClick={() => chaos.triggerChaos("popup-button")}>
                  Accept fate
                </Button>
                <Button size="sm" variant="ghost" onClick={() => chaos.dismissPopup(popup.id)}>
                  pretend calm
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {chaos.activeOverlays.map((overlay) => (
          <motion.div
            key={overlay.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            className="fixed z-[90] overflow-hidden rounded-[28px] border border-white/20 bg-slate-950/90 text-white shadow-panel backdrop-blur"
            style={overlay.position}
          >
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{overlay.format}</p>
              <p className="mt-2 text-xl font-black">{overlay.title}</p>
              <p className="mt-2 max-w-xs text-sm text-slate-300">{overlay.description}</p>
              <div className="mt-4 h-32 rounded-[20px] bg-gradient-to-br from-orange-400 via-rose-500 to-blue-600 p-3">
                <div className="flex h-full items-end justify-between rounded-[16px] border border-white/20 bg-black/30 p-3">
                  <span className="text-xs font-semibold uppercase">{overlay.badge}</span>
                  <span className="text-xs text-white/70">looping chaos</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
