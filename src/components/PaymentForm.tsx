
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { CreditCard, Loader } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { getErrorMessage } from "@/lib/utils";

// Initialize Stripe with the publishable key
// Replace this with your actual publishable key
const stripePromise = loadStripe("pk_test_51OhE2KSAdNVAJ1RGAg8rjSZvHqCLuEvDkPQ5a2Px3oBmaqHcAk3vJnFnJV5bQakwPX0FQQfvLlGy8a8nfzS3dLkI00yDCnXyBK");

type PaymentFormProps = {
  requestId: string;
  amount: number;
  onSuccess?: () => void;
};

// The main payment form wrapper component
const PaymentForm = ({ requestId, amount, onSuccess }: PaymentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchPaymentIntent = async () => {
      try {
        const response = await supabase.functions.invoke("create-payment-intent", {
          body: {
            amount,
            requestId,
            metadata: {
              userId: user.id,
            },
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        setClientSecret(response.data.clientSecret);
      } catch (error: unknown) {
        toast({
          title: "Error",
          description: getErrorMessage(error, "Failed to create a payment intent."),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [user, requestId, amount, toast]);

  if (loading || !clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-64">
          <Loader className="animate-spin mr-2" />
          <span>Preparing payment...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Your automation will be deployed once payment is completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            requestId={requestId} 
            amount={amount}
            onSuccess={onSuccess}
          />
        </Elements>
      </CardContent>
    </Card>
  );
};

// The actual checkout form within Stripe Elements
const CheckoutForm = ({ 
  requestId, 
  amount, 
  onSuccess 
}: PaymentFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/dashboard",
        },
        redirect: "if_required",
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // Record the payment in our database
        const { error: dbError } = await supabase
          .from("payments")
          .insert({
            request_id: requestId,
            user_id: user.id,
            amount: amount,
            status: "Completed",
            payment_method: "Credit Card",
            payment_id: paymentIntent.id,
          });

        if (dbError) throw dbError;

        // Update the request status to "in_progress"
        const { error: updateError } = await supabase
          .from("requests")
          .update({ status: "in_progress" })
          .eq("id", requestId);

        if (updateError) throw updateError;

        toast({
          title: "Payment Successful",
          description: "Your payment has been processed and your automation is now in progress.",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error: unknown) {
      toast({
        title: "Payment Failed",
        description: getErrorMessage(error, "Payment failed."),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-md">
          <div className="font-medium mb-2 flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Payment Details
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            Amount: £{amount.toFixed(2)}
          </div>
          <PaymentElement />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay £${amount.toFixed(2)}`
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Your payment is processed securely through Stripe.
      </p>
    </form>
  );
};

export default PaymentForm;
