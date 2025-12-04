import { DocumentAnalysisResult } from "@/lib/types/analyze-document";

const API_BASE_URL = "/api/v1";

export async function analyzeDocument(file: File): Promise<DocumentAnalysisResult> {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // const response = await fetch(`${API_BASE_URL}/analyze-document`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // return response.json();

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Hardcoded data for now
  return {
    riskLevel: "medium",
    riskMessage: "2 high-priority clauses require attention",
    extractedFacts: {
      parties: "ABC Infrastructure Ltd. vs. XYZ Contractors",
      issueSummary: "Breach of contract regarding project timeline and quality standards",
      contractDate: "January 15, 2024",
      keyClauses: [
        "Clause 7.2 - Liquidated Damages",
        "Clause 12.4 - Force Majeure",
        "Clause 15.1 - Dispute Resolution"
      ],
    },
    aiSummary: "[AI Inference Placeholder] This contract dispute centers on alleged breaches of timeline commitments and quality deliverables. The petitioner claims delays exceeding 90 days beyond the agreed completion date. Key risk areas include potential liquidated damages under Clause 7.2, which specifies 0.5% per week of delay. Force majeure provisions may provide partial defense. Recommend immediate review of documentary evidence and consideration of mediation per Clause 15.1 before formal arbitration.",
    riskAnalysis: [
      {
        level: "high",
        title: "High Risk - Liquidated Damages",
        description: "Potential liability of ₹45 lakhs based on 90-day delay at 0.5% weekly rate",
      },
      {
        level: "medium",
        title: "Medium Risk - Quality Standards",
        description: "Disputed quality benchmarks lack clear documentation in original agreement",
      },
      {
        level: "low",
        title: "Low Risk - Dispute Mechanism",
        description: "Well-defined arbitration clause provides clear path for resolution",
      },
    ],
    nextSteps: [
      "Draft formal reply to notice within 15 days",
      "Compile documentary evidence of force majeure events",
      "Consider mediation before formal arbitration proceedings",
    ],
  };
}
