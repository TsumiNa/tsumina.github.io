---
description: "Use for every repository modification. Defines branch and pull-request decisions, reviewable change boundaries, and the version decision for this private Astro site."
name: "Branch and Pull Request Workflow"
applyTo: "**"
---

# Branch and Pull Request Workflow

Before editing files for a feature, fix, refactor, dependency update, content change, or repository-maintenance task, inspect the current branch and working-tree state.

## Branch decision order

Apply the first matching rule:

1. If the user explicitly asks to work on the current branch, to edit directly, or not to open a PR, follow that instruction.
2. If the current branch already has an open PR for the requested work, continue on that branch and update the existing PR. Do not open a duplicate PR.
3. If the current branch is ahead of the default branch and has no PR, open a PR for it before adding further related commits.
4. Otherwise, create a descriptive branch from an up-to-date default branch. Use the repository convention `codex/<short-description>` unless the user specifies another name.

Do not overwrite, discard, commit, or reformat unrelated user changes. If existing changes overlap the requested files and cannot be preserved safely, stop and ask the user how to proceed.

## Change and PR scope

- Keep each PR focused on one coherent outcome. Do not mix unrelated cleanup, content edits, dependency upgrades, and behavior changes.
- Prefer incremental changes that preserve a passing build and deployable static output.
- Keep mechanical moves or renames separate from semantic changes when practical. Update all path references in the same PR as a move so the repository is never left broken.
- A PR must be understandable, testable, and revertible on its own.
- Describe the user-visible effect, implementation scope, and verification commands in the PR body.
- Do not push, open, merge, close, or otherwise change a remote PR unless the user requested that remote action or it is an explicitly agreed part of the task.

## Code refactors and complex implementation changes

The planning rules in this section apply only to implementation and architecture work: Astro components and layouts, TypeScript, CSS/design tokens, Content Collection schemas, routing, i18n infrastructure, build-time integrations, scripts, tests, deployment configuration, and other executable or site-structural code.

They do **not** apply to author-owned article content. Adding, removing, translating, reorganizing, or revising Markdown/MDX prose, examples, citations, figures, or article sections does not require a `docs/plans` refactor plan, even when an article is long or touches multiple content files. Review those changes only under the Markdown/MDX review boundary in `implementation-and-tests.instructions.md`.

Plan code work before implementation when it crosses multiple implementation concerns such as content schema, routing, layouts, build-time integrations, deployment, and localization infrastructure, or when the code diff cannot be reviewed in one sitting.

Record an agreed multi-PR plan under `docs/plans/<change-slug>/` only when the **code or site architecture** genuinely needs multiple PRs. Include:

- `00-overview.md` with motivation, constraints, non-goals, alternatives, and ordered PRs;
- one file per PR with **Goal**, **Scope**, **Non-goals**, and **Acceptance** sections;
- concrete route, data-shape, component, or configuration examples when an interface changes.

Each planned PR must leave formatting, type/content checks, and the production build passing. Order migrations as **introduce → migrate → remove**. Process sequentially: review and merge the current PR before starting the next. Do not add temporary compatibility layers solely to make a poorly ordered split pass.

### Mixed code and article changes

When a request includes both implementation changes and article edits, classify and review the two parts separately:

- apply this section's planning and verification rules only to the code, schema, rendering, or infrastructure portion;
- apply the author-preserving Markdown/MDX review rules only to article prose and authored scientific/technical content;
- do not use a code refactor plan to prescribe changes to an article's thesis, structure, voice, terminology, examples, or conclusions;
- include article files in a code-refactor plan only when they must be updated as compatibility fixtures or usage sites for a changed technical interface, and limit the planned edits to the mechanically necessary syntax, imports, component props, paths, or frontmatter.

## Version decision

This repository is a private, static website package and currently has no release version in `package.json`. Do not invent or bump a package version for routine site, content, instruction, test, or tooling changes.

If the repository later adopts a documented release/versioning policy, follow that policy and record the version decision in the PR. Until then, PR descriptions may state `Version: none — private static site; no versioned package is released.` when a version line is useful, but no version line is required.

## Finishing a change

Before requesting review:

1. Inspect the final diff for unrelated or generated changes.
2. Run the checks required by `implementation-and-tests.instructions.md`.
3. Summarize the change and verification results accurately, including any check that could not be run.
4. If remote PR work was requested, check for an existing PR before creating one, and never create a second PR for the same branch.
