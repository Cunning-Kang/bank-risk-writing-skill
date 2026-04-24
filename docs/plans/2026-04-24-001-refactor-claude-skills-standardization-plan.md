---
title: refactor: Standardize Claude Code skill pack
type: refactor
status: active
date: 2026-04-24
---

# refactor: Standardize Claude Code skill pack

## Overview

This plan converts the current Markdown prompt pack into a Claude Code Skills-compatible skill pack while preserving the existing bank risk and policy writing behavior. The work focuses on directory structure, skill metadata, resource references, routing documentation, and validation so future agents can implement and review changes without reinterpreting the prior audit.

---

## Problem Frame

The repository currently has four strong skill-like Markdown files under `skills/*.md`, but Claude Code Skills expect each skill to live in a directory with a root `SKILL.md`. The existing files also use `tools` in frontmatter rather than the current `allowed-tools` field, and their descriptions are human-readable but not optimized for automatic skill triggering. Testing exists as a manual acceptance framework, but `package.json` still has a placeholder failing test command and there is no automated structure validation.

The goal is to standardize packaging and validation without weakening the project's strict factuality boundary: outputs must remain based only on public materials or user-provided content, with unsupported claims marked as `待核实`, `需补充来源`, or `需结合正式文件进一步确认`.

---

## Requirements Trace

- R1. Convert the four existing skill files into Claude Code Skills-compatible directory form using `skills/<skill-name>/SKILL.md`.
- R2. Replace non-standard `tools` frontmatter with standard `allowed-tools` frontmatter and add trigger-oriented `description` / `when_to_use` metadata.
- R3. Preserve the current writing behavior, especially factuality, citation, uncertainty, confidentiality, and formal banking/policy tone boundaries.
- R4. Make shared resources and references portable enough for project-local use and future installation into Claude Code skill locations.
- R5. Update repository documentation and task routing so humans and agents know how to use, review, and extend the standardized skill pack.
- R6. Add automated structural validation so future changes can detect malformed skill directories, bad frontmatter, missing metadata, and stale README references.
- R7. Keep regression testing grounded in public or explicitly provided materials; do not introduce standard answers that fabricate content.
- R8. Provide clear rollback and verification paths for the migration.

---

## Scope Boundaries

- Do not change the core semantics of `policy-brief`, `formal-polish`, `report-outline`, or `ppt-outline` beyond metadata and portability edits required by the Claude Code Skills format.
- Do not add new domain capabilities, new regulatory interpretations, or simulated internal bank procedures.
- Do not create fake citations, sample facts, or standard answers.
- Do not install skills into a user-level directory as part of this repository change; this plan covers repo contents only.
- Do not introduce a large testing framework unless implementation shows the lightweight Node validation script is insufficient.

### Deferred to Follow-Up Work

- Add more real public golden samples: future iteration after the structural migration is stable.
- Build model-output quality scoring automation: future iteration; current plan only adds structural validation and strengthens manual regression workflow.
- Package or publish the skill pack externally: separate release/distribution plan after local format is stable.

---

## Context & Research

### Relevant Code and Patterns

- `skills/policy-brief.md`, `skills/formal-polish.md`, `skills/report-outline.md`, `skills/ppt-outline.md`: current skill-like files with consistent sections: `Purpose`, `When to Use`, `Required Inputs`, `Working Method`, `Default Output Structure`, `Hard Rules`, `Final Self-Check`.
- `rules/*.md`: project-wide factuality, citation, confidentiality, writing principles, and tone constraints.
- `glossary/*.yml`: financial/regulatory terminology and expression preferences.
- `templates/*.md`: output templates for policy analysis, risk reports, executive summaries, and PPT outlines.
- `prompts/task-routing.md`: current routing guidance still points to `skills/*.md` paths and needs path updates.
- `test-cases/TEST_PLAN.md` and `test-cases/expected/*.expected.md`: existing manual regression framework and acceptance templates.
- `package.json`: currently has a placeholder failing `test` script and no validation entry point.
- `README.md`: documents the old flat `skills/*.md` layout.
- `CLAUDE.md`: repository-level constraints are authoritative for factuality and public-material boundaries.

### Institutional Learnings

- `test-cases/TEST_PLAN.md`: expected files should remain executable acceptance standards, not standard answers; useful checks include structure, thresholds, banned behavior, and high-risk triggers.
- `docs/public-sample-collection-spec.md`: samples must be public, traceable, representative, structurally useful, and must not simulate internal institutional口径.

### External References

- Claude Code Skills standard, as verified during audit: each skill should be a directory containing `SKILL.md`; `description` helps automatic triggering; `when_to_use` can supplement trigger context; `allowed-tools` grants tool permissions; bundled resources should be referenced with relative paths or `${CLAUDE_SKILL_DIR}` for scripts.

---

## Key Technical Decisions

- Use directory migration instead of adding wrapper files around the existing flat Markdown files: this aligns with Claude Code's skill discovery model and removes ambiguity about the canonical skill entry point.
- Keep shared domain rules in existing `rules/`, `glossary/`, and `templates/` directories for this iteration: copying every dependency into each skill would create drift and unnecessary duplication.
- Add explicit relative reference sections in each `SKILL.md`: this keeps current repo-local resources discoverable while making future packaging dependencies visible.
- Use a lightweight CommonJS validation script rather than introducing a test framework: the repository already has Node metadata but no application runtime, so structural checks should stay simple.
- Use YAML list syntax for `allowed-tools` so each tool is unambiguous and validator-enforceable.
- Treat manual expected files as acceptance criteria, not golden answers: this preserves the project's factuality boundary and avoids embedding fabricated model outputs.

---

## Open Questions

### Resolved During Planning

- Should this be a feature or refactor? Resolution: `refactor`, because the intended user-facing writing behavior should remain stable while packaging and validation change.
- Should shared resources be copied inside every skill directory now? Resolution: no; use explicit relative references first, then consider packaging duplication only when distribution requires it.
- Should test automation judge generated writing quality now? Resolution: no; this plan adds structural validation and keeps writing quality review in the existing manual acceptance framework.

### Deferred to Implementation

- Exact wording of each `description` and `when_to_use`: implementation should start from the audit suggestions but tune for brevity and trigger precision while preserving scope boundaries.
- Whether old `skills/*.md` files are deleted or temporarily left as migration notes: implementation should prefer deletion after content is moved, unless review finds a documentation transition need.
- Final validator rule thresholds: implementation can adjust exact warnings/errors after inspecting frontmatter parsing behavior and current file contents.

---

## Output Structure

    skills/
      policy-brief/
        SKILL.md
      formal-polish/
        SKILL.md
      report-outline/
        SKILL.md
      ppt-outline/
        SKILL.md
    scripts/
      validate-skills.js
    docs/
      plans/
        2026-04-24-001-refactor-claude-skills-standardization-plan.md

This tree shows the expected new structure. Existing `rules/`, `glossary/`, `templates/`, `prompts/`, `examples/`, and `test-cases/` remain in place.

---

## Implementation Units

- [ ] U1. **Migrate skill files to Claude Code directory structure**

**Goal:** Move the four current flat skill Markdown files into `skills/<skill-name>/SKILL.md` so the repository matches Claude Code Skills layout expectations.

**Requirements:** R1, R3, R8

**Dependencies:** None

**Files:**
- Create: `skills/policy-brief/SKILL.md`
- Create: `skills/formal-polish/SKILL.md`
- Create: `skills/report-outline/SKILL.md`
- Create: `skills/ppt-outline/SKILL.md`
- Remove or retire: `skills/policy-brief.md`
- Remove or retire: `skills/formal-polish.md`
- Remove or retire: `skills/report-outline.md`
- Remove or retire: `skills/ppt-outline.md`
- Test: `test-cases/TEST_PLAN.md`

**Approach:**
- Move content without changing the core instruction sections or domain behavior.
- Preserve each skill's existing `Purpose`, `Working Method`, `Default Output Structure`, `Hard Rules`, and `Final Self-Check` unless later units make metadata/resource-reference edits.
- Prefer a clean canonical location over duplicate old/new files, because duplicate skill instructions are likely to drift.

**Patterns to follow:**
- Existing section organization in `skills/policy-brief.md` and peer files.
- Existing kebab-case naming convention in `skills/`, `templates/`, and `test-cases/`.

**Test scenarios:**
- Happy path: all four expected directories exist and each contains exactly one `SKILL.md` entry file.
- Edge case: no stale flat `skills/*.md` skill files remain unless explicitly documented as non-canonical migration notes.
- Integration: `test-cases/TEST_PLAN.md` references the new skill paths and still maps 12 cases across the same four skill names.

**Verification:**
- Repository has one canonical entry file per skill.
- No writing rule is lost during migration when comparing old and new skill content.
- Existing test case mapping still covers `policy-brief`, `formal-polish`, `report-outline`, and `ppt-outline`.

---

- [ ] U2. **Standardize skill frontmatter and trigger metadata**

**Goal:** Replace non-standard metadata with Claude Code Skills-compatible fields and improve automatic trigger descriptions without expanding scope.

**Requirements:** R2, R3, R5

**Dependencies:** U1

**Files:**
- Modify: `skills/policy-brief/SKILL.md`
- Modify: `skills/formal-polish/SKILL.md`
- Modify: `skills/report-outline/SKILL.md`
- Modify: `skills/ppt-outline/SKILL.md`
- Test: `scripts/validate-skills.js`

**Approach:**
- Replace `tools` with `allowed-tools`.
- Use YAML list syntax for `allowed-tools` unless implementation finds a concrete reason to add or remove tools:
  - `Read`
  - `Grep`
  - `Glob`
- Add `when_to_use` to capture trigger context and negative boundaries.
- Keep `name` aligned with directory names and limited to lowercase letters, digits, and hyphens.
- Write descriptions around user intent phrases such as summarize, polish, outline, PPT, policy, regulatory, bank risk, formal reporting, and Chinese equivalents.

**Patterns to follow:**
- Existing concise YAML frontmatter style in current skill files.
- Audit recommendation that `description` should front-load trigger phrases and `when_to_use` should clarify boundaries.

**Test scenarios:**
- Happy path: each `SKILL.md` has valid YAML frontmatter containing `name`, `description`, `when_to_use`, and `allowed-tools`.
- Edge case: validator fails if any skill still uses `tools`.
- Edge case: validator fails if `allowed-tools` is missing, empty, or not a YAML list containing explicit tool names.
- Edge case: validator fails if `name` does not match the directory name or contains invalid characters.
- Error path: validator reports a clear file path and field name for malformed frontmatter.
- Integration: descriptions remain specific enough that `policy-brief` and `ppt-outline` do not both claim the same primary trigger without routing guidance.

**Verification:**
- Metadata is standards-aligned and machine-checkable.
- Trigger text improves auto-loading while preserving the public-material and non-internal-policy boundary.

---

- [ ] U3. **Make shared resource references explicit and portable**

**Goal:** Ensure each skill points to the rules, glossary, templates, and checklists it depends on using repo-relative references that reviewers and future packagers can audit.

**Requirements:** R3, R4, R5

**Dependencies:** U1, U2

**Files:**
- Modify: `skills/policy-brief/SKILL.md`
- Modify: `skills/formal-polish/SKILL.md`
- Modify: `skills/report-outline/SKILL.md`
- Modify: `skills/ppt-outline/SKILL.md`
- Test: `scripts/validate-skills.js`

**Approach:**
- Add a short `Additional Resources` or equivalent section to each `SKILL.md` that lists the repo-local rules and assets the skill expects.
- Use a simple validator-readable convention: resource paths appear as markdown list items with the path wrapped in backticks under `Additional Resources`.
- Avoid copying shared rule files into every skill in this iteration.
- Keep references repo-relative and do not use absolute paths.
- If a resource is optional guidance rather than mandatory, label it as such so implementers do not treat expression preferences as fact sources.

**Patterns to follow:**
- `README.md` directory descriptions.
- Existing references to `glossary/preferred-expressions.yml` inside the current skills.
- Project boundary rules in `CLAUDE.md`.

**Test scenarios:**
- Happy path: each listed resource path exists in the repository.
- Edge case: validator flags missing resource links in `SKILL.md` files.
- Error path: no skill references an absolute local path or user-specific directory.
- Integration: resource references do not contradict the priority of `CLAUDE.md` factuality and confidentiality rules.

**Verification:**
- Reviewers can see which shared files shape each skill.
- Future packagers can identify dependencies without reading the entire repository.
- No duplicated shared rule content creates a second source of truth.

---

- [ ] U4. **Update routing and repository documentation**

**Goal:** Update human- and agent-facing documentation to describe the standardized skill layout, routing decisions, installation expectations, and non-goals.

**Requirements:** R5, R7, R8

**Dependencies:** U1, U2, U3

**Files:**
- Modify: `README.md`
- Modify: `prompts/task-routing.md`
- Modify: `test-cases/notes.md`
- Modify: `test-cases/TEST_PLAN.md`
- Modify: `CLAUDE.md` only if the existing project instructions need path updates, not policy changes
- Test: `test-cases/TEST_PLAN.md`

**Approach:**
- Replace flat `skills/*.md` examples with `skills/<skill-name>/SKILL.md`.
- Add a short explanation that this repo is a skill pack source tree, not an internal policy emulator.
- Clarify routing collisions: policy understanding routes to `policy-brief`; language polishing routes to `formal-polish`; report structure routes to `report-outline`; slide-by-slide transformation routes to `ppt-outline`; combined policy-to-PPT workflows should preserve fact boundaries first, then transform structure.
- Document that `expected` files are acceptance criteria rather than standard answers.
- Keep all documentation in Chinese where it addresses the project user's writing workflow; keep technical identifiers unchanged.

**Patterns to follow:**
- Current README style and directory tree format.
- `prompts/task-routing.md` simple bullet routing format.
- `test-cases/TEST_PLAN.md` existing manual scoring structure.

**Test scenarios:**
- Happy path: README directory tree matches the actual migrated `skills/<name>/SKILL.md` layout.
- Edge case: no documentation points to removed flat skill paths.
- Integration: routing documentation resolves overlapping tasks without changing skill semantics.
- Integration: testing documentation still maps 12 test cases to the four skill names.

**Verification:**
- A new agent can identify the canonical skill entry file for each capability from README alone.
- A reviewer can understand what changed, what did not change, and how to run or review validation.

---

- [ ] U5. **Add automated skill structure validation**

**Goal:** Provide a lightweight automated check that prevents future regressions in skill directory structure, frontmatter, resource references, and documentation pointers.

**Requirements:** R2, R4, R6, R8

**Dependencies:** U1, U2, U3, U4

**Files:**
- Create: `scripts/validate-skills.js`
- Modify: `package.json`
- Test: `scripts/validate-skills.js`
- Test: `README.md`
- Test: `prompts/task-routing.md`

**Approach:**
- Implement a Node/CommonJS validation script consistent with the current `package.json` module type.
- Validate only repository structure and metadata; do not call an LLM or judge prose quality.
- Use a minimal local parser for the limited frontmatter subset; do not add a new YAML parsing dependency for this migration.
- Check for required skill directories, `SKILL.md` presence, YAML frontmatter boundaries, required metadata fields, invalid `tools` usage, valid skill names, `allowed-tools` as a YAML list of explicit tool names, validator-readable `Additional Resources` paths, and stale flat-skill path references in documentation.
- Update `package.json` so the repository test script runs the structural validator.

**Patterns to follow:**
- Current `package.json` uses CommonJS.
- Repository naming is kebab-case and file-path based.
- Test plan emphasizes structural checks and high-risk triggers rather than standard answers.

**Test scenarios:**
- Happy path: validator passes on the migrated repository.
- Error path: validator fails with a clear message when a required `SKILL.md` is missing.
- Error path: validator fails when frontmatter contains `tools` instead of `allowed-tools`.
- Error path: validator fails when a resource path listed by a skill does not exist.
- Edge case: validator treats non-skill Markdown files under `rules/`, `templates/`, and `test-cases/` as out of scope.
- Integration: `package.json` test entry point invokes the validator and no longer contains the placeholder failing command.

**Verification:**
- Automated validation catches the structural issues identified in the audit.
- The validator has deterministic pass/fail behavior without needing network access or model output.

---

- [ ] U6. **Strengthen regression verification workflow without fabricating outputs**

**Goal:** Align the manual regression workflow with the new skill layout and make it clear how agents should verify behavior after structural migration.

**Requirements:** R3, R6, R7

**Dependencies:** U4, U5

**Files:**
- Modify: `test-cases/TEST_PLAN.md`
- Modify: `test-cases/notes.md`
- Modify: `test-cases/expected/case-01.expected.md` through `test-cases/expected/case-12.expected.md` only if path references or skill names require updates
- Test: `test-cases/expected/case-01.expected.md`
- Test: `test-cases/expected/case-12.expected.md`

**Approach:**
- Keep the current 12-case coverage model.
- Add verification guidance that agents should first run structural validation, then perform targeted manual review against expected templates for any skill whose instructions changed.
- Do not add fabricated standard answers.
- If expected files already contain adequate acceptance criteria, limit changes to path/layout references.
- Preserve high-risk failure triggers from `test-cases/TEST_PLAN.md`: fabricated facts, fabricated policy口径, over-inference, style drift, empty recommendations, and missing uncertainty markers.

**Patterns to follow:**
- `test-cases/TEST_PLAN.md` guidance that expected files should define executable acceptance standards rather than standard answers.
- `docs/public-sample-collection-spec.md` public-source and traceability requirements.

**Test scenarios:**
- Happy path: test documentation explains how to validate a migrated skill without requiring a standard answer.
- Edge case: insufficient-input cases still require explicit boundary marking and conservative output.
- Error path: high-risk errors remain fail-fast conditions in the acceptance workflow.
- Integration: structural validation and manual expected-file review are described as complementary, not interchangeable.

**Verification:**
- Test documentation remains faithful to the public-material boundary.
- Reviewers can distinguish packaging regressions from writing-quality regressions.

---

## System-Wide Impact

- **Interaction graph:** Skill entry points move from flat Markdown files to `SKILL.md` files; README, routing, and tests must all point to the same canonical paths.
- **Error propagation:** Validation failures should name the exact file and field/path that caused the problem so agents can fix metadata without guessing.
- **State lifecycle risks:** During migration, duplicate old and new skill files could create drift; prefer one canonical location and update references in the same change.
- **API surface parity:** The four skill names should remain unchanged: `policy-brief`, `formal-polish`, `report-outline`, `ppt-outline`.
- **Integration coverage:** Automated validation proves structure; manual expected-file review proves the writing constraints were not weakened.
- **Unchanged invariants:** The project remains limited to public or user-provided materials and must not simulate internal institutional views, internal approval logic, or undisclosed standards.

---

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Skill behavior changes accidentally during migration | Move content first, then make metadata/reference edits in small units; compare old and new instruction sections before deleting old files. |
| Duplicate old and new skill files drift | Prefer deleting or clearly retiring flat `skills/*.md` after migration; update all repo references in the same implementation sequence. |
| Auto-trigger descriptions become too broad | Include negative boundaries in `when_to_use`; preserve task routing guidance for overlapping cases. |
| Shared references are not portable outside this repo | Make dependencies explicit in each `SKILL.md`; defer full packaging duplication until distribution is planned. |
| Validator becomes too brittle | Limit checks to structural invariants, required metadata, path existence, and stale references; do not validate subjective writing quality. |
| Test workflow gives false confidence | Document that structural validation is necessary but not sufficient; manual review against expected files remains required for writing behavior changes. |
| Public-material boundary weakens while adding examples or docs | Do not add new sample content in this migration; any future samples must follow `docs/public-sample-collection-spec.md`. |

---

## Dependencies / Prerequisites

- Current skill content in `skills/*.md` must be treated as the source of truth for behavior during migration.
- Claude Code Skills format requires directory-based `SKILL.md` entry files and standard frontmatter fields.
- The repository's Node/CommonJS setup in `package.json` is sufficient for a lightweight validator.
- No external service, network access, or user-level skill installation is required for this plan.

---

## Rollback Plan

- Revert the migration by restoring the flat `skills/*.md` files from version control and removing the new `skills/<skill-name>/` directories.
- Revert README, routing, and test documentation path changes to the previous flat layout.
- Restore the prior `package.json` test script only if the validator itself is the source of breakage; otherwise prefer fixing validation rules.
- Because this plan only changes repository files and adds validation, rollback is a normal git revert with no data migration, external state cleanup, or production impact.

---

## Documentation / Operational Notes

- README should state whether this repository is intended to be used directly as a project skill pack source tree or copied into a Claude Code skill directory later.
- If future installation instructions are added, they must not rely on absolute local paths.
- The migration should not imply that the skills produce official bank views or validated regulatory conclusions.
- Any future public examples should include provenance metadata and follow `docs/public-sample-collection-spec.md`.

---

## Verification Strategy

- Structural validation: the new validator confirms skill directories, frontmatter, metadata fields, resource paths, and stale documentation references.
- Documentation validation: README, routing, and test plan references all point to `skills/<skill-name>/SKILL.md`.
- Behavioral preservation review: compare migrated `SKILL.md` bodies against prior skill content to ensure domain rules and output structures remain intact.
- Regression review: use relevant `test-cases/expected/*.expected.md` files for any skill whose instruction body changed beyond metadata/path references.
- Negative checks: confirm no fabricated sample answers, fake citations, internal-bank口径, or absolute local paths were introduced.

---

## Sources & References

- Related code: `skills/policy-brief.md`
- Related code: `skills/formal-polish.md`
- Related code: `skills/report-outline.md`
- Related code: `skills/ppt-outline.md`
- Related code: `README.md`
- Related code: `prompts/task-routing.md`
- Related code: `test-cases/TEST_PLAN.md`
- Related code: `docs/public-sample-collection-spec.md`
