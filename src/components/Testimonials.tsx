import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Operations Manager",
    company: "TechFlow Solutions",
    content: "Process Pilot automated our entire lead qualification process. What used to take our team 4 hours daily now happens automatically. The ROI was immediate.",
    rating: 5,
    initials: "SM"
  },
  {
    name: "Marcus Chen",
    role: "CEO",
    company: "DataSync Inc",
    content: "Jason took the time to understand our workflow before building anything. The automation he created has saved us £3,000/month in manual data entry costs.",
    rating: 5,
    initials: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "GrowthLabs",
    content: "We needed social media scheduling across 5 platforms. Process Pilot delivered a custom solution in 5 days that works flawlessly. Highly recommend!",
    rating: 5,
    initials: "ER"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Growing Businesses
          </h2>
          <p className="text-lg text-muted-foreground">
            See how Process Pilot has helped companies automate their workflows and save time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-primary/20 mb-3" />

                <p className="text-muted-foreground mb-6 min-h-[100px]">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Join 50+ businesses that trust Process Pilot for their automation needs
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
