import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { useBasket } from "@/contexts/BasketContext";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts } from "./ProductSection";
import { useNavigate } from "react-router-dom";

interface BasketDrawerProps {
  children: React.ReactNode;
}

const BasketDrawer = ({ children }: BasketDrawerProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearBasket, addItem } = useBasket();
  const { allProducts } = useProducts();
  const navigate = useNavigate();

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  // Get product recommendations (products not in basket)
  const getRecommendations = () => {
    if (!allProducts) return [];
    const basketProductIds = new Set(items.map(item => item.id));
    return allProducts
      .filter(product => !basketProductIds.has(product.id))
      .slice(0, 3);
  };

  if (items.length === 0) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {children}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Basket
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Your basket is empty</p>
            <p className="text-sm text-muted-foreground">Add some products to get started!</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Basket ({items.length} {items.length === 1 ? 'item' : 'items'})
            </div>
            <Button variant="ghost" size="sm" onClick={clearBasket}>
              Clear All
            </Button>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.price} each</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* You might also like section */}
          {getRecommendations().length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">You might also like</h3>
              <div className="grid grid-cols-3 gap-3">
                {getRecommendations().map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div 
                        className="space-y-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div className="w-full h-20 bg-muted rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground truncate">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.price}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image
                          });
                        }}
                      >
                        Add to Basket
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Checkout
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default BasketDrawer;