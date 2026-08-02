import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const archivePath = join(root, "artifacts/b1-local-only/b1-local-only.tar.gz");
const manifestPath = join(root, "artifacts/b1-local-only/manifest.json");

function packageDigest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function packageOnce() {
  execFileSync("node", ["scripts/package_b1_release.mjs"], { cwd: root, stdio: "inherit" });
  return {
    archive: packageDigest(archivePath),
    manifest: readFileSync(manifestPath, "utf8")
  };
}

const first = packageOnce();
const second = packageOnce();
if (first.archive !== second.archive || first.manifest !== second.manifest) {
  throw new Error("B1 package reproducibility check failed: repeated archive or manifest differs");
}
process.stdout.write(`B1 package reproducibility check passed: ${first.archive}\n`);
