import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "@/contexts/BasketContext";
import { toast } from "sonner";

interface CheckoutContextType {
  markCheckoutComplete: () => void;
}

export const useCheckout = (): CheckoutContextType => {
  const markCheckoutComplete = () => {
    // Mark checkout completion timestamp
    localStorage.setItem('lastCheckoutTime', Date.now().toString());
    
    // Clear the saved "For You" products so they regenerate
    localStorage.removeItem('forYouProducts');
  };

  return { markCheckoutComplete };
};