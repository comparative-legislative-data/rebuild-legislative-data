import { execFileSync } from "node:child_process";
import { cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, readlinkSync, rmSync, utimesSync, writeFileSync } from "node:fs";
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
  "ops/nginx",
  "scripts/run_db1_d4_reference_reconciliation.mjs",
  "scripts/migrate_db1_d4_reference_reconciliation.mjs",
  "scripts/run_db1_d4b_reference_catalogue.mjs",
  "scripts/migrate_db1_d4b_reference_catalogue.mjs",
  "scripts/migrate_db1_d4c_institutional_reference.mjs",
  "scripts/run_db1_d4c_institutional_reconciliation.mjs",
  "scripts/migrate_db1_d5_formal_stages.mjs",
  "scripts/run_db1_d5_formal_stages_reconciliation.mjs",
  "scripts/migrate_db1_d6_bills_collection.mjs",
  "scripts/run_db1_d6_bills_collection_reconciliation.mjs",
  "scripts/migrate_db1_d7_government_roles.mjs",
  "scripts/run_db1_d7_government_roles_reconciliation.mjs",
  "scripts/migrate_db1_d8_committee_roles.mjs",
  "scripts/run_db1_d8_committee_roles_reconciliation.mjs",
  "scripts/migrate_db1_d9_party_roles.mjs",
  "scripts/run_db1_d9_party_roles_reconciliation.mjs",
  "migrations/access_control",
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

function tarPathParts(relativePath) {
  const bytes = Buffer.from(relativePath);
  if (bytes.length <= 100) {
    return { name: relativePath, prefix: "" };
  }
  const segments = relativePath.split("/");
  for (let index = segments.length - 1; index > 0; index -= 1) {
    const prefix = segments.slice(0, index).join("/");
    const name = segments.slice(index).join("/");
    if (Buffer.byteLength(prefix) <= 155 && Buffer.byteLength(name) <= 100) {
      return { name, prefix };
    }
  }
  throw new Error(`Path cannot be represented in a portable ustar archive: ${relativePath}`);
}

function writeTarText(header, offset, length, value) {
  const bytes = Buffer.from(value);
  if (bytes.length > length) {
    throw new Error(`Tar header field is too long: ${value}`);
  }
  bytes.copy(header, offset);
}

function writeTarOctal(header, offset, length, value) {
  const encoded = `${value.toString(8).padStart(length - 2, "0")}\0 `;
  writeTarText(header, offset, length, encoded);
}

function tarHeader(relativePath, sourcePath) {
  const stat = lstatSync(sourcePath);
  const isSymbolicLink = stat.isSymbolicLink();
  const { name, prefix } = tarPathParts(relativePath);
  const header = Buffer.alloc(512, 0);
  const mode = isSymbolicLink ? 0o777 : (stat.mode & 0o111) === 0 ? 0o644 : 0o755;
  writeTarText(header, 0, 100, name);
  writeTarOctal(header, 100, 8, mode);
  writeTarOctal(header, 108, 8, 0);
  writeTarOctal(header, 116, 8, 0);
  writeTarOctal(header, 124, 12, isSymbolicLink ? 0 : stat.size);
  writeTarOctal(header, 136, 12, 946684800);
  header.fill(0x20, 148, 156);
  header[156] = isSymbolicLink ? "2".charCodeAt(0) : "0".charCodeAt(0);
  if (isSymbolicLink) {
    writeTarText(header, 157, 100, readlinkSync(sourcePath));
  }
  writeTarText(header, 257, 6, "ustar\0");
  writeTarText(header, 263, 2, "00");
  writeTarText(header, 265, 32, "root");
  writeTarText(header, 297, 32, "root");
  writeTarText(header, 345, 155, prefix);
  writeTarOctal(header, 148, 8, header.reduce((total, byte) => total + byte, 0));
  return { header, isSymbolicLink, size: stat.size };
}

function deterministicTar(rootPath, archiveEntries) {
  const chunks = [];
  for (const relativePath of archiveEntries) {
    const sourcePath = join(rootPath, relativePath);
    const { header, isSymbolicLink, size } = tarHeader(relativePath, sourcePath);
    chunks.push(header);
    if (!isSymbolicLink) {
      const contents = readFileSync(sourcePath);
      chunks.push(contents);
      const padding = (512 - (size % 512)) % 512;
      if (padding > 0) {
        chunks.push(Buffer.alloc(padding, 0));
      }
    }
  }
  chunks.push(Buffer.alloc(1024, 0));
  return Buffer.concat(chunks);
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
const tarBytes = deterministicTar(stageRoot, archiveEntries);
writeFileSync(archivePath, gzipSync(tarBytes, { mtime: 0 }));
const manifest = {
  build_id: "private-beta-access",
  capability_status: [
    "PRIVATE_NO_RETENTION_UPSTREAM_PASSTHROUGH",
    "PRIVATE_SOURCE_PASSTHROUGH_WHEN_CONFIGURED",
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
