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
              offer={product.offer}
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
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Try to load from localStorage first
        const cachedData = localStorage.getItem('productsData');
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setProducts(data.products);
          setCategories(data.categories);
          
          // Flatten all products into a single array
          const flatProducts = [
            ...(data.products.shopNew || []),
            ...(data.products.breakfast || []),
            ...(data.products.lunch || []),
            ...(data.products.meals || []),
            ...(data.products.snacks || []),
            ...(data.products.beverages || []),
            ...(data.products.energyDrinks || []),
            ...(data.products.matchReady || []),
            ...(data.products.softDrinks || []),
            ...(data.products.favourites || []),
            ...(data.products.redBull || [])
          ];
          setAllProducts(flatProducts);
          setIsLoading(false);
        }
        
        // Always try to fetch fresh data when online
        if (navigator.onLine) {
          const response = await fetch('/data/products.json');
          const data = await response.json();
          
          // Cache the data for offline use
          localStorage.setItem('productsData', JSON.stringify(data));
          
          setProducts(data.products);
          setCategories(data.categories);
          
          // Flatten all products into a single array
          const flatProducts = [
            ...(data.products.shopNew || []),
            ...(data.products.breakfast || []),
            ...(data.products.lunch || []),
            ...(data.products.meals || []),
            ...(data.products.snacks || []),
            ...(data.products.beverages || []),
            ...(data.products.energyDrinks || []),
            ...(data.products.matchReady || []),
            ...(data.products.softDrinks || []),
            ...(data.products.favourites || []),
            ...(data.products.redBull || [])
          ];
          setAllProducts(flatProducts);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        
        // If online fetch fails, try to use cached data
        const cachedData = localStorage.getItem('productsData');
        if (cachedData) {
          const data = JSON.parse(cachedData);
          setProducts(data.products);
          setCategories(data.categories);
          
          const flatProducts = [
            ...(data.products.shopNew || []),
            ...(data.products.breakfast || []),
            ...(data.products.lunch || []),
            ...(data.products.meals || []),
            ...(data.products.snacks || []),
            ...(data.products.beverages || []),
            ...(data.products.energyDrinks || []),
            ...(data.products.matchReady || []),
            ...(data.products.softDrinks || []),
            ...(data.products.favourites || []),
            ...(data.products.redBull || [])
          ];
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