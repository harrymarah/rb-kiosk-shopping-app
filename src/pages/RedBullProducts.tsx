import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/components/ProductSection";
const RedBullProducts = () => {
  const navigate = useNavigate();
  const {
    favorites,
    toggleFavorite,
    isFavorite
  } = useFavorites();
  const { allProducts, isLoading } = useProducts();

  // SEO: set page metadata
  useEffect(() => {
    document.title = "Red Bull Energy Drinks – Full Range";
    const ensureMeta = (name: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      return el;
    };
    const desc = ensureMeta('description');
    desc.setAttribute('content', 'Browse the complete Red Bull products collection including Sugar Free, Tropical, Editions, and multi-packs.');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + '/red-bull-products';
  }, []);

  // Collect all Red Bull products from the flat product list
  const redBullProducts = (allProducts || [])
    .filter((p: any) => p && (p.categories?.includes('redBull') || p.name?.toLowerCase().includes('red bull')))
    .reduce((acc: any[], cur: any) => {
      if (!acc.find(p => p.id === cur.id)) acc.push(cur);
      return acc;
    }, []);
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };
  const toggleFavoriteById = (productId: string) => {
    const product = redBullProducts.find(p => p.id === productId);
    if (product) {
      toggleFavorite(product);
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="shrink-0">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Red Bull Products</h1>
              <p className="text-muted-foreground">Complete collection of Red Bull Energy Drinks</p>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading Red Bull products...</p>
          </div>
        ) : redBullProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {redBullProducts.map(product => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                offer={product.offer}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() => toggleFavoriteById(product.id)}
                productId={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Red Bull products found</h2>
            <p className="text-muted-foreground">Check back later for our Red Bull collection.</p>
          </div>
        )}
      </main>
    </div>;
};
export default RedBullProducts;