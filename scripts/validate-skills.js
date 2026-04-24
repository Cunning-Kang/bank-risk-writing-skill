'use strict';

// validate-skills.js — Structural validation for the bank-risk-writing-skill pack.
// Runs with zero dependencies: CommonJS, no network, no YAML library.
// Invoked via `npm test`.

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '..');

const REQUIRED_SKILLS = [
  'policy-brief',
  'formal-polish',
  'report-outline',
  'ppt-outline',
];

const REQUIRED_FM_FIELDS = ['name', 'description', 'when_to_use', 'allowed-tools'];

// Field names that indicate the old non-standard format and must NOT appear.
const INVALID_FM_FIELDS = ['tools'];

// Tool names that must be present in allowed-tools.
const REQUIRED_TOOLS = ['Read', 'Grep', 'Glob'];

// Docs files to check for stale flat skill paths.
const DOCS_TO_CHECK = [
  'README.md',
  'prompts/task-routing.md',
  'test-cases/TEST_PLAN.md',
  'test-cases/notes.md',
];

// Stale flat-skill paths that must not appear in docs.
const STALE_FLAT_PATHS = [
  'skills/policy-brief.md',
  'skills/formal-polish.md',
  'skills/report-outline.md',
  'skills/ppt-outline.md',
];

// Expected new-path references that SHOULD appear in key docs.
const EXPECTED_NEW_PATHS_MAP = {
  'README.md': [
    'skills/policy-brief/SKILL.md',
    'skills/formal-polish/SKILL.md',
    'skills/report-outline/SKILL.md',
    'skills/ppt-outline/SKILL.md',
  ],
  'prompts/task-routing.md': [
    'skills/policy-brief/SKILL.md',
    'skills/formal-polish/SKILL.md',
    'skills/report-outline/SKILL.md',
    'skills/ppt-outline/SKILL.md',
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let errorCount = 0;
let warningCount = 0;

function fail(file, message) {
  errorCount++;
  console.error('FAIL  %s: %s', file || '(global)', message);
}

function warn(file, message) {
  warningCount++;
  console.warn('WARN  %s: %s', file || '(global)', message);
}

function repoRelative(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fileExists(relPath) {
  return fs.existsSync(repoRelative(relPath));
}

function readFile(relPath) {
  return fs.readFileSync(repoRelative(relPath), 'utf8');
}

// ---------------------------------------------------------------------------
// Minimal frontmatter parser (no YAML library)
// ---------------------------------------------------------------------------

/**
 * Extract the frontmatter block from a SKILL.md file.
 * Returns { raw: string, fields: Map<string, string> } or null if missing/invalid.
 *
 * Handles YAML list values (lines starting with "  - ") by collecting them
 * into a comma-separated string under the parent key.
 */
function parseFrontmatter(content, filePath) {
  // Opening boundary must be exactly "---" on the first line
  const firstLineEnd = content.indexOf('\n');
  if (firstLineEnd === -1 || content.slice(0, firstLineEnd).trim() !== '---') {
    fail(filePath, 'frontmatter must start with opening --- boundary on first line');
    return null;
  }

  // Closing boundary must be a standalone line of exactly "---"
  const closePattern = /\n---\s*\n/;
  const closeMatch = closePattern.exec(content.slice(firstLineEnd));
  if (!closeMatch) {
    fail(filePath, 'frontmatter missing closing --- boundary on its own line');
    return null;
  }

  const raw = content.slice(firstLineEnd + 1, firstLineEnd + closeMatch.index).trim();
  const lines = raw.split('\n');
  const fields = new Map();

  let currentKey = null;
  let listItems = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') continue;

    // List item under a parent key
    if (line.startsWith('  - ') && currentKey) {
      listItems.push(trimmed.slice(2).trim());
      continue;
    }

    // Flush previous list into the map
    if (currentKey && listItems.length > 0) {
      fields.set(currentKey, listItems);
      listItems = [];
      currentKey = null;
    }

    // Key: value line
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      warn(filePath, 'frontmatter line not in key: value format: "' + trimmed + '"');
      continue;
    }

    const key = trimmed.slice(0, colonIdx).trim();
    const val = trimmed.slice(colonIdx + 1).trim();

    if (val === '') {
      // Value is empty — likely a YAML list follows on subsequent lines
      currentKey = key;
      listItems = [];
    } else {
      fields.set(key, val);
      currentKey = null;
    }
  }

  // Flush any trailing list
  if (currentKey && listItems.length > 0) {
    fields.set(currentKey, listItems);
  }

  return { raw, fields };
}

// ---------------------------------------------------------------------------
// Additional Resources path extraction
// ---------------------------------------------------------------------------

/**
 * Extract repo-relative paths from backtick-quoted strings in the
 * "Additional Resources" section of a SKILL.md file.
 */
function extractResourcePaths(content, filePath) {
  const sectionHeader = '# Additional Resources';
  const sectionStart = content.indexOf(sectionHeader);
  if (sectionStart === -1) {
    fail(filePath, 'missing "# Additional Resources" section');
    return [];
  }

  // Find the next top-level heading (## or # at start of line) after this section
  const afterSection = content.slice(sectionStart + sectionHeader.length);
  const nextHeadingMatch = afterSection.match(/\n#[^#]/);
  const sectionBody = nextHeadingMatch
    ? afterSection.slice(0, nextHeadingMatch.index)
    : afterSection;

  // Extract all backtick-quoted paths
  const backtickPattern = /`([^`]+)`/g;
  const paths = [];
  let match;
  while ((match = backtickPattern.exec(sectionBody)) !== null) {
    const p = match[1].trim();
    // Skip template-variable references
    if (p.startsWith('${')) continue;
    // Only treat as a path if it contains a slash or known extension
    if (p.includes('/') || p.endsWith('.md') || p.endsWith('.yml') || p.endsWith('.yaml')) {
      paths.push(p);
    }
  }

  return paths;
}

// ---------------------------------------------------------------------------
// Validation checks
// ---------------------------------------------------------------------------

function validateSkill(skillName) {
  const dir = 'skills/' + skillName;
  const skillFile = dir + '/SKILL.md';
  const dirPath = repoRelative(dir);
  const filePath = repoRelative(skillFile);

  // 1. Directory exists
  if (!fs.existsSync(dirPath)) {
    fail(skillFile, 'directory does not exist: ' + dir);
    return;
  }

  // 2. Exactly one SKILL.md
  if (!fs.existsSync(filePath)) {
    fail(skillFile, 'SKILL.md entry file does not exist');
    return;
  }

  const dirEntries = fs.readdirSync(dirPath).filter(function (e) {
    return e.endsWith('.md');
  });
  if (dirEntries.length !== 1 || dirEntries[0] !== 'SKILL.md') {
    fail(skillFile, 'expected exactly one SKILL.md in ' + dir + ', found: ' + dirEntries.join(', '));
  }

  // 3. Parse frontmatter
  const content = readFile(skillFile);
  const fm = parseFrontmatter(content, skillFile);
  if (!fm) return;

  const fields = fm.fields;

  // 4. Required fields
  for (const field of REQUIRED_FM_FIELDS) {
    if (!fields.has(field)) {
      fail(skillFile, 'frontmatter missing required field: ' + field);
    }
  }

  // 5. Invalid field: tools
  for (const invalid of INVALID_FM_FIELDS) {
    if (fields.has(invalid)) {
      fail(skillFile, 'frontmatter contains invalid field "' + invalid + '"; use "allowed-tools" instead');
    }
  }

  // 6. Name must match directory and be lowercase kebab-case
  const nameVal = fields.get('name');
  if (nameVal) {
    if (typeof nameVal !== 'string') {
      fail(skillFile, 'frontmatter "name" must be a scalar string, got: ' + JSON.stringify(nameVal));
    } else {
      if (nameVal !== skillName) {
        fail(skillFile, 'frontmatter "name" is "' + nameVal + '" but directory is "' + skillName + '"');
      }
      if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(nameVal)) {
        fail(skillFile, 'frontmatter "name" must be lowercase kebab-case: "' + nameVal + '"');
      }
    }
  }

  // 7. allowed-tools must be a YAML list of explicit tool names
  const toolsVal = fields.get('allowed-tools');
  if (toolsVal) {
    if (Array.isArray(toolsVal)) {
      if (toolsVal.length === 0) {
        fail(skillFile, 'frontmatter "allowed-tools" is empty');
      }

      // Check for comma-string or malformed entries
      for (const t of toolsVal) {
        if (typeof t !== 'string') {
          fail(skillFile, 'frontmatter "allowed-tools" entry is not a string: ' + JSON.stringify(t));
        } else if (t.includes(',')) {
          fail(skillFile, 'frontmatter "allowed-tools" entry looks like a comma-separated string: "' + t + '"');
        } else if (t.trim() !== t) {
          fail(skillFile, 'frontmatter "allowed-tools" entry has leading/trailing whitespace: "' + t + '"');
        }
      }

      // Check required tools
      for (const rt of REQUIRED_TOOLS) {
        if (!toolsVal.includes(rt)) {
          fail(skillFile, 'frontmatter "allowed-tools" missing required tool: ' + rt);
        }
      }
    } else if (typeof toolsVal === 'string') {
      // String value means it was a scalar, not a YAML list
      if (toolsVal.includes(',')) {
        fail(skillFile, 'frontmatter "allowed-tools" is a comma-separated string, not a YAML list: "' + toolsVal + '"');
      } else if (toolsVal.trim() === '') {
        fail(skillFile, 'frontmatter "allowed-tools" is empty');
      } else {
        fail(skillFile, 'frontmatter "allowed-tools" must be a YAML list, not a scalar string: "' + toolsVal + '"');
      }
    } else {
      fail(skillFile, 'frontmatter "allowed-tools" has unexpected type: ' + typeof toolsVal);
    }
  }

  // 8. Additional Resources section and path validation
  const resourcePaths = extractResourcePaths(content, skillFile);
  if (resourcePaths.length === 0) {
    // Already failed inside extractResourcePaths if section is missing
    warn(skillFile, 'no resource paths found in Additional Resources section');
  }

  for (const rp of resourcePaths) {
    // Check for absolute or user-specific paths
    if (rp.startsWith('/') || rp.startsWith('~') || rp.includes('/Users/') || rp.includes('/home/')) {
      fail(skillFile, 'resource path is absolute or user-specific: `' + rp + '`');
      continue;
    }

    // Check the path exists
    if (!fileExists(rp)) {
      fail(skillFile, 'resource path does not exist in repo: `' + rp + '`');
    }
  }
}

function validateDocsStalePaths() {
  for (const docRelPath of DOCS_TO_CHECK) {
    if (!fileExists(docRelPath)) {
      fail(docRelPath, 'required documentation file does not exist');
      continue;
    }

    const content = readFile(docRelPath);

    for (const stale of STALE_FLAT_PATHS) {
      if (content.includes(stale)) {
        fail(docRelPath, 'contains stale flat skill path: ' + stale);
      }
    }
  }

  // Also check test case files for stale paths
  const casesDir = 'test-cases/cases';
  if (fs.existsSync(repoRelative(casesDir))) {
    const caseFiles = fs.readdirSync(repoRelative(casesDir)).filter(function (f) {
      return f.endsWith('.md');
    });
    for (const cf of caseFiles) {
      const relPath = casesDir + '/' + cf;
      const content = readFile(relPath);
      for (const stale of STALE_FLAT_PATHS) {
        if (content.includes(stale)) {
          fail(relPath, 'contains stale flat skill path: ' + stale);
        }
      }
    }
  }
}

/**
 * Check whether a document references a skill path. Handles two cases:
 * 1. The full path appears as a continuous string (e.g., in inline backticks).
 * 2. The path appears across tree-drawing lines in a directory tree diagram,
 *    where the skill name and SKILL.md are on separate lines but still convey
 *    the correct path visually.
 */
function docContainsSkillPath(content, fullPath) {
  // Case 1: full path as a continuous substring
  if (content.includes(fullPath)) return true;

  // Case 2: tree diagram — look for the skill-name/SKILL.md fragment
  // e.g., fullPath = "skills/policy-brief/SKILL.md"
  //   -> check for "policy-brief/SKILL.md" as substring (tree lines like
  //      "├─ policy-brief/" followed by "└─ SKILL.md" won't match this,
  //      but "policy-brief/SKILL.md" is the shortest unambiguous fragment)
  const parts = fullPath.split('/');
  if (parts.length >= 2) {
    // Check the last two components joined: e.g. "policy-brief/SKILL.md"
    const fragment = parts[parts.length - 2] + '/' + parts[parts.length - 1];
    if (content.includes(fragment)) return true;

    // For tree diagrams, check that the skill directory name and SKILL.md
    // both appear in the document (less precise but handles tree diagrams)
    const skillDir = parts[parts.length - 2]; // e.g., "policy-brief"
    // Check the skill name appears in a tree context near "SKILL.md"
    const skillIdx = content.indexOf(skillDir + '/');
    if (skillIdx !== -1) {
      // Look ahead within 200 chars for SKILL.md
      const nearby = content.slice(skillIdx, skillIdx + 200);
      if (nearby.includes('SKILL.md')) return true;
    }
  }

  return false;
}

function validateDocsNewPaths() {
  for (const [docRelPath, expectedRefs] of Object.entries(EXPECTED_NEW_PATHS_MAP)) {
    if (!fileExists(docRelPath)) continue; // Already reported as missing above

    const content = readFile(docRelPath);
    for (const ref of expectedRefs) {
      if (!docContainsSkillPath(content, ref)) {
        fail(docRelPath, 'missing expected new SKILL.md path reference: ' + ref);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('Validating skill pack structure...\n');
console.log('Repository root: %s\n', REPO_ROOT);

// Skill-level checks
for (const skillName of REQUIRED_SKILLS) {
  validateSkill(skillName);
}

// Repository-wide docs checks
validateDocsStalePaths();
validateDocsNewPaths();

// Summary
console.log('\n---');
console.log('Validation complete: %d error(s), %d warning(s)', errorCount, warningCount);

if (errorCount > 0) {
  console.log('FAILED');
  process.exit(1);
} else {
  console.log('PASSED');
  process.exit(0);
}
