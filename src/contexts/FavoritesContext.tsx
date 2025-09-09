import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FavoriteItem {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

// Default favorites: Products from the official 'Favourites' category
const defaultFavorites: FavoriteItem[] = [
  {
    id: "dr-oetker-ristorante-pizza-pepperoni-salame-320g-929eb4",
    name: "Dr. Oetker Ristorante Pizza - Pepperoni-Salame 320g",
    price: "£1.50",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/1.%20Dr.%20Oetker%20Ristorante%20Pizza%20-%20Pepperoni-Salame%20320g.jpeg",
    category: "favourites"
  },
  {
    id: "hula-hoops-original-multipack-crisps-6x24g-43cf4a",
    name: "Hula Hoops Original Multipack Crisps 6x24g",
    price: "£1.75",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/2.%20Hula%20Hoops%20Original%20Multipack%20Crisps%206x24g.avif",
    category: "favourites"
  },
  {
    id: "red-bull-energy-drink-4-x-250ml-559d99",
    name: "Red Bull Energy Drink 4 X 250ml",
    price: "£5.65",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/3.%20Red%20Bull%20Energy%20Drink%204%20X%20250ml.jpeg",
    category: "favourites"
  },
  {
    id: "heinz-beanz-in-tomato-sauce-415g-16a467",
    name: "Heinz Beanz In Tomato Sauce 415G",
    price: "£1.40",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/4.%20Heinz%20Beanz%20In%20Tomato%20Sauce%20415g.avif",
    category: "favourites"
  },
  {
    id: "rowntree-s-fruit-pastilles-sweets-sharing-bag-143g-465c8c",
    name: "Rowntree's Fruit Pastilles Sweets Sharing Bag 143g",
    price: "£1.50",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/5.%20Rowntree's%20Fruit%20Pastilles%20Sweets%20Sharing%20Bag%20143g.jpeg",
    category: "favourites"
  },
  {
    id: "kit-kat-chunky-milk-chocolate-bars-multipack-40g-4-pack-eb594b",
    name: "Kit Kat Chunky Milk Chocolate Bars Multipack 40g 4 Pack",
    price: "£2.00",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/6.%20Kit%20Kat%20Chunky%20Milk%20Chocolate%20Bars%20Multipack%2040g%204%20Pack.jpeg",
    category: "favourites"
  },
  {
    id: "diet-coke-12-x-150ml-0ee34e",
    name: "Diet Coke 12 X 150ml",
    price: "£6.05",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/7.%20Diet%20Coke%2012%20X%20150ml.jpeg",
    category: "favourites"
  },
  {
    id: "san-miguel-especial-lager-beer-can-4-x-440ml-a5a955",
    name: "San Miguel Especial Lager Beer Can 4 X 440ml",
    price: "£5.75",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/8.%20San%20Miguel%20Especial%20Lager%20Beer%20Can%204%20X%20440ml.jpeg",
    category: "favourites"
  },
  {
    id: "propercorn-sweet-salty-popcorn-6-x-14g-f81bea",
    name: "Propercorn Sweet & Salty Popcorn 6 X 14g",
    price: "£1.50",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/9.%20Propercorn%20Sweet%20&%20Salty%20Popcorn%206%20X%2014g.jpeg",
    category: "favourites"
  },
  {
    id: "oatly-barista-edition-oat-drink-long-life-1l-9e71c4",
    name: "Oatly Barista Edition Oat Drink Long Life 1L",
    price: "£1.50",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/10.%20Oatly%20Barista%20Edition%20Oat%20Drink%20Long%20Life%201L.jpeg",
    category: "favourites"
  },
  {
    id: "mcvitie-s-the-original-jaffa-cakes-snack-packs-6-x-3-pack-af692b",
    name: "McVitie's The Original Jaffa Cakes Snack Packs 6 X 3 Pack",
    price: "£1.65",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Favourites/11.%20McVitie's%20The%20Original%20Jaffa%20Cakes%20Snack%20Packs%206%20X%203%20Pack.jpeg",
    category: "favourites"
  }
];

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  // Force reset to new defaults - increment version to clear any cached state
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // Clear any potential localStorage cache for favorites
    try {
      localStorage.removeItem('favoriteItems');
      localStorage.removeItem('userFavorites');
    } catch (e) {
      // Ignore localStorage errors
    }
    return defaultFavorites;
  });

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some(item => item.id === id);
  };

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item);
    }
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};