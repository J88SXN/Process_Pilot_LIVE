
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.1.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestUpdatePayload {
  recipient: string;
  recipientName?: string;
  requestTitle: string;
  requestId: string;
  newStatus: string;
  previousStatus?: string;
  paymentLink?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      recipient,
      recipientName,
      requestTitle,
      requestId,
      newStatus,
      previousStatus,
      paymentLink
    }: RequestUpdatePayload = await req.json();

    if (!recipient || !requestTitle || !newStatus) {
      throw new Error("Missing required fields");
    }

    const formatStatusLabel = (status?: string) => {
      if (!status) return "Pending";
      return status
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const normalizedStatus = newStatus.toLowerCase();
    const normalizedPreviousStatus = previousStatus?.toLowerCase();

    const statusDetailsMap: Record<
      string,
      { label: string; color: string; message: string }
    > = {
      pending: {
        label: "Pending Review",
        color: "#71717a",
        message:
          "We've received your request and will review it shortly. We'll let you know as soon as we make a decision."
      },
      in_review: {
        label: "In Review",
        color: "#f59e0b",
        message:
          "Our team is reviewing your request and gathering any additional details needed to move forward."
      },
      approved: {
        label: "Approved",
        color: "#3b82f6",
        message:
          "Great news! Your request has been approved. We'll reach out with next steps to get started."
      },
      in_progress: {
        label: "In Progress",
        color: "#6366f1",
        message:
          "We're actively working on your automation. We'll keep you posted as we make progress."
      },
      completed: {
        label: "Completed",
        color: "#10b981",
        message:
          "Your automation is complete and ready for review. You can wrap things up using the payment details below."
      },
      denied: {
        label: "Declined",
        color: "#ef4444",
        message:
          "After reviewing the request we've determined it isn't a fit right now. We're happy to talk about alternatives if needed."
      },
      cancelled: {
        label: "Cancelled",
        color: "#6b7280",
        message:
          "This request has been cancelled. Reach out if you'd like to revisit or create a new one."
      }
    };

    const statusDetails =
      statusDetailsMap[normalizedStatus] || {
        label: formatStatusLabel(newStatus),
        color: "#71717a",
        message: "There's been an update to your request."
      };

    const previousStatusLabel = previousStatus
      ? statusDetailsMap[normalizedPreviousStatus || ""]?.label ||
        formatStatusLabel(previousStatus)
      : "Previous status";

    const safeRecipientName = recipientName?.trim() || "there";

    const messageBody =
      normalizedStatus === "completed" && !paymentLink
        ? "Your automation is complete and ready for review. We'll follow up with payment details shortly."
        : statusDetails.message;

    const { data, error } = await resend.emails.send({
      from: "ProcessPilot <onboarding@resend.dev>",
      to: recipient,
      subject: `Update on your request: ${requestTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Request Status Update</h1>
          <p style="color: #555; font-size: 16px;">Hello ${safeRecipientName},</p>
          <p style="color: #555; font-size: 16px;">
            Your automation request <strong>${requestTitle}</strong> has been updated.
          </p>
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #e5e5e5; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px;">Status changed from:</p>
            <p style="font-size: 16px; margin: 5px 0 15px 0;"><strong>${previousStatusLabel}</strong></p>
            <p style="margin: 0; font-size: 14px;">To:</p>
            <p style="margin: 5px 0; font-size: 18px;">
              <span style="background-color: ${statusDetails.color}; color: white; padding: 5px 10px; border-radius: 3px;">
                <strong>${statusDetails.label}</strong>
              </span>
            </p>
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            ${messageBody}
          </p>
          ${
            paymentLink
              ? `
          <div style="margin: 30px 0; text-align: center;">
            <a href="${paymentLink}" style="display: inline-block; background-color: #2563eb; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: 600;">
              Complete Payment
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
              This secure link includes the invoice for your completed automation.
            </p>
          </div>
          `
              : ""
          }
          <p style="color: #555; font-size: 16px; line-height: 1.6;">
            You can view the full details of your request in your dashboard at any time.
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
