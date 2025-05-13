import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-lg transition hover:shadow-xl">
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading text-lg font-bold">{product.name}</h3>
          <span className="font-heading text-primary font-bold">
            {formatCurrency(product.price)}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-1">Serves:</span>
            <span className="text-sm">{product.servingSize}</span>
          </div>
          <Button 
            onClick={onAddToCart} 
            className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
