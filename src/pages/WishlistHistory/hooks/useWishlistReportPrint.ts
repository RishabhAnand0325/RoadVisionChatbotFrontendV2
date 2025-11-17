import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';

/**
 * Hook to handle PDF printing for wishlist reports
 * Uses react-to-print to leverage browser's native print dialog
 */
export function useWishlistReportPrint() {
  const contentRef = useRef<HTMLDivElement>(null);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: 'Wishlist Report',
  });

  return {
    contentRef,
    handlePrint: reactToPrintFn,
  };
}
