
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Clock, FileText, MoreHorizontal, PlusCircle, Loader, CheckCircle, User, Calendar, Mail, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import RequestDetail from "@/components/RequestDetail";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { getErrorMessage } from "@/lib/utils";

type ProfileSummary = {
  first_name: string | null;
  last_name: string | null;
  company: string | null;
};

type RequestRecord = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
  estimated_cost: number | null;
  profiles?: ProfileSummary | null;
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState<RequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeRequests: 0,
    completedRequests: 0,
    avgResponseTime: '8 hours'
  });
  
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the dashboard.",
      });
      navigate("/auth");
    }
  }, [user, authLoading, navigate, toast]);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchRequests = async () => {
      try {
        console.log("Fetching requests for user:", user.id);
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching requests:", error);
          throw error;
        }
        
        console.log("Fetched requests:", data);
        setRequests(data || []);
        
        const active = data?.filter(r => r.status === "in_review" || r.status === "approved" || r.status === "in_progress").length || 0;
        const completed = data?.filter(r => r.status === "completed").length || 0;
        
        setStats({
          activeRequests: active,
          completedRequests: completed,
          avgResponseTime: '8 hours'
        });
      } catch (error: unknown) {
        console.error("Error fetching requests:", error);
        toast({
          title: "Error fetching requests",
          description: getErrorMessage(error, "Failed to fetch requests."),
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [user, toast]);
  
  const filteredRequests = requests.filter(request => {
    if (activeTab === "all") return true;
    if (activeTab === "inReview") return request.status === "in_review";
    if (activeTab === "inProgress") return request.status === "in_progress" || request.status === "approved";
    if (activeTab === "completed") return request.status === "completed";
    return true;
  });
  
  const viewRequestDetails = (requestId: string) => {
    setSelectedRequestId(requestId);
  };
  
  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      </MainLayout>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <MainLayout>
      <section className="py-10">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Track and manage your automation requests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Requests
                </CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Requests currently in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Response Time
                </CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                <p className="text-xs text-muted-foreground">
                  Time to initial response
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Projects
                </CardTitle>
                <BarChart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed automations
                </p>
              </CardContent>
            </Card>
          </div>
          
          {selectedRequestId ? (
            <div className="mb-8">
              <Button 
                variant="ghost" 
                className="mb-4"
                onClick={() => setSelectedRequestId(null)}
              >
                ← Back to requests
              </Button>
              <RequestDetail requestId={selectedRequestId} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Requests</h2>
                <Link to="/request">
                  <Button size="sm" className="flex items-center">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Request
                  </Button>
                </Link>
              </div>
              
              <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="inReview">In Review</TabsTrigger>
                  <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                  <div className="rounded-lg subtle-border">
                    {loading ? (
                      <div className="p-8 text-center">
                        <Loader className="animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading your requests...</p>
                      </div>
                    ) : filteredRequests.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-muted/50 text-left">
                              <th className="px-4 py-3 text-sm font-medium">Request ID</th>
                              <th className="px-4 py-3 text-sm font-medium">Title</th>
                              <th className="px-4 py-3 text-sm font-medium">Status</th>
                              <th className="px-4 py-3 text-sm font-medium">Date</th>
                              <th className="px-4 py-3 text-sm font-medium"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {filteredRequests.map((request) => (
                              <tr key={request.id} className="bg-card">
                                <td className="px-4 py-3 text-sm">
                                  {request.id.substring(0, 8)}...
                                </td>
                                <td className="px-4 py-3 font-medium">{request.title}</td>
                                 <td className="px-4 py-3">
                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                                 </td>
                                <td className="px-4 py-3 text-sm">
                                  {new Date(request.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => viewRequestDetails(request.id)}
                                    >
                                      View Details
                                    </Button>
                                    
                                    <ContextMenu>
                                      <ContextMenuTrigger>
                                        <Button variant="ghost" size="icon">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </ContextMenuTrigger>
                                      <ContextMenuContent className="w-64">
                                        <div className="p-2 text-sm">
                                          <div className="font-medium">Request Info</div>
                                          <div className="mt-2 space-y-1.5">
                                            <div className="flex items-center text-muted-foreground">
                                              <Calendar className="mr-2 h-3.5 w-3.5" />
                                              <span>Submitted: {new Date(request.created_at).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center text-muted-foreground">
                                              <User className="mr-2 h-3.5 w-3.5" />
                                              <span>Requester: {request.profiles?.first_name || ''} {request.profiles?.last_name || ''}</span>
                                            </div>
                                            {request.profiles?.company && (
                                              <div className="flex items-center text-muted-foreground">
                                                <Building className="mr-2 h-3.5 w-3.5" />
                                                <span>Company: {request.profiles.company}</span>
                                              </div>
                                            )}
                                            {request.estimated_cost && (
                                              <div className="flex items-center text-muted-foreground">
                                                <FileText className="mr-2 h-3.5 w-3.5" />
                                                <span>Estimated cost: ${request.estimated_cost.toFixed(2)}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <ContextMenuSeparator />
                                        <ContextMenuItem onClick={() => viewRequestDetails(request.id)}>
                                          View full details
                                        </ContextMenuItem>
                                      </ContextMenuContent>
                                    </ContextMenu>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">No requests found.</p>
                        <Link to="/request">
                          <Button size="sm" className="flex items-center">
                            <PlusCircle className="mr-2 w-4 h-4" />
                            Create Your First Request
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Dashboard;
