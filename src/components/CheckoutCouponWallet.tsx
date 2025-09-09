import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Tag, Clock, CheckCircle2, X } from "lucide-react";
import { useCoupons } from "@/contexts/CouponContext";

interface CheckoutCouponWalletProps {
  className?: string;
}

const CheckoutCouponWallet = ({ className = "" }: CheckoutCouponWalletProps) => {
  const { 
    availableCoupons, 
    applyCoupon, 
    removeCoupon, 
    getAppliedCoupons 
  } = useCoupons();

  const appliedCouponsList = getAppliedCoupons();
  const availableCouponsList = availableCoupons.filter(coupon => 
    !appliedCouponsList.some(applied => applied.id === coupon.id)
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-orange-600" />
          My Coupon Wallet
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {availableCouponsList.length} available
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
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
                        onClick={() => removeCoupon(coupon.id)}
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
            Available Coupons ({availableCouponsList.length})
          </h4>
          {availableCouponsList.map((coupon) => (
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
                      onClick={() => applyCoupon(coupon.id)}
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
      </CardContent>
    </Card>
  );
};

export default CheckoutCouponWallet;