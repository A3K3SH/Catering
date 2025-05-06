import { useState } from "react";
import { Link } from "wouter";
import { useFirebaseAuth } from "@/firebase/FirebaseAuthProvider";
import { ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onCartClick: () => void;
  cartItemsCount: number;
}

export default function Header({ onCartClick, cartItemsCount }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMobile();
  const { currentUser, isAdmin } = useFirebaseAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-primary font-accent text-2xl font-bold cursor-pointer">
              Taste of India
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#home" className="font-heading text-foreground hover:text-primary transition">
            Home
          </a>
          <a href="#menu" className="font-heading text-foreground hover:text-primary transition">
            Menu
          </a>
          <a href="#about" className="font-heading text-foreground hover:text-primary transition">
            About
          </a>
          <a href="#contact" className="font-heading text-foreground hover:text-primary transition">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative" 
            onClick={onCartClick}
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {currentUser ? (
            <Link href={isAdmin ? "/admin" : "/profile"}>
              <Button variant="default" className="hidden md:flex items-center gap-1 bg-foreground hover:bg-neutral-700">
                <User className="h-4 w-4" />
                <span>{isAdmin ? "Admin" : "Profile"}</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="default" className="hidden md:flex items-center gap-1 bg-foreground hover:bg-neutral-700">
                <User className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-3 space-y-2 bg-white border-t">
          <a 
            href="#home" 
            className="block py-2 font-heading text-foreground hover:text-primary transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </a>
          <a 
            href="#menu" 
            className="block py-2 font-heading text-foreground hover:text-primary transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Menu
          </a>
          <a 
            href="#about" 
            className="block py-2 font-heading text-foreground hover:text-primary transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="block py-2 font-heading text-foreground hover:text-primary transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </a>
          
          {currentUser ? (
            <Link href={isAdmin ? "/admin" : "/profile"}>
              <button className="flex items-center space-x-1 text-foreground py-2 w-full text-left">
                <User className="h-4 w-4" />
                <span>{isAdmin ? "Admin" : "Profile"}</span>
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="flex items-center space-x-1 text-foreground py-2 w-full text-left">
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
