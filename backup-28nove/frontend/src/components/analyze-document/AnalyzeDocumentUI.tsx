import { Upload, FileText, AlertTriangle, CheckCircle, Download, FileEdit, Bot } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DocumentAnalysisResult } from "@/lib/types/analyze-document";
import { BackButton } from "@/components/common/BackButton";

interface AnalyzeDocumentUIProps {
  isAnalyzing: boolean;
  isAnalyzed: boolean;
  progress: number;
  result: DocumentAnalysisResult | null;
  onUpload: () => void;
  onUploadAnother: () => void;
  onNavigate: (path: string) => void;
}

export function AnalyzeDocumentUI({
  isAnalyzing,
  isAnalyzed,
  progress,
  result,
  onUpload,
  onUploadAnother,
  onNavigate,
}: AnalyzeDocumentUIProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <BackButton to="/legaliq" />
          <h1 className="text-3xl font-bold text-foreground mt-2">Analyze Document</h1>
          <p className="text-muted-foreground mt-1">Upload legal documents for AI-powered analysis</p>
        </div>
        {isAnalyzed && (
          <div className="flex gap-2">
            <Button onClick={() => onNavigate("/ask-ai")} variant="outline" className="gap-2">
              <Bot className="h-4 w-4" />
              Ask LegalAI
            </Button>
            <Button onClick={onUploadAnother} variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Another
            </Button>
          </div>
        )}
      </div>

      {!isAnalyzed ? (
        <Card className="border-2 border-dashed border-primary/30 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Legal Document</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Drag and drop your document here, or click to browse. Supported formats: PDF, DOC, DOCX
            </p>
            <Button onClick={onUpload} className="gap-2" size="lg">
              <FileText className="h-4 w-4" />
              Choose File
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {isAnalyzing && (
        <Card className="shadow-md">
          <CardContent className="py-12">
            <div className="text-center mb-6">
              <div className="inline-flex h-16 w-16 rounded-full bg-primary/10 items-center justify-center mb-4 animate-pulse">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyzing with LegalGPT...</h3>
              <p className="text-muted-foreground">Processing your document using AI</p>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {isAnalyzed && result && (
        <div className="space-y-6">
          {/* Risk Rating */}
          <Card className="shadow-md border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Badge className="bg-warning text-white text-lg px-4 py-2">
                  {result.riskLevel.toUpperCase()} RISK
                </Badge>
                <p className="text-muted-foreground">{result.riskMessage}</p>
              </div>
            </CardContent>
          </Card>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Extracted Facts */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Extracted Case Facts</CardTitle>
                <CardDescription>[AI Extracted from Document]</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Parties</label>
                  <p className="text-foreground">{result.extractedFacts.parties}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Issue Summary</label>
                  <p className="text-foreground">{result.extractedFacts.issueSummary}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contract Date</label>
                  <p className="text-foreground">{result.extractedFacts.contractDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Key Clauses Identified</label>
                  <div className="space-y-1 mt-1">
                    {result.extractedFacts.keyClauses.map((clause, idx) => (
                      <p key={idx} className="text-sm">• {clause}</p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Summary */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>AI-Generated Summary</CardTitle>
                <CardDescription>Intelligent document overview</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{result.aiSummary}</p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Analysis Details */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Detailed Risk Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.riskAnalysis.map((risk, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                      risk.level === "high"
                        ? "bg-destructive/5 border border-destructive/20"
                        : risk.level === "medium"
                        ? "bg-warning/5 border border-warning/20"
                        : "bg-success/5 border border-success/20"
                    }`}
                  >
                    {risk.level === "low" ? (
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <AlertTriangle
                        className={`h-5 w-5 mt-0.5 ${
                          risk.level === "high" ? "text-destructive" : "text-warning"
                        }`}
                      />
                    )}
                    <div>
                      <h4
                        className={`font-semibold ${
                          risk.level === "high"
                            ? "text-destructive"
                            : risk.level === "medium"
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {risk.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Next Steps */}
          <Card className="shadow-md border-primary/20">
            <CardHeader>
              <CardTitle>Suggested Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.nextSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <p className="text-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" size="lg">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" className="gap-2" size="lg" onClick={() => onNavigate("/drafting")}>
              <FileEdit className="h-4 w-4" />
              Generate Draft Reply
            </Button>
            <Button variant="outline" className="gap-2" size="lg">
              <Download className="h-4 w-4" />
              Download All PDFs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
