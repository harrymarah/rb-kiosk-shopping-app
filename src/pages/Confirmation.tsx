import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDelivery } from "@/contexts/DeliveryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, MapPin, ShoppingBag, Truck, Car, Zap, Receipt, Phone, Package } from "lucide-react";
import { useProducts } from "@/components/ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import BannerAd from "@/components/BannerAd";

const Confirmation = () => {
  const navigate = useNavigate();
  const { selectedDelivery, getDeliveryDetails } = useDelivery();
  const { allProducts } = useProducts();
  const { addItem } = useBasket();
  const [deliveryTime, setDeliveryTime] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [orderNumber] = useState<string>(() => 
    `QM${Date.now().toString().slice(-6)}`
  );
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const didSetRecommendations = useRef(false);

  const deliveryDetails = getDeliveryDetails();

  // Get delivery icon based on selected method
  const getDeliveryIcon = () => {
    switch (selectedDelivery) {
      case 'home': return Truck;
      case 'express': return Zap;
      case 'collect': return Car;
      default: return Truck;
    }
  };

  const DeliveryIcon = getDeliveryIcon();

  useEffect(() => {
    // Calculate delivery/pickup time based on delivery method
    const now = new Date();
    let timeMinutes: number;
    
    switch (selectedDelivery) {
      case 'express':
        timeMinutes = Math.floor(Math.random() * 11) + 20; // 20-30 minutes
        break;
      case 'collect':
        timeMinutes = Math.floor(Math.random() * 6) + 15; // 15-20 minutes
        break;
      default: // home delivery
        timeMinutes = Math.floor(Math.random() * 31) + 60; // 60-90 minutes
        break;
    }

    const deliveryDate = new Date(now.getTime() + timeMinutes * 60000);
    setDeliveryTime(
      deliveryDate.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    setTimeRemaining(timeMinutes * 60); // in seconds

    // Update countdown every minute for grocery orders (not every second)
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 60) {
          clearInterval(interval);
          return 0;
        }
        return prev - 60;
      });
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [selectedDelivery]);

  // Set recommended products - grocery essentials
  useEffect(() => {
    if (!didSetRecommendations.current && allProducts && allProducts.length > 0) {
      // Prioritize essentials like bread, milk, eggs for grocery recommendations
      const essentials = allProducts.filter(product => 
        product.name.toLowerCase().includes('milk') ||
        product.name.toLowerCase().includes('bread') ||
        product.name.toLowerCase().includes('eggs') ||
        product.name.toLowerCase().includes('butter') ||
        product.name.toLowerCase().includes('cheese')
      );
      
      const otherProducts = allProducts.filter(product => !essentials.includes(product));
      const shuffledOthers = [...otherProducts].sort(() => Math.random() - 0.5);
      
      const recommendations = [...essentials.slice(0, 2), ...shuffledOthers.slice(0, 2)];
      setRecommendedProducts(recommendations);
      didSetRecommendations.current = true;
    }
  }, [allProducts]);

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  const getStatusSteps = () => {
    switch (selectedDelivery) {
      case 'collect':
        return [
          { label: 'Order received', completed: true },
          { label: 'Preparing your items', active: true },
          { label: 'Ready for pickup', completed: false },
          { label: 'Collected', completed: false }
        ];
      default:
        return [
          { label: 'Order received', completed: true },
          { label: 'Preparing your groceries', active: true },
          { label: 'Out for delivery', completed: false },
          { label: 'Delivered', completed: false }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-8 max-w-4xl">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Your grocery order has been placed successfully.
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
            <Receipt className="w-4 h-4" />
            <span className="font-semibold">Order #{orderNumber}</span>
          </div>
        </div>

        {/* Order Details - Dynamic based on delivery type */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Delivery Information */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <DeliveryIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{deliveryDetails.label}</h3>
                  <p className="text-sm text-muted-foreground">{deliveryDetails.description}</p>
                </div>
              </div>
              
              {selectedDelivery === 'express' ? (
                // Express delivery - show countdown and progress
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Delivery by:</span>
                    <span className="text-lg font-bold text-primary">{deliveryTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Time remaining:</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatTimeRemaining(timeRemaining)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: '25%' }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>We'll call you when we're close</span>
                  </div>
                </div>
              ) : selectedDelivery === 'collect' ? (
                // Click & Collect - show pickup info
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Pickup Instructions</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>42 Earlham St, London WC2H 9LA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Ready by {deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4" />
                        <span>Bring this confirmation and ID</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      We'll text you when your order is ready for collection
                    </p>
                  </div>
                </div>
              ) : (
                // Home delivery - show delivery window
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Delivery Window</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Expected delivery: {deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>Our driver will call 10 minutes before arrival</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>42 Earlham St, London WC2H 9LA</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Your groceries will be carefully packed and delivered fresh
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Dynamic Content */}
          {selectedDelivery === 'express' ? (
            // Express delivery - show order progress
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Express Order Progress
                </h3>
                <div className="space-y-4">
                  {getStatusSteps().map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        step.completed 
                          ? 'bg-green-500' 
                          : step.active 
                          ? 'bg-blue-500 animate-pulse' 
                          : 'bg-muted'
                      }`}></div>
                      <span className={`text-sm ${
                        step.completed || step.active 
                          ? 'text-foreground' 
                          : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            // Home delivery & Click & collect - show order summary
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order Number:</span>
                    <span className="font-medium">#{orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Delivery Method:</span>
                    <span className="font-medium">{deliveryDetails.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Delivery Fee:</span>
                    <span className="font-medium">{deliveryDetails.fee}</span>
                  </div>
                </div>
                
                {selectedDelivery === 'collect' && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800 font-medium">
                      💡 Store hours: 7am - 11pm daily
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Customer Service Info */}
        <Card className="mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span>Call us: 020 7123 4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Store hours: 7am - 11pm</span>
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-primary" />
                <span>Order #{orderNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Add-ons */}
        {recommendedProducts.length > 0 && (
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h2 className="text-xl font-bold text-blue-800 mb-2">
                Don't forget these essentials!
              </h2>
              <p className="text-blue-700 text-sm">
                Add these items to your next order or pick them up in-store
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div onClick={() => navigate(`/product/${product.id}`)}>
                      <div className="w-full h-32 bg-white rounded-lg overflow-hidden mb-3 border">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-primary mb-3">{product.price}</p>
                    </div>
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
                      Add to Next Order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Loyalty Program Banner */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '1s' }}>
          <BannerAd 
            title="Join QuickMart Rewards Today!" 
            subtitle="Earn points on every purchase and get exclusive member discounts"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>
          <Button
            size="lg"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            Shop Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;