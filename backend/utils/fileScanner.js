const fs = require("fs/promises");
const path = require("path");

const scanFiles = async (rootDir) => {
    const stack = [rootDir];
    const files = [];

    while (stack.length > 0) {
        const currentDir = stack.pop();
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.name === ".git") {
                continue;
            }

            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            } else if (entry.isFile()) {
                files.push(fullPath);
            }
        }
    }

    return files;
};

const getExtensionStats = (files) => {
    const extensionStats = {};

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!ext) {
            continue;
        }
        extensionStats[ext] = (extensionStats[ext] || 0) + 1;
    }

    return extensionStats;
};

module.exports = {
    scanFiles,
    getExtensionStats,
};
