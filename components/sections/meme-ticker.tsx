"use client";

import { motion } from "framer-motion";
import { memeTickerItems } from "@/lib/meme-data";

export function MemeTicker({
  chaosLevel,
  onInteract
}: {
  chaosLevel: number;
  onInteract: (source?: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-slate-950 py-4 text-white shadow-panel">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: Math.max(12, 24 - chaosLevel * 2), ease: "linear", repeat: Infinity }}
        className="flex min-w-max gap-4 px-4"
      >
        {[...memeTickerItems, ...memeTickerItems].map((item, index) => (
          <button
            key={`${item}-${index}`}
            type="button"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold"
            onClick={() => onInteract("ticker")}
          >
            {item}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
