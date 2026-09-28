---
description: 'Use before terminal work. Detects the active shell and standardizes safe pnpm, filesystem, and command practices for this Astro repository.'
name: 'Shell Environment and Repository Commands'
applyTo: '**'
---

# Shell Environment and Repository Commands

At the start of a work session, identify the interpreter from execution-environment metadata or the command runner's configured shell before relying on shell-specific syntax. Do not make the initial probe depend on shell expansions such as `$$`, `$0`, `$fish_pid`, command substitution, or conditional syntax: those expressions must be parsed before the interpreter has been identified and are not portable across the supported shells.

If the execution environment does not expose the interpreter, use an explicitly selected shell through the command runner when available. Otherwise keep commands to literal, shell-neutral program invocations until the interpreter is known. Treat `$SHELL` only as information about the user's configured login shell; it may not identify the interpreter executing the current command. Record the running interpreter for the session and do not assume Bash.

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

Use `pnpm sync:orcid` only when publication synchronization is in scope and the required upstream access is available. Generated ORCID data must remain separate from manual overrides. The scheduled `sync-orcid.yml` workflow commits refreshed data to `main` automatically; when running the sync manually, review the generated diff before committing it.
