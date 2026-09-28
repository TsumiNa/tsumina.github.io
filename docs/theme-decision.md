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

## 2026-09-28 re-evaluation (visual redesign)

Before the visual redesign, the community-theme landscape was re-surveyed with the owner's "prefer a maintained community theme" request in mind. Verified findings: no maintained Astro theme simultaneously covers trilingual root/`ja`/`zh` routing and an ORCID publications pipeline. The actively maintained candidates (AstroPaper v6, Astro Cactus v8, astro-erudite v2) are blog-first with no publications/CV model, and the academic-specific themes (as-folio, astro_academia, Scholar-Lite, astro-scholar) are 9–71-star single-maintainer projects, several already unmaintained; none has route-level i18n.

Decision, agreed with the owner: keep the custom architecture and redesign the visual layer in place, borrowing design language rather than code — astro-erudite v2's fluid Utopia type/space scales and framework-free CSS philosophy, Astro Cactus's posts/notes information architecture, AntfuStyle's restrained "modern researcher, slightly geeky" temperament, and as-folio's publications-page interaction patterns.
