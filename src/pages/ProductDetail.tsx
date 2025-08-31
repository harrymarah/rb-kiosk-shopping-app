import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ArrowLeft, Plus, Minus, ShoppingCart, Star } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/components/ProductSection";
import { useBasket } from "@/contexts/BasketContext";
import { useToast } from "@/components/ui/use-toast";
import { OfferDrawer } from "@/components/OfferDrawer";
import { getProxiedImageUrl } from "@/lib/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  offer?: string;
  image: string;
  category: string;
  description?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allProducts, isLoading } = useProducts();
  const { addItem } = useBasket();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showOfferDrawer, setShowOfferDrawer] = useState(false);

  useEffect(() => {
    if (allProducts && id) {
      const foundProduct = allProducts.find((p: Product) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        
        // Get related products from the same category
        const related = allProducts
          .filter((p: Product) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    }
  }, [allProducts, id]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [id]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if this is a hot drink that should show the "one for now, one for later" offer
    const hotDrinkNames = ['Premium Coffee', 'Cappuccino', 'Latte', 'Earl Grey Tea', 'English Breakfast Tea', 'Chai Latte', 'Americano', 'Hot Chocolate'];
    const isHotDrink = hotDrinkNames.some(name => product.name.includes(name)) || hotDrinkNames.includes(product.name);
    
    if (isHotDrink) {
      // Show offer drawer for hot drinks with the "one for now, one for later" deal
      setShowOfferDrawer(true);
    } else {
      // For all other products, add directly to cart without showing offers
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }, quantity);
      
      toast({
        title: "Added to basket",
        description: `${quantity} x ${product.name} has been added to your basket.`,
      });
    }
  };

  const handleAddRelatedToCart = (relatedProduct: Product) => {
    addItem({
      id: relatedProduct.id,
      name: relatedProduct.name,
      price: relatedProduct.price,
      image: relatedProduct.image
    }, 1);
    
    toast({
      title: "Added to basket",
      description: `${relatedProduct.name} has been added to your basket.`,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-muted-foreground">Loading product...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <p className="text-center text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate('/quickmart')}
                className="cursor-pointer hover:text-foreground"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate(`/quickmart?category=${product.category}&tab=explore`)}
                className="cursor-pointer hover:text-foreground"
              >
                {product.category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={getProxiedImageUrl(product.image)}
                alt={product.name}
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
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
              
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8)</span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-foreground">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
              {product.offer && (
                <div className="flex items-center gap-2 text-destructive font-medium">
                  <Heart className="h-4 w-4 fill-destructive" />
                  <span>{product.offer}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || "A high-quality product perfect for your daily needs. Made with care and attention to detail, this item offers great value and satisfaction."}
              </p>
            </div>

            {/* Quantity selector and actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantity:</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decrementQuantity}
                    className="h-10 w-10 rounded-none border-r border-border"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10 rounded-none border-l border-border"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Basket
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="px-4"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Usually bought next */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-8">Usually bought next</h2>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {relatedProducts.map((relatedProduct) => (
                  <CarouselItem key={relatedProduct.id} className="md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <ProductCard
                        image={relatedProduct.image}
                        name={relatedProduct.name}
                        price={relatedProduct.price}
                        originalPrice={relatedProduct.originalPrice}
                        offer={relatedProduct.offer}
                        isFavorite={false}
                        onToggleFavorite={() => {}}
                        onAddToCart={() => handleAddRelatedToCart(relatedProduct)}
                        productId={relatedProduct.id}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
      </div>
      
      {/* Offer Drawer */}
      {product && (
        <OfferDrawer
          isOpen={showOfferDrawer}
          onClose={() => {
            setShowOfferDrawer(false);
            setQuantity(1); // Reset quantity after drawer closes
          }}
          product={product}
          quantity={quantity}
          onAcceptOffer={(offer) => {
            console.log('Offer accepted:', offer);
          }}
          onDeclineOffer={() => {
            console.log('Offer declined');
          }}
        />
      )}
    </div>
  );
};

export default ProductDetail;