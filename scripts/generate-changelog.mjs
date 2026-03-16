import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const changelogPath = new URL('../CHANGELOG.md', import.meta.url);
const version = process.argv[2] ?? packageJson.version;
const today = new Date().toISOString().slice(0, 10);

function runGit(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function getPreviousTag(currentVersion) {
  const currentTag = `v${currentVersion}`;
  const tags = runGit(['tag', '--sort=-creatordate'])
    .split('\n')
    .map(tag => tag.trim())
    .filter(Boolean)
    .filter(tag => tag !== currentTag);

  return tags[0] ?? null;
}

function getCommitSubjects(previousTag) {
  const range = previousTag ? `${previousTag}..HEAD` : 'HEAD';
  const output = runGit(['log', range, '--pretty=format:%s']);

  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function categorizeCommit(subject) {
  const lowerSubject = subject.toLowerCase();

  if (lowerSubject.startsWith('feat')) {
    return 'Added';
  }

  if (lowerSubject.startsWith('fix')) {
    return 'Fixed';
  }

  if (lowerSubject.startsWith('docs')) {
    return 'Documentation';
  }

  if (lowerSubject.startsWith('refactor') || lowerSubject.startsWith('perf')) {
    return 'Changed';
  }

  if (lowerSubject.startsWith('test')) {
    return 'Tests';
  }

  if (lowerSubject.startsWith('build') || lowerSubject.startsWith('ci') || lowerSubject.startsWith('chore')) {
    return 'Maintenance';
  }

  return 'Changed';
}

function buildEntry(commitSubjects) {
  const grouped = new Map();

  for (const subject of commitSubjects) {
    const section = categorizeCommit(subject);
    const entries = grouped.get(section) ?? [];
    entries.push(`- ${subject}`);
    grouped.set(section, entries);
  }

  if (grouped.size === 0) {
    grouped.set('Changed', ['- Internal release preparation.']);
  }

  const body = [...grouped.entries()]
    .map(([section, entries]) => [`### ${section}`, '', ...entries].join('\n'))
    .join('\n\n');

  return `## [${version}] - ${today}\n\n${body}\n`;
}

const existing = existsSync(changelogPath)
  ? readFileSync(changelogPath, 'utf8')
  : '# Changelog\n\nAll notable changes to this project will be documented in this file.\n';

const versionHeader = `## [${version}]`;
const cleaned = existing.includes(versionHeader)
  ? existing.replace(new RegExp(`## \\[${version.replace(/\./g, '\\.')}]([\\s\\S]*?)(?=\\n## \\[|$)`, 'm'), '').trimEnd()
  : existing.trimEnd();

const previousTag = getPreviousTag(version);
const commitSubjects = getCommitSubjects(previousTag);
const newEntry = buildEntry(commitSubjects);
const nextContent = `${cleaned}\n\n${newEntry}\n`;

writeFileSync(changelogPath, nextContent);
console.log(`Updated CHANGELOG.md for version ${version}`);
