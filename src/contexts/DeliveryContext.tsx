import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DeliveryType = 'home' | 'express' | 'collect';

interface DeliveryContextType {
  selectedDelivery: DeliveryType;
  setSelectedDelivery: (delivery: DeliveryType) => void;
  getDeliveryDetails: () => {
    label: string;
    description: string;
    estimatedTime: string;
    fee: string;
  };
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

interface DeliveryProviderProps {
  children: ReactNode;
}

export const DeliveryProvider: React.FC<DeliveryProviderProps> = ({ children }) => {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>('home');

  const getDeliveryDetails = () => {
    switch (selectedDelivery) {
      case 'home':
        return {
          label: 'HOME DELIVERY',
          description: 'Delivered to your doorstep',
          estimatedTime: 'Next day delivery',
          fee: 'Free for orders over £35'
        };
      case 'express':
        return {
          label: 'EXPRESS DELIVERY',
          description: 'Priority delivery service',
          estimatedTime: '30 minutes',
          fee: '£2.99'
        };
      case 'collect':
        return {
          label: 'CLICK & COLLECT',
          description: 'Pick up from store',
          estimatedTime: 'Ready in 15 minutes',
          fee: 'Free'
        };
      default:
        return {
          label: 'HOME DELIVERY',
          description: 'Delivered to your doorstep',
          estimatedTime: 'Next day delivery',
          fee: 'Free for orders over £35'
        };
    }
  };

  return (
    <DeliveryContext.Provider value={{
      selectedDelivery,
      setSelectedDelivery,
      getDeliveryDetails
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (context === undefined) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};