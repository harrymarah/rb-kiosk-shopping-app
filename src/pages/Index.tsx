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
import { useOrderHistory } from "@/contexts/OrderHistoryContext";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("favourites");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { favorites: favItems, toggleFavorite: toggleFav, isFavorite } = useFavorites();
  const { addItem } = useBasket();
  const { toast } = useToast();
  const { lastOrder } = useOrderHistory();
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
    setSelectedCategory(category);
    if (category) {
      setActiveTab("explore"); // Switch to explore mode when category is selected
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
      <CategorySection onSelectCategory={handleCategorySelect} />
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      
      
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
            
            {/* Energy Drinks Advert Block and Featured Products */}
            {selectedCategory === 'energyDrinks' && (
              <div className="mt-12 space-y-8">
                {/* Advertisement Block */}
                <BannerAd 
                  title="Red Bull - Wings When You Need Them" 
                  subtitle="Discover our complete range of energy drinks and limited edition flavors"
                />
                
                {/* Featured Products Carousel */}
                <ProductCarousel 
                  title="Featured Red Bull Products" 
                  products={[
                    // 250ml Sugar free red bull
                    allProducts?.find(p => p.id === 'energy2') || {
                      id: 'energy2',
                      name: 'Red Bull Sugar Free Energy Drink 250ml',
                      price: '£2.49',
                      image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Red%20Bull%20Products/ALL/18%20-%20Red%20Bull%20Sugar%20Free%20Energy%20Drink%20250ml%20.png'
                    },
                    // 4pk Sugar free red bull
                    allProducts?.find(p => p.id === 'energy4') || {
                      id: 'energy4',
                      name: 'Red Bull Sugar Free Energy Drink 250ml x4',
                      price: '£7.99',
                      image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/4%20-%20Red%20Bull%20Sugar%20Free%20Energy%20Drink%20250ml%20x4.jpeg'
                    },
                    // Winter red bull
                    allProducts?.find(p => p.id === 'rb11') || {
                      id: 'rb11',
                      name: 'Red Bull Winter Edition Sugar Free Energy Drink 250ml x 4',
                      price: '£7.99',
                      image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Red%20Bull%20Products/ALL/11%20-%20Red%20Bull%20Winter%20Edition%20Sugar%20Free%20Energy%20Drink%20250ml%20x%204.jpg'
                    },
                    // Lilac red bull
                    allProducts?.find(p => p.id === 'new1') || allProducts?.find(p => p.id === 'bev7') || {
                      id: 'new1',
                      name: 'Red Bull Lilac Edition Sugar Free Energy Drink 4x250ml',
                      price: '£9.99',
                      offer: 'New Arrival',
                      image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/12%20New%20Products/Image%201%20-%20Red%20Bull%20Lilac%20Edition%20Sugar%20Free%20Energy%20Drink%204x250ml.jpg'
                    }
                  ].filter(Boolean)}
                  favorites={favoritesSet}
                  onToggleFavorite={toggleFavoriteById}
                />
              </div>
            )}
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
            {lastOrder ? (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Order #{lastOrder.id}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(lastOrder.date).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {lastOrder.deliveryMethod === 'collect' ? 'Click & Collect' : 
                       lastOrder.deliveryMethod === 'express' ? 'Express Delivery' : 'Home Delivery'} • 
                      {lastOrder.status === 'collected' ? ' Collected' : ' Delivered'}
                    </span>
                    <span className="font-bold">£{lastOrder.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="grid grid-cols-4 gap-6">
                  {lastOrder.items.map((item) => (
                    <ProductCard
                      key={item.id}
                      image={item.image}
                      name={item.name}
                      price={item.price}
                      isFavorite={favoritesSet.has(item.id)}
                      onToggleFavorite={() => toggleFavoriteById(item.id)}
                      onAddToCart={() => handleAddToCart(allProducts?.find(p => p.id === item.id))}
                      productId={item.id}
                    />
                  ))}
                </div>
                
                {/* Reorder Button */}
                <div className="text-center mt-8">
                  <button
                    onClick={() => {
                      lastOrder.items.forEach(item => {
                        const product = allProducts?.find(p => p.id === item.id);
                        if (product) {
                          for (let i = 0; i < item.quantity; i++) {
                            handleAddToCart(product);
                          }
                        }
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
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">No previous orders yet</p>
                <p className="text-sm text-muted-foreground mt-2">Place an order to see your order history</p>
              </div>
            )}
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
