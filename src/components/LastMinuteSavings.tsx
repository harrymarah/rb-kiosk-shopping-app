import { useBasket } from '@/contexts/BasketContext';
import { useToast } from '@/components/ui/use-toast';
import { useOffers } from '@/hooks/useOffers';
import OfferProductCard from './OfferProductCard';

/**
 * "Last Minute Savings" on the basket page. Features the top four products
 * from the storefront's Offers section, via the shared useOffers hook, and
 * uses the same deal card so the two read as one promotion.
 */
const LastMinuteSavings = () => {
  const offers = useOffers(4);
  const { addItem } = useBasket();
  const { toast } = useToast();

  if (!offers.length) return null;

  const handleAdd = (product: any) => {
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
    <div className="bg-offer-surface rounded-2xl p-6 mb-8">
      <div className="flex items-baseline gap-3 mb-5 flex-wrap">
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
          Last Minute Savings
        </h2>
        <p className="text-muted-foreground">— got everything you need?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {offers.map((product: any) => (
          <OfferProductCard key={product.id} product={product} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
};

export default LastMinuteSavings;
