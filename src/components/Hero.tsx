
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden hero-glow">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-slide-down">
            <p className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-wider text-primary uppercase bg-primary/10 rounded-full">
              AI Process Automation
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Streamline Your Business with{" "}
              <span className="text-gradient">Process Pilot</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We transform your repetitive tasks into automated workflows,
              saving you time and resources. Let AI handle the routine while you
              focus on growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link to="/request">
              <Button size="lg" className="rounded-full px-8 group">
                Request Automation
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="rounded-full px-8">
                Learn More
              </Button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="glass subtle-border rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">70%</div>
              <p className="text-muted-foreground">Time Saved on Average</p>
            </div>
            <div className="glass subtle-border rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <p className="text-muted-foreground">Processes Automated</p>
            </div>
            <div className="glass subtle-border rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Automated Operations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
