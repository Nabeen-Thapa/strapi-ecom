// import { stripe } from "../utils/stripe";

// export default {
//   async handleWebhook(ctx) {
//     console.log("🔔 Webhook received!");

//     try {
//       // In Strapi 5, raw body is available via ctx.request.body
//       // when includeUnparsed is set to true
//       const rawBody = ctx.request.body;

//       // If rawBody is an object, stringify it
//       const rawRequestBody = typeof rawBody === 'string' 
//         ? rawBody 
//         : JSON.stringify(rawBody);

//       const signature = ctx.request.headers["stripe-signature"];

//       if (!signature) {
//         console.error(" No stripe signature header");
//         return ctx.badRequest("No stripe signature");
//       }

//       if (!process.env.STRIPE_WEBHOOK_SECRET) {
//         console.error(" STRIPE_WEBHOOK_SECRET not set in environment");
//         return ctx.badRequest("Webhook secret not configured");
//       }

//       console.log("Raw body length:", rawRequestBody.length);
//       console.log("Signature present: YES");

//       // Construct the event
//       const event = stripe.webhooks.constructEvent(
//         rawRequestBody,
//         signature,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );

//       console.log(" Webhook verified! Event type:", event.type);

//       // Handle checkout.session.completed
//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object;

//         console.log(" Payment completed!");
//         console.log("Session ID:", session.id);
//         console.log("Payment Intent ID:", session.payment_intent);
//         console.log("Metadata:", session.metadata);

//         const orderId = session.metadata?.orderId;
//         const paymentIntentId = session.payment_intent as string;

//         if (!orderId) {
//           console.log(" No orderId in metadata");
//           ctx.send({ received: true });
//           return;
//         }

//         if (!paymentIntentId) {
//           console.log(" No payment intent ID in session");
//           ctx.send({ received: true });
//           return;
//         }

//         // Update order with payment intent ID
//         console.log(` Updating order ${orderId} with payment intent: ${paymentIntentId}`);

//         // In Strapi 5, use entityService
//         const updatedOrder = await strapi.entityService.update("api::order.order", orderId, {
//           data: {
//             orderStatus: "paid",
//             stripePaymentIntentId: paymentIntentId,
//             stripeSessionId: session.id,
//           },
//         });

//         console.log(" Order updated successfully!");
//         console.log("stripePaymentIntentId now:", updatedOrder.stripePaymentIntentId);

//         // Update payment record if exists
//         const payments = await strapi.entityService.findMany("api::payment.payment", {
//           filters: {
//             paymentIntentId: session.id
//           }
//         });

//         if (payments && payments.length > 0) {
//           await strapi.entityService.update("api::payment.payment", payments[0].id, {
//             data: {
//               status: "paid",
//               paymentIntentId: paymentIntentId
//             }
//           });
//           console.log(" Payment record updated");
//         } else {
//           console.log("No payment record found for session:", session.id);
//         }
//       }

//       // Handle payment_intent.succeeded (backup)
//       if (event.type === "payment_intent.succeeded") {
//         const paymentIntent = event.data.object;
//         console.log(" Payment intent succeeded:", paymentIntent.id);

//         // Try to find order by payment intent ID in metadata
//         // This is a fallback
//         try {
//           const orders = await strapi.entityService.findMany("api::order.order", {
//             filters: {
//               stripeSessionId: paymentIntent.metadata?.sessionId
//             }
//           });

//           if (orders && orders.length > 0) {
//             await strapi.entityService.update("api::order.order", orders[0].id, {
//               data: {
//                 stripePaymentIntentId: paymentIntent.id
//               }
//             });
//             console.log(" Order updated via payment_intent.succeeded");
//           }
//         } catch (error: any) {
//           console.error("Failed to update via payment_intent.succeeded:", error.message);
//         }
//       }

//       ctx.send({ received: true });

//     } catch (error: any) {
//       console.error(" Webhook error:", error.message);
//       console.error("Error details:", error);
//       return ctx.badRequest(`Webhook Error: ${error.message}`);
//     }
//   },
// };


import { stripe } from "../utils/stripe";

export default {
  async handleWebhook(ctx) {
    console.log("🔔 Webhook received!");
    
    try {
      // Get the raw body from the request
      // In Strapi 5 with includeUnparsed: true, this should work
      const rawBody = ctx.request.body;
      
      console.log("Type of body:", typeof rawBody);
      console.log("Body keys:", rawBody ? Object.keys(rawBody) : "No body");
      
      // If body is an object, we need to get the raw version
      let rawRequestBody: string;
      
      if (typeof rawBody === 'string') {
        rawRequestBody = rawBody;
      } else if (Buffer.isBuffer(rawBody)) {
        rawRequestBody = rawBody.toString('utf8');
      } else if (rawBody && typeof rawBody === 'object') {
        // Check if there's a raw body stored
        const unparsed = (ctx.request as any).rawBody || (ctx.request as any).unparsedBody;
        if (unparsed) {
          rawRequestBody = typeof unparsed === 'string' ? unparsed : JSON.stringify(unparsed);
        } else {
          // Stringify the parsed body (this might fail signature verification)
          rawRequestBody = JSON.stringify(rawBody);
          console.log("⚠️ Using stringified body - signature may fail");
        }
      } else {
        console.error("❌ No body found");
        return ctx.badRequest("No body found");
      }
      
      const signature = ctx.request.headers["stripe-signature"];
      
      if (!signature) {
        console.error("❌ No stripe signature header");
        return ctx.badRequest("No stripe signature");
      }
      
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!webhookSecret) {
        console.error("❌ STRIPE_WEBHOOK_SECRET not set");
        return ctx.badRequest("Webhook secret not configured");
      }
      
      console.log("Raw body length:", rawRequestBody.length);
      
      // Construct the event
      const event = stripe.webhooks.constructEvent(
        rawRequestBody,
        signature,
        webhookSecret
      );
      
      console.log("✅ Webhook verified! Event type:", event.type);
      
      // Handle checkout.session.completed
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        
        console.log("💰 Payment completed!");
        console.log("Session ID:", session.id);
        console.log("Payment Intent ID:", session.payment_intent);
        console.log("Order ID:", session.metadata?.orderId);
        
        const orderId = session.metadata?.orderId;
        const paymentIntentId = session.payment_intent as string;
        
        if (!orderId || !paymentIntentId) {
          console.log("⚠️ Missing orderId or paymentIntentId");
          ctx.send({ received: true });
          return;
        }
        
        // Update order
        console.log(`📝 Updating order ${orderId}`);
        
        const updatedOrder = await strapi.entityService.update("api::order.order", orderId, {
          data: {
            orderStatus: "paid",
            stripePaymentIntentId: paymentIntentId,
            stripeSessionId: session.id,
          },
        });
        
        console.log("✅ Order updated! Payment Intent:", updatedOrder.stripePaymentIntentId);
      }
      
      ctx.send({ received: true });
      
    } catch (error: any) {
      console.error("❌ Webhook error:", error.message);
      console.error("Full error:", error);
      return ctx.badRequest(`Webhook Error: ${error.message}`);
    }
  },
};