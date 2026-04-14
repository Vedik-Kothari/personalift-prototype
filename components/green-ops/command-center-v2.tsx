"use client";

import { startTransition, useEffect, useEffectEvent, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Cpu, Leaf, MoveRight, Play, ShieldCheck, Sparkles, Waves, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activityFeed, carbonForecast, commandMetrics, controlLayers, controlSurfaces, copilotInsights, serviceNodes, timelineJobs } from "@/lib/green-ops-data";
import { cn } from "@/lib/utils";

type Job = (typeof timelineJobs)[number];
type Node = (typeof serviceNodes)[number];
type Insight = (typeof copilotInsights)[number];
type Focus = { type: "job" | "node" | "insight"; id: string } | null;

const HOURS = Array.from({ length: carbonForecast.length }, (_, i) => i + 8);
const PX = 56;
const LABEL = 170;
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const formatMetric = (unit: string, base: number, step: number, tick: number, index: number) => {
  const value = base + (((tick + index * 2) % 4) * step);
  if (unit === "currency") return `$${value.toFixed(1)}k`;
  if (unit === "percent") return `${Math.round(value)}%`;
  return `${Math.round(value)}`;
};
const forecastPath = `M ${carbonForecast.map((entry, index) => `${(index / (carbonForecast.length - 1)) * 100},${100 - entry.score}`).join(" L ")}`;

export function CommandCenterV2() {
  const [jobs, setJobs] = useState(timelineJobs);
  const [activeJobId, setActiveJobId] = useState(timelineJobs[0].id);
  const [activeNodeId, setActiveNodeId] = useState(serviceNodes[0].id);
  const [copilotIndex, setCopilotIndex] = useState(0);
  const [focus, setFocus] = useState<Focus>(null);
  const [tick, setTick] = useState(0);

  const pump = useEffectEvent(() => {
    setTick((v) => v + 1);
    setCopilotIndex((v) => (v + 1) % copilotInsights.length);
  });

  useEffect(() => {
    const id = window.setInterval(() => pump(), 3200);
    return () => window.clearInterval(id);
  }, [pump]);

  const activeJob = jobs.find((job) => job.id === activeJobId) ?? jobs[0];
  const activeNode = serviceNodes.find((node) => node.id === activeNodeId) ?? serviceNodes[0];
  const activeInsight = copilotInsights[copilotIndex];
  const liveWindow = carbonForecast[tick % carbonForecast.length];
  const stops = useMemo(() => carbonForecast.map((entry, index) => `${entry.color} ${Math.round((index / (carbonForecast.length - 1)) * 100)}%`).join(", "), []);
  const metrics = useMemo(() => commandMetrics.map((metric, index) => ({ ...metric, value: formatMetric(metric.unit, metric.base, metric.step, tick, index), delta: metric.change[tick % metric.change.length] })), [tick]);

  const openFocus = (type: "job" | "node" | "insight", id: string) => startTransition(() => setFocus({ type, id }));
  const dragJob = (job: Job, offsetX: number) => {
    const next = clamp(Math.round((job.start * PX + offsetX) / PX), HOURS[0], HOURS[0] + HOURS.length - job.duration);
    setJobs((current) => current.map((item) => (item.id === job.id ? { ...item, start: next } : item)));
    setActiveJobId(job.id);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07111d] text-white">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        animate={{ backgroundPosition: ["0% 0%", "100% 30%", "0% 100%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ backgroundImage: `radial-gradient(circle at 12% 18%, rgba(63,247,170,.16), transparent 20%), radial-gradient(circle at 88% 16%, rgba(103,185,255,.18), transparent 24%), radial-gradient(circle at 74% 72%, rgba(167,139,250,.16), transparent 22%), linear-gradient(120deg, rgba(7,17,29,.92), rgba(8,14,26,.78)), linear-gradient(90deg, ${stops})`, backgroundSize: "auto,auto,auto,auto,240% 240%" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:120px_120px]" />

      <LayoutGroup>
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1580px] flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
          <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 rounded-[34px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_28px_120px_rgba(0,0,0,.34)] backdrop-blur-2xl xl:grid-cols-[1.2fr_.8fr]">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(145deg,rgba(12,22,38,.92),rgba(8,14,24,.78))] p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(110,231,183,.16),transparent_26%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,.18),transparent_28%)]" />
              <div className="relative space-y-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-emerald-300/20 bg-emerald-300/10 text-emerald-100"><Leaf className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.34em] text-slate-400">Green-Ops Command Center</p>
                        <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-[-0.07em] text-white md:text-6xl">Cloud cost and carbon optimization as a living command bridge.</h1>
                      </div>
                    </div>
                    <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">The UI is built as a spatial system: AI floats alongside the work, jobs move on a timeline instead of a table, and the background itself reveals when the grid turns cleaner.</p>
                    <div className="flex flex-wrap gap-2"><Badge className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-100">Dark glass system</Badge><Badge className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-sky-100">Framer Motion driven</Badge></div>
                  </div>
                  <motion.button whileHover={{ y: -4 }} type="button" onClick={() => openFocus("insight", activeInsight.id)} className="w-full max-w-[340px] rounded-[28px] border border-emerald-300/20 bg-emerald-300/10 p-5 text-left md:w-auto">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-emerald-100/80">Co-pilot live recommendation</p>
                    <p className="mt-3 text-lg font-medium tracking-[-0.04em] text-white">{activeInsight.effect}</p>
                    <p className="mt-4 text-sm leading-7 text-emerald-50/90">{activeInsight.preview}</p>
                  </motion.button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[.95fr_1.05fr]">
                  <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-wrap gap-2">{controlSurfaces.map((item) => <div key={item.label} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-200"><span className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{item.label}</span><span className="ml-2 text-white">{item.value}</span></div>)}</div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <motion.button key={metric.label} whileHover={{ y: -5, scale: 1.01 }} type="button" onClick={() => (metric.label === "Idle GPU" ? (setActiveNodeId("n1"), openFocus("node", "n1")) : openFocus("insight", activeInsight.id))} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4 text-left"><p className="text-sm text-slate-400">{metric.label}</p><p className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white">{metric.value}</p><p className="mt-2 text-sm text-emerald-200">{metric.delta}</p></motion.button>)}</div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[.82fr_1.18fr]">
                    <motion.div whileHover={{ y: -4, rotate: -0.8 }} className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5">
                      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Energy weather</p>
                      <div className="mt-5 flex items-end justify-between gap-4"><div><p className="text-5xl font-semibold tracking-[-0.07em] text-white">{liveWindow.score}</p><p className="mt-2 text-sm text-slate-300">{liveWindow.label}</p></div><div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">{liveWindow.window}</div></div>
                      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><motion.div animate={{ width: `${liveWindow.score}%` }} className="h-full rounded-full bg-[linear-gradient(90deg,#78f0b5,#6ba9ff)]" /></div>
                    </motion.div>
                    <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,18,31,.88),rgba(9,16,28,.72))] p-5">
                      <div className="flex items-center justify-between"><div><p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Pulse chart</p><p className="mt-2 text-lg font-medium text-white">Carbon-aware system rhythm</p></div><div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Live</div></div>
                      <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4"><svg viewBox="0 0 100 100" className="h-36 w-full"><defs><linearGradient id="pulse-line" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stopColor="#73f0b8" /><stop offset="100%" stopColor="#74a7ff" /></linearGradient></defs><motion.path d={forecastPath} fill="none" stroke="url(#pulse-line)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: .1, opacity: .5 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} />{carbonForecast.map((entry, index) => <motion.circle key={entry.hour} cx={(index / (carbonForecast.length - 1)) * 100} cy={100 - entry.score} r="2.5" fill={entry.score >= liveWindow.score ? "#78f0b5" : "#93c5fd"} animate={{ r: index === tick % carbonForecast.length ? [2.5, 4.5, 2.5] : 2.5 }} transition={{ duration: 1.6, repeat: Infinity }} />)}</svg></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,31,.96),rgba(8,14,24,.88))] p-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(110,231,183,.16),transparent_34%)]" />
              <div className="relative flex h-full flex-col gap-5">
                <div className="flex items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">AI Co-pilot</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">Optimization cockpit</h2></div><div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.06]"><Bot className="h-5 w-5 text-emerald-100" /></div></div>
                <motion.button layoutId={`insight-${activeInsight.id}`} whileHover={{ y: -4 }} type="button" onClick={() => openFocus("insight", activeInsight.id)} className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 text-left">
                  <div className="flex items-center gap-2 text-sm text-emerald-200"><Sparkles className="h-4 w-4" />Suggested move</div>
                  <AnimatePresence mode="wait"><motion.div key={activeInsight.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="mt-4 space-y-4"><p className="text-2xl font-medium tracking-[-0.05em] text-white">{activeInsight.title}</p><p className="text-sm leading-7 text-slate-300">{activeInsight.body}</p><div className="flex flex-wrap gap-2">{activeInsight.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{tag}</span>)}</div></motion.div></AnimatePresence>
                </motion.button>
                <div className="grid gap-3">{copilotInsights.map((insight, index) => <button key={insight.id} type="button" onClick={() => { setCopilotIndex(index); setActiveJobId(jobs[index % jobs.length].id); }} className={cn("rounded-[22px] border p-4 text-left transition", index === copilotIndex ? "border-emerald-300/20 bg-emerald-300/10" : "border-white/10 bg-white/[0.05] hover:border-white/20 hover:bg-white/[0.08]")}><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-white">{insight.metric}</p><span className="text-xs uppercase tracking-[0.22em] text-slate-500">{insight.eta}</span></div><p className="mt-2 text-sm text-slate-300">{insight.preview}</p></button>)}</div>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">{controlLayers.map((layer) => <motion.button key={layer.id} whileHover={{ x: 6 }} type="button" onClick={() => openFocus("insight", activeInsight.id)} className="rounded-[22px] border border-white/10 bg-black/15 p-4 text-left"><p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{layer.label}</p><p className="mt-2 text-lg font-medium text-white">{layer.value}</p><p className="mt-2 text-sm text-slate-300">{layer.detail}</p></motion.button>)}</div>
                <div className="mt-auto grid gap-3 sm:grid-cols-2"><Button className="rounded-[18px] bg-emerald-300 px-5 py-3 text-slate-950 hover:bg-emerald-200">Apply schedule<ArrowRight className="ml-2 h-4 w-4" /></Button><Button className="rounded-[18px] border border-white/10 bg-white/[0.08] px-5 py-3 text-white hover:bg-white/[0.12]">Run simulation<Play className="ml-2 h-4 w-4" /></Button></div>
              </div>
            </motion.aside>
          </motion.section>
          <section className="grid gap-6 xl:grid-cols-[.88fr_1.12fr]">
            <motion.section initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_24px_100px_rgba(0,0,0,.34)] backdrop-blur-2xl md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">System graph</p><h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Optimization topology</h3><p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">Nodes represent workloads, data planes, and orchestration surfaces. The active path brightens so dependencies feel alive.</p></div><button type="button" onClick={() => openFocus("node", activeNode.id)} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200">Focus active node</button></div>
              <div className="relative mt-8 min-h-[500px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,30,.94),rgba(8,14,24,.72))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_54%)]" />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">{serviceNodes.flatMap((node) => node.links.map((target) => { const to = serviceNodes.find((item) => item.id === target); if (!to) return []; return <motion.line key={`${node.id}-${target}`} x1={node.x} y1={node.y} x2={to.x} y2={to.y} stroke={node.id === activeNodeId || target === activeNodeId ? "rgba(110,231,183,.56)" : "rgba(148,163,184,.18)"} strokeWidth=".42" strokeDasharray="2 2" animate={{ opacity: [.25, .85, .25] }} transition={{ duration: 3.2, repeat: Infinity, delay: node.x / 100 }} />; }))}</svg>
                {serviceNodes.map((node) => <motion.button key={node.id} layoutId={`node-${node.id}`} whileHover={{ scale: 1.05, y: -5 }} type="button" onClick={() => { setActiveNodeId(node.id); openFocus("node", node.id); }} className={cn("absolute -translate-x-1/2 -translate-y-1/2 rounded-[24px] border px-4 py-3 text-left shadow-[0_20px_40px_rgba(0,0,0,.24)] backdrop-blur-xl", node.id === activeNodeId ? "border-emerald-300/30 bg-emerald-300/12" : "border-white/10 bg-white/[0.08]")} style={{ left: `${node.x}%`, top: `${node.y}%` }}><div className="flex items-start gap-3"><div className="mt-1 h-3 w-3 rounded-full" style={{ backgroundColor: node.statusColor }} /><div><p className="text-sm font-medium text-white">{node.name}</p><p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">{node.type}</p><p className="mt-2 text-sm text-slate-200">{node.metric}</p></div></div></motion.button>)}
                <div className="absolute inset-x-4 bottom-4 rounded-[26px] border border-white/10 bg-[#08111d]/85 p-5 backdrop-blur-xl"><div className="flex flex-col gap-4"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">Active surface</p><p className="mt-2 text-2xl font-medium tracking-[-0.04em] text-white">{activeNode.name}</p><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">{activeNode.description}</p></div><Button className="rounded-[18px] border border-white/10 bg-white/[0.08] px-4 py-3 text-white hover:bg-white/[0.12]" onClick={() => openFocus("node", activeNode.id)}>Optimize node<MoveRight className="ml-2 h-4 w-4" /></Button></div><div className="grid gap-3 sm:grid-cols-3">{activeNode.stats.map((stat) => <div key={stat.label} className="rounded-[20px] border border-white/10 bg-white/[0.06] px-4 py-3"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p><p className="mt-2 text-lg font-medium text-white">{stat.value}</p></div>)}</div></div></div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.05] shadow-[0_24px_100px_rgba(0,0,0,.34)] backdrop-blur-2xl">
              <div className="border-b border-white/10 px-6 py-5 md:px-7"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Timeline studio</p><h3 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">Drag workloads and let the energy layer answer back</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">This replaces tables with direct manipulation. Jobs become movable objects, carbon becomes an atmospheric layer, and rationale stays attached to the action.</p></div><div className="flex flex-wrap gap-2"><div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-200">{jobs.filter((job) => job.flexible).length} workloads shiftable</div><div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">Carbon overlay active</div></div></div></div>
              <div className="space-y-6 px-6 py-6 md:px-7 md:py-7">
                <div className="grid gap-4 lg:grid-cols-[.78fr_1.22fr]">
                  <Panel title="Selected workload" value={activeJob.name}><MetricLine label="Window" value={`${activeJob.start}:00 - ${activeJob.start + activeJob.duration}:00`} /><MetricLine label="Region" value={activeJob.region} /><MetricLine label="Projected savings" value={activeJob.savings} /><MetricLine label="Carbon movement" value={activeJob.carbonDelta} /><MetricLine label="Dependencies" value={activeJob.dependencies.join(", ")} /></Panel>
                  <div className="rounded-[28px] border border-white/10 bg-black/15 p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Autopilot rationale</p><p className="mt-2 text-lg font-medium text-white">Why this workload can move</p></div><BrainCircuit className="h-5 w-5 text-cyan-200" /></div><div className="mt-5 grid gap-3 md:grid-cols-3">{activeJob.reasoning.map((reason) => <button key={reason.title} type="button" onClick={() => openFocus("job", activeJob.id)} className="rounded-[20px] border border-white/10 bg-white/[0.05] p-4 text-left"><p className="text-sm font-medium text-white">{reason.title}</p><p className="mt-2 text-sm leading-6 text-slate-300">{reason.body}</p></button>)}</div></div>
                </div>

                <div className="overflow-x-auto pb-2">
                  <div className="relative" style={{ minWidth: `${LABEL + HOURS.length * PX}px` }}>
                    <div className="ml-[170px] flex">{HOURS.map((hour) => <div key={hour} className="flex h-11 items-end border-l border-white/10 pb-2 pl-2 text-[10px] uppercase tracking-[0.22em] text-slate-500" style={{ width: `${PX}px` }}>{String(hour).padStart(2, "0")}</div>)}</div>
                    <div className="ml-[170px] mt-4 flex gap-[2px] rounded-full border border-white/10 bg-white/[0.05] p-1">{carbonForecast.map((entry) => <button key={entry.hour} type="button" onClick={() => openFocus("insight", activeInsight.id)} className="group relative h-9 flex-1 rounded-full transition hover:scale-[1.03]" style={{ backgroundColor: entry.color }}><span className="absolute inset-x-1 top-full z-10 mt-2 hidden rounded-full border border-white/10 bg-[#09111d] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300 group-hover:block">{entry.hour} · score {entry.score}</span></button>)}</div>
                    <div className="mt-5 space-y-4">{jobs.map((job) => <div key={job.id} className="relative h-[78px] rounded-[26px] border border-white/10 bg-black/15"><div className="absolute inset-y-0 left-0 flex w-[170px] items-center border-r border-white/10 px-4"><div><p className="text-sm font-medium text-white">{job.name}</p><p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{job.lane}</p></div></div><div className="absolute inset-y-0 left-[170px] right-0">{HOURS.map((hour, index) => <div key={`${job.id}-${hour}`} className="absolute inset-y-0 border-l border-white/8" style={{ left: `${index * PX}px` }} />)}<motion.button type="button" layoutId={`job-${job.id}`} drag="x" dragElastic={0.04} dragMomentum={false} dragConstraints={{ left: -((job.start - HOURS[0]) * PX), right: (HOURS.length - job.duration - (job.start - HOURS[0])) * PX }} onDragEnd={(_, info) => dragJob(job, info.offset.x)} onClick={() => { setActiveJobId(job.id); openFocus("job", job.id); }} whileHover={{ y: -4, scale: 1.01 }} className={cn("absolute top-[11px] flex h-[54px] items-center justify-between rounded-[20px] border px-4 text-left shadow-[0_20px_40px_rgba(0,0,0,.22)]", activeJobId === job.id ? "border-white/30 bg-white/[0.16]" : "border-white/10 bg-white/[0.1]")} style={{ left: `${(job.start - HOURS[0]) * PX}px`, width: `${job.duration * PX - 6}px` }}><div><p className="text-sm font-medium text-white">{job.workload}</p><p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">{job.savings}</p></div><div className="text-right"><p className="text-sm text-emerald-200">{job.carbonDelta}</p><p className="text-xs text-slate-400">{job.region}</p></div></motion.button></div></div>)}</div>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-5"><div className="flex items-center justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Activity feed</p><p className="mt-2 text-lg font-medium text-white">The system narrates what changed</p></div><Waves className="h-5 w-5 text-emerald-200" /></div><div className="mt-5 space-y-3">{activityFeed.map((entry, index) => <motion.button key={entry.time + entry.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} type="button" onClick={() => openFocus(index % 2 === 0 ? "insight" : "node", index % 2 === 0 ? activeInsight.id : activeNode.id)} className="flex w-full items-start gap-4 rounded-[20px] border border-white/10 bg-black/15 p-4 text-left"><div className={cn("mt-1 h-2.5 w-2.5 rounded-full", entry.tone === "warning" ? "bg-amber-300" : entry.tone === "positive" ? "bg-emerald-300" : "bg-sky-300")} /><div><p className="text-xs uppercase tracking-[0.2em] text-slate-500">{entry.time}</p><p className="mt-1 text-sm text-white">{entry.title}</p></div></motion.button>)}</div></div>
                  <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,22,37,.86),rgba(8,14,24,.72))] p-5"><p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Focus mode</p><h4 className="mt-2 text-xl font-medium tracking-[-0.04em] text-white">Any click opens an immersive deep dive</h4><p className="mt-3 text-sm leading-7 text-slate-300">Graph nodes, timeline jobs, and AI recommendations all resolve into the same cinematic focus panel.</p><div className="mt-6 space-y-3"><FocusPill label="Inspect workload" onClick={() => openFocus("job", activeJob.id)} /><FocusPill label="Inspect topology" onClick={() => openFocus("node", activeNode.id)} /><FocusPill label="Inspect AI recommendation" onClick={() => openFocus("insight", activeInsight.id)} /></div></div>
                </div>
              </div>
            </motion.section>
          </section>
        </div>

        <AnimatePresence>{focus ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(2,6,14,.76)] p-4 backdrop-blur-2xl md:items-center" onClick={() => setFocus(null)}><motion.div initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} className="relative w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,26,.98),rgba(6,12,22,.94))] shadow-[0_40px_140px_rgba(0,0,0,.42)]" onClick={(event) => event.stopPropagation()}><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,231,183,.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,.12),transparent_24%)]" /><div className="relative grid gap-8 p-6 md:p-8 lg:grid-cols-[.9fr_1.1fr]"><div className="space-y-5"><div className="flex items-center justify-between gap-4"><p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">Focus mode</p><button type="button" onClick={() => setFocus(null)} className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-sm text-slate-200">Close</button></div>{focus.type === "job" ? <JobFocusPanel job={jobs.find((job) => job.id === focus.id) ?? jobs[0]} /> : focus.type === "node" ? <NodeFocusPanel node={serviceNodes.find((node) => node.id === focus.id) ?? serviceNodes[0]} /> : <InsightFocusPanel insight={copilotInsights.find((insight) => insight.id === focus.id) ?? activeInsight} />}</div><div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-5"><p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">Execution stream</p><div className="mt-5 space-y-4">{["Forecast grid intensity across eligible regions for the next 6 hours.", "Simulate shifts against cost ceilings and latency budgets.", "Validate service dependencies before issuing the recommendation.", "Prepare one-click commit plus rollback and rationale."].map((step, index) => <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .08 }} className="flex gap-4 rounded-[22px] border border-white/10 bg-black/15 p-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px] border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">{index + 1}</div><div><p className="text-sm font-medium text-white">{step}</p><p className="mt-2 text-sm leading-6 text-slate-300">Every action stays explainable, which keeps the co-pilot decisive without feeling opaque.</p></div></motion.div>)}</div><div className="mt-6 flex flex-wrap gap-3"><Button className="rounded-[18px] bg-emerald-300 px-5 py-3 text-slate-950 hover:bg-emerald-200">Commit recommendation<MoveRight className="ml-2 h-4 w-4" /></Button><Button className="rounded-[18px] border border-white/10 bg-white/[0.08] px-5 py-3 text-white hover:bg-white/[0.12]">Export rationale<ShieldCheck className="ml-2 h-4 w-4" /></Button></div></div></div></motion.div></motion.div> : null}</AnimatePresence>
      </LayoutGroup>
    </main>
  );
}

function Panel({ title, value, children }: { title: string; value: string; children: React.ReactNode }) {
  return <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,17,29,.88),rgba(10,16,28,.72))] p-5"><p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">{title}</p><p className="mt-2 text-xl font-medium text-white">{value}</p><div className="mt-5 space-y-4">{children}</div></div>;
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0"><p className="text-sm text-slate-400">{label}</p><p className="text-right text-sm font-medium text-white">{value}</p></div>;
}

function FocusPill({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex w-full items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm text-white"><span>{label}</span><ArrowRight className="h-4 w-4 text-slate-400" /></button>;
}

function JobFocusPanel({ job }: { job: Job }) {
  return <><div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100"><Waves className="h-3.5 w-3.5" />Workload deep dive</div><div><h4 className="text-4xl font-semibold tracking-[-0.06em] text-white">{job.name}</h4><p className="mt-3 max-w-xl text-base leading-8 text-slate-300">{job.detail}</p></div><div className="grid gap-3 sm:grid-cols-2">{[{ label: "Window", value: `${job.start}:00 - ${job.start + job.duration}:00` }, { label: "Region", value: job.region }, { label: "Expected savings", value: job.savings }, { label: "Carbon delta", value: job.carbonDelta }].map((item) => <div key={item.label} className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p><p className="mt-2 text-lg font-medium text-white">{item.value}</p></div>)}</div><div className="grid gap-3">{job.reasoning.map((reason) => <div key={reason.title} className="rounded-[22px] border border-white/10 bg-black/15 p-4"><p className="text-sm font-medium text-white">{reason.title}</p><p className="mt-2 text-sm leading-6 text-slate-300">{reason.body}</p></div>)}</div></>;
}

function NodeFocusPanel({ node }: { node: Node }) {
  const Icon = node.type.includes("GPU") ? Cpu : Zap;
  return <><div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100"><Icon className="h-3.5 w-3.5" />Service dependency lens</div><div><h4 className="text-4xl font-semibold tracking-[-0.06em] text-white">{node.name}</h4><p className="mt-3 max-w-xl text-base leading-8 text-slate-300">{node.description}</p></div><div className="grid gap-3 sm:grid-cols-3">{node.stats.map((stat) => <div key={stat.label} className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">{stat.label}</p><p className="mt-2 text-lg font-medium text-white">{stat.value}</p></div>)}</div></>;
}

function InsightFocusPanel({ insight }: { insight: Insight }) {
  return <><div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-100"><Sparkles className="h-3.5 w-3.5" />Co-pilot explanation</div><div><h4 className="text-4xl font-semibold tracking-[-0.06em] text-white">{insight.title}</h4><p className="mt-3 max-w-xl text-base leading-8 text-slate-300">{insight.body}</p></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Metric</p><p className="mt-2 text-lg font-medium text-white">{insight.metric}</p></div><div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Time to apply</p><p className="mt-2 text-lg font-medium text-white">{insight.eta}</p></div></div><div className="flex flex-wrap gap-2">{insight.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">{tag}</span>)}</div></>;
}
