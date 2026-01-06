import { useState } from "react";
import { toast } from "sonner";
import { searchLegalCases } from "@/lib/api/legal-research";
import { SearchResult } from "@/lib/types/legal-research";
import { LegalResearchUI } from "@/components/legal-research/LegalResearchUI";

export default function LegalResearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async () => {
    const data = await searchLegalCases(searchQuery);
    setSearchResults(data.searchResults);
    setHasSearched(true);
  };

  const handleSaveToCase = (caseName: string) => {
    toast.success(`"${caseName}" saved to Case Reference`);
  };

  return (
    <LegalResearchUI
      searchQuery={searchQuery}
      hasSearched={hasSearched}
      searchResults={searchResults}
      onSearchQueryChange={setSearchQuery}
      onSearch={handleSearch}
      onSaveToCase={handleSaveToCase}
    />
  );
}
