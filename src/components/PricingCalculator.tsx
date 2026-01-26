import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type AutomationType = "simple" | "moderate" | "complex";
type IntegrationCount = number;

const PricingCalculator = () => {
  const [automationType, setAutomationType] = useState<AutomationType>("moderate");
  const [integrationCount, setIntegrationCount] = useState<number>(2);
  const [includeSupport, setIncludeSupport] = useState(false);

  const calculatePrice = () => {
    const basePrice = {
      simple: 500,
      moderate: 1500,
      complex: 3500
    };

    const integrationCost = integrationCount * 200;
    const supportCost = includeSupport ? 300 : 0;

    const subtotal = basePrice[automationType] + integrationCost + supportCost;
    const min = Math.floor(subtotal * 0.8);
    const max = Math.ceil(subtotal * 1.2);

    return { min, max, estimated: subtotal };
  };

  const price = calculatePrice();

  const getDeliveryTime = () => {
    switch (automationType) {
      case "simple":
        return "2-3 days";
      case "moderate":
        return "1-2 weeks";
      case "complex":
        return "3-4 weeks";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Calculator Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Estimate Your Project</CardTitle>
          <CardDescription>
            Get an instant price estimate for your automation needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Automation Type */}
          <div className="space-y-3">
            <Label>Automation Complexity</Label>
            <RadioGroup value={automationType} onValueChange={(v) => setAutomationType(v as AutomationType)}>
              <div className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="simple" id="simple" className="mt-1" />
                <Label htmlFor="simple" className="cursor-pointer flex-1">
                  <div className="font-medium">Simple Automation</div>
                  <div className="text-sm text-muted-foreground">
                    2-3 steps, single platform integration
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="moderate" id="moderate" className="mt-1" />
                <Label htmlFor="moderate" className="cursor-pointer flex-1">
                  <div className="font-medium">Moderate Automation</div>
                  <div className="text-sm text-muted-foreground">
                    5-8 steps, multiple integrations, basic logic
                  </div>
                </Label>
              </div>
              <div className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
                <RadioGroupItem value="complex" id="complex" className="mt-1" />
                <Label htmlFor="complex" className="cursor-pointer flex-1">
                  <div className="font-medium">Complex Automation</div>
                  <div className="text-sm text-muted-foreground">
                    10+ steps, advanced logic, multiple workflows
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Integration Count */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Number of Integrations</Label>
              <Badge variant="secondary">{integrationCount} platforms</Badge>
            </div>
            <Slider
              value={[integrationCount]}
              onValueChange={([value]) => setIntegrationCount(value)}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Examples: Gmail, Slack, Google Sheets, CRM, etc.
            </p>
          </div>

          {/* Support Add-on */}
          <div className="space-y-3">
            <Label>Add-ons</Label>
            <div className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-accent cursor-pointer">
              <input
                type="checkbox"
                checked={includeSupport}
                onChange={(e) => setIncludeSupport(e.target.checked)}
                className="mt-1"
              />
              <Label className="cursor-pointer flex-1" onClick={() => setIncludeSupport(!includeSupport)}>
                <div className="font-medium">30-Day Support & Monitoring</div>
                <div className="text-sm text-muted-foreground">
                  Ongoing monitoring and adjustments (+$300)
                </div>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Estimate */}
      <div className="space-y-6">
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>Your Estimate</CardTitle>
            <CardDescription>Based on your selections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-primary/5 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Estimated Price Range</div>
              <div className="text-4xl font-bold text-primary">
                ${price.min.toLocaleString()} - ${price.max.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Most likely: ${price.estimated.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Delivery Time</span>
                </div>
                <span className="text-sm font-bold">{getDeliveryTime()}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Make.com automation setup</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Testing & quality assurance</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Documentation & training</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>7-day post-launch support</span>
                </div>
              </div>
            </div>

            <Link to="/request">
              <Button className="w-full" size="lg">
                <Zap className="mr-2 w-4 h-4" />
                Request This Automation
              </Button>
            </Link>

            <p className="text-xs text-center text-muted-foreground">
              Final pricing confirmed after consultation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why Choose Process Pilot?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Transparent pricing with no hidden fees</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Direct communication with Jason, the founder</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Real-time progress updates via dashboard</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>Secure credential handling & encryption</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingCalculator;
