// NexEra Education Analytics Dashboard (Preview)
// Clean, management-ready, brand-aligned.
// Tabs: Overview · Subjects / Industry · Engagement · Risk & Intervention
// Tailwind CSS only. No external chart libraries.

// -----------------------------------------------------------------------------
// DEMO DATA — simple, high-level
// -----------------------------------------------------------------------------

const demo = {
  kpis: {
    activeLearners: 1287,
    completionRate: 0.72,
    passRate: 0.68,
    readiness: 0.76,
    atRisk: 112,
  },
  trend: {
    weeks: ["W1", "W2", "W3", "W4", "W5", "W6"],
    avgScore: [61, 63, 64, 66, 67, 68],
    passRate: [58, 60, 61, 64, 66, 68],
    timeSim: [32, 35, 37, 40, 44, 47],
    timeTheory: [41, 40, 38, 36, 34, 33],
  },
  skills: [
    { name: "Electrical Assistant Skills", pct: 0.74, desc: "Tools, circuits, safety basics" },
    { name: "Customer Service Skills", pct: 0.68, desc: "Communication & problem-solving" },
    { name: "Animal Handling Skills", pct: 0.81, desc: "Care, safety & observation" },
    { name: "Digital Office Skills", pct: 0.73, desc: "Docs, spreadsheets, workflow" },
  ],
  failedSubjects: [
    { subject: "Electrical Circuits", industry: "Engineering", failRate: 0.31 },
    { subject: "Customer Service", industry: "Retail", failRate: 0.27 },
    { subject: "Animal Production", industry: "Agriculture", failRate: 0.19 },
    { subject: "Built Environment", industry: "Engineering", failRate: 0.20 },
    { subject: "Automotive Engineering", industry: "Mechanics", failRate: 0.12 },
    
  ],
  topCourses: [
    { name: "NCV ICT", completion: 0.82, readiness: 0.79 },
    { name: "Electrical Eng Year 1", completion: 0.77, readiness: 0.73 },
    { name: "Hospitality Level 4", completion: 0.73, readiness: 0.71 },
    { name: "Education & Development", completion: 0.80, readiness: 0.80 },
    { name: "Transport & Logistics", completion: 0.75, readiness: 0.75 },
    { name: "Electrical Systems", completion: 0.60, readiness: 0.60 },
     { name: "Land Management", completion: 0.82, readiness: 0.82 },
     { name: "Welding", completion: 0.78, readiness: 0.82 },
  ],
  subjects: [
    {
      name: "Intro to Electrical Circuits",
      industry: "Engineering",
      active: 210,
      completion: 0.71,
      pass: 0.68,
      readiness: 0.74,
      atRiskPct: 0.18,
      skills: ["Safety", "Diagnostics", "Tools"],
    },
    {
      name: "Animal Handling Basics",
      industry: "Agriculture",
      active: 142,
      completion: 0.79,
      pass: 0.75,
      readiness: 0.82,
      atRiskPct: 0.12,
      skills: ["Animal care", "Safety", "Observation"],
    },
    {
      name: "Customer Service in Retail & Insurance",
      industry: "Retail & Financial Services",
      active: 268,
      completion: 0.66,
      pass: 0.6,
      readiness: 0.69,
      atRiskPct: 0.24,
      skills: ["Communication", "Empathy", "Objection handling"],
    },
  ],
};

// -----------------------------------------------------------------------------
// Utilities
// -----------------------------------------------------------------------------

function formatPct(n, dp = 0) {
  return `${(n * 100).toFixed(dp)}%`;
}

function useAnimatedNumber(value, duration = 400) {
  const [display, setDisplay] = React.useState(value);
  const startRef = React.useRef(null);
  const fromRef = React.useRef(value);

  React.useEffect(() => {
    const from = fromRef.current;
    const to = value;
    startRef.current = null;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min(1, (timestamp - startRef.current) / duration);
      const current = from + (to - from) * progress;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(step);
      else fromRef.current = to;
    };

    requestAnimationFrame(step);
  }, [value, duration]);

  return display;
}

// -----------------------------------------------------------------------------
// Basic UI pieces
// -----------------------------------------------------------------------------

function KPI({ label, value }) {
  const numeric = typeof value === "number" ? value : undefined;
  const animated = useAnimatedNumber(numeric ?? 0);
  const display = numeric === undefined ? value : Math.round(animated).toLocaleString();

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 px-4 py-3 flex flex-col gap-1">
      <span className="text-[13px] font-medium text-slate-500">{label}</span>
      <span className="text-xl font-semibold text-slate-900">{display}</span>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
      <div className="text-[13px] font-semibold text-slate-800">{title}</div>
      {children}
    </div>
  );
}

// function TrendBars({ weeks, series }) {
//    console.log("TREND BARS RENDERED:", { weeks, series });
//   const max = Math.max(...series.flatMap((s) => s.values));
  
//   const colours = [
//     "bg-blue-500",
//     "bg-emerald-500"
//   ];

//   return (
//     <div className="flex items-end gap-2 h-32">
//       {weeks.map((w, i) => (
//         <div key={w} className="flex-1 flex flex-col items-center gap-1">
//           <div className="flex-1 flex items-end gap-1 w-full">
//             {series.map((s, idx) => (
//               <div
//                 key={s.name}
//                 className={`flex-1 rounded-full ${colours[idx]} transition-all duration-500`}
//                 style={{ height: `${(s.values[i] / max) * 100}%` }}
//               />
//             ))}
//           </div>
//           <span className="text-[11px] text-slate-500">{w}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

function TrendBars({ weeks, series }) {
  try {
    if (!Array.isArray(weeks) || !Array.isArray(series)) {
      return <div className="text-[13px] text-slate-500">No trend data</div>;
    }

    const cleanedSeries = series.map((s) => ({
      name: s.name ?? "",
      values: Array.isArray(s.values)
        ? s.values.map((v) =>
            typeof v === "string"
              ? parseFloat(v.replace("%", "")) || 0
              : Number(v) || 0
          )
        : [],
    }));

    const len = weeks.length;
    cleanedSeries.forEach((s) => {
      if (s.values.length < len) {
        s.values = s.values.concat(Array(len - s.values.length).fill(0));
      }
    });

    const maxVal = Math.max(1, ...cleanedSeries.flatMap((s) => s.values));

    const width = Math.max(350, weeks.length * 90); // MORE SPACING
    const height = 180;
    const pad = { top: 12, right: 12, bottom: 28, left: 32 };
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;

    const groups = weeks.length;
    const groupW = innerW / groups;
    const seriesCount = cleanedSeries.length;

    const barGap = 10;     // MORE gap between bars
    const barW = Math.max(8, (groupW - barGap * (seriesCount - 1)) / seriesCount);

    const colours = ["#000", "#b0b0b0"]; // black + light gray

    return (
      <div className="w-full overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMinYMin meet"
        >
          <g transform={`translate(${pad.left}, ${pad.top})`}>
            {/* GRID */}
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = innerH - innerH * t;
              return (
                <line
                  key={i}
                  x1={0}
                  x2={innerW}
                  y1={y}
                  y2={y}
                  stroke="#e6e6e6"
                  strokeWidth={1}
                />
              );
            })}

            {/* BARS */}
            {weeks.map((w, i) => {
              const groupX = i * groupW;
              return (
                <g key={w} transform={`translate(${groupX}, 0)`}>
                  {cleanedSeries.map((s, si) => {
                    const v = s.values[i];
                    const h = (v / maxVal) * innerH;
                    const x =
                      si * (barW + barGap) +
                      (groupW - (seriesCount * barW + barGap * (seriesCount - 1))) /
                        2;
                    const y = innerH - h;

                    return (
                      <rect
                        key={si}
                        x={x}
                        y={innerH}
                        width={barW}
                        height={0}
                        fill={colours[si % colours.length]}
                        rx={6}
                        ry={6}
                      >
                        {/* animation */}
                        <animate
                          attributeName="y"
                          from={innerH}
                          to={y}
                          dur="0.6s"
                          fill="freeze"
                        />
                        <animate
                          attributeName="height"
                          from="0"
                          to={h}
                          dur="0.6s"
                          fill="freeze"
                        />
                      </rect>
                    );
                  })}

                  {/* X LABEL */}
                  <text
                    x={groupW / 2}
                    y={innerH + 18}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#444"
                  >
                    {w}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    );
  } catch (err) {
    console.error(err);
    return <div>Error rendering bars</div>;
  }
}

function SimpleLineChart({ weeks, values }) {
  if (!weeks || !values) return <div>No data</div>;

  const w = Math.max(350, weeks.length * 80);
  const h = 180;
  const pad = { top: 20, right: 20, bottom: 30, left: 40 };

  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const maxVal = Math.max(1, ...values);

  const points = values
    .map((v, i) => {
      const x = (i / (weeks.length - 1)) * innerW;
      const y = innerH - (v / maxVal) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg width={w} height={h}>
        <g transform={`translate(${pad.left}, ${pad.top})`}>
          {/* line path */}
          <polyline
            points={points}
            fill="none"
            stroke="#000"
            strokeWidth={2}
          >
            <animate
              attributeName="stroke-dasharray"
              from="0, 10000"
              to="10000, 0"
              dur="0.7s"
              fill="freeze"
            />
          </polyline>

          {/* X labels */}
          {weeks.map((wText, i) => {
            const x = (i / (weeks.length - 1)) * innerW;
            return (
              <text
                key={i}
                x={x}
                y={innerH + 20}
                fontSize="12"
                textAnchor="middle"
                fill="#444"
              >
                {wText}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}





function StackedTimeChart({ weeks, sim, theory }) {
  const totals = weeks.map((_, i) => sim[i] + theory[i]);
  const max = Math.max(...totals);
  return (
    <div className="flex items-end gap-2 h-32">
      {weeks.map((w, i) => {
        const simHeight = (sim[i] / max) * 100;
        const theoryHeight = (theory[i] / max) * 100;
        return (
          <div key={w} className="flex-1 flex flex-col items-center gap-1">
            <div className="flex-1 w-full rounded-full bg-slate-100 overflow-hidden flex flex-col justify-end">
              <div className="w-full bg-slate-900/80" style={{ height: `${simHeight}%` }} />
              <div className="w-full bg-slate-400/70" style={{ height: `${theoryHeight}%` }} />
            </div>
            <span className="text-[11px] text-slate-500">{w}</span>
          </div>
        );
      })}
    </div>
  );
}

function SkillCard({ name, pct, desc }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-3 flex flex-col gap-1">
      <div className="text-[13px] font-semibold text-slate-800">{name}</div>
      <div className="text-xl font-semibold text-slate-900">{formatPct(pct)}</div>
      <div className="text-[13px] text-slate-500">{desc}</div>
    </div>
  );
}

function SimpleTable({ columns, rows, onRowClick }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <table className="min-w-full text-[13px]">
        <thead>
          <tr className="bg-slate-50 text-slate-500">
            {columns.map((c) => (
              <th key={c.key} className="py-2 px-3 text-left font-medium">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={
                "border-t border-slate-100 " + (onRowClick ? "hover:bg-slate-50 cursor-pointer transition-colors" : "")
              }
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((c) => (
                <td key={c.key} className="py-2 px-3 whitespace-nowrap text-slate-800">
                  {c.render ? c.render(row[c.key], row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Main component
// -----------------------------------------------------------------------------

function riskLevel(atRiskPct) {
  if (atRiskPct >= 0.25) return "High";
  if (atRiskPct >= 0.15) return "Medium";
  return "Low";
}

function EducationAnalyticsDashboard() {
  const [tab, setTab] = React.useState("overview");
  const [sortKey, setSortKey] = React.useState("name");
  const [sortDir, setSortDir] = React.useState("desc");
  const [selectedSubject, setSelectedSubject] = React.useState(demo.subjects[0]);

  const sortField = (row) => {
    if (sortKey === "completion") return row.completion;
    if (sortKey === "pass") return row.pass;
    if (sortKey === "readiness") return row.readiness;
    if (sortKey === "atRiskPct") return row.atRiskPct;
    if (sortKey === "active") return row.active;
    return row.name;
  };

  const sortedSubjects = [...demo.subjects].sort((a, b) => {
    const av = sortField(a);
    const bv = sortField(b);
    if (av === bv) return 0;
    if (sortDir === "asc") return av > bv ? 1 : -1;
    return av < bv ? 1 : -1;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const subjectColumns = [
    { key: "name", label: "Subject / Simulation" },
    { key: "industry", label: "Industry" },
    { key: "active", label: "Active Learners", render: (v) => v.toLocaleString() },
    { key: "completion", label: "Completion", render: (v) => formatPct(v) },
    { key: "pass", label: "Pass Rate", render: (v) => formatPct(v) },
    { key: "readiness", label: "Work-Readiness", render: (v) => formatPct(v) },
    {
      key: "atRiskPct",
      label: "At-Risk %",
      render: (v) => (
        <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
          {formatPct(v)}
        </span>
      ),
    },
  ];

  const engagement = {
    sessionsPerLearner: 3.2,
    avgSessionMinutes: 240,
    returnRate: 0.67,
    contentCompletion: 0.71,
    devices: { desktop: 640, tablet: 210, mobile: 890, xr: 184 },
    lessonsStarted: 2134,
    lessonsCompleted: 1627,
    simStepsCompleted: 9412,
    fullModulesCompletedPct: 0.59,
    contentPreference: [
      { type: "Simulations", value: 44 },
      { type: "Videos", value: 26 },
      { type: "Theory units", value: 18 },
      { type: "AI coach", value: 12 },
    ],
  };

  const riskSnapshot = {
    totalAtRisk: demo.kpis.atRisk,
    highFailureCourses: demo.failedSubjects.length,
    lowEngagementClusters: 4,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 text-slate-900">
      <header className="px-6 md:px-10 py-4 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">NX</div>
            <div>
              <div className="text-lg md:text-xl font-extrabold tracking-tight text-slate-900">NexEra Analytics</div>
              <div className="text-[13px] text-slate-500">Management overview · last 30 days · all campuses</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">Time · 30 days</div>
            <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">Campus · All</div>
            <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">Level · School · TVET · HE</div>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">DM</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-[13px]">
          {[
            { id: "overview", label: "Overview" },
            { id: "subjects", label: "Subjects / Industry" },
            { id: "engagement", label: "Engagement" },
            { id: "risk", label: "Risk & Intervention" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "px-3 py-1.5 rounded-xl border text-[13px] font-medium transition " +
                (tab === t.id ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-6 md:px-10 py-6 space-y-6">
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-5">
              <KPI label="Active Learners" value={demo.kpis.activeLearners} />
              <KPI label="Completion" value={formatPct(demo.kpis.completionRate)} />
              <KPI label="Pass Rate" value={formatPct(demo.kpis.passRate)} />
              <KPI label="Work-Readiness" value={formatPct(demo.kpis.readiness)} />
              <KPI label="At-Risk" value={demo.kpis.atRisk} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ChartCard title="Learning Performance Trend">
                <TrendBars weeks={demo.trend.weeks} series={[
                  { name: "Avg Score", values: demo.trend.avgScore },
                  { name: "Pass Rate", values: demo.trend.passRate },
                ]} />
              </ChartCard>
<ChartCard title="Engagement & Usage">
  <TrendBars
    weeks={demo.trend.weeks}
    series={[
      { name: "Simulation Time", values: demo.trend.timeSim },
      { name: "Theory Time", values: demo.trend.timeTheory }
    ]}
  />
</ChartCard>




            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                <div className="text-[13px] font-semibold text-slate-800">Skills & Work-Readiness</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {demo.skills.map((s) => (<SkillCard key={s.name} name={s.name} pct={s.pct} desc={s.desc} />))}
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                <div className="text-[13px] font-semibold text-slate-800">Top Failed Subjects This Term</div>
                <ul className="space-y-2">
                  {demo.failedSubjects.map((f) => (
                    <li key={f.subject} className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[13px] text-slate-900">{f.subject}</div>
                        <div className="text-[12px] text-slate-500">{f.industry}</div>
                      </div>
                      <div className="text-[13px] font-semibold text-rose-600">{formatPct(f.failRate)} fail</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                <div className="text-[13px] font-semibold text-slate-800">Top Performing Courses</div>
                <ul className="space-y-2">
                  {demo.topCourses.map((c) => (
                    <li key={c.name} className="flex items-center justify-between">
                      <div className="font-semibold text-[13px] text-slate-900">{c.name}</div>
                      <div className="text-right text-[12px] text-slate-600"><div>Completion {formatPct(c.completion)}</div></div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "subjects" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-[13px]">
              <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white">Level · All</div>
              <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white">Department · All</div>
              <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white">Campus · All</div>
              <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white">Term · Current</div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-slate-800">Performance by Subject</div>
                  <div className="text-[11px] text-slate-500">Click column header in your build to sort</div>
                </div>

                <SimpleTable columns={subjectColumns.map((c) => ({ ...c }))} rows={sortedSubjects} onRowClick={setSelectedSubject} />

                <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 mt-1">
                  <span>Sort by:</span>
                  <button className="px-2 py-0.5 rounded-lg border border-slate-200 bg-white" onClick={() => handleSort("readiness")}>Work-Readiness</button>
                  <button className="px-2 py-0.5 rounded-lg border border-slate-200 bg-white" onClick={() => handleSort("completion")}>Completion</button>
                  <button className="px-2 py-0.5 rounded-lg border border-slate-200 bg-white" onClick={() => handleSort("atRiskPct")}>At-Risk %</button>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                  <div className="text-[13px] font-semibold text-slate-800">Subject Snapshot</div>
                  <div>
                    <div className="text-[14px] font-semibold text-slate-900">{selectedSubject.name}</div>
                    <div className="text-[12px] text-slate-500">{selectedSubject.industry}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">{formatPct(selectedSubject.readiness)}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-[12px] text-slate-600">
                      <span>Completion: <span className="font-semibold">{formatPct(selectedSubject.completion)}</span></span>
                      <span>Pass rate: <span className="font-semibold">{formatPct(selectedSubject.pass)}</span></span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[12px] font-semibold text-slate-800 mb-1">Top skills gained</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedSubject.skills.slice(0, 3).map((s) => (
                        <span key={s} className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-800 border border-slate-100">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-600">Risk level</span>
                    {(() => {
                      const level = riskLevel(selectedSubject.atRiskPct);
                      const colourClasses = level === "High" ? "bg-rose-50 text-rose-700 border-rose-200" : level === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200";
                      return <span className={"inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border " + colourClasses}>{level}</span>;
                    })()}
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-1.5 bg-slate-900 rounded-full" style={{ width: formatPct(selectedSubject.completion) }} />
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-1.5 bg-slate-500 rounded-full" style={{ width: formatPct(selectedSubject.pass) }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "engagement" && (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-4">
              <KPI label="Sessions per learner" value={engagement.sessionsPerLearner} />
              <KPI label="Avg session time" value={`${engagement.avgSessionMinutes} min`} />
              <KPI label="Return rate" value={formatPct(engagement.returnRate)} />
              <KPI label="Content completion" value={formatPct(engagement.contentCompletion)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4">
                <div className="text-[13px] font-semibold text-slate-800 mb-3">Device Access</div>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Desktop / Laptop</span><span className="font-semibold">{engagement.devices.desktop}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Tablet</span><span className="font-semibold">{engagement.devices.tablet}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Mobile</span><span className="font-semibold">{engagement.devices.mobile}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>VR / MR</span><span className="font-semibold">{engagement.devices.xr}</span></div>
                </div>
              </div>

              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                <div className="text-[13px] font-semibold text-slate-800">Learning Activity Depth</div>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Lessons started</span><span className="font-semibold">{engagement.lessonsStarted}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Lessons completed</span><span className="font-semibold">{engagement.lessonsCompleted}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Sim steps completed</span><span className="font-semibold">{engagement.simStepsCompleted}</span></div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2"><span>Full modules finished</span><span className="font-semibold">{formatPct(engagement.fullModulesCompletedPct)}</span></div>
                </div>

                <div className="pt-2">
                  <div className="text-[13px] font-semibold text-slate-800 mb-2">Content Preference</div>
                  <div className="space-y-2">
                    {engagement.contentPreference.map((c) => (
                      <div key={c.type} className="flex items-center gap-2 text-[13px]">
                        <span className="w-28 text-slate-600">{c.type}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-2 rounded-full bg-slate-900" style={{ width: `${c.value}%` }} />
                        </div>
                        <span className="w-10 text-right text-slate-600 text-[12px]">{c.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "risk" && (
          <div className="space-y-6">
            <div className="grid gap-3 md:grid-cols-3">
              <KPI label="Total at-risk learners" value={riskSnapshot.totalAtRisk} />
              <KPI label="High-failure courses" value={riskSnapshot.highFailureCourses} />
              <KPI label="Low-engagement clusters" value={riskSnapshot.lowEngagementClusters} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-1">
                <div className="text-[13px] font-semibold text-slate-800">Academic risk</div>
                <div className="text-[13px] text-slate-600">Low scores and high failure rates</div>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-1">
                <div className="text-[13px] font-semibold text-slate-800">Engagement risk</div>
                <div className="text-[13px] text-slate-600">Low logins and short sessions</div>
              </div>
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 flex flex-col gap-1">
                <div className="text-[13px] font-semibold text-slate-800">Completion risk</div>
                <div className="text-[13px] text-slate-600">Dropouts before module completion</div>
              </div>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4">
              <div className="text-[13px] font-semibold text-slate-800 mb-3">Subjects Requiring Immediate Intervention</div>
              <ul className="space-y-2 text-[13px]">
                {demo.failedSubjects.map((f) => (
                  <li key={f.subject} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <div>
                      <div className="font-semibold text-slate-900">{f.subject}</div>
                      <div className="text-[12px] text-slate-500">{f.industry}</div>
                    </div>
                    <div className="text-right text-[12px] text-rose-600 font-semibold">{formatPct(f.failRate)} fail</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <footer className="px-6 md:px-10 py-6 text-[12px] text-slate-400">NexEra Analytics · Preview layout for management dashboards</footer>
    </div>
  );
}

// Mount to the page
const root = ReactDOM.createRoot(document.getElementById("analytics-root"));
root.render(<EducationAnalyticsDashboard />);
