
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader } from "lucide-react";

import AdminRequestStats from "@/components/admin/AdminRequestStats";
import AdminRequestTabs from "@/components/admin/AdminRequestTabs";
import { Request, RequestWithProfile } from "@/types/requests";

const AdminDashboard = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<RequestWithProfile[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<RequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    inReview: 0,
    inProgress: 0,
    completed: 0,
    denied: 0
  });
  
  useEffect(() => {
    if (adminLoading) return;
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate, toast]);
  
  useEffect(() => {
    if (!isAdmin || adminLoading) return;
    
    const fetchData = async () => {
      try {
        console.log("Fetching admin data...");
        
        const { data, error } = await supabase
          .from("requests")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching admin data:", error);
          throw error;
        }

        if (!data) {
          console.log("No data returned from query");
          return;
        }
        
        console.log("Retrieved requests:", data.length);
        
        const requestsWithProfiles = await Promise.all(
          data.map(async (request) => {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", request.user_id)
              .single();
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.error("Error fetching profile for user", request.user_id, profileError);
            }
            
            return {
              ...request,
              profile: profileData || null
            };
          })
        );
        
        setRequests(requestsWithProfiles);
        setFilteredRequests(requestsWithProfiles);
        
        const total = requestsWithProfiles.length;
        const inReview = requestsWithProfiles.filter(r => r.status === "in_review").length;
        const inProgress = requestsWithProfiles.filter(r => r.status === "in_progress" || r.status === "approved").length;
        const completed = requestsWithProfiles.filter(r => r.status === "completed").length;
        const denied = requestsWithProfiles.filter(r => r.status === "denied").length;
        
        setStats({
          total,
          inReview,
          inProgress,
          completed,
          denied
        });
      } catch (error: any) {
        console.error("Error fetching admin data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load admin data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin, adminLoading, toast]);
  
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredRequests(requests.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (request.profile?.first_name && request.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.profile?.last_name && request.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (request.profile?.company && request.profile.company.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    } else if (activeTab === "inReview") {
      setFilteredRequests(requests.filter(request => 
        request.status === "in_review" && (
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.profile?.first_name && request.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.last_name && request.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.company && request.profile.company.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      ));
    } else if (activeTab === "inProgress") {
      setFilteredRequests(requests.filter(request => 
        (request.status === "in_progress" || request.status === "approved") && (
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.profile?.first_name && request.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.last_name && request.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.company && request.profile.company.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      ));
    } else if (activeTab === "completed") {
      setFilteredRequests(requests.filter(request => 
        request.status === "completed" && (
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.profile?.first_name && request.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.last_name && request.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.company && request.profile.company.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      ));
    } else if (activeTab === "denied") {
      setFilteredRequests(requests.filter(request => 
        request.status === "denied" && (
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.profile?.first_name && request.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.last_name && request.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.profile?.company && request.profile.company.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      ));
    }
  }, [activeTab, searchTerm, requests]);
  
  if (adminLoading) {
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
    return null; // Will be redirected via useEffect
  }
  
  return (
    <MainLayout>
      <div className="container px-4 py-10 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <AdminRequestStats stats={stats} />
        
        <div className="flex flex-col md:flex-row md:items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search requests, users or companies..."
              className="pl-10 max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/admin/add" className="w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto">
              Add New Admin
            </Button>
          </Link>
        </div>
        
        <AdminRequestTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          filteredRequests={filteredRequests} 
          loading={loading} 
          setRequests={setRequests}
          requests={requests}
          navigate={navigate}
          toast={toast}
        />
        
        <div className="mt-8 bg-muted p-6 rounded-lg">
          <h2 className="text-lg font-medium mb-4">Add New Admin</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">User Email Address</Label>
              <Label className="text-sm text-muted-foreground">
                Enter the email address of a registered user to grant them admin access
              </Label>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="adminEmail" className="sr-only">Admin Email</Label>
                <Input
                  id="adminEmail"
                  placeholder="user@example.com"
                  className="w-full"
                />
              </div>
              
              <Button className="w-full sm:w-auto">
                Assign Admin Role
              </Button>
              <Button variant="outline" className="w-full sm:w-auto">
                <Link to="/admin/add">Advanced Options</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
