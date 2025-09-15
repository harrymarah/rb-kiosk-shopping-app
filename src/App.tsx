import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BasketProvider } from "@/contexts/BasketContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CouponProvider } from "./contexts/CouponContext";
import { DeliveryProvider } from "@/contexts/DeliveryContext";
import { OrderHistoryProvider } from "@/contexts/OrderHistoryContext";
import { StickyCartBar } from "@/components/StickyCartBar";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import Index from "./pages/Index";
import Basket from "./pages/Basket";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import NotFound from "./pages/NotFound";
import RedBullProducts from "./pages/RedBullProducts";
import EnergyDrinks from "./pages/EnergyDrinks";

const queryClient = new QueryClient();

const App = () => {
  useInactivityTimer();
  
  return (
  <QueryClientProvider client={queryClient}>
    <OrderHistoryProvider>
      <DeliveryProvider>
        <FavoritesProvider>
          <CouponProvider>
            <BasketProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <div className="pb-24">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/basket" element={<Basket />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/confirmation" element={<Confirmation />} />
                      <Route path="/red-bull-products" element={<RedBullProducts />} />
                      <Route path="/energy-drinks" element={<EnergyDrinks />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <StickyCartBar />
                </BrowserRouter>
              </TooltipProvider>
            </BasketProvider>
          </CouponProvider>
        </FavoritesProvider>
      </DeliveryProvider>
    </OrderHistoryProvider>
  </QueryClientProvider>
  );
};

export default App;
