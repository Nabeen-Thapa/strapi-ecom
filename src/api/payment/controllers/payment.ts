import { factories } from "@strapi/strapi";
import { stripe } from "../utils/stripe";

export default factories.createCoreController("api::payment.payment", ({ strapi }) => ({
  async create(ctx) {
    const { orderId } = ctx.request.body;

    const order = await strapi.entityService.findOne(
      "api::order.order",
      orderId
    );
    if (!order) return ctx.badRequest("Order not found");

    const session = await strapi.service("api::payment.payment").createPaymentSession(order);
    // store payment record
    await strapi.entityService.create("api::payment.payment", {
      data: {
        order: orderId,
        amount: order.totalPrice,
        currency: "usd",
        status: "pending",
        paymentIntentId: session.id,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  },

  async refundPayment(ctx) {
    try {
      // Get orderId from request body
      const { orderId } = ctx.request.body;
      console.log("order id controller:", orderId)
      if (!orderId) {
        return ctx.badRequest("Order ID is required");
      }
      console.log("order id controller1:")
      // Find order from database
      const order = await strapi.entityService.findOne(
        "api::order.order",
        orderId
      );
      console.log("order controller:", order)
      // If order not found
      if (!order) {
        return ctx.notFound("Order not found");
      }

      // Prevent refund if payment not completed
      if (order.orderStatus !== "paid") {
        return ctx.badRequest("Only paid orders can be refunded");
      }

      // Prevent duplicate refunds
      // if (order.orderStatus === "refunded") {
      //   return ctx.badRequest("Order already refunded");
      // }
      console.log("order controller test:", order)
      // Refund payment using Stripe payment intent
      const refund = await stripe.refunds.create({
        payment_intent: order.stripePaymentIntentId,
      });
      console.log("refund id controller:", refund)
      // Update order status in database
      // await strapi.entityService.update(
      //   "api::order.order",
      //   orderId,
      //   {
      //     data: {
      //       // paymentStatus: "refunding",
      //       orderStatus: "cancelled",
      //     },
      //   }
      // );

      return {
        success: true,
        message: "Refund initiated successfully",
        refund,
      };
    } catch (error: any) {
      return ctx.badRequest(error.message);
    }
  },
}));