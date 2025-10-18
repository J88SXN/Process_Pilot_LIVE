
import MainLayout from "@/layouts/MainLayout";
import { CheckCircle } from "lucide-react";

const About = () => {
  return (
    <MainLayout>
      <section className="py-20 md:py-32">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-down">
              About Process Pilot
            </h1>
            <p className="text-lg text-muted-foreground animate-slide-up">
              We're on a mission to free businesses from repetitive tasks 
              through intelligent automation.
            </p>
            <p className="mt-4 text-muted-foreground animate-slide-up" style={{ animationDelay: "100ms" }}>
              Our founder, Jason Stolworthy, leads Process Pilot with a focus on bringing practical AI solutions to small businesses that want to scale smartly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 animate-slide-up">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Our Approach to Automation
              </h2>
              <p className="text-muted-foreground mb-6">
                At Process Pilot, we believe that automation should be accessible
                to businesses of all sizes. Our approach combines deep technical
                expertise with a practical understanding of business operations.
              </p>
              <p className="text-muted-foreground mb-6">
                We don't just implement technology; we take the time to understand
                your specific workflows, pain points, and objectives to create
                automations that truly transform your operations.
              </p>
              
              <div className="space-y-4 mt-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Custom Solutions</h3>
                    <p className="text-muted-foreground">
                      Each automation is tailored to your specific business needs and processes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Platform Agnostic</h3>
                    <p className="text-muted-foreground">
                      We work with your existing tools or recommend the best options for your needs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Ongoing Support</h3>
                    <p className="text-muted-foreground">
                      We provide training and support to ensure your automation continues to deliver value.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 animate-fade-in">
              <div className="rounded-xl overflow-hidden subtle-border shadow-sm">
                <div className="aspect-w-4 aspect-h-3 bg-secondary relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground">Automation Process Visualization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the Experts
            </h2>
            <p className="text-lg text-muted-foreground">
              Our team combines deep technical knowledge with business acumen.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Alex Rivera",
                title: "Founder & Automation Architect",
                bio: "15+ years experience in process automation and systems integration."
              },
              {
                name: "Jamie Chen",
                title: "AI Implementation Specialist",
                bio: "Expert in machine learning models and automation intelligence."
              },
              {
                name: "Taylor Morgan",
                title: "Client Success Manager",
                bio: "Dedicated to ensuring automation solutions deliver measurable ROI."
              }
            ].map((member, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-6">
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.title}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide our approach to business automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Innovation",
                description: "We constantly explore new technologies and approaches to deliver better automation solutions."
              },
              {
                title: "Practicality",
                description: "We focus on solutions that deliver real business value, not just technological novelty."
              },
              {
                title: "Transparency",
                description: "Clear communication and honest assessments are the foundation of our client relationships."
              },
              {
                title: "Excellence",
                description: "We hold ourselves to the highest standards in every automation project we undertake."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white dark:bg-card p-8 rounded-xl shadow-sm subtle-border animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
