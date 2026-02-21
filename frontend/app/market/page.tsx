"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UNIVERSAL_DOMAINS } from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface MarketTrends {
  top_skills: [string, number][];
  domain_competitiveness: Record<string, number>;
  analyzed_roles: string[];
}

const DOMAIN_OPTIONS = Object.keys(UNIVERSAL_DOMAINS);

const DOMAIN_META: Record<string, { icon: string; desc: string }> = {
  "AI/ML": { icon: "⚡", desc: "Machine Learning, Deep Learning, NLP" },
  "Web Development": { icon: "🌐", desc: "Frontend, Backend, Full-stack" },
  "Data Science": { icon: "📊", desc: "Analytics, Statistics, Visualization" },
  "Cloud/DevOps": { icon: "☁️", desc: "AWS, Docker, CI/CD pipelines" },
  Cybersecurity: { icon: "🔒", desc: "Security, Networking, Ethical Hacking" },
  "Core Engineering": { icon: "⚙️", desc: "Embedded, VLSI, Systems" },
};

function getScoreColor(score: number): string {
  if (score >= 70) return "text-[#10b981]";
  if (score >= 40) return "text-[#f59e0b]";
  return "text-[#ef4444]";
}

function getBarColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low";
  return "Very Low";
}

export default function MarketPage() {
  const [trends, setTrends] = useState<MarketTrends | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const availableRoles = useMemo(() => {
    const roleSet = new Set<string>();
    selectedDomains.forEach((domain) => {
      (UNIVERSAL_DOMAINS[domain] || []).forEach((role) => roleSet.add(role));
    });
    return Array.from(roleSet);
  }, [selectedDomains]);

  const fetchTrends = async (roles: string[] = []) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      roles.forEach((role) => params.append("roles", role));
      const endpoint = params.toString()
        ? `${API_URL}/api/market-trends?${params.toString()}`
        : `${API_URL}/api/market-trends`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
      const data: MarketTrends = await res.json();
      setTrends(data);
    } catch (err: any) {
      console.error("Market trends error:", err);
      setError(
        err.message ||
          "Failed to load market data. Make sure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) => {
      const next = prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain];

      setSelectedRoles((prevRoles) => {
        const nextRoleSet = new Set<string>();
        next.forEach((d) => {
          (UNIVERSAL_DOMAINS[d] || []).forEach((r) => nextRoleSet.add(r));
        });
        return prevRoles.filter((role) => nextRoleSet.has(role));
      });

      return next;
    });
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const chartData =
    trends?.top_skills.map(([skill, count]) => ({
      skill,
      demand: count,
    })) ?? [];

  const domains = trends?.domain_competitiveness
    ? Object.entries(trends.domain_competitiveness).sort(
        ([, a], [, b]) => b - a,
      )
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Live Data
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Market Intelligence
              </h1>
              <p className="mt-3 text-base text-muted-foreground max-w-xl">
                Real-time skill demand signals from job listings. Select any
                domains and roles you want, or leave blank to run the default
                market scan.
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <section className="mb-10 rounded-xl border border-border bg-card p-5 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                1) Select domain(s) (optional)
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Choose one or more domains. Then check the roles you want to
                analyze.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DOMAIN_OPTIONS.map((domain) => {
                  const active = selectedDomains.includes(domain);
                  return (
                    <label
                      key={domain}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors cursor-pointer ${
                        active
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:bg-secondary/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-indigo-500"
                        checked={active}
                        onChange={() => toggleDomain(domain)}
                      />
                      <span className="text-foreground">{domain}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">
                2) Check role(s) in selected domains (optional)
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedDomains.length === 0
                  ? "Pick at least one domain to enable role selection."
                  : "Leave roles empty to scan all default roles."}
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {availableRoles.map((role) => {
                  const active = selectedRoles.includes(role);
                  return (
                    <label
                      key={role}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-colors cursor-pointer ${
                        active
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:bg-secondary/40"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-indigo-500"
                        checked={active}
                        onChange={() => toggleRole(role)}
                      />
                      <span className="text-foreground">{role}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => fetchTrends(selectedRoles)}
                className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                Run Market Research
              </button>
              <button
                onClick={() => {
                  setSelectedDomains([]);
                  setSelectedRoles([]);
                  fetchTrends([]);
                }}
                className="rounded-md border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary/50"
              >
                Reset to Default
              </button>
            </div>
          </section>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Fetching market data...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
              <p className="text-sm text-destructive mb-2">
                Unable to load market data
              </p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Content */}
          {trends && !loading && (
            <div className="space-y-12">
              {/* ─── Top 10 Demanded Skills ─── */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Top 10 Demanded Skills
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aggregated frequency across selected roles. Current scan:{" "}
                    {trends.analyzed_roles?.join(", ") || "default role set"}.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        horizontal={false}
                        stroke="#1e1e1e"
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#606060", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="skill"
                        tick={{ fill: "#a0a0a0", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#141414",
                          border: "1px solid #1e1e1e",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#ffffff",
                        }}
                        cursor={{ fill: "rgba(99, 102, 241, 0.05)" }}
                        formatter={(value: number) => [
                          `${value} mentions`,
                          "Demand",
                        ]}
                      />
                      <Bar
                        dataKey="demand"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={24}
                      >
                        {chartData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index < 3
                                ? "#6366f1"
                                : index < 6
                                  ? "#818cf8"
                                  : "#a5b4fc"
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.section>

              {/* ─── Domain Competitiveness ─── */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Domain Competitiveness
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Demand density score per domain, derived from skill keyword
                    frequency in active job postings.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {domains.map(([domain, score], i) => {
                    const meta = DOMAIN_META[domain] ?? {
                      icon: "📌",
                      desc: domain,
                    };
                    return (
                      <motion.div
                        key={domain}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2.5 mb-3">
                            <span className="text-lg">{meta.icon}</span>
                            <h3 className="text-sm font-semibold text-foreground">
                              {domain}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mb-4">
                            {meta.desc}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-end justify-between mb-2">
                            <span
                              className={`text-2xl font-bold tracking-tight ${getScoreColor(score)}`}
                            >
                              {score}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              / 100
                            </span>
                          </div>
                          {/* Progress bar */}
                          <div className="h-1.5 w-full rounded-full bg-secondary">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: getBarColor(score) }}
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2 + i * 0.06,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {getScoreLabel(score)} demand
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.section>

              {/* ─── Skill Demand Insights ─── */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Key Insights
                  </h2>
                </div>

                <div className="space-y-3">
                  {chartData.length > 0 && (
                    <>
                      <InsightCard
                        title="Most In-Demand Skill"
                        body={`${chartData[0]?.skill} leads with ${chartData[0]?.demand} mentions across the selected roles, making it the current top requested competency in this market scan.`}
                      />
                      {chartData.length >= 3 && (
                        <InsightCard
                          title="Top 3 Cluster"
                          body={`${chartData[0]?.skill}, ${chartData[1]?.skill}, and ${chartData[2]?.skill} together dominate job requirements. Proficiency in all three significantly increases employability across multiple domains.`}
                        />
                      )}
                      {domains.length >= 2 && (
                        <InsightCard
                          title="Highest Demand Domain"
                          body={`${domains[0][0]} shows the highest competitiveness score (${domains[0][1]}/100), indicating the densest concentration of active job postings requiring domain-specific skills.`}
                        />
                      )}
                      <InsightCard
                        title="Data Source"
                        body={`All signals are derived from Adzuna API job listings for India. Roles analyzed in this run: ${trends.analyzed_roles?.join(", ") || "default set"}.`}
                      />
                    </>
                  )}
                </div>
              </motion.section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ─── Sub-components ─── */

function InsightCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h4 className="text-sm font-semibold text-foreground mb-1.5">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
