import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const changelog = readFileSync(new URL('../CHANGELOG.md', import.meta.url), 'utf8');
const packageVersion = packageJson.version;
const expectedTag = process.argv[2] ?? `v${packageVersion}`;
const normalizedTag = expectedTag.startsWith('v') ? expectedTag : `v${expectedTag}`;
const normalizedVersion = normalizedTag.slice(1);

if (normalizedVersion !== packageVersion) {
  throw new Error(
    `package.json version (${packageVersion}) does not match expected tag (${normalizedTag}).`,
  );
}

if (!changelog.includes(`## [${packageVersion}]`)) {
  throw new Error(`CHANGELOG.md is missing an entry for version ${packageVersion}.`);
}

console.log(`Release validation passed for ${normalizedTag}`);
