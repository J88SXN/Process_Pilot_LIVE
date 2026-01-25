
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CredentialsPayload {
  requestId: string;
  userId: string;
  platform: string;
  credentials: {
    username?: string;
    password?: string;
    apiKey?: string;
    accountDetails?: string;
    otherInfo?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId, userId, platform, credentials }: CredentialsPayload = await req.json();

    if (!requestId || !userId || !platform) {
      throw new Error("Missing required fields");
    }

    // Check if the user has permission to add credentials for this request
    const { data: requestData, error: requestError } = await supabase
      .from("requests")
      .select("id, user_id, status")
      .eq("id", requestId)
      .eq("user_id", userId)
      .single();

    if (requestError || !requestData) {
      throw new Error("Request not found or you don't have permission");
    }

    if (requestData.status !== "Approved" && requestData.status !== "In Progress") {
      throw new Error("You can only add credentials for approved or in-progress requests");
    }

    // Store credentials in the database
    const { data, error } = await supabase
      .from("platform_credentials")
      .insert({
        request_id: requestId,
        platform: platform,
        credentials: credentials
      })
      .select();

    if (error) {
      console.error("Error storing credentials:", error);
      throw new Error("Failed to store credentials");
    }

    // Get user name for notification
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("user_id", userId)
      .single();
      
    const clientName = userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : "A client";
    const clientEmail = "client@example.com"; // Email not stored in profiles

    // Notify admins about new credentials
    await supabase.functions.invoke("send-meeting-request", {
      body: {
        recipient: "jason.stolworthy@processpilot.co.uk",
        clientName: clientName,
        clientEmail: clientEmail,
        company: "Company", // This should be retrieved in a real implementation
        requestId: requestId,
        preferredMethod: "email",
        subject: "New Platform Credentials Submitted",
        message: `${clientName} has submitted credentials for ${platform} for request ID: ${requestId}. Please check the admin dashboard.`
      }
    });

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in handle-credentials function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
