import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Head from "@/components/Head";
import { useFirebaseAuth } from "../firebase/FirebaseAuthProvider";
import { useToast } from "@/hooks/use-toast";

// Mock order data (will be replaced with real data from API)
const mockOrders = [
  {
    id: "ORD123456",
    date: new Date(2023, 4, 15).toISOString(),
    status: "Delivered",
    total: 1250,
    items: [
      { name: "Butter Chicken", quantity: 2, price: 450 },
      { name: "Naan Bread", quantity: 4, price: 60 },
      { name: "Mango Lassi", quantity: 3, price: 120 }
    ]
  },
  {
    id: "ORD123457",
    date: new Date(2023, 4, 2).toISOString(),
    status: "Processing",
    total: 860,
    items: [
      { name: "Vegetable Biryani", quantity: 1, price: 320 },
      { name: "Paneer Tikka", quantity: 1, price: 380 },
      { name: "Gulab Jamun", quantity: 2, price: 80 }
    ]
  }
];

export default function Orders() {
  const [_, navigate] = useLocation();
  const { currentUser } = useFirebaseAuth();
  const { toast } = useToast();
  const [orders] = useState(mockOrders);

  // If not logged in, redirect to login page
  if (!currentUser) {
    navigate("/login");
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head 
        title="My Orders - Taste of India"
        description="View your order history from Taste of India"
      />
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-amber-50 p-4">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg md:text-xl">Order #{order.id}</CardTitle>
                        <CardDescription>{formatDate(order.date)}</CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm md:text-base">
                            <div className="flex-1">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <div className="text-right">
                              {formatCurrency(item.price * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed">
                        <div className="font-semibold">Total</div>
                        <div className="font-bold text-lg">{formatCurrency(order.total)}</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-8 shadow-md">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders with us yet.</p>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => navigate("/")}
                >
                  Browse Menu
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/profile")}
              className="border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              Back to Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}