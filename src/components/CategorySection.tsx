import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CategoryItem {
  id: string;
  name: string;
  image: string;
}

interface CategorySectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

const categories: CategoryItem[] = [
  { 
    id: 'newProducts', 
    name: 'New Products', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/12%20New%20Products/Image%201%20-%20Red%20Bull%20Lilac%20Edition%20Sugar%20Free%20Energy%20Drink%204x250ml.jpg'
  },
  { 
    id: 'breakfast', 
    name: 'Breakfast', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/category_images/breakfast_category_image.jpg'
  },
  { 
    id: 'energyDrinks', 
    name: 'Energy Drinks', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/1%20-%20Red%20Bull%20Energy%20250ml%20x4.jpeg'
  },
  { 
    id: 'matchReady', 
    name: 'Match Ready', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/category_images/match_ready_category_image.jpg'
  },
  { 
    id: 'softDrinks', 
    name: 'Soft Drinks', 
    image: '/assets/juice.jpg'
  },
  { 
    id: 'favourites', 
    name: 'Favourites', 
    image: '/assets/red-bull-sugar-free.jpg'
  },
];

const CategorySection = ({ onSelectCategory }: CategorySectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="bg-background px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Shop categories</h2>
          <Button variant="ghost" className="text-grocery-blue font-semibold hover:bg-grocery-blue/10">
            Show all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        
        <div className="grid grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                if (category.id === 'energyDrinks') {
                  navigate('/energy-drinks');
                } else {
                  onSelectCategory?.(category.id);
                }
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 shadow-lg group-hover:scale-105 transition-transform duration-200">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-foreground text-center leading-tight">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;