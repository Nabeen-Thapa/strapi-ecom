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
      success_url: "http://localhost:1337/admin/content-manager/collection-types/api::payment.payment?sync=true",
      cancel_url: "http://localhost:1337/admin/content-manager/collection-types/api::order.order",
    });

    await strapi.entityService.update("api::order.order", order.id, {
      data: {
        stripeSessionId: session.id,
        orderStatus: "pending",
      },
    });

    return session;
  },
}));