// import { factories } from "@strapi/strapi";
// import { stripe } from "../utils/stripe";

// export default factories.createCoreService("api::payment.payment", ({ strapi }) => ({
//   async createPaymentSession(order: any) {
//     if (!order) throw new Error("Invalid order");

//     console.log("Creating payment session for order:", order.id);
//     console.log("Order total price:", order.totalPrice);

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `Order #${order.id}`,
//               description: `Total amount: $${order.totalPrice}`,
//             },
//             unit_amount: Math.round(Number(order.totalPrice) * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: {
//         orderId: order.id.toString(),  // Make sure this is a string
//       },
//       success_url: "http://localhost:1337/admin/content-manager/collection-types/api::payment.payment",
//       cancel_url: "http://localhost:1337/admin/content-manager/collection-types/api::order.order",
//     });

//     // console.log("Session created:", session.id);
//     // console.log("Session metadata:", session.metadata);
//     console.log("Session metadata session :", session.payment_intent);
//     console.log("Session metadata session :", session);
//     const apymentIntent = session.payment_intent as string;
//     // Save session ID to order
//     await strapi.entityService.update("api::order.order", order.id, {
//       data: {
//         stripeSessionId: session.id,
//         orderStatus: "pending"
//       },
//     });

//     return session;
//   },
// }));

import { factories } from "@strapi/strapi";
import { stripe } from "../utils/stripe";

export default factories.createCoreService("api::payment.payment", ({ strapi }) => ({
  async createPaymentSession(order: any) {
    if (!order) throw new Error("Invalid order");

    console.log("Creating payment session for order:", order.id);
    console.log("Order total price:", order.totalPrice);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order #${order.id}`,
              description: `Total amount: $${order.totalPrice}`,
            },
            unit_amount: Math.round(Number(order.totalPrice) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: order.id.toString(),
      },
success_url: "http://localhost:1337/admin/content-manager/collection-types/api::payment.payment?sync=true",      cancel_url: "http://localhost:1337/admin/content-manager/collection-types/api::order.order",
    });

    console.log("Session created:", session.id);
    console.log("⚠️ Payment intent is null at creation (this is normal)");

    // ✅ ONLY save session ID, NOT payment intent
    await strapi.entityService.update("api::order.order", order.id, {
      data: {
        stripeSessionId: session.id,
        orderStatus: "pending",
      },
    });

    return session;
  },
}));