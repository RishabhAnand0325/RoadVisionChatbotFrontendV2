import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { parse, isAfter, isSameDay, subDays, startOfDay, isValid } from 'date-fns';
import { fetchDailyTenders, fetchFilteredTenders } from '@/lib/api/tenderiq';
import { useToast } from '@/hooks/use-toast';
import { Tender } from '@/lib/types/tenderiq';

/**
 * Helper function to parse DD-MM-YYYY date format safely
 * @param dateStr - Date string in DD-MM-YYYY format
 * @returns Parsed Date object or null if invalid
 */
const parseDateSafely = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  try {
    const trimmed = dateStr.trim();
    // Parse DD-MM-YYYY format
    const parsed = parse(trimmed, 'dd-MM-yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  } catch (e) {
    console.warn(`Failed to parse date: ${dateStr}`, e);
    return null;
  }
};

/**
 * Sort tenders by publish_date in descending order (newest first)
 * @param tenders - Array of tenders to sort
 * @returns Sorted array
 */
const sortTendersByPublishDate = (tenders: Tender[]): Tender[] => {
  return [...tenders].sort((a, b) => {
    const dateA = parseDateSafely(a.publish_date || '');
    const dateB = parseDateSafely(b.publish_date || '');
    
    // Handle invalid dates - push them to the end
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    // Sort descending (newest first)
    return dateB.getTime() - dateA.getTime();
  });
};

interface UseLiveFiltersParams {
  selectedDate?: string;
  selectedDateRange?: string;
  includeAllDates?: boolean;
  selectedCategory?: string;
  selectedLocation?: string;
  minValue?: number | null;
  maxValue?: number | null;
}

interface UseLiveFiltersResult {
  tenders: Tender[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch and manage live tenders data with caching
 *
 * The /tenders endpoint is now the main source:
 * - When no filters: fetches latest scraped date first, then gets tenders for that date
 * - When filters applied: uses /tenders endpoint with filter params
 *
 * Both paths use the /tenders endpoint which returns tenders organized by queries/categories
 */
export const useLiveFilters = (params: UseLiveFiltersParams): UseLiveFiltersResult => {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<Tender[]>([]);

  // Check if any date/filter params are set
  const hasDateOrFilters = !!(params.selectedDate || params.selectedDateRange || params.includeAllDates);

  // Use React Query for filtered tenders when filters are applied
  const { data: filteredData, isLoading: isLoadingFiltered, error: errorFiltered, refetch: refetchFiltered } = useQuery({
    queryKey: [
      'filteredTenders',
      params.selectedDate,
      params.selectedDateRange,
      params.includeAllDates,
      params.selectedCategory,
      params.selectedLocation,
      params.minValue,
      params.maxValue,
    ],
    queryFn: async () => {
      const minVal = params.minValue ? parseFloat(params.minValue.toString()) : undefined;
      const maxVal = params.maxValue ? parseFloat(params.maxValue.toString()) : undefined;

      const response = await fetchFilteredTenders({
        date: params.selectedDate,
        date_range: params.selectedDateRange as any,
        include_all_dates: params.includeAllDates,
        category: params.selectedCategory !== "all" ? params.selectedCategory : undefined,
        location: params.selectedLocation !== "all" ? params.selectedLocation : undefined,
        min_value: minVal,
        max_value: maxVal,
      });
      return response.tenders;
    },
    enabled: hasDateOrFilters,
  });

  // Use React Query for daily tenders when no date filters are set
  // This internally fetches latest date and gets tenders for that date via /tenders endpoint
  const { data: dailyData, isLoading: isLoadingDaily, error: errorDaily, refetch: refetchDaily } = useQuery({
    queryKey: ['dailyTenders'],
    queryFn: () => fetchDailyTenders(),
    enabled: !hasDateOrFilters,
  });

  // Update tenders based on which query succeeded, with client-side filtering
  useEffect(() => {
    let rawTenders: Tender[] = [];
    if (filteredData) {
      rawTenders = filteredData;
    } else if (dailyData) {
      rawTenders = dailyData;
    }

    // Apply client-side filtering for date ranges
    // This ensures that even if the backend returns older tenders in the "latest" scrape runs,
    // we only show what the user actually asked for.
    let processedTenders = rawTenders;
    
    if (params.selectedDate && rawTenders.length > 0) {
      // Filter by specific date
      try {
        const selectedParsed = parseDateSafely(params.selectedDate);
        if (selectedParsed) {
          const filtered = rawTenders.filter(tender => {
            if (!tender.publish_date) return false;
            const parsedDate = parseDateSafely(tender.publish_date);
            return parsedDate && isSameDay(parsedDate, selectedParsed);
          });
          processedTenders = filtered;
        }
      } catch (e) {
        console.error("Error filtering tenders by specific date:", e);
        processedTenders = rawTenders;
      }
    } else if (params.selectedDateRange && rawTenders.length > 0) {
      // Filter by date range (last X days)
      try {
        const now = new Date();
        let daysToSubtract = 0;
        
        if (params.selectedDateRange === "last_2_days") daysToSubtract = 2;
        else if (params.selectedDateRange === "last_5_days") daysToSubtract = 5;
        else if (params.selectedDateRange === "last_7_days") daysToSubtract = 7;
        else if (params.selectedDateRange === "last_30_days") daysToSubtract = 30;
        
        if (daysToSubtract > 0) {
          // Calculate cutoff: today minus X days (inclusive)
          const cutoffDate = subDays(startOfDay(now), daysToSubtract - 1);
          
          const filtered = rawTenders.filter(tender => {
            if (!tender.publish_date) return false;
            const parsedDate = parseDateSafely(tender.publish_date);
            if (!parsedDate) return false;
            // Include tender if it's on or after the cutoff date
            return isAfter(parsedDate, cutoffDate) || isSameDay(parsedDate, cutoffDate);
          });
          processedTenders = filtered;
        }
      } catch (e) {
        console.error("Error filtering tenders by date range:", e);
        processedTenders = rawTenders;
      }
    }
    
    // Sort tenders by publish_date descending (newest first) for consistent ordering
    const sortedTenders = sortTendersByPublishDate(processedTenders);
    setTenders(sortedTenders);
  }, [filteredData, dailyData, params.selectedDateRange]);

  // Handle errors
  useEffect(() => {
    const error = errorFiltered || errorDaily;
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load tenders. Please try again.",
        variant: "destructive",
      });
    }
  }, [errorFiltered, errorDaily, toast]);

  const refetch = () => {
    if (hasDateOrFilters) {
      refetchFiltered();
    } else {
      refetchDaily();
    }
  };

  return {
    tenders,
    isLoading: isLoadingFiltered || isLoadingDaily,
    error: errorFiltered || errorDaily || null,
    refetch,
  };
};
