
import MainLayout from "@/layouts/MainLayout";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      
      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Process Pilot Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Our streamlined approach makes automation simple and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 animate-fade-in" style={{ animationDelay: "0ms" }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Submit Request</h3>
              <p className="text-muted-foreground">
                Tell us about your process and what you're looking to automate.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. We Evaluate</h3>
              <p className="text-muted-foreground">
                Our experts assess your request and provide a tailored solution and quote.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Implementation</h3>
              <p className="text-muted-foreground">
                We build, test, and deploy your automation solution with full support.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/request">
              <Button variant="outline" size="lg" className="rounded-full px-8 group">
                Start Your Automation Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
