import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileEdit, Clock, CheckCircle } from "lucide-react";

interface DraftRFPProps {
  onBack: () => void;
}

const DraftRFP = ({ onBack }: DraftRFPProps) => {
  const features = [
    "Smart Template Generation",
    "Clause Library",
    "Compliance Checker",
    "Export & Collaboration"
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
          <h1 className="text-2xl font-bold">Draft RFP</h1>
          <p className="text-sm text-muted-foreground">AI-powered RFP document generation</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <FileEdit className="h-10 w-10 text-white" />
              </div>
            </div>
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                <Clock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <CardTitle className="text-2xl">RFP Drafting Module</CardTitle>
            <CardDescription className="text-base mt-2">
              We're working on bringing you powerful AI-assisted RFP drafting capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-left space-y-3">
              <h3 className="font-semibold text-lg">Upcoming Features:</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={onBack} className="w-full">
              Explore Other Modules
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DraftRFP;
