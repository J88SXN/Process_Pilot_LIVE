
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";

const adminSchema = z.object({
  userId: z.string().uuid({ message: "Please enter a valid user ID (UUID format)" })
});

const MakeAdminForm = () => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter a user ID",
        variant: "destructive"
      });
      return;
    }

    // Validate UUID format
    const result = adminSchema.safeParse({ userId });
    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if the user already has the admin role
      const { data: existingRole, error: checkError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .eq("role", "admin")
        .single();
      
      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }
      
      if (existingRole) {
        toast({
          title: "Already Admin",
          description: "This user already has admin privileges."
        });
        return;
      }
      
      // Add the admin role to the user
      const { error } = await supabase
        .from("user_roles")
        .insert({
          user_id: userId,
          role: "admin"
        });
      
      if (error) throw error;
      
      toast({
        title: "Admin Added",
        description: "The user has been granted admin privileges."
      });
      
      setUserId("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add admin role",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make Admin</CardTitle>
        <CardDescription>
          Grant admin privileges to a user by entering their User ID.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
                title="Please enter a valid UUID"
                required
              />
              <p className="text-xs text-muted-foreground">
                You can find the User ID in the Users tab of the Admin Dashboard.
              </p>
            </div>
          </div>
          <Button
            className="mt-4 w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Make Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MakeAdminForm;
