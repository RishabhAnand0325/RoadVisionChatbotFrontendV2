import { API_BASE_URL } from "../config/api";
import { mockHistoryPageResponse } from "../mock/wishlist";
import { HistoryPageResponse, WishlistReportData } from "../types/wishlist";
import { getAuthHeaders } from "./authHelper";
import { apiRequest, apiRequestWithoutBody } from "./apiClient";

{/*
Endpoint: {api_root}/tenderiq/history-wishlist
Request Method: GET
Parameters: None
Response: JSON
```
{
  "report_file_url": "https://example.com/report.xlsx", // Excel file
  "tenders": [
    {
      "id": "1", // string
      "title": "Tender 1", // string
      "authority": "Authority 1", // string
      "value": 100000, // number
      "emd": 50000, // number
      "due_date": "15 Dec", // string
      "category": "Category 1", // string
      "progress": 50, // number
      "analysis_state": true, // boolean
      "synopsis_state": false, // boolean
      "evaluated_state": false, // boolean
      "results": "pending" // "won" | "rejected" | "incomplete" | "pending"
    }
  ]
}
```
*/}
export async function getHistoryWishlistData(): Promise<HistoryPageResponse> {
  // return mockHistoryPageResponse;
  try {
    const data = await apiRequest<HistoryPageResponse>(
      `${API_BASE_URL}/tenderiq/history-wishlist`, 
      { headers: getAuthHeaders() }
    );
    console.log(data)
    return data;
  } catch (error) {
    console.error(error)
    return mockHistoryPageResponse;
  }
}

/**
 * Update the results status of a wishlisted tender
 * @param wishlistId - The ID of the wishlist entry
 * @param results - The new results status (won, rejected, incomplete, pending)
 */
export async function updateWishlistTenderResults(
  wishlistId: string, 
  results: 'won' | 'rejected' | 'incomplete' | 'pending'
): Promise<void> {
  try {
    await apiRequestWithoutBody(
      `${API_BASE_URL}/tenderiq/wishlist/${wishlistId}/results/${results}`,
      {
        method: 'PATCH',
        headers: getAuthHeaders()
      }
    );
  } catch (error) {
    console.error('Error updating wishlist tender results:', error);
    throw error;
  }
}

/**
 * Placeholder function for server-side PDF export
 * Currently not used - client-side PDF generation via react-to-print is preferred
 * Future enhancement: Implement if server-side PDF generation is required
 */
export const exportWishlistReportToPDF = async (
  reportData: WishlistReportData
): Promise<void> => {
  // TODO: Implement PDF export functionality (server-side)
  console.log('Exporting wishlist report to PDF:', reportData);
  throw new Error('PDF export not yet implemented');
};
