import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface BidEvaluateProps {
  onBack: () => void;
}

const BidEvaluate = ({ onBack }: BidEvaluateProps) => {
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setHasEvaluated(true);
    }, 4000);
  };

  const documents = [
    { name: "Technical Bid", status: "complete", issues: [] },
    { name: "Financial Bid", status: "complete", issues: [] },
    { name: "Experience Certificates", status: "incomplete", issues: ["Missing certificate for project worth ₹10 Cr+"] },
    { name: "Bank Guarantee", status: "complete", issues: [] },
    { name: "Tax Registrations", status: "incomplete", issues: ["GST certificate expired"] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Evaluate Bid</h1>
          <p className="text-sm text-muted-foreground">Check bid completeness and eligibility</p>
        </div>
      </div>

      {!hasEvaluated ? (
        <>
          {/* Upload Areas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload RFP Document</CardTitle>
                <CardDescription>Upload the tender/RFP document</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Upload RFP/Tender document</p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Bid Documents</CardTitle>
                <CardDescription>Upload all bid documents for evaluation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Upload bid documents (multiple files allowed)</p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" onClick={handleEvaluate} disabled={isEvaluating}>
                {isEvaluating ? "Evaluating..." : "Evaluate Bid"}
              </Button>
            </div>

            {isEvaluating && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Analyzing bid documents...</p>
                    <Progress value={66} />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Evaluation Results */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Completeness</p>
                  <p className="text-2xl font-bold">75%</p>
                  <Progress value={75} className="mt-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eligibility Status</p>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 mt-2">
                    Conditional
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Missing Documents</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Document Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {doc.status === "complete" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{doc.name}</p>
                    {doc.issues.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {doc.issues.map((issue, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4 mt-0.5" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge variant={doc.status === "complete" ? "default" : "destructive"}>
                    {doc.status === "complete" ? "Complete" : "Incomplete"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>Obtain and submit missing experience certificate for project worth ₹10 Cr+</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <span>Renew GST registration certificate before submission</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BidEvaluate;
