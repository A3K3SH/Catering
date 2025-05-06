import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuthContext";
import { useLocation } from "wouter";
import ProductList from "@/components/admin/ProductList";
import ProductForm from "@/components/admin/ProductForm";
import CategoryForm from "@/components/admin/CategoryForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Head from "@/components/Head";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Admin() {
  const [location, navigate] = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    navigate("/login");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Head 
        title="Admin Dashboard - Taste of India"
        description="Manage your catering products and categories"
      />
      <div className="min-h-screen bg-secondary">
        <header className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="font-accent text-2xl font-bold text-primary">Taste of India Admin</h1>
            <Button variant="outline" onClick={logout} className="flex items-center gap-2">
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-6">
              <ProductForm />
              <ProductList />
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-6">
              <CategoryForm />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
