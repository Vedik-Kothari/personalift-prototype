"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing, OctagonAlert, TriangleAlert, X } from "lucide-react";
import type { ChaosController } from "@/hooks/use-chaos-engine";

export function ToastStorm({ chaos }: { chaos: ChaosController }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[115] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {chaos.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.92 }}
            className={`pointer-events-auto rounded-[24px] border p-4 shadow-panel backdrop-blur ${
              toast.tone === "danger"
                ? "border-rose-200 bg-rose-50/95"
                : toast.tone === "warning"
                  ? "border-orange-200 bg-orange-50/95"
                  : "border-blue-200 bg-white/95"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-slate-950 p-2 text-white">
                {toast.tone === "danger" ? (
                  <OctagonAlert className="h-4 w-4" />
                ) : toast.tone === "warning" ? (
                  <TriangleAlert className="h-4 w-4" />
                ) : (
                  <BellRing className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">Normal system message</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{toast.message}</p>
              </div>
              <button type="button" onClick={() => chaos.dismissToast(toast.id)}>
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
