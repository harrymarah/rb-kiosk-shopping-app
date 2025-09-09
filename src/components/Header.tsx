import { Heart, User, ShoppingCart, Home, Calendar, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBar from "./SearchBar";
import { useProducts } from "./ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import BasketDrawer from "./BasketDrawer";
import FavoritesDrawer from "./FavoritesDrawer";
import CouponsDrawer from "./CouponsDrawer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Header = () => {
  const {
    products
  } = useProducts();
  const {
    getTotalItems
  } = useBasket();
  const {
    favorites
  } = useFavorites();
  const navigate = useNavigate();

  // Flatten all products for search
  const allProducts = products ? [...(products.shopNew || []), ...(products.breakfast || [])] : [];
  const handleProductSelect = (product: any) => {
    console.log('Selected product:', product);
    // You can add navigation logic here
  };
  return <header className="bg-white shadow-md border-b border-border">
      {/* Top Status Bar */}
      

      {/* Main Header */}
      <div className="px-4 py-6 bg-white">

        {/* Search Bar - Made more prominent */}
        <div className="mb-8">
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
            <CouponsDrawer>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-gray-100 border border-gray-200">
                <Ticket className="h-5 w-5 text-gray-700" />
              </Button>
            </CouponsDrawer>
            <FavoritesDrawer>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-gray-100 border border-gray-200">
                <Heart className="h-5 w-5 text-gray-700" />
                {favorites.length > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    {favorites.length}
                  </Badge>}
              </Button>
            </FavoritesDrawer>
            <BasketDrawer>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-full hover:bg-gray-100 border border-gray-200">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
                {getTotalItems() > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-white">
                    {getTotalItems()}
                  </Badge>}
              </Button>
            </BasketDrawer>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;