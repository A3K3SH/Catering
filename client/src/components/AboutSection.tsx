import { Award, UserCheck } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Authentic Indian Flavors For Your Special Occasions
            </h2>
            <p className="text-muted-foreground mb-6">
              At Taste of India, we bring the authentic flavors of traditional Indian cuisine directly to your events. Our team of experienced chefs are dedicated to preserving the authenticity of each recipe while ensuring the highest quality.
            </p>
            <p className="text-muted-foreground mb-8">
              We take pride in promoting Indian culinary heritage and supporting local food entrepreneurs in showcasing their skills and creativity. From intimate gatherings to large celebrations, our catering service promises a memorable dining experience.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="bg-accent bg-opacity-20 p-3 rounded-full mr-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">Quality Ingredients</h3>
                  <p className="text-sm text-muted-foreground">Locally sourced fresh produce</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-accent bg-opacity-20 p-3 rounded-full mr-4">
                  <UserCheck className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground">Expert Chefs</h3>
                  <p className="text-sm text-muted-foreground">Traditional cooking techniques</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://pixabay.com/get/g21d5999c1bd7f8b1ce242e18ad67f737d9d530b81ca262e70cb91217d144c006d5ff691b2422614acbd8155dd7e530438208b04c810e15c14405ce2a3aa7b34d_1280.jpg" 
              alt="Chef preparing traditional Indian food" 
              className="rounded-xl shadow-xl w-full h-auto z-10 relative" 
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent rounded-br-xl z-0 hidden md:block"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-primary rounded-tl-xl z-0 hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
