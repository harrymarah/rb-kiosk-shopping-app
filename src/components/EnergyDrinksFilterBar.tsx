import { useState } from "react";
import { Filter, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface EnergyDrinksFilterBarProps {
  brands: string[];
  flavours: string[];
  selectedBrand: string;
  selectedFlavour: string;
  lowSugar: boolean;
  isNew: boolean;
  onOffer: boolean;
  sortBy: string;
  onBrandChange: (brand: string) => void;
  onFlavourChange: (flavour: string) => void;
  onLowSugarChange: (checked: boolean) => void;
  onNewChange: (checked: boolean) => void;
  onOfferChange: (checked: boolean) => void;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
  resultCount: number;
}

const EnergyDrinksFilterBar = ({
  brands,
  flavours,
  selectedBrand,
  selectedFlavour,
  lowSugar,
  isNew,
  onOffer,
  sortBy,
  onBrandChange,
  onFlavourChange,
  onLowSugarChange,
  onNewChange,
  onOfferChange,
  onSortChange,
  onClearFilters,
  resultCount,
}: EnergyDrinksFilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasActiveFilters = 
    selectedBrand !== "all" || 
    selectedFlavour !== "all" || 
    lowSugar || 
    isNew || 
    onOffer || 
    sortBy !== "relevance";

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter & Sort</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Advanced Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-border mt-4">
            {/* Brand Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Brand</label>
              <Select value={selectedBrand} onValueChange={onBrandChange}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Flavour Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Flavour</label>
              <Select value={selectedFlavour} onValueChange={onFlavourChange}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="All Flavours" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">All Flavours</SelectItem>
                  {flavours.map((flavour) => (
                    <SelectItem key={flavour} value={flavour}>
                      {flavour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sort By</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="name">A-Z</SelectItem>
                  <SelectItem value="price-low">Price Low-High</SelectItem>
                  <SelectItem value="price-high">Price High-Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowSugar"
                    checked={lowSugar}
                    onCheckedChange={onLowSugarChange}
                  />
                  <label htmlFor="lowSugar" className="text-sm text-foreground cursor-pointer">
                    Low Sugar
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new"
                    checked={isNew}
                    onCheckedChange={onNewChange}
                  />
                  <label htmlFor="new" className="text-sm text-foreground cursor-pointer">
                    New
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offer"
                    checked={onOffer}
                    onCheckedChange={onOfferChange}
                  />
                  <label htmlFor="offer" className="text-sm text-foreground cursor-pointer">
                    On Offer
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Results count */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {resultCount} result{resultCount !== 1 ? 's' : ''}
          {hasActiveFilters && (
            <span> with active filters</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default EnergyDrinksFilterBar;