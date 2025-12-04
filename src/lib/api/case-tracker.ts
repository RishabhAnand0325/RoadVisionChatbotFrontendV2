import { CaseTrackerData, Case } from "@/lib/types/case-tracker";

const API_BASE_URL = "/api/v1";

const allCases: Case[] = [
  {
    id: 1,
    caseTitle: "ABC Infrastructure Ltd. vs XYZ Construction Co.",
    caseId: "CC/2025/38572",
    filingNumber: "FN/2025/12345",
    filingDate: "2025-01-15",
    registrationNumber: "RN/2025/98765",
    registrationDate: "2025-01-20",
    cnrNumber: "DLCT01-012345-2025",
    caseType: "Contract Dispute",
    jurisdiction: "Delhi",
    courtName: "Saket District Court",
    courtNumber: "Court No. 12",
    judgeName: "Hon'ble Justice Rajesh Kumar",
    caseStage: "For Argument",
    litigationStatus: "Pending",
    underActs: "Indian Contract Act, 1872",
    sections: "Section 73, Section 74",
    policeStation: "N/A",
    firNumber: "N/A",
    petitioner: "ABC Infrastructure Ltd.",
    petitionerAdvocate: "Adv. Sharma & Associates",
    respondent: "XYZ Construction Co.",
    respondentAdvocate: "Adv. Verma Legal Services",
    hearings: [
      {
        date: "2025-01-20",
        judge: "Justice Rajesh Kumar",
        purpose: "First Hearing - Admission",
        outcome: "Notice issued to respondent",
        document: "Order_20Jan2025.pdf",
      },
      {
        date: "2025-02-15",
        judge: "Justice Rajesh Kumar",
        purpose: "Arguments - Petitioner",
        outcome: "Arguments heard, adjourned",
        document: "Order_15Feb2025.pdf",
      },
      {
        date: "2025-03-10",
        judge: "Justice Rajesh Kumar",
        purpose: "Arguments - Respondent",
        outcome: "Reply filed, matter reserved",
        document: "Reply_10Mar2025.pdf",
      },
    ],
    documents: [
      { name: "Petition.pdf", uploadDate: "2025-01-15", type: "Petition" },
      { name: "Contract_Agreement.pdf", uploadDate: "2025-01-15", type: "Evidence" },
      { name: "Reply_Notice.pdf", uploadDate: "2025-02-10", type: "Reply" },
      { name: "Court_Order_Latest.pdf", uploadDate: "2025-03-10", type: "Order" },
    ],
  },
  {
    id: 2,
    caseTitle: "National Highway Authority vs Metro Contractors Pvt. Ltd.",
    caseId: "CC/2024/27384",
    filingNumber: "FN/2024/98765",
    filingDate: "2024-08-10",
    registrationNumber: "RN/2024/54321",
    registrationDate: "2024-08-15",
    cnrNumber: "DLCT02-098765-2024",
    caseType: "Payment Dispute",
    jurisdiction: "Delhi",
    courtName: "Patiala House Court",
    courtNumber: "Court No. 8",
    judgeName: "Hon'ble Justice Meera Desai",
    caseStage: "For Judgment",
    litigationStatus: "Under Review",
    underActs: "Arbitration and Conciliation Act, 1996",
    sections: "Section 34, Section 36",
    policeStation: "N/A",
    firNumber: "N/A",
    petitioner: "National Highway Authority",
    petitionerAdvocate: "Adv. Kumar Legal Associates",
    respondent: "Metro Contractors Pvt. Ltd.",
    respondentAdvocate: "Adv. Patel & Co.",
    hearings: [
      {
        date: "2024-08-15",
        judge: "Justice Meera Desai",
        purpose: "First Hearing - Notice",
        outcome: "Notice issued, reply sought",
        document: "Order_15Aug2024.pdf",
      },
      {
        date: "2024-09-20",
        judge: "Justice Meera Desai",
        purpose: "Final Arguments",
        outcome: "Matter reserved for judgment",
        document: "Order_20Sep2024.pdf",
      },
    ],
    documents: [
      { name: "Petition_Payment.pdf", uploadDate: "2024-08-10", type: "Petition" },
      { name: "Payment_Records.pdf", uploadDate: "2024-08-10", type: "Evidence" },
      { name: "Respondent_Reply.pdf", uploadDate: "2024-09-05", type: "Reply" },
    ],
  },
  {
    id: 3,
    caseTitle: "State of Haryana vs Road Builders Infrastructure",
    caseId: "CC/2024/19283",
    filingNumber: "FN/2024/45678",
    filingDate: "2024-05-20",
    registrationNumber: "RN/2024/87654",
    registrationDate: "2024-05-25",
    cnrNumber: "HRCT01-045678-2024",
    caseType: "Contractual Breach",
    jurisdiction: "Haryana",
    courtName: "Chandigarh District Court",
    courtNumber: "Court No. 5",
    judgeName: "Hon'ble Justice Anil Verma",
    caseStage: "Disposed",
    litigationStatus: "Closed",
    underActs: "Indian Contract Act, 1872; Transfer of Property Act, 1882",
    sections: "Section 55, Section 73",
    policeStation: "Sector 17 PS",
    firNumber: "FIR/2024/156",
    petitioner: "State of Haryana",
    petitionerAdvocate: "Govt. Standing Counsel",
    respondent: "Road Builders Infrastructure",
    respondentAdvocate: "Adv. Singh & Partners",
    hearings: [
      {
        date: "2024-05-25",
        judge: "Justice Anil Verma",
        purpose: "First Hearing",
        outcome: "Admission granted",
        document: "Order_25May2024.pdf",
      },
      {
        date: "2024-06-15",
        judge: "Justice Anil Verma",
        purpose: "Evidence Hearing",
        outcome: "Evidence recorded",
        document: "Order_15Jun2024.pdf",
      },
      {
        date: "2024-07-20",
        judge: "Justice Anil Verma",
        purpose: "Final Judgment",
        outcome: "Judgment in favor of petitioner",
        document: "Judgment_20Jul2024.pdf",
      },
    ],
    documents: [
      { name: "State_Petition.pdf", uploadDate: "2024-05-20", type: "Petition" },
      { name: "Contract_Evidence.pdf", uploadDate: "2024-05-20", type: "Evidence" },
      { name: "Final_Judgment.pdf", uploadDate: "2024-07-20", type: "Judgment" },
    ],
  },
];

export async function getCaseTrackerData(): Promise<CaseTrackerData> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/case-tracker`);
  // return response.json();

  // Hardcoded data for now
  const activeCases = allCases.filter(c => c.litigationStatus !== "Closed");
  
  return {
    cases: allCases,
    totalActiveCases: activeCases.length,
    upcomingHearings: 8,
    avgCaseDuration: 4.8,
  };
}

export async function getCaseById(id: number): Promise<Case | undefined> {
  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/case-tracker/cases/${id}`);
  // return response.json();

  // Hardcoded data for now
  return allCases.find(c => c.id === id);
}
