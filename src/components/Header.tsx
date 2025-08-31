import { Heart, User, ShoppingCart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "./SearchBar";
import { useProducts } from "./ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import BasketDrawer from "./BasketDrawer";
import FavoritesDrawer from "./FavoritesDrawer";
import heroBanner from "@/assets/hero-banner-long.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { products } = useProducts();
  const { getTotalItems } = useBasket();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  
  // Flatten all products for search
  const allProducts = products ? [
    ...(products.shopNew || []),
    ...(products.breakfast || [])
  ] : [];

  const handleProductSelect = (product: any) => {
    console.log('Selected product:', product);
    // You can add navigation logic here
  };

  return (
    <header className="min-h-[200px] relative overflow-hidden bg-cover bg-center bg-no-repeat overflow-visible" style={{ backgroundImage: `url(${heroBanner})` }}>
      {/* Subtle overlay for better button visibility */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 container mx-auto px-6 py-8 h-full flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-1 max-w-2xl w-full">
            <SearchBar />
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              <Home className="h-6 w-6" />
            </Button>
            <FavoritesDrawer>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 relative">
                <Heart className="h-6 w-6" />
                {favorites.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </FavoritesDrawer>
            <BasketDrawer>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10 relative">
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </BasketDrawer>
          </div>
        </div>

        <div className="text-center flex-1 flex items-center justify-center">
          <div>
            <h1 className="text-5xl font-light text-brand-yellow mb-1 tracking-wider">
              QuickMart
            </h1>
            <p className="text-xl font-light text-white tracking-wide">
              Earlham Street
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;