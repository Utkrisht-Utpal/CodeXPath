const path = require("path");
const fs = require("fs/promises");
const simpleGit = require("simple-git");

const { scanFiles } = require("../utils/fileScanner");
const { buildTechnologyBreakdown } = require("./extensionDetector");
const { detectFrameworks } = require("./frameworkDetector");
const { detectEntryPoint } = require("./entryDetector");
const { detectArchitecture } = require("./architectureDetector");
const { detectCoreFiles } = require("./coreFileDetector");
const { generateLearningPath } = require("./learningPathGenerator");

const createTempDir = () => {
  return path.join(__dirname, "..", `temp-repo-${Date.now()}`);
};

const detectLanguage = (files) => {
  const jsFiles = files.filter((file) =>
    [".js", ".jsx"].includes(path.extname(file).toLowerCase())
  ).length;

  const tsFiles = files.filter((file) =>
    [".ts", ".tsx"].includes(path.extname(file).toLowerCase())
  ).length;

  const pyFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".py"
  ).length;

  if (tsFiles > jsFiles && tsFiles > pyFiles) return "TypeScript";
  if (jsFiles > tsFiles && jsFiles > pyFiles) return "JavaScript";
  if (pyFiles > jsFiles && pyFiles > tsFiles) return "Python";

  if (jsFiles === 0 && tsFiles === 0 && pyFiles === 0)
    return "Unknown";

  return "Mixed";
};

const analyzeRepository = async (repoUrl) => {
  const tempDir = createTempDir();

  try {
    // Clone repository
    await simpleGit().clone(repoUrl.trim(), tempDir, ["--depth", "1"]);

    // Scan all files once
    const files = await scanFiles(tempDir);

    //  Detect frameworks
    const frameworks = await detectFrameworks(tempDir, files);

    // Technology breakdown
    const technologies = buildTechnologyBreakdown(files);

    // Architecture detection
    const architecture = detectArchitecture(
      files,
      tempDir,
      frameworks
    );

    // Core file detection
    const coreFiles = detectCoreFiles(
      files,
      tempDir,
      frameworks
    );

    // Learning roadmap generation
    const learningPath = generateLearningPath({
      frameworks,
      architecture,
      technologies,
    });

    // Language detection
    const language = detectLanguage(files);

    // Entry point detection
    const entryPoint = await detectEntryPoint(
      language,
      files,
      tempDir,
      frameworks
    );

    const primaryTechnology =
      technologies[0]?.technology || "Unknown";

    return {
      summary: {
        totalFiles: files.length,
        primaryTechnology,
      },
      technologies,
      frameworks,
      entryPoint,
      coreFiles,
      architecture,
      learningPath,
    };
  } finally {
    try {
      await fs.rm(tempDir, {
        recursive: true,
        force: true,
      });
    } catch {
    }
  }
};

module.exports = {
  analyzeRepository,
};