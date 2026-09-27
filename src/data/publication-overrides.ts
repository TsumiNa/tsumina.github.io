export interface PublicationOverride {
  featured?: boolean;
  hidden?: boolean;
  title?: string;
  venue?: string;
  authors?: string[];
  category?: string;
  tags?: string[];
  annotation?: string;
  links?: Partial<
    Record<'doi' | 'publisher' | 'arxiv' | 'pdf' | 'code' | 'dataset' | 'project', string>
  >;
}
/** Keys are normalized DOI values (preferred) or ORCID put-code based IDs. Never generated. */
export const publicationOverrides: Record<string, PublicationOverride> = {};
