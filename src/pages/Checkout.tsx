import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "@/contexts/BasketContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShoppingCart, Plus } from "lucide-react";
import { useProducts } from "@/components/ProductSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Checkout = () => {
  const { items, getTotalPrice, clearBasket, addItem } = useBasket();
  const { allProducts } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  
  // Get product recommendations (excluding items already in basket)
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const basketProductIds = new Set(items.map(item => item.id));
      const availableProducts = allProducts.filter(product => !basketProductIds.has(product.id));
      const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
      setRecommendations(shuffled.slice(0, 3));
    }
  }, [allProducts, items]);

  const formatPrice = (price: number) => `£${price.toFixed(2)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Clear basket and navigate to confirmation
    clearBasket();
    navigate('/confirmation');
  };

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-32 max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(parseFloat(item.price.replace('£', '')) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name (Optional)</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input 
                      id="address" 
                      value="42-56 Earlham Street, London WC2H 9LA"
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Expected delivery: Within 15-20 minutes
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Delivery fee: Free for orders over £20
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Place Order • ${formatPrice(getTotalPrice())}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* You Might Also Want Section */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Add a little extra</h2>
            
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {recommendations.map((product) => (
                  <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 h-full">
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2 flex-1 flex flex-col">
                          <h3 className="font-medium text-foreground line-clamp-2">{product.name}</h3>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-foreground">{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-auto">
                            <Button
                              size="sm"
                              className="w-full"
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
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Order
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;