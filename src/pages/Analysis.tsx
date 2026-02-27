import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as AnalysisLocationState | null;

  const analysis = state?.analysis;
  const repoUrl = state?.repoUrl;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <p className="text-muted-foreground font-mono text-sm text-center">
          No analysis data found. Please analyze a repository first.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-10 max-w-4xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Repository <span className="text-primary glow-text">Analysis</span>
        </h1>

        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 mb-8 block text-sm font-mono text-muted-foreground hover:text-primary hover:underline transition-colors break-all"
          >
            {repoUrl}
          </a>
        )}

        {/* ===============================
            Repository Overview Card
        =============================== */}
        <div className="mb-8 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">

          {/* Header */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="font-semibold text-foreground">
              Repository Overview
            </span>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border text-center">

            <div className="px-6 py-6">
              <p className="text-xs text-muted-foreground tracking-widest">
                PRIMARY TECH
              </p>
              <p className="mt-2 font-mono text-foreground">
                {analysis.summary.primaryTechnology}
              </p>
            </div>

            <div className="px-6 py-6">
              <p className="text-xs text-muted-foreground tracking-widest">
                FRAMEWORK
              </p>
              <p className="mt-2 font-mono text-foreground">
                {analysis.frameworks[0] || "None"}
              </p>
            </div>

            <div className="px-6 py-6">
              <p className="text-xs text-muted-foreground tracking-widest">
                TOTAL FILES
              </p>
              <p className="mt-2 font-mono text-foreground">
                {analysis.summary.totalFiles}
              </p>
            </div>

            <div className="px-6 py-6">
              <p className="text-xs text-muted-foreground tracking-widest">
                ARCHITECTURE
              </p>
              <p className="mt-2 font-mono text-foreground">
                {analysis.architecture || "Unknown"}
              </p>
            </div>

          </div>
        </div>

        {/* ===============================
            Framework Tags (if multiple)
        =============================== */}
        {analysis.frameworks.length > 1 && (
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-3 font-mono">
              Frameworks Detected
            </p>
            <div className="flex flex-wrap gap-3">
              {analysis.frameworks.map((fw) => (
                <span
                  key={fw}
                  className="px-4 py-2 text-xs font-mono bg-primary/10 text-primary rounded-md border border-primary/20"
                >
                  {fw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ===============================
            Entry Point Section
        =============================== */}
        {analysis.entryPoint && analysis.entryPoint !== "Not Detected" && (
          <div className="mb-8 rounded-2xl border border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-border">
              <span className="font-semibold text-foreground">
                Entry Point
              </span>
            </div>

            <div className="px-6 py-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="font-mono text-primary">&gt;_</span>
              </div>

              <div>
                <p className="font-mono text-foreground">
                  {analysis.entryPoint}
                </p>
                <p className="text-sm text-muted-foreground">
                  Main initialization file.
                </p>
              </div>
            </div>

          </div>
        )}

        {analysis.coreFiles && analysis.coreFiles.length > 0 && (
          <div className="mb-10 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Core Files to Understand
              </h2>
            </div>

            <div className="divide-y divide-border">
              {analysis.coreFiles.map((core, index) => (
                <div key={core.file} className="px-6 py-5 flex gap-4">

                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono text-primary">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-mono text-foreground">
                      {core.file}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {core.reason}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===============================
            Technology Breakdown
        =============================== */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6">

          <h2 className="text-lg font-semibold text-foreground mb-4">
            Technology Breakdown
          </h2>

          <div className="space-y-3">
            {analysis.technologies.slice(0, 8).map((tech) => (
              <div
                key={tech.extension}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-foreground font-mono">
                  {tech.technology}
                </span>
                <span className="text-muted-foreground font-mono">
                  {tech.count}
                </span>
              </div>
            ))}
          </div>

        </div>

        {analysis.learningPath && analysis.learningPath.length > 0 && (
          <div className="mt-10 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">

            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Learning Roadmap
              </h2>
            </div>

            <div className="divide-y divide-border">
              {analysis.learningPath.map((step, index) => (
                <div key={index} className="px-6 py-5 flex gap-4">

                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-mono text-primary">
                    {index + 1}
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
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