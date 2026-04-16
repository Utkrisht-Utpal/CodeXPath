import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Search, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

const loadingSteps = [
  "Cloning repository…",
  "Scanning file structure…",
  "Detecting frameworks & languages…",
  "Tracing import dependencies…",
  "Building learning roadmap…",
];

const AnalyzeSection = () => {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading">("idle");
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const navigate = useNavigate();

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const repoUrl = url.trim();
    if (!repoUrl) { setError("Please enter a repository URL."); return; }

    setError("");
    setPhase("loading");
    setLoadingStep(0);

    // Cycle through steps for visual feedback
    const stepInterval = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, loadingSteps.length - 1));
    }, 1800);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        let message = "Failed to analyze repository.";
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData?.error) message = errorData.error;
        } catch { /* ignore */ }
        throw new Error(message);
      }

      const data = await response.json();

      // Accumulate total files analyzed across sessions
      const prev = parseInt(localStorage.getItem("codexpath_files_analyzed") || "0", 10);
      const newTotal = prev + (data?.summary?.totalFiles || 0);
      localStorage.setItem("codexpath_files_analyzed", String(newTotal));

      navigate("/analysis", { state: { repoUrl, analysis: data } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("idle");
    } finally {
      clearInterval(stepInterval);
    }
  };

  const isGitHubUrl = url.startsWith("https://github.com/");

  return (
    <section id="analyze-section" className="relative py-28 gradient-mesh overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-2xl">
        <AnimatePresence mode="wait">

          {/* ── Idle State ── */}
          {phase === "idle" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center">
                <span className="font-mono text-sm text-terminal mb-2 block">// start here</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Analyze a <span className="text-primary glow-text">Repository</span>
                </h2>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                  Paste a public GitHub URL and get a full dependency map, architecture overview, and learning roadmap.
                </p>
              </div>

              <form onSubmit={handleAnalyze} className="w-full flex flex-col gap-3">
                {/* Input with icon */}
                <div className={`relative flex items-center rounded-xl border bg-secondary/40 transition-all duration-200 ${error ? "border-destructive/60" : isGitHubUrl ? "border-primary/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "border-border focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(34,197,94,0.08)]"}`}>
                  <div className="pl-4 pr-2 flex-shrink-0">
                    {isGitHubUrl
                      ? <Github className="w-4 h-4 text-primary" />
                      : <Search className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); if (error) setError(""); }}
                    placeholder="https://github.com/username/repository"
                    className="flex-1 px-2 py-4 bg-transparent text-foreground placeholder:text-muted-foreground/60 font-mono text-sm focus:outline-none"
                  />
                  {isGitHubUrl && (
                    <div className="pr-3">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-destructive font-mono"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold glow-primary hover:brightness-110 transition-all text-base"
                >
                  Analyze Repository →
                </button>

                <p className="text-center text-xs text-muted-foreground font-mono">
                  Works with any public GitHub repo · No login required
                </p>
              </form>
            </motion.div>
          )}

          {/* ── Loading State ── */}
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 py-6"
            >
              {/* Spinner */}
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border border-primary/10 animate-pulse" />
              </div>

              {/* Step text */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="text-foreground font-mono text-sm font-medium"
                  >
                    {loadingSteps[loadingStep]}
                  </motion.p>
                </AnimatePresence>
                <p className="text-xs text-muted-foreground mt-1 font-mono">This may take 20–60 seconds</p>
              </div>

              {/* Steps list */}
              <div className="w-full max-w-xs space-y-2">
                {loadingSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${i < loadingStep ? "bg-primary/20 border border-primary" : i === loadingStep ? "border border-primary/60" : "border border-border"}`}>
                      {i < loadingStep
                        ? <CheckCircle2 className="w-3 h-3 text-primary" />
                        : i === loadingStep
                          ? <Loader2 className="w-3 h-3 text-primary animate-spin" />
                          : null
                      }
                    </div>
                    <span className={`text-xs font-mono transition-colors duration-300 ${i <= loadingStep ? "text-foreground" : "text-muted-foreground/40"}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AnalyzeSection;
