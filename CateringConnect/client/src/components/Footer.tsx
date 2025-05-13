import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-accent text-2xl font-bold mb-4">Taste of India</h3>
            <p className="text-neutral-400 mb-6">
              Bringing authentic Indian flavors to your special events through our premium catering services.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-neutral-400 hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#menu" className="text-neutral-400 hover:text-white transition">
                  Menu
                </a>
              </li>
              <li>
                <a href="#about" className="text-neutral-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-400 hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Wedding Catering
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Corporate Events
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Birthday Parties
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Festival Celebrations
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition">
                  Private Dining
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold mb-4">Newsletter</h4>
            <p className="text-neutral-400 mb-4">
              Subscribe to our newsletter for special offers and updates.
            </p>
            <form className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-l-lg w-full bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-1 focus:ring-primary" 
              />
              <Button type="submit" className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-r-lg transition">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()} Taste of India. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-400 hover:text-white transition text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
