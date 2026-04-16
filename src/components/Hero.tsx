import { motion } from "framer-motion";
import { Code2, Github, Zap, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const codeLines = [
  { num: 1, content: "// codexpath.analyze()", color: "text-muted-foreground" },
  { num: 2, content: 'import { understand } from "your-codebase";', color: "text-terminal" },
  { num: 3, content: "", color: "" },
  { num: 4, content: "const knowledge = await CodexPath.scan({", color: "text-foreground" },
  { num: 5, content: '  target: "entire-project",', color: "text-secondary-foreground" },
  { num: 6, content: '  depth: "complete",', color: "text-secondary-foreground" },
  { num: 7, content: '  explain: "like-a-mentor"', color: "text-secondary-foreground" },
  { num: 8, content: "});", color: "text-foreground" },
  { num: 9, content: "", color: "" },
  { num: 10, content: "// → You now understand everything.", color: "text-terminal-dim" },
];

const SUPPORTED_LANGUAGES = [
  { ext: ".js",  name: "JavaScript",       color: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30" },
  { ext: ".jsx", name: "JSX",              color: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30" },
  { ext: ".ts",  name: "TypeScript",       color: "bg-blue-400/20 text-blue-400 border-blue-400/30" },
  { ext: ".tsx", name: "TSX (React)",      color: "bg-blue-400/20 text-blue-400 border-blue-400/30" },
  { ext: ".py",  name: "Python",           color: "bg-green-400/20 text-green-400 border-green-400/30" },
];

const Hero = () => {
  const [filesAnalyzed, setFilesAnalyzed] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Read cumulative count from localStorage
  useEffect(() => {
    const stored = parseInt(localStorage.getItem("codexpath_files_analyzed") || "0", 10);
    setFilesAnalyzed(stored);
  }, []);

  // Animate counter up when filesAnalyzed changes
  useEffect(() => {
    if (filesAnalyzed === 0) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = filesAnalyzed / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= filesAnalyzed) {
        setDisplayCount(filesAnalyzed);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [filesAnalyzed]);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-foreground tracking-tight">CodexPath</span>
            <span className="hidden sm:inline text-xs font-mono text-primary border border-primary/30 rounded px-1.5 py-0.5 ml-1">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => document.getElementById("analyze-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono hidden sm:block"
            >
              Analyze
            </button>
            <a
              href="https://github.com/Utkrisht-Utpal/CodeXPath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline font-mono">GitHub</span>
            </a>
            <button
              onClick={() => document.getElementById("analyze-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center gradient-mesh overflow-hidden pt-14">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-glow bg-secondary/50 mb-6">
                <span className="w-2 h-2 rounded-full bg-terminal animate-pulse" />
                <span className="text-sm font-mono text-terminal">v2.6.357 — Now Live</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                <span className="text-foreground">Turn any</span>
                <br />
                <span className="text-primary glow-text">codebase</span>
                <br />
                <span className="text-foreground">into a teacher.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                CodexPath AI analyzes real codebases and explains them like a patient mentor.
                No guessing. No hallucination. Just facts from your code.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById("analyze-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold glow-primary hover:brightness-110 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Start Analyzing
                </button>
                <a
                  href="https://github.com/Utkrisht-Utpal/CodeXPath"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-secondary/40 text-foreground font-semibold hover:border-primary/40 hover:bg-secondary/60 transition-all"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>

              {/* Stats row */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-border/50">

                {/* Stat 1: Files Analyzed (live counter) */}
                <div>
                  <p className="text-2xl font-bold text-primary font-mono">
                    {filesAnalyzed > 0 ? `${displayCount.toLocaleString()}+` : "50+"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Files analyzed</p>
                </div>

                {/* Stat 2: Languages (clickable popover) */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setLangOpen((o) => !o)}
                    className="text-left group"
                  >
                    <p className="text-2xl font-bold text-primary font-mono flex items-center gap-1">
                      {SUPPORTED_LANGUAGES.length}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 group-hover:text-foreground transition-colors">
                      Languages supported
                    </p>
                  </button>

                  {/* Popover */}
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full mb-3 left-0 z-50 w-56 rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-2xl p-3"
                    >
                      <p className="text-xs text-muted-foreground font-mono mb-2 px-1">Supported languages</p>
                      <div className="space-y-1.5">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <div key={lang.ext} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors">
                            <span className="text-sm text-foreground font-medium">{lang.name}</span>
                            <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${lang.color}`}>
                              {lang.ext}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-border px-1">
                        <p className="text-xs text-muted-foreground">More languages coming soon</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Stat 3: Hallucinations */}
                <div>
                  <p className="text-2xl font-bold text-primary font-mono">0</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hallucinations</p>
                </div>

              </div>
            </motion.div>

            {/* Right: Code block */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="rounded-xl border border-glow bg-code-bg overflow-hidden glow-primary">
                {/* Title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs font-mono text-muted-foreground">analysis.ts</span>
                </div>

                {/* Code */}
                <div className="p-5 font-mono text-sm leading-7">
                  {codeLines.map((line, i) => (
                    <motion.div
                      key={line.num}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="flex"
                    >
                      <span className="code-line-number w-8 text-right mr-6 text-xs leading-7">
                        {line.num}
                      </span>
                      <span className={line.color}>{line.content}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
