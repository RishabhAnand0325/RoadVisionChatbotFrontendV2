import { useEffect, useState } from "react"
import { Report, SSEBatchTenders, StreamStatus } from "../types/tenderiq.types"
import { API_BASE_URL } from "../config/api";


export const useReportStream = (run_id?: string, dateRange?: string) => {
  const [report, setReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<StreamStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [shouldWarn401, setShouldWarn401] = useState(false)

  // Helper function to normalize dates to YYYY-MM-DD for proper sorting
  const normalizeDateToYYYYMMDD = (dateStr: string): string => {
    if (!dateStr) return '0000-00-00'
    
    dateStr = dateStr.trim()
    
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr // Already in correct format
    }
    
    // Try to parse DD-MM-YYYY or DD/MM/YYYY format
    let parts = dateStr.split('-')
    if (parts.length !== 3) {
      parts = dateStr.split('/')
    }
    
    if (parts.length === 3) {
      try {
        let day = parts[0].trim()
        let month = parts[1].trim()
        let year = parts[2].trim()
        
        // Parse as integers to handle both "2" and "02" formats
        const dayNum = parseInt(day, 10)
        const monthNum = parseInt(month, 10)
        const yearNum = parseInt(year, 10)
        
        // Validate ranges
        if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 2000 || yearNum > 2100) {
          return '0000-00-00'
        }
        
        // Return in YYYY-MM-DD format with zero padding
        return `${yearNum.toString().padStart(4, '0')}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`
      } catch {
        return '0000-00-00'
      }
    }
    return '0000-00-00'
  }

  useEffect(() => {
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
    
    console.log("Connecting to SSE with URL:", url)
    const evtSource = new EventSource(url)
    setStatus("streaming")
    setError(null)
    setShouldWarn401(true)

    const handleInitialData = (event: MessageEvent) => {
      const initialReport = JSON.parse(event.data) as Report
      console.log("Recieved initial data: ", initialReport)
      
      // Collect all tenders from all queries
      const allTenders = new Map<string, any>()
      initialReport.queries.forEach(query => {
        query.tenders.forEach(t => {
          if (t.tender_id_str) {
            allTenders.set(t.tender_id_str, t)
          }
        })
      })
      
      // Sort by publish_date descending
      const sortedTenders = Array.from(allTenders.values()).sort((a, b) => {
        const dateA = normalizeDateToYYYYMMDD(a.publish_date || '')
        const dateB = normalizeDateToYYYYMMDD(b.publish_date || '')
        const result = dateB.localeCompare(dateA) // Descending order (newest first)
        
        return result
      })
      
      console.log("Initial data sorted - first 5 tenders:", sortedTenders.slice(0, 5).map(t => ({
        name: t.tender_name,
        publish_date: t.publish_date,
        normalized: normalizeDateToYYYYMMDD(t.publish_date || '')
      })))
      
      // Put all sorted tenders in first query
      const sortedReport = {
        ...initialReport,
        queries: initialReport.queries.map((query, index) => {
          if (index === 0) {
            return {
              ...query,
              tenders: sortedTenders,
            }
          } else {
            return {
              ...query,
              tenders: [],
            }
          }
        })
      }
      
      setReport(sortedReport)
      // Reset 401 warning on successful connection
      setShouldWarn401(false)
    }

    const handleBatch = (event: MessageEvent) => {
      const batch = JSON.parse(event.data) as SSEBatchTenders
      setReport((prevReport) => {
        if (!prevReport) return null
        
        // Collect all existing tenders from all queries
        const allExistingTenders = new Map<string, any>()
        prevReport.queries.forEach(query => {
          query.tenders.forEach(t => {
            if (t.tender_id_str) {
              allExistingTenders.set(t.tender_id_str, t)
            }
          })
        })
        
        // Add new tenders from batch (will overwrite if duplicate)
        batch.data.forEach(t => {
          if (t.tender_id_str) {
            allExistingTenders.set(t.tender_id_str, t)
          }
        })
        
        // Convert to array and sort by publish_date descending
        const sortedAllTenders = Array.from(allExistingTenders.values()).sort((a, b) => {
          const dateA = normalizeDateToYYYYMMDD(a.publish_date || '')
          const dateB = normalizeDateToYYYYMMDD(b.publish_date || '')
          const comparison = dateB.localeCompare(dateA) // Descending order (newest first)
          
          return comparison
        })
        
        if (sortedAllTenders.length > 0) {
          console.log(`[Batch ${new Date().toLocaleTimeString()}] Total tenders now: ${sortedAllTenders.length}`)
          console.log("Top 3 tenders after sort:", sortedAllTenders.slice(0, 3).map(t => ({
            name: t.tender_name?.substring(0, 50),
            date: t.publish_date,
            normalized: normalizeDateToYYYYMMDD(t.publish_date || '')
          })))
        }
        
        // Put all sorted tenders in the first query (Civil Works)
        const newQueries = prevReport.queries.map((query, index) => {
          if (index === 0) {
            // First query gets all sorted tenders
            return {
              ...query,
              tenders: sortedAllTenders,
            }
          } else {
            // Other queries get empty array
            return {
              ...query,
              tenders: [],
            }
          }
        })
        
        return {
          ...prevReport,
          queries: newQueries
        }
      })
    }

    const handleComplete = (event: MessageEvent) => {
      console.log("Stream completed")
      setStatus("complete")
      evtSource.close()
    }

    const handleError = (event: Event) => {
      console.error("Stream error:", event)
      setStatus("error")
      
      // Only show 401 error if we had a successful connection that got closed
      // This prevents false positives on initial connection failures
      if (shouldWarn401 && report) {
        setError("You've been logged in for a while, login again")
      }
      
      evtSource.close()
    }

    evtSource.addEventListener("initial_data", handleInitialData)
    evtSource.addEventListener("batch", handleBatch)
    evtSource.addEventListener("complete", handleComplete)
    evtSource.onerror = handleError

    return () => {
      evtSource.close()
    }

  }, [run_id, dateRange])

  return { report, status, error }
}
