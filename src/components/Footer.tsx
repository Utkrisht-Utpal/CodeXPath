import { motion } from "framer-motion";
import { Code2, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-mono font-bold text-foreground">CodexPath</span>
            <span className="text-xs font-mono text-primary border border-primary/30 rounded px-1.5 py-0.5">AI</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center">
            Turn any codebase into a patient teacher.
          </p>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Utkrisht-Utpal/CodeXPath"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <span className="text-xs text-muted-foreground font-mono">© 2026 CodexPath</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
