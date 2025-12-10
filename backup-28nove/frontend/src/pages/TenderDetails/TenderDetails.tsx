import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { fetchFullTenderDetails, fetchTenderHistory } from '@/lib/api/tenderiq.api';
import { TenderDetailsType } from '@/lib/types/tenderiq';
import TenderDetailsUI from '@/components/tenderiq/TenderDetailsUI';
import { Button } from '@/components/ui/button';
import {
  fetchWishlistedTenders,
  fetchFavoriteTenders,
  fetchArchivedTenders,
} from '@/lib/api/tenderiq';
import { Tender, FullTenderDetails, TenderHistoryItem } from '@/lib/types/tenderiq.types';
import { useTenderActions } from '@/hooks/useTenderActions';

export default function TenderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleToggleWishlist, handleToggleFavorite, handleToggleArchive } = useTenderActions();

  const { data: tender, isLoading, isError } = useQuery<FullTenderDetails, Error>({
    queryKey: ['tenderDetails', id],
    queryFn: () => fetchFullTenderDetails(id!),
    enabled: !!id,
  });

  const { data: wishlist } = useQuery<Tender[], Error>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlistedTenders,
  });

  const { data: favorites } = useQuery<Tender[], Error>({
    queryKey: ['favorites'],
    queryFn: fetchFavoriteTenders,
  });

  const { data: archived } = useQuery<Tender[], Error>({
    queryKey: ['archived'],
    queryFn: fetchArchivedTenders,
  });

  // Fetch tender history/changes
  const { data: tenderHistory, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery<TenderHistoryItem[], Error>({
    queryKey: ['tenderHistory', id],
    queryFn: () => fetchTenderHistory(id!),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });

  const isWishlisted = wishlist?.some((item) => item.id === id) ?? false;
  const isFavorited = favorites?.some((item) => item.id === id) ?? false;
  const isArchived = archived?.some((item) => item.id === id) ?? false;

  const handleAddToWishlist = () => {
    if (!tender) return;
    // Fire and forget - update UI immediately, sync with backend in the background
    handleToggleWishlist(tender.id, isWishlisted).catch(() => {
      // Error is already handled by the hook with toast
    });
  };

  const handleToggleFavoriteAction = () => {
    if (!tender) return;
    // Fire and forget - update UI immediately, sync with backend in the background
    handleToggleFavorite(tender.id, isFavorited).catch(() => {
      // Error is already handled by the hook with toast
    });
  };

  const handleToggleArchiveAction = () => {
    if (!tender) return;
    // Fire and forget - update UI immediately, sync with backend in the background
    handleToggleArchive(tender.id, isArchived).catch(() => {
      // Error is already handled by the hook with toast
    });
  };
  
  const handleNavigate = (path: string) => {
    // If navigating to analyze page, pass the current tender details URL as return path
    if (path.includes('/analyze/')) {
      navigate(path, { state: { returnPath: `/tenderiq/view/${id}` } });
    } else {
      navigate(path);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading tender details...</p>
        </div>
      </div>
    );
  }

  if (isError || !tender) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Tender not found</p>
          <p className="text-muted-foreground text-sm">
            The tender you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => navigate('/tenderiq')} variant="outline">
            Back to TenderIQ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TenderDetailsUI
      tender={tender}
      tenderHistory={tenderHistory || []}
      isLoadingHistory={isLoadingHistory}
      isWishlisted={isWishlisted}
      onAddToWishlist={handleAddToWishlist}
      isFavorited={isFavorited}
      onToggleFavorite={handleToggleFavoriteAction}
      isArchived={isArchived}
      onToggleArchive={handleToggleArchiveAction}
      onNavigate={handleNavigate}
    />
  );
}
