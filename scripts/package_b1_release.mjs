import { execFileSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const artifactRoot = join(root, "artifacts", "b1-local-only");
const stageRoot = join(artifactRoot, "release");
const archivePath = join(artifactRoot, "b1-local-only.tar.gz");
const manifestPath = join(artifactRoot, "manifest.json");
const allowed = [
  "apps/api/dist",
  "apps/web/dist",
  "packages/contracts/dist",
  "package.json",
  "package-lock.json",
  ".nvmrc",
  "ops/systemd",
  "apps/api/package.json",
  "apps/web/package.json",
  "packages/contracts/package.json",
  "packages/verification/package.json"
];
const epoch = new Date("2000-01-01T00:00:00.000Z");

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function copyReleasePath(item) {
  cpSync(resolve(root, item), join(stageRoot, item), {
    recursive: true,
    filter: (path) => !path.endsWith(".tsbuildinfo")
  });
}

function normalizeTimes(path) {
  const stat = lstatSync(path);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(path).sort()) {
      normalizeTimes(join(path, entry));
    }
  }
  if (!stat.isSymbolicLink()) {
    utimesSync(path, epoch, epoch);
  }
}

function filesForArchive(path, relativePath = "") {
  const entries = readdirSync(path, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  return entries.flatMap((entry) => {
    const nextRelativePath = relativePath === "" ? entry.name : join(relativePath, entry.name);
    const nextPath = join(path, entry.name);
    return entry.isDirectory() ? filesForArchive(nextPath, nextRelativePath) : [nextRelativePath];
  });
}

if (existsSync(artifactRoot)) {
  rmSync(artifactRoot, { recursive: true, force: true });
}
mkdirSync(stageRoot, { recursive: true });

for (const item of allowed) {
  copyReleasePath(item);
}

execFileSync("npm", ["ci", "--omit=dev", "--ignore-scripts", "--prefix", stageRoot], {
  stdio: "inherit"
});
normalizeTimes(stageRoot);
const archiveEntries = filesForArchive(stageRoot);
const tarBytes = execFileSync("tar", ["-cf", "-", "-C", stageRoot, ...archiveEntries], {
  maxBuffer: 128 * 1024 * 1024
});
writeFileSync(archivePath, gzipSync(tarBytes, { mtime: 0 }));
const manifest = {
  build_id: "b1-local-only",
  capability_status: [
    "NO_SOURCE_DATA",
    "NO_DATABASE_CONNECTIVITY",
    "NO_PUBLIC_LISTENER",
    "NOT_A_RESEARCH_RELEASE"
  ],
  node_version: process.version,
  npm_version: execFileSync("npm", ["--version"], { encoding: "utf8" }).trim(),
  lockfile_sha256: sha256(join(root, "package-lock.json")),
  archive_sha256: sha256(archivePath),
  included_paths: allowed
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`B1 archive and manifest written under ${artifactRoot}\n`);
