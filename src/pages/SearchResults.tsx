import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import { useProducts } from "@/components/ProductSection";

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

interface Category {
  id: string;
  name: string;
  description: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { allProducts, categories, isLoading } = useProducts();
  const [matchingProducts, setMatchingProducts] = useState<Product[]>([]);
  const [matchingCategories, setMatchingCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (allProducts && categories && query) {
      // Filter products that match the search query
      const productMatches = allProducts.filter((product: Product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );

      // Filter categories that match the search query
      const categoryMatches = categories.filter((category: Category) =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.description.toLowerCase().includes(query.toLowerCase())
      );

      setMatchingProducts(productMatches);
      setMatchingCategories(categoryMatches);
    }
  }, [allProducts, categories, query]);

  // Filter and sort products based on selected filters
  useEffect(() => {
    let filtered = [...matchingProducts];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort products
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price.replace('£', '')) - parseFloat(b.price.replace('£', '')));
        break;
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price.replace('£', '')) - parseFloat(a.price.replace('£', '')));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [matchingProducts, selectedCategory, sortBy]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/?category=${categoryName.toLowerCase()}&tab=explore`);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSortBy("relevance");
  };

  // Get unique categories from matching products
  const availableCategories = Array.from(
    new Set(matchingProducts.map(product => product.category))
  );

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <p className="text-center text-muted-foreground">No search query provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Back button and search info */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Search Results</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length + matchingCategories.length} results for "{query}"
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        {(matchingProducts.length > 0 || matchingCategories.length > 0) && (
          <SearchFilterBar
            categories={availableCategories}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            onCategoryChange={handleCategoryFilter}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredProducts.length + matchingCategories.length}
          />
        )}

        {/* Categories section */}
        {matchingCategories.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchingCategories.map((category) => (
                <Card
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Products section */}
        {filteredProducts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-6">Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  offer={product.offer}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={() => toggleFavorite(product.id)}
                  onAddToCart={() => console.log(`Added ${product.name} to cart`)}
                  productId={product.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-muted-foreground">Searching...</span>
            </div>
          </div>
        )}

        {/* No results */}
        {!isLoading && filteredProducts.length === 0 && matchingCategories.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              Try searching for something else or browse our categories
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Browse Categories
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;