import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useProducts } from "./ProductSection";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { allProducts, categories } = useProducts();
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);

  useEffect(() => {
    if (searchTerm.length > 0 && allProducts && categories) {
      // Filter products
      const productMatches = allProducts
        .filter((product: any) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 4)
        .map((product: any) => ({ ...product, type: 'product' }));

      // Filter categories
      const categoryMatches = categories
        .filter((category: any) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 2)
        .map((category: any) => ({ ...category, type: 'category' }));

      setFilteredSuggestions([...productMatches, ...categoryMatches]);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allProducts, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'product') {
      navigate(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      navigate(`/?category=${suggestion.name.toLowerCase()}&tab=explore`);
    }
    setShowSuggestions(false);
    setSearchTerm("");
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products and categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-9 pr-4 w-80"
          />
        </div>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-[9999] max-h-80 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.id}`}
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b border-border last:border-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.image && (
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-10 h-10 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{suggestion.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="capitalize">{suggestion.type}</span>
                  {suggestion.price && <span>• {suggestion.price}</span>}
                  {suggestion.offer && <span className="text-destructive">• {suggestion.offer}</span>}
                </div>
              </div>
            </div>
          ))}
          {searchTerm && (
            <div
              className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-t border-border text-primary"
              onClick={() => handleSubmit(new Event('submit') as any)}
            >
              <Search className="h-4 w-4" />
              <span className="font-medium">Search for "{searchTerm}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;