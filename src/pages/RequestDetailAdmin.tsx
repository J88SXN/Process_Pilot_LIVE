import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Check,
  Edit,
  Loader,
  Mail,
  Phone,
  User,
  Building,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  Lock,
  Key
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RequestDetailAdmin = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    estimated_cost: "",
    title: "",
    description: ""
  });
  const [credentials, setCredentials] = useState<any[]>([]);
  
  useEffect(() => {
    if (adminLoading) return;
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate, toast]);
  
  useEffect(() => {
    if (!isAdmin || !requestId) return;
    
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("requests")
          .select(`
            *,
            profiles:user_id(*),
            payments(*)
          `)
          .eq("id", requestId)
          .single();
        
        if (error) throw error;
        setRequest(data);
        setFormData({
          status: data.status,
          estimated_cost: data.estimated_cost?.toString() || "",
          title: data.title,
          description: data.description
        });
        
        if (data) {
          const { data: credentialsData, error: credentialsError } = await supabase
            .from('platform_credentials')
            .select('*')
            .eq('request_id', requestId);
          
          if (!credentialsError && credentialsData) {
            setCredentials(credentialsData);
          }
        }
      } catch (error: any) {
        console.error("Error fetching request:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequest();
  }, [requestId, isAdmin, toast]);
  
  const sendStatusUpdateEmail = async (
    userEmail: string, 
    userName: string, 
    requestTitle: string, 
    requestId: string,
    newStatus: string,
    previousStatus: string
  ) => {
    try {
      const response = await supabase.functions.invoke("send-request-update-email", {
        body: {
          recipient: userEmail,
          recipientName: userName,
          requestTitle,
          requestId,
          newStatus,
          previousStatus
        }
      });
      
      if (response.error) {
        console.error("Error invoking function:", response.error);
      } else {
        console.log("Email notification sent successfully");
      }
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  };
  
  const createAndSendInvoice = async () => {
    if (!request || !request.profiles || !request.estimated_cost) {
      toast({
        title: "Cannot send invoice",
        description: "Missing customer information or estimated cost.",
        variant: "destructive"
      });
      return;
    }
    
    setSendingInvoice(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment-intent", {
        body: {
          operation: "create-invoice",
          amount: request.estimated_cost,
          requestId: request.id,
          requestTitle: request.title,
          customerEmail: request.profiles?.email,
          customerName: `${request.profiles?.first_name || ''} ${request.profiles?.last_name || ''}`.trim(),
          metadata: {
            userId: request.user_id,
            requestStatus: "Completed"
          }
        }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast({
          title: "Invoice Sent",
          description: `Invoice has been created and sent to ${request.profiles.email}.`
        });
        
        await supabase
          .from("payments")
          .insert({
            request_id: request.id,
            user_id: request.user_id,
            status: "Pending",
            amount: request.estimated_cost,
            payment_id: data.invoiceId,
            payment_method: "invoice"
          });
      }
    } catch (error: any) {
      console.error("Error sending invoice:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send invoice",
        variant: "destructive"
      });
    } finally {
      setSendingInvoice(false);
    }
  };
  
  const handleSaveChanges = async () => {
    if (!request) return;
    
    setSaving(true);
    try {
      const previousStatus = request.status;
      
      const { error } = await supabase
        .from("requests")
        .update({
          status: formData.status as any,  // Cast to any to avoid enum type errors
          estimated_cost: formData.estimated_cost ? Number(formData.estimated_cost) : null,
          title: formData.title,
          description: formData.description
        })
        .eq("id", request.id);
      
      if (error) throw error;
      
      toast({
        title: "Changes Saved",
        description: "The request has been updated successfully."
      });
      
      setRequest({
        ...request,
        status: formData.status,
        estimated_cost: formData.estimated_cost ? Number(formData.estimated_cost) : null,
        title: formData.title,
        description: formData.description
      });
      
      if (formData.status !== previousStatus && request.profiles?.email) {
        await sendStatusUpdateEmail(
          request.profiles.email,
          request.profiles.first_name,
          request.title,
          request.id,
          formData.status,
          previousStatus
        );
        
        toast({
          title: "Notification Sent",
          description: "The requester has been notified of the status change."
        });
        
        if (formData.status === "Completed" && previousStatus !== "Completed" && request.estimated_cost) {
          await createAndSendInvoice();
        }
      }
      
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (adminLoading || loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      </MainLayout>
    );
  }
  
  if (!isAdmin) {
    return null; // Redirected via useEffect
  }
  
  if (!request) {
    return (
      <MainLayout>
        <div className="container px-4 py-10 mx-auto">
          <div className="text-center p-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium">Request not found</h3>
            <p className="text-muted-foreground mt-2">
              The request you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/admin")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const hasPayment = request.payments && request.payments.length > 0;
  
  return (
    <MainLayout>
      <div className="container px-4 py-10 mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin Dashboard
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {editing ? (
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="mt-1"
                      />
                    ) : (
                      request.title
                    )}
                  </CardTitle>
                  <CardDescription>
                    Request ID: {request.id}
                  </CardDescription>
                </div>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          status: request.status,
                          estimated_cost: request.estimated_cost?.toString() || "",
                          title: request.title,
                          description: request.description
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveChanges}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader className="mr-2 h-4 w-4 animate-spin" /> Saving
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  {editing ? (
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={6}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">
                      {request.description}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    {editing ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({...formData, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_review">In Review</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="denied">Denied</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium ${
                        request.status === "in_review"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "approved"
                          ? "bg-blue-100 text-blue-800"
                          : request.status === "in_progress"
                          ? "bg-indigo-100 text-indigo-800"
                          : request.status === "denied"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {request.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Estimated Cost</h3>
                    {editing ? (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                        <Input
                          type="number"
                          value={formData.estimated_cost}
                          onChange={(e) => setFormData({...formData, estimated_cost: e.target.value})}
                          className="pl-10"
                          placeholder="100.00"
                        />
                      </div>
                    ) : (
                      <p className="text-xl font-bold">
                        {request.estimated_cost 
                          ? `£${Number(request.estimated_cost).toFixed(2)}` 
                          : "Not set"}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment Status</h3>
                  {hasPayment ? (
                    <div className="space-y-2">
                      <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Paid
                      </span>
                      <p className="text-sm text-muted-foreground">
                        Payment of £{Number(request.payments[0].amount).toFixed(2)} received on {new Date(request.payments[0].created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      Not Paid
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requester Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Name</h4>
                    <p className="text-muted-foreground">
                      {request?.profiles?.first_name 
                        ? `${request.profiles.first_name} ${request.profiles.last_name || ''}`
                        : "Unknown User"}
                    </p>
                  </div>
                </div>
                
                {request?.profiles?.email && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-muted-foreground">{request.profiles.email}</p>
                    </div>
                  </div>
                )}
                
                {request?.profiles?.company && (
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Company</h4>
                      <p className="text-muted-foreground">{request.profiles.company}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Submitted On</h4>
                    <p className="text-muted-foreground">
                      {request && new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Last Updated</h4>
                    <p className="text-muted-foreground">
                      {request && new Date(request.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">User ID</h4>
                    <p className="text-muted-foreground break-all">{request?.user_id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {credentials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Lock className="h-5 w-5 text-primary mr-2" />
                    Platform Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {credentials.map((cred: any) => (
                    <div key={cred.id} className="p-3 rounded-md bg-muted">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{cred.platform_name}</div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Key className="h-3 w-3 mr-1" /> View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{cred.platform_name} Credentials</DialogTitle>
                              <DialogDescription>
                                Submitted on {new Date(cred.created_at).toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-3 gap-4">
                                {Object.entries(cred.credentials_json).map(([key, value]: [string, any]) => (
                                  <div key={key} className="break-words">
                                    <div className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {key === 'password' || key === 'apiKey' 
                                        ? '••••••••••••' 
                                        : String(value)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Submitted {new Date(cred.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {request?.status === "in_review" && (
                  <Button 
                    className="w-full" 
                    onClick={async () => {
                      try {
                        const previousStatus = request.status;
                        const newStatus = "approved";
                        
                        const { error } = await supabase
                          .from("requests")
                          .update({ status: newStatus })
                          .eq("id", request.id);
                        
                        if (error) throw error;
                        
                        setRequest({ ...request, status: newStatus });
                        setFormData({ ...formData, status: newStatus });
                        
                        toast({
                          title: "Request Approved",
                          description: "The request has been approved."
                        });
                        
                        if (request.profiles?.email) {
                          await sendStatusUpdateEmail(
                            request.profiles.email,
                            request.profiles.first_name,
                            request.title,
                            request.id,
                            newStatus,
                            previousStatus
                          );
                          
                          toast({
                            title: "Notification Sent",
                            description: "The requester has been notified of the status change."
                          });
                        }
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Approve Request
                  </Button>
                )}
                
                {request?.status === "in_review" && (
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={async () => {
                      try {
                        const previousStatus = request.status;
                        const newStatus = "denied";
                        
                        const { error } = await supabase
                          .from("requests")
                          .update({ status: newStatus })
                          .eq("id", request.id);
                        
                        if (error) throw error;
                        
                        setRequest({ ...request, status: newStatus });
                        setFormData({ ...formData, status: newStatus });
                        
                        toast({
                          title: "Request Denied",
                          description: "The request has been denied."
                        });
                        
                        if (request.profiles?.email) {
                          await sendStatusUpdateEmail(
                            request.profiles.email,
                            request.profiles.first_name,
                            request.title,
                            request.id,
                            newStatus,
                            previousStatus
                          );
                          
                          toast({
                            title: "Notification Sent",
                            description: "The requester has been notified of the status change."
                          });
                        }
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Deny Request
                  </Button>
                )}
                
                {request?.status === "in_progress" && (
                  <Button 
                    className="w-full" 
                    onClick={async () => {
                      try {
                        const previousStatus = request.status;
                        const newStatus = "completed";
                        
                        const { error } = await supabase
                          .from("requests")
                          .update({ status: newStatus })
                          .eq("id", request.id);
                        
                        if (error) throw error;
                        
                        setRequest({ ...request, status: newStatus });
                        setFormData({ ...formData, status: newStatus });
                        
                        toast({
                          title: "Request Completed",
                          description: "The request has been marked as completed."
                        });
                        
                        if (request.profiles?.email) {
                          await sendStatusUpdateEmail(
                            request.profiles.email,
                            request.profiles.first_name,
                            request.title,
                            request.id,
                            newStatus,
                            previousStatus
                          );
                          
                          toast({
                            title: "Notification Sent",
                            description: "The requester has been notified of the status change."
                          });
                          
                          if (request.estimated_cost) {
                            await createAndSendInvoice();
                          } else {
                            toast({
                              title: "No Invoice Sent",
                              description: "No estimated cost set for this request.",
                              variant: "destructive"
                            });
                          }
                        }
                      } catch (error: any) {
                        toast({
                          title: "Error",
                          description: error.message,
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    Mark as Completed
                  </Button>
                )}
                
                {request?.status === "completed" && request.estimated_cost && !hasPayment && (
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={createAndSendInvoice}
                    disabled={sendingInvoice}
                  >
                    {sendingInvoice ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" /> Sending Invoice...
                      </>
                    ) : (
                      <>
                        <DollarSign className="mr-2 h-4 w-4" /> Send Invoice
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestDetailAdmin;
