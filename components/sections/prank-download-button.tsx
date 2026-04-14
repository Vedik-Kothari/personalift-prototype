"use client";

import type { ChaosController } from "@/hooks/use-chaos-engine";
import { Button } from "@/components/ui/button";

export function PrankDownloadButton({ chaos }: { chaos: ChaosController }) {
  const onDownload = () => {
    const meme = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
        <rect width="100%" height="100%" fill="#0f172a" />
        <text x="70" y="170" fill="#f8fafc" font-family="Arial" font-size="64" font-weight="700">
          Totally Normal Download
        </text>
        <text x="70" y="280" fill="#fb923c" font-family="Arial" font-size="46">
          Skill issue detected. Bro thinks this is a real export.
        </text>
        <text x="70" y="380" fill="#93c5fd" font-family="Arial" font-size="36">
          We got this PNG before GTA 6.
        </text>
      </svg>
    `.trim();

    const blob = new Blob([meme], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "totally-normal-report.svg";
    link.click();
    URL.revokeObjectURL(url);
    chaos.triggerChaos("download");
  };

  return (
    <Button variant="warning" onClick={onDownload}>
      <DownloadLabel />
    </Button>
  );
}

function DownloadLabel() {
  return <>download report.zip</>;
}
