import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Category } from "@shared/schema";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export default function CategoryFilter({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="bg-white sticky top-[72px] z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 py-4">
            <Button
              onClick={() => onCategoryChange(null)}
              variant="ghost"
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium",
                selectedCategory === null 
                  ? "bg-primary text-white hover:bg-primary hover:text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              )}
            >
              All Items
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => onCategoryChange(category.id.toString())}
                variant="ghost"
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium",
                  selectedCategory === category.id.toString() 
                    ? "bg-primary text-white hover:bg-primary hover:text-white" 
                    : "bg-gray-100 hover:bg-gray-200"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
