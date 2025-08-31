import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getProxiedImageUrl } from "@/lib/image";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  originalPrice?: string;
  offer?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToCart?: () => void;
  productId?: string;
}

const ProductCard = ({ 
  image, 
  name, 
  price, 
  originalPrice, 
  offer,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
  productId
}: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border border-border h-full flex flex-col" onClick={handleCardClick}>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="relative mb-4">
          <div className="aspect-square bg-white rounded-lg overflow-hidden border border-border/20">
            <img 
              src={getProxiedImageUrl(image)} 
              alt={name} 
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={(e) => { 
                const target = e.currentTarget as HTMLImageElement;
                // Only fallback to placeholder if it's not already a placeholder and not a retry
                if (!target.src.includes('placeholder') && !target.dataset.retried) {
                  target.dataset.retried = 'true';
                  target.src = '/placeholder.svg';
                }
              }}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-gray-100/90 hover:bg-gray-200/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.();
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
          </Button>
        </div>
        
        <div className="space-y-2 flex-1 flex flex-col justify-end">
          <h3 className="font-medium text-foreground line-clamp-2">{name}</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice}
              </span>
            )}
          </div>
          
          {offer && (
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-destructive fill-destructive" />
              <span className="text-sm font-medium text-destructive">{offer}</span>
            </div>
          )}
          
          {onAddToCart && (
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart();
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Basket
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;