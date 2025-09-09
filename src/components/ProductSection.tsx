import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";

interface ProductSectionProps {
  title: string;
  products: Array<{
    id: string;
    name: string;
    price: string;
    originalPrice?: string;
    offer?: string;
    image: string;
    categories?: string[];
  }>;
  favorites?: Set<string>;
  onToggleFavorite?: (productId: string) => void;
}

const ProductSection = ({ title, products, favorites = new Set(), onToggleFavorite }: ProductSectionProps) => {
  return (
    <section className="px-6 py-6">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">{title}</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              offer={product.offer || (product.categories?.includes('newProducts') ? 'New Arrival' : undefined)}
              isFavorite={favorites.has(product.id)}
              onToggleFavorite={() => onToggleFavorite?.(product.id)}
              onAddToCart={() => console.log(`Added ${product.name} to cart`)}
              productId={product.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Hook to load products from JSON with offline support
export const useProducts = () => {
  const [products, setProducts] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const CACHE_KEY = 'productsData';
    const VERSION_KEY = 'productsDataVersion';
    const CACHE_VERSION = '2025-09-09-v2';
    const DATA_URL = '/data/products.json';

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Invalidate cache when version changes
        const storedVersion = localStorage.getItem(VERSION_KEY);
        if (storedVersion !== CACHE_VERSION) {
          localStorage.removeItem(CACHE_KEY);
          localStorage.setItem(VERSION_KEY, CACHE_VERSION);
        }
        
        // Try to load from localStorage first for instant UI
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setProducts(data.products);
          setCategories(data.categories);
          const flatProducts = data.products || [];
          setAllProducts(flatProducts);
          setIsLoading(false);
        }
        
        // Fetch fresh data (cache-busted) and update state/cache
        const response = await fetch(`${DATA_URL}?v=${CACHE_VERSION}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(VERSION_KEY, CACHE_VERSION);
        
        setProducts(data.products);
        setCategories(data.categories);
        const flatProducts = data.products || [];
        setAllProducts(flatProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        
        // If fetch fails, try to use cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setProducts(data.products);
          setCategories(data.categories);
          const flatProducts = data.products || [];
          setAllProducts(flatProducts);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { products, categories, allProducts, isLoading };
};

export default ProductSection;