const path = require("path");

const IGNORE_FILES = [
  ".gitignore",
  ".eslintignore",
  ".alexignore",
  ".prettierignore",
  ".editorconfig",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "README.md",
];

const toRelative = (files, tempDir) =>
  files.map((filePath) =>
    path.relative(tempDir, filePath).replace(/\\/g, "/")
  );

const pickFirstMatch = (files, regex) =>
  files.find((file) => regex.test(file));

const detectCoreFiles = (files, tempDir, frameworks = []) => {
  const relativeFiles = toRelative(files, tempDir).filter((file) => {
    const base = path.basename(file);
    return (
      !IGNORE_FILES.includes(base) &&
      !base.startsWith(".") &&
      !file.includes("node_modules")
    );
  });

  const coreFiles = [];
  const added = new Set();

  const addFile = (file, reason) => {
    if (file && !added.has(file)) {
      coreFiles.push({ file, reason });
      added.add(file);
    }
  };

  const hasReact =
    frameworks.some((fw) => fw.toLowerCase().includes("react")) ||
    relativeFiles.some((f) =>
      [".tsx", ".jsx"].includes(path.extname(f).toLowerCase())
    );

  const hasExpress =
    frameworks.some((fw) => fw.toLowerCase().includes("express"));

  // ========================================
  // REACT STRUCTURE
  // ========================================
  if (hasReact) {
    addFile(
      pickFirstMatch(
        relativeFiles,
        /^src\/main\.(js|ts|tsx)$|^main\.(js|ts|tsx)$/
      ),
      "Application bootstrap and React root mounting."
    );

    addFile(
      pickFirstMatch(
        relativeFiles,
        /^src\/App\.(js|ts|tsx)$|^App\.(js|ts|tsx)$/
      ),
      "Root component defining global layout and providers."
    );

    addFile(
      pickFirstMatch(
        relativeFiles,
        /(routes|router).*\.(js|ts|tsx)$/
      ),
      "Defines application routing structure."
    );

    addFile(
      pickFirstMatch(
        relativeFiles,
        /^src\/pages\/.*\.(js|ts|tsx)$/
      ),
      "Example page component showing feature structure."
    );

    addFile(
      pickFirstMatch(
        relativeFiles,
        /^src\/components\/.*\.(js|ts|tsx)$/
      ),
      "Reusable UI component illustrating composition patterns."
    );
  }

  // ========================================
  // EXPRESS STRUCTURE
  // ========================================
  if (hasExpress) {
  const priorityPatterns = [
    /^src\/index\.(js|ts)$/,
    /^src\/app\.(js|ts)$/,
    /^index\.(js|ts)$/,
    /^app\.(js|ts)$/,
    /^server\.(js|ts)$/,
  ];

  for (const pattern of priorityPatterns) {
    const match = pickFirstMatch(relativeFiles, pattern);
    if (match) {
      coreFiles.push({
        file: match,
        reason: "Application entry and Express bootstrap.",
      });
      break;
    }
  }

  const firstRoute = pickFirstMatch(relativeFiles, /^src\/routes\/.*\.(js|ts)$/);
  if (firstRoute) {
    coreFiles.push({
      file: firstRoute,
      reason: "Defines API route mappings.",
    });
  }

  const firstController = pickFirstMatch(relativeFiles, /^src\/controllers\/.*\.(js|ts)$/);
  if (firstController) {
    coreFiles.push({
      file: firstController,
      reason: "Contains request handling and business logic.",
    });
  }

  const firstModel = pickFirstMatch(relativeFiles, /^src\/(models|entity)\/.*\.(js|ts)$/);
  if (firstModel) {
    coreFiles.push({
      file: firstModel,
      reason: "Defines data schema or database interaction.",
    });
  }
}

  // ========================================
  // SAFE FALLBACK
  // ========================================
  if (coreFiles.length === 0) {
    const safeFallback = relativeFiles.find(
      (file) =>
        !file.startsWith(".") &&
        !file.includes("node_modules")
    );

    if (safeFallback) {
      addFile(
        safeFallback,
        "Primary logical entry file of the project."
      );
    }
  }

  return coreFiles.slice(0, 5);
};

module.exports = {
  detectCoreFiles,
};