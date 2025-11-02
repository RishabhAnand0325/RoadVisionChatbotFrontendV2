export interface Tender {
  id: number;
  organization: string;
  tdrNumber: string;
  description: string;
  tenderValue: string;
  dueDate: string;
  location: string;
  category: string;
  scrapedDate: string;
  driveUrl?: string;
}

export interface HistoryTender {
  id: number;
  tenderNo: string;
  title: string;
  authority: string;
  value: string;
  submissionDate: string;
  analysisDate: string;
  status: "Under Evaluation" | "Submitted" | "Analysis Complete" | "Bid Lost" | "Won";
  category: string;
  starred: boolean;
  progress: number;
}

export interface ComparisonClause {
  section: string;
  clauseNumber: string;
  title: string;
  originalText: string;
  amendedText: string;
  changeType: "adverse" | "positive" | "neutral";
  impact: string;
  recommendation: string;
}

export interface ComparisonResult {
  overallRisk: "Medium" | "High" | "Low";
  totalChanges: number;
  adverseChanges: number;
  positiveChanges: number;
  clauses: ComparisonClause[];
}

export interface BidDocument {
  name: string;
  status: "complete" | "incomplete";
  issues: string[];
}

export interface EvaluationResult {
  completeness: number;
  eligibility: "Qualified" | "Not Qualified";
  missingDocuments: string[];
  providedDocuments: BidDocument[];
  recommendations: string[];
}
