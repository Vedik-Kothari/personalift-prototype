"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CircleDashed,
  Cloud,
  Cpu,
  Leaf,
  MoveRight,
  Play,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Waves,
  Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  carbonForecast,
  controlSurfaces,
  copilotInsights,
  serviceNodes,
  summarySignals,
  timelineJobs
} from "@/lib/green-ops-data";
import { cn } from "@/lib/utils";

type Job = (typeof timelineJobs)[number];
type Node = (typeof serviceNodes)[number];

const HOURS = Array.from({ length: 24 }, (_, index) => index);
const PX_PER_HOUR = 42;
const TRACK_WIDTH = HOURS.length * PX_PER_HOUR;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function CommandCenter() {
  const [jobs, setJobs] = useState(timelineJobs);
  const [activeJobId, setActiveJobId] = useState<string>(timelineJobs[1].id);
  const [activeNodeId, setActiveNodeId] = useState<string>(serviceNodes[2].id);
  const [focusTarget, setFocusTarget] = useState<
    | { type: "job"; id: string }
    | { type: "node"; id: string }
    | null
  >(null);
  const [copilotIndex, setCopilotIndex] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTick((current) => current + 1);
      setCopilotIndex((current) => (current + 1) % copilotInsights.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const carbonWindow = carbonForecast[tick % carbonForecast.length];
  const activeJob = jobs.find((job) => job.id === activeJobId) ?? jobs[0];
  const activeNode = serviceNodes.find((node) => node.id === activeNodeId) ?? serviceNodes[0];
  const activeInsight = copilotInsights[copilotIndex];

  const liveSignals = useMemo(
    () =>
      summarySignals.map((signal, index) => ({
        ...signal,
        value:
          signal.kind === "currency"
            ? `$${(signal.base + ((tick + index * 3) % 7) * signal.step).toFixed(1)}k`
            : signal.kind === "percent"
              ? `${signal.base + ((tick + index) % 5) * signal.step}%`
              : `${signal.base + ((tick + index * 2) % 4) * signal.step}g`,
        delta: signal.delta[tick % signal.delta.length]
      })),
    [tick]
  );

  const totalShiftableHours = useMemo(
    () =>
      jobs
        .filter((job) => job.flexible)
        .reduce((sum, job) => sum + job.duration, 0),
    [jobs]
  );

  const heatmapStops = useMemo(
    () =>
      carbonForecast
        .map((entry, index) => `${entry.color} ${Math.round((index / carbonForecast.length) * 100)}%`)
        .join(", "),
    []
  );

  const openJobFocus = (id: string) => {
    setActiveJobId(id);
    startTransition(() => setFocusTarget({ type: "job", id }));
  };

  const openNodeFocus = (id: string) => {
    setActiveNodeId(id);
    startTransition(() => setFocusTarget({ type: "node", id }));
  };

  const handleJobDrag = (job: Job, offsetX: number) => {
    const nextStart = clamp(
      Math.round((job.start * PX_PER_HOUR + offsetX) / PX_PER_HOUR),
      0,
      24 - job.duration
    );

    setJobs((current) =>
      current.map((item) => (item.id === job.id ? { ...item, start: nextStart } : item))
    );
    setActiveJobId(job.id);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08111f] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 15% 20%, rgba(106, 227, 170, 0.16), transparent 24%), radial-gradient(circle at 85% 18%, rgba(76, 146, 255, 0.18), transparent 26%), linear-gradient(115deg, rgba(8, 17, 31, 0.96), rgba(11, 18, 32, 0.84)), linear-gradient(90deg, ${heatmapStops})`
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_44%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:120px_120px]" />

      <LayoutGroup>
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1560px] flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
          <motion.header
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 rounded-[32px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.34em] text-slate-400">Green-Ops</p>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold tracking-[-0.04em] text-white md:text-2xl">
                    AI Cloud Cost & Carbon Command Center
                  </h1>
                  <Badge className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
                    Live co-pilot
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {controlSurfaces.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="group rounded-full border border-white/10 bg-white/6 px-4 py-2 text-left transition hover:border-emerald-300/30 hover:bg-white/10"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm text-slate-100 transition group-hover:text-white">{item.value}</p>
                </button>
              ))}
              <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-300" />
                Carbon window favorable until 16:00
              </div>
            </div>
          </motion.header>

          <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[linear-gradient(160deg,rgba(12,21,39,0.9),rgba(11,17,31,0.72))] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-8"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.14),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(96,165,250,0.14),_transparent_24%)]" />
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="max-w-3xl space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-slate-200">
                      Real-time scheduling intelligence
                    </Badge>
                    <Badge className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-cyan-100">
                      Multi-region carbon aware
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.06em] text-white md:text-6xl">
                      An orchestration surface where cloud spend, carbon intensity, and AI guidance move together.
                    </h2>
                    <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                      Green-Ops is designed as a live command center, not a report. Workloads glide across the day, the energy layer shifts with the grid, and the co-pilot exposes the next highest-leverage action before you ask.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[30px] border border-white/10 bg-black/20 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Command pulse</p>
                        <p className="mt-2 text-lg font-medium text-white">Live resource posture</p>
                      </div>
                      <CircleDashed className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {liveSignals.map((signal) => (
                        <motion.button
                          key={signal.label}
                          whileHover={{ y: -5, scale: 1.01 }}
                          type="button"
                          onClick={() =>
                            signal.scope === "job" ? openJobFocus(activeJobId) : openNodeFocus(activeNodeId)
                          }
                          className="rounded-[24px] border border-white/8 bg-white/6 p-4 text-left backdrop-blur-sm"
                        >
                          <p className="text-sm text-slate-400">{signal.label}</p>
                          <p className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{signal.value}</p>
                          <p className="mt-2 text-sm text-emerald-200">{signal.delta}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ rotate: -1.2, y: -4 }}
                    className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(160deg,rgba(18,28,50,0.92),rgba(8,14,27,0.62))] p-5"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(110,231,183,0.16),transparent_30%),radial-gradient(circle_at_78%_28%,rgba(59,130,246,0.18),transparent_32%)]" />
                    <div className="relative">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Sustainability weather</p>
                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <p className="text-4xl font-semibold tracking-[-0.06em] text-white">{carbonWindow.score}</p>
                          <p className="mt-2 text-sm text-slate-300">{carbonWindow.label}</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-slate-200">
                          {carbonWindow.window}
                        </div>
                      </div>
                      <div className="mt-8 space-y-3">
                        {carbonForecast.slice(0, 6).map((entry) => (
                          <div key={entry.hour} className="flex items-center gap-3">
                            <div className="w-14 text-xs uppercase tracking-[0.18em] text-slate-500">{entry.hour}</div>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: entry.color }}
                                animate={{ width: `${entry.intensity}%` }}
                              />
                            </div>
                            <div className="w-14 text-right text-sm text-slate-300">{entry.intensity}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 }}
              className="relative overflow-hidden rounded-[36px] border border-emerald-300/14 bg-[linear-gradient(180deg,rgba(12,22,34,0.92),rgba(8,15,26,0.88))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(110,231,183,0.16),transparent_32%)]" />
              <div className="relative flex h-full flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">AI copilot</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">
                      Optimization cockpit
                    </h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
                    <Bot className="h-5 w-5 text-emerald-200" />
                  </div>
                </div>

                <motion.div layoutId={`copilot-${activeInsight.id}`} className="rounded-[28px] border border-white/10 bg-white/7 p-5">
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <Sparkles className="h-4 w-4" />
                    Suggested move
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeInsight.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -14 }}
                      transition={{ duration: 0.28 }}
                      className="mt-4 space-y-4"
                    >
                      <p className="text-2xl font-medium tracking-[-0.05em] text-white">{activeInsight.title}</p>
                      <p className="text-sm leading-7 text-slate-300">{activeInsight.body}</p>
                      <div className="flex flex-wrap gap-2">
                        {activeInsight.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <div className="grid gap-3">
                  {copilotInsights.map((insight, index) => (
                    <button
                      key={insight.id}
                      type="button"
                      onClick={() => setCopilotIndex(index)}
                      className={cn(
                        "group rounded-[24px] border px-4 py-4 text-left transition",
                        index === copilotIndex
                          ? "border-emerald-300/20 bg-emerald-300/10"
                          : "border-white/8 bg-white/4 hover:border-white/14 hover:bg-white/8"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{insight.metric}</p>
                        <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{insight.eta}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-300">{insight.preview}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-auto grid gap-3 sm:grid-cols-2">
                  <Button className="rounded-2xl bg-emerald-300 px-5 py-3 text-slate-950 hover:bg-emerald-200">
                    Apply schedule
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-white hover:bg-white/12">
                    Run simulation
                    <Play className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.aside>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <motion.section
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="overflow-hidden rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,29,0.94),rgba(10,16,28,0.78))] shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl"
            >
              <div className="border-b border-white/8 px-6 py-5 md:px-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.34em] text-slate-500">Timeline interface</p>
                    <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                      Shift workloads into cleaner hours with direct manipulation
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200">
                      {totalShiftableHours}h flexible today
                    </div>
                    <div className="rounded-full border border-cyan-400/16 bg-cyan-400/8 px-4 py-2 text-sm text-cyan-100">
                      Carbon overlay active
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 py-6 md:px-7 md:py-7">
                <div className="overflow-x-auto pb-2">
                  <div className="relative" style={{ minWidth: `${TRACK_WIDTH}px` }}>
                    <div className="mb-6 flex">
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          className="flex h-12 items-end border-l border-white/8 pb-2 pl-2 text-[10px] uppercase tracking-[0.24em] text-slate-500"
                          style={{ width: `${PX_PER_HOUR}px` }}
                        >
                          {hour.toString().padStart(2, "0")}
                        </div>
                      ))}
                    </div>

                    <div className="absolute left-0 right-0 top-12 flex gap-0 rounded-full border border-white/8 bg-white/4 p-1">
                      {carbonForecast.map((entry) => (
                        <div key={entry.hour} className="group relative h-8 flex-1 rounded-full" style={{ backgroundColor: entry.color }}>
                          <span className="absolute inset-x-1 top-full mt-2 hidden rounded-full border border-white/10 bg-[#09111d] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:block">
                            {entry.hour} · {entry.intensity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-16 space-y-4">
                      {jobs.map((job, lane) => (
                        <div key={job.id} className="relative h-[76px] rounded-[28px] border border-white/8 bg-black/12">
                          <div className="absolute inset-y-0 left-0 flex w-[170px] items-center border-r border-white/8 px-4">
                            <div>
                              <p className="text-sm font-medium text-white">{job.name}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{job.region}</p>
                            </div>
                          </div>
                          <div className="absolute inset-y-0 left-[170px] right-0">
                            {HOURS.map((hour) => (
                              <div
                                key={`${job.id}-${hour}`}
                                className="absolute inset-y-0 border-l border-white/6"
                                style={{ left: `${hour * PX_PER_HOUR}px` }}
                              />
                            ))}
                            <motion.button
                              layoutId={`job-${job.id}`}
                              drag="x"
                              dragElastic={0.04}
                              dragMomentum={false}
                              dragConstraints={{
                                left: -(job.start * PX_PER_HOUR),
                                right: (24 - job.duration - job.start) * PX_PER_HOUR
                              }}
                              onDragEnd={(_, info) => handleJobDrag(job, info.offset.x)}
                              onClick={() => openJobFocus(job.id)}
                              whileHover={{ y: -4, scale: 1.01 }}
                              className={cn(
                                "absolute top-[10px] flex h-[56px] items-center justify-between rounded-[22px] border px-4 text-left shadow-[0_20px_40px_rgba(0,0,0,0.25)]",
                                activeJobId === job.id
                                  ? "border-white/30 bg-white/16"
                                  : "border-white/10 bg-white/10"
                              )}
                              style={{
                                left: `${job.start * PX_PER_HOUR}px`,
                                width: `${job.duration * PX_PER_HOUR - 6}px`
                              }}
                            >
                              <div>
                                <p className="text-sm font-medium text-white">{job.workload}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">{job.savings}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-emerald-200">{job.carbonDelta}</p>
                                <p className="text-xs text-slate-400">{lane + 1} lane</p>
                              </div>
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Selected workload</p>
                        <p className="mt-2 text-xl font-medium text-white">{activeJob.name}</p>
                      </div>
                      <TimerReset className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="mt-5 space-y-4">
                      <MetricLine label="Current slot" value={`${activeJob.start}:00 - ${activeJob.start + activeJob.duration}:00`} />
                      <MetricLine label="Projected savings" value={activeJob.savings} />
                      <MetricLine label="Carbon movement" value={activeJob.carbonDelta} />
                      <MetricLine label="Dependencies" value={activeJob.dependencies.join(", ")} />
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,25,43,0.86),rgba(10,17,29,0.72))] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Autopilot rationale</p>
                        <p className="mt-2 text-lg font-medium text-white">Why this schedule moved</p>
                      </div>
                      <BrainCircuit className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      {activeJob.reasoning.map((reason) => (
                        <div key={reason.title} className="rounded-[22px] border border-white/8 bg-black/15 p-4">
                          <p className="text-sm font-medium text-white">{reason.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{reason.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 }}
              className="overflow-hidden rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,29,0.92),rgba(11,18,32,0.8))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">System graph</p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                    Dependency topology with optimization hotspots
                  </h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-200">
                  Click any node to optimize
                </div>
              </div>

              <div className="relative mt-8 min-h-[520px] rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),_transparent_52%)]">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {serviceNodes.flatMap((node) =>
                    node.links.map((target) => {
                      const targetNode = serviceNodes.find((item) => item.id === target);
                      if (!targetNode) return [];

                      return (
                        <motion.line
                          key={`${node.id}-${target}`}
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={
                            node.id === activeNodeId || target === activeNodeId
                              ? "rgba(110,231,183,0.55)"
                              : "rgba(148,163,184,0.18)"
                          }
                          strokeWidth="0.35"
                          strokeDasharray="2 2"
                          animate={{ opacity: [0.45, 0.9, 0.45] }}
                          transition={{ duration: 3.4, repeat: Infinity, delay: node.x / 100 }}
                        />
                      );
                    })
                  )}
                </svg>

                {serviceNodes.map((node) => (
                  <motion.button
                    key={node.id}
                    layoutId={`node-${node.id}`}
                    whileHover={{ scale: 1.05, y: -4 }}
                    onClick={() => openNodeFocus(node.id)}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-[26px] border px-4 py-3 text-left shadow-[0_20px_50px_rgba(0,0,0,0.26)] backdrop-blur-xl",
                      node.id === activeNodeId
                        ? "border-emerald-300/30 bg-emerald-300/12"
                        : "border-white/10 bg-white/8"
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 h-3 w-3 rounded-full"
                        style={{ backgroundColor: node.statusColor }}
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{node.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{node.type}</p>
                        <p className="mt-2 text-sm text-slate-200">{node.metric}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}

                <div className="absolute bottom-5 left-5 right-5 grid gap-3">
                  <motion.div
                    layoutId={`graph-summary-${activeNode.id}`}
                    className="rounded-[28px] border border-white/10 bg-[#09111d]/85 p-5 backdrop-blur-xl"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">Active surface</p>
                        <p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">{activeNode.name}</p>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">{activeNode.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {activeNode.stats.map((stat) => (
                          <div key={stat.label} className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                            <p className="mt-2 text-lg font-medium text-white">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </section>
        </div>

        <AnimatePresence>
          {focusTarget ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(2,6,14,0.72)] p-4 backdrop-blur-xl md:items-center"
              onClick={() => setFocusTarget(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.28 }}
                className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,26,0.98),rgba(7,13,22,0.94))] shadow-[0_40px_140px_rgba(0,0,0,0.42)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(110,231,183,0.12),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.12),_transparent_24%)]" />
                <div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Focus mode</p>
                      <button
                        type="button"
                        onClick={() => setFocusTarget(null)}
                        className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-sm text-slate-200"
                      >
                        Close
                      </button>
                    </div>

                    {focusTarget.type === "job" ? (
                      <JobFocusPanel job={jobs.find((job) => job.id === focusTarget.id) ?? jobs[0]} />
                    ) : (
                      <NodeFocusPanel node={serviceNodes.find((node) => node.id === focusTarget.id) ?? serviceNodes[0]} />
                    )}
                  </div>

                  <div className="rounded-[30px] border border-white/8 bg-white/5 p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Execution stream</p>
                    <div className="mt-5 space-y-4">
                      {[
                        "Forecast grid intensity across all regions for the next 6 hours.",
                        "Simulate cost impact of moving flexible workloads into the green corridor.",
                        "Validate service dependencies before issuing a reschedule plan.",
                        "Surface rollback path if latency SLOs cross threshold."
                      ].map((step, index) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="flex gap-4 rounded-[22px] border border-white/8 bg-black/12 p-4"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{step}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                              The co-pilot keeps this chain visible so every optimization feels explainable instead of opaque.
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button className="rounded-2xl bg-emerald-300 px-5 py-3 text-slate-950 hover:bg-emerald-200">
                        Commit recommendation
                        <MoveRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button className="rounded-2xl border border-white/10 bg-white/8 px-5 py-3 text-white hover:bg-white/12">
                        Export rationale
                        <ShieldCheck className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </LayoutGroup>
    </main>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function JobFocusPanel({ job }: { job: Job }) {
  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
        <Waves className="h-3.5 w-3.5" />
        Workload deep dive
      </div>
      <div>
        <h4 className="text-4xl font-semibold tracking-[-0.06em] text-white">{job.name}</h4>
        <p className="mt-3 max-w-xl text-base leading-8 text-slate-300">{job.detail}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "Window", value: `${job.start}:00 - ${job.start + job.duration}:00` },
          { label: "Region", value: job.region },
          { label: "Expected savings", value: job.savings },
          { label: "Carbon delta", value: job.carbonDelta }
        ].map((item) => (
          <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
            <p className="mt-2 text-lg font-medium text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function NodeFocusPanel({ node }: { node: Node }) {
  const icon = node.type.includes("GPU") ? Cpu : node.type.includes("Cloud") ? Cloud : Zap;
  const Icon = icon;

  return (
    <>
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100">
        <Icon className="h-3.5 w-3.5" />
        Service dependency lens
      </div>
      <div>
        <h4 className="text-4xl font-semibold tracking-[-0.06em] text-white">{node.name}</h4>
        <p className="mt-3 max-w-xl text-base leading-8 text-slate-300">{node.description}</p>
      </div>
      <div className="grid gap-3">
        {node.stats.map((stat) => (
          <div key={stat.label} className="rounded-[22px] border border-white/8 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
            <p className="mt-2 text-lg font-medium text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
