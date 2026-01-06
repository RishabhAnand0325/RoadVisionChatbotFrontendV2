import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { Report, SSEBatchTenders, StreamStatus } from "../types/tenderiq.types"
import { API_BASE_URL } from "../config/api";

// Cache configuration - bump version to clear old broken caches
const CACHE_PREFIX = 'tenderiq_cache_v7_'; // Bump version to clear old caches
const CACHE_EXPIRY_MS = 2 * 60 * 1000; // 2 minutes - cache is fresh, no refresh needed
const CACHE_STALE_MS = 60 * 60 * 1000; // 1 hour - after this, don't use cache at all

interface CachedReport {
  report: Report;
  timestamp: number;
  version: number;
  status: StreamStatus; // Add status to cache
}

// Helper to get cache from localStorage - SYNCHRONOUS for instant loading
const getCache = (key: string): CachedReport | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached) as CachedReport;
    const now = Date.now();
    
    // If cache is too old (stale), discard it
    if (now - parsed.timestamp > CACHE_STALE_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    
    return parsed;
  } catch (e) {
    console.error("Failed to read cache:", e);
    return null;
  }
};

// Helper to set cache in localStorage - saves immediately, no debounce
const setCache = (key: string, report: Report, status: StreamStatus): void => {
  try {
    const cacheData: CachedReport = {
      report,
      status,
      timestamp: Date.now(),
      version: 3
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    console.log("💾 Saved to cache:", key, "tenders:", report.queries.reduce((acc, q) => acc + q.tenders.length, 0), "status:", status);
  } catch (e) {
    console.error("Failed to save cache:", e);
    // Try to clear old caches if storage is full
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      // Retry save
      const cacheData: CachedReport = {
        report,
        status,
        timestamp: Date.now(),
        version: 3
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch {
      // Give up
    }
  }
};

// Check if cache is fresh (doesn't need refresh)
const isCacheFresh = (cached: CachedReport): boolean => {
  return Date.now() - cached.timestamp < CACHE_EXPIRY_MS;
};

// Get initial state from cache synchronously - this makes the UI instant
const getInitialState = (run_id?: string, dateRange?: string): { report: Report | null; status: StreamStatus; fromCache: boolean } => {
  const cacheKey = `${run_id || 'latest'}_${dateRange || 'default'}`;
  const cached = getCache(cacheKey);
  
  if (cached) {
    // Always show cached data as complete, we'll refresh in background if stale
    return {
      report: cached.report,
      status: 'complete',
      fromCache: true
    };
  }
  
  return {
    report: null,
    status: "idle",
    fromCache: false
  };
};

export const useReportStream = (run_id?: string, dateRange?: string) => {
  // Get cache key - for date ranges, just use the range name without run_id prefix
  const cacheKey = dateRange && ['last_2_days', 'last_5_days', 'last_7_days', 'last_30_days'].includes(dateRange) 
    ? dateRange 
    : `${run_id || 'latest'}_${dateRange || 'default'}`;
  
  console.log(`[CACHE KEY] Using: "${cacheKey}" for dateRange="${dateRange}", run_id="${run_id}"`);
  
  // Initialize state with cached data IMMEDIATELY - before any effects run
  const [report, setReport] = useState<Report | null>(() => {
    const cached = getCache(cacheKey);
    console.log(`[INIT STATE] Cache ${cached ? 'HIT' : 'MISS'} for key "${cacheKey}", tenders: ${cached ? cached.report.queries.reduce((s, q) => s + q.tenders.length, 0) : 0}`);
    return cached ? cached.report : null;
  });
  
  const [status, setStatus] = useState<StreamStatus>(() => {
    const cached = getCache(cacheKey);
    return cached ? 'complete' : 'streaming';
  });
  
  const [error, setError] = useState<string | null>(null)
  const [shouldWarn401, setShouldWarn401] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null);
  const cacheKeyRef = useRef<string>("");
  const batchCountRef = useRef<number>(0); // Track batches for less frequent cache saves
  const hadCacheOnLoadRef = useRef<boolean>(false); // Track if we started with cache

  // Helper function to normalize dates to YYYY-MM-DD for proper sorting
  const normalizeDateToYYYYMMDD = useCallback((dateStr: string): string => {
    if (!dateStr) return '0000-00-00'
    
    dateStr = dateStr.trim()
    
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr
    }
    
    // Try to parse DD-MM-YYYY or DD/MM/YYYY format
    let parts = dateStr.split('-')
    if (parts.length !== 3) {
      parts = dateStr.split('/')
    }
    
    if (parts.length === 3) {
      try {
        const day = parts[0].trim()
        const month = parts[1].trim()
        const year = parts[2].trim()
        
        const dayNum = parseInt(day, 10)
        const monthNum = parseInt(month, 10)
        const yearNum = parseInt(year, 10)
        
        if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 2000 || yearNum > 2100) {
          return '0000-00-00'
        }
        
        return `${yearNum.toString().padStart(4, '0')}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
      } catch {
        return '0000-00-00'
      }
    }
    return '0000-00-00'
  }, []);

  useEffect(() => {
    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Generate cache key - for date ranges, just use the range name
    const cacheKey = dateRange && ['last_2_days', 'last_5_days', 'last_7_days', 'last_30_days'].includes(dateRange)
      ? dateRange
      : `${run_id || 'latest'}_${dateRange || 'default'}`;
    cacheKeyRef.current = cacheKey;
    
    // Check cache - always show it if exists, but ALWAYS connect to SSE
    const cached = getCache(cacheKey);
    
    if (cached) {
      setReport(cached.report);
      setStatus("complete"); // Keep showing as complete - update silently
      hadCacheOnLoadRef.current = true; // Remember we had cache
      console.log("📦 Loaded from cache, refreshing silently in background");
    } else {
      console.log("📭 No cache, loading fresh");
      setReport(null);
      setStatus("streaming");
      hadCacheOnLoadRef.current = false; // No cache
    }

    let url = `${API_BASE_URL}/tenderiq/tenders-sse`
    const params = new URLSearchParams()
    
    if (run_id) {
      params.append('scrape_run_id', run_id)
    }
    if (dateRange) {
      params.append('date_range', dateRange)
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    console.log("⚡ Fast loading tenders from:", url)
    const evtSource = new EventSource(url)
    eventSourceRef.current = evtSource;
    
    // Only set status to streaming if no cache exists
    if (!cached) {
      setStatus("streaming")
    }
    setError(null)
    setShouldWarn401(true)

    const handleInitialData = (event: MessageEvent) => {
      const initialReport = JSON.parse(event.data) as Report
      console.log("📨 SSE connected, initial data received...")
      
      // Show syncing indicator immediately when SSE connects (if we had cache)
      if (hadCacheOnLoadRef.current) {
        setStatus("streaming"); // Show "Syncing..." while updating
      }
      
      // Don't replace existing cached report with potentially smaller backend cache
      // Only set report if we don't have one yet
      setReport(prevReport => {
        if (prevReport && prevReport.queries.length > 0) {
          const prevCount = prevReport.queries.reduce((sum, q) => sum + q.tenders.length, 0);
          const newCount = initialReport.queries?.reduce((sum, q) => sum + (q.tenders?.length || 0), 0) || 0;
          console.log(`📦 Keeping existing ${prevCount} cached tenders (backend sent ${newCount})`);
          return prevReport; // Keep the larger cached data
        }
        // No previous report, use initial data
        return initialReport;
      });
      
      // If initial data has tenders (from backend cache), save to frontend cache too
      const tenderCount = initialReport.queries?.reduce((sum, q) => sum + (q.tenders?.length || 0), 0) || 0;
      if (tenderCount > 0) {
        console.log(`💾 Backend sent ${tenderCount} tenders`);
      } else {
        console.log("📭 No cached data from backend, will stream fresh");
      }
      
      setShouldWarn401(false)
    }

    const handleBatch = (event: MessageEvent) => {
      const batch = JSON.parse(event.data) as SSEBatchTenders
      batchCountRef.current += 1;
      console.log(`📦 Batch #${batchCountRef.current}: ${batch.data.length} tenders`);
      
      // Always show syncing when batches are arriving
      setStatus("streaming");
      
      setReport((prevReport) => {
        if (!prevReport) {
          console.warn("⚠️ No prevReport, cannot add batch");
          return null;
        }
        
        // Collect all existing tenders
        const allExistingTenders = new Map<string, any>()
        prevReport.queries.forEach(query => {
          query.tenders.forEach(t => {
            if (t.tender_id_str) {
              allExistingTenders.set(t.tender_id_str, t)
            }
          })
        })
        
        // Add new tenders from batch
        batch.data.forEach(t => {
          if (t.tender_id_str) {
            allExistingTenders.set(t.tender_id_str, t)
          }
        })
        
        // Sort by publish_date descending
        const sortedAllTenders = Array.from(allExistingTenders.values()).sort((a, b) => {
          const dateA = normalizeDateToYYYYMMDD(a.publish_date || '')
          const dateB = normalizeDateToYYYYMMDD(b.publish_date || '')
          return dateB.localeCompare(dateA)
        })
        
        // Put all sorted tenders in the first query
        const newQueries = prevReport.queries.map((query, index) => {
          if (index === 0) {
            return {
              ...query,
              tenders: sortedAllTenders,
            }
          } else {
            return {
              ...query,
              tenders: [],
            }
          }
        })
        
        const newReport = {
          ...prevReport,
          queries: newQueries
        };
        
        console.log(`✅ Updated report: ${sortedAllTenders.length} total tenders`);
        
        // Only save to cache every 3 batches to reduce overhead
        if (sortedAllTenders.length > 0 && batchCountRef.current % 3 === 0) {
          setCache(cacheKey, newReport, 'complete');
        }
        
        return newReport
      })
    }

    const handleComplete = () => {
      console.log("✅ Stream completed - total tenders:", report?.queries.reduce((acc, q) => acc + q.tenders.length, 0) || 0)
      setStatus("complete")
      setIsRefreshing(false)
      batchCountRef.current = 0; // Reset batch counter
      
      // Final save to cache
      setReport(prevReport => {
        if (prevReport) {
          setCache(cacheKeyRef.current, prevReport, 'complete');
        }
        return prevReport;
      });

      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null;
      }
    }

    const handleError = (event: Event) => {
      console.error("Stream error:", event)
      setIsRefreshing(false)
      
      // If we have cached data, keep showing it
      if (cached) {
        console.log("Stream error but using cached data")
        setStatus("complete")
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null;
        }
        return;
      }
      
      setStatus("error")
      
      if (shouldWarn401 && report) {
        setError("You've been logged in for a while, login again")
      }
      
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null;
      }
    }

    evtSource.addEventListener("initial_data", handleInitialData)
    evtSource.addEventListener("batch", handleBatch)
    evtSource.addEventListener("complete", handleComplete)
    evtSource.onerror = handleError

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null;
      }
    }

  }, [run_id, dateRange, normalizeDateToYYYYMMDD])

  return { report, status, error, isRefreshing }
}
