// save-structure-filtered.js
// Run: node save-structure-filtered.js

import fs from "fs";
import path from "path";

const rootDir = "C:/Users/Shaun/FrightClubFinal-main"; // adjust if needed
const maxDepth = 8; // depth cap
const outputFile = path.join(rootDir, "project_structure_filtered.txt");

// Only traverse these top-level areas (and their subfolders)
const allowedRoots = new Set(["pages", "components", "src", "lib", "styles", "app"]);

// Ignore these anywhere
const ignoreDirs = new Set([
  "node_modules", ".git", ".next", "dist", "build", "out", "coverage",
  ".vercel", ".vscode", ".husky", ".turbo", ".cache", "public" // exclude public to keep it short
]);

// Only list these file types (plus always-include filenames below)
const allowedExts = new Set([".tsx", ".ts", ".jsx", ".js", ".css", ".json", ".md"]);

// Always include these filenames if found
const alwaysInclude = new Set([
  "_app.tsx", "_document.tsx", "index.tsx", "WalletConfirmation.tsx", "WalletConfirmation.ts",
  "AppMenu.tsx", "Header.tsx", "wagmi.ts", "WalletErrorBoundary.tsx",
  "next.config.js", "tsconfig.json", "package.json"
]);

let lines = [];
lines.push(`📂 Filtered folder structure for: ${rootDir}`);
lines.push(`(roots: ${[...allowedRoots].join(", ")}, depth ≤ ${maxDepth})\n`);

function shouldEnterDir(fullPath, name, parentAllowed) {
  if (ignoreDirs.has(name)) return false;
  if (parentAllowed) return true;
  // If we're at the root, only enter dirs that are allowed roots
  return allowedRoots.has(name);
}

function isAllowedFile(name) {
  const ext = path.extname(name);
  return allowedExts.has(ext) || alwaysInclude.has(name);
}

function printTree(dir, depth = 0, parentAllowed = false) {
  if (depth > maxDepth) return;

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  // Separate dirs and files for stable order
  const dirs = entries.filter(e => e.isDirectory());
  const files = entries.filter(e => e.isFile());

  // Sort alphabetically
  dirs.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  for (const d of dirs) {
    const fullPath = path.join(dir, d.name);
    const canEnter = shouldEnterDir(fullPath, d.name, parentAllowed);
    if (!canEnter) continue;

    const rel = path.relative(rootDir, fullPath) || d.name;
    lines.push(`${"  ".repeat(depth)}📁 ${rel}`);
    printTree(fullPath, depth + 1, true);
  }

  for (const f of files) {
    if (!parentAllowed && !alwaysInclude.has(f.name)) continue; // only top-level key files
    if (!isAllowedFile(f.name)) continue;
    const rel = path.relative(rootDir, path.join(dir, f.name));
    lines.push(`${"  ".repeat(depth)}📄 ${rel}`);
  }
}

printTree(rootDir, 0, false);
fs.writeFileSync(outputFile, lines.join("\n"), "utf-8");

console.log(`✅ Filtered structure saved to ${outputFile}`);
