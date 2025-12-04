import { Loader, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
}

interface UploadProgressOverlayProps {
  uploads: UploadItem[];
  onCancel: (id: string) => void;
}

export function UploadProgressOverlay({
  uploads,
  onCancel,
}: UploadProgressOverlayProps) {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100%-2rem)] bg-card border rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-semibold text-sm mb-3">
        Uploading {uploads.length} file{uploads.length !== 1 ? "s" : ""}
      </h3>
      <div className="space-y-3">
        {uploads.map((upload) => (
          <div key={upload.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground truncate flex-1">
                {upload.file.name}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => onCancel(upload.id)}
              >
                <X size={14} />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={upload.progress} className="flex-1" />
              <span className="text-xs text-muted-foreground w-12 text-right">
                {Math.round(upload.progress)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
