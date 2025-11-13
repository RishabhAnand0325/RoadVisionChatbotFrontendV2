import { BidSynopsisData, BidSynopsisProps, SynopsisContent } from '@/lib/types/bidsynopsis.types';
import { generateMockSynopsisContent } from '@/lib/mock/bidsynopsis.mock';
import { API_BASE_URL } from '../config/api';

/**
 * Fetches bid synopsis data for a given tender
 * Currently returns mock data - will be replaced with actual API call
 */
export const fetchBidSynopsis = async (
  tenderId: string,
  tenderData?: BidSynopsisProps
): Promise<SynopsisContent> => {
  const url = `${API_BASE_URL}/bidsynopsis/synopsis/${tenderId}`;
  console.log(`Fetching bid synopsis for tender ${tenderId} from:`, url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch bid synopsis: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log(`Bid synopsis for tender ${tenderId} successful:`, data);
    return data;
  } catch (e) {
    console.error(`Error in fetchBidSynopsis for tender ${tenderId}:`, e);
    return null
  }
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
export const loadBidSynopsis = async (tenderId: string): Promise<BidSynopsisData | null> => {
  const url = `${API_BASE_URL}/bidsynopsis/synopsis/${tenderId}`;
  console.log(`Fetching bid synopsis for tender ${tenderId} from:`, url);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch bid synopsis: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    console.log(`Bid synopsis for tender ${tenderId} successful:`, data);
    return data;
  } catch (e) {
    console.error(`Error in fetchBidSynopsis for tender ${tenderId}:`, e);
    return null
  }
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

