import { ArrowLeft, AlertTriangle, Play, Loader2, Download, FileDown, ChevronDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TenderAnalysisResponse } from '@/lib/types/analyze.type';
import OnePager from './OnePager';
import ScopeOfWork from './ScopeOfWork';
import RFPSections from './RFPSections';
import DataSheet from './DataSheet';
import Templates from './Templates';
import { BackButton } from '@/components/common/BackButton';
import { OpportunityAIChat } from '@/components/tenderiq/OpportunityAIChat';
import { toTitleCase } from '@/lib/utils/text-formatting';

// Helper to capitalize status words
const capitalizeStatus = (status: string): string => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

interface AnalyzeTenderUIProps {
  analysis: TenderAnalysisResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  activeTab: string;
  tenderId?: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
  onDownloadReport: (format: 'excel' | 'word') => void;
  onViewBidSynopsis?: () => void;
  onStartAnalysis?: () => void;
}

export default function AnalyzeTenderUI({
  analysis,
  isLoading,
  isError,
  error,
  activeTab,
  tenderId,
  onTabChange,
  onBack,
  onDownloadReport,
  onViewBidSynopsis,
  onStartAnalysis,
}: AnalyzeTenderUIProps) {
  const hasAnalysisData =
    !!analysis &&
    !!(
      analysis.one_pager ||
      analysis.scope_of_work ||
      analysis.rfp_sections ||
      analysis.data_sheet ||
      analysis.templates
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 space-y-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton onClick={onBack} />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analyze Tender</h1>
              <p className="text-muted-foreground mt-1">
                {isLoading
                  ? 'Loading analysis...'
                  : analysis
                    ? `Status: ${capitalizeStatus(analysis.status || 'Processing')}`
                    : 'Analysis Results'}
              </p>
            </div>
          </div>
          {!isLoading && analysis && analysis.status === 'completed' && (
            <div className="flex gap-2">
              {onViewBidSynopsis && tenderId && (
                <Button variant="outline" onClick={onViewBidSynopsis}>
                  <FileText className="h-4 w-4 mr-2" />
                  Bid Synopsis
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Report
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {/* <DropdownMenuItem onClick={() => onDownloadReport('pdf')}>
                    <span className="mr-2">📄</span>
                    Download as PDF
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => onDownloadReport('excel')}>
                    <span className="mr-2">📊</span>
                    Download as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownloadReport('word')}>
                    <span className="mr-2">📝</span>
                    Download as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Error / No-analysis State */}
        {isError && error && (
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-50/50 border-blue-200 dark:from-blue-950/20 dark:to-blue-950/10 dark:border-blue-800">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                    {error.includes('Analysis not found')
                      ? 'Analysis Not Found'
                      : 'Analysis Error'}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {error.includes('Analysis not found')
                      ? 'No analysis exists for this tender yet. Click the button below to start a new AI analysis.'
                      : error}
                  </p>
                </div>
              </div>
              {onStartAnalysis && tenderId && (
                <div className="pt-2">
                  <Button 
                    onClick={onStartAnalysis}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Start AI Analysis
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading tender analysis...</p>
            </div>
          </Card>
        )}

        {/* Analysis in Progress (only when genuinely running) */}
        {!isLoading &&
          analysis &&
          analysis.status !== 'completed' &&
          analysis.status !== 'failed' &&
          (analysis.progress === undefined || analysis.progress < 100) && (
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">
                  Analysis in Progress
                </h3>
                <p className="text-muted-foreground capitalize">
                  Status: {capitalizeStatus(analysis.status)}
                </p>
                {analysis.progress !== undefined && (
                  <div className="w-full max-w-md mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-semibold">{analysis.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${analysis.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-4">
                  This may take a few minutes. The page will automatically update when complete.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Stale / empty analysis record (no data but not completed/failed) */}
        {!isLoading &&
          !isError &&
          analysis &&
          !hasAnalysisData &&
          analysis.status !== 'completed' &&
          analysis.status !== 'failed' && (
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 dark:from-primary/20 dark:to-primary/10 dark:border-primary/30">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground">Analysis Record Empty</h3>
                    <p className="text-sm text-muted-foreground">
                      We found an analysis record for this tender, but results are not available yet. Try starting or retrying the analysis.
                    </p>
                  </div>
                </div>
                {onStartAnalysis && tenderId && (
                  <div className="pt-2">
                    <Button 
                      onClick={onStartAnalysis}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Retry Analysis
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

        {/* Analysis Results */}
        {!isLoading && !isError && analysis && analysis.status === 'completed' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="one-pager">One Pager</TabsTrigger>
                  <TabsTrigger value="scope" disabled={!analysis.scope_of_work}>Scope of Work</TabsTrigger>
                  <TabsTrigger value="sections" disabled={!analysis.rfp_sections}>RFP Sections</TabsTrigger>
                  <TabsTrigger value="datasheet" disabled={!analysis.data_sheet}>Data Sheet</TabsTrigger>
                  <TabsTrigger value="templates" disabled={!analysis.templates}>Templates</TabsTrigger>
                </TabsList>

                <TabsContent value="one-pager" className="mt-6">
                  <OnePager onePager={analysis.one_pager} />
                </TabsContent>

                <TabsContent value="scope" className="mt-6">
                  <ScopeOfWork scopeOfWork={analysis.scope_of_work} />
                </TabsContent>

                <TabsContent value="sections" className="mt-6">
                  <RFPSections rfpSections={analysis.rfp_sections} />
                </TabsContent>

                <TabsContent value="datasheet" className="mt-6">
                  <DataSheet dataSheet={analysis.data_sheet} />
                </TabsContent>

                <TabsContent value="templates" className="mt-6">
                  <Templates templates={analysis.templates} />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Sidebar - AI Chat */}
            <div className="lg:col-span-1">
              <OpportunityAIChat
                opportunityId={tenderId || ''}
                tenderTitle={toTitleCase(analysis.tender_name || 'Tender')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
