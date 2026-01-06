export interface SearchResult {
  caseName: string;
  citation: string;
  summary: string;
  relevance: number;
  court: string;
  date: string;
}

export interface LegalResearchData {
  searchResults: SearchResult[];
}
