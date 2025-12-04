import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

const TenderTemplates = () => {
  const templates = [
    { id: 1, name: "Technical Bid Template", format: "DOCX" },
    { id: 2, name: "Financial Bid Template", format: "XLSX" },
    { id: 3, name: "Experience Certificate Format", format: "PDF" },
    { id: 4, name: "Bank Guarantee Format", format: "PDF" },
  ];

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{template.name}</CardTitle>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download {template.format}
              </Button>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default TenderTemplates;
