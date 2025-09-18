import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import WelcomeSection from "@/components/WelcomeSection";
import CategorySection from "@/components/CategorySection";
import TabNavigation from "@/components/TabNavigation";
import ProductSection, { useProducts } from "@/components/ProductSection";
import ProductCarousel from "@/components/ProductCarousel";
import ProductCard from "@/components/ProductCard";
import BannerAd from "@/components/BannerAd";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useBasket } from "@/contexts/BasketContext";
import { useToast } from "@/components/ui/use-toast";

// Force fresh component compilation
const Index = () => {
  const [searchParams] = useSearchParams();
  const [forYouProducts, setForYouProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("foryou");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { favorites: favItems, toggleFavorite: toggleFav, isFavorite } = useFavorites();
  const { addItem } = useBasket();
  const { toast } = useToast();
  const { products, categories, allProducts } = useProducts();
  const favoritesSet = new Set(favItems.map(f => f.id));

  // Generate stable "For You" products that only change after checkout
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const savedForYou = localStorage.getItem('forYouProducts');
      const lastCheckout = localStorage.getItem('lastCheckoutTime');
      const currentTime = Date.now();
      
      // Check if we need to refresh (no saved products, or 30 minutes since last checkout)
      const shouldRefresh = !savedForYou || 
        (lastCheckout && currentTime - parseInt(lastCheckout) > 30 * 60 * 1000) ||
        !lastCheckout;
      
      if (shouldRefresh) {
        const shuffled = [...allProducts].sort(() => Math.random() - 0.5).slice(0, 8);
        setForYouProducts(shuffled);
        localStorage.setItem('forYouProducts', JSON.stringify(shuffled));
      } else {
        try {
          const parsed = JSON.parse(savedForYou);
          setForYouProducts(parsed);
        } catch {
          // If parsing fails, generate new ones
          const shuffled = [...allProducts].sort(() => Math.random() - 0.5).slice(0, 8);
          setForYouProducts(shuffled);
          localStorage.setItem('forYouProducts', JSON.stringify(shuffled));
        }
      }
    }
  }, [allProducts]);

  // Category display names mapping
  const categoryDisplayNames: Record<string, string> = {
    newProducts: "New Products",
    bbq: "BBQ Essentials",
    bigNightIn: "Big Night In",
    energyDrinks: "Energy Drinks",
    softDrinks: "Soft Drinks",
    favourites: "Favourites",
    redBull: "Red Bull Products",
    summerOfSport: "Summer of Sport",
  };
  // Title case utility function
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ).replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  // Handle URL params for category selection
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const tabParam = searchParams.get("tab");
    
    if (categoryParam) {
      // Map category display names to IDs
      const categoryMappings: Record<string, string> = {
        'red bull products': 'redBull',
        'new products': 'newProducts',
        'energy drinks': 'energyDrinks',
        'soft drinks': 'softDrinks',
        'favourites': 'favourites',
        'bbq essentials': 'bbq',
        'big night in': 'bigNightIn',
        'summer of sport': 'summerOfSport',
      };
      const categoryId = categoryMappings[categoryParam.toLowerCase()] || categoryParam;
      setSelectedCategory(categoryId);
      // When a category is selected, switch to explore mode (clear active tab)
      setActiveTab("explore");
    } else if (tabParam) {
      setActiveTab(tabParam);
      // When switching to a tab, clear category selection
      setSelectedCategory(null);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedCategory(null); // Clear category when switching tabs
  };

  const handleCategorySelect = (category: string | null) => {
    if (category === 'favourites') {
      setActiveTab('favourites');
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      // Don't change activeTab - let the category view show regardless of tab
    }
  };

  const toggleFavoriteById = (productId: string) => {
    const product = allProducts?.find(p => p.id === productId);
    if (!product) return;
    toggleFav({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.categories?.[0] || 'general',
    });
  };

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    
    toast({
      title: "Added to basket",
      description: `${product.name} has been added to your basket.`,
    });
  };

  const categoryProducts = selectedCategory 
    ? allProducts?.filter(product => product.categories?.includes(selectedCategory)) || []
    : [];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeSection />
      
      {/* New Products Banner */}
      <div className="px-6 py-4">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => handleCategorySelect('newProducts')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">NEW</span>
              <span>Discover Our Latest Products</span>
            </div>
          </button>
        </div>
      </div>
      
      <CategorySection onSelectCategory={handleCategorySelect} />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === "foryou" && !selectedCategory && allProducts && (
        <div className="px-6 py-6">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <BannerAd />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Products You'll Love</h2>
            <div className="grid grid-cols-4 gap-6">
              {forYouProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  offer={product.offer}
                  isSponsored={index < 2}
                  isFavorite={favoritesSet.has(product.id)}
                  onToggleFavorite={() => toggleFavoriteById(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "newin" && !selectedCategory && allProducts && (
        <div className="px-6 py-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">New Products</h2>
            <div className="grid grid-cols-4 gap-6">
              {allProducts.filter(p => p.categories?.includes('newProducts')).map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  offer={product.offer}
                  isFavorite={favoritesSet.has(product.id)}
                  onToggleFavorite={() => toggleFavoriteById(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="px-6 py-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => handleCategorySelect(null)}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                ← Back to explore
              </button>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-6">{categoryDisplayNames[selectedCategory] || toTitleCase(selectedCategory)}</h2>
            <div className="grid grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  offer={product.offer}
                  isFavorite={favoritesSet.has(product.id)}
                  onToggleFavorite={() => toggleFavoriteById(product.id)}
                   onAddToCart={() => handleAddToCart(product)}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "usuals" && !selectedCategory && allProducts && (
        <div className="px-6 py-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Usual Items</h2>
            <div className="grid grid-cols-4 gap-6">
              {allProducts.filter(p => p.categories?.includes('usuals')).map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  offer={product.offer}
                  isFavorite={favoritesSet.has(product.id)}
                  onToggleFavorite={() => toggleFavoriteById(product.id)}
                  onAddToCart={() => handleAddToCart(product)}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "lastorder" && (
        <div className="px-6 py-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Last Order</h2>
            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Order #ORD-2024-0892</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(Date.now() - 86400000 * 3).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Home Delivery • Delivered
                  </span>
                  <span className="font-bold">£35.58</span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="grid grid-cols-4 gap-6">
                {allProducts?.filter(p => p.categories?.includes('lastOrder')).map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    offer={product.offer}
                    isFavorite={favoritesSet.has(product.id)}
                    onToggleFavorite={() => toggleFavoriteById(product.id)}
                    onAddToCart={() => handleAddToCart(product)}
                    productId={product.id}
                  />
                ))}
              </div>
              
              {/* Reorder Button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    const lastOrderProducts = allProducts?.filter(p => p.categories?.includes('lastOrder')) || [];
                    
                    lastOrderProducts.forEach(product => {
                      handleAddToCart(product);
                    });
                    
                    toast({
                      title: "Items added to basket",
                      description: "Your last order has been added to your basket.",
                    });
                  }}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Reorder All Items
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Energy Drinks Section - Only show on foryou tab and when no category is selected */}
      {activeTab === "foryou" && !selectedCategory && (
        <div className="px-6 py-6">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-card p-6 rounded-lg border mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Energy Drinks</h3>
                  <p className="text-sm text-muted-foreground">6 items</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">
                    Energy Collection • Available
                  </span>
                  <span className="font-bold">£26.40</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {allProducts?.filter(p => p.categories?.includes('energyDrinks')).map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    offer={product.offer}
                    isFavorite={favoritesSet.has(product.id)}
                    onToggleFavorite={() => toggleFavoriteById(product.id)}
                    onAddToCart={() => handleAddToCart(product)}
                    productId={product.id}
                  />
                ))}
              </div>
              
              {/* Add All Energy Drinks Button */}
              <div className="text-center mt-8">
                <button
                  onClick={() => {
                    const energyDrinksProducts = allProducts?.filter(p => p.categories?.includes('energyDrinks')) || [];
                    
                    energyDrinksProducts.forEach(product => {
                      handleAddToCart(product);
                    });
                    
                    toast({
                      title: "Items added to basket",
                      description: "All energy drinks have been added to your basket.",
                    });
                  }}
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Add All Energy Drinks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      
      {activeTab === "favourites" && (
        <div className="px-6 py-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Your Favourites</h2>
            <div className="grid grid-cols-4 gap-6">
              {favItems.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFav(product)}
                  onAddToCart={() => handleAddToCart(product)}
                  productId={product.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
