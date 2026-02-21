"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UNIVERSAL_DOMAINS } from "@/lib/constants";
import { API_URL } from "@/lib/config";

interface MarketTrends {
  top_skills: [string, number][];
  analyzed_roles: string[];
}

interface SkillResource {
  title: string;
  platform: string;
  type: string;
  url: string;
}

const PLATFORM_COLORS: Record<string, string> = {
  Coursera: "#0056D2",
  Udemy: "#A435F0",
  YouTube: "#FF0000",
  freeCodeCamp: "#0A0A23",
  Kaggle: "#20BEFF",
  Practice: "#10b981",
  edX: "#02262B",
  Google: "#4285F4",
  "Khan Academy": "#14BF96",
  "LinkedIn Learning": "#0A66C2",
  Skillshare: "#00FF84",
};

const DOMAIN_ICONS: Record<string, string> = {
  "Technology & Engineering": "⚙️",
  "Business & Management": "📈",
  "Creative & Design": "🎨",
  "Science & Research": "🔬",
  "Healthcare & Medicine": "🩺",
  "Law & Policy": "⚖️",
  "Education & Social": "📚",
  "Media & Communication": "📡",
  "Finance & Economics": "💹",
  "Arts & Culture": "🎭",
  "Sports & Wellness": "🏃",
  "Trades & Skilled Work": "🔧",
};

function getBarFill(index: number): string {
  if (index === 0) return "#6366f1";
  if (index <= 2) return "#818cf8";
  if (index <= 5) return "#a5b4fc";
  return "#c7d2fe";
}

export default function MarketPage() {
  const [trends, setTrends] = useState<MarketTrends | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [skillResources, setSkillResources] = useState<
    Record<string, SkillResource[]>
  >({});
  const [loadingResources, setLoadingResources] = useState(false);

  const domainRoles = useMemo(
    () => (selectedDomain ? (UNIVERSAL_DOMAINS[selectedDomain] ?? []) : []),
    [selectedDomain],
  );

  const fetchTrends = async (roles: string[] = []) => {
    if (roles.length === 0) return;
    try {
      setAnalyzing(true);
      setError(null);
      const params = new URLSearchParams();
      roles.forEach((r) => params.append("roles", r));
      if (selectedDomain) params.append("domain", selectedDomain);
      const res = await fetch(`${API_URL}/api/market-trends?${params}`);
      if (!res.ok) throw new Error(`${res.status}`);
      setTrends(await res.json());
    } catch (err: any) {
      const isBlocked =
        err instanceof TypeError &&
        err.message?.toLowerCase().includes("failed to fetch");
      setError(
        isBlocked
          ? "Request blocked — disable your ad blocker for this page, then try again."
          : "Backend unreachable. Is the server running?",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleRole = (role: string) =>
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );

  const selectDomain = (domain: string) => {
    if (selectedDomain === domain) {
      setSelectedDomain(null);
      setSelectedRoles([]);
    } else {
      setSelectedDomain(domain);
      setSelectedRoles([]);
    }
  };

  const chartData =
    trends?.top_skills.map(([skill, demand]) => ({ skill, demand })) ?? [];

  const topSkill = chartData[0];
  const rolesScanned = trends?.analyzed_roles?.length ?? 0;

  // Fetch resources when top skills change
  useEffect(() => {
    if (!trends?.top_skills?.length) {
      setSkillResources({});
      return;
    }
    const skills = trends.top_skills.slice(0, 8).map(([s]) => s);
    setLoadingResources(true);
    const params = new URLSearchParams();
    skills.forEach((s) => params.append("skills", s));
    fetch(`${API_URL}/api/skill-resources?${params}`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setSkillResources(data))
      .catch(() => setSkillResources({}))
      .finally(() => setLoadingResources(false));
  }, [trends]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-14">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · Adzuna API · India
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Market Intelligence
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg">
              Real-time demand signals from live job listings. Choose domain →
              choose roles → analyze.
            </p>
          </motion.div>

          {/* Domain pills */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mb-5"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
              Domain
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(UNIVERSAL_DOMAINS).map((domain) => {
                const active = selectedDomain === domain;
                return (
                  <button
                    key={domain}
                    onClick={() => selectDomain(domain)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      active
                        ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-400"
                        : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                    }`}
                  >
                    <span>{DOMAIN_ICONS[domain] ?? "◆"}</span>
                    {domain}
                  </button>
                );
              })}
            </div>
          </motion.section>

          {/* Role pills */}
          <AnimatePresence>
            {selectedDomain && (
              <motion.section
                key="roles"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="mb-5 overflow-hidden"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
                  Roles · {selectedDomain}
                </p>
                <div className="flex flex-wrap gap-2">
                  {domainRoles.map((role) => {
                    const active = selectedRoles.includes(role);
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`rounded-full border px-3 py-1 text-xs transition-all duration-150 ${
                          active
                            ? "border-indigo-500/60 bg-indigo-500/10 text-indigo-300"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {active && (
                          <span className="mr-1 text-indigo-400">✓</span>
                        )}
                        {role}
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <button
              onClick={() => fetchTrends(selectedRoles)}
              disabled={analyzing || selectedRoles.length === 0}
              className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {analyzing
                ? "Scanning…"
                : selectedRoles.length === 0
                  ? "Select roles first"
                  : `Analyze ${selectedRoles.length} role${selectedRoles.length > 1 ? "s" : ""}`}
            </button>
            {(selectedDomain || selectedRoles.length > 0 || trends) && (
              <button
                onClick={() => {
                  setSelectedDomain(null);
                  setSelectedRoles([]);
                  setTrends(null);
                  setError(null);
                }}
                className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition"
              >
                Reset
              </button>
            )}
            {trends && (
              <span className="ml-auto text-xs text-muted-foreground">
                {rolesScanned} role{rolesScanned !== 1 ? "s" : ""} scanned
              </span>
            )}
          </div>

          {trends && !analyzing && (
            <div className="mb-8 rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Analyzed:</span>
                {trends.analyzed_roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-foreground/90"
                  >
                    {role}
                  </span>
                ))}
                {rolesScanned === 1 && (
                  <span className="ml-auto rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] text-indigo-300 border border-indigo-500/20">
                    Focused single-role scan
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Analyzing pulse */}
          {analyzing && (
            <div className="flex items-center justify-center py-32 gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    delay: i * 0.18,
                  }}
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && !analyzing && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Empty state — no selection yet */}
          {!analyzing && !trends && !error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center justify-center py-28 gap-3 text-center"
            >
              <span className="text-3xl">◎</span>
              <p className="text-sm font-medium text-foreground">
                Choose a domain to get started
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Select a domain above, pick the roles you care about, then hit{" "}
                <span className="text-foreground">Analyze Market</span>.
              </p>
            </motion.div>
          )}

          {/* Results */}
          {trends && !analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Stat row */}
              {topSkill && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Top skill", value: topSkill.skill },
                    { label: "Roles scanned", value: String(rolesScanned) },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl border border-border bg-card px-5 py-4"
                    >
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills bar chart */}
              <section>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                  Top Demanded Skills
                </p>
                {chartData.length === 0 ? (
                  <div className="rounded-xl border border-border bg-card px-5 py-12 flex flex-col items-center gap-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      No skill data matched for these roles.
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      This can happen when job listings are limited or use
                      non-standard terminology. Try selecting more roles or
                      different domains.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-card px-5 py-5">
                    <ResponsiveContainer
                      width="100%"
                      height={Math.max(220, chartData.length * 34)}
                    >
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                      >
                        <XAxis
                          type="number"
                          tick={{ fill: "#555", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="skill"
                          tick={{ fill: "#888", fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          width={90}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #222",
                            borderRadius: "8px",
                            fontSize: "12px",
                            color: "#fff",
                          }}
                          cursor={{ fill: "rgba(99,102,241,0.05)" }}
                          formatter={(v: number) => [`${v} mentions`, "Demand"]}
                        />
                        <Bar
                          dataKey="demand"
                          radius={[0, 4, 4, 0]}
                          maxBarSize={20}
                        >
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={getBarFill(i)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              {/* Skill Learning Resources */}
              {chartData.length > 0 && (
                <section>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
                    Learning Resources
                  </p>
                  {loadingResources ? (
                    <div className="rounded-xl border border-border bg-card px-5 py-8 flex items-center justify-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.8, 1, 0.8],
                          }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            delay: i * 0.18,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chartData.slice(0, 8).map(({ skill }, idx) => {
                        const resources = skillResources[skill] ?? [];
                        if (resources.length === 0) return null;
                        return (
                          <motion.div
                            key={skill}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="rounded-xl border border-border bg-card px-4 sm:px-5 py-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: getBarFill(idx) }}
                              />
                              <span className="text-sm font-semibold text-foreground">
                                {skill}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {resources.map((r, ri) => (
                                <a
                                  key={ri}
                                  href={r.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center gap-1.5 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5"
                                >
                                  <span
                                    className="h-1.5 w-1.5 rounded-full shrink-0"
                                    style={{
                                      backgroundColor:
                                        PLATFORM_COLORS[r.platform] ??
                                        "#6366f1",
                                    }}
                                  />
                                  <span className="text-foreground/90 group-hover:text-foreground truncate max-w-[200px] sm:max-w-xs">
                                    {r.title}
                                  </span>
                                  <span className="text-muted-foreground/60 shrink-0">
                                    {r.platform}
                                  </span>
                                  <svg
                                    className="w-3 h-3 text-muted-foreground/40 group-hover:text-indigo-400 shrink-0 transition"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                                  </svg>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* Footnote */}
              <p className="text-xs text-muted-foreground/50">
                Adzuna API · India ·{" "}
                {trends.analyzed_roles?.slice(0, 4).join(", ")}
                {(trends.analyzed_roles?.length ?? 0) > 4
                  ? ` +${(trends.analyzed_roles?.length ?? 0) - 4} more`
                  : ""}
              </p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
