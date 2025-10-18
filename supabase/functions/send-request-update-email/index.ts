
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.1.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestUpdatePayload {
  recipient: string;
  recipientName: string;
  requestTitle: string;
  requestId: string;
  newStatus: string;
  previousStatus: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient, recipientName, requestTitle, requestId, newStatus, previousStatus }: RequestUpdatePayload = await req.json();

    if (!recipient || !requestTitle || !newStatus) {
      throw new Error("Missing required fields");
    }

    const statusColorMap: Record<string, string> = {
      "In Review": "#f59e0b", // amber
      "Approved": "#3b82f6", // blue
      "In Progress": "#6366f1", // indigo
      "Completed": "#10b981", // green
      "Denied": "#ef4444", // red
    };

    const statusColor = statusColorMap[newStatus] || "#71717a"; // zinc as default

    const { data, error } = await resend.emails.send({
      from: "ProcessPilot <onboarding@resend.dev>",
      to: recipient,
      subject: `Update on your request: ${requestTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Request Status Update</h1>
          <p style="color: #555; font-size: 16px;">Hello ${recipientName || "there"},</p>
          <p style="color: #555; font-size: 16px;">
            Your automation request <strong>${requestTitle}</strong> has been updated.
          </p>
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px;">Status changed from:</p>
            <p style="font-size: 16px; margin: 5px 0 15px 0;"><strong>${previousStatus || "Previous status"}</strong></p>
            <p style="margin: 0; font-size: 14px;">To:</p>
            <p style="margin: 5px 0; font-size: 18px;">
              <span style="background-color: ${statusColor}; color: white; padding: 5px 10px; border-radius: 3px;">
                <strong>${newStatus}</strong>
              </span>
            </p>
          </div>
          <p style="color: #555; font-size: 16px;">
            You can view the full details of your request in your dashboard.
          </p>
          <p style="color: #555; font-size: 16px;">
            Thank you for using our services.
          </p>
          <p style="color: #555; font-size: 16px;">
            Best regards,<br>
            The ProcessPilot Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-request-update-email function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
