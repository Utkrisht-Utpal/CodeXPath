import { motion } from "framer-motion";

const principles = [
  { label: "Fact First", desc: "Every explanation backed by real code" },
  { label: "No Guessing", desc: "Uncertainty is always disclosed" },
  { label: "Mentor Tone", desc: "Explains why, not just what" },
  { label: "Concept Mapping", desc: "Ties learning to actual files" },
];

const DemoSection = () => {
  return (
    <section className="py-24 gradient-mesh relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Terminal demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-glow bg-code-bg overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <span className="font-mono text-xs text-muted-foreground">$ codexpath analyze ./utpal's-project</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2">
              <p className="text-terminal">✓ Detected: TypeScript + React + Vite</p>
              <p className="text-terminal">✓ Entry point: src/main.tsx</p>
              <p className="text-terminal">✓ 47 components, 12 hooks, 3 contexts</p>
              <p className="text-terminal">✓ Auth: Supabase (email + OAuth)</p>
              <p className="text-terminal">✓ State: React Query + Zustand</p>
              <p className="text-muted-foreground mt-4">───────────────────────────────────</p>
              <p className="text-foreground mt-2">
                <span className="text-terminal">→</span> Generated learning roadmap (14 concepts)
              </p>
              <p className="text-foreground">
                <span className="text-terminal">→</span> Architecture diagram ready
              </p>
              <p className="text-foreground">
                <span className="text-terminal">→</span> 3 potential issues flagged
              </p>
              <p className="text-terminal-dim mt-4 typing-cursor">Ready for questions</p>
            </div>
          </motion.div>

          {/* Principles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-sm text-terminal mb-3 block">// principles</span>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Built on <span className="text-primary">honesty</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Unlike generic AI tools, CodexPath never invents behavior. If something is unclear from 
              the code, it says so. Every answer is grounded in the actual project structure.
            </p>

            <div className="space-y-4">
              {principles.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border"
                >
                  <span className="w-2 h-2 mt-2 rounded-full bg-terminal flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground">{p.label}</h4>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
