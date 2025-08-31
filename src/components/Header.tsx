import { Heart, User, ShoppingCart, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "./SearchBar";
import { useProducts } from "./ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import BasketDrawer from "./BasketDrawer";
import FavoritesDrawer from "./FavoritesDrawer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const { products } = useProducts();
  const { getTotalItems } = useBasket();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'collection'>('delivery');
  
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
    <header className="bg-card shadow-sm">
      {/* Top Status Bar */}
      <div className="bg-grocery-blue text-white py-1 px-4 flex justify-between items-center text-xs">
        <div className="flex items-center gap-4">
          <span>11:51</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>4G</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white h-6 w-6 hover:bg-white/10">
            <Calendar className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white relative h-6 w-6 hover:bg-white/10">
            <User className="h-3 w-3" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-brand-green rounded-full"></div>
          </Button>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-4">
        {/* Delivery Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-muted rounded-full p-0.5 flex shadow-sm border">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-8 py-2 text-sm font-medium transition-all ${
                deliveryMode === 'delivery' 
                  ? 'bg-grocery-blue text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setDeliveryMode('delivery')}
            >
              Online
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-8 py-2 text-sm font-medium transition-all ${
                deliveryMode === 'collection' 
                  ? 'bg-grocery-blue text-white shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setDeliveryMode('collection')}
            >
              In-store
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <SearchBar />
        </div>

        {/* Brand and Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              QuickMart
            </h1>
            <p className="text-xs text-muted-foreground">
              Earlham Street • Open until 11pm
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <FavoritesDrawer>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-grocery-red"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </FavoritesDrawer>
            <BasketDrawer>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs bg-grocery-red"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </BasketDrawer>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;