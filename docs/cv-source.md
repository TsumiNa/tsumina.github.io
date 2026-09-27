# CV source and editorial decisions

## Authority

Career and education data in `src/data/cv.ts` come from the author-supplied eight-page **ChangLiu-CV-202609.pdf**. The author's direct correction takes precedence over the PDF: **Master of Engineering, Shizuoka University, April 2012–March 2014**. This correction was supplied in the CV integration conversation on 27 September 2026.

The original PDF remains an author-supplied source, not a public download in this repository. Its phone number and room number are omitted from the web profile. The professional email and scholarly profile links are retained. No public PDF link is advertised until a publication-ready PDF is added.

## Dates and scope

- Formal appointments use the first-page “Education and working experience” dates. Project associate professor at ISM and Visiting Scientist at RIKEN TRIP-AGIS both begin April 2025.
- The research-experience section separately starts the RIKEN project in May 2025 and ISM research in July 2018. These are not used to change the formal appointment dates.
- NIMS employment is September 2017–March 2019. The research section's “present” does not imply ongoing employment.
- The source combines master's and doctoral study as April 2012–March 2017. Only the master's sub-period has been explicitly corrected. The doctoral degree is displayed without a separate date range; do not infer its start or award date. A thesis bibliography entry says 2016, which is not treated as an award date.
- Software, teaching, and membership end dates reflect this September 2026 snapshot; “present” is not a live status check. Year-only end dates remain year-only.
- The six software projects are retained. Crystallus is marked private, as in the CV, and has no public repository link.
- Two 2025 invited talks are selected from the CV. Coauthored conference contributions are not misrepresented as the author's invited talks.
- No awards are invented. The full conference history and publication bibliography are not duplicated on the web CV. ORCID remains the upstream source for the separate publication pipeline; this change does not populate or overwrite generated publication data.

## Editing

Update career facts in `src/data/cv.ts`, with provenance here when dates change. Localized introductory copy and section labels live in `src/i18n/cv.ts`; official titles, institutions, software descriptions, and talk titles retain the supplied English wording. `CVSection.astro` renders repeated timeline entries; `CVContent.astro` composes the web CV for all three locales. The shared home page uses the same name and localized biography.

Author corrections override the source snapshot. Do not resolve uncertain dates by inference.
