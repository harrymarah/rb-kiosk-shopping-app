import {
  BatteryCharging,
  CupSoda,
  Footprints,
  Heart,
  History,
  ShoppingBasket,
  Snowflake,
  Sparkles,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useProducts } from './ProductSection';
import { getProductImageUrl } from '@/lib/image';

interface CategorySectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

/** One icon per category driver, in the lucide style already used for Favourites. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  energyDrinks: BatteryCharging,
  favourites: Heart,
  newProducts: Sparkles,
  redBull: Zap,
  softDrinks: CupSoda,
  usuals: ShoppingBasket,
  lastOrder: History,
  moveSpring: Footprints,
  summerOutdoors: Sun,
  winterNight: Snowflake,
};

const CategorySection = ({ onSelectCategory }: CategorySectionProps) => {
  const navigate = useNavigate();
  const { categories } = useProducts();

  if (!categories?.length) return null;

  return (
    <section className="bg-background px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Shop categories
          </h2>
        </div>

        <Carousel opts={{ align: 'start', loop: false }} className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category: any) => {
              const Icon = CATEGORY_ICONS[category.id];

              return (
                <CarouselItem
                  key={category.id}
                  className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <div
                    onClick={() => {
                      if (category.id === 'energyDrinks') {
                        navigate('/energy-drinks');
                      } else {
                        onSelectCategory?.(category.id);
                      }
                    }}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-200 flex items-center justify-center bg-white">
                        <img
                          src={getProductImageUrl(category.imagePath)}
                          alt={category.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      {Icon && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-8 h-8 rounded-full bg-storefront text-storefront-foreground border-2 border-background flex items-center justify-center shadow-md">
                          <Icon size={16} />
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground text-center leading-tight">
                      {category.name}
                    </span>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default CategorySection;
