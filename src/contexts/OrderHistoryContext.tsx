import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface OrderItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  deliveryMethod: 'home' | 'express' | 'collect';
  status: 'completed' | 'delivered' | 'collected';
}

interface OrderHistoryContextType {
  lastOrder: Order | null;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  clearOrderHistory: () => void;
}

const OrderHistoryContext = createContext<OrderHistoryContextType | undefined>(undefined);

interface OrderHistoryProviderProps {
  children: ReactNode;
}

export const OrderHistoryProvider: React.FC<OrderHistoryProviderProps> = ({ children }) => {
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('quickmart-last-order');
    if (savedOrder) {
      try {
        setLastOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error('Error loading last order:', error);
      }
    } else {
      // Set a sample last order with Red Bull 12 pack
      const sampleOrder: Order = {
        id: 'QM123456',
        items: [
          {
            id: 'red-bull-energy-drink-12-x-250ml-e1fde4',
            name: 'Red Bull Energy Drink 12 X 250ml',
            price: '£10.50',
            image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Red%20Bull/7.%20Red%20Bull%20Energy%20Drink%2012%20X%20250ml.jpeg',
            quantity: 1
          }
        ],
        total: 10.50,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        deliveryMethod: 'home',
        status: 'delivered'
      };
      setLastOrder(sampleOrder);
    }
  }, []);

  // Save to localStorage whenever lastOrder changes
  useEffect(() => {
    if (lastOrder) {
      localStorage.setItem('quickmart-last-order', JSON.stringify(lastOrder));
    }
  }, [lastOrder]);

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `QM${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      status: orderData.deliveryMethod === 'collect' ? 'collected' : 'delivered'
    };
    
    setLastOrder(newOrder);
  };

  const clearOrderHistory = () => {
    setLastOrder(null);
    localStorage.removeItem('quickmart-last-order');
  };

  return (
    <OrderHistoryContext.Provider value={{
      lastOrder,
      addOrder,
      clearOrderHistory
    }}>
      {children}
    </OrderHistoryContext.Provider>
  );
};

export const useOrderHistory = () => {
  const context = useContext(OrderHistoryContext);
  if (context === undefined) {
    throw new Error('useOrderHistory must be used within an OrderHistoryProvider');
  }
  return context;
};