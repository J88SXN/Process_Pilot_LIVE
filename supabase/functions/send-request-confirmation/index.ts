import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.1.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmationPayload {
  recipient: string;
  recipientName?: string;
  requestTitle: string;
}

serve(async req => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient, recipientName, requestTitle }: ConfirmationPayload = await req.json();

    if (!recipient || !requestTitle) {
      throw new Error("Missing required fields");
    }

    const friendlyName = recipientName?.trim() || "there";

    const { data, error } = await resend.emails.send({
      from: "ProcessPilot <onboarding@resend.dev>",
      to: recipient,
      subject: `We've received your request: ${requestTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #111827; font-size: 22px;">Thanks for submitting your request</h1>
          <p style="color: #4b5563; font-size: 16px;">Hi ${friendlyName},</p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            We've successfully received your automation request <strong>${requestTitle}</strong>.
            Our ProcessPilot team is now reviewing the details and will follow up shortly.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            You'll receive another email as soon as your request is approved or declined, and
            we'll keep you updated on the next steps throughout the process.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            If you have any additional information to share in the meantime, just reply to this email.
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Cheers,<br/>
            The ProcessPilot Team
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending confirmation email:", error);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-request-confirmation function:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
