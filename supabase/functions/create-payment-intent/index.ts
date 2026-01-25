import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Stripe } from "https://esm.sh/stripe@12.18.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, requestId, metadata, operation, customerEmail, requestTitle, customerName } = await req.json();

    // Check if we're creating an invoice
    if (operation === "create-invoice") {
      console.log("Creating invoice for request:", requestId);
      
      // Use fixed cost of £500 for all deployments
      const invoiceAmount = 500; // £500 fixed cost
      
      // Check if customer exists, otherwise create one
      let customer;
      const customerSearch = await stripe.customers.search({
        query: `email:'${customerEmail}'`,
      });
      
      if (customerSearch.data.length > 0) {
        customer = customerSearch.data[0];
        console.log("Found existing customer:", customer.id);
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: {
            userId: metadata?.userId
          }
        });
        console.log("Created new customer:", customer.id);
      }

      // Create an invoice item
      await stripe.invoiceItems.create({
        customer: customer.id,
        amount: Math.round(invoiceAmount * 100), // Stripe expects amount in cents
        currency: "gbp",
        description: `Completed automation: ${requestTitle}`,
      });

      // Create the invoice and send it
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        auto_advance: true, // Auto-finalize the invoice
        collection_method: "send_invoice",
        days_until_due: 30,
      });

      // Send the invoice
      await stripe.invoices.sendInvoice(invoice.id);
      
      console.log("Invoice created and sent:", invoice.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          invoiceId: invoice.id, 
          invoiceUrl: invoice.hosted_invoice_url 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Original payment intent creation logic
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency: "gbp",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        requestId,
        ...metadata,
      },
    });

    // Return the client secret to the client
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
