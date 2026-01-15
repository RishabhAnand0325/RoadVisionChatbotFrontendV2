import { useMemo } from 'react';
import { HistoryPageResponse, WishlistReportData, ReportMetrics, WishlistReportTableRow } from '@/lib/types/wishlist';
import { getCurrencyTextFromNumber } from '@/lib/utils/conversions';

/**
 * Hook to process wishlist data for report generation
 * Calculates metrics and formats data for PDF/print rendering
 */
export function useWishlistReportData(data: HistoryPageResponse): WishlistReportData {
  return useMemo(() => {
    const tenders = data?.tenders || [];

    // Calculate metrics
    const metrics: ReportMetrics = {
      totalSaved: tenders.length,
      totalAnalyzed: tenders.filter(t => t.analysis_state === 'completed' || t.analysis_state === 'completed').length,
      totalWon: tenders.filter(t => t.results === 'won').length,
      totalRejected: tenders.filter(t => t.results === 'rejected').length,
      totalIncomplete: tenders.filter(t => t.results === 'incomplete').length,
      totalPending: tenders.filter(t => t.results === 'pending').length,
      totalTenderValue: tenders.reduce((sum, t) => sum + (t.value || 0), 0),
      averageTenderValue: tenders.length > 0
        ? tenders.reduce((sum, t) => sum + (t.value || 0), 0) / tenders.length
        : 0,
      totalEMD: tenders.reduce((sum, t) => sum + (t.emd || 0), 0),
      averageEMD: tenders.length > 0
        ? tenders.reduce((sum, t) => sum + (t.emd || 0), 0) / tenders.length
        : 0,
    };

    // Format tenders for report table
    const formattedTenders: WishlistReportTableRow[] = tenders.map(tender => ({
      ...tender,
      formattedValue: getCurrencyTextFromNumber(tender.value),
      formattedEMD: getCurrencyTextFromNumber(tender.emd),
      statusLabel: getStatusLabel(tender.results),
      analysisStateLabel: getAnalysisStateLabel(tender.analysis_state),
    }));

    // Sort by due date (nearest first)
    formattedTenders.sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      metrics,
      tenders: formattedTenders,
      generatedAt: new Date().toISOString(),
      totalCount: tenders.length,
    };
  }, [data]);
}

/**
 * Convert results status to human-readable label
 */
function getStatusLabel(results: string): string {
  const statusMap: Record<string, string> = {
    won: 'Won',
    rejected: 'Rejected',
    incomplete: 'Incomplete',
    pending: 'Pending',
  };
  return statusMap[results] || 'Unknown';
}

/**
 * Convert analysis state to human-readable label
 */
function getAnalysisStateLabel(state: string | boolean): string {
  if (state === 'completed' || state === true || state === 'true') {
    return 'Completed';
  }
  if (state === 'pending' || state === 'parsing' || state === 'processing' || state === 'analyzing') {
    return 'In Progress';
  }
  if (state === 'failed' || state === false || state === 'false') {
    return 'Failed';
  }
  return 'Not Started';
}
