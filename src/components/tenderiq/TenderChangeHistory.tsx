import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TenderHistoryItem } from '@/lib/types/tenderiq.types';
import {
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

interface TenderChangeHistoryProps {
  history: TenderHistoryItem[];
  isLoading?: boolean;
}

/**
 * Helper function to format dates safely
 */
const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr || dateStr === 'Invalid Date' || dateStr === 'N/A') return 'Not Specified';
  
  try {
    const date = parseISO(dateStr);
    if (isValid(date)) {
      return format(date, 'd MMM yyyy');
    }
    return 'Not Specified';
  } catch {
    return 'Not Specified';
  }
};

/**
 * Helper function to format time
 */
const formatTime = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

/**
 * Get badge color based on change type
 */
const getTypeBadgeColor = (type: string): string => {
  switch (type) {
    case 'bid_deadline_extension':
    case 'due_date_extension':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'amendment':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'corrigendum':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Get icon for change type
 */
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'bid_deadline_extension':
    case 'due_date_extension':
      return <Clock className="w-4 h-4" />;
    case 'amendment':
      return <AlertCircle className="w-4 h-4" />;
    case 'corrigendum':
      return <FileText className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

/**
 * Parse change notes to extract field changes
 */
const parseChangesFromNote = (note: string): Array<{ field: string; oldValue: string; newValue: string }> => {
  if (!note || !note.includes('•')) return [];

  const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
  const lines = note.split('\n');

  for (const line of lines) {
    if (line.startsWith('•')) {
      try {
        // Parse format: "• Field Label: old_value → new_value"
        const parts = line.substring(2).split(':');
        if (parts.length >= 2) {
          const field = parts[0].trim();
          const valueParts = parts[1].split('→');
          if (valueParts.length === 2) {
            changes.push({
              field,
              oldValue: valueParts[0].trim(),
              newValue: valueParts[1].trim(),
            });
          }
        }
      } catch {
        // Skip malformed lines
      }
    }
  }

  return changes;
};

/**
 * Individual history item component
 */
const ChangeHistoryItemComponent: React.FC<{ item: TenderHistoryItem; index: number }> = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0); // Expand first item by default
  const changes = parseChangesFromNote(item.note);
  const hasChanges = changes.length > 0 || (item.date_change && (item.date_change.from_date || item.date_change.to_date));

  return (
    <div key={item.id} className="relative pb-6">
      {/* Timeline connector */}
      {index !== 0 && (
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 to-transparent" />
      )}

      <div className="flex gap-4">
        {/* Timeline dot */}
        <div className="relative flex flex-col items-center">
          <div className="relative z-10 mt-2">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white shadow-lg">
              {getTypeIcon(item.type)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pt-1">
          <Card className="border hover:border-primary/50 transition-colors">
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`${getTypeBadgeColor(item.type)} font-semibold`}
                    >
                      {item.type.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(item.update_date)}
                    </span>
                  </div>

                  {/* Tender Reference */}
                  {item.tdr && (
                    <p className="text-xs text-muted-foreground mt-2 font-mono">
                      TDR: <span className="font-semibold">{item.tdr}</span>
                    </p>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                {hasChanges && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* Note summary */}
              {item.note && !isExpanded && (
                <p className="text-sm text-muted-foreground line-clamp-2">{item.note}</p>
              )}
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <>
                <Separator />
                <div className="p-4 space-y-4">
                  {/* Field changes section - Primary display */}
                  {changes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        Important Changes
                      </h4>
                      <div className="space-y-3">
                        {changes.map((change, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-orange-50 to-transparent rounded-lg p-4 border border-orange-200">
                            <p className="text-sm font-semibold text-foreground mb-2">
                              {change.field}
                            </p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-1">Previous</p>
                                <span className="inline-block px-3 py-1.5 bg-red-100 text-red-800 rounded-md line-through text-sm">
                                  {change.oldValue}
                                </span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-orange-500 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground mb-1">New</p>
                                <span className="inline-block px-3 py-1.5 bg-green-100 text-green-800 rounded-md font-bold text-sm">
                                  {change.newValue}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Date change section (legacy support) */}
                  {item.date_change && (item.date_change.from_date || item.date_change.to_date) && changes.length === 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Deadline Changed</h4>
                      <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="text-sm font-medium line-through text-muted-foreground">
                            {formatDate(item.date_change.from_date)}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-4" />
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground">To</p>
                          <p className="text-sm font-bold text-foreground">
                            {formatDate(item.date_change.to_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files changed section - Source Documents */}
                  {item.files_changed && item.files_changed.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Source Documents
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        View the corrigendum documents that contain these changes
                      </p>
                      <div className="space-y-3">
                        {item.files_changed.map((file) => (
                          <Card key={file.id} className="p-4 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{file.file_name}</p>
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                    <span className="uppercase">{file.file_type}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => window.open(file.file_url, '_blank')} 
                                  disabled={!file.file_url}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full note - hidden by default, show only if no changes parsed */}
                  {item.note && changes.length === 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-foreground">Details</h4>
                      <div className="bg-muted/30 rounded-lg p-3 text-xs whitespace-pre-wrap text-muted-foreground font-mono max-h-32 overflow-auto">
                        {item.note}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

/**
 * Main TenderChangeHistory Component
 */
export const TenderChangeHistory: React.FC<TenderChangeHistoryProps> = ({ history, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-4">Document Changes & Corrigendums</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="font-semibold text-lg mb-4">Document Changes & Corrigendums</h2>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="w-8 h-8 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No changes or amendments recorded yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Any corrigendums or amendments will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-lg mb-2">Document Changes & Corrigendums</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Track all changes, amendments, deadline extensions and document updates
      </p>

      <div className="relative">
        {/* Timeline */}
        {history.map((item, index) => (
          <ChangeHistoryItemComponent key={item.id} item={item} index={index} />
        ))}
      </div>

      {/* Summary stats */}
      {history.length > 0 && (
        <div className="mt-6 pt-4 border-t flex gap-4 flex-wrap text-xs">
          <div>
            <span className="text-muted-foreground">Total Changes: </span>
            <span className="font-semibold">{history.length}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Latest Update: </span>
            <span className="font-semibold">{formatDate(history[0]?.update_date)}</span>
          </div>
        </div>
      )}
    </Card>
  );
};
