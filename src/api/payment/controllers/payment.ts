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
        console.log("payment create controller serssion:", session, session.id);
        const createpayment = await strapi.entityService.create("api::payment.payment", {
            data: {
                order: orderId,
                amount: order.totalPrice,
                currency: "usd",
                status: "pending",
                paymentIntentId: session.id,
            },
        });
        console.log("payment create controller createpayment:", createpayment);

        return {
            url: session.url,
            sessionId: session.id,
        };
    },
    async syncPaymentIntent(ctx) {
        try {
            const { orderId } = ctx.request.body;

            if (!orderId) {
                return ctx.badRequest("Order ID is required");
            }

            // Find the order
            const order = await strapi.entityService.findOne("api::order.order", orderId);

            if (!order) {
                return ctx.notFound("Order not found");
            }

            if (!order.stripeSessionId) {
                return ctx.badRequest("No Stripe session ID found for this order");
            }

            console.log(`🔄 Syncing payment intent for order ${orderId}`);
            console.log(`Session ID: ${order.stripeSessionId}`);

            // Retrieve the session from Stripe
            const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

            console.log("Session payment intent:", session.payment_intent);
            console.log("Session payment status:", session.payment_status);
            const paymentIntent = session.payment_intent as string;
            if (session.payment_intent && session.payment_status === 'paid') {
                // Update order with payment intent ID
                const updatedOrder = await strapi.entityService.update("api::order.order", orderId, {
                    data: {
                        orderStatus: "paid",
                        stripePaymentIntentId: paymentIntent,
                    },
                });

                // Also update payment record
                const payments = await strapi.entityService.findMany("api::payment.payment", {
                    filters: {
                        order: orderId
                    }
                });

                if (payments && payments.length > 0) {
                    await strapi.entityService.update("api::payment.payment", payments[0].id, {
                        data: {
                            status: "paid",
                            paymentIntentId: paymentIntent
                        }
                    });
                }

                return {
                    success: true,
                    message: "Payment intent synced successfully",
                    paymentIntentId: session.payment_intent,
                    order: updatedOrder
                };
            } else {
                return {
                    success: false,
                    message: "Payment not completed yet",
                    paymentStatus: session.payment_status
                };
            }

        } catch (error: any) {
            console.error("Sync payment intent error:", error);
            return ctx.badRequest(error.message);
        }
    },
    async refundPayment(ctx) {
        try {
            const { orderId } = ctx.request.body;

            if (!orderId) {
                return ctx.badRequest("Order ID is required");
            }

            const order = await strapi.entityService.findOne(
                "api::order.order",
                orderId
            );
            console.log("order controller:", order);

            if (!order) {
                return ctx.notFound("Order not found");
            }

            // ✅ Add debugging
            console.log("Order details:", {
                id: order.id,
                orderStatus: order.orderStatus,
                stripePaymentIntentId: order.stripePaymentIntentId
            });

            if (order.orderStatus !== "paid") {
                return ctx.badRequest("Only paid orders can be refunded");
            }

            // ✅ Check if payment intent ID exists
            if (!order.stripePaymentIntentId) {
                return ctx.badRequest("No payment intent ID found for this order. Payment may not have completed properly.");
            }

            const refund = await stripe.refunds.create({
                payment_intent: order.stripePaymentIntentId,
            });

            // Update order status
            await strapi.entityService.update("api::order.order", orderId, {
                data: {
                    orderStatus: "refunded",
                },
            });

            return {
                success: true,
                message: "Refund initiated successfully",
                refund,
            };
        } catch (error: any) {
            console.error("Refund error:", error);
            return ctx.badRequest(error.message);
        }
    },
}));