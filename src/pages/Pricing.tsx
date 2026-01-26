import MainLayout from "@/layouts/MainLayout";
import PricingCalculator from "@/components/PricingCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Zap, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const popularAutomations = [
  {
    title: "Email to Spreadsheet Sync",
    description: "Automatically log emails and attachments to Google Sheets",
    price: "£500 - £800",
    deliveryTime: "2-3 days",
    features: [
      "Gmail integration",
      "Google Sheets setup",
      "Filter configuration",
      "Testing & documentation"
    ],
    popular: false
  },
  {
    title: "Lead Generation Pipeline",
    description: "Capture leads from multiple sources and route to your CRM",
    price: "£1,200 - £1,800",
    deliveryTime: "1-2 weeks",
    features: [
      "Multi-platform integration",
      "CRM auto-population",
      "Lead scoring logic",
      "Notification system",
      "30-day support"
    ],
    popular: true
  },
  {
    title: "Social Media Manager",
    description: "Schedule and post content across multiple social platforms",
    price: "£900 - £1,400",
    deliveryTime: "1 week",
    features: [
      "Multi-platform posting",
      "Content scheduling",
      "Analytics tracking",
      "Buffer/queue management"
    ],
    popular: false
  },
  {
    title: "Invoice & Payment Automation",
    description: "Automatic invoice generation, sending, and payment tracking",
    price: "£1,500 - £2,200",
    deliveryTime: "1-2 weeks",
    features: [
      "Invoice generation",
      "Stripe/PayPal integration",
      "Payment notifications",
      "Accounting software sync",
      "Follow-up reminders"
    ],
    popular: true
  },
  {
    title: "Customer Support Workflow",
    description: "Automate ticket routing, responses, and escalation",
    price: "£2,000 - £3,000",
    deliveryTime: "2-3 weeks",
    features: [
      "Help desk integration",
      "AI-powered routing",
      "Auto-responses",
      "Escalation rules",
      "SLA monitoring",
      "60-day support"
    ],
    popular: false
  },
  {
    title: "E-commerce Order Processing",
    description: "Streamline order fulfillment from purchase to delivery",
    price: "£1,800 - £2,800",
    deliveryTime: "2-3 weeks",
    features: [
      "Shopify/WooCommerce sync",
      "Inventory management",
      "Shipping automation",
      "Customer notifications",
      "Analytics dashboard"
    ],
    popular: true
  }
];

const Pricing = () => {
  return (
    <MainLayout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="py-20 md:py-24">
          <div className="container px-4 mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <Star className="w-3 h-3 mr-1" />
              Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-down">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up">
              Get an instant estimate for your automation project. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Calculator */}
        <section className="py-10">
          <div className="container px-4 mx-auto">
            <PricingCalculator />
          </div>
        </section>

        {/* Popular Automation Packages */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular Automation Packages
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pre-scoped solutions for common business needs. Get started faster with proven workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularAutomations.map((automation, index) => (
                <Card
                  key={index}
                  className={cn(
                    "relative hover:shadow-lg transition-all duration-300",
                    automation.popular && "border-primary shadow-md"
                  )}
                >
                  {automation.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg">{automation.title}</CardTitle>
                    <CardDescription className="min-h-[40px]">
                      {automation.description}
                    </CardDescription>
                    <div className="pt-4">
                      <div className="text-3xl font-bold text-primary">
                        {automation.price}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Delivery: {automation.deliveryTime}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {automation.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/request">
                      <Button className="w-full" variant={automation.popular ? "default" : "outline"}>
                        <Zap className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Don't see what you need?
              </p>
              <Link to="/request">
                <Button size="lg" variant="outline">
                  Request Custom Automation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container px-4 mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Pricing FAQs
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How accurate are the estimates?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our estimates are typically within 20% of the final price. After reviewing your specific requirements, we'll provide a fixed-price quote before starting work.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's included in the price?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All prices include automation design, Make.com setup, testing, documentation, training, and 7 days of post-launch support. Ongoing monitoring and maintenance can be added for £300/month.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Do I need my own Make.com account?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes. You'll need an active Make.com subscription (starting at £7/month). We build the automation in our environment for testing, then deploy it to your account for full ownership and control.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What if I need changes after launch?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Minor tweaks during the 7-day support period are free. After that, we offer hourly rates (£150/hr) or monthly maintenance plans starting at £300/month for ongoing updates and monitoring.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How do payments work?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We require 50% upfront to begin work and 50% upon completion. For projects over £3,000, we can arrange milestone-based payments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Pricing;
