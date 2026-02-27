import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "loading";
type AnalysisResponse = {
  language: string;
  totalFiles: number;
  entryPoint: string;
  importantFiles: string[];
};

const AnalyzeSection = () => {
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const repoUrl = url.trim();

    if (!repoUrl) {
      setError("Please enter a repository URL.");
      return;
    }

    setError("");
    setPhase("loading");

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        let message = "Failed to analyze repository.";
        try {
          const errorData = (await response.json()) as { error?: string };
          if (errorData?.error) {
            message = errorData.error;
          }
        } catch {
          // Ignore JSON parse failures and keep default message.
        }
        throw new Error(message);
      }

      const data = (await response.json()) as AnalysisResponse;
      navigate("/analysis", { state: { repoUrl, analysis: data } });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      setPhase("idle");
    }
  };

  return (
    <section id="analyze-section" className="relative py-24 gradient-mesh overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-3xl">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
                Analyze a <span className="text-primary glow-text">Repository</span>
              </h2>
              <p className="text-muted-foreground text-center max-w-md">
                Paste a public GitHub repo URL and let CodexPath break it down for you.
              </p>
              <form onSubmit={handleAnalyze} className="w-full flex flex-col gap-2">
                <div className="w-full flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Paste a public GitHub repository URL..."
                    className="flex-1 px-4 py-3 rounded-lg bg-secondary/60 border border-glow text-foreground placeholder:text-muted-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold glow-primary hover:brightness-110 transition-all whitespace-nowrap"
                  >
                    Analyze Repository
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-destructive font-mono">{error}</p>
                )}
              </form>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-mono text-sm">
                Cloning repository and analyzing structure…
              </p>
              <div className="w-full max-w-sm h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "95%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AnalyzeSection;
