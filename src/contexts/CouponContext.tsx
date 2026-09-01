import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getProductImageUrl } from '@/lib/image';

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
  /** Code a customer can type into the promo code field at checkout. */
  code: string;
}

interface CouponContextType {
  appliedCoupons: string[];
  availableCoupons: Coupon[];
  applyCoupon: (couponId: string) => void;
  removeCoupon: (couponId: string) => void;
  getTotalDiscount: (basketItems?: any[]) => number;
  getAppliedCoupons: () => Coupon[];
  validateCouponEligibility: (coupon: Coupon, basketItems?: any[]) => boolean;
  /** Apply by promo code. Returns the matched coupon, or null if unknown. */
  applyCouponByCode: (code: string) => Coupon | null;
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
      productName: 'Red Bull Sugar Free The Ice Edition Vanilla Iced Berry Energy Drink 4 x 250ml',
      productImage: getProductImageUrl('Red Bull/11. Red Bull Sugar Free The Ice Edition Vanilla Iced Berry Energy Drink 4 X 250ml.avif'),
      productPrice: '£4.25',
      validUntil: '31 Dec 2026 (Limited Ice Edition)',
      isActive: true,
      code: 'ICE100'
    },
    {
      id: 'diet-coke-discount',
      type: 'discount',
      value: '50p off',
      discountAmount: 0.50,
      description: 'when you buy',
      productName: 'Diet Coke 12 X 150ml',
      productImage: getProductImageUrl('Soft Drinks/10. Diet Coke 12 X 150ml.avif'),
      productPrice: '£5.00',
      validUntil: '31 Dec 2026 (Limited time offer)',
      isActive: true,
      code: 'COKE50'
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
      return basketItems.some(item =>
        item.name.toLowerCase().includes('diet coke')
      );
    }
    
    if (coupon.id === 'rb-winter-discount') {
      return basketItems.some(item =>
        item.name.toLowerCase().includes('red bull') &&
        item.name.toLowerCase().includes('ice edition')
      );
    }
    
    // Default: allow coupon if no specific product requirements
    return true;
  };

  const getAppliedCoupons = () => {
    return availableCoupons.filter(coupon => appliedCoupons.includes(coupon.id));
  };

  const applyCouponByCode = (code: string) => {
    const match = availableCoupons.find(
      coupon => coupon.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (!match) return null;
    applyCoupon(match.id);
    return match;
  };

  return (
    <CouponContext.Provider value={{
      appliedCoupons,
      availableCoupons,
      applyCoupon,
      removeCoupon,
      getTotalDiscount,
      getAppliedCoupons,
      applyCouponByCode,
      validateCouponEligibility
    }}>
      {children}
    </CouponContext.Provider>
  );
};