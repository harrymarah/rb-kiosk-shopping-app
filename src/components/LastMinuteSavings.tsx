import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';
import { useBasket } from '@/contexts/BasketContext';
import { useToast } from '@/components/ui/use-toast';
import { useOffers, getSaving } from '@/hooks/useOffers';

/**
 * "Last Minute Savings" on the basket page. Features the top four products
 * from the storefront's Offers section, via the shared useOffers hook.
 */
const LastMinuteSavings = () => {
  const offers = useOffers(4);
  const { addItem } = useBasket();
  const { toast } = useToast();

  if (!offers.length) return null;

  return (
    <Card className="mb-8 border-2 border-destructive/25 bg-destructive/[0.03]">
      <CardContent className="p-6">
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Last Minute Savings
          </h2>
          <p className="text-muted-foreground">— got everything you need?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {offers.map((product: any) => {
            const saving = getSaving(product.price, product.originalPrice);

            return (
              <div
                key={product.id}
                className="flex flex-col bg-background rounded-lg border border-border p-3"
              >
                <div className="aspect-square bg-white rounded-md overflow-hidden mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                    }}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                  {product.name}
                </h3>

                <div className="mt-auto space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-lg font-extrabold text-destructive">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  {saving && (
                    <div className="flex items-center gap-1 text-destructive">
                      <Tag className="h-3 w-3" />
                      <span className="text-xs font-semibold">Save {saving}</span>
                    </div>
                  )}

                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
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
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LastMinuteSavings;
