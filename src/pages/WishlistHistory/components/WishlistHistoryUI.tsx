import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryData, HistoryPageResponse, MetadataCardProps, WishlistHistoryUIProps } from "@/lib/types/wishlist";
import { getCurrencyTextFromNumber } from "@/lib/utils/conversions";
import { ArrowLeft, Check, Circle, Download, Eye, Filter, Heart, IndianRupee, SquareCheck, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export function MetadataCard({ title, value, LucideIcon, description }: MetadataCardProps) {
  return (
    <div className="p-4 border rounded-lg flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center w-full">
        <span>{title}</span>
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <LucideIcon className="h-6 w-6 text-secondary" />
        </div>
      </div>
      <h1>{value}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function TenderCard({ data, handleViewTender, handleRemoveFromWishlist }: { data: HistoryData, handleViewTender: (id: string) => void, handleRemoveFromWishlist: (id: string) => Promise<void> }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3>{data.title}</h3>
          <span className="bg-muted rounded-xl px-2 py-1 text-xs font-bold">{data.results}</span>
        </div>
        <div className="text-sm text-muted-foreground">{data.authority}</div>
        <hr className="my-2" />
        <div className="grid grid-cols-4 grid-rows-2 gap-1">
          <div className="text-xs text-muted-foreground">Tender Value</div>
          <div className="text-xs text-muted-foreground">EMD</div>
          <div className="text-xs text-muted-foreground">Due Date</div>
          <div className="text-xs text-muted-foreground">Category</div>
          <div className="font-bold text-blue" >{getCurrencyTextFromNumber(data.value)}</div>
          <div className="font-bold" >{getCurrencyTextFromNumber(data.emd)}</div>
          <div className="font-bold" >{data.due_date}</div>
          <div>
            <span className="text-xs bg-muted rounded-xl px-2 py-1">
              {data.category}
            </span>
          </div>
        </div>
        <hr className="my-2" />
        <div className="w-full flex justify-between items-center">
          <div>Progress</div>
          <div className="flex gap-4 items-center">
            <div className="flex gap-1 items-center">
              <span className={`text-xs ${data.analysis_state ? 'text-primary' : 'text-muted-foreground'}`}>Analysis</span>
              {data.analysis_state ? <Check className="h-3 w-3 text-primary" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
            </div>
            <div className="flex gap-1 items-center">
              <span className={`text-xs ${data.synopsis_state ? 'text-primary' : 'text-muted-foreground'}`}>Synopsis</span>
              {data.synopsis_state ? <Check className="h-3 w-3 text-primary" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
            </div>
            <div className="flex gap-1 items-center">
              <span className={`text-xs ${data.evaluated_state ? 'text-primary' : 'text-muted-foreground'}`}>Evaluation</span>
              {data.evaluated_state ? <Check className="h-3 w-3 text-primary" /> : <Circle className="h-3 w-3 text-muted-foreground" />}
            </div>
            <span className="text-xs">{data.progress} %</span>
          </div>
        </div>
        <div className="w-full h-2 bg-muted rounded-xl">
          <div className="bg-blue h-2 rounded-xl" style={{ width: `${data.progress}%` }}></div>
        </div>
        <div className="w-full flex justify-between items-center mt-4">
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm" onClick={() => handleViewTender(data.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View Tender
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <Button variant="destructive" size="sm" onClick={() => handleRemoveFromWishlist(data.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Remove from wishlist
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function WishlistHistoryUI({ navigate, data, handleViewTender, handleRemoveFromWishlist }: WishlistHistoryUIProps) {
  const [metadata, setMetadata] = useState<MetadataCardProps[]>([])
  const [filteredTenders, setFilteredTenders] = useState<HistoryData[]>(data.tenders);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const filtered = data.tenders.filter((tender) => tender.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredTenders(filtered);
    console.log(filtered)
  }, [searchQuery, data.tenders]);

  useEffect(() => {
    const totalSavedMetadata: MetadataCardProps = {
      title: 'Total Saved',
      value: data.tenders.length.toString(),
      LucideIcon: Heart,
      description: 'Active Opportunities',
    }
    const tendersAnalyzedMetadata: MetadataCardProps = {
      title: 'Tenders Analyzed',
      value: data.tenders.filter(tender => tender.analysis_state).length.toString(),
      LucideIcon: SquareCheck,
      description: 'AI-powered insights',
    }
    const tendersWonMetadata: MetadataCardProps = {
      title: 'Tenders Won',
      value: data.tenders.filter(tender => tender.results === 'won').length.toString(),
      LucideIcon: SquareCheck,
      description: 'AI-powered insights',
    }
    const tendersWonValueMetadata: MetadataCardProps = {
      title: 'Tenders Won Value',
      value: "Rs." + data.tenders.filter(tender => tender.results === 'won').reduce((total, tender) => total + tender.value, 0).toLocaleString('en-IN') + "Cr",
      LucideIcon: IndianRupee,
      description: 'AI-powered insights',
    }
    const pendingTendersMetadata: MetadataCardProps = {
      title: 'Pending Tenders',
      value: data.tenders.filter(tender => tender.results === 'pending').length.toString(),
      LucideIcon: SquareCheck,
      description: 'AI-powered insights',
    }

    setMetadata([totalSavedMetadata, tendersAnalyzedMetadata, tendersWonMetadata, tendersWonValueMetadata, pendingTendersMetadata])
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/tenderiq')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Wishlist / Tender History</h1>
              <p className="text-sm text-muted-foreground">
                Manage your saved tenders
              </p>
            </div>
          </div>
          <Button variant="default" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Comprehensive Report
          </Button>
        </div>
      </div>

      {/* Metadata area */}
      <div className="grid grid-cols-5 gap-4">
        {metadata.map((item, index) => (
          <MetadataCard key={index} {...item} />
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-4 p-2 border rounded-lg">
        <input
          type="text"
          placeholder="Search by tender title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />
        <Button variant="default" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Wishlist Content */}
      <div className="space-y-4">
        {data.tenders.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tenders in your wishlist yet.</p>
            <Button
              className="mt-4"
              onClick={() => navigate('/tenderiq')}
            >
              Browse Tenders
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredTenders.map((item) => (
              <TenderCard
                key={item.id}
                data={item}
                handleViewTender={handleViewTender}
                handleRemoveFromWishlist={handleRemoveFromWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
