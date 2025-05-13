import { useCart } from "@/hooks/useCart.tsx";
import { Button } from "@/components/ui/button";
import { X, Trash2, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const { toast } = useToast();
  
  const deliveryFee = 100; // ₹100 fixed delivery fee
  
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const total = subtotal + deliveryFee;

  const { mutate: checkout, isPending } = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/orders", { items: cartItems });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed.",
      });
      clearCart();
      onClose();
    },
    onError: () => {
      toast({
        title: "Checkout failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-heading text-xl font-bold">Your Cart</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 mb-4 text-neutral-300">
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-heading font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Add some delicious items to your cart
                </p>
                <Button 
                  onClick={onClose} 
                  className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Browse Menu
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex border-b border-gray-200 pb-4">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-md" 
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-heading font-medium">{item.name}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Serves: {item.servingSize}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-heading text-primary font-bold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="border-t p-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-heading font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <Button 
                onClick={() => checkout()}
                disabled={isPending}
                className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-lg transition"
              >
                {isPending ? "Processing..." : "Proceed to Checkout"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
