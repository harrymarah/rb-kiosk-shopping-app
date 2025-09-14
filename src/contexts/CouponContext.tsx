import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Coupon {
  id: string;
  type: 'discount' | 'points';
  value: string;
  discountAmount: number; // Actual discount amount in pounds
  description: string;
  productName: string;
  productImage: string;
  productPrice: string;
  validUntil: string;
  isActive: boolean;
}

interface CouponContextType {
  appliedCoupons: string[];
  availableCoupons: Coupon[];
  applyCoupon: (couponId: string) => void;
  removeCoupon: (couponId: string) => void;
  getTotalDiscount: (basketItems?: any[]) => number;
  getAppliedCoupons: () => Coupon[];
  validateCouponEligibility: (coupon: Coupon, basketItems?: any[]) => boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};

interface CouponProviderProps {
  children: ReactNode;
}

export const CouponProvider: React.FC<CouponProviderProps> = ({ children }) => {
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);

  const availableCoupons: Coupon[] = [
    {
      id: 'rb-winter-discount',
      type: 'discount',
      value: '£1.00 off',
      discountAmount: 1.00,
      description: 'when you buy',
      productName: 'Red Bull Energy Drink Sugarfree Winter Edition Fuji-Apple & Ginger 4 x 250ml',
      productImage: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Red%20Bull%20Products/ALL/12%20-%20Red%20Bull%20Peach%20Edition%20Sugar%20Free%20Energy%20Drink%20250ml%20x%204.jpg',
      productPrice: '£4.99',
      validUntil: '31 Dec 2025 (Limited Winter Edition)',
      isActive: true
    },
    {
      id: 'diet-coke-discount',
      type: 'discount',
      value: '50p off',
      discountAmount: 0.50,
      description: 'when you buy',
      productName: 'Diet Coke 8 x 330ml',
      productImage: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Soft%20Drinks/4%20-%20Diet%20Coke%2010x330ml.jpg',
      productPrice: '£4.25',
      validUntil: '31 Dec 2025 (Limited time offer)',
      isActive: true
    }
  ];

  const applyCoupon = (couponId: string) => {
    if (!appliedCoupons.includes(couponId)) {
      setAppliedCoupons([...appliedCoupons, couponId]);
    }
  };

  const removeCoupon = (couponId: string) => {
    setAppliedCoupons(appliedCoupons.filter(id => id !== couponId));
  };

  const getTotalDiscount = (basketItems: any[] = []) => {
    return availableCoupons
      .filter(coupon => appliedCoupons.includes(coupon.id) && coupon.type === 'discount')
      .filter(coupon => validateCouponEligibility(coupon, basketItems))
      .reduce((total, coupon) => total + coupon.discountAmount, 0);
  };

  const validateCouponEligibility = (coupon: Coupon, basketItems: any[] = []): boolean => {
    // For coupons that require specific products, check if they're in the basket
    if (coupon.id === 'diet-coke-discount') {
      // Check if basket contains Diet Coke 8 x 330ml
      return basketItems.some(item => 
        item.name.toLowerCase().includes('diet coke') && 
        (item.name.includes('8') || item.name.includes('330ml'))
      );
    }
    
    if (coupon.id === 'rb-winter-discount') {
      // Check if basket contains Red Bull Winter Edition
      return basketItems.some(item => 
        item.name.toLowerCase().includes('red bull') && 
        item.name.toLowerCase().includes('winter')
      );
    }
    
    // Default: allow coupon if no specific product requirements
    return true;
  };

  const getAppliedCoupons = () => {
    return availableCoupons.filter(coupon => appliedCoupons.includes(coupon.id));
  };

  return (
    <CouponContext.Provider value={{
      appliedCoupons,
      availableCoupons,
      applyCoupon,
      removeCoupon,
      getTotalDiscount,
      getAppliedCoupons,
      validateCouponEligibility
    }}>
      {children}
    </CouponContext.Provider>
  );
};