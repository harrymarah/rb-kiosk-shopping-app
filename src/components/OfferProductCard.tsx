import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { percentOff, splitPrice, unitPrice } from '@/lib/price';

interface OfferProductCardProps {
  product: any;
  onAdd: (product: any) => void;
  /** Shows the small "Sponsored" line under the name, as in the reference. */
  sponsored?: boolean;
}

/**
 * Deal card in the supermarket shelf-edge style: sale price with superscript
 * pence and a unit price, the previous price struck through beneath it, and a
 * percentage-off flash.
 */
const OfferProductCard = ({ product, onAdd, sponsored = false }: OfferProductCardProps) => {
  const navigate = useNavigate();
  const { pounds, pence } = splitPrice(product.price);
  const saving = percentOff(product.price, product.originalPrice);
  const nowPerUnit = unitPrice(product.price, product.name);
  const wasPerUnit = unitPrice(product.originalPrice, product.name);

  return (
    <div
      className="flex flex-col bg-card rounded-xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product image with the add button tucked into its bottom-right */}
      <div className="relative">
        <div className="aspect-square bg-white p-4">
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
        <button
          aria-label={`Add ${product.name} to basket`}
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
          className="absolute -bottom-4 right-3 w-11 h-11 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 pt-6 pb-4 flex flex-col flex-1">
        {/* Sale price, pence raised, with the shelf-edge unit price alongside */}
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="font-display font-extrabold text-offer-accent leading-none">
            <span className="text-2xl">£{pounds}</span>
            <sup className="text-sm align-super">{pence}</sup>
          </span>
          {nowPerUnit && (
            <span className="text-xs text-muted-foreground">{nowPerUnit}</span>
          )}
        </div>

        {product.originalPrice && (
          <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice}
            </span>
            {wasPerUnit && (
              <span className="text-xs text-muted-foreground line-through">{wasPerUnit}</span>
            )}
          </div>
        )}

        {saving !== null && (
          <span className="self-start mt-2 rounded-md bg-offer-accent text-offer-accent-foreground px-2 py-0.5 text-xs font-bold">
            {saving}% off
          </span>
        )}

        <h3 className="mt-2 text-sm text-foreground line-clamp-2 leading-snug">{product.name}</h3>

        {sponsored && (
          <span className="mt-1 text-xs text-muted-foreground">Sponsored</span>
        )}
      </div>
    </div>
  );
};

export default OfferProductCard;
