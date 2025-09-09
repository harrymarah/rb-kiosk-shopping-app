import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/components/ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import SearchFilterBar from "@/components/SearchFilterBar";
import redBullCategory from "@/assets/red-bull-category.png";
import lucozadeCategory from "@/assets/lucozade-category.png";
import tripCategory from "@/assets/trip-category.png";
import energiseAllDay from "@/assets/energise-all-day.jpg";
import getSportReady from "@/assets/get-sport-ready.jpg";
import trySomethingNew from "@/assets/try-something-new.jpg";

const EnergyDrinks = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { allProducts, isLoading } = useProducts();
  const { addItem } = useBasket();
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedHeroImage, setSelectedHeroImage] = useState("energise");

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

      {/* Interactive Hero Image Banner */}
      <section className="relative h-[200px] overflow-hidden">
        <div className="absolute inset-0 transition-all duration-500 ease-in-out">
          {selectedHeroImage === "energise" && (
            <div 
              className="w-full h-full bg-cover bg-center bg-red-600"
              style={{ 
                backgroundImage: `linear-gradient(rgba(220, 38, 127, 0.6), rgba(220, 38, 127, 0.6)), url(${energiseAllDay})`
              }}
            />
          )}
          {selectedHeroImage === "sport" && (
            <div 
              className="w-full h-full bg-cover bg-center bg-orange-600"
              style={{ 
                backgroundImage: `linear-gradient(rgba(255, 165, 0, 0.6), rgba(255, 165, 0, 0.6)), url(${getSportReady})`
              }}
            />
          )}
          {selectedHeroImage === "new" && (
            <div 
              className="w-full h-full bg-cover bg-center bg-green-600"
              style={{ 
                backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.6)), url(${trySomethingNew})`
              }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </section>

      {/* Enhanced Banner with Header */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/15 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 flex items-center justify-center min-h-[140px]">
          <div className="text-center">
            <h2 className="text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent animate-fade-in">
              FUEL YOUR
            </h2>
            <h2 className="text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-yellow-300 via-red-400 to-red-500 bg-clip-text text-transparent animate-fade-in delay-200">
              POTENTIAL
            </h2>
            <div className="mt-4 w-24 h-1 bg-gradient-to-r from-yellow-400 to-red-500 mx-auto rounded-full animate-scale-in delay-500"></div>
          </div>
        </div>
        
        {/* Image Tiles */}
        <div className="flex w-full h-64">
          <div 
            className="w-1/3 relative overflow-hidden cursor-pointer group"
            onClick={() => setSelectedHeroImage("energise")}
          >
            <img 
              src={redBullCategory} 
              alt="Red Bull Energy Drinks" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center">
              <h3 className="text-white text-xl md:text-2xl font-bold text-center px-4 pb-6">
                ENERGISE ALL DAY
              </h3>
            </div>
          </div>
          <div 
            className="w-1/3 relative overflow-hidden cursor-pointer group"
            onClick={() => setSelectedHeroImage("sport")}
          >
            <img 
              src={lucozadeCategory} 
              alt="Lucozade Energy Drinks" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center">
              <h3 className="text-white text-xl md:text-2xl font-bold text-center px-4 pb-6">
                GET SPORT READY
              </h3>
            </div>
          </div>
          <div 
            className="w-1/3 relative overflow-hidden cursor-pointer group"
            onClick={() => setSelectedHeroImage("new")}
          >
            <img 
              src={tripCategory} 
              alt="Trip Energy Drinks" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center">
              <h3 className="text-white text-xl md:text-2xl font-bold text-center px-4 pb-6">
                TRY SOMETHING NEW
              </h3>
            </div>
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