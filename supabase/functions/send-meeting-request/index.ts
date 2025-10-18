
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.1.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MeetingRequestPayload {
  recipient: string;
  clientName: string;
  clientEmail: string;
  company: string;
  requestId: string;
  preferredMethod: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipient, clientName, clientEmail, company, requestId, preferredMethod }: MeetingRequestPayload = await req.json();

    if (!recipient || !clientName || !clientEmail) {
      throw new Error("Missing required fields");
    }

    const preferredMethodText = {
      "email": "Email",
      "phone": "Phone call",
      "video": "Video call (Google Meet)"
    }[preferredMethod] || "Not specified";

    const { data, error } = await resend.emails.send({
      from: "ProcessPilot <onboarding@resend.dev>",
      to: recipient,
      subject: `Meeting Request: ${clientName} from ${company}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">New Consultation Request</h1>
          <p style="color: #555; font-size: 16px;">
            ${clientName} from ${company} has requested a consultation about their automation needs.
          </p>
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <p style="margin: 0; font-weight: bold;">Client Details:</p>
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin: 10px 0;"><strong>Name:</strong> ${clientName}</li>
              <li style="margin: 10px 0;"><strong>Email:</strong> ${clientEmail}</li>
              <li style="margin: 10px 0;"><strong>Company:</strong> ${company}</li>
              <li style="margin: 10px 0;"><strong>Request ID:</strong> ${requestId || "Not available"}</li>
              <li style="margin: 10px 0;"><strong>Preferred Contact Method:</strong> ${preferredMethodText}</li>
            </ul>
          </div>
          <p style="color: #555; font-size: 16px;">
            Please schedule a meeting with the client at your earliest convenience.
          </p>
          <p style="color: #555; font-size: 16px;">
            You can create a calendar invite using Google Calendar and send it to the client's email address.
          </p>
          <div style="margin: 20px 0;">
            <a href="https://calendar.google.com/calendar/u/0/r/eventedit?text=ProcessPilot+Automation+Consultation&details=Consultation+regarding+automation+project+for+${encodeURIComponent(company)}&add=${encodeURIComponent(clientEmail)}" 
               style="background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Create Google Calendar Event
            </a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send meeting request: ${error.message}`);
    }

    console.log("Meeting request email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-meeting-request function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
