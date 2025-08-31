import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  textColor?: string;
  logo?: string;
}

interface CategorySectionProps {
  onSelectCategory?: (categoryId: string) => void;
}

const categories: CategoryItem[] = [
  { 
    id: 'special-offers', 
    name: 'Special Offers', 
    color: 'bg-brand-yellow', 
    textColor: 'text-foreground' 
  },
  { 
    id: 'marketplace', 
    name: 'QuickMart\nMarketplace', 
    color: 'bg-card border-2 border-border shadow-sm', 
    textColor: 'text-foreground' 
  },
  { 
    id: 'fresh', 
    name: 'Clothing &\nAccessories', 
    color: 'bg-foreground', 
    textColor: 'text-white' 
  },
  { 
    id: 'summer', 
    name: 'Summer\nEssentials', 
    color: 'bg-gradient-to-br from-grocery-orange via-grocery-red to-grocery-purple', 
    textColor: 'text-white' 
  },
];

const CategorySection = ({ onSelectCategory }: CategorySectionProps) => {
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
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory?.(category.id)}
              className={`${category.color} rounded-3xl h-28 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-sm`}
            >
              <span className={`font-bold text-center px-4 leading-tight whitespace-pre-line ${category.textColor || 'text-white'}`}>
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