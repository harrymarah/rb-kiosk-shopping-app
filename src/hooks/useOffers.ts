import { useMemo } from 'react';
import { useProducts } from '@/components/ProductSection';

/**
 * Products on offer, in the client's ranked order from the feedback sheet.
 * Backs both the storefront "Offers" section and the basket's "Last Minute
 * Savings" row, so the two stay in step.
 */
export const useOffers = (limit?: number) => {
  const { allProducts } = useProducts();

  return useMemo(() => {
    const offers = (allProducts || [])
      .filter((p: any) => typeof p.offerRank === 'number')
      .sort((a: any, b: any) => a.offerRank - b.offerRank);
    return limit ? offers.slice(0, limit) : offers;
  }, [allProducts, limit]);
};

/** Money saved on an offer product, or null when it isn't discounted. */
export const getSaving = (price?: string, originalPrice?: string): string | null => {
  if (!price || !originalPrice) return null;
  const now = parseFloat(price.replace(/[^0-9.]/g, ''));
  const was = parseFloat(originalPrice.replace(/[^0-9.]/g, ''));
  if (!isFinite(now) || !isFinite(was) || was <= now) return null;
  return `£${(was - now).toFixed(2)}`;
};
