
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import CredentialsForm from "@/components/CredentialsForm";
import PaymentForm from "@/components/PaymentForm";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Loader, 
  AlertCircle, 
  Calendar,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the payment type
interface Payment {
  id: string;
  request_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  payment_id: string | null;
  created_at: string;
}

// Define the request type with a payments property
interface RequestWithPayments {
  id: string;
  title: string;
  description: string;
  user_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  estimated_cost: number | null;
  payments?: Payment[];
}

interface RequestDetailProps {
  requestId: string;
}

const RequestDetail = ({ requestId }: RequestDetailProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<RequestWithPayments | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchRequest = async () => {
      try {
        console.log("Fetching request details for ID:", requestId, "User ID:", user.id);
        
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .eq("id", requestId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching request:", error);
          throw error;
        }
        
        if (!data) {
          console.log("No request found with ID:", requestId);
          return;
        }
        
        console.log("Request data:", data);
        
        // Fetch payments separately with all columns
        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("id, request_id, amount, status, stripe_payment_intent_id, created_at, updated_at")
          .eq("request_id", requestId);
          
        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError);
        } else {
          console.log("Payments data:", paymentsData);
          // Add payments to request object
          const requestWithPayments: RequestWithPayments = {
            ...data,
            payments: (paymentsData || []) as any
          };
          setRequest(requestWithPayments);
        }
      } catch (error: any) {
        console.error("Full error:", error);
        toast({
          title: "Error fetching request",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [requestId, user, toast]);

  const handlePayment = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("id", requestId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error refreshing request data:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No request found with ID after payment:", requestId);
        return;
      }
      
      // Fetch payments separately with all columns
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("id, request_id, amount, status, stripe_payment_intent_id, created_at, updated_at")
        .eq("request_id", requestId);
        
      if (paymentsError) {
        console.error("Error fetching payments after success:", paymentsError);
      } else {
        // Add payments to request object
        const requestWithPayments: RequestWithPayments = {
          ...data,
          payments: (paymentsData || []) as any
        };
        setRequest(requestWithPayments);
      }
      
      setShowPayment(false);
    } catch (error) {
      console.error("Error refreshing request data:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="animate-spin mr-2" />
        <span>Loading request details...</span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center p-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium">Request not found</h3>
        <p className="text-muted-foreground mt-2">
          The request you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const hasCompletedPayment = request.payments && request.payments.some((p: Payment) => p.status === "completed");
  const showPaymentButton = request.status === "approved" && !hasCompletedPayment;

  const isApprovedOrInProgress = 
    request.status === "approved" || 
    request.status === "in_progress";

  return (
    <div className="container px-4 py-10 mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{request.title}</CardTitle>
                  <CardDescription>Request ID: {request.id}</CardDescription>
                </div>
                <StatusBadge status={request.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showPayment ? (
                <div className="mb-6">
                  <PaymentForm 
                    requestId={request.id} 
                    amount={request.estimated_cost || 100} 
                    onSuccess={handlePaymentSuccess}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {request.description}
                    </p>
                  </div>

                <div>
                  <h3 className="font-medium mb-2">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      N/A
                    </Badge>
                  </div>
                </div>

                  {request.estimated_cost && (
                    <div>
                      <h3 className="font-medium mb-2">Estimated Cost</h3>
                      <p className="text-xl font-bold">£{request.estimated_cost.toFixed(2)}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Status Timeline</h3>
                    <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6 py-2">
                      <TimelineItem
                        title="Request Submitted"
                        date={new Date(request.created_at).toLocaleDateString()}
                        status="completed"
                      />
                      <TimelineItem
                        title="Review Process"
                        date={request.status === "in_review" ? "In progress" : "Completed"}
                        status={request.status === "in_review" ? "current" : "completed"}
                      />
                      {request.status !== "denied" && (
                        <>
                          <TimelineItem
                            title="Approval & Pricing"
                            date={request.status === "approved" || request.status === "in_progress" || request.status === "completed" 
                              ? "Completed" 
                              : "Pending"}
                            status={request.status === "in_review" ? "pending" : "completed"}
                          />
                          <TimelineItem
                            title="Payment"
                            date={hasCompletedPayment ? "Completed" : "Pending"}
                            status={hasCompletedPayment ? "completed" : "pending"}
                          />
                          <TimelineItem
                            title="Implementation"
                            date={request.status === "in_progress" ? "In progress" : request.status === "completed" ? "Completed" : "Pending"}
                            status={request.status === "in_progress" ? "current" : request.status === "completed" ? "completed" : "pending"}
                          />
                          <TimelineItem
                            title="Completion"
                            date={request.status === "completed" ? "Completed" : "Pending"}
                            status={request.status === "completed" ? "completed" : "pending"}
                          />
                        </>
                      )}
                      {request.status === "denied" && (
                        <TimelineItem
                          title="Request Denied"
                          date={new Date(request.updated_at).toLocaleDateString()}
                          status="completed"
                          error
                        />
                      )}
                    </ol>
                  </div>
                </>
              )}
            </CardContent>
            {!showPayment && (
              <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                {showPaymentButton && (
                  <Button onClick={handlePayment}>
                    Proceed to Payment
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>

          {isApprovedOrInProgress && (
            <div className="animate-fade-in">
          <CredentialsForm 
            requestId={request.id} 
            platformList={[]} 
          />
            </div>
          )}
        </div>
        
        <div>
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Status</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <p className="text-xl font-bold">{request.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  title: string;
  date: string;
  status: "pending" | "current" | "completed";
  error?: boolean;
}

const TimelineItem = ({ title, date, status, error = false }: TimelineItemProps) => {
  return (
    <li className="ml-6">
      <span className="absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-background">
        {status === "completed" && (
          <CheckCircle className={`w-4 h-4 ${error ? "text-red-500" : "text-green-500"}`} />
        )}
        {status === "current" && (
          <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
        )}
        {status === "pending" && (
          <div className="w-3 h-3 rounded-full bg-gray-200"></div>
        )}
      </span>
      <h3 className="flex items-center font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{date}</p>
    </li>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let color;
  
  switch (status) {
    case "in_review":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "denied":
      color = "bg-red-100 text-red-800";
      break;
    case "approved":
      color = "bg-blue-100 text-blue-800";
      break;
    case "in_progress":
      color = "bg-indigo-100 text-indigo-800";
      break;
    case "completed":
      color = "bg-green-100 text-green-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  const displayStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {displayStatus}
    </span>
  );
};

export default RequestDetail;
