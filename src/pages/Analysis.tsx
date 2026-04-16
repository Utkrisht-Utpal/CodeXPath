import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, GitBranch, Layers, FileCode2, Map, BookOpen, Network, ExternalLink } from "lucide-react";
import { DependencyTree } from "../components/DependencyTree";

type Technology = {
  extension: string;
  technology: string;
  count: number;
};

type AnalysisData = {
  summary: {
    totalFiles: number;
    primaryTechnology: string;
  };
  technologies: Technology[];
  frameworks: string[];
  entryPoint?: string;
  coreFiles?: CoreFile[];
  architecture?: string;
  learningPath?: LearningStep[];
  dependencyGraph?: {
    root: string;
    tree: Record<string, string[]>;
    nodes: { id: string; group?: "connected" | "orphan" }[];
    edges: { source: string; target: string }[];
  };
};

type LearningStep = {
  title: string;
  description: string;
};

type CoreFile = {
  file: string;
  reason: string;
};

type AnalysisLocationState = {
  repoUrl?: string;
  analysis?: AnalysisData;
};

// Reusable card header
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle?: string;
}) => (
  <div className="px-6 py-4 border-b border-border flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <h2 className="font-semibold text-foreground leading-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5 font-mono">{subtitle}</p>}
    </div>
  </div>
);

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AnalysisLocationState | null;

  const analysis = state?.analysis;
  const repoUrl = state?.repoUrl;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <FileCode2 className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            No analysis data found.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Calculate max count for tech bar chart
  const maxTechCount = Math.max(...analysis.technologies.map((t) => t.count), 1);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-10 max-w-4xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </button>

        {/* Heading */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Repository <span className="text-primary glow-text">Analysis</span>
          </h1>
        </div>

        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground hover:text-primary transition-colors break-all"
          >
            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
            {repoUrl}
          </a>
        )}

        {/* ── Overview Card ── */}
        <div className="mb-6 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="font-semibold text-foreground">Repository Overview</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { label: "PRIMARY TECH", value: analysis.summary.primaryTechnology },
              { label: "FRAMEWORK", value: analysis.frameworks[0] || "None" },
              { label: "TOTAL FILES", value: analysis.summary.totalFiles },
              { label: "ARCHITECTURE", value: analysis.architecture || "Unknown" },
            ].map(({ label, value }) => (
              <div key={label} className="px-6 py-6 text-center">
                <p className="text-xs text-muted-foreground tracking-widest font-mono">{label}</p>
                <p className="mt-2 font-mono text-foreground font-medium truncate">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Framework Tags ── */}
        {analysis.frameworks.length > 1 && (
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-3 font-mono tracking-widest">FRAMEWORKS DETECTED</p>
            <div className="flex flex-wrap gap-2">
              {analysis.frameworks.map((fw) => (
                <span
                  key={fw}
                  className="px-3 py-1.5 text-xs font-mono bg-primary/10 text-primary rounded-md border border-primary/20 hover:bg-primary/15 transition-colors"
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Entry Point ── */}
        {analysis.entryPoint && analysis.entryPoint !== "Not Detected" && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden">
            <SectionHeader icon={GitBranch} title="Entry Point" subtitle="Main initialization file" />
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-primary text-sm">&gt;_</span>
              </div>
              <p className="font-mono text-foreground text-sm">{analysis.entryPoint}</p>
            </div>
          </div>
        )}

        {/* ── Core Files ── */}
        {analysis.coreFiles && analysis.coreFiles.length > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
            <SectionHeader icon={FileCode2} title="Core Files to Understand" subtitle={`${analysis.coreFiles.length} key files identified`} />
            <div className="divide-y divide-border">
              {analysis.coreFiles.map((core, index) => (
                <div key={core.file} className="px-6 py-4 flex gap-4 hover:bg-secondary/20 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-foreground text-sm truncate">{core.file}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{core.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Dependency Graph ── */}
        {analysis.dependencyGraph && (
          <div className="mb-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
            <SectionHeader
              icon={Network}
              title="File Dependency Tree"
              subtitle={`${analysis.dependencyGraph.nodes.filter(n => n.group !== 'orphan').length} linked · ${analysis.dependencyGraph.nodes.filter(n => n.group === 'orphan').length} standalone`}
            />
            <DependencyTree data={analysis.dependencyGraph as any} />
          </div>
        )}

        {/* ── Technology Breakdown ── */}
        <div className="mb-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
          <SectionHeader icon={Layers} title="Technology Breakdown" subtitle="File count by type" />
          <div className="px-6 py-5 space-y-3">
            {analysis.technologies.slice(0, 8).map((tech) => {
              const pct = Math.round((tech.count / maxTechCount) * 100);
              return (
                <div key={tech.extension}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-foreground font-mono">{tech.technology}</span>
                    <span className="text-muted-foreground font-mono">{tech.count} {tech.count === 1 ? "file" : "files"}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Learning Roadmap ── */}
        {analysis.learningPath && analysis.learningPath.length > 0 && (
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
            <SectionHeader icon={Map} title="Learning Roadmap" subtitle={`${analysis.learningPath.length} steps to master this codebase`} />
            <div className="divide-y divide-border">
              {analysis.learningPath.map((step, index) => (
                <div key={index} className="px-6 py-4 flex gap-4 hover:bg-secondary/20 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-mono text-primary flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Analysis;