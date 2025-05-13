import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Category, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Camera, FileImage } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  imageUrl: z.string().url("Must be a valid URL"),
  servingSize: z.string().min(1, "Serving size is required"),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = !!product;
  const [imagePreview, setImagePreview] = useState<string | null>(
    product ? product.imageUrl : null
  );

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          categoryId: product.categoryId.toString(),
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          imageUrl: product.imageUrl,
          servingSize: product.servingSize,
        }
      : {
          name: "",
          description: "",
          price: 0,
          imageUrl: "",
          servingSize: "",
          categoryId: "",
        },
  });

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      if (isEditing) {
        const res = await apiRequest("PATCH", `/api/products/${product.id}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/products", data);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: isEditing
          ? "Your product has been updated successfully."
          : "Your product has been created successfully.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Reset form if creating new product
      if (!isEditing) {
        form.reset({
          name: "",
          description: "",
          price: 0,
          imageUrl: "",
          servingSize: "",
          categoryId: "",
        });
        setImagePreview(null);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error submitting product:", error);
      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    mutate({
      ...data,
      categoryId: data.categoryId,
      price: Number(data.price),
    });
  };

  // Watch image URL changes to update preview
  const watchedImageUrl = form.watch("imageUrl");
  if (watchedImageUrl !== imagePreview && watchedImageUrl) {
    setImagePreview(watchedImageUrl);
  }

  // Sample image URLs for quick selection
  const sampleImages = [
    "https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    "https://images.unsplash.com/photo-1589647363585-f4a7d3877b60?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
        <CardDescription>
          Fill in the details below to {isEditing ? "update" : "create"} a product for your catering menu
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was a problem {isEditing ? "updating" : "creating"} the product. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Butter Chicken" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the dish or product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tender chicken cooked in a rich, creamy tomato sauce with traditional Indian spices."
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the dish, including flavors, ingredients, and cooking method
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="450"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="servingSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serving Size</FormLabel>
                        <FormControl>
                          <Input placeholder="2-3 people" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value="none" disabled>No categories available</SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription className="flex flex-wrap gap-2 mt-2">
                        <span className="w-full">Sample images (click to use):</span>
                        {sampleImages.map((url, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              form.setValue("imageUrl", url);
                              setImagePreview(url);
                            }}
                          >
                            <FileImage className="h-3 w-3 mr-1" />
                            Image {index + 1}
                          </Button>
                        ))}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <div className="border rounded-md overflow-hidden w-full max-w-md mx-auto">
                  <img 
                    src={imagePreview} 
                    alt="Product preview" 
                    className="w-full h-auto object-cover"
                    onError={() => setImagePreview(null)}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setImagePreview(null);
                  if (onSuccess) onSuccess();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-red-700"
                disabled={isPending}
              >
                {isPending 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Product" : "Create Product")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
