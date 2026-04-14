import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-3 overflow-hidden rounded-full bg-slate-200", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-accent transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
