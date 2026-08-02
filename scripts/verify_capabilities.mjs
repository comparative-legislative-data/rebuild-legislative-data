import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const directories = ["apps", "packages"];
const prohibited = [
  "node:net",
  "node:tls",
  "node:child_process",
  "axios",
  "data.parliament.scot",
  "/proxy/",
  "/db1/",
  "/db2/",
  "raw capture",
  "research export"
];

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "dist" ? [] : filesBelow(path);
    }
    return /\.(?:ts|tsx|css|html)$/.test(entry.name) ? [path] : [];
  });
}

const findings = [];
for (const directory of directories) {
  for (const path of filesBelow(directory)) {
    const content = readFileSync(path, "utf8").toLowerCase();
    for (const term of prohibited) {
      if (content.includes(term.toLowerCase())) {
        findings.push(`${path}: prohibited capability or claim token ${term}`);
      }
    }
  }
}

if (findings.length > 0) {
  throw new Error(findings.join("\n"));
}

process.stdout.write("Runtime scope scan passed: no source, DB1, DB2, or research-export route is present.\n");
