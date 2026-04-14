"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ChaosController } from "@/hooks/use-chaos-engine";
import { Button } from "@/components/ui/button";

export function RunawayButton({
  chaos,
  children
}: {
  chaos: ChaosController;
  children: React.ReactNode;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const run = () => {
    if (chaos.chaosLevel < 2) return;
    setOffset({
      x: ((chaos.interactionCount * 23) % 80) - 40,
      y: ((chaos.interactionCount * 17) % 50) - 25
    });
    chaos.triggerChaos("runaway");
  };

  return (
    <motion.div animate={offset} transition={{ type: "spring", stiffness: 320, damping: 18 }}>
      <Button variant="ghost" onMouseEnter={run} onClick={() => chaos.triggerChaos("calm-mode")}>
        {children}
      </Button>
    </motion.div>
  );
}
