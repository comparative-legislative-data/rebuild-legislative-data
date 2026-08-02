import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const archivePath = "artifacts/b1-local-only/b1-local-only.tar.gz";
const manifestPath = "artifacts/b1-local-only/manifest.json";

function packageDigest(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function packageOnce() {
  execFileSync("node", ["scripts/package_b1_release.mjs"], { stdio: "inherit" });
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
