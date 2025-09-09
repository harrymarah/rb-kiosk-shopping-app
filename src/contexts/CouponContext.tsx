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
  getTotalDiscount: () => number;
  getAppliedCoupons: () => Coupon[];
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
      id: 'rb-discount',
      type: 'discount',
      value: '£1.50 off',
      discountAmount: 1.50,
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
      discountAmount: 0, // Points don't reduce price
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
      discountAmount: 2.00,
      description: 'when you buy',
      productName: 'Monster Energy Drink 4x500ml',
      productImage: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/2%20-%20Monster%20Energy%20Drink%204x500ml.jpg',
      productPrice: '£5.85/100ml',
      validUntil: '15 Jul 2024 (34 more days)',
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

  const getTotalDiscount = () => {
    return availableCoupons
      .filter(coupon => appliedCoupons.includes(coupon.id) && coupon.type === 'discount')
      .reduce((total, coupon) => total + coupon.discountAmount, 0);
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
      getAppliedCoupons
    }}>
      {children}
    </CouponContext.Provider>
  );
};