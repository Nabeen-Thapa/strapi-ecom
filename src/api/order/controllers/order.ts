/**
 * order controller
 */

import { factories } from '@strapi/strapi';
import { createOrUpdateOrder, sendSeccess } from '../utils/order';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async create(ctx) {
        try {
            const user = ctx.state.user;
            const body = ctx.request.body.data || ctx.request.body;
            console.log("order controller:",body)
            if (!user) return ctx.unauthorized('you are not authorized');
            const cartItems = await strapi.documents('api::cart.cart').findMany({
                filters: { users_permissions_user: user.documentId },
                populate: ['products']
            });

            //direct order -without add to cart 
            if (!cartItems) {
                console.log("direct order:", cartItems);
                const product: any = await strapi.documents('api::product.product').findOne({
                    documentId: body.productId,
                });

                if (!product) return ctx.badRequest('product is not found');
                //place order
                const productPrice = product.price?.[0]?.price ?? 0;
                const totalPrice = productPrice * body.quantity;
                const createdOrders = [];
                const existsOrder = await strapi.documents('api::order.order').findFirst({
                    filters: {
                        users_permissions_user: user.documentId,
                        product: product.documentId
                    }
                })
                if (existsOrder) {
                    // update quantity and totalPrice
                    await strapi.documents('api::order.order').update({
                        documentId: existsOrder.documentId,
                        data: {
                            quantity: existsOrder.quantity + body.quantity,
                            totalPrice: (existsOrder.quantity + body.quantity) * productPrice,
                        },
                    });
                } else {
                    const order = await strapi.documents('api::order.order').create({
                        data: {
                            product: product.documentId,
                            users_permissions_user: user.documentId,
                            quantity: body.quantity,
                            price: productPrice,
                            totalPrice: totalPrice,
                        }
                    });
                    createdOrders.push(order);
                }
                return sendSeccess(totalPrice, ctx);
            }

            //if product is exist in cart
            // Validate stock & prepare order
            const orderItems = [];
            let totalPrice = 0;
            for (const item of cartItems) {
                console.log("indirect order from cart:", cartItems);
                const products = item.products;
                if (!products || products.length === 0) continue;

                for (const product of products) {
                    if (!product) return ctx.badRequest('Product not found');

                    if (product.stock < item.quantity) {
                        return ctx.badRequest(`Not enough stock for ${product.name}`);
                    }

                    const price = product.Price || 0;
                    totalPrice += price * item.quantity;

                    orderItems.push({
                        product: product.documentId,
                        quantity: item.quantity,
                        price,
                    });
                }
            }

            //Create orders
            const createdOrders = [];
            for (const orderItem of orderItems) {
                await createOrUpdateOrder(strapi, user.documentId, orderItem);
            }

            //Clear cart
            for (const item of cartItems) {
                await strapi.documents("api::cart.cart").delete({
                    documentId: item.documentId
                });
            }
            return sendSeccess(totalPrice, ctx)
        } catch (error) {
            throw new error(`internal erver error: ${error.message}`)
        }
    }
}));
