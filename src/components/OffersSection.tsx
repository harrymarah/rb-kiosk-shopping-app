import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBasket } from '@/contexts/BasketContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/components/ui/use-toast';
import { useOffers, getSaving } from '@/hooks/useOffers';

interface OffersSectionProps {
  /** Cap the number of offers shown. Omit to show the full list. */
  limit?: number;
}

const OffersSection = ({ limit }: OffersSectionProps) => {
  const offers = useOffers(limit);
  const navigate = useNavigate();
  const { addItem } = useBasket();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  if (!offers.length) return null;

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: 'Added to basket',
      description: `${product.name} has been added to your basket.`,
    });
  };

  return (
    <section className="px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            Offers
          </h2>
          <p className="text-sm font-medium text-muted-foreground">
            Prices held until the end of the month
          </p>
        </div>

        {/* 3 products per row, per the storefront feedback */}
        <div className="grid grid-cols-3 gap-6">
          {offers.map((product: any) => {
            const saving = getSaving(product.price, product.originalPrice);

            return (
              <Card
                key={product.id}
                className="group relative cursor-pointer overflow-hidden border-2 border-destructive/25 hover:shadow-lg transition-all duration-200 h-full flex flex-col"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {saving && (
                  <div className="absolute top-0 left-0 z-10 bg-destructive text-destructive-foreground px-3 py-1.5 text-sm font-display font-bold rounded-br-lg">
                    Save {saving}
                  </div>
                )}

                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="relative mb-4">
                    <div className="aspect-square bg-white rounded-lg overflow-hidden border border-border/20">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                        }}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 bg-gray-100/90 hover:bg-gray-200/90 backdrop-blur-sm z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          category: product.categories?.[0] || 'general',
                        });
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite(product.id) ? 'fill-destructive text-destructive' : ''
                        }`}
                      />
                    </Button>
                  </div>

                  <div className="space-y-2 flex-1 flex flex-col justify-end">
                    <h3 className="font-medium text-foreground line-clamp-2">{product.name}</h3>

                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-extrabold text-destructive">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {product.offer && (
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">{product.offer}</span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Basket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
