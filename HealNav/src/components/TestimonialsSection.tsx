import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    content: "This app has transformed how I manage my health. The symptom checker is incredibly accurate!",
    image: "/placeholder.svg",
  },
  {
    name: "Michael Chen",
    role: "Healthcare Professional",
    content: "As a healthcare provider, I recommend this app to all my patients. It's comprehensive and user-friendly.",
    image: "/placeholder.svg",
  },
  {
    name: "Emily Rodriguez",
    role: "Wellness Coach",
    content: "The community features are amazing. It's helped me connect with others on similar health journeys.",
    image: "/placeholder.svg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who have transformed their health journey with our app.
          </p>
        </div>
        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mb-4"
                    />
                    <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}