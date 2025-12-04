import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchTenderAnalysis, downloadAnalysisReport, triggerTenderAnalysis } from '@/lib/api/analyze.api';
import { TenderAnalysisResponse } from '@/lib/types/analyze.type';
import { useToast } from '@/hooks/use-toast';
import AnalyzeTenderUI from './components/AnalyzeTenderUI';

export default function AnalyzeTender() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('one-pager');

  // Get return path from state if provided
  const returnPath = (location.state as any)?.returnPath;

  // Debug: log component mount and params
  console.log('AnalyzeTender component mounted with id:', id);

  // Fetch complete analysis in one query
  const {
    data: analysis,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<TenderAnalysisResponse, Error>({
    queryKey: ['tenderAnalysis', id],
    queryFn: () => fetchTenderAnalysis(id!),
    enabled: !!id,
    retry: 0, // Don't retry on 404
    // Poll ONLY when analysis is actively in progress (not completed, not failed, not just existing)
    refetchInterval: (query) => {
      // Only poll if analysis has a status that indicates it's being processed
      const data = query.state.data as TenderAnalysisResponse | undefined;
      if (data && data.status && data.status !== 'completed' && data.status !== 'failed') {
        // Poll every 20 seconds while processing
        return 20000;
      }
      // Don't poll: no data, error (404), completed, failed, or just exists
      return false;
    },
    refetchIntervalInBackground: true,
  });

  const handleBack = () => {
    if (returnPath) {
      navigate(returnPath);
    } else {
      navigate('/tenderiq');
    }
  };

  const handleDownloadReport = async (format: 'pdf' | 'excel' | 'word') => {
    if (!id) {
      toast({
        title: 'Error',
        description: 'No analysis data available to download',
        variant: 'destructive',
      });
      return;
    }

    try {
      await downloadAnalysisReport(id, format);
      const formatNames = { pdf: 'PDF', excel: 'Excel', word: 'Word' };
      toast({
        title: 'Success',
        description: `Analysis report downloaded as ${formatNames[format]}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download analysis report',
        variant: 'destructive',
      });
    }
  };

  const handleViewBidSynopsis = () => {
    if (id) {
      navigate(`/synopsis/${id}`);
    }
  };

  const handleStartAnalysis = () => {
    if (!id) return;
    
    // Show toast immediately without waiting
    toast({
      title: 'Analysis Started! 🚀',
      description: 'Analysis is being processed. This page will update automatically with progress.',
    });
    
    console.log('Starting analysis for tender:', id);
    
    // Trigger analysis in the background (fire and forget)
    triggerTenderAnalysis(id)
      .then((result) => {
        console.log('Analysis trigger result:', result);
        if (result.status === 'already_analyzed') {
          toast({
            title: 'Analysis already exists',
            description: result.message || 'We found an existing analysis for this tender.',
          });
        }
        // Refetch to get updated status and trigger polling
        return refetch();
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to start analysis';
        console.error('Analysis start error:', err);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      });
  };

  return (
    <AnalyzeTenderUI
      analysis={analysis}
      isLoading={isLoading}
      isError={isError}
      error={error?.message || null}
      activeTab={activeTab}
      tenderId={id}
      onTabChange={setActiveTab}
      onBack={handleBack}
      onDownloadReport={handleDownloadReport}
      onViewBidSynopsis={handleViewBidSynopsis}
      onStartAnalysis={handleStartAnalysis}
    />
  );
}
