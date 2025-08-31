import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "@/contexts/BasketContext";
import { useDelivery } from "@/contexts/DeliveryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ShoppingCart, Plus, MapPin, Clock, Truck, Zap, Car } from "lucide-react";
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
  const { selectedDelivery, getDeliveryDetails } = useDelivery();
  const { allProducts } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  
  const deliveryDetails = getDeliveryDetails();

  // Get delivery icon
  const getDeliveryIcon = () => {
    switch (selectedDelivery) {
      case 'home': return Truck;
      case 'express': return Zap;
      case 'collect': return Car;
      default: return Truck;
    }
  };

  const DeliveryIcon = getDeliveryIcon();

  // Generate time slots based on delivery type
  const getTimeSlots = () => {
    const now = new Date();
    const slots = [];
    
    if (selectedDelivery === 'express') {
      // Express delivery - next 4 hours in 30-minute slots
      for (let i = 0; i < 8; i++) {
        const slotTime = new Date(now.getTime() + (30 + i * 30) * 60000);
        slots.push({
          value: slotTime.toISOString(),
          label: `${slotTime.getHours().toString().padStart(2, '0')}:${slotTime.getMinutes().toString().padStart(2, '0')} - ${(slotTime.getHours()).toString().padStart(2, '0')}:${(slotTime.getMinutes() + 30).toString().padStart(2, '0')}`
        });
      }
    } else if (selectedDelivery === 'collect') {
      // Click & collect - every 15 minutes from now + 15 minutes
      for (let i = 1; i <= 12; i++) {
        const slotTime = new Date(now.getTime() + (15 * i) * 60000);
        slots.push({
          value: slotTime.toISOString(),
          label: `Ready by ${slotTime.getHours().toString().padStart(2, '0')}:${slotTime.getMinutes().toString().padStart(2, '0')}`
        });
      }
    } else {
      // Home delivery - next 8 hours in 1-hour slots
      for (let i = 1; i <= 8; i++) {
        const slotTime = new Date(now.getTime() + i * 60 * 60000);
        const endTime = new Date(slotTime.getTime() + 60 * 60000);
        slots.push({
          value: slotTime.toISOString(),
          label: `${slotTime.getHours().toString().padStart(2, '0')}:00 - ${endTime.getHours().toString().padStart(2, '0')}:00`
        });
      }
    }
    
    return slots;
  };

  // Get product recommendations (excluding items already in basket)
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const basketProductIds = new Set(items.map(item => item.id));
      const availableProducts = allProducts.filter(product => !basketProductIds.has(product.id));
      const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
      setRecommendations(shuffled.slice(0, 4));
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

  const subtotal = getTotalPrice();
  const deliveryFee = selectedDelivery === 'express' ? 2.99 : selectedDelivery === 'collect' ? 0 : (subtotal >= 35 ? 0 : 3.99);
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-32 max-w-6xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Basket
          </Button>
          <h1 className="text-3xl font-bold">Secure Checkout</h1>
          <p className="text-muted-foreground mt-1">Complete your grocery order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Delivery Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DeliveryIcon className="w-5 h-5" />
                  {deliveryDetails.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="font-medium text-blue-900">{deliveryDetails.description}</p>
                    <p className="text-sm text-blue-700">{deliveryDetails.estimatedTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-900">{deliveryDetails.fee}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate('/')}
                      className="mt-1 text-xs"
                    >
                      Change
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {selectedDelivery === 'collect' ? 'Pickup Time' : 'Delivery Time'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot} required>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select your preferred ${selectedDelivery === 'collect' ? 'pickup' : 'delivery'} time`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getTimeSlots().map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Address/Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {selectedDelivery === 'collect' ? 'Contact Information' : 'Delivery Address'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="Enter first name" className="border border-input" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Enter last name" className="border border-input" required />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="Enter phone number" className="border border-input" required />
                  </div>

                  {selectedDelivery !== 'collect' && (
                    <>
                      <div>
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Input 
                          id="address" 
                          placeholder="Enter full address"
                          defaultValue="42 Earlham St, London"
                          className="border border-input"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input id="city" placeholder="London" defaultValue="London" className="border border-input" required />
                        </div>
                        <div>
                          <Label htmlFor="postcode">Postcode *</Label>
                          <Input id="postcode" placeholder="WC2H 9LA" defaultValue="WC2H 9LA" className="border border-input" required />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="notes">Special Instructions</Label>
                    <Textarea 
                      id="notes" 
                      placeholder={selectedDelivery === 'collect' 
                        ? "Any special requirements for pickup?" 
                        : "Delivery instructions (e.g., safe place, gate code, etc.)"
                      }
                      className="resize-none border border-input"
                      rows={3}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatPrice(parseFloat(item.price.replace('£', '')) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{selectedDelivery === 'collect' ? 'Pickup' : 'Delivery'} Fee:</span>
                    <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading || !selectedTimeSlot}
                  onClick={handleSubmit}
                >
                  {loading ? "Processing..." : `Place Order • ${formatPrice(total)}`}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Last-minute additions */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Don't forget these essentials</h2>
            
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
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2 flex-1 flex flex-col">
                          <h3 className="font-medium text-foreground line-clamp-2 text-sm">{product.name}</h3>
                          
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
                              Add
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