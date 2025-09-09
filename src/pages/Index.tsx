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
  const [activeTab, setActiveTab] = useState("foryou");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { favorites: favItems, toggleFavorite: toggleFav, isFavorite } = useFavorites();
  const { addItem } = useBasket();
  const { toast } = useToast();
  const { products, categories, allProducts } = useProducts();
  const favoritesSet = new Set(favItems.map(f => f.id));

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
    setSelectedCategory(category);
    // Don't change activeTab - let the category view show regardless of tab
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
            <BannerAd />
            <h2 className="text-2xl font-bold text-foreground mb-6">Products You'll Love</h2>
            <div className="grid grid-cols-4 gap-6">
              {allProducts
                .sort(() => Math.random() - 0.5)
                .slice(0, 8)
                .map((product, index) => (
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

      {activeTab === "usuals" && allProducts && (
        <div className="space-y-8">
          <ProductCarousel 
            title="Your Usual Items" 
            products={[
              // Heinz Beanz
              allProducts?.find(p => p.id === 'heinz-beanz-in-tomato-sauce-415g-16a467') || {
                id: 'heinz-beanz-in-tomato-sauce-415g-16a467',
                name: 'Heinz Beanz In Tomato Sauce 415G',
                price: '£1.40',
                image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/4.%20Heinz%20Beanz%20In%20Tomato%20Sauce%20415g.avif'
              },
              // Heinz Tomato Ketchup
              allProducts?.find(p => p.id === 'heinz-tomato-ketchup-910g-729f91') || {
                id: 'heinz-tomato-ketchup-910g-729f91',
                name: 'Heinz Tomato Ketchup 910g',
                price: '£4.50',
                image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/BBQ/7.%20Heinz%20Tomato%20Ketchup%20910g.jpg'
              },
              // Cadbury Dairy Milk
              allProducts?.find(p => p.id === 'cadbury-dairy-milk-chocolate-bar-large-360g-6456f6') || {
                id: 'cadbury-dairy-milk-chocolate-bar-large-360g-6456f6',
                name: 'Cadbury Dairy Milk Chocolate Bar Large 360g',
                price: '£4.50',
                image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Summer%20of%20Sport/8.%20Cadbury%20Dairy%20Milk%20Chocolate%20Bar%20Large%20360g.jpeg'
              },
              // Red Bull Peach Edition
              allProducts?.find(p => p.id === 'red-bull-sugar-free-energy-drink-summer-white-peach-edition-4-x-250ml-17c73f') || {
                id: 'red-bull-sugar-free-energy-drink-summer-white-peach-edition-4-x-250ml-17c73f',
                name: 'Red Bull Sugar Free Energy Drink Summer White Peach Edition 4 X 250ml',
                price: '£3.50',
                image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Red%20Bull/5.%20Red%20Bull%20Sugar%20Free%20Energy%20Drink%20Summer%20White%20Peach%20Edition%204%20X%20250ml.jpeg'
              },
              // Walkers Crisps
              allProducts?.find(p => p.id === 'walkers-sensations-poppadoms-lime-coriander-sharing-bag-82-5g-685be8') || {
                id: 'walkers-crisps-ready-salted',
                name: 'Walkers Ready Salted Crisps 32.5g',
                price: '£0.80',
                image: '/placeholder.svg'
              },
              // Warburtons Bread
              allProducts?.find(p => p.id === 'warburtons-hot-dog-rolls-6-pack-sliced-65c415') || {
                id: 'warburtons-medium-sliced-bread',
                name: 'Warburtons Medium White Bread 800g',
                price: '£1.10',
                image: '/placeholder.svg'
              },
              // McVitie's Jaffa Cakes
              allProducts?.find(p => p.id === 'mcvitie-s-the-original-jaffa-cakes-snack-packs-6-x-3-pack-af692b') || {
                id: 'mcvitie-s-the-original-jaffa-cakes-snack-packs-6-x-3-pack-af692b',
                name: 'McVitie\'s The Original Jaffa Cakes Snack Packs 6 X 3 Pack',
                price: '£1.65',
                image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/11.%20McVitie\'s%20The%20Original%20Jaffa%20Cakes%20Snack%20Packs%206%20X%203%20Pack.jpeg'
              },
              // Coca-Cola
              allProducts?.find(p => p.id === 'coca-cola-zero-sugar-24-x-330ml-0a0ed5') || {
                id: 'coca-cola-original-8x330ml',
                name: 'Coca-Cola Original 8x330ml',
                price: '£5.50',
                image: '/placeholder.svg'
              },
              // Andrex Toilet Tissue
              {
                id: 'andrex-toilet-tissue-9-pack',
                name: 'Andrex Classic Clean Toilet Tissue 9 Pack',
                price: '£6.50',
                image: '/placeholder.svg'
              },
              // Pepsi Max
              allProducts?.find(p => p.id === 'pepsi-max-no-sugar-cola-cans-24-x-330ml-605b03') || {
                id: 'pepsi-max-no-sugar-cola-cans-24-x-330ml-605b03',
                name: 'Pepsi Max No Sugar Cola Cans 24 X 330ml',
                price: '£8.50',
                image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Soft%20Drinks/3.%20Pepsi%20Max%20No%20Sugar%20Cola%20Cans%2024%20X%20330ml.jpg'
              },
              // Persil Laundry Capsules
              {
                id: 'persil-laundry-capsules-38-wash',
                name: 'Persil Non-Bio Laundry Capsules 38 Wash',
                price: '£12.00',
                image: '/placeholder.svg'
              },
              // Fairy Washing-Up Liquid
              {
                id: 'fairy-washing-up-liquid-original',
                name: 'Fairy Original Washing-Up Liquid 780ml',
                price: '£2.50',
                image: '/placeholder.svg'
              },
              // Pot Noodle
              {
                id: 'pot-noodle-chicken-curry-90g',
                name: 'Pot Noodle Chicken & Mushroom 90g',
                price: '£1.25',
                image: '/placeholder.svg'
              },
              // Birds Eye Frozen Fish Fingers
              {
                id: 'birds-eye-fish-fingers-10-pack',
                name: 'Birds Eye Fish Fingers 10 Pack 280g',
                price: '£2.75',
                image: '/placeholder.svg'
              },
              // Arla Milk
              {
                id: 'arla-fresh-milk-2-pint',
                name: 'Arla Fresh British Milk 2 Pint',
                price: '£1.45',
                image: '/placeholder.svg'
              },
              // Walkers Frozen Chips
              {
                id: 'walkers-oven-chips-900g',
                name: 'Walkers Oven Chips Straight Cut 900g',
                price: '£1.80',
                image: '/placeholder.svg'
              }
            ].filter(Boolean)} 
            favorites={favoritesSet}
            onToggleFavorite={toggleFavoriteById}
          />
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
                  <span className="font-bold">£28.45</span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  {
                    id: 'red-bull-energy-drink-12-x-250ml-e1fde4',
                    name: 'Red Bull Energy Drink 12 X 250ml',
                    price: '£10.50',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Red%20Bull/7.%20Red%20Bull%20Energy%20Drink%2012%20X%20250ml.jpeg'
                  },
                  {
                    id: 'heinz-beanz-in-tomato-sauce-415g-16a467',
                    name: 'Heinz Beanz In Tomato Sauce 415G',
                    price: '£1.40',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/4.%20Heinz%20Beanz%20In%20Tomato%20Sauce%20415g.avif'
                  },
                  {
                    id: 'heinz-tomato-ketchup-910g-729f91',
                    name: 'Heinz Tomato Ketchup 910g',
                    price: '£4.50',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/BBQ/7.%20Heinz%20Tomato%20Ketchup%20910g.jpg'
                  },
                  {
                    id: 'cadbury-dairy-milk-chocolate-110g-84b0c1',
                    name: 'Cadbury Dairy Milk Chocolate 110g',
                    price: '£2.50',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/6.%20Cadbury%20Dairy%20Milk%20Chocolate%20110g.jpeg'
                  },
                  {
                    id: 'walkers-ready-salted-crisps-32-5g-a19e34',
                    name: 'Walkers Ready Salted Crisps 32.5g',
                    price: '£1.25',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/7.%20Walkers%20Ready%20Salted%20Crisps%2032.5g.jpeg'
                  },
                  {
                    id: 'coca-cola-zero-sugar-24-x-330ml-0a0ed5',
                    name: 'Coca-Cola Zero Sugar 24 X 330ml',
                    price: '£12.00',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/BBQ/5.%20Coca-Cola%20Zero%20Sugar%2024%20X%20330ml.jpeg'
                  },
                  {
                    id: 'mcvitie-s-jaffa-cakes-hot-honey-flavour-x10-04db04',
                    name: 'McVitie\'s Jaffa Cakes Hot Honey Flavour x10',
                    price: '£1.50',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/New/8.%20McVitie\'s%20Jaffa%20Cakes%20Hot%20Honey%20Flavour%20x10.jpg'
                  },
                  {
                    id: 'pot-noodle-chicken-korma-flavour-90g-8c3b4f',
                    name: 'Pot Noodle Chicken & Korma Flavour 90g',
                    price: '£1.50',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Big%20Night%20In/9.%20Pot%20Noodle%20Chicken%20&%20Korma%20Flavour%2090g.jpeg'
                  },
                  {
                    id: 'pepsi-max-no-sugar-cola-cans-24-x-330ml-605b03',
                    name: 'Pepsi Max Original 24 X 330ml',
                    price: '£12.00',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Big%20Night%20In/10.%20Pepsi%20Max%20Original%2024%20X%20330ml.jpeg'
                  },
                  {
                    id: 'ariel-original-washing-powder-675g-2f1d89',
                    name: 'Ariel Original Washing Powder 675g',
                    price: '£4.00',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Big%20Night%20In/11.%20Ariel%20Original%20Washing%20Powder%20675g.jpeg'
                  },
                  {
                    id: 'fairy-washing-up-liquid-original-433ml-9a8c7b',
                    name: 'Fairy Washing Up Liquid Original 433ml',
                    price: '£2.00',
                    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Big%20Night%20In/12.%20Fairy%20Washing%20Up%20Liquid%20Original%20433ml.jpeg'
                  }
                ].map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
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
                    const hardCodedProducts = [
                      { id: 'red-bull-energy-drink-12-x-250ml-e1fde4', name: 'Red Bull Energy Drink 12 X 250ml', price: '£10.50' },
                      { id: 'heinz-beanz-in-tomato-sauce-415g-16a467', name: 'Heinz Beanz In Tomato Sauce 415G', price: '£1.40' },
                      { id: 'heinz-tomato-ketchup-910g-729f91', name: 'Heinz Tomato Ketchup 910g', price: '£4.50' },
                      { id: 'cadbury-dairy-milk-chocolate-bar-large-360g-6456f6', name: 'Cadbury Dairy Milk Chocolate Bar Large 360g', price: '£4.50' },,
                      { id: 'walkers-sensations-poppadoms-lime-coriander-sharing-bag-82-5g-685be8', name: 'Walkers Sensations Poppadoms Lime & Coriander Sharing Bag 82.5g', price: '£1.75' },,
                      { id: 'coca-cola-zero-sugar-24-x-330ml-0a0ed5', name: 'Coca-Cola Zero Sugar 24 X 330ml', price: '£12.00' },
                      { id: 'mcvitie-s-jaffa-cakes-hot-honey-flavour-x10-04db04', name: 'McVitie\'s Jaffa Cakes Hot Honey Flavour x10', price: '£1.50' },
                      { id: 'doritos-cool-original-tortilla-chips-sharing-bag-crisps-180g-e0e8e9', name: 'Doritos Cool Original Tortilla Chips Sharing Bag Crisps 180g', price: '£1.75' },,
                      { id: 'pepsi-max-no-sugar-cola-cans-24-x-330ml-605b03', name: 'Pepsi Max No Sugar Cola Cans 24 X 330ml', price: '£8.50' },,
                      { id: 'ariel-original-washing-powder-675g-2f1d89', name: 'Ariel Original Washing Powder 675g', price: '£4.00' },
                      { id: 'fairy-washing-up-liquid-original-433ml-9a8c7b', name: 'Fairy Washing Up Liquid Original 433ml', price: '£2.00' }
                    ];
                    
                    hardCodedProducts.forEach(product => {
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
