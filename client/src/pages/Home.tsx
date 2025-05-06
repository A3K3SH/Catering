import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ShoppingCart from "@/components/ShoppingCart";
import { useCart } from "@/hooks/useCart.tsx";
import { useQuery } from "@tanstack/react-query";
import Head from "@/components/Head";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { cartItems, addToCart } = useCart();

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories']
  });

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Head 
        title="Taste of India - Traditional Indian Catering"
        description="Experience authentic Indian cuisine for your special events through our premium catering services."
      />
      <div className="relative">
        <Header 
          onCartClick={() => setIsCartOpen(true)} 
          cartItemsCount={cartItems.length} 
        />
        <HeroSection />
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <MenuSection 
          selectedCategory={selectedCategory}
          onAddToCart={addToCart}
        />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
        <Footer />
        <ShoppingCart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      </div>
    </>
  );
}
