import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/components/ProductSection";

const RedBullProducts = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { products: productsData } = useProducts();

  // Get all Red Bull products from various categories
  const getAllRedBullProducts = () => {
    if (!productsData) return [];

    const allProducts = [
      ...(productsData.redBull || []),
      ...(productsData.energyDrinks || []).filter(product => 
        product.name.toLowerCase().includes('red bull')
      ),
      ...(productsData.softDrinks || []).filter(product => 
        product.name.toLowerCase().includes('red bull')
      ),
      ...(productsData.matchReady || []).filter(product => 
        product.name.toLowerCase().includes('red bull')
      ),
      ...(productsData.favourites || []).filter(product => 
        product.name.toLowerCase().includes('red bull')
      ),
      ...(productsData.shopNew || []).filter(product => 
        product.name.toLowerCase().includes('red bull')
      ),
      ...(productsData.beverages || []).filter(product => 
        product.name.toLowerCase().includes('red bull')
      ),
    ];

    // Remove duplicates based on product name
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.name === product.name)
    );

    return uniqueProducts;
  };

  const redBullProducts = getAllRedBullProducts();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const toggleFavoriteById = (productId: string) => {
    const product = redBullProducts.find(p => p.id === productId);
    if (product) {
      toggleFavorite(product);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/quickmart')}
              className="shrink-0"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Red Bull Products</h1>
              <p className="text-muted-foreground">
                Complete collection of Red Bull energy drinks
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-6">
        {redBullProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {redBullProducts.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                name={product.name}
                price={product.price}
                offer={product.offer}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() => toggleFavoriteById(product.id)}
                productId={product.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No Red Bull products found</h2>
            <p className="text-muted-foreground">
              Check back later for our Red Bull collection.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RedBullProducts;