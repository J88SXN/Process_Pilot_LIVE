
import { CheckCircle, Zap, Clock, Briefcase, Code, Shield } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: "Quick Implementation",
    description:
      "Get your automation solutions up and running in days, not months."
  },
  {
    icon: <Clock className="w-10 h-10 text-primary" />,
    title: "Save Time",
    description:
      "Reduce manual work hours by up to 70% with our tailored automation solutions."
  },
  {
    icon: <Briefcase className="w-10 h-10 text-primary" />,
    title: "Business Focused",
    description:
      "Solutions designed with your specific business needs and workflows in mind."
  },
  {
    icon: <Code className="w-10 h-10 text-primary" />,
    title: "Multiple Platforms",
    description:
      "We work across various platforms and tools to create seamless integrations."
  },
  {
    icon: <CheckCircle className="w-10 h-10 text-primary" />,
    title: "Quality Assurance",
    description:
      "Rigorous testing ensures your automations work flawlessly every time."
  },
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: "Secure & Reliable",
    description:
      "Bank-grade security protocols protect your data and business information."
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Process Pilot?
          </h2>
          <p className="text-lg text-muted-foreground">
            Our focused approach to business automation delivers measurable
            results and exceptional value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-card p-8 rounded-xl shadow-sm subtle-border card-hover animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
