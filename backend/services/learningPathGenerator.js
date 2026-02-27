const generateLearningPath = ({
  frameworks = [],
  architecture = "Unknown",
  technologies = [],
}) => {
  const steps = [];

  const techNames = technologies.map(t => t.technology.toLowerCase());

  const hasReact = frameworks.some(f =>
    f.toLowerCase().includes("react")
  );

  const hasExpress = frameworks.some(f =>
    f.toLowerCase().includes("express")
  );

  const hasNext = frameworks.some(f =>
    f.toLowerCase().includes("next")
  );

  const hasTypeScript = techNames.includes("typescript");

  // ==================================================
  // EXPRESS BACKEND ROADMAP
  // ==================================================
  if (hasExpress) {
    steps.push({
      title: "Understand server setup and middleware",
      description:
        "Learn how Express initializes, loads environment configuration, and chains middleware.",
    });

    steps.push({
      title: "Study routing structure",
      description:
        "Trace how incoming requests are mapped to specific route handlers.",
    });

    if (architecture === "MVC") {
      steps.push({
        title: "Analyze MVC separation",
        description:
          "Understand how models, controllers, and routes separate responsibilities.",
      });
    }

    steps.push({
      title: "Explore business logic layer",
      description:
        "Examine how controllers implement business rules and validations.",
    });
  }

  // ==================================================
  // REACT FRONTEND ROADMAP
  // ==================================================
  if (hasReact) {
    steps.push({
      title: "Understand application bootstrap",
      description:
        "Learn how the root file mounts the React app and initializes providers.",
    });

    steps.push({
      title: "Study component structure",
      description:
        "Analyze how reusable UI components are organized and composed.",
    });

    if (architecture === "Component-Based") {
      steps.push({
        title: "Explore component hierarchy",
        description:
          "Understand how components communicate via props and state.",
      });
    }

    if (hasTypeScript) {
      steps.push({
        title: "Review TypeScript usage",
        description:
          "Examine how interfaces and types enforce structure and safety.",
      });
    }
  }

  // ==================================================
  // NEXT.JS ROADMAP
  // ==================================================
  if (hasNext) {
    steps.push({
      title: "Understand file-based routing",
      description:
        "Learn how pages and API routes are structured in the Next.js framework.",
    });

    steps.push({
      title: "Explore server-side rendering concepts",
      description:
        "Study how data fetching works with SSR and static generation.",
    });
  }

  // ==================================================
  // GENERIC FALLBACK
  // ==================================================
  if (steps.length === 0) {
    steps.push({
      title: "Explore project entry point",
      description:
        "Start by understanding the main execution file and overall structure.",
    });

    steps.push({
      title: "Review folder structure",
      description:
        "Identify how logic, utilities, and features are organized.",
    });
  }

  return steps.slice(0, 6);
};

module.exports = {
  generateLearningPath,
};