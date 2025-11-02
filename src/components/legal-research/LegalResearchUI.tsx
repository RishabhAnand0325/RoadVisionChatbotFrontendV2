import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookmarkPlus, ExternalLink, BookOpen } from "lucide-react";
import { SearchResult } from "@/lib/types/legal-research";

interface LegalResearchUIProps {
  searchQuery: string;
  hasSearched: boolean;
  searchResults: SearchResult[];
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  onSaveToCase: (caseName: string) => void;
}

export function LegalResearchUI({
  searchQuery,
  hasSearched,
  searchResults,
  onSearchQueryChange,
  onSearch,
  onSaveToCase,
}: LegalResearchUIProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Legal Research</h1>
        <p className="text-muted-foreground">
          Search judgments, acts, and case laws with AI-powered relevance ranking
        </p>
      </div>

      {/* Search Bar */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for judgments, acts, sections, or legal issues..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </div>
            <Button onClick={onSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {searchResults.length} relevant results
            </p>
          </div>

          {searchResults.map((result, index) => (
            <Card key={index} className="shadow-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{result.caseName}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{result.citation}</Badge>
                      <Badge variant="secondary">{result.court}</Badge>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        {result.relevance}% Relevant
                      </Badge>
                    </div>
                    <CardDescription className="text-base leading-relaxed">
                      {result.summary}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Decided on: {result.date}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => onSaveToCase(result.caseName)}
                    >
                      <BookmarkPlus className="h-4 w-4" />
                      Save to Case Reference
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      View Full Text
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Start Your Legal Research
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter keywords, case names, or legal issues to find relevant judgments,
              acts, and legal precedents from courts across India.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
