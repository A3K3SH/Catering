import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { Product, CartItem } from "@shared/schema";
import { useState } from "react";

interface MenuSectionProps {
  selectedCategory: string | null;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function MenuSection({ selectedCategory, onAddToCart }: MenuSectionProps) {
  const [visibleCount, setVisibleCount] = useState(6);
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', selectedCategory],
  });

  const filteredProducts = selectedCategory
    ? products.filter(product => product.categoryId.toString() === selectedCategory)
    : products;

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleProducts.length < filteredProducts.length;

  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  return (
    <section id="menu" className="py-10 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Catering Menu
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of authentic Indian dishes, perfect for any event or celebration.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg h-80 animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground">
              {selectedCategory ? "No products in this category yet." : "No products available yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={() => onAddToCart(product, 1)} 
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <Button 
                  onClick={loadMore}
                  className="bg-foreground hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition"
                >
                  <span>View More Menu Items</span>
                  <i className="ri-arrow-right-line ml-2"></i>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
