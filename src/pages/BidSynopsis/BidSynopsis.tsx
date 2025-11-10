import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getTenderById } from '@/data/sampleTenders';
import { fetchBidSynopsis, saveBidSynopsis, loadBidSynopsis } from '@/lib/api/bidsynopsis.api';
import { SynopsisContent } from '@/lib/types/bidsynopsis.types';
import BidSynopsisUI from './components/BidSynopsisUI';

export default function BidSynopsis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('edit');
  const [synopsisContent, setSynopsisContent] = useState<SynopsisContent | null>(null);
  const [ceigallData, setCeigallData] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const tender = id !== 'new' ? getTenderById(id || '') : null;

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      
      try {
        // Load saved data from localStorage
        const savedData = loadBidSynopsis(id);
        if (savedData?.ceigallData) {
          setCeigallData(savedData.ceigallData);
        }
        
        // Fetch synopsis content
        const content = await fetchBidSynopsis(id, {
          tenderId: id,
          tenderTitle: tender?.title,
          tenderAuthority: tender?.authority,
          tenderValue: tender?.value,
          tenderEmd: tender?.emd,
          tenderDueDate: tender?.dueDate,
          tenderLength: tender?.length,
        });
        
        setSynopsisContent(content);
      } catch (error) {
        console.error('Failed to load synopsis data:', error);
        toast({
          title: "Error",
          description: "Failed to load bid synopsis data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, tender]);

  const handleCeigallChange = (index: number, value: string) => {
    setCeigallData(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handleSave = () => {
    if (!id || !synopsisContent) return;
    
    saveBidSynopsis(id, {
      ceigallData,
      synopsisContent,
    });
    
    toast({
      title: "Saved",
      description: "Bid synopsis has been saved successfully",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export will be available soon",
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Document Uploaded",
        description: `${files.length} document(s) uploaded. Please fill in the extracted data manually.`,
      });
    }
  };

  if (isLoading || !synopsisContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading bid synopsis...</p>
        </div>
      </div>
    );
  }

  return (
    <BidSynopsisUI
      tenderTitle={tender?.title}
      synopsisContent={synopsisContent}
      ceigallData={ceigallData}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onCeigallChange={handleCeigallChange}
      onSave={handleSave}
      onExportPDF={handleExportPDF}
      onFileUpload={handleFileUpload}
    />
  );
}

