import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trash2, MapPin, IndianRupee, Calendar, Loader2 } from 'lucide-react';
import { getHistoryWishlistData } from '@/lib/api/wishlist';
import { HistoryPageResponse } from '@/lib/types/wishlist';
import WishlistHistoryUI from './components/WishlistHistoryUI';
import { useEffect, useState } from 'react';
import { useTenderActions } from '@/hooks/useTenderActions';

const WishlistHistory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { handleToggleWishlist } = useTenderActions();
  //
  // const { data: wishlistItems = [], isLoading } = useQuery<HistoryPageResponse, Error>({
  //   queryKey: ['wishlist'],
  //   queryFn: getHistoryWishlistData,
  // });

  const [wishlistItems, setWishlistItems] = useState<HistoryPageResponse>()
  const [isLoading, setIsLoading] = useState(true)

  const fetchWishlist = async () => {
    try {
      const wishlistItems = await getHistoryWishlistData();
      console.log(wishlistItems)
      setWishlistItems(wishlistItems);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      // Items in wishlist are already wishlisted, so currentState is true
      await handleToggleWishlist(id, true);
      // Refresh wishlist after successful removal
      await queryClient.refetchQueries({ queryKey: ['wishlist'] });
      fetchWishlist()
    } catch (error) {
      // Error handling is done in the hook
      console.error(`Failed to remove ${id} from wishlist:`, error);
    }
  };

  const handleViewTender = (id: string, tdr: string) => {
    const tdrParam = tdr ? `?tdr=${encodeURIComponent(tdr)}` : '';
    navigate(`/tenderiq/view/${id}${tdrParam}`);
  };

  useEffect(() => {
    fetchWishlist();
  }, [])

  // Poll for progress updates on tenders that are still being analyzed
  useEffect(() => {
    if (!wishlistItems?.tenders) return;

    // Check if any tenders are still being analyzed (progress < 100 and analysis_state is not "completed")
    const hasInProgressTenders = wishlistItems.tenders.some(
      tender => tender.progress < 100 && tender.analysis_state !== "completed"
    );

    if (!hasInProgressTenders) return;

    // Poll every 20 seconds for progress updates
    const pollInterval = setInterval(() => {
      fetchWishlist();
    }, 20000);

    return () => clearInterval(pollInterval);
  }, [wishlistItems])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading Wishlist & History...</p>
        </div>
      </div>
    );
  }

  return <WishlistHistoryUI
    navigate={navigate}
    data={wishlistItems}
    handleViewTender={handleViewTender}
    handleRemoveFromWishlist={handleRemoveFromWishlist}
  />
};

export default WishlistHistory;
