import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/components/ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import SearchFilterBar from "@/components/SearchFilterBar";

const EnergyDrinks = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { allProducts, isLoading } = useProducts();
  const { addItem } = useBasket();
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // SEO: set page metadata
  useEffect(() => {
    document.title = "Energy Drinks – Energise Every Moment | QuickMart";
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
    desc.setAttribute('content', 'Browse our complete energy drinks collection including Red Bull, Monster, Lucozade and more. Energise every moment with premium energy drinks.');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + '/energy-drinks';
  }, []);

  // Get all energy drink products
  const energyDrinkProducts = (allProducts || [])
    .filter((p: any) => p && p.categories?.includes('energyDrinks'))
    .reduce((acc: any[], cur: any) => {
      if (!acc.find(p => p.id === cur.id)) acc.push(cur);
      return acc;
    }, []);

  // Energy drink brands for category filtering
  const energyBrands = [
    { id: "all", name: "All Brands", image: "", count: energyDrinkProducts.length },
    { id: "redBull", name: "Red Bull", image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/1%20-%20Red%20Bull%20Energy%20250ml%20x4.jpeg", count: energyDrinkProducts.filter(p => p.categories?.includes('redBull') || p.name?.toLowerCase().includes('red bull')).length },
    { id: "monster", name: "Monster", image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/2%20-%20Monster%20Energy%20Drink%204x500ml.jpg", count: energyDrinkProducts.filter(p => p.name?.toLowerCase().includes('monster')).length },
    { id: "lucozade", name: "Lucozade", image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/6%20-%20Lucozade%20Energy%20Orange%204x500ml.jpg", count: energyDrinkProducts.filter(p => p.name?.toLowerCase().includes('lucozade')).length }
  ];

  // Filter products based on selected brand
  const filteredProducts = energyDrinkProducts.filter(product => {
    if (selectedBrand === "all") return true;
    if (selectedBrand === "redBull") return product.categories?.includes('redBull') || product.name?.toLowerCase().includes('red bull');
    if (selectedBrand === "monster") return product.name?.toLowerCase().includes('monster');
    if (selectedBrand === "lucozade") return product.name?.toLowerCase().includes('lucozade');
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price.replace('£', '')) - parseFloat(b.price.replace('£', ''));
      case "price-high":
        return parseFloat(b.price.replace('£', '')) - parseFloat(a.price.replace('£', ''));
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const toggleFavoriteById = (productId: string) => {
    const product = energyDrinkProducts.find(p => p.id === productId);
    if (product) {
      toggleFavorite(product);
    }
  };

  const handleAddToBasket = (productId: string) => {
    const product = energyDrinkProducts.find(p => p.id === productId);
    if (product) {
      addItem(product);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="shrink-0">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Energy Drinks</h1>
              <p className="text-muted-foreground">Fuel your potential</p>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Fuel your potential
            </h2>
          </div>
        </div>
        {/* Product tiles at bottom */}
        <div className="flex w-full">
          <div className="w-1/5 aspect-square">
            <img 
              src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/product_tile_images/Red_bull_tile.png" 
              alt="Red Bull" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/5 aspect-square">
            <img 
              src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/product_tile_images/Lucozade_tile.png" 
              alt="Lucozade" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/5 aspect-square">
            <img 
              src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/product_tile_images/Powerade_tile.png" 
              alt="Powerade" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/5 aspect-square">
            <img 
              src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/product_tile_images/Monster_tile.png" 
              alt="Monster" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/5 aspect-square">
            <img 
              src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/product_tile_images/Starbucks_coffee_tile.png" 
              alt="Starbucks" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>


      {/* Filter Bar */}
      <div className="container mx-auto px-4 py-4">
        <SearchFilterBar
          categories={energyBrands.map(b => b.name)}
          selectedCategory={energyBrands.find(b => b.id === selectedBrand)?.name || "All Brands"}
          sortBy={sortBy}
          onCategoryChange={(category) => {
            const brand = energyBrands.find(b => b.name === category);
            if (brand) setSelectedBrand(brand.id);
          }}
          onSortChange={setSortBy}
          onClearFilters={() => {
            setSelectedBrand("all");
            setSortBy("relevance");
          }}
          resultCount={sortedProducts.length}
        />
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 pb-6">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading energy drinks...</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                offer={product.offer}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() => toggleFavoriteById(product.id)}
                onAddToCart={() => handleAddToBasket(product.id)}
                productId={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No energy drinks found</h2>
            <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnergyDrinks;