import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Eye, EyeOff, FileText, Shield, Bot } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/common/BackButton";

interface DataField {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const initialDataFields: DataField[] = [
  { id: "name", label: "Name", description: "Hides all names and initials", enabled: false },
  { id: "email", label: "Emails", description: "Redacts email addresses", enabled: false },
  { id: "phone", label: "Phone Numbers", description: "Anonymizes contact numbers", enabled: false },
  { id: "address", label: "Addresses", description: "Removes physical addresses", enabled: false },
  { id: "dates", label: "Dates", description: "Redacts specific dates", enabled: false },
  { id: "financial", label: "Financial Information", description: "Hides account numbers, amounts", enabled: false },
  { id: "organization", label: "Organizations", description: "Removes company/org names", enabled: false },
  { id: "govt-id", label: "Government IDs", description: "Redacts SSN, license numbers", enabled: false },
  { id: "bank", label: "Bank Details", description: "Hides bank account info", enabled: false },
  { id: "medical", label: "Medical Information", description: "Anonymizes health records", enabled: false },
  { id: "biometric", label: "Biometric Data", description: "Removes fingerprints, facial data", enabled: false },
  { id: "geolocation", label: "Geolocation Data", description: "Redacts coordinates, locations", enabled: false },
  { id: "professional", label: "Professional Details", description: "Hides job titles, employers", enabled: false },
  { id: "ip", label: "IP Addresses", description: "Anonymizes network identifiers", enabled: false },
  { id: "vehicle", label: "Vehicle Information", description: "Redacts license plates, VINs", enabled: false },
  { id: "passport", label: "Passport Numbers", description: "Hides passport details", enabled: false },
];

export default function DocumentAnonymization() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProcessed, setIsProcessed] = useState(false);
  const [dataFields, setDataFields] = useState<DataField[]>(initialDataFields);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a PDF, DOC, or DOCX file");
        return;
      }

      setUploadedFile(file);
      setIsProcessed(false);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const toggleField = (id: string) => {
    setDataFields(dataFields.map(field => 
      field.id === id ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const handleAnonymize = () => {
    if (!uploadedFile) {
      toast.error("Please upload a document first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsProcessed(true);
          toast.success("Document anonymized successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownload = () => {
    toast.success("Downloading anonymized document...");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <BackButton to="/ceigalliq" />
          <h1 className="text-3xl font-bold text-foreground mb-2 mt-2">Document Anonymization</h1>
          <p className="text-muted-foreground">
            Automatically hide sensitive information from legal documents
          </p>
        </div>
        <Button onClick={() => navigate("/ask-ai")} variant="outline" className="gap-2">
          <Bot className="h-4 w-4" />
          Ask AI
        </Button>
      </div>

      {/* Step 1: Upload Document */}
      {!uploadedFile && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-violet" />
              Step 1: Upload Document
            </CardTitle>
            <CardDescription>
              Upload a PDF, DOC, or DOCX file to anonymize
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-violet/30 rounded-lg p-12 text-center hover:border-violet/50 transition-colors cursor-pointer bg-violet/5"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <FileText className="h-16 w-16 text-violet mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOC, DOCX (Max 10MB)
              </p>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure Anonymization with Side-by-Side Preview */}
      {uploadedFile && !isProcessed && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet" />
              Step 2: Choose Data to Anonymize
            </CardTitle>
            <CardDescription>
              Toggle switches to control which information to anonymize
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Info */}
            <div className="p-4 bg-violet/5 border border-violet/20 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-10 w-10 text-violet" />
                <div>
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle Switches Grid */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {dataFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 pr-3">
                    <Label 
                      htmlFor={field.id} 
                      className="cursor-pointer font-medium text-sm text-foreground"
                    >
                      {field.label}
                    </Label>
                  </div>
                  <Switch
                    id={field.id}
                    checked={field.enabled}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                </div>
              ))}
            </div>

            {/* Side-by-Side Document Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-violet" />
                Document Preview
              </h3>
              <Tabs defaultValue="original" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original Document</TabsTrigger>
                  <TabsTrigger value="anonymized">Anonymized Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="original" className="mt-4">
                  <div className="bg-background border border-border rounded-lg p-6 min-h-[400px] font-serif text-sm leading-relaxed">
                    <h4 className="font-bold mb-4">Sample Legal Document</h4>
                    <p className="mb-3">
                      This document pertains to <span className="font-semibold">John Doe</span>, residing at{" "}
                      <span className="font-semibold">123 Main Street, New Delhi, 110001</span>.
                    </p>
                    <p className="mb-3">
                      Contact: <span className="font-semibold">john.doe@email.com</span> | Phone:{" "}
                      <span className="font-semibold">+91-9876543210</span>
                    </p>
                    <p className="mb-3">
                      Date of filing: <span className="font-semibold">January 15, 2025</span>
                    </p>
                    <p className="mb-3">
                      Financial details: Account No. <span className="font-semibold">1234567890</span>, Bank:{" "}
                      <span className="font-semibold">State Bank of India</span>
                    </p>
                    <p className="mb-3">
                      Organization: <span className="font-semibold">ABC Corporation Pvt. Ltd.</span>
                    </p>
                    <p className="text-muted-foreground italic text-xs mt-6">
                      This is a sample preview. Actual document content will appear here.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="anonymized" className="mt-4">
                  <div className="bg-background border border-violet/30 rounded-lg p-6 min-h-[400px] font-serif text-sm leading-relaxed">
                    <h4 className="font-bold mb-4">Sample Legal Document</h4>
                    <p className="mb-3">
                      This document pertains to{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "name")?.enabled ? "[REDACTED]" : "John Doe"}
                      </span>, residing at{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "address")?.enabled ? "[REDACTED]" : "123 Main Street, New Delhi, 110001"}
                      </span>.
                    </p>
                    <p className="mb-3">
                      Contact:{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "email")?.enabled ? "[REDACTED]" : "john.doe@email.com"}
                      </span>{" "}
                      | Phone:{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "phone")?.enabled ? "[REDACTED]" : "+91-9876543210"}
                      </span>
                    </p>
                    <p className="mb-3">
                      Date of filing:{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "dates")?.enabled ? "[REDACTED]" : "January 15, 2025"}
                      </span>
                    </p>
                    <p className="mb-3">
                      Financial details: Account No.{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "financial")?.enabled ? "[REDACTED]" : "1234567890"}
                      </span>, Bank:{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "financial")?.enabled ? "[REDACTED]" : "State Bank of India"}
                      </span>
                    </p>
                    <p className="mb-3">
                      Organization:{" "}
                      <span className="font-semibold bg-violet/20 px-1">
                        {dataFields.find(f => f.id === "organization")?.enabled ? "[REDACTED]" : "ABC Corporation Pvt. Ltd."}
                      </span>
                    </p>
                    <p className="text-muted-foreground italic text-xs mt-6">
                      Highlighted areas show anonymized content. Toggle switches above to control visibility.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Button 
              onClick={handleAnonymize} 
              className="w-full gap-2 bg-gradient-to-r from-violet to-primary hover:opacity-90"
              disabled={isProcessing}
            >
              <Shield className="h-4 w-4" />
              {isProcessing ? "Processing..." : "Anonymize Document"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="shadow-card border-violet/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet animate-pulse" />
              Processing Document...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Analyzing and anonymizing sensitive information... {progress}%
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Download Result */}
      {isProcessed && (
        <Card className="shadow-card border-l-4 border-l-green bg-green/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green" />
              Document Anonymized Successfully!
            </CardTitle>
            <CardDescription>
              Your anonymized document is ready for download
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-10 w-10 text-green" />
                  <div>
                    <p className="font-medium text-foreground">
                      {uploadedFile?.name.replace(/\.(pdf|doc|docx)$/i, "_anonymized.$1")}
                    </p>
                    <p className="text-sm text-muted-foreground">Anonymized Document</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {dataFields.filter(f => f.enabled).length} field types anonymized
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {dataFields.filter(f => !f.enabled).length} field types visible
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleDownload} className="flex-1 gap-2 bg-gradient-to-r from-green to-success hover:opacity-90">
                <Download className="h-4 w-4" />
                Download Anonymized Document
              </Button>
              <Button 
                onClick={() => {
                  setUploadedFile(null);
                  setIsProcessed(false);
                  setProgress(0);
                }} 
                variant="outline"
                className="flex-1"
              >
                Process Another Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
