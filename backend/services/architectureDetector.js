const path = require("path");

const toRelative = (files, tempDir) =>
  files.map((filePath) =>
    path.relative(tempDir, filePath).replace(/\\/g, "/")
  );

const detectArchitecture = (files, tempDir, frameworks = []) => {
  const relativeFiles = toRelative(files, tempDir);

  const hasFolder = (folderName) =>
    relativeFiles.some((file) => file.startsWith(`${folderName}/`));

  const hasModels = hasFolder("models");
  const hasControllers = hasFolder("controllers");
  const hasRoutes = hasFolder("routes");

  const hasComponents =
    hasFolder("src/components") || hasFolder("components");

  const hasPages =
    hasFolder("src/pages") || hasFolder("pages");

  const hasServices =
    hasFolder("services") || hasFolder("src/services");

  const hasApi = relativeFiles.some((file) =>
    file.includes("/api/")
  );

  const hasExpress = frameworks.some((fw) =>
    fw.toLowerCase().includes("express")
  );

  const hasReact =
    frameworks.some((fw) =>
      fw.toLowerCase().includes("react")
    ) ||
    relativeFiles.some((f) =>
      [".tsx", ".jsx"].includes(path.extname(f).toLowerCase())
    );

  // ========================================
  // 1️⃣ File-Based Routing (Next.js style)
  // ========================================
  if (hasPages && hasApi) {
    return "File-Based Routing";
  }

  // ========================================
  // 2️⃣ Component-Based (React / Frontend)
  // ========================================
  if (hasReact) {
    return "Component-Based";
  }

  // ========================================
  // 3️⃣ MVC (Express Backend)
  // ========================================
  if (hasExpress && hasModels && hasControllers && hasRoutes) {
    return "MVC";
  }

  // ========================================
  // 4️⃣ Layered Backend
  // ========================================
  if (hasExpress && hasRoutes && hasServices) {
    return "Layered";
  }

  // ========================================
  // 5️⃣ Monolithic Backend
  // ========================================
  if (hasExpress) {
    return "Monolithic";
  }

  // ========================================
  // 6️⃣ Generic Fallback
  // ========================================
  if (hasComponents || hasRoutes || hasServices) {
    return "Structured";
  }

  return "Unknown";
};

module.exports = {
  detectArchitecture,
};