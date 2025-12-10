import { Card } from "@/components/ui/card";
import { Report, ScrapeDate, Tender } from "@/lib/types/tenderiq.types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import LiveTendersUI from "./components/LiveTendersUI";
import { getTodayTenders, fetchWishlistedTenders, getScrapeDates } from "@/lib/api/tenderiq.api";
import { useNavigate } from "react-router-dom";
import { useReportStream } from "@/lib/hooks/tenderiq.hook";
import { useTenderActions } from "@/hooks/useTenderActions";

export default function LiveTenders() {
  const [runId, setRunId] = useState<string | undefined>(undefined)
  const [dateRange, setDateRange] = useState<string | undefined>("last_5_days")
  const { report, status, error } = useReportStream(runId, dateRange)
  const [dates, setDate] = useState<ScrapeDate[]>([])
  const [wishlisted, setWishlisted] = useState<Tender[]>([])
  const navigate = useNavigate()
  const { handleToggleWishlist } = useTenderActions()

  const fetchWishlisted = async () => {
    const wishlisted_tenders = await fetchWishlistedTenders()
    setWishlisted(wishlisted_tenders)
  }

  const onDateSelect = async (dateValue: string) => {
    console.log("Selected date/range: ", dateValue)

    // Handle quick date filters
    if (dateValue.startsWith("last_")) {
      setRunId(undefined)
      setDateRange(dateValue)
      return
    }

    // Handle specific date selection - find matching run_id
    const matchingDate = dates.find(d => d.date === dateValue || d.id === dateValue)
    if (matchingDate) {
      console.log("Found matching date, setting runId to:", matchingDate.id)
      setDateRange(undefined)
      setRunId(matchingDate.id)
    } else {
      console.warn("No matching date found for:", dateValue)
      setRunId(undefined)
      setDateRange(undefined)
    }
  }

  useEffect(() => {
    fetchWishlisted()
    getScrapeDates().then(scrape_dates => {
      setDate(scrape_dates.dates)
    })
  }, [])

  // Handle 401 errors - redirect to login
  useEffect(() => {
    if (error === "You've been logged in for a while, login again") {
      // Show error and redirect after a short delay
      alert(error)
      navigate("/login")
    }
  }, [error, navigate])

  return <LiveTendersUI
    report={report}
    status={status}
    onChangeDate={onDateSelect}
    dates={dates}
    onAddToWishlist={async function (tenderId: string, e: React.MouseEvent): Promise<void> {
      // Find tender in queries to get TDR
      let tender = undefined;
      if (report && report.queries) {
        for (const query of report.queries) {
          const found = query.tenders.find(t => t.id === tenderId);
          if (found) {
            tender = found;
            break;
          }
        }
      }

      if (!tender) return;

      const isCurrentlyWishlisted = wishlisted.some(t => t.tender_id_str === tender.tender_id_str)

      // Optimistic update - update UI immediately
      if (isCurrentlyWishlisted) {
        setWishlisted(wishlisted.filter(t => t.tender_id_str !== tender.tender_id_str))
      } else {
        setWishlisted([...wishlisted, tender])
      }

      try {
        await handleToggleWishlist(tenderId, isCurrentlyWishlisted)
        // Refresh wishlist after successful toggle to sync with backend
        await fetchWishlisted()
        // Removed navigation to keep user on the page
      } catch (error) {
        // Revert on error
        await fetchWishlisted()
        // Error handling is done in the hook
        console.error('Error in onAddToWishlist:', error)
      }
    }}
    onViewTender={function (tenderId: string): void {
      navigate(`/tenderiq/view/${tenderId}`)
    }}
    onNavigateToWishlist={function (): void {
      navigate(`/tenderiq/wishlist`)
    }}
    isInWishlist={function (tenderId: string): boolean {
      // Find tender in queries to get TDR
      let tender = undefined;
      if (report && report.queries) {
        for (const query of report.queries) {
          const found = query.tenders.find(t => t.id === tenderId);
          if (found) {
            tender = found;
            break;
          }
        }
      }

      if (!tender) return false;

      return wishlisted.some(t => t.tender_id_str === tender.tender_id_str)
    }}
    onAskAI={() => { }}
  />

}
