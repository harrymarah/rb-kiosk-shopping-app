import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Tag, Clock, CheckCircle2, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Coupon {
  id: string;
  type: 'discount' | 'points';
  value: string;
  description: string;
  productName: string;
  productImage: string;
  productPrice: string;
  validUntil: string;
  isActive: boolean;
}

interface CouponsDrawerProps {
  children: React.ReactNode;
}

const CouponsDrawer = ({ children }: CouponsDrawerProps) => {
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);

  const coupons: Coupon[] = [
    {
      id: 'rb-discount',
      type: 'discount',
      value: '£1.50 off',
      description: 'when you buy',
      productName: 'Red Bull Energy Drink Sugar Free Peach Edition 4 x 250ml',
      productImage: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Red%20Bull%20Products/ALL/12%20-%20Red%20Bull%20Peach%20Edition%20Sugar%20Free%20Energy%20Drink%20250ml%20x%204.jpg',
      productPrice: '£5.00/100ml',
      validUntil: '01 Jul 2024 (20 more days)',
      isActive: true
    },
    {
      id: 'coke-points',
      type: 'points',
      value: '300 points',
      description: 'when you buy',
      productName: 'Diet Coke 8 x 330ml',
      productImage: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Soft%20Drinks/4%20-%20Diet%20Coke%2010x330ml.jpg',
      productPrice: '£5.25/100ml',
      validUntil: '01 Jul 2024 (20 more days)',
      isActive: true
    },
    {
      id: 'monster-discount',
      type: 'discount',
      value: '£2.00 off',
      description: 'when you buy',
      productName: 'Monster Energy Drink 4x500ml',
      productImage: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/2%20-%20Monster%20Energy%20Drink%204x500ml.jpg',
      productPrice: '£5.85/100ml',
      validUntil: '15 Jul 2024 (34 more days)',
      isActive: true
    }
  ];

  const availableCoupons = coupons.filter(coupon => coupon.isActive);
  const appliedCouponsList = coupons.filter(coupon => appliedCoupons.includes(coupon.id));

  const handleCouponApply = (coupon: Coupon) => {
    if (!appliedCoupons.includes(coupon.id)) {
      setAppliedCoupons([...appliedCoupons, coupon.id]);
    }
  };

  const handleCouponRemove = (couponId: string) => {
    setAppliedCoupons(appliedCoupons.filter(id => id !== couponId));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-orange-600" />
            My Coupon Wallet
          </SheetTitle>
          <SheetDescription>
            Save money with your available coupons and offers
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Applied Coupons */}
          {appliedCouponsList.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Applied Coupons ({appliedCouponsList.length})
              </h4>
              {appliedCouponsList.map((coupon) => (
                <div key={coupon.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={coupon.productImage}
                        alt={coupon.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge className={`mb-2 ${coupon.type === 'points' ? 'bg-orange-500' : 'bg-red-500'}`}>
                            {coupon.value}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{coupon.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCouponRemove(coupon.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{coupon.productName}</h4>
                      <p className="text-xs text-muted-foreground">{coupon.productPrice}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available Coupons */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Available Coupons ({availableCoupons.filter(coupon => !appliedCoupons.includes(coupon.id)).length})
            </h4>
            {availableCoupons.filter(coupon => !appliedCoupons.includes(coupon.id)).map((coupon) => (
              <div key={coupon.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={coupon.productImage}
                      alt={coupon.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge className={`mb-2 ${coupon.type === 'points' ? 'bg-orange-500' : 'bg-red-500'}`}>
                          {coupon.value}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{coupon.description}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => handleCouponApply(coupon)}
                      >
                        Apply
                      </Button>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{coupon.productName}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{coupon.productPrice}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Valid until {coupon.validUntil}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CouponsDrawer;