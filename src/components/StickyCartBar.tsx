import { useNavigate, useLocation } from "react-router-dom";
import { useBasket } from "@/contexts/BasketContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, Eye } from "lucide-react";

export const StickyCartBar = () => {
  const { items, getTotalPrice } = useBasket();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show if no items in basket or on confirmation page
  if (items.length === 0 || location.pathname === '/confirmation') {
    return null;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = getTotalPrice();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 animate-slide-up">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Cart summary */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                <span className="text-muted-foreground mx-1">•</span>
                <span className="font-bold text-foreground">£{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/basket')}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Basket
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/checkout')}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};