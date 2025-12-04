import { HistoryPageResponse } from "../types/wishlist";

export let mockHistoryPageResponse: HistoryPageResponse = {
  report_file_url: '',
  tenders: [
    {
      id: "1",
      title: "Construction of 4-Lane highway from Jaipur to Ajmer (NH-8)",
      authority: "National Highways Authority of India (NHAI)",
      value: 450000000,
      emd: 9000000,
      due_date: "15 Dec",
      category: "Highway Construction",
      progress: 60,
      analysis_state: true,
      synopsis_state: false,
      evaluated_state: false,
      results: "pending",
    },
    {
      id: "2",
      title: "Design and construction of Metro Rail Via duct - Phase 3",
      authority: "Delhi Metro Rail Corporation (DMRC)",
      value: 450000000,
      emd: 9000000,
      due_date: "15 Dec",
      category: "Highway Construction",
      progress: 60,
      analysis_state: true,
      synopsis_state: false,
      evaluated_state: false,
      results: "pending",
    },
    {
      id: "3",
      title: "Construction of major bridge over River Narmada",
      authority: "Public Works Department, Gujarat",
      value: 450000000,
      emd: 9000000,
      due_date: "15 Dec",
      category: "Highway Construction",
      progress: 60,
      analysis_state: true,
      synopsis_state: false,
      evaluated_state: false,
      results: "pending",
    },
  ]
}
