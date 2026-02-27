import { Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-terminal" />
            <span className="font-mono font-semibold text-foreground">CodexPath</span>
            <span className="text-muted-foreground font-mono text-xs">AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Turn any codebase into a patient teacher.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            © 2026 CodexPath
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
