export interface PublicationOverride {
  featured?: boolean;
  hidden?: boolean;
  title?: string;
  venue?: string;
  /** Replacement author display names when the generated list is wrong or missing. */
  authors?: string[];
  category?: string;
  tags?: string[];
  annotation?: string;
  /**
   * Corresponding author(s), matched loosely against generated author names
   * ("Chang Liu", "Liu", or "Liu, C." all match). Rendered with a * marker.
   * No API exposes this reliably, so it is curated by hand per DOI.
   */
  correspondingAuthors?: string[];
  /** Authors sharing an equal-contribution († ) marker, matched like correspondingAuthors. */
  equalContribution?: string[];
  links?: Partial<
    Record<'doi' | 'publisher' | 'arxiv' | 'pdf' | 'code' | 'dataset' | 'project', string>
  >;
}
/** Keys are normalized DOI values (preferred) or ORCID put-code based IDs. Never generated. */
export const publicationOverrides: Record<string, PublicationOverride> = {};
