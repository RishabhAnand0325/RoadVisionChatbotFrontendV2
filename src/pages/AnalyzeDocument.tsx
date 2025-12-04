import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeDocument } from "@/lib/api/analyze-document";
import { DocumentAnalysisResult } from "@/lib/types/analyze-document";
import { AnalyzeDocumentUI } from "@/components/analyze-document/AnalyzeDocumentUI";

export default function AnalyzeDocument() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DocumentAnalysisResult | null>(null);

  const handleUpload = async () => {
    setIsAnalyzing(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate file upload - in real implementation, get file from input
    const mockFile = new File([], "document.pdf");
    const analysisResult = await analyzeDocument(mockFile);
    
    clearInterval(interval);
    setIsAnalyzing(false);
    setIsAnalyzed(true);
    setResult(analysisResult);
  };

  const handleUploadAnother = () => {
    setIsAnalyzed(false);
    setResult(null);
  };

  return (
    <AnalyzeDocumentUI
      isAnalyzing={isAnalyzing}
      isAnalyzed={isAnalyzed}
      progress={progress}
      result={result}
      onUpload={handleUpload}
      onUploadAnother={handleUploadAnother}
      onNavigate={navigate}
    />
  );
}
