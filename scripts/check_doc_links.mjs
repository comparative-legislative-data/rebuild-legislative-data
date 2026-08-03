import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const docsRoot = resolve('docs');
const markdownFiles = [];

function collect(directory) {
  for (const entry of readdirSync(directory)) {
    const path = resolve(directory, entry);
    if (statSync(path).isDirectory()) collect(path);
    else if (path.endsWith('.md')) markdownFiles.push(path);
  }
}

collect(docsRoot);

const failures = [];
const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;

for (const file of markdownFiles) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
    target = target.split(/\s+['"][^'"]*['"]$/)[0].split('#')[0];
    if (!target || /^(https?:|mailto:|tel:|data:)/i.test(target) || target.startsWith('/')) continue;
    if (!existsSync(resolve(file, '..', target))) {
      failures.push(`${relative(process.cwd(), file)} -> ${target}`);
    }
  }
}

if (failures.length) {
  console.error(`Broken local documentation links (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Documentation link check passed (${markdownFiles.length} Markdown files checked).`);
}
