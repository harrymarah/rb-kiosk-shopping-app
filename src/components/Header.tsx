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
    <header className="bg-background border-b">
      {/* Top Status Bar */}
      <div className="bg-muted/30 py-2 px-4 text-center">
        <p className="text-sm text-muted-foreground">11:51</p>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        {/* Delivery Toggle */}
        <div className="flex justify-center mb-4">
          <div className="bg-muted rounded-full p-1 flex">
            <Button
              variant={deliveryMode === 'delivery' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-6 ${
                deliveryMode === 'delivery' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setDeliveryMode('delivery')}
            >
              Online
            </Button>
            <Button
              variant={deliveryMode === 'collection' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-full px-6 ${
                deliveryMode === 'collection' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setDeliveryMode('collection')}
            >
              In-store
            </Button>
          </div>
          
          {/* Top Right Icons */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <User className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"></div>
            </Button>
          </div>
        </div>

        {/* Search and Navigation */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
          
          <div className="flex items-center gap-2">
            <FavoritesDrawer>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </FavoritesDrawer>
            <BasketDrawer>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </BasketDrawer>
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            QuickMart
          </h1>
          <p className="text-sm text-muted-foreground">
            Earlham Street
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;