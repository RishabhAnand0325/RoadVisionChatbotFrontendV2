import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, MessageCircle, Upload } from "lucide-react";
import TenderOnePager from "./TenderOnePager";
import TenderScopeOfWork from "./TenderScopeOfWork";
import TenderSections from "./TenderSections";
import TenderDataSheet from "./TenderDataSheet";
import TenderTemplates from "./TenderTemplates";

interface TenderAnalysisViewProps {
  onBack: () => void;
}

const TenderAnalysisView = ({ onBack }: TenderAnalysisViewProps) => {
  const [activeTab, setActiveTab] = useState("onepager");

  const handleDownloadPDF = () => {
    // PDF download would be implemented here
    console.log("Downloading PDF...");
  };

  const handleAskAI = () => {
    // AI dialog would open here
    console.log("Opening AI chat...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Tender Analysis</h1>
            <p className="text-sm text-muted-foreground">PWD/NH-44/2024/ROAD/001</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download All PDF
          </Button>
          <Button variant="outline" onClick={handleAskAI}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
          <Button onClick={onBack}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Another
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="onepager">One Pager</TabsTrigger>
          <TabsTrigger value="scope">Scope of Work</TabsTrigger>
          <TabsTrigger value="sections">RFP Sections</TabsTrigger>
          <TabsTrigger value="datasheet">Data Sheet</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="onepager">
          <TenderOnePager />
        </TabsContent>
        <TabsContent value="scope">
          <TenderScopeOfWork />
        </TabsContent>
        <TabsContent value="sections">
          <TenderSections />
        </TabsContent>
        <TabsContent value="datasheet">
          <TenderDataSheet />
        </TabsContent>
        <TabsContent value="templates">
          <TenderTemplates />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenderAnalysisView;
