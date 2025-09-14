import { ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface CategoryItem {
  id: string;
  name: string;
  image?: string;
  isIcon?: boolean;
}

interface CategorySectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

const categories: CategoryItem[] = [
  { 
    id: 'favourites', 
    name: 'Favourites', 
    isIcon: true
  },
  { 
    id: 'newProducts', 
    name: 'New Products', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Energy%20Drinks/6.%20Red%20Bull%20Energy%20Drink%20Sugar%20Free%20Fuji%20Apple%20&%20Ginger,%20Winter%20Edition%204%20X%20250ml.jpeg'
  },
  { 
    id: 'softDrinks', 
    name: 'Soft Drinks', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/products/Soft%20Drinks/6.%20Lucozade%20Sport%20Drink%20Orange%204%20X%20500ml.avif'
  },
  { 
    id: 'energyDrinks', 
    name: 'Energy Drinks', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/1%20-%20Red%20Bull%20Energy%20250ml%20x4.jpeg'
  },
  { 
    id: 'bbq', 
    name: 'BBQ', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/assets/bbq_cat.jpg'
  },
  { 
    id: 'summerOfSport', 
    name: 'Summer of Sport', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/assets/summer_of_sport_cat.jpg'
  },
  { 
    id: 'bigNightIn', 
    name: 'Big Night In', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/qcom/assets/big_night_in_cat.jpg'
  },
];

const CategorySection = ({ onSelectCategory }: CategorySectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="bg-background px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Shop categories</h2>
        </div>
        
        
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6">
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
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-lg group-hover:scale-105 transition-transform duration-200 flex items-center justify-center bg-white">
                    {category.isIcon ? (
                      <Heart 
                        size={32} 
                        className="text-pink-500" 
                        fill="currentColor"
                      />
                    ) : (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground text-center leading-tight">
                    {category.name}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default CategorySection;