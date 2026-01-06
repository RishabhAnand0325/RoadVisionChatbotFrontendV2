import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, IndianRupee, Search, Eye, Star, Heart, Archive, Loader2, Info } from "lucide-react";
import { Tender } from "@/lib/types/tenderiq";
import { fetchWishlistedTenders, fetchFavoriteTenders, fetchArchivedTenders } from "@/lib/api/tenderiq";
import { toTitleCase } from "@/lib/utils/text-formatting";

type TabValue = "wishlist" | "favorites" | "archived";

const TenderHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>("wishlist");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: wishlistedTenders, isLoading: isLoadingWishlist } = useQuery<Tender[], Error>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlistedTenders,
  });

  const { data: favoriteTenders, isLoading: isLoadingFavorites } = useQuery<Tender[], Error>({
    queryKey: ['favorites'],
    queryFn: fetchFavoriteTenders,
  });

  const { data: archivedTenders, isLoading: isLoadingArchived } = useQuery<Tender[], Error>({
    queryKey: ['archived'],
    queryFn: fetchArchivedTenders,
  });

  const isLoading = isLoadingWishlist || isLoadingFavorites || isLoadingArchived;

  const currentTenders = useMemo(() => {
    switch (activeTab) {
      case "wishlist": return wishlistedTenders || [];
      case "favorites": return favoriteTenders || [];
      case "archived": return archivedTenders || [];
      default: return [];
    }
  }, [activeTab, wishlistedTenders, favoriteTenders, archivedTenders]);
  
  const filteredTenders = useMemo(() => {
    return currentTenders.filter(tender => {
      const matchesSearch = searchTerm === "" ||
        tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tender.authority.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || tender.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [currentTenders, searchTerm, categoryFilter]);
  
  const categories = useMemo(() => {
    const allCategories = new Set(currentTenders.map(t => t.category));
    return ["all", ...Array.from(allCategories)];
  }, [currentTenders]);

  const renderTenderList = (tenders: Tender[]) => {
    if (tenders.length === 0) {
      return (
        <div className="text-center py-12">
          <Info className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No tenders found in this list.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tenders.map((tender) => (
          <Card key={tender.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{tender.title}</h3>
                    <p className="text-sm text-muted-foreground">{toTitleCase(tender.authority)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <Badge variant="outline">{toTitleCase(tender.category)}</Badge>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {tender.value ? `₹${(tender.value / 10000000).toFixed(2)} Cr` : "Ref Document"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span className="text-muted-foreground">Due: {tender.dueDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/tenderiq/view/${tender.id}`)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle>Tender Lists</CardTitle>
        </div>
        <CardDescription>View your wishlisted, favorited, and archived tenders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="wishlist">
              <Star className="h-4 w-4 mr-2" /> Wishlist ({wishlistedTenders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="h-4 w-4 mr-2" /> Favorites ({favoriteTenders?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="archived">
              <Archive className="h-4 w-4 mr-2" /> Archived ({archivedTenders?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tenders by title or authority..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading tenders...</p>
            </div>
          ) : (
            <>
              <TabsContent value="wishlist">{renderTenderList(filteredTenders)}</TabsContent>
              <TabsContent value="favorites">{renderTenderList(filteredTenders)}</TabsContent>
              <TabsContent value="archived">{renderTenderList(filteredTenders)}</TabsContent>
            </>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TenderHistory;
