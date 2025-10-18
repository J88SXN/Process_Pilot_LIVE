
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Lock, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { z } from "zod";

const credentialsSchema = z.object({
  username: z.string().trim().max(200, "Username must be less than 200 characters").optional(),
  password: z.string().max(500, "Password must be less than 500 characters").optional(),
  apiKey: z.string().trim().max(500, "API key must be less than 500 characters").optional(),
  accountDetails: z.string().max(1000, "Account details must be less than 1000 characters").optional(),
  otherInfo: z.string().max(2000, "Additional info must be less than 2000 characters").optional(),
  platform: z.string().min(1, "Please select a platform").max(100, "Platform name is too long")
});

interface CredentialsFormProps {
  requestId: string;
  platformList: string[];
  onCredentialsSubmitted?: () => void;
}

const CredentialsForm = ({ requestId, platformList, onCredentialsSubmitted }: CredentialsFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [credentialType, setCredentialType] = useState<string>("username_password");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    apiKey: "",
    accountDetails: "",
    otherInfo: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit credentials.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPlatform) {
      toast({
        title: "Platform Required",
        description: "Please select a platform to continue.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const credentials = {
        ...(credentialType === "username_password" && { 
          username: formData.username,
          password: formData.password 
        }),
        ...(credentialType === "api_key" && { 
          apiKey: formData.apiKey 
        }),
        ...(formData.accountDetails && { 
          accountDetails: formData.accountDetails 
        }),
        ...(formData.otherInfo && { 
          otherInfo: formData.otherInfo 
        })
      };

      // Validate the input data
      const result = credentialsSchema.safeParse({
        ...formData,
        platform: selectedPlatform
      });

      if (!result.success) {
        const errorMessage = result.error.errors[0].message;
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.functions.invoke("handle-credentials", {
        body: {
          requestId,
          userId: user.id,
          platform: selectedPlatform,
          credentials
        }
      });
      
      if (error) throw error;

      toast({
        title: "Credentials Submitted",
        description: "Your platform credentials have been securely submitted."
      });
      
      // Reset form
      setFormData({
        username: "",
        password: "",
        apiKey: "",
        accountDetails: "",
        otherInfo: ""
      });
      setSelectedPlatform("");
      
      if (onCredentialsSubmitted) {
        onCredentialsSubmitted();
      }
    } catch (error: any) {
      toast({
        title: "Error submitting credentials",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Submit Platform Credentials
        </CardTitle>
        <CardDescription>
          Provide access credentials for your automation platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Secure Submission</AlertTitle>
          <AlertDescription>
            Your credentials are encrypted and only accessible to our authorized team members working on your automation.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform">Select Platform</Label>
            <Select
              value={selectedPlatform}
              onValueChange={setSelectedPlatform}
            >
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {platformList.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialType">Credential Type</Label>
            <Select
              value={credentialType}
              onValueChange={setCredentialType}
            >
              <SelectTrigger id="credentialType">
                <SelectValue placeholder="Select credential type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="username_password">Username & Password</SelectItem>
                <SelectItem value="api_key">API Key</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {credentialType === "username_password" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  maxLength={200}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  maxLength={500}
                  required
                />
              </div>
            </>
          )}

          {credentialType === "api_key" && (
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
                maxLength={500}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="accountDetails">Account Details (Optional)</Label>
            <Textarea
              id="accountDetails"
              name="accountDetails"
              placeholder="Account name, organization, or any other identifying details"
              value={formData.accountDetails}
              onChange={handleInputChange}
              rows={2}
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherInfo">Additional Information (Optional)</Label>
            <Textarea
              id="otherInfo"
              name="otherInfo"
              placeholder="Any additional information needed to access the platform"
              value={formData.otherInfo}
              onChange={handleInputChange}
              rows={3}
              maxLength={2000}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !selectedPlatform}
          className="w-full"
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
            <span className="flex items-center">
              <KeyRound className="mr-2 h-4 w-4" />
              Submit Credentials Securely
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CredentialsForm;
