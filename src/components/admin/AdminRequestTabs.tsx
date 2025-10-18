
import { supabase } from "@/integrations/supabase/client";
import { RequestWithProfile } from "@/types/requests";
import { NavigateFunction } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RequestTable from "@/components/admin/RequestTable";
import { EmptyRequestState } from "@/components/admin/EmptyRequestState";
import { Loader } from "lucide-react";

interface AdminRequestTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredRequests: RequestWithProfile[];
  loading: boolean;
  requests: RequestWithProfile[];
  setRequests: React.Dispatch<React.SetStateAction<RequestWithProfile[]>>;
  navigate: NavigateFunction;
  toast: any;
}

const AdminRequestTabs = ({ 
  activeTab, 
  setActiveTab, 
  filteredRequests, 
  loading,
  requests,
  setRequests,
  navigate,
  toast
}: AdminRequestTabsProps) => {

  const handleUpdateStatus = async (requestId: string, newStatus: "approved" | "denied") => {
    try {
      await supabase
        .from("requests")
        .update({ status: newStatus })
        .eq("id", requestId);
        
      toast({
        title: `Request ${newStatus === "approved" ? "Approved" : "Denied"}`,
        description: `The request has been ${newStatus === "approved" ? "approved" : "denied"}.`
      });
      
      setRequests(requests.map(r => 
        r.id === requestId ? { ...r, status: newStatus } : r
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="all">All Requests</TabsTrigger>
        <TabsTrigger value="inReview">In Review</TabsTrigger>
        <TabsTrigger value="inProgress">In Progress</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="denied">Denied</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="animate-spin mr-2" />
            <span>Loading requests...</span>
          </div>
        ) : filteredRequests.length > 0 ? (
          <RequestTable 
            requests={filteredRequests} 
            navigate={navigate} 
            showStatus={true} 
            showActions={true}
            onApprove={(id) => handleUpdateStatus(id, "approved")}
            onDeny={(id) => handleUpdateStatus(id, "denied")}
          />
        ) : (
          <EmptyRequestState />
        )}
      </TabsContent>
      
      <TabsContent value="inReview" className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="animate-spin mr-2" />
            <span>Loading requests...</span>
          </div>
        ) : filteredRequests.length > 0 ? (
          <RequestTable 
            requests={filteredRequests} 
            navigate={navigate} 
            showStatus={false} 
            showActions={true}
            onApprove={(id) => handleUpdateStatus(id, "approved")}
            onDeny={(id) => handleUpdateStatus(id, "denied")} 
          />
        ) : (
          <EmptyRequestState message="No requests in review" description="There are currently no requests that need review" />
        )}
      </TabsContent>
      
      <TabsContent value="inProgress" className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="animate-spin mr-2" />
            <span>Loading requests...</span>
          </div>
        ) : filteredRequests.length > 0 ? (
          <RequestTable 
            requests={filteredRequests} 
            navigate={navigate} 
            showStatus={true} 
            showActions={false} 
          />
        ) : (
          <EmptyRequestState message="No requests in progress" description="There are currently no active requests" />
        )}
      </TabsContent>
      
      <TabsContent value="completed" className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="animate-spin mr-2" />
            <span>Loading requests...</span>
          </div>
        ) : filteredRequests.length > 0 ? (
          <RequestTable 
            requests={filteredRequests} 
            navigate={navigate} 
            showStatus={false} 
            showActions={false} 
          />
        ) : (
          <EmptyRequestState message="No completed requests" description="There are currently no completed requests" />
        )}
      </TabsContent>
      
      <TabsContent value="denied" className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="animate-spin mr-2" />
            <span>Loading requests...</span>
          </div>
        ) : filteredRequests.length > 0 ? (
          <RequestTable 
            requests={filteredRequests} 
            navigate={navigate} 
            showStatus={false} 
            showActions={false} 
          />
        ) : (
          <EmptyRequestState message="No denied requests" description="There are currently no denied requests" />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AdminRequestTabs;
