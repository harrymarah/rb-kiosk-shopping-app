const SUPABASE_PUBLIC_BASE =
  'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public';
const BUCKET = 'Food Delivery Assets';
const PRODUCT_IMAGE_ROOT = '2026_images';

/**
 * Build the public URL for a 2026 product image from the category folder and
 * filename stored in products.json, e.g.
 *   "Energy Drinks/1. Red Bull Energy Drink 18 x 250ml.png"
 * Every path segment is encoded individually so spaces, "&" and apostrophes in
 * the folder and file names survive.
 */
export const getProductImageUrl = (imagePath: string): string => {
  if (!imagePath) return '/placeholder.svg';

  // Already a full URL or a local asset - leave it alone.
  if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;

  const segments = [BUCKET, PRODUCT_IMAGE_ROOT, ...imagePath.split('/')];
  return `${SUPABASE_PUBLIC_BASE}/${segments.map(encodeURIComponent).join('/')}`;
};

export const getProxiedImageUrl = (src: string): string => {
  if (!src) return '/placeholder.svg';
  
  // Keep local/public assets as-is
  if (!src.startsWith('http')) {
    return src;
  }
  
  // For external URLs, try original first without proxy to avoid overprocessing
  return src;
};
