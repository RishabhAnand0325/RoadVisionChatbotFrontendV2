import { useState, useEffect } from 'react';
import { Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getUserPreferences, updateAutoAnalyzePreference } from '@/lib/api/auth';

export function WishlistPreferences() {
  const [open, setOpen] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load preferences when dialog opens
  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await getUserPreferences();
      setAutoAnalyze(prefs.auto_analyze_on_wishlist);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAutoAnalyze = async (checked: boolean) => {
    try {
      setIsSaving(true);
      const result = await updateAutoAnalyzePreference(checked);
      setAutoAnalyze(result.auto_analyze_on_wishlist);
      toast({
        title: 'Preference updated',
        description: result.message,
      });
    } catch (error) {
      console.error('Failed to update preference:', error);
      toast({
        title: 'Error',
        description: 'Failed to update preference',
        variant: 'destructive',
      });
      // Revert on error
      setAutoAnalyze(!checked);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Wishlist Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Wishlist Preferences</DialogTitle>
          <DialogDescription>
            Manage how wishlisting works for you
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex-1 space-y-1">
                <div className="font-medium">Auto-analyze on Wishlist</div>
                <p className="text-sm text-muted-foreground">
                  Automatically start tender analysis when you wishlist a tender
                </p>
              </div>
              <Switch
                checked={autoAnalyze}
                onCheckedChange={handleToggleAutoAnalyze}
                disabled={isSaving}
              />
            </div>

            {isSaving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
