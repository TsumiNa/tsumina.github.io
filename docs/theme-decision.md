# Theme decision

Evaluated for the September 2026 initialization. The comparison focused on architecture and license rather than copying visual branding.

| Candidate                                                            | Maintenance / license                                    | Strengths                                                                            | Gaps for this site                                                                                                                      |
| -------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| [AstroPaper](https://github.com/satnaing/astro-paper)                | Active project; MIT                                      | Current Astro, content collections, search, accessible blog, dark mode, static hosts | Blog-first; publications, three-language routing, CV, and scientific breakout components require a new information architecture         |
| [Astro Cactus](https://github.com/chrismwilliams/astro-theme-cactus) | Active project; MIT                                      | Minimal JS, strong prose, Pagefind, content collections, dark mode                   | Blog-first and deliberately narrow; no academic publication model or complete multilingual architecture                                 |
| [Astro Academic](https://github.com/ChrisDyer-HpAd/astro-academic)   | Community project; inspect upstream license before reuse | Academic sections and publication-oriented presentation                              | Smaller ecosystem; its conventions and maintenance posture are less suitable as a long-lived base for the required custom content model |
| [Astro Micro](https://github.com/trevortylerlee/astro-micro)         | Community project; MIT                                   | Small, legible, easy to understand                                                   | Too minimal: Notes, publications, i18n, search, and technical authoring would largely be new architecture                               |

All four can produce static assets suitable for GitHub Pages and Cloudflare. AstroPaper and Cactus have the strongest Blog foundations. None covers the combined publication synchronization, optional per-entry translations, scientific MDX primitives, web CV, and editorial distinction between Blog and Notes without replacing a substantial portion of its information architecture.

## Decision

Build a small, idiomatic Astro system from scratch, informed by the content-collection and progressive-enhancement patterns of AstroPaper/Cactus. This avoids retaining irrelevant theme branding or demo content and is less risky than overriding a blog theme until little upstream structure remains.

The adaptation is intentionally cohesive: one global layout, centralized tokens and i18n, typed content collections, shared scientific-content primitives, normalized publication data, and static deployment. No upstream theme code was copied.
