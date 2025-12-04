import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Building, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TenderUploadProps {
  onAnalyzed: () => void;
}

const TenderUpload = ({ onAnalyzed }: TenderUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (file: File) => {
    setIsAnalyzing(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate analysis
    setTimeout(() => {
      clearInterval(interval);
      toast({
        title: "Analysis Complete",
        description: "Tender document has been analyzed successfully.",
      });
      onAnalyzed();
    }, 3000);
  };

  const sampleDocuments = [
    {
      id: 1,
      title: "PWD Road Construction Tender 2024",
      authority: "Public Works Department, Karnataka",
      value: "₹15 Cr",
    },
    {
      id: 2,
      title: "NHAI Bridge Construction RFP",
      authority: "National Highways Authority of India",
      value: "₹8 Cr",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analyze Tender Document</h2>
        <p className="text-muted-foreground">Upload your tender document for comprehensive AI-powered analysis</p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>Supported formats: PDF, DOC, DOCX, ZIP, RAR, 7Z</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragOver ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {isAnalyzing ? "Analyzing Document..." : "Drag and drop your file here"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.zip,.rar,.7z"
              onChange={handleFileInput}
              disabled={isAnalyzing}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" disabled={isAnalyzing} asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>

          {isAnalyzing && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzing tender document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Try Sample Documents</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {sampleDocuments.map((doc) => (
            <Card key={doc.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onAnalyzed()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-base">{doc.title}</CardTitle>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{doc.authority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4" />
                    <span className="font-semibold text-green-600">{doc.value}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Analyze This Document</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenderUpload;
