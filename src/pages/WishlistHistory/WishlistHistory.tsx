import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trash2, MapPin, IndianRupee, Calendar, Loader2 } from 'lucide-react';
import { Tender } from '@/lib/types/tenderiq';
import { performTenderAction, fetchWishlistedTenders } from '@/lib/api/tenderiq';
import { useToast } from '@/hooks/use-toast';
import { getHistoryWishlistData } from '@/lib/api/wishlist';
import { HistoryPageResponse } from '@/lib/types/wishlist';
import WishlistHistoryUI from './components/WishlistHistoryUI';
import { useEffect, useState } from 'react';

const WishlistHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  // const queryClient = useQueryClient();
  //
  // const { data: wishlistItems = [], isLoading } = useQuery<HistoryPageResponse, Error>({
  //   queryKey: ['wishlist'],
  //   queryFn: getHistoryWishlistData,
  // });

  const [wishlistItems, setWishlistItems] = useState<HistoryPageResponse>()
  const [isLoading, setIsLoading] = useState(true)

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      await performTenderAction(id, { action: 'toggle_wishlist' });
      toast({
        title: 'Removed from wishlist',
        description: 'Tender removed successfully.',
      });
      await queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove from wishlist.',
        variant: 'destructive',
      });
      console.error(`Failed to remove ${id} from wishlist:`, error);
    }
  };

  const handleViewTender = (id: string) => {
    navigate(`/tenderiq/view/${id}`);
  };

  useEffect(() => {
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

    fetchWishlist();
  }, [])

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
