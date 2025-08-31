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