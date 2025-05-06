import { useQuery } from "@tanstack/react-query";
import { Star, StarHalf } from "lucide-react";
import { Testimonial } from "@shared/schema";

export default function TestimonialsSection() {
  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials']
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="text-accent h-5 w-5 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="text-accent h-5 w-5 fill-current" />);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-foreground text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-neutral-100 max-w-2xl mx-auto">
            Read testimonials from our satisfied customers who have experienced our catering services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-neutral-800 rounded-xl p-6 shadow-lg">
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="mb-4">{testimonial.comment}</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-heading font-medium">{testimonial.name}</h4>
                  <p className="text-neutral-400 text-sm">{testimonial.eventType}</p>
                </div>
              </div>
            </div>
          ))}

          {testimonials.length === 0 && (
            <div className="col-span-1 md:col-span-3 text-center py-8">
              <p>No testimonials available yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
