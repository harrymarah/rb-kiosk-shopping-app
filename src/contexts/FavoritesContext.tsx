import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useProducts } from '@/components/ProductSection';

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


/** How many products to pre-populate the shopper's favourites with. */
const DEFAULT_FAVORITE_COUNT = 11;

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { allProducts } = useProducts();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // Clear any potential localStorage cache for favorites
    try {
      localStorage.removeItem('favoriteItems');
      localStorage.removeItem('userFavorites');
    } catch (e) {
      // Ignore localStorage errors
    }
    return [];
  });
  const seeded = useRef(false);

  // Seed from the live "Favourites" category rather than a hardcoded list.
  // Hardcoding meant ids, prices and images drifted out of step with the
  // catalogue whenever the product data changed.
  useEffect(() => {
    if (seeded.current || !allProducts?.length) return;
    seeded.current = true;
    setFavorites(
      allProducts
        .filter((p: any) => p.categories?.includes('favourites'))
        .slice(0, DEFAULT_FAVORITE_COUNT)
        .map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          category: 'favourites',
        }))
    );
  }, [allProducts]);

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