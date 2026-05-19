import { factories } from "@strapi/strapi";
import { stripe } from "../utils/stripe";

export default factories.createCoreService("api::payment.payment", ({ strapi }) => ({
  async createPaymentSession(order: any) {
    if (!order) throw new Error("Invalid order");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      //for single item
      line_items: [
        {
          price_data: {
            currency: "npr",
            product_data: {
              name: `Order #${order.id}`,
            },
            unit_amount: Math.round(order.totalPrice * 100),
          },
          quantity: 1,
        },
      ],

      //for multiple items
      // line_items: order.orderItems.map((item) => ({
      //   price_data: {
      //     currency: "usd",
      //     product_data: {
      //       name: item.product.title,
      //     },
      //     unit_amount: Math.round(item.price * 100),
      //   },
      //   quantity: item.quantity,
      // })),
      metadata: {
        orderId: order.id.toString(),
      },
      success_url: "http://localhost:1337/admin/content-manager/collection-types/api::payment.payment",//add here frontend payment success page url
      cancel_url: "http://localhost:1337/admin/content-manager/collection-types/api::order.order?pageSize=50",//add here frontend payment fail page url
    });

    // SAVE session to DB
    await strapi.entityService.update("api::order.order", order.id, {
      data: {
        stripeSessionId: session.id,
        paymentStatus: "pending",
      },
    });
    return session;
  },
}));