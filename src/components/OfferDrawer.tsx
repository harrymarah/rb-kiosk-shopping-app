import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Plus, X, Percent, Package, ShoppingCart, Eye } from "lucide-react";
import { useBasket } from "@/contexts/BasketContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface Offer {
  id: string;
  type: 'bundle' | 'size-up' | 'multi-buy';
  title: string;
  description: string;
  discount: string;
  originalPrice: string;
  offerPrice: string;
  items?: Product[];
  savings: string;
}

interface OfferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  onAcceptOffer: (offer: Offer) => void;
  onDeclineOffer: () => void;
}

const generateOffers = (product: Product, quantity: number): Offer[] => {
  const basePrice = parseFloat(product.price.replace('£', ''));
  
  const offers: Offer[] = [];
  
  // Check if the product is a hot drink
  const hotDrinkNames = ['Premium Coffee', 'Cappuccino', 'Latte', 'Earl Grey Tea', 'English Breakfast Tea', 'Chai Latte', 'Americano', 'Hot Chocolate'];
  const isHotDrink = hotDrinkNames.some(name => product.name.includes(name)) || hotDrinkNames.includes(product.name);
  
  if (isHotDrink && quantity === 1) {
    // Special "One for now, one for later" deal for hot drinks
    const redBullPrice = 2.55;
    const totalPrice = basePrice + redBullPrice;
    const originalTotal = basePrice + 3.50; // Assuming normal combo would be £3.50 more
    
    offers.push({
      id: 'hot-drink-redbull',
      type: 'bundle',
      title: 'One for Now, One for Later',
      description: `Get your ${product.name} now + Red Bull Original for later`,
      discount: 'ENERGY COMBO',
      originalPrice: `£${originalTotal.toFixed(2)}`,
      offerPrice: `£${totalPrice.toFixed(2)}`,
      savings: `£${(originalTotal - totalPrice).toFixed(2)}`,
      items: [
        {
          id: 'redbull-combo',
          name: 'Red Bull Original',
          price: '£2.55',
          image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/red_bull_assets/red_bull_original.png',
          category: 'beverages'
        }
      ]
    });
  } else if (quantity === 1) {
    // Regular multi-buy offer - 15% off second item
    const secondItemPrice = basePrice * 0.85; // 15% off second item
    const totalPrice = basePrice + secondItemPrice;
    const originalTotal = basePrice * 2;
    
    offers.push({
      id: 'multi-buy-1',
      type: 'multi-buy',
      title: 'Buy 2, Get 15% Off 2nd Item',
      description: `Get another ${product.name} for 15% off`,
      discount: '15% OFF 2ND',
      originalPrice: `£${originalTotal.toFixed(2)}`,
      offerPrice: `£${totalPrice.toFixed(2)}`,
      savings: `£${(originalTotal - totalPrice).toFixed(2)}`,
    });
  }
  
  // Bundle offer - prioritize Red Bull for food items (but not hot drinks)
  if (!isHotDrink) {
    const bundlePrice = basePrice + 2.99; // Add complementary item for £2.99
    let bundleItem = '';
    let bundleItemImage = '';
    
    // Check if the product is a food item (not beverages)
    const isFoodItem = ['breakfast', 'lunch', 'meals', 'snacks'].includes(product.category);
    
    if (isFoodItem) {
      // Prioritize Red Bull for all food items
      bundleItem = 'Red Bull Original';
      bundleItemImage = 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/red_bull_assets/red_bull_original.png';
    } else {
      // For beverages (non-hot drinks), suggest food items
      switch (product.category) {
        case 'beverages':
          bundleItem = 'Mixed Nuts';
          bundleItemImage = 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/snacks.jpg';
          break;
        default:
          bundleItem = 'Complementary item';
          bundleItemImage = product.image;
      }
    }
    
    offers.push({
      id: 'bundle-1',
      type: 'bundle',
      title: `${product.name} + ${bundleItem}`,
      description: `Perfect combo! Add ${bundleItem} for just £2.99`,
      discount: 'COMBO DEAL',
      originalPrice: `£${(basePrice + 3.99).toFixed(2)}`,
      offerPrice: `£${bundlePrice.toFixed(2)}`,
      savings: '£1.00',
      items: [
        {
          id: 'bundle-item',
          name: bundleItem,
          price: '£2.99',
          image: bundleItemImage,
          category: isFoodItem ? 'beverages' : 'snacks'
        }
      ]
    });
  }
  
  return offers;
};

export const OfferDrawer = ({
  isOpen,
  onClose,
  product,
  quantity,
  onAcceptOffer,
  onDeclineOffer,
}: OfferDrawerProps) => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { addItem } = useBasket();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const offers = generateOffers(product, quantity);
  
  const handleAcceptOffer = (offer: Offer) => {
    onAcceptOffer(offer);
    
    // Handle different offer types with accurate pricing
    if (offer.type === 'multi-buy') {
      // For multi-buy: add original item + second item with 15% off
      const basePrice = parseFloat(product.price.replace('£', ''));
      const secondItemPrice = basePrice * 0.85; // 15% off the second item
      
      // Add original item at regular price
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }, quantity);
      
      // Add second item at discounted price
      addItem({
        id: `${product.id}-discount`,
        name: `${product.name} (15% off)`,
        price: `£${secondItemPrice.toFixed(2)}`,
        image: product.image,
      }, 1);
      
    } else if (offer.type === 'bundle') {
      // For bundle: add original item + bundle item at offer price
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }, quantity);
      
      // Add bundle item with correct image and details
      const bundleItem = offer.items?.[0];
      if (bundleItem) {
        // Special handling for hot drink + Red Bull combo
        if (offer.id === 'hot-drink-redbull') {
          addItem({
            id: `bundle-${product.id}`,
            name: `${bundleItem.name} (Energy Combo)`,
            price: bundleItem.price,
            image: bundleItem.image,
          }, 1);
        } else {
          // Regular bundle deal
          addItem({
            id: `bundle-${product.id}`,
            name: `${bundleItem.name} (Bundle Deal)`,
            price: '£2.99',
            image: bundleItem.image,
          }, 1);
        }
      } else {
        // Fallback for legacy offers
        const bundleItemName = offer.title.split(' + ')[1];
        addItem({
          id: `bundle-${product.id}`,
          name: `${bundleItemName} (Bundle Deal)`,
          price: '£2.99',
          image: product.image,
        }, 1);
      }
      
    } else {
      // Default: add original item
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      }, quantity);
    }
    
    toast({
      title: "Offer accepted!",
      description: `${offer.title} added to your basket with savings of ${offer.savings}`,
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/checkout')}
          className="ml-auto"
        >
          View Basket
        </Button>
      ),
    });
    
    onClose();
  };
  
  const handleDeclineOffer = () => {
    onDeclineOffer();
    
    // Add just the original item
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }, quantity);
    
    toast({
      title: "Added to basket",
      description: `${quantity} x ${product.name} added to your basket`,
      action: (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/checkout')}
          className="ml-auto"
        >
          View Basket
        </Button>
      ),
    });
    
    onClose();
  };

  const handleViewBasket = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center pb-4">
          <DrawerTitle className="text-2xl font-bold text-foreground">
            Special Offers Available!
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Great deals to complement your purchase
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="px-6 pb-4 space-y-4 overflow-y-auto">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`border border-border rounded-lg p-4 cursor-pointer transition-all ${
                selectedOffer?.id === offer.id 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedOffer(offer)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {offer.type === 'bundle' && <Package className="h-5 w-5 text-primary" />}
                  {offer.type === 'multi-buy' && <Plus className="h-5 w-5 text-primary" />}
                  {offer.type === 'size-up' && <Percent className="h-5 w-5 text-primary" />}
                  <h3 className="font-semibold text-foreground">{offer.title}</h3>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {offer.discount}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {offer.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {offer.offerPrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {offer.originalPrice}
                  </span>
                </div>
                <div className="text-sm font-medium text-green-600">
                  Save {offer.savings}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <DrawerFooter className="gap-3">
          {selectedOffer && (
            <Button 
              onClick={() => handleAcceptOffer(selectedOffer)}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Accept Offer - {selectedOffer.offerPrice}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={handleDeclineOffer}
            className="w-full"
            size="lg"
          >
            <X className="h-4 w-4 mr-2" />
            No Thanks, Add Original Item
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleViewBasket}
            className="w-full"
            size="lg"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Basket
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};