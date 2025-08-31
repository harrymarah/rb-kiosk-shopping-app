import { useState, useEffect } from "react";
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

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("favourites");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { favorites: favItems, toggleFavorite: toggleFav, isFavorite } = useFavorites();
  const { addItem } = useBasket();
  const { toast } = useToast();
  const { products, categories, allProducts } = useProducts();
  const favoritesSet = new Set(favItems.map(f => f.id));

  // Category display names mapping
  const categoryDisplayNames: Record<string, string> = {
    newProducts: "New Products",
    breakfast: "Breakfast Items", 
    energyDrinks: "Energy Drinks",
    matchReady: "Match Ready",
    softDrinks: "Soft Drinks",
    favourites: "Customer Favourites",
    redBull: "Red Bull Products"
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
      setSelectedCategory(categoryParam);
    }
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const toggleFavoriteById = (productId: string) => {
    const product = allProducts?.find(p => p.id === productId);
    if (!product) return;
    toggleFav({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
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
    ? allProducts?.filter(product => product.category === selectedCategory) || []
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeSection />
      <CategorySection onSelectCategory={setSelectedCategory} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      
      {activeTab === "newin" && products && (
        <div className="space-y-8">
          <ProductCarousel 
            title="Shop new" 
            products={products.shopNew} 
            favorites={favoritesSet}
            onToggleFavorite={toggleFavoriteById}
          />
          
          <ProductCarousel
            title="Breakfast" 
            products={products.breakfast?.slice(0, 6)} 
            favorites={favoritesSet}
            onToggleFavorite={toggleFavoriteById}
          />
          
          <ProductCarousel 
            title="Get Match Ready" 
            products={products.matchReady?.slice(0, 6)} 
            favorites={favoritesSet}
            onToggleFavorite={toggleFavoriteById}
          />
          
          <ProductCarousel 
            title="Soft Drinks" 
            products={products.softDrinks?.slice(0, 6)} 
            favorites={favoritesSet}
            onToggleFavorite={toggleFavoriteById}
          />
          
          <ProductCarousel 
            title="Energy Drinks" 
            products={products.energyDrinks?.slice(0, 6)} 
            favorites={favoritesSet}
            onToggleFavorite={toggleFavoriteById}
          />
          
          {/* Bottom Banner Advertisement */}
          <div className="px-6">
            <div className="container mx-auto max-w-4xl">
              <BannerAd 
                title="Join Our Loyalty Program" 
                subtitle="Earn points with every purchase and get exclusive member discounts"
                className="my-8"
              />
            </div>
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="px-6 py-6">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
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

      {activeTab === "usuals" && (
        <div className="px-6 py-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Your Usual Items</h2>
            <div className="text-center">
              <p className="text-muted-foreground">Items you buy regularly will appear here</p>
              <p className="text-sm text-muted-foreground mt-2">Start shopping to build your usuals list</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "lastorder" && (
        <div className="px-6 py-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Last Order</h2>
            <div className="text-center">
              <p className="text-muted-foreground">Your previous order will appear here</p>
              <p className="text-sm text-muted-foreground mt-2">Place an order to see your order history</p>
            </div>
          </div>
        </div>
      )}
      
      
      {activeTab === "favourites" && (
        <div className="px-6 py-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Your Favourites</h2>
            {favItems.length > 0 ? (
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
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">No favorite products yet</p>
                <p className="text-sm text-muted-foreground mt-2">Click the heart icon on products to add them to your favorites</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
