import { BidSynopsisData, BidSynopsisProps, SynopsisContent } from '@/lib/types/bidsynopsis.types';
import { generateMockSynopsisContent } from '@/lib/mock/bidsynopsis.mock';

/**
 * Fetches bid synopsis data for a given tender
 * Currently returns mock data - will be replaced with actual API call
 */
export const fetchBidSynopsis = async (
  tenderId: string,
  tenderData?: BidSynopsisProps
): Promise<SynopsisContent> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For now, return mock data
  return generateMockSynopsisContent(tenderData || null);
};

/**
 * Saves bid synopsis data to localStorage
 */
export const saveBidSynopsis = (
  tenderId: string,
  data: BidSynopsisData
): void => {
  const storageKey = `bid-synopsis-${tenderId}`;
  const dataToSave = {
    ...data,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(storageKey, JSON.stringify(dataToSave));
};

/**
 * Loads bid synopsis data from localStorage
 */
export const loadBidSynopsis = (tenderId: string): Partial<BidSynopsisData> | null => {
  const storageKey = `bid-synopsis-${tenderId}`;
  const saved = localStorage.getItem(storageKey);
  
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved data', e);
      return null;
    }
  }
  
  return null;
};

/**
 * Exports bid synopsis to PDF
 * Placeholder for future implementation
 */
export const exportBidSynopsisToPDF = async (
  tenderId: string,
  data: BidSynopsisData
): Promise<void> => {
  // TODO: Implement PDF export functionality
  console.log('Exporting to PDF:', { tenderId, data });
  throw new Error('PDF export not yet implemented');
};

