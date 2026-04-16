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
const { buildDependencyGraph } = require("./dependencyGraphBuilder");

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
    // shallow clone, fast
    await simpleGit().clone(repoUrl.trim(), tempDir, ["--depth", "1"]);

    // one scan, reuse everywhere
    const files = await scanFiles(tempDir);

    // frameworks
    const frameworks = await detectFrameworks(tempDir, files);

    // file types by count
    const technologies = buildTechnologyBreakdown(files);

    // MVC / layered / etc.
    const architecture = detectArchitecture(
      files,
      tempDir,
      frameworks
    );

    // key files worth reading first
    const coreFiles = detectCoreFiles(
      files,
      tempDir,
      frameworks
    );

    // what to learn and in what order
    const learningPath = generateLearningPath({
      frameworks,
      architecture,
      technologies,
    });

    // dominant language by file count
    const language = detectLanguage(files);

    // where execution starts
    const entryPoint = await detectEntryPoint(
      language,
      files,
      tempDir,
      frameworks
    );

    // file → import edges
    const dependencyGraph = await buildDependencyGraph(files, tempDir);

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
      dependencyGraph,
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