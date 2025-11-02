import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, FileText, AlertTriangle, CheckCircle } from "lucide-react";

interface TenderCompareProps {
  onBack: () => void;
}

const TenderCompare = ({ onBack }: TenderCompareProps) => {
  const [hasCompared, setHasCompared] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Compare Tender Documents</h1>
          <p className="text-sm text-muted-foreground">Identify key differences between two tender versions</p>
        </div>
      </div>

      {!hasCompared ? (
        <>
          {/* Upload Areas */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document 1</CardTitle>
                <CardDescription>Original RFP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Upload first document</p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Document 2</CardTitle>
                <CardDescription>Amended RFP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">Upload second document</p>
                  <Button variant="outline">Browse Files</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button size="lg" onClick={() => setHasCompared(true)}>
              Compare Documents
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Comparison Results */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Changes</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adverse Changes</p>
                  <p className="text-2xl font-bold text-red-600">5</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Risk</p>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 mt-2">
                    Medium
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Changes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Changes Identified</h3>
            
            <Card className="border-l-4 border-red-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-base">Submission Deadline Reduced</CardTitle>
                    <CardDescription className="mt-2">
                      <span className="font-semibold">Original:</span> 30 days from publication<br />
                      <span className="font-semibold">Amended:</span> 15 days from publication
                    </CardDescription>
                  </div>
                  <Badge variant="destructive">Adverse</Badge>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                  <div className="flex-1">
                    <CardTitle className="text-base">EMD Requirement Reduced</CardTitle>
                    <CardDescription className="mt-2">
                      <span className="font-semibold">Original:</span> ₹50 Lakhs<br />
                      <span className="font-semibold">Amended:</span> ₹31 Lakhs
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Positive</Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default TenderCompare;
