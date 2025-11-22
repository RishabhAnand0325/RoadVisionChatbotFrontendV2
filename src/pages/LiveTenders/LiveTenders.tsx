import { Card } from "@/components/ui/card";
import { Report, ScrapeDate, Tender } from "@/lib/types/tenderiq.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import LiveTendersUI from "./components/LiveTendersUI";
import { getTodayTenders, fetchWishlistedTenders, performTenderAction, getScrapeDates } from "@/lib/api/tenderiq.api";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useReportStream } from "@/lib/hooks/tenderiq.hook";

export default function LiveTenders() {
  const [runId, setRunId] = useState<string | undefined>(undefined)
  const { report, status } = useReportStream(runId)
  const [dates, setDate] = useState<ScrapeDate[]>([])
  // const [report, setReport] = useState<Report | null>(undefined)
  const [wishlisted, setWishlisted] = useState<Tender[]>([])
  const navigate = useNavigate()
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchWishlisted = async () => {
    const wishlisted_tenders = await fetchWishlistedTenders()
    setWishlisted(wishlisted_tenders)
  }

  const onDateSelect = async (run_id: string) => {
    console.log("Selected id: ", run_id)
    setRunId(run_id)
  }

  useEffect(() => {
    fetchWishlisted()
    getScrapeDates().then(scrape_dates => {
      setDate(scrape_dates.dates)
    })
  }, [])

  return <LiveTendersUI
    report={report}
    onChangeDate={onDateSelect}
    dates={dates}
    onAddToWishlist={async function (tenderId: string, e: React.MouseEvent): Promise<void> {
      try {
        const wasWishlisted = wishlisted.some(t => t.id === tenderId);
        const response = await performTenderAction(tenderId, { action: 'toggle_wishlist' });
        
        // Refetch queries to ensure UI shows updated wishlist & analysis status
        await Promise.all([
          queryClient.refetchQueries({ queryKey: ['wishlist'], exact: false }),
          queryClient.refetchQueries({ queryKey: ['analysisQueue'], exact: false }),
          queryClient.refetchQueries({ queryKey: ['tenders'], exact: false }),
        ]);
        
        // Update local wishlisted state
        const wishlisted_tenders = await fetchWishlistedTenders();
        setWishlisted(wishlisted_tenders);
        
        // Show enhanced toast based on queue status
        if (!wasWishlisted) {
          let description = 'Tender added to wishlist.';
          
          // Check if analysis already completed
          if (response.analysis_completed) {
            description += ' Analysis already completed.';
          } else if (response.has_active_analysis && response.queue_position && response.queue_position > 0) {
            // Queued behind another analysis
            description += ` You're #${response.queue_position} in the analysis queue.`;
          } else if (!response.analysis_completed) {
            // Starting immediately (no queue position means it's starting now)
            description += ' Analysis is starting now (est. 3-5 min).';
          }
          
          toast({
            title: '✓ Added to Wishlist',
            description,
            duration: 6000,
          });
        } else {
          toast({
            title: 'Removed from wishlist',
            description: 'Tender removed successfully',
          });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to update wishlist', variant: 'destructive' });
      }
    }}
    onViewTender={function (tenderId: string): void {
      navigate(`/tenderiq/view/${tenderId}`)
    }}
    onNavigateToWishlist={function (): void {
      navigate(`/tenderiq/wishlist-history`)
    }}
    isInWishlist={function (tenderId: string): boolean {
      return wishlisted.some(t => t.id === tenderId)
    }}
  />

}
