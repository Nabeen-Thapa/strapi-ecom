import { stripe } from "../utils/stripe";

export default {
    async handleWebhook(ctx) {
        const sig = ctx.request.headers["stripe-signature"];

        let event;

        try {
            const rawBody = ctx.request.body[Symbol.for("unparsedBody")];
            event = stripe.webhooks.constructEvent(
                rawBody,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            return ctx.badRequest(`Webhook Error: ${err.message}`);
        }

        // ✅ SUCCESS PAYMENT
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            const orderId = session.metadata?.orderId;

            const payment = await strapi.db
                .query("api::payment.payment")
                .findOne({
                    where: { paymentIntentId: session.id },
                    populate: ["order"],
                });

            if (payment) {
                await strapi.entityService.update(
                    "api::payment.payment",
                    payment.id,
                    {
                        data: {
                            status: "paid",
                        },
                    }
                );

                if (orderId) {
                    await strapi.entityService.update("api::order.order", orderId, {
                        data: {
                            orderStatus: "paid",
                            stripePaymentIntentId: session.payment_intent,
                        },
                    });
                }
            }
        }

        if (event.type === "payment_intent.payment_failed") {
            const paymentIntent: any = event.data.object;

            await strapi.db.query("api::order.order").update({
                where: {
                    stripePaymentIntentId: paymentIntent.id,
                },
                data: {
                    paymentStatus: "failed",
                },
            });
        }

        // Refund completed successfully
        if (event.type === "charge.refunded") {
            const charge: any = event.data.object;

            // Find order using payment intent ID
            await strapi.db.query("api::order.order").update({
                where: {
                    stripePaymentIntentId: charge.payment_intent,
                },
                data: {
                    paymentStatus: "refunded",
                    orderStatus: "cancelled",
                },
            });
        }

        ctx.send({ received: true });
    },
};