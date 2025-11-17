
import { NavigateFunction } from 'react-router-dom';
import { LucideProps } from 'lucide-react';
import { Tender } from './tenderiq.types';

export interface WishlistItem extends Tender {
  addedAt: string; // ISO date string
}

export interface HistoryItem extends Tender {
  viewedAt: string; // ISO date string
  lastAction: 'viewed' | 'analyzed' | 'downloaded';
}

export interface WishlistResponse {
  count: number;
  items: WishlistItem[];
}

export interface HistoryResponse {
  count: number;
  items: HistoryItem[];
}

export interface HistoryData {
  id: string;
  title: string;
  authority: string;
  value: number;
  emd: number;
  due_date: string;
  category: string;
  progress: number;
  analysis_state: string;
  synopsis_state: boolean;
  evaluated_state: boolean;
  results: "won" | "rejected" | "incomplete" | "pending";
}

export interface HistoryPageResponse {
  report_file_url: string;
  tenders: HistoryData[];
}

export interface WishlistHistoryUIProps {
  navigate: NavigateFunction;
  data: HistoryPageResponse;
  handleViewTender: (id: string) => void;
  handleRemoveFromWishlist: (id: string) => Promise<void>;
}

export interface MetadataCardProps {
  title: string;
  value: string;
  LucideIcon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  description: string;
}

// Report-related types
export interface ReportMetrics {
  totalSaved: number;
  totalAnalyzed: number;
  totalWon: number;
  totalRejected: number;
  totalIncomplete: number;
  totalPending: number;
  totalTenderValue: number;
  averageTenderValue: number;
  totalEMD: number;
  averageEMD: number;
}

export interface WishlistReportTableRow extends HistoryData {
  formattedValue: string;
  formattedEMD: string;
  statusLabel: string;
  analysisStateLabel: string;
}

export interface WishlistReportData {
  metrics: ReportMetrics;
  tenders: WishlistReportTableRow[];
  generatedAt: string;
  totalCount: number;
}

export interface WishlistReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: WishlistReportData;
  onExportToPDF: () => void;
  isExporting?: boolean;
}
