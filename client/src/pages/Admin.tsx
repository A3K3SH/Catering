import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useFirebaseAuth } from "@/firebase/FirebaseAuthProvider";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import CategoryForm from "@/components/admin/CategoryForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "@/components/Head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  DollarSign, 
  LogOut, 
  Package, 
  ShoppingBag, 
  Users 
} from "lucide-react";

export default function Admin() {
  const [location, navigate] = useLocation();
  const { currentUser, logout, loading, isAdmin } = useFirebaseAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect to login if not authenticated or not admin
  if (!loading && (!currentUser || !isAdmin)) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <Head 
        title="Admin Dashboard - Taste of India"
        description="Manage your catering products and categories"
      />
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="font-accent text-2xl font-bold text-primary">Taste of India Admin</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser?.displayName || currentUser?.email || 'Admin'}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="flex items-center gap-2"
                disabled={isLoggingOut}
              >
                <LogOut size={16} />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹12,345</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+25</div>
                    <p className="text-xs text-muted-foreground">
                      +10.5% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">10</div>
                    <p className="text-xs text-muted-foreground">
                      6 active categories
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      User Engagement
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    Overview of the most recent catering orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    No recent orders to display. They will appear here when customers place orders.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <Button 
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-primary hover:bg-red-700"
                >
                  {showAddProduct ? "Hide Form" : "Add New Product"}
                </Button>
              </div>
              
              {showAddProduct && (
                <div className="mb-8">
                  <ProductForm onSuccess={() => setShowAddProduct(false)} />
                </div>
              )}
              
              <ProductList />
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Management</h2>
              <CategoryForm />
            </TabsContent>
            
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>
                    Manage customer orders and update their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    No orders found. They will appear here when customers place orders.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
