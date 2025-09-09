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
    id: 'bbq', 
    name: 'BBQ Essentials', 
    image: '/placeholder.svg'
  },
  { 
    id: 'bigNightIn', 
    name: 'Big Night In', 
    image: '/placeholder.svg'
  },
  { 
    id: 'energyDrinks', 
    name: 'Energy Drinks', 
    image: 'https://ytmpkdrfujdbfkfhnimq.supabase.co/storage/v1/object/public/Food%20Delivery%20Assets/products/Categories/6%20Energy%20Drinks/1%20-%20Red%20Bull%20Energy%20250ml%20x4.jpeg'
  },
  { 
    id: 'softDrinks', 
    name: 'Soft Drinks', 
    image: '/assets/juice.jpg'
  },
  { 
    id: 'redBull', 
    name: 'Red Bull Products', 
    image: '/assets/red-bull-original.jpg'
  },
  { 
    id: 'summerOfSport', 
    name: 'Summer of Sport', 
    image: '/placeholder.svg'
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