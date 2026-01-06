import { HistoryTender } from '@/lib/types/tenderiq';

/**
 * Mock/sample tender history data
 * This can be replaced with API calls in the future
 */
export const sampleTenderHistory: HistoryTender[] = [
  {
    id: 1,
    tenderNo: "PWD/NH-44/2024/ROAD/001",
    title: "Highway Construction & Maintenance - NH44",
    authority: "Public Works Department, Karnataka",
    value: "₹15.5 Cr",
    submissionDate: "25 Apr 2024",
    analysisDate: "15 Mar 2024",
    status: "Under Evaluation",
    category: "Road Construction",
    starred: true,
    progress: 85
  },
  {
    id: 2,
    tenderNo: "NHAI/BR/2024/003",
    title: "Steel Bridge Construction Project",
    authority: "National Highways Authority of India",
    value: "₹8.2 Cr",
    submissionDate: "10 May 2024",
    analysisDate: "20 Mar 2024",
    status: "Submitted",
    category: "Bridge Construction",
    starred: false,
    progress: 100
  },
  {
    id: 3,
    tenderNo: "MCD/URB/2024/012",
    title: "Urban Road Development Phase 2",
    authority: "Municipal Corporation, Delhi",
    value: "₹22.8 Cr",
    submissionDate: "30 Apr 2024",
    analysisDate: "25 Feb 2024",
    status: "Analysis Complete",
    category: "Urban Development",
    starred: true,
    progress: 65
  },
  {
    id: 4,
    tenderNo: "MORTH/NH/2024/045",
    title: "National Highway Expansion Project",
    authority: "Ministry of Road Transport",
    value: "₹45.0 Cr",
    submissionDate: "15 Mar 2024",
    analysisDate: "10 Jan 2024",
    status: "Bid Lost",
    category: "Highway Construction",
    starred: false,
    progress: 100
  },
  {
    id: 5,
    tenderNo: "PWD/KA/2024/089",
    title: "Rural Road Connectivity Scheme",
    authority: "Public Works Department, Karnataka",
    value: "₹12.3 Cr",
    submissionDate: "20 Jun 2024",
    analysisDate: "15 Apr 2024",
    status: "Won",
    category: "Rural Development",
    starred: true,
    progress: 100
  }
];

/**
 * Tender history statistics
 */
export const tenderHistoryStats = [
  {
    label: "Total Analyzed",
    value: "5",
    icon: "FileText",
    color: "text-blue-600"
  },
  {
    label: "Tenders Won",
    value: "1",
    icon: "Building",
    color: "text-green-600"
  },
  {
    label: "Total Value",
    value: "₹62.7 Cr",
    icon: "IndianRupee",
    color: "text-purple-600"
  },
  {
    label: "Pending Results",
    value: "1",
    icon: "Calendar",
    color: "text-amber-600"
  }
];
