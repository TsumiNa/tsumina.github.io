/** Shared publication model used by the sync script, overrides, and rendering. */
export interface PublicationAuthor {
  /** Display name as provided by the upstream source, e.g. "Chang Liu". */
  name: string;
  given?: string;
  family?: string;
  /** Bare ORCID iD such as "0000-0002-9511-4283" when the source supplies one. */
  orcid?: string;
}

export type PublicationSource = 'orcid' | 'orcid+crossref' | 'orcid+datacite';

export interface Publication {
  /** Normalized lowercase DOI when available, otherwise `orcid-<put-code>`. */
  id: string;
  title: string;
  authors?: PublicationAuthor[];
  year?: number;
  month?: number;
  /** Journal, container, or publisher name. */
  venue?: string;
  volume?: string;
  issue?: string;
  /** Page range, or article number when the venue uses article numbers. */
  pages?: string;
  doi?: string;
  url?: string;
  /** ORCID work type, e.g. journal-article, data-set, preprint, book, book-chapter. */
  type?: string;
  orcidPutCode?: string;
  source: PublicationSource;
}
