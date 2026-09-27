---
description: "Use before terminal work. Detects the active shell and standardizes safe pnpm, filesystem, and command practices for this Astro repository."
name: "Shell Environment and Repository Commands"
applyTo: "**"
---

# Shell Environment and Repository Commands

At the start of a work session, confirm the active shell before relying on shell-specific syntax:

```sh
echo $SHELL
```

If `$SHELL` is unset, inspect `$0`. Record the result for the session; do not assume Bash.

## Shell-specific behavior

- `fish` does not support POSIX heredocs or all POSIX variable/loop syntax. Do not use Bash/Zsh heredocs in Fish.
- `bash`, `zsh`, and POSIX `sh` support heredocs, but prefer the editor or patch tool for file creation and precise edits.
- Do not launch a different shell merely to bypass an avoidable syntax issue. When a command fails to parse, confirm the active shell before retrying.
- Quote paths and arguments that may contain spaces, brackets, glob characters, or route parameters such as `[lang]` and `[...slug]`.

## Repository command rules

- Use `pnpm`, matching the `packageManager` field and `pnpm-lock.yaml`. Do not use npm, Yarn, or Bun for installs or lockfile updates.
- Run repository scripts through `pnpm <script>`; use `pnpm exec <tool>` for installed binaries that have no script.
- Do not install global packages to complete repository work.
- Before adding or updating a dependency, inspect `package.json` and the lockfile. Keep dependency and lockfile changes together.
- Prefer `rg` and `rg --files` for searching. Prefer patch/editor tools over shell redirection for writing files.
- Avoid commands that rewrite broad file sets unless the requested task requires it. Inspect the diff after formatters or generators run.
- Do not delete build artifacts, caches, branches, or user files unless the task requires it and the exact target has been verified.
- Never print secrets, tokens, environment files, or credential-bearing command output. A normal `pnpm build` must not require runtime secrets.

## Common commands

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm format
pnpm check
pnpm build
pnpm sync:orcid
```

Use `pnpm sync:orcid` only when publication synchronization is in scope and the required upstream access is available. Generated ORCID data must remain separate from manual overrides and must be reviewed before inclusion.
