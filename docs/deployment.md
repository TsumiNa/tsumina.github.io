# Synchronized GitHub Pages and Cloudflare deployment

GitHub Pages and Cloudflare Workers deploy independently from the same Git commit:

- GitHub Actions builds the Astro and MDX site and deploys `dist/` to GitHub Pages.
- Cloudflare Workers Builds watches the repository, runs the same locked pnpm build, and deploys `dist/` as Worker static assets.

This keeps Cloudflare credentials and configuration out of GitHub Actions. The two providers do not share a build artifact, but both derive their application dependencies from the repository:

- `.node-version` selects the current Node.js LTS major;
- `pnpm-lock.yaml` selects the exact application dependency graph;
- the Wrangler dependency in `package.json` makes Cloudflare use the repository-managed Wrangler release.

When Node.js or Wrangler is upgraded, update the repository and lockfile. No matching version edit is required in the Cloudflare dashboard. Cloudflare may update its supported pnpm installation independently; the frozen lockfile remains the shared dependency source of truth.

## GitHub Pages setup

1. Open the repository's **Settings → Pages** page.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Do not select a branch-based Jekyll source. The custom workflow builds Astro and deploys the generated artifact.

Until the source is changed to GitHub Actions, GitHub may continue starting its legacy `pages build and deployment` Jekyll workflow against the Astro source tree.

## Cloudflare Workers Builds setup

The repository contains `wrangler.jsonc` for an assets-only Worker named `know`. Static files are served from `dist/`; unmatched routes return 404 rather than falling back to an SPA shell.

1. In Cloudflare, open **Workers & Pages → Create application**.
2. Under **Import a repository**, connect the GitHub account and select `TsumiNa/tsumina.github.io`.
3. Set the Worker name to `know`. It must match the `name` in `wrangler.jsonc`.
4. Use these production build settings:
   - Production branch: `main`
   - Root directory: `/`
   - Build command: `pnpm build`
   - Deploy command: `pnpm run deploy:cloudflare`
   - Preview command: `pnpm run preview:cloudflare`
5. Do not add `SKIP_DEPENDENCY_INSTALL`; Workers Builds must install the locked dependencies before the build command runs.
6. Enable **Build cache** under the Worker's build settings.
7. Enable preview builds if branch and pull-request preview URLs are desired.
8. Save and deploy. Cloudflare automatically manages the build token for the connected Worker; no Cloudflare secret or variable is needed in GitHub Actions.

Cloudflare production and GitHub Pages deployments are triggered independently by the same push to `main`. A failure on one provider does not roll back or block the other provider, so check both deployment statuses when publishing a change.

## Domain and canonical URL

The site currently uses `https://tsumina.github.io` as Astro's `site` value, so canonical links and the sitemap identify GitHub Pages as the primary site. The Cloudflare Worker is initially a synchronized mirror at `https://know.sakuki-harada.workers.dev`.

To use a domain managed by Cloudflare as the primary site:

1. Deploy the Worker successfully once.
2. In **Workers & Pages**, select `know`.
3. Open **Settings → Domains & Routes → Add → Custom Domain** and attach a domain or subdomain in a Cloudflare-managed zone.
4. Change Astro's `site` setting to that custom domain in a separate PR, then rebuild both mirrors.

A hostname can have only one active origin. Keep `tsumina.github.io` as the GitHub Pages mirror and use a separate Cloudflare-managed custom domain for the Worker. The `tsumina.github.io` hostname itself cannot be attached to Cloudflare because the `github.io` zone is owned by GitHub.

## Deployment behavior

- Pull requests run the GitHub Actions build without deploying GitHub Pages.
- Cloudflare preview builds can independently publish a branch-specific preview and comment its URL on the pull request.
- A push to `main` causes both providers to build the same commit and update their production deployment.
- GitHub Actions does not contain Cloudflare credentials, actions, variables, or deployment jobs.

Official references:

- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Cloudflare Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Cloudflare Workers build image and version files](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [Cloudflare Workers GitHub integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/)
- [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Cloudflare Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
