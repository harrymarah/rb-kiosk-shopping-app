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

// Default favorites: Products from the official 'Favourite Products' category
const defaultFavorites: FavoriteItem[] = [
  {
    id: "fav1",
    name: "Oatly Oat Drink Barista Edition",
    price: "£2.49",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%201%20-%20Oatly%20Oat%20Drink%20Barista%20Edition.jpg",
    category: "favourites"
  },
  {
    id: "fav2",
    name: "Heineken Lager Beer Bottles 4x330ml",
    price: "£5.99",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%202%20-%20Heineken%20Lager%20Beer%20Bottles%204x330ml.jpg",
    category: "favourites"
  },
  {
    id: "fav3",
    name: "Propercorn Sweet & Salty",
    price: "£2.99",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%203%20-%20Propercorn%20Sweet%20&%20Salty.jpg",
    category: "favourites"
  },
  {
    id: "fav4",
    name: "Red Bull Energy Drink 8x250ml",
    price: "£15.99",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%204%20-%20Red%20Bull%20Energy%20Drink%208x250ml.jpg",
    category: "favourites"
  },
  {
    id: "fav5",
    name: "Cadbury Dairy Milk Caramel Chocolate Bar",
    price: "£1.99",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%205%20-%20Cadbury%20Dairy%20Milk%20Caramel%20Chocolate%20Bar.jpg",
    category: "favourites"
  },
  {
    id: "fav6",
    name: "Goodfella's Stonebaked Thin Pepperoni Pizza",
    price: "£4.99",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%206%20-%20Goodfella's%20Stonebaked%20Thin%20Pepperoni%20Pizza.jpg",
    category: "favourites"
  },
  {
    id: "fav7",
    name: "Coca Cola Original 8x330ml",
    price: "£6.49",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%207%20-%20Coca%20Cola%20Original%208x330ml.jpg",
    category: "favourites"
  },
  {
    id: "fav8",
    name: "Candy Kittens Wild Strawberry 140g",
    price: "£3.49",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%208%20-%20Candy%20Kittens%20Wild%20Strawberry%20140g.jpg",
    category: "favourites"
  },
  {
    id: "fav10",
    name: "Graze Protein Salt & Pepper Sharing Mixed Nuts Snack",
    price: "£2.99",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%2010%20-%20Graze%20Protein%20Salt%20&%20Pepper%20Sharing%20Mixed%20Nuts%20Snack.jpg",
    category: "favourites"
  },
  {
    id: "fav11",
    name: "Starbucks Caramel Macchiato Iced Coffee",
    price: "£3.49",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%2011%20-%20Starbucks%20Caramel%20Macchiato%20Iced%20Coffee.jpg",
    category: "favourites"
  },
  {
    id: "fav12",
    name: "Walkers Extra Flamin Hot",
    price: "£1.49",
    image: "https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Favourite%20Products/12%20Favourites/Image%2012%20-%20Walkers%20Extra%20Flamin%20Hot.jpg",
    category: "favourites"
  }
];

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(defaultFavorites);

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