import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div 
        className="relative h-[70vh] md:h-[80vh] w-full bg-center bg-cover"
        style={{
          backgroundImage: "url('https://pixabay.com/get/g0a8184a1670ec90293957a406c6f0561a3d9c7ae56c9593d37a1cc319bca28713cb4357b05093c40fa9d9a4e4f762da0aad75fb78e44b67132b9014f60f6482a_1280.jpg')"
        }}
      >
        <div className="absolute inset-0 bg-foreground bg-opacity-50"></div>
        <div className="absolute inset-0 mandala-pattern"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <h1 className="font-accent text-4xl md:text-6xl text-white leading-tight mb-4">
            Authentic <span className="text-accent">Indian Cuisine</span><br />
            For Your Special Events
          </h1>
          <p className="text-white text-lg md:text-xl max-w-lg mb-8">
            Experience the rich flavors and traditional recipes, carefully prepared by our expert chefs for your gatherings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#menu">
              <Button size="lg" className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg">
                View Our Menu
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-foreground font-bold py-3 px-6 rounded-lg">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
