import { factories } from '@strapi/strapi';
import { createOrUpdateOrder } from '../utils/order';
import { brotliCompressSync } from 'zlib';

export default factories.createCoreService('api::order.order', ({ strapi }) => ({

    async placeOrder(user, body) {

        return await strapi.db.transaction(async () => {
            console.log("create roder service:", body, user);
            const cartItems = await strapi.documents('api::cart.cart').findMany({
                filters: { users_permissions_user: user.documentId },
                populate: ['products']
            });

            const product = await strapi.documents('api::product.product').findOne({
                documentId: body.productId,
            });
            if (!product) throw new Error("Product not found");

            // CASE 1: DIRECT ORDER
            if (!cartItems.length) {

                if (Number(product.stock) < Number(body.quantity)) {
                    throw new Error("Not enough stock");
                }

                const price = product.Price?.[0]?.price ?? 0;
                const totalPrice = price * body.quantity;

                // create order
                const order = await strapi.documents('api::order.order').create({
                    data: {
                        product: product.documentId,
                        users_permissions_user: user.documentId,
                        quantity: body.quantity,
                        price,
                        totalPrice,
                    }
                });

                // 🔥 STOCK DEDUCTION (ONLY HERE)
                await strapi.documents('api::product.product').update({
                    documentId: product.documentId,
                    data: {
                        stock: Number(product.stock) - Number(body.quantity),
                    }
                });

                return { order, totalPrice };
            }

            // CASE 2: CART ORDER

            let totalPrice = 0;

            for (const item of cartItems) {
                for (const product of item.products) {

                    if (!product) throw new Error("Product missing");

                    if (Number(product.stock) < Number(item.quantity)) {
                        throw new Error(`Not enough stock for ${product.name}`);
                    }

                    const price = product.Price?.[0]?.price ?? 0;

                    totalPrice += price * item.quantity;

                    // create order per item
                    await createOrUpdateOrder(
                        strapi,
                        user.documentId,
                        {
                            product: product.documentId,
                            quantity: item.quantity,
                            price
                        }
                    );

                    console.log("Product ID:", product.documentId);
                    console.log("Old Stock:", product.stock);
                    console.log("order itmes:", item.quantity);


                    await strapi.documents('api::product.product').update({
                        documentId: product.documentId,
                        data: {
                            stock: Number(product.stock) - Number(item.quantity),
                        }
                    });
                }
            }

            // clear cart
            await strapi.db.query("api::cart.cart").deleteMany({
                where: { users_permissions_user: user.documentId }
            });

            return { totalPrice };
        });
    }

}));