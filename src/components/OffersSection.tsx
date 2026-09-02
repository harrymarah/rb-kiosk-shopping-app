import { useBasket } from '@/contexts/BasketContext';
import { useToast } from '@/components/ui/use-toast';
import { useOffers } from '@/hooks/useOffers';
import OfferProductCard from './OfferProductCard';

interface OffersSectionProps {
  /** Cap the number of offers shown. Omit to show the full list. */
  limit?: number;
}

/** Scalloped percentage flash that sits in the corner of the section. */
const PercentBadge = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 text-offer-accent" aria-hidden="true">
    <g fill="currentColor">
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i * 36 * Math.PI) / 180;
        return (
          <circle key={i} cx={50 + 30 * Math.cos(angle)} cy={50 + 30 * Math.sin(angle)} r={12} />
        );
      })}
      <circle cx="50" cy="50" r="32" />
    </g>
    <text
      x="50"
      y="50"
      textAnchor="middle"
      dominantBaseline="central"
      fill="hsl(var(--offer-accent-foreground))"
      fontSize="38"
      fontWeight="700"
    >
      %
    </text>
  </svg>
);

const OffersSection = ({ limit }: OffersSectionProps) => {
  const offers = useOffers(limit);
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
    <section className="px-6 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-offer-surface rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                Offers
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Prices held until the end of the month
              </p>
            </div>
            <PercentBadge />
          </div>

          {/* 3 products per row, per the storefront feedback */}
          <div className="grid grid-cols-3 gap-4">
            {offers.map((product: any, index: number) => (
              <OfferProductCard
                key={product.id}
                product={product}
                onAdd={handleAdd}
                sponsored={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
