import { motion } from "framer-motion";
import { Code2, Map, Brain, FileSearch, GitBranch, Layers } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Codebase Analysis",
    description: "Detect languages, frameworks, entry points, and architecture patterns automatically from any project.",
  },
  {
    icon: Map,
    title: "Learning Roadmaps",
    description: "Get a personalized learning path based on your skill level, goals, and the concepts actually used in the code.",
  },
  {
    icon: Brain,
    title: "Concept Extraction",
    description: "Identify real programming concepts in the project—APIs, auth, state management—mapped to exact files.",
  },
  {
    icon: Code2,
    title: "Function Deep Dives",
    description: "Understand any function: what it does, who calls it, what breaks without it, and the problem it solves.",
  },
  {
    icon: GitBranch,
    title: "Data Flow Tracing",
    description: "Follow how data moves through the system, from entry points through business logic to the UI.",
  },
  {
    icon: Layers,
    title: "Architecture Diagrams",
    description: "Get clear, text-based architecture descriptions with node-and-flow breakdowns of your system.",
  },
];

const Features = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-terminal mb-3 block">// capabilities</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to <span className="text-primary">understand code</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fact-first analysis. No hallucination. Every explanation grounded in your actual codebase.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-6 rounded-xl border border-border bg-card hover:border-glow hover:glow-primary transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-5 h-5 text-terminal" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
