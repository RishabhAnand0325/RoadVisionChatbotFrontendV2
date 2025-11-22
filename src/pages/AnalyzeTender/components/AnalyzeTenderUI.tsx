import {
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Download,
  FileDown,
  ChevronDown,
  FileText,
  PlayCircle,
} from 'lucide-react';
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

interface AnalyzeTenderUIProps {
  analysis: TenderAnalysisResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
  onDownloadReport: (format: 'excel' | 'word') => void;
  onNavigateToBidSynopsis: () => void;
  onTriggerAnalysis: () => void;
  isTriggering: boolean;
  tenderId?: string;
}

export default function AnalyzeTenderUI({
  analysis,
  isLoading,
  isError,
  error,
  activeTab,
  onTabChange,
  onBack,
  onDownloadReport,
  onNavigateToBidSynopsis,
  onTriggerAnalysis,
  isTriggering,
  tenderId,
}: AnalyzeTenderUIProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 space-y-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analyze Tender</h1>
              <p className="text-muted-foreground mt-1">
                {isLoading
                  ? 'Loading analysis...'
                  : analysis
                  ? `Status: ${analysis.status || 'Processing'}`
                  : 'Analysis Results'}
              </p>
            </div>
          </div>

          {/* HEADER BUTTONS */}
          <div className="flex gap-2">
            {/* Show trigger button when no analysis OR failed OR not completed */}
            {(!analysis || isError || (analysis && analysis.status !== 'completed')) &&
              tenderId && (
                <Button
                  variant="default"
                  onClick={onTriggerAnalysis}
                  disabled={isTriggering}
                >
                  {isTriggering ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Starting Analysis...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Analyze Tender Now
                    </>
                  )}
                </Button>
              )}

            {/* When Completed: Show Synopsis + Download */}
            {analysis && analysis.status === 'completed' && (
              <>
                <Button variant="outline" onClick={onNavigateToBidSynopsis}>
                  <FileText className="h-4 w-4 mr-2" />
                  Draft Bid Synopsis
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <FileDown className="h-4 w-4 mr-2" />
                      Download Report
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              </>
            )}
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <Card className="p-8 border-blue-200 bg-blue-50">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  Analysis Not Available
                </h3>
                <p className="text-blue-700 mb-4">
                  This tender hasn't been analyzed yet. Click the button below to
                  start the analysis.
                </p>
              </div>

              {tenderId && (
                <Button size="lg" onClick={onTriggerAnalysis} disabled={isTriggering}>
                  {isTriggering ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Starting Analysis...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Analyze Tender Now
                    </>
                  )}
                </Button>
              )}

              <p className="text-sm text-blue-600 mt-2">
                Analysis typically takes 3–5 minutes to complete.
              </p>
            </div>
          </Card>
        )}

        {/* Loading */}
        {isLoading && (
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading tender analysis...</p>
            </div>
          </Card>
        )}

        {/* In Progress */}
        {!isLoading &&
          analysis &&
          analysis.status !== 'completed' &&
          analysis.status !== 'failed' && (
            <Card className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Analysis in Progress</h3>
                  <p className="text-muted-foreground capitalize">
                    Status: {analysis.status}
                  </p>

                  {analysis.progress !== undefined && (
                    <div className="w-full max-w-md mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {analysis.progress}%
                        </span>
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
                    This may take a few minutes. The page will update
                    automatically.
                  </p>
                </div>
              </div>
            </Card>
          )}

        {/* Results */}
        {!isLoading &&
          !isError &&
          analysis &&
          analysis.status === 'completed' && (
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="one-pager">One Pager</TabsTrigger>
                <TabsTrigger value="scope" disabled={!analysis.scope_of_work}>
                  Scope of Work
                </TabsTrigger>
                <TabsTrigger value="sections" disabled={!analysis.rfp_sections}>
                  RFP Sections
                </TabsTrigger>
                <TabsTrigger value="datasheet" disabled={!analysis.data_sheet}>
                  Data Sheet
                </TabsTrigger>
                <TabsTrigger value="templates" disabled={!analysis.templates}>
                  Templates
                </TabsTrigger>
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
          )}
      </div>
    </div>
  );
}
