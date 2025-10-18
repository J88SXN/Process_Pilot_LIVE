
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { useAdmin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import MakeAdminForm from "@/components/MakeAdminForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

const AddAdmin = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (loading) return;
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate("/");
    }
  }, [isAdmin, loading, navigate, toast]);
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader className="animate-spin mr-2" />
          <span>Checking permissions...</span>
        </div>
      </MainLayout>
    );
  }
  
  if (!isAdmin) {
    return null; // Redirected via useEffect
  }
  
  return (
    <MainLayout>
      <div className="container px-4 py-10 mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground mt-2">
            Add new administrators to the system
          </p>
        </div>
        
        <MakeAdminForm />
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to add an admin</CardTitle>
            <CardDescription>
              Follow these steps to add a new admin user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Ask the user to sign up for an account first</li>
              <li>Find their User ID in the Users tab of the Admin Dashboard</li>
              <li>Copy the complete User ID (it's a UUID)</li>
              <li>Paste it in the form above and click "Make Admin"</li>
              <li>The user will have admin access on their next login</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddAdmin;
