const path = require("path");
const fs = require("fs/promises");

const detectFrameworks = async (tempDir, files = []) => {
  const frameworks = new Set();
  const packageJsonPath = path.join(tempDir, "package.json");

  // -----------------------------------
  // 1️⃣ Root package.json detection
  // -----------------------------------
  try {
    await fs.access(packageJsonPath);
    const packageJson = JSON.parse(
      await fs.readFile(packageJsonPath, "utf-8")
    );

    const allDependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    const dependencyNames = Object.keys(allDependencies).map((dep) =>
      dep.toLowerCase()
    );

    if (dependencyNames.includes("react")) frameworks.add("React");
    if (dependencyNames.includes("next")) frameworks.add("Next.js");
    if (dependencyNames.includes("express")) frameworks.add("Express");
    if (dependencyNames.includes("@nestjs/core")) frameworks.add("NestJS");
    if (dependencyNames.includes("vue")) frameworks.add("Vue");
    if (dependencyNames.includes("angular")) frameworks.add("Angular");
  } catch {
    // Safe fallback if package.json missing
  }

  // -----------------------------------
  // 2️⃣ JSX / TSX density fallback
  // (Fixes monorepo / CRA detection)
  // -----------------------------------
  const jsxTsxCount = files.filter((file) =>
    [".jsx", ".tsx"].includes(path.extname(file).toLowerCase())
  ).length;

  if (jsxTsxCount > 5) {
    frameworks.add("React");
  }

  return Array.from(frameworks);
};

module.exports = {
  detectFrameworks,
};