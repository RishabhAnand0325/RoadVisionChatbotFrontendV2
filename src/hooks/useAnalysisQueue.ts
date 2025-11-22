import { useQuery } from '@tanstack/react-query';
import { fetchAnalysisQueueStatus } from '@/lib/api/analyze.api';

export interface QueueStatus {
  has_active: boolean;
  current_analysis: {
    tender_id: string;
    status: string;
    progress: number;
    started_at: string | null;
    elapsed_seconds?: number;
    estimated_remaining_seconds?: number;
  } | null;
  queue_length: number;
  queued_items: Array<{
    tender_id: string;
    queued_at: string;
    position: number;
  }>;
}

/**
 * Hook to monitor analysis queue status with auto-refresh.
 * Polls every 3 seconds when there's active analysis or queued items.
 */
export function useAnalysisQueue() {
  const query = useQuery<QueueStatus, Error>({
    queryKey: ['analysisQueue'],
    queryFn: fetchAnalysisQueueStatus,
    refetchInterval: (data) => {
      // Poll every 3 seconds if there's active analysis or queue
      if (data && (data.has_active || data.queue_length > 0)) {
        return 3000;
      }
      // Otherwise poll every 30 seconds
      return 30000;
    },
    refetchIntervalInBackground: true,
  });

  return {
    ...query,
    hasActive: query.data?.has_active || false,
    queueLength: query.data?.queue_length || 0,
    currentAnalysis: query.data?.current_analysis,
    queuedItems: query.data?.queued_items || [],
  };
}
