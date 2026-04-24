'use strict';

// validate-examples.js — Metadata, sample-link, case/expected, and adversarial readiness
// validation for the bank-risk-writing-skill pack.
// Runs with zero dependencies: CommonJS, no network, no YAML library.
// Validates:
//   - .meta.yaml files under examples/ for provenance, usage boundaries,
//     usable_for values, and linked_test_cases consistency.
//   - Numbered case/expected pairing (bidirectional).
//   - EVAL_REVIEW_TEMPLATE.md existence and required section structure.
//   - Adversarial directory and file structure completeness (adv-01 through adv-05).
//   - Reverse path references: paths cited in case/expected markdown must exist.

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, '..');

const VALID_SKILL_NAMES = [
  'policy-brief',
  'formal-polish',
  'report-outline',
  'ppt-outline',
];

const VALID_USABLE_FOR = VALID_SKILL_NAMES.slice(); // No 'all' — each sample must list specific skills

const TEMPLATE_FILE = 'examples/SAMPLE_META_TEMPLATE.yaml';

const CASES_DIR = 'test-cases/cases';
const EXPECTED_DIR = 'test-cases/expected';
const ADVERSARIAL_DIR = 'test-cases/adversarial';
const EVAL_REVIEW_TEMPLATE = 'test-cases/EVAL_REVIEW_TEMPLATE.md';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let errorCount = 0;
let warningCount = 0;
let metaErrorCount = 0;   // metadata/link errors
let metaWarningCount = 0; // metadata/link warnings
let caseErrorCount = 0;   // case/adversarial errors
let caseWarningCount = 0; // case/adversarial warnings

function fail(file, message) {
  errorCount++;
  console.error('FAIL  %s: %s', file || '(global)', message);
}

function warn(file, message) {
  warningCount++;
  console.warn('WARN  %s: %s', file || '(global)', message);
}

function metaFail(file, message) {
  metaErrorCount++;
  fail(file, message);
}

function metaWarn(file, message) {
  metaWarningCount++;
  warn(file, message);
}

function caseFail(file, message) {
  caseErrorCount++;
  fail(file, message);
}

function caseWarn(file, message) {
  caseWarningCount++;
  warn(file, message);
}

function repoRelative(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function fileExists(relPath) {
  return fs.existsSync(repoRelative(relPath));
}

// ---------------------------------------------------------------------------
// Minimal YAML subset parser for .meta.yaml files
// ---------------------------------------------------------------------------

/**
 * Parse the limited YAML subset used in this repo's .meta.yaml files.
 * Supports:
 *   - scalar key: value
 *   - key: (followed by list items)
 *   - list items: "- value" or "  - value"
 *   - folded block: key: > ... (multi-line string)
 *
 * Returns { fields: Map<string, string|string[]>, raw: string }
 */
function parseMetaYaml(content, filePath) {
  const lines = content.split('\n');
  const fields = new Map();
  let currentKey = null;
  let listItems = [];
  let foldedKey = null;
  let foldedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comment-only lines
    if (line.trim().startsWith('#')) continue;
    // Skip empty lines
    if (line.trim() === '') continue;

    // Inside folded block (> style) — collect until next key or end
    if (foldedKey !== null) {
      // A new top-level key ends the folded block
      if (!line.startsWith(' ') && !line.startsWith('\t') && line.includes(':')) {
        // Flush folded
        const foldedText = foldedLines.join(' ').replace(/\s+/g, ' ').trim();
        fields.set(foldedKey, foldedText);
        foldedKey = null;
        foldedLines = [];
        // Fall through to parse this line as a normal key
      } else {
        // Continuation of folded block
        foldedLines.push(line.trim());
        continue;
      }
    }

    // Flush previous list if we hit a new key
    if (currentKey !== null && listItems.length > 0) {
      if (!line.startsWith(' ') && !line.startsWith('\t')) {
        fields.set(currentKey, listItems);
        currentKey = null;
        listItems = [];
      }
    }

    const trimmed = line.trim();

    // List item (may be indented)
    if (trimmed.startsWith('- ')) {
      if (currentKey === null) {
        // Orphan list item — treat as warning
        warn(filePath, 'orphan list item without parent key: "' + trimmed + '"');
        continue;
      }
      listItems.push(trimmed.slice(2).trim());
      continue;
    }

    // Key: value
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) {
      // Not a key:value and not a list item — skip
      continue;
    }

    const key = trimmed.slice(0, colonIdx).trim();
    const valRaw = trimmed.slice(colonIdx + 1).trim();

    // Flush any prior list
    if (currentKey !== null && listItems.length > 0) {
      fields.set(currentKey, listItems);
      currentKey = null;
      listItems = [];
    }

    // Folded block starts
    if (valRaw === '>' || valRaw === '|') {
      foldedKey = key;
      foldedLines = [];
      currentKey = null;
      continue;
    }

    // Empty value — list will follow
    if (valRaw === '' || valRaw === '[]') {
      if (valRaw === '[]') {
        fields.set(key, []);
        currentKey = null;
      } else {
        currentKey = key;
        listItems = [];
      }
      continue;
    }

    // Scalar value — strip surrounding quotes if present
    let scalar = valRaw;
    if (
      (scalar.startsWith('"') && scalar.endsWith('"')) ||
      (scalar.startsWith("'") && scalar.endsWith("'"))
    ) {
      scalar = scalar.slice(1, -1);
    }
    fields.set(key, scalar);
    currentKey = null;
  }

  // Flush trailing list
  if (currentKey !== null && listItems.length > 0) {
    fields.set(currentKey, listItems);
  }

  // Flush trailing folded block
  if (foldedKey !== null && foldedLines.length > 0) {
    const foldedText = foldedLines.join(' ').replace(/\s+/g, ' ').trim();
    fields.set(foldedKey, foldedText);
  }

  return { fields };
}

// ---------------------------------------------------------------------------
// Helpers for field access
// ---------------------------------------------------------------------------

function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function isNonEmptyList(val) {
  return Array.isArray(val) && val.length > 0;
}

/**
 * Check that a value is a non-empty string or a non-empty list of strings.
 */
function isPresent(val) {
  if (isNonEmptyString(val)) return true;
  if (isNonEmptyList(val)) return val.every(function (v) { return typeof v === 'string' && v.trim().length > 0; });
  return false;
}

// ---------------------------------------------------------------------------
// Case ID to filename mapping
// ---------------------------------------------------------------------------

function caseIdToFilename(caseId) {
  // case-01 -> case-01-policy-brief-basic.md (find matching file)
  const casesAbs = repoRelative(CASES_DIR);
  if (!fs.existsSync(casesAbs)) return null;
  const files = fs.readdirSync(casesAbs).filter(function (f) { return f.endsWith('.md'); });
  for (const f of files) {
    if (f.startsWith(caseId + '-')) return f;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Validate a single .meta.yaml file.
 * relPath is repo-relative.
 */
function validateMetaFile(relPath) {
  const content = fs.readFileSync(repoRelative(relPath), 'utf8');
  const parsed = parseMetaYaml(content, relPath);
  const fields = parsed.fields;

  const usedInTests = fields.get('used_in_tests');
  const isTestReady = usedInTests === 'true' || usedInTests === true;

  // --- Fields shared by both tiers ---

  // 1. citation_boundary must exist and be non-empty
  if (!isNonEmptyString(fields.get('citation_boundary'))) {
    metaFail(relPath, 'missing or empty "citation_boundary"');
  }

  // 2. can_quote_directly must exist (boolean-like: true or false)
  const canQuote = fields.get('can_quote_directly');
  if (canQuote === undefined || canQuote === null) {
    metaFail(relPath, 'missing "can_quote_directly"');
  } else if (canQuote !== 'true' && canQuote !== 'false' && canQuote !== true && canQuote !== false) {
    metaFail(relPath, '"can_quote_directly" must be true or false, got: "' + canQuote + '"');
  }

  // 3. recommended_uses must exist and be non-empty
  if (!isPresent(fields.get('recommended_uses'))) {
    metaFail(relPath, 'missing or empty "recommended_uses"');
  }

  // 4. not_suitable_for must exist and be non-empty
  if (!isPresent(fields.get('not_suitable_for'))) {
    metaFail(relPath, 'missing or empty "not_suitable_for"');
  }

  // 5. At least one of source_url or provenance_note must be present
  const hasSourceUrl = isNonEmptyString(fields.get('source_url'));
  const hasProvenanceNote = isNonEmptyString(fields.get('provenance_note'));
  if (!hasSourceUrl && !hasProvenanceNote) {
    metaFail(relPath, 'must have at least one of "source_url" or "provenance_note"');
  }

  // 6. usable_for must exist and contain only valid skill names
  const usableFor = fields.get('usable_for');
  if (!isNonEmptyList(usableFor)) {
    metaFail(relPath, 'missing or empty "usable_for" (must be a non-empty list of skill names)');
  } else {
    for (const skill of usableFor) {
      if (!VALID_USABLE_FOR.includes(skill)) {
        metaFail(relPath, '"usable_for" contains invalid skill name: "' + skill + '" (valid: ' + VALID_USABLE_FOR.join(', ') + ')');
      }
    }
  }

  // --- Tier 2: used_in_tests: true (test-ready) requires full provenance ---

  if (isTestReady) {
    // source_url or non-empty provenance_note is required for test-ready samples
    if (!hasSourceUrl && !hasProvenanceNote) {
      metaFail(relPath, '"used_in_tests: true" requires non-empty "source_url" or non-empty "provenance_note"');
    }

    // access_date is required
    if (!isNonEmptyString(fields.get('access_date'))) {
      metaFail(relPath, '"used_in_tests: true" requires non-empty "access_date"');
    }

    // source_version or document_date must be present
    const hasSourceVersion = isNonEmptyString(fields.get('source_version'));
    const hasDocumentDate = isNonEmptyString(fields.get('document_date'));
    if (!hasSourceVersion && !hasDocumentDate) {
      metaFail(relPath, '"used_in_tests: true" requires non-empty "source_version" or "document_date"');
    }

    // linked_test_cases must be non-empty
    const linkedCases = fields.get('linked_test_cases');
    if (!isNonEmptyList(linkedCases)) {
      metaFail(relPath, '"used_in_tests: true" requires non-empty "linked_test_cases"');
    }
  }

  // --- linked_test_cases consistency (both tiers, if present) ---

  const linkedCases = fields.get('linked_test_cases');
  if (isNonEmptyList(linkedCases)) {
    for (const caseId of linkedCases) {
      if (typeof caseId !== 'string' || !/^case-\d{2}$/.test(caseId)) {
        metaFail(relPath, '"linked_test_cases" contains invalid case ID format: "' + caseId + '" (expected format: case-NN)');
        continue;
      }
      const caseFilename = caseIdToFilename(caseId);
      if (!caseFilename) {
        metaFail(relPath, '"linked_test_cases" references non-existent case: "' + caseId + '"');
      }
    }
  }

  // --- public_confirmed must be true ---
  const publicConfirmed = fields.get('public_confirmed');
  if (publicConfirmed !== 'true' && publicConfirmed !== true) {
    metaFail(relPath, '"public_confirmed" must be true');
  }
}

/**
 * Validate the SAMPLE_META_TEMPLATE.yaml has the required fields present
 * (as documentation, not as a real sample — we check field existence only,
 * not that values are filled in).
 */
function validateTemplate(relPath) {
  if (!fileExists(relPath)) {
    metaFail(relPath, 'template file does not exist');
    return;
  }
  const content = fs.readFileSync(repoRelative(relPath), 'utf8');
  const parsed = parseMetaYaml(content, relPath);
  const fields = parsed.fields;

  const requiredFieldKeys = [
    'title',
    'source_type',
    'source_name',
    'public_confirmed',
    'collection_reason',
    'quality_score',
    'usable_for',
    'recommended_uses',
    'not_suitable_for',
    'notes',
    'source_url',
    'access_date',
    'source_version',
    'document_date',
    'citation_boundary',
    'can_quote_directly',
    'provenance_note',
    'used_in_tests',
    'linked_test_cases',
  ];

  for (const key of requiredFieldKeys) {
    if (!fields.has(key)) {
      metaWarn(relPath, 'template missing documented field: "' + key + '"');
    }
  }
}

// ---------------------------------------------------------------------------
// U7: Case/expected pairing validation
// ---------------------------------------------------------------------------

/**
 * Extract the case number from a filename like "case-01-policy-brief-basic.md".
 * Returns "case-01" or null.
 */
function extractCaseId(filename) {
  var match = filename.match(/^(case-\d{2})-/);
  return match ? match[1] : null;
}

/**
 * Extract the case number from an expected filename like "case-01.expected.md".
 * Returns "case-01" or null.
 */
function extractExpectedCaseId(filename) {
  var match = filename.match(/^(case-\d{2})\.expected\.md$/);
  return match ? match[1] : null;
}

/**
 * Check bidirectional case/expected pairing:
 * - Every case-NN-*.md in cases/ must have a corresponding case-NN.expected.md in expected/
 * - Every case-NN.expected.md in expected/ must have a corresponding case-NN-*.md in cases/
 */
function validateCaseExpectedPairing() {
  var casesAbs = repoRelative(CASES_DIR);
  var expectedAbs = repoRelative(EXPECTED_DIR);

  if (!fs.existsSync(casesAbs)) {
    caseFail(CASES_DIR, 'cases directory does not exist');
    return;
  }
  if (!fs.existsSync(expectedAbs)) {
    caseFail(EXPECTED_DIR, 'expected directory does not exist');
    return;
  }

  var caseFiles = fs.readdirSync(casesAbs).filter(function (f) { return f.endsWith('.md'); });
  var expectedFiles = fs.readdirSync(expectedAbs).filter(function (f) { return f.endsWith('.md'); });

  // Build sets of case IDs
  var caseIds = new Set();
  for (var _i = 0; _i < caseFiles.length; _i++) {
    var cf = caseFiles[_i];
    var id = extractCaseId(cf);
    if (id) {
      caseIds.add(id);
    }
  }

  var expectedIds = new Set();
  for (var _j = 0; _j < expectedFiles.length; _j++) {
    var ef = expectedFiles[_j];
    var eid = extractExpectedCaseId(ef);
    if (eid) {
      expectedIds.add(eid);
    }
  }

  // Case without expected
  caseIds.forEach(function (caseId) {
    if (!expectedIds.has(caseId)) {
      caseFail(CASES_DIR + '/' + caseId, 'case file exists but missing corresponding expected file: ' + EXPECTED_DIR + '/' + caseId + '.expected.md');
    }
  });

  // Expected without case
  expectedIds.forEach(function (caseId) {
    if (!caseIds.has(caseId)) {
      caseFail(EXPECTED_DIR + '/' + caseId + '.expected.md', 'expected file exists but missing corresponding case file in ' + CASES_DIR + '/');
    }
  });

  console.log('Checked %d case(s), %d expected file(s).', caseIds.size, expectedIds.size);
}

// ---------------------------------------------------------------------------
// U7: EVAL_REVIEW_TEMPLATE existence check
// ---------------------------------------------------------------------------

function validateEvalReviewTemplate() {
  if (!fileExists(EVAL_REVIEW_TEMPLATE)) {
    caseFail(EVAL_REVIEW_TEMPLATE, 'required eval review template does not exist');
    return;
  }

  var content = fs.readFileSync(repoRelative(EVAL_REVIEW_TEMPLATE), 'utf8');

  // Required headings / substrings — loose matching
  var requiredSections = [
    { pattern: /Case\s*ID/i,                          label: 'Case ID' },
    { pattern: /Target\s*Skill/i,                      label: 'Target Skill' },
    { pattern: /Input\s*Source/i,                      label: 'Input Source' },
    { pattern: /Output\s*Location|Transcript\s*Ref/i,  label: 'Output Location / Transcript Reference' },
    { pattern: /Reviewer/i,                            label: 'Reviewer' },
    { pattern: /Review\s*Date/i,                       label: 'Review Date' },
    { pattern: /Structure\s*(PASS|FAIL|评审)/i,        label: 'Structure PASS/FAIL' },
    { pattern: /Evidence\s*Boundary/i,                 label: 'Evidence Boundary PASS/FAIL' },
    { pattern: /Style\s*Boundary/i,                    label: 'Style Boundary PASS/FAIL' },
    { pattern: /高?风险|High-Risk\s*Error/i,           label: 'High-Risk Errors Triggered' },
    { pattern: /最终|Final\s*(PASS|FAIL|结论)/i,       label: 'Final PASS/FAIL' },
    { pattern: /^#+\s*Notes\b/mi,                      label: 'Notes' },
    { pattern: /Required\s*Follow-?up|跟进/i,          label: 'Required Follow-up' },
  ];

  for (var i = 0; i < requiredSections.length; i++) {
    var section = requiredSections[i];
    if (!section.pattern.test(content)) {
      caseFail(EVAL_REVIEW_TEMPLATE, 'missing required section/field: ' + section.label);
    }
  }

  console.log('EVAL_REVIEW_TEMPLATE.md validated (existence + required sections).');
}

// ---------------------------------------------------------------------------
// U7: Adversarial validation
// ---------------------------------------------------------------------------

// Patterns that suggest fake source/citation claims in adversarial files.
// Narrow and deterministic: only flag clear red flags.
var FAKE_CITATION_PATTERNS = [
  /https?:\/\//,               // URLs — adversarial prompts should not reference real URLs
  /来源[：:]\s*某/,             // "来源：某监管文件" etc. — vague fake source attribution
  /来源[：:]\s*内部/,           // "来源：内部文件" — fake internal source claims
];

// Required section headers in adversarial files.
var REQUIRED_ADV_SECTIONS = [
  { header: '## Target Skill',   alt: '## Target Skill / Routing Path',   label: 'target skill or routing path' },
  { header: '## Fail-Fast Criteria',                                      label: 'explicit pass/fail criteria' },
  { header: '## Synthetic User Prompt',                                   label: 'synthetic prompt / input boundary' },
  { header: '## Expected Safe Behavior',                                  label: 'expected safe behavior' },
];

/**
 * Check whether content contains a required section header, using
 * substring matching to handle variations in header text.
 */
function hasSectionHeader(content, header, alt) {
  if (content.includes(header)) return true;
  if (alt && content.includes(alt)) return true;
  return false;
}

/**
 * Validate a single adversarial file.
 */
function validateAdversarialFile(relPath) {
  var content = fs.readFileSync(repoRelative(relPath), 'utf8');

  // Check required sections
  for (var _k = 0; _k < REQUIRED_ADV_SECTIONS.length; _k++) {
    var section = REQUIRED_ADV_SECTIONS[_k];
    if (!hasSectionHeader(content, section.header, section.alt)) {
      caseFail(relPath, 'missing required section: ' + section.label + ' (expected header: "' + section.header + '")');
    }
  }

  // Check for fake source/citation patterns
  for (var _l = 0; _l < FAKE_CITATION_PATTERNS.length; _l++) {
    var pattern = FAKE_CITATION_PATTERNS[_l];
    var match = pattern.exec(content);
    if (match) {
      caseFail(relPath, 'contains likely fake source/citation pattern: "' + match[0] + '" (adversarial files must not include fabricated source references)');
    }
  }
}

/**
 * Validate the adversarial directory structure and all adversarial files.
 */
function validateAdversarial() {
  var advAbs = repoRelative(ADVERSARIAL_DIR);

  if (!fs.existsSync(advAbs)) {
    caseFail(ADVERSARIAL_DIR, 'adversarial directory does not exist');
    return;
  }

  var advFiles = fs.readdirSync(advAbs).filter(function (f) {
    return f.startsWith('adv-') && f.endsWith('.md');
  });

  if (advFiles.length === 0) {
    caseFail(ADVERSARIAL_DIR, 'no adversarial files (adv-*.md) found');
    return;
  }

  for (var _m = 0; _m < advFiles.length; _m++) {
    var af = advFiles[_m];
    validateAdversarialFile(ADVERSARIAL_DIR + '/' + af);
  }

  console.log('Checked %d adversarial file(s).', advFiles.length);

  // Verify all five adversarial risk types are present (adv-01 through adv-05)
  var requiredAdvIds = ['adv-01', 'adv-02', 'adv-03', 'adv-04', 'adv-05'];
  for (var _n = 0; _n < requiredAdvIds.length; _n++) {
    var requiredId = requiredAdvIds[_n];
    var found = false;
    for (var _o = 0; _o < advFiles.length; _o++) {
      if (advFiles[_o].startsWith(requiredId + '-')) {
        found = true;
        break;
      }
    }
    if (!found) {
      caseFail(ADVERSARIAL_DIR, 'missing required adversarial file: ' + requiredId + '-*.md');
    }
  }
}

// ---------------------------------------------------------------------------
// U6: Reverse markdown path validation — paths cited in case/expected files
// must point to existing files in the repo.
// ---------------------------------------------------------------------------

/**
 * Extract repo-relative paths from markdown content.
 * Matches backtick-enclosed paths and bare paths starting with known prefixes.
 */
function extractPathsFromMarkdown(content, mdRelPath) {
  var paths = [];
  var prefixes = ['examples/', 'test-cases/inputs/'];

  // Extract backtick-enclosed paths (most common pattern in these files)
  var backtickRegex = /`([^`\s]+)`/g;
  var btMatch;
  while ((btMatch = backtickRegex.exec(content)) !== null) {
    var candidate = btMatch[1];
    for (var p = 0; p < prefixes.length; p++) {
      if (candidate.startsWith(prefixes[p])) {
        // Strip any trailing punctuation or fragment
        var clean = candidate.replace(/[,;:。））》]+$/, '');
        paths.push(clean);
        break;
      }
    }
  }

  return paths;
}

/**
 * Validate that paths referenced in case/expected markdown files actually exist.
 */
function validateMarkdownPathReferences() {
  var dirsToCheck = [CASES_DIR, EXPECTED_DIR];
  var checked = 0;

  for (var d = 0; d < dirsToCheck.length; d++) {
    var dir = dirsToCheck[d];
    var dirAbs = repoRelative(dir);
    if (!fs.existsSync(dirAbs)) continue;

    var mdFiles = fs.readdirSync(dirAbs).filter(function (f) { return f.endsWith('.md'); });
    for (var f = 0; f < mdFiles.length; f++) {
      var mdFile = mdFiles[f];
      var mdRelPath = dir + '/' + mdFile;
      var content = fs.readFileSync(repoRelative(mdRelPath), 'utf8');
      var refs = extractPathsFromMarkdown(content, mdRelPath);

      for (var r = 0; r < refs.length; r++) {
        var ref = refs[r];
        if (!fileExists(ref)) {
          caseFail(mdRelPath, 'references non-existent path: "' + ref + '"');
        }
      }
      checked++;
    }
  }

  console.log('Checked path references in %d markdown file(s).', checked);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('Validating example metadata, sample links, case/expected pairing, and adversarial readiness...\n');
console.log('Repository root: %s\n', REPO_ROOT);

// 1. Validate the template
console.log('--- Checking template ---');
validateTemplate(TEMPLATE_FILE);

// 2. Find and validate all .meta.yaml files under examples/
console.log('\n--- Checking example metadata ---');
const examplesDir = repoRelative('examples');
if (fs.existsSync(examplesDir)) {
  const metaFiles = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.meta.yaml') && entry.name !== 'SAMPLE_META_TEMPLATE.yaml') {
        metaFiles.push(path.relative(REPO_ROOT, fullPath));
      }
    }
  }
  walk(examplesDir);

  for (const mf of metaFiles) {
    validateMetaFile(mf);
  }

  console.log('Checked %d metadata file(s).', metaFiles.length);
} else {
  metaFail('(global)', 'examples/ directory does not exist');
}

// 3. U7: Case/expected pairing
console.log('\n--- Checking case/expected pairing ---');
validateCaseExpectedPairing();

// 4. U7: EVAL_REVIEW_TEMPLATE existence
console.log('\n--- Checking eval review template ---');
validateEvalReviewTemplate();

// 5. U7: Adversarial readiness
console.log('\n--- Checking adversarial readiness ---');
validateAdversarial();

// 6. U6: Reverse markdown path references
console.log('\n--- Checking markdown path references ---');
validateMarkdownPathReferences();

// Summary
console.log('\n---');
console.log('Metadata/link errors: %d, warnings: %d', metaErrorCount, metaWarningCount);
console.log('Case/adversarial errors: %d, warnings: %d', caseErrorCount, caseWarningCount);
console.log('Total: %d error(s), %d warning(s)', errorCount, warningCount);

if (errorCount > 0) {
  console.log('FAILED');
  process.exit(1);
} else {
  console.log('PASSED');
  process.exit(0);
}
