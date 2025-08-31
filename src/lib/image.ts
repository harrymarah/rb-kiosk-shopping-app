export const getProxiedImageUrl = (src: string): string => {
  if (!src) return '/placeholder.svg';
  
  // Keep local/public assets as-is
  if (!src.startsWith('http')) {
    return src;
  }
  
  // For external URLs, try original first without proxy to avoid overprocessing
  return src;
};

