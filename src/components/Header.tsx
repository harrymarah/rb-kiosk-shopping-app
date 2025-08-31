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
    <header className="bg-white shadow-md border-b border-border">
      {/* Top Status Bar */}
      <div className="bg-gray-900 text-white py-2 px-4 flex justify-between items-center text-xs">
        <div className="flex items-center gap-4">
          <span className="font-medium">11:51</span>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span className="font-medium">4G</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white h-6 w-6 hover:bg-white/20">
            <Calendar className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white relative h-6 w-6 hover:bg-white/20">
            <User className="h-3 w-3" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          </Button>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-4 py-6 bg-white">
        {/* Delivery Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-1 flex shadow-sm border border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all ${
                deliveryMode === 'delivery' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setDeliveryMode('delivery')}
            >
              Online
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-8 py-3 text-sm font-semibold transition-all ${
                deliveryMode === 'collection' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => setDeliveryMode('collection')}
            >
              In-store
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Brand and Navigation */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              QuickMart
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Earlham Street • Open until 11pm
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <FavoritesDrawer>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-gray-100 border border-gray-200">
                <Heart className="h-5 w-5 text-gray-700" />
                {favorites.length > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </FavoritesDrawer>
            <BasketDrawer>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-gray-100 border border-gray-200">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {getTotalItems() > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white"
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