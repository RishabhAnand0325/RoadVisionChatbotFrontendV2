import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Calendar, 
  Upload, 
  Download,
  Clock,
  Scale,
  TrendingUp,
  FileText,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Sample cases data
const allCases = [
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

export default function CaseTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courtFilter, setCourtFilter] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState(1);

  const selectedCase = allCases.find(c => c.id === selectedCaseId) || allCases[0];

  const filteredCases = allCases.filter(caseItem => {
    const matchesSearch = 
      caseItem.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.courtName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || statusFilter === "all" || caseItem.litigationStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesCourt = !courtFilter || courtFilter === "all" || caseItem.courtName.toLowerCase().includes(courtFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCourt;
  });

  const handleAddCase = () => {
    toast.success("Add New Case form opened");
  };

  const handleScheduleHearing = () => {
    toast.success("Schedule Hearing form opened");
  };

  const handleDownloadDocument = (docName: string) => {
    toast.success(`Downloading ${docName}...`);
  };

  const handleUploadDocument = () => {
    toast.success("Upload Document dialog opened");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Case Tracker</h1>
          <p className="text-muted-foreground">
            Comprehensive case management and hearing tracking
          </p>
        </div>
        <Button className="gap-2" onClick={handleAddCase}>
          <Plus className="h-4 w-4" />
          Add New Case
        </Button>
      </div>

      {/* Summary Widgets */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{allCases.filter(c => c.litigationStatus !== "Closed").length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 text-success" /> {allCases.length} total cases
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Upcoming Hearings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8</div>
            <p className="text-xs text-muted-foreground mt-1">Next: 15-Nov-2025</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg. Case Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">4.8</div>
            <p className="text-xs text-muted-foreground mt-1">months</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{allCases.length}</div>
            <p className="text-xs text-muted-foreground mt-1">in database</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Case ID, Party Name, or Court..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under review">Under Review</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courtFilter} onValueChange={setCourtFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courts</SelectItem>
                  <SelectItem value="saket">Saket</SelectItem>
                  <SelectItem value="patiala">Patiala House</SelectItem>
                  <SelectItem value="chandigarh">Chandigarh</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Case Selector and Info Side by Side */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Case Selector - Left Side */}
        <Card className="shadow-md border-primary/20 lg:col-span-1">
          <CardHeader>
            <CardTitle>All Cases</CardTitle>
            <CardDescription>{filteredCases.length} cases found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredCases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedCaseId === caseItem.id ? 'border-primary border-2 bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedCaseId(caseItem.id)}
                >
                  <CardHeader className="pb-3 px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm">{caseItem.caseId}</CardTitle>
                      <Badge 
                        variant={caseItem.litigationStatus === "Closed" ? "secondary" : 
                                caseItem.litigationStatus === "Pending" ? "destructive" : "default"}
                        className="text-xs"
                      >
                        {caseItem.litigationStatus}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {caseItem.caseTitle}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Case Info - Right Side */}
        <div className="lg:col-span-2">

          {/* Case Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Case Overview</TabsTrigger>
              <TabsTrigger value="hearings">Hearings</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Case Overview */}
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Case Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Case Title</p>
                      <p className="font-medium text-foreground">{selectedCase.caseTitle}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Case ID</p>
                        <p className="font-medium text-foreground">{selectedCase.caseId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CNR Number</p>
                        <p className="font-medium text-foreground">{selectedCase.cnrNumber}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Filing Date</p>
                        <p className="font-medium text-foreground">{selectedCase.filingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Registration Date</p>
                        <p className="font-medium text-foreground">{selectedCase.registrationDate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Case Type</p>
                      <Badge>{selectedCase.caseType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant="outline" className="border-warning text-warning">
                        {selectedCase.litigationStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Court & Jurisdiction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Court Name</p>
                      <p className="font-medium text-foreground">{selectedCase.courtName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Court Number</p>
                        <p className="font-medium text-foreground">{selectedCase.courtNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Jurisdiction</p>
                        <p className="font-medium text-foreground">{selectedCase.jurisdiction}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Judge Name</p>
                      <p className="font-medium text-foreground">{selectedCase.judgeName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Case Stage</p>
                      <Badge variant="secondary">{selectedCase.caseStage}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Legal Provisions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Under Act(s)</p>
                      <p className="font-medium text-foreground">{selectedCase.underActs}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Section(s)</p>
                      <p className="font-medium text-foreground">{selectedCase.sections}</p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Police Station</p>
                      <p className="font-medium text-foreground">{selectedCase.policeStation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">FIR Number / Year</p>
                      <p className="font-medium text-foreground">{selectedCase.firNumber}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Parties & Advocates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Petitioner</p>
                      <p className="font-medium text-foreground">{selectedCase.petitioner}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Advocate: {selectedCase.petitionerAdvocate}
                      </p>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Respondent</p>
                      <p className="font-medium text-foreground">{selectedCase.respondent}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Advocate: {selectedCase.respondentAdvocate}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Hearings */}
            <TabsContent value="hearings" className="mt-6">
              <div className="space-y-6">
                {/* Hearing Dates Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">First Hearing Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedCase.hearings[0]?.date || "N/A"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Next Hearing Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">15-Nov-2025</p>
                      <p className="text-xs text-muted-foreground mt-1">In 19 days</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-muted-foreground">Total Hearings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground">{selectedCase.hearings.length}</p>
                    </CardContent>
                  </Card>
                </div>

            {/* Timeline Visualization */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Case Timeline</CardTitle>
                <CardDescription>Chronological view of all hearings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute top-6 left-6 bottom-6 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {selectedCase.hearings.map((hearing, index) => (
                      <div key={index} className="relative flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-primary relative z-10" />
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="p-4 rounded-lg bg-secondary">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-foreground">{hearing.date}</p>
                              <Badge variant="outline">{hearing.purpose}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">Judge: {hearing.judge}</p>
                            <p className="text-sm text-foreground">{hearing.outcome}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hearing History</CardTitle>
                    <CardDescription>Total Hearings: {selectedCase.hearings.length}</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2" onClick={handleScheduleHearing}>
                    <Calendar className="h-4 w-4" />
                    Schedule Hearing
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Judge</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCase.hearings.map((hearing, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{hearing.date}</TableCell>
                        <TableCell>{hearing.judge}</TableCell>
                        <TableCell>{hearing.purpose}</TableCell>
                        <TableCell>{hearing.outcome}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleDownloadDocument(hearing.document)}
                          >
                            <Download className="h-3 w-3" />
                            {hearing.document}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Case Documents</CardTitle>
                  <CardDescription>All uploaded documents for this case</CardDescription>
                </div>
                <Button className="gap-2" onClick={handleUploadDocument}>
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCase.documents.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Case Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm text-muted-foreground">
                        {allCases.filter(c => c.litigationStatus === "Pending").length} cases
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-warning" style={{ width: `${(allCases.filter(c => c.litigationStatus === "Pending").length / allCases.length) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Under Review</span>
                      <span className="text-sm text-muted-foreground">
                        {allCases.filter(c => c.litigationStatus === "Under Review").length} cases
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(allCases.filter(c => c.litigationStatus === "Under Review").length / allCases.length) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Closed</span>
                      <span className="text-sm text-muted-foreground">
                        {allCases.filter(c => c.litigationStatus === "Closed").length} cases
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-success" style={{ width: `${(allCases.filter(c => c.litigationStatus === "Closed").length / allCases.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-primary/20">
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>[AI Inference Placeholder]</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium text-foreground mb-1">Average Case Duration</p>
                  <p className="text-2xl font-bold text-primary">4.8 months</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on historical data</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm font-medium text-foreground mb-1">Most Frequent Court</p>
                  <p className="text-lg font-semibold text-foreground">Saket District Court, Delhi</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary">
                  <p className="text-sm font-medium text-foreground mb-1">Success Rate</p>
                  <p className="text-lg font-semibold text-success">67% in favor</p>
                  <p className="text-xs text-muted-foreground mt-1">In disposed cases</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
}
