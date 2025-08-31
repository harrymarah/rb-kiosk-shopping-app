import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, User, MapPin, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const highlights = [
    {
      id: "fresh-farm",
      name: "Fresh Farm Kitchen",
      rating: 4.6,
      reviews: "300+",
      deliveryTime: "15 - 25 min",
      videoUrl: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/videos/fresh_fruit_and_veg_chopping_board.mp4",
      badge: "Popular",
      badgeColor: "bg-green-600"
    },
    {
      id: "morning-delights",
      name: "Morning Delights",
      rating: 4.5,
      reviews: "300+",
      deliveryTime: "10 - 25 min",
      videoUrl: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/videos/drizzling_pancakes.mp4",
      badge: "Fast delivery",
      badgeColor: "bg-blue-600"
    },
    {
      id: "gourmet-bistro",
      name: "Gourmet Bistro",
      rating: 4.6,
      reviews: "200+",
      deliveryTime: "15 - 30 min",
      videoUrl: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/videos/meal_at_table.mp4",
      badge: "Premium",
      badgeColor: "bg-purple-600"
    }
  ];

  const groceryStores = [
    {
      id: "quickmart",
      name: "QuickMart",
      logo: "🛒",
      bgColor: "bg-blue-500",
      deliveryTime: "15 min",
      functional: true,
      description: "Groceries, snacks & more",
      videoUrl: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/videos/supermarket_compressed.mp4"
    },
    {
      id: "fresh-market",
      name: "Fresh Market",
      logo: "🥬",
      bgColor: "bg-green-500",
      deliveryTime: "20 min",
      functional: false,
      description: "Fresh produce daily",
      videoUrl: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/videos/vegetable_stall.mp4"
    }
  ];

  const allDayBreakfasts = [
    {
      id: "hearty-breakfast",
      name: "The Breakfast Club",
      rating: 4.5,
      reviews: "184",
      deliveryTime: "20 - 35 min",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop",
      badge: "150+ orders",
      badgeColor: "bg-green-600"
    },
    {
      id: "pastry-corner",
      name: "Pastry Corner",
      rating: 4.3,
      reviews: "92",
      deliveryTime: "15 - 30 min",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      badge: "New",
      badgeColor: "bg-red-600"
    }
  ];

  const handleStoreClick = (store: typeof groceryStores[0]) => {
    if (store.functional && store.id === "quickmart") {
      navigate("/quickmart");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with background image */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop')"
        }}
      >
        <div className="absolute top-0 left-0 right-0 p-4 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm opacity-80">Now</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Earlham St</span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Heart className="h-6 w-6 text-white" />
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-6">{getGreeting()}</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Restaurants, dishes, cuisines"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-xl border-0 bg-white text-lg"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Fee notice */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Fees apply, add to basket to see total price</span>
          <div className="w-4 h-4 rounded-full border border-muted-foreground flex items-center justify-center">
            <span className="text-xs">i</span>
          </div>
        </div>

        {/* Highlights Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Highlights</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {highlights.map((highlight) => (
              <Card key={highlight.id} className="flex-shrink-0 w-72 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={highlight.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/20" />
                    <Badge className={`absolute top-3 left-3 text-white text-xs ${highlight.badgeColor}`}>
                      ★ {highlight.rating} ({highlight.reviews})
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{highlight.name}</h3>
                    <p className="text-sm text-muted-foreground">{highlight.deliveryTime}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Grocery Stores Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Groceries & Essentials</h2>
          <div className="space-y-4">
            {groceryStores.map((store) => (
              <Card 
                key={store.id} 
                className={`overflow-hidden transition-shadow cursor-pointer ${
                  store.functional ? 'hover:shadow-lg' : 'opacity-75'
                }`}
                onClick={() => handleStoreClick(store)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="relative w-32 h-24 flex-shrink-0">
                      {store.videoUrl ? (
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src={store.videoUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <div className={`w-full h-full ${store.bgColor} flex items-center justify-center text-white text-3xl`}>
                          {store.logo}
                        </div>
                      )}
                      {!store.functional && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">×</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-foreground">{store.name}</h3>
                        <div className="text-right text-sm text-muted-foreground">
                          {store.deliveryTime}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{store.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All-day breakfasts Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">All-day breakfasts</h2>
          <div className="grid grid-cols-2 gap-4">
            {allDayBreakfasts.map((breakfast) => (
              <Card key={breakfast.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-32">
                    <img
                      src={breakfast.image}
                      alt={breakfast.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={`absolute top-2 left-2 text-white text-xs ${breakfast.badgeColor}`}>
                      {breakfast.badge}
                    </Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-foreground text-sm mb-1">{breakfast.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">★</span>
                        <span className="text-xs font-medium">{breakfast.rating}</span>
                        <span className="text-xs text-muted-foreground">({breakfast.reviews})</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{breakfast.deliveryTime}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t px-4 py-2">
        <div className="flex justify-around">
          <div className="text-center cursor-pointer" onClick={() => navigate("/")}>
            <div className="text-muted-foreground mb-1">🏠</div>
            <span className="text-xs text-muted-foreground">Home</span>
          </div>
          <div className="text-center">
            <div className="text-primary mb-1">🔍</div>
            <span className="text-xs text-primary font-medium">Discover</span>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1">🍽️</div>
            <span className="text-xs text-muted-foreground">Restaurants</span>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1">🛒</div>
            <span className="text-xs text-muted-foreground">Groceries</span>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground mb-1">🛍️</div>
            <span className="text-xs text-muted-foreground">Shopping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;