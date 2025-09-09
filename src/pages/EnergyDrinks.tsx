import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Filter, SortAsc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/components/ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import EnergyDrinksFilterBar from "@/components/EnergyDrinksFilterBar";
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
  const [selectedFlavour, setSelectedFlavour] = useState("all");
  const [lowSugar, setLowSugar] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [onOffer, setOnOffer] = useState(false);

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

  // Available flavours (extracted from actual product names)
  const availableFlavours = [
    "Original", 
    "Sugar Free", 
    "Fuji Apple & Ginger", 
    "White Peach", 
    "Grapefruit & Blossom", 
    "Vanilla Iced Berry", 
    "Forest Fruit", 
    "Watermelon", 
    "Juneberry",
    "Zero"
  ];

  // Filter products based on all criteria
  const filteredProducts = energyDrinkProducts.filter(product => {
    // Brand filter
    if (selectedBrand !== "all") {
      const brandName = selectedBrand.toLowerCase();
      const productName = product.name?.toLowerCase() || '';
      
      if (brandName === "red bull" && !productName.includes('red bull') && !product.categories?.includes('redBull')) return false;
      if (brandName === "monster" && !productName.includes('monster')) return false;
      if (brandName === "lucozade" && !productName.includes('lucozade')) return false;
    }
    
    // Flavour filter - improved matching
    if (selectedFlavour !== "all") {
      const flavourName = selectedFlavour.toLowerCase();
      const productName = product.name?.toLowerCase() || '';
      
      // Special handling for different flavour types
      if (flavourName === "original" && (productName.includes('sugar free') || productName.includes('zero') || productName.includes('edition'))) return false;
      if (flavourName === "sugar free" && !productName.includes('sugar free') && !productName.includes('sugarfree')) return false;
      if (flavourName === "zero" && !productName.includes('zero')) return false;
      if (flavourName !== "original" && flavourName !== "sugar free" && flavourName !== "zero" && !productName.includes(flavourName)) return false;
    }
    
    // Low sugar filter
    if (lowSugar) {
      const productName = product.name?.toLowerCase() || '';
      if (!productName.includes('sugar free') && !productName.includes('zero') && !productName.includes('diet')) return false;
    }
    
    // New filter
    if (isNew) {
      const productName = product.name?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      if (!productName.includes('new') && !description.includes('new')) return false;
    }
    
    // On offer filter
    if (onOffer && !product.offer) return false;
    
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
        <EnergyDrinksFilterBar
          brands={[]} // Not used anymore since we hardcode them
          flavours={availableFlavours}
          selectedBrand={selectedBrand}
          selectedFlavour={selectedFlavour}
          lowSugar={lowSugar}
          isNew={isNew}
          onOffer={onOffer}
          sortBy={sortBy}
          onBrandChange={setSelectedBrand}
          onFlavourChange={setSelectedFlavour}
          onLowSugarChange={setLowSugar}
          onNewChange={setIsNew}
          onOfferChange={setOnOffer}
          onSortChange={setSortBy}
          onClearFilters={() => {
            setSelectedBrand("all");
            setSelectedFlavour("all");
            setLowSugar(false);
            setIsNew(false);
            setOnOffer(false);
            setSortBy("relevance");
          }}
          resultCount={sortedProducts.length}
        />
      </div>

      {/* Sponsored Products Section */}
      <section className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Sponsored Products</h2>
          <Badge variant="secondary" className="text-xs">Ad</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Red Bull Sugar Free 12pk */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <div className="relative mb-3 bg-white rounded-lg p-3 shadow-sm">
              <img 
                src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Red%20Bull/14.%20Red%20Bull%20Energy%20Drink%20Sugar%20Free%2012%20X%20250ml.jpeg"
                alt="Red Bull Sugar Free 12pk"
                className="w-full h-32 object-contain"
              />
              <Badge className="absolute top-1 right-1 bg-yellow-500 text-black">Sponsored</Badge>
            </div>
            <h3 className="font-semibold text-sm mb-2">Red Bull Sugar Free 12pk</h3>
            <p className="text-lg font-bold text-primary mb-3">£14.25</p>
            <Button 
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                const product = {
                  id: "red-bull-sugar-free-12pk-sponsored",
                  name: "Red Bull Sugar Free 12pk",
                  price: "£14.25",
                  image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Energy%20Drinks/15.%20Red%20Bull%20Energy%20Drink%20Sugar%20Free%2012%20X%20250ml.jpeg"
                };
                addItem(product);
              }}
            >
              Add to Basket
            </Button>
          </div>

          {/* Monster White 4pk */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <div className="relative mb-3 bg-white rounded-lg p-3 shadow-sm">
              <img 
                src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/2%20-%20Monster%20Energy%20Drink%204x500ml.jpg"
                alt="Monster White 4pk"
                className="w-full h-32 object-contain"
              />
              <Badge className="absolute top-1 right-1 bg-yellow-500 text-black">Sponsored</Badge>
            </div>
            <h3 className="font-semibold text-sm mb-2">Monster White 4pk</h3>
            <p className="text-lg font-bold text-primary mb-3">£6.99</p>
            <Button 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                const product = {
                  id: "monster-white-4pk-sponsored",
                  name: "Monster White 4pk",
                  price: "£6.99",
                  image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/2%20-%20Monster%20Energy%20Drink%204x500ml.jpg"
                };
                addItem(product);
              }}
            >
              Add to Basket
            </Button>
          </div>

          {/* Red Bull Winter Edition 4pk */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <div className="relative mb-3 bg-white rounded-lg p-3 shadow-sm">
              <img 
                src="https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Energy%20Drinks/6.%20Red%20Bull%20Energy%20Drink%20Sugar%20Free%20Fuji%20Apple%20&%20Ginger,%20Winter%20Edition%204%20X%20250ml.jpeg"
                alt="Red Bull Winter Edition 4pk"
                className="w-full h-32 object-contain"
              />
              <Badge className="absolute top-1 right-1 bg-yellow-500 text-black">Sponsored</Badge>
            </div>
            <h3 className="font-semibold text-sm mb-2">Red Bull Winter Edition 4pk</h3>
            <p className="text-lg font-bold text-primary mb-3">£3.50</p>
            <Button 
              size="sm" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                const product = {
                  id: "red-bull-winter-edition-4pk-sponsored",
                  name: "Red Bull Winter Edition 4pk",
                  price: "£3.50",
                  image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Energy%20Drinks/6.%20Red%20Bull%20Energy%20Drink%20Sugar%20Free%20Fuji%20Apple%20&%20Ginger,%20Winter%20Edition%204%20X%20250ml.jpeg"
                };
                addItem(product);
              }}
            >
              Add to Basket
            </Button>
          </div>
        </div>
      </section>

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