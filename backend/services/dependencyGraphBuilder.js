const fs = require("fs/promises");
const path = require("path");

const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

// read @/ aliases from tsconfig
const detectAliases = async (tempDir) => {
    const aliases = [];
    const tsconfigPaths = [
        path.join(tempDir, "tsconfig.json"),
        path.join(tempDir, "tsconfig.app.json"),
    ];

    for (const tsconfigPath of tsconfigPaths) {
        try {
            const raw = await fs.readFile(tsconfigPath, "utf-8");
            // tsconfig has comments, JSON.parse can't handle them
            const stripped = raw.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
            const tsconfig = JSON.parse(stripped);
            const paths = tsconfig?.compilerOptions?.paths || {};

            for (const [alias, targets] of Object.entries(paths)) {
                // strip the trailing * to get usable prefixes
                const aliasPrefix = alias.replace(/\*$/, "");
                const targetPrefix = (targets[0] || "").replace(/\*$/, "");
                if (aliasPrefix && targetPrefix) {
                    aliases.push({ aliasPrefix, targetPrefix });
                }
            }
        } catch {
            // no tsconfig, move on
        }
    }

    // nothing found — assume @/ = src/ (works for most vite/next projects)
    if (aliases.length === 0) {
        aliases.push({ aliasPrefix: "@/", targetPrefix: "src/" });
    }

    return aliases;
};

// turn import string into a real file path
const resolveImport = (importPath, currentFile, tempDir, aliases, fileSet) => {
    let resolvedBase = null;

    // alias import (@/something)
    for (const { aliasPrefix, targetPrefix } of aliases) {
        if (importPath.startsWith(aliasPrefix)) {
            const rest = importPath.slice(aliasPrefix.length);
            resolvedBase = path.join(tempDir, targetPrefix, rest);
            break;
        }
    }

    // relative import
    if (!resolvedBase && (importPath.startsWith("./") || importPath.startsWith("../"))) {
        resolvedBase = path.resolve(path.dirname(currentFile), importPath);
    }

    if (!resolvedBase) return null; // third-party package, skip

    // try bare path, then add extension, then /index.x
    const candidates = [
        resolvedBase,
        ...EXTENSIONS.map((ext) => resolvedBase + ext),
        ...EXTENSIONS.map((ext) => path.join(resolvedBase, "index" + ext)),
    ];

    for (const candidate of candidates) {
        const norm = candidate.replace(/\\/g, "/");
        if (fileSet.has(norm)) return norm;
    }

    return null;
};

// grab every import/require string from a file
const extractImports = async (filePath) => {
    try {
        const content = await fs.readFile(filePath, "utf-8");
        const found = [];

        // ES imports + CJS require
        const esImport =
            /import\s+(?:[\w*{},\s]+\s+from\s+)?['"]([^'"]+)['"]/g;
        const cjsRequire = /require\(\s*['"]([^'"]+)['"]\s*\)/g;

        let m;
        while ((m = esImport.exec(content)) !== null) found.push(m[1]);
        while ((m = cjsRequire.exec(content)) !== null) found.push(m[1]);

        return found;
    } catch {
        return [];
    }
};

const buildDependencyGraph = async (files, tempDir) => {
    // JS/TS only, no node_modules, max 80
    const targetFiles = files
        .filter((f) => EXTENSIONS.includes(path.extname(f).toLowerCase()))
        .filter((f) => !f.replace(/\\/g, "/").includes("/node_modules/"))
        .slice(0, 80);

    // fast lookup set for path resolution
    const fileSet = new Set(targetFiles.map((f) => f.replace(/\\/g, "/")));

    const aliases = await detectAliases(tempDir);

    // file → imports map
    const adjacency = new Map();

    for (const file of targetFiles) {
        const absFile = file.replace(/\\/g, "/");
        const imports = await extractImports(absFile);
        const resolved = [];

        for (const imp of imports) {
            const target = resolveImport(imp, absFile, tempDir, aliases, fileSet);
            if (target && target !== absFile && !resolved.includes(target)) {
                resolved.push(target);
            }
        }

        adjacency.set(absFile, resolved);
    }

    const toId = (abs) => path.relative(tempDir, abs).replace(/\\/g, "/");

    // how many files import each file
    const inDegree = new Map(
        targetFiles.map((f) => [f.replace(/\\/g, "/"), 0])
    );
    for (const [, deps] of adjacency) {
        for (const dep of deps) {
            inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
        }
    }

    // pick root — prefer main/index/App, fallback to first zero-degree node
    const rootPriority = [
        "src/main.tsx","src/main.ts","src/main.jsx","src/main.js",
        "src/App.tsx","src/App.ts","src/App.jsx","src/App.js",
        "src/index.tsx","src/index.ts","src/index.jsx","src/index.js",
    ];
    const zeroDegree = [...inDegree.entries()].filter(([, d]) => d === 0).map(([f]) => f);
    let rootAbs = null;

    for (const preferred of rootPriority) {
        const match = zeroDegree.find((f) => f.endsWith(preferred));
        if (match) { rootAbs = match; break; }
    }
    if (!rootAbs && zeroDegree.length > 0) rootAbs = zeroDegree[0];
    if (!rootAbs) rootAbs = targetFiles[0]?.replace(/\\/g, "/") ?? "";

    // BFS from root, depth 6 max
    const MAX_DEPTH = 6;
    const visited = new Set();
    const treeNodes = [];
    const treeEdges = [];
    const treeMap = {};

    const queue = [{ abs: rootAbs, depth: 0 }];
    visited.add(rootAbs);

    while (queue.length > 0) {
        const { abs, depth } = queue.shift();
        const id = toId(abs);
        treeNodes.push({ id, group: "connected" });
        if (!treeMap[id]) treeMap[id] = [];

        if (depth >= MAX_DEPTH) continue;

        for (const childAbs of (adjacency.get(abs) ?? [])) {
            const childId = toId(childAbs);
            treeEdges.push({ source: id, target: childId });
            treeMap[id].push(childId);
            if (!visited.has(childAbs)) {
                visited.add(childAbs);
                queue.push({ abs: childAbs, depth: depth + 1 });
            }
        }
    }

    // anything BFS didn't reach goes in the orphan pile
    for (const file of targetFiles) {
        const abs = file.replace(/\\/g, "/");
        if (!visited.has(abs)) {
            const id = toId(abs);
            treeNodes.push({ id, group: "orphan" });
            if (!treeMap[id]) treeMap[id] = [];
        }
    }

    return {
        root: toId(rootAbs),
        nodes: treeNodes,
        edges: treeEdges,
        tree: treeMap,
    };
};

module.exports = { buildDependencyGraph };
