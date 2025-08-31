import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  textColor?: string;
}

const categories: CategoryItem[] = [
  { id: 'special-offers', name: 'Special Offers', color: 'bg-brand-yellow', textColor: 'text-foreground' },
  { id: 'marketplace', name: 'QuickMart Marketplace', color: 'bg-white border-2', textColor: 'text-foreground' },
  { id: 'fresh', name: 'Fresh & Chilled', color: 'bg-foreground', textColor: 'text-white' },
  { id: 'summer', name: 'Summer Essentials', color: 'bg-gradient-to-br from-orange-400 to-red-500', textColor: 'text-white' },
];

const CategorySection = () => {
  return (
    <section className="bg-background px-4 py-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Shop categories</h2>
          <Button variant="ghost" className="text-primary font-medium">
            Show all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${category.color} rounded-2xl h-24 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
            >
              <span className={`font-semibold text-center px-4 ${category.textColor || 'text-white'}`}>
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