const path = require("path");
const fs = require("fs/promises");

const detectEntryPoint = async (language, files, tempDir, frameworks = []) => {
  const relativeFiles = files.map((filePath) =>
    path.relative(tempDir, filePath).replace(/\\/g, "/")
  );

  const fileSet = new Set(relativeFiles);

  const hasFramework = (name) =>
    frameworks.some((fw) =>
      fw.toLowerCase().includes(name.toLowerCase())
    );

  // ============================================
  // React Projects
  // ============================================
  if (hasFramework("react")) {
    const reactCandidates = [
      "src/main.tsx",
      "src/index.tsx",
      "src/index.jsx",
      "src/index.js",
      "main.tsx",
      "index.tsx",
      "index.js",
    ];

    for (const candidate of reactCandidates) {
      if (fileSet.has(candidate)) {
        return candidate;
      }
    }
  }

  // ============================================
  // Express Projects
  // ============================================
  if (hasFramework("express")) {
    const expressCandidates = [
      "server.js",
      "app.js",
      "index.js",
      "src/server.ts",
      "src/app.ts",
      "src/index.ts",
    ];

    for (const candidate of expressCandidates) {
      if (fileSet.has(candidate)) {
        return candidate;
      }
    }
  }

  // ============================================
  // package.json main fallback
  // ============================================
  try {
    const packageJsonPath = path.join(tempDir, "package.json");
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, "utf-8")
    );

    if (
      typeof packageJson.main === "string" &&
      fileSet.has(packageJson.main.trim())
    ) {
      return packageJson.main.trim();
    }
  } catch {}

  // ============================================
  // Generic JS fallback
  // ============================================
  const genericCandidates = [
    "index.js",
    "main.js",
    "index.ts",
    "main.ts",
  ];

  for (const candidate of genericCandidates) {
    if (fileSet.has(candidate)) {
      return candidate;
    }
  }

  // ============================================
  // 5️⃣ Python fallback
  // ============================================
  const pythonCandidates = [
    "main.py",
    "app.py",
    "server.py",
    "__main__.py",
  ];

  for (const candidate of pythonCandidates) {
    if (fileSet.has(candidate)) {
      return candidate;
    }
  }

  return "Not Detected";
};

module.exports = {
  detectEntryPoint,
};