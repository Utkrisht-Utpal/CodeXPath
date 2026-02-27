import { motion } from "framer-motion";

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

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center gradient-mesh overflow-hidden">
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

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => document.getElementById("analyze-section")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold glow-primary hover:brightness-110 transition-all"
              >
                Start Analyzing
              </button>
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
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
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
  );
};

export default Hero;
