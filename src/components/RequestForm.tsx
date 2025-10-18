import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Popular automation platforms
const platforms = [
  { id: "zapier", label: "Zapier" },
  { id: "make", label: "Make (Integromat)" },
  { id: "uipath", label: "UiPath" },
  { id: "powerautomate", label: "Power Automate" },
  { id: "airtable", label: "Airtable" },
  { id: "n8n", label: "n8n" },
  { id: "custom", label: "Custom Solution" },
  { id: "other", label: "Other" }
];

const RequestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    description: "",
    platforms: [] as string[],
    otherPlatform: "",
    budget: "",
    timeline: "",
    additionalInfo: "",
    scheduleConsultation: false,
    preferredContactMethod: "email"
  });

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => {
      const updatedPlatforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      
      return { ...prev, platforms: updatedPlatforms };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, scheduleConsultation: checked }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, preferredContactMethod: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit an automation request.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare platforms list including "other" if specified
    let platformsList = [...formData.platforms];
    if (formData.platforms.includes("other") && formData.otherPlatform) {
      platformsList = platformsList.filter(p => p !== "other");
      platformsList.push(formData.otherPlatform);
    }
    
    try {
      console.log("Submitting request with user ID:", user.id);
      
      // Insert the request into Supabase
      const { data, error } = await supabase
        .from("requests")
        .insert({
          user_id: user.id,
          title: formData.name ? `${formData.name}'s Request` : "New Automation Request",
          description: formData.description,
          platforms: platformsList,
          schedule_consultation: formData.scheduleConsultation,
          preferred_contact_method: formData.preferredContactMethod
          // We'll leave estimated_cost null until an admin reviews the request
        })
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Request submitted successfully:", data);

      // If consultation was requested, send calendar invitation data
      if (formData.scheduleConsultation) {
        const { error: inviteError } = await supabase.functions.invoke('send-meeting-request', {
          body: {
            recipient: "jason.stolworthy@processpilot.co.uk",
            clientName: formData.name,
            clientEmail: formData.email,
            company: formData.company,
            requestId: data?.[0]?.id,
            preferredMethod: formData.preferredContactMethod
          }
        });
        
        if (inviteError) {
          console.error("Error sending meeting request:", inviteError);
          // We'll continue even if the meeting request fails
        }
      }

      toast({
        title: "Request Submitted",
        description: "We've received your automation request and will contact you soon.",
      });
      
      // Reset form and redirect to dashboard
      setFormData({
        name: "",
        email: "",
        company: "",
        description: "",
        platforms: [],
        otherPlatform: "",
        budget: "",
        timeline: "",
        additionalInfo: "",
        scheduleConsultation: false,
        preferredContactMethod: "email"
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Full error object:", error);
      toast({
        title: "Error submitting request",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl subtle-border bg-white dark:bg-card shadow-sm">
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Submit Your Automation Request</h2>
            <p className="text-muted-foreground">
              Please provide details about your automation needs so we can evaluate your project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              placeholder="Your Company Name"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe Your Automation Needs</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please describe the process you want to automate, including current steps, tools used, and desired outcome."
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              required
              className="resize-y min-h-[120px]"
            />
          </div>

          <div className="space-y-3">
            <Label>Which platforms do you currently use or prefer?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map(platform => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={formData.platforms.includes(platform.id)}
                    onCheckedChange={() => handlePlatformChange(platform.id)}
                  />
                  <Label
                    htmlFor={platform.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {platform.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {formData.platforms.includes("other") && (
            <div className="space-y-2">
              <Label htmlFor="otherPlatform">Specify Other Platform</Label>
              <Input
                id="otherPlatform"
                name="otherPlatform"
                placeholder="Enter platform name"
                value={formData.otherPlatform}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget (optional)</Label>
              <Input
                id="budget"
                name="budget"
                placeholder="$1,000 - $5,000"
                value={formData.budget}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Desired Timeline (optional)</Label>
              <Input
                id="timeline"
                name="timeline"
                placeholder="2 weeks, 1 month, etc."
                value={formData.timeline}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              placeholder="Any other details that might help us understand your needs better..."
              rows={3}
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="resize-y"
            />
          </div>

          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-muted">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold">Schedule a Consultation</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Would you like to schedule a call to discuss your automation needs?
                </p>
              </div>
              <Switch
                checked={formData.scheduleConsultation}
                onCheckedChange={handleSwitchChange}
                aria-label="Schedule consultation"
              />
            </div>
            
            {formData.scheduleConsultation && (
              <div className="pt-3 space-y-3">
                <div className="space-y-2">
                  <Label>Preferred Contact Method</Label>
                  <RadioGroup 
                    value={formData.preferredContactMethod}
                    onValueChange={handleRadioChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="font-normal cursor-pointer">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone" className="font-normal cursor-pointer">Phone Call</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="video" id="video" />
                      <Label htmlFor="video" className="font-normal cursor-pointer">Video Call (Google Meet)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Our team will reach out to schedule at a time that works for you.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto px-8 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
