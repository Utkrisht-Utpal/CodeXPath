const { getExtensionStats } = require("../utils/fileScanner");

const EXTENSION_TECH_MAP = {
    ".js": "JavaScript",
    ".jsx": "React (JSX)",
    ".ts": "TypeScript",
    ".tsx": "React (TSX)",
    ".py": "Python",
    ".css": "CSS",
    ".html": "HTML",
    ".java": "Java",
    ".go": "Go",
    ".rs": "Rust",
    ".cpp": "C++",
    ".c": "C",
    ".cs": "C#",
    ".md": "Markdown File",
    ".sql": "SQL File",
    ".txt": "Text File",
};

const buildTechnologyBreakdown = (files) => {
    const extensionStatsMap = getExtensionStats(files);
    return Object.entries(extensionStatsMap)
        .map(([extension, count]) => ({
            extension,
            technology: EXTENSION_TECH_MAP[extension] || extension,
            count,
        }))
        .sort((a, b) => b.count - a.count || a.extension.localeCompare(b.extension));
};

module.exports = {
    buildTechnologyBreakdown,
};
