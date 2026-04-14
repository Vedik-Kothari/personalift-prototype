export const controlSurfaces = [
  { label: "Region mesh", value: "us-east-2 / eu-west-1 / ap-south-1" },
  { label: "Mode", value: "Co-pilot with human commit" },
  { label: "Target", value: "Spend floor + carbon ceiling" }
] as const;

export const commandMetrics = [
  {
    label: "Cloud spend",
    base: 84.6,
    step: 1.1,
    unit: "currency",
    change: ["-7.4% this week", "-7.9% this week", "-8.2% this week", "-8.6% this week"]
  },
  {
    label: "Carbon score",
    base: 79,
    step: 2,
    unit: "score",
    change: ["green window expanding", "solar-heavy mix incoming", "clean corridor stable", "battery support engaged"]
  },
  {
    label: "Idle GPU",
    base: 23,
    step: 1,
    unit: "percent",
    change: ["2 pools reclaimable", "parking candidate confirmed", "vector idle detected", "retraining can shift safely"]
  },
  {
    label: "Auto actions",
    base: 11,
    step: 1,
    unit: "count",
    change: ["3 ready to commit", "rollback paths validated", "1 manual review pending", "queue policy drift found"]
  }
] as const;

export const carbonForecast = [
  { hour: "08:00", intensity: 82, score: 68, label: "Grid pressure elevated", window: "Watch closely", color: "rgba(249, 115, 22, 0.62)" },
  { hour: "09:00", intensity: 76, score: 72, label: "Wind contribution rising", window: "09:00 - 10:00", color: "rgba(245, 158, 11, 0.62)" },
  { hour: "10:00", intensity: 64, score: 78, label: "Solar ramp begins", window: "10:00 - 11:00", color: "rgba(234, 179, 8, 0.6)" },
  { hour: "11:00", intensity: 48, score: 86, label: "Clean corridor opens", window: "11:00 - 15:00", color: "rgba(132, 204, 22, 0.58)" },
  { hour: "12:00", intensity: 41, score: 92, label: "Lowest carbon interval", window: "11:00 - 15:00", color: "rgba(34, 197, 94, 0.62)" },
  { hour: "13:00", intensity: 43, score: 90, label: "Battery discharge assisting", window: "11:00 - 15:00", color: "rgba(16, 185, 129, 0.6)" },
  { hour: "14:00", intensity: 47, score: 87, label: "Still strongly favorable", window: "11:00 - 15:00", color: "rgba(20, 184, 166, 0.6)" },
  { hour: "15:00", intensity: 56, score: 82, label: "Corridor tapering", window: "15:00 - 16:00", color: "rgba(6, 182, 212, 0.58)" },
  { hour: "16:00", intensity: 63, score: 77, label: "Demand rising again", window: "16:00 - 17:00", color: "rgba(59, 130, 246, 0.56)" },
  { hour: "17:00", intensity: 71, score: 73, label: "Evening ramp approaching", window: "Prepare fallback", color: "rgba(129, 140, 248, 0.5)" }
] as const;

export const copilotInsights = [
  {
    id: "gpu-idle",
    title: "You are wasting 23% compute on idle GPUs between 09:00 and 11:00.",
    body: "Green-Ops can park one inference pool, shift retrieval indexing into the noon green corridor, and preserve the same response latency envelope.",
    metric: "Projected monthly reduction",
    eta: "4 min to apply",
    preview: "Save $18.4k and cut 11.7% carbon on this workload family.",
    tags: ["gpu parking", "queue shift", "low-risk"],
    effect: "+11.7% greener"
  },
  {
    id: "build-batch",
    title: "CI bursts in eu-west-1 are colliding with a dirtier energy band.",
    body: "Non-blocking integration suites can stagger 90 minutes later while critical PR checks remain in the fast lane. Cache efficiency improves as queue spikes flatten.",
    metric: "Latency-safe shift",
    eta: "2 min to simulate",
    preview: "Recover 7.8% build cost over the next 24 hours.",
    tags: ["ci orchestration", "carbon-aware", "dev-safe"],
    effect: "-18 min queue debt"
  },
  {
    id: "night-rebalance",
    title: "Night-time autoscaling is pinned to a demand shape that no longer exists.",
    body: "Analytics replay no longer peaks after midnight. Right-size the lower band and let midday clean capacity absorb the backlog with rollback guardrails in place.",
    metric: "Capacity reclaimed",
    eta: "5 min to verify",
    preview: "Release 41 vCPUs and avoid 84g CO2e per replay cycle.",
    tags: ["autoscaling", "policy drift", "capacity reclaim"],
    effect: "-41 vCPUs held"
  },
  {
    id: "carbon-router",
    title: "Carbon Router sees a cross-region swap worth executing before 12:30.",
    body: "The feature store is healthy enough to support a transient batch migration from ap-south-1 to eu-west-1 while the cleaner grid interval remains open.",
    metric: "Cross-region arbitrage",
    eta: "6 min to stage",
    preview: "Trade 3.2% extra latency budget for 9.1% cleaner execution.",
    tags: ["region swap", "policy-aware", "timed action"],
    effect: "+9.1 green score"
  }
] as const;

export const timelineJobs = [
  {
    id: "j1",
    name: "Inference retraining",
    workload: "Foundation refresh",
    start: 9,
    duration: 4,
    lane: "Model lane",
    region: "us-east-2",
    flexible: true,
    risk: "Low",
    savings: "$6.2k / month",
    carbonDelta: "-18g CO2e / run",
    detail: "Elastic retraining batch with room to move into the cleanest grid corridor without impacting downstream consumers.",
    dependencies: ["Feature Store", "GPU Pool A"],
    reasoning: [
      { title: "Elastic deadline", body: "No downstream consumer requires completion before 16:00." },
      { title: "GPU pressure", body: "Mid-morning contention leaves warm capacity under-utilized." },
      { title: "Carbon window", body: "Grid intensity drops sharply starting at 11:00." }
    ]
  },
  {
    id: "j2",
    name: "CI orchestration",
    workload: "Monorepo build fleet",
    start: 8,
    duration: 3,
    lane: "Delivery lane",
    region: "eu-west-1",
    flexible: true,
    risk: "Low",
    savings: "$3.9k / month",
    carbonDelta: "-9g CO2e / cycle",
    detail: "Background and release-candidate builds can be staggered while critical path checks remain untouched for developers.",
    dependencies: ["Artifact Registry", "Runner Mesh"],
    reasoning: [
      { title: "Developer-safe", body: "Critical PR checks stay pinned to the fast lane while non-blocking suites move." },
      { title: "Runner efficiency", body: "Queue spikes are fragmenting cache reuse across the build fleet." },
      { title: "Cleaner interval", body: "Regional intensity drops below 50 once the current burst finishes." }
    ]
  },
  {
    id: "j3",
    name: "Analytics replay",
    workload: "Warehouse sync",
    start: 13,
    duration: 4,
    lane: "Data lane",
    region: "ap-south-1",
    flexible: false,
    risk: "Medium",
    savings: "$1.6k / month",
    carbonDelta: "-4g CO2e / run",
    detail: "Dependency-bound replay chain with tighter movement constraints, but still responsive to lower autoscaling bands.",
    dependencies: ["Replay Queue", "DB Replicas"],
    reasoning: [
      { title: "Tight dependency chain", body: "The replay begins only after event compaction clears." },
      { title: "Autoscale tuning", body: "The win comes from right-sizing, not a full timeline move." },
      { title: "Latency trade-off", body: "Regional constraints keep the core flow local." }
    ]
  },
  {
    id: "j4",
    name: "Embedding indexing",
    workload: "Search refresh",
    start: 11,
    duration: 2,
    lane: "Retrieval lane",
    region: "us-east-2",
    flexible: true,
    risk: "Very low",
    savings: "$2.1k / month",
    carbonDelta: "-6g CO2e / run",
    detail: "Short, highly movable indexing burst that can ride the clean corridor and release GPU pressure for inference peaks.",
    dependencies: ["Vector Cache", "GPU Pool A"],
    reasoning: [
      { title: "Highly shiftable", body: "Refresh cadence allows a wide execution window." },
      { title: "Shared hardware", body: "Moving this job reduces competition for expensive GPU pools." },
      { title: "Green overlap", body: "It can align almost perfectly with the best carbon band today." }
    ]
  }
] as const;

export const serviceNodes = [
  {
    id: "n1",
    name: "GPU Pool A",
    type: "GPU cluster",
    metric: "62% idle risk",
    x: 18,
    y: 28,
    links: ["n2", "n3", "n7"],
    statusColor: "#6ee7b7",
    description: "Primary inference and indexing capacity in us-east-2. Warm-pool overhead makes it the highest-value parking target.",
    stats: [
      { label: "Idle headroom", value: "23%" },
      { label: "Potential savings", value: "$8.1k" },
      { label: "Thermal draw", value: "elevated" }
    ]
  },
  {
    id: "n2",
    name: "Feature Store",
    type: "Data plane",
    metric: "Freshness stable",
    x: 48,
    y: 16,
    links: ["n4"],
    statusColor: "#67e8f9",
    description: "Streaming features and embeddings are current enough to support later retraining without harming model quality.",
    stats: [
      { label: "Freshness lag", value: "42s" },
      { label: "Read pressure", value: "normal" },
      { label: "Replication", value: "healthy" }
    ]
  },
  {
    id: "n3",
    name: "Runner Mesh",
    type: "Cloud runners",
    metric: "Queue burst at 09:00",
    x: 40,
    y: 54,
    links: ["n4", "n5"],
    statusColor: "#fbbf24",
    description: "Cross-region CI runners with bursty workloads that hurt cache efficiency and pull jobs into dirtier energy hours.",
    stats: [
      { label: "Burst factor", value: "1.8x" },
      { label: "Cache hit rate", value: "67%" },
      { label: "Hot queue", value: "17 min" }
    ]
  },
  {
    id: "n4",
    name: "Artifact Registry",
    type: "Build fabric",
    metric: "Stable throughput",
    x: 70,
    y: 34,
    links: ["n6"],
    statusColor: "#60a5fa",
    description: "Acts as the stabilizer for CI staggering. Throughput remains healthy enough to support more deliberate scheduling.",
    stats: [
      { label: "Latency", value: "93ms" },
      { label: "Compression gain", value: "12%" },
      { label: "Egress cost", value: "low" }
    ]
  },
  {
    id: "n5",
    name: "Replay Queue",
    type: "Event backbone",
    metric: "Overnight backlog",
    x: 28,
    y: 80,
    links: ["n6"],
    statusColor: "#fb7185",
    description: "Night jobs spill into the next day because the autoscaling floor no longer matches actual demand.",
    stats: [
      { label: "Queue debt", value: "14 min" },
      { label: "Retry noise", value: "low" },
      { label: "Drain risk", value: "moderate" }
    ]
  },
  {
    id: "n6",
    name: "Carbon Router",
    type: "Optimization brain",
    metric: "11 suggestions pending",
    x: 76,
    y: 74,
    links: [],
    statusColor: "#34d399",
    description: "Policy and scheduling layer that weighs carbon intensity, cost ceilings, and service constraints before proposing live actions.",
    stats: [
      { label: "Pending moves", value: "11" },
      { label: "Confidence", value: "94%" },
      { label: "Rollback ready", value: "100%" }
    ]
  },
  {
    id: "n7",
    name: "Vector Cache",
    type: "Retrieval layer",
    metric: "Refresh due in 28m",
    x: 16,
    y: 58,
    links: ["n6"],
    statusColor: "#a78bfa",
    description: "Index refresh surface that can glide into cleaner hours to reduce GPU overlap with inference workloads.",
    stats: [
      { label: "Staleness", value: "acceptable" },
      { label: "Sync cadence", value: "30 min" },
      { label: "Move risk", value: "low" }
    ]
  }
] as const;

export const controlLayers = [
  {
    id: "cl-1",
    label: "Schedule pressure",
    value: "Medium",
    detail: "4 workloads are shiftable right now."
  },
  {
    id: "cl-2",
    label: "Carbon corridor",
    value: "11:00 - 15:00",
    detail: "Best composite grid score of the day."
  },
  {
    id: "cl-3",
    label: "Policy safety",
    value: "94%",
    detail: "Rollback paths are already validated."
  }
] as const;

export const activityFeed = [
  { time: "09:12", title: "Co-pilot simulated a GPU parking scenario", tone: "positive" },
  { time: "09:16", title: "CI queue debt fell after staggered runner release", tone: "neutral" },
  { time: "09:21", title: "Carbon Router opened a region-swap recommendation", tone: "positive" },
  { time: "09:29", title: "Replay queue policy drift requires manual sign-off", tone: "warning" }
] as const;
