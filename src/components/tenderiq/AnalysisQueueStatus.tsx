import { useAnalysisQueue } from '@/hooks/useAnalysisQueue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function AnalysisQueueStatus() {
  const { hasActive, queueLength, currentAnalysis, queuedItems, isLoading } = useAnalysisQueue();

  if (isLoading) {
    return null;
  }

  // Don't show if nothing is happening
  if (!hasActive && queueLength === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            Analysis Queue
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {queueLength} in queue
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Analysis */}
        {hasActive && currentAnalysis && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Currently Analyzing:</span>
              <span className="text-muted-foreground">Tender {currentAnalysis.tender_id}</span>
            </div>
            <Progress value={currentAnalysis.progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{currentAnalysis.status}</span>
              <span>{currentAnalysis.progress}%</span>
            </div>
          </div>
        )}

        {/* Queue List */}
        {queuedItems.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Up Next:</div>
            <div className="space-y-1">
              {queuedItems.slice(0, 3).map((item) => (
                <div
                  key={item.tender_id}
                  className="flex items-center justify-between text-xs p-2 bg-white rounded border"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span>Tender {item.tender_id}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{item.position}
                  </Badge>
                </div>
              ))}
              {queuedItems.length > 3 && (
                <div className="text-xs text-center text-muted-foreground py-1">
                  +{queuedItems.length - 3} more in queue
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estimated Time */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
          <Clock className="h-3 w-3" />
          <span>
            {hasActive && currentAnalysis?.estimated_remaining_seconds !== undefined
              ? `Est. ${Math.ceil(currentAnalysis.estimated_remaining_seconds / 60)} min remaining` 
              : hasActive
              ? 'Calculating...'
              : 'Analysis starting...'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
