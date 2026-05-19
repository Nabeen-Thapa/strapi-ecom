/**
 * product controller
 */

import { factories } from '@strapi/strapi';
import redisClient from '../../../../config/redis';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
    async create(ctx) {
        const user = ctx.state.user;
        if (!user) return ctx.unauthorized("You are not logged in");
        const body = ctx.request.body.data;
        const newData = {
            ...body,
            seller: { connect: [{ documentId: user.documentId }], },
        };

        const response = await strapi.documents("api::product.product").create({
            data: newData,
        });
        // save data on redis 

        const cacheKey = `products:id:${response.documentId}`;
        const cacheProduct = await redisClient.set(cacheKey,
            JSON.stringify(response), {
            EX: 336600
        })

        // const cachedProducts = await redisClient.get(response.documentId);
        // console.log("procust create controller new redis data:", cachedProducts)

        return { data: response };
    },
    // async find(ctx) {
    //     const cacheKey = "products:all";

    //     // 1. Try Redis first
    //     const cached = await redisClient.get(cacheKey);

    //     if (cached) {
    //         return {
    //             data: JSON.parse(cached),
    //             source: "redis"
    //         };
    //     }

    //     // 2. fallback to Strapi default DB logic
    //     const result = await super.find(ctx);

    //     // 3. store in Redis
    //     await redisClient.set(
    //         cacheKey,
    //         JSON.stringify(result.data),
    //         { EX: 60 } // 1 min cache
    //     );

    //     return {
    //         ...result,
    //         source: "db"
    //     };
    // },

    // async findOne(ctx) {
    //     const { id } = ctx.params;

    //     const cacheKey = `products:id:${id}`;

    //     // 1. Redis check
    //     const cached = await redisClient.get(cacheKey);

    //     if (cached) {
    //         return {
    //             data: JSON.parse(cached.toString()),
    //             source: "redis"
    //         };
    //     }
    //     if (!cached) console.log("data not fiunct in redsi")

    //     // 2. fallback to Strapi
    //     const result = await super.findOne(ctx);
    //     console.log("database responce in findone:", result)
    //     // 3. cache it
    //     // await redisClient.set(
    //     //     cacheKey,
    //     //     JSON.stringify(result.data),
    //     //     { EX: 300 }
    //     // );

    //     return {
    //         ...result,
    //         source: "db"
    //     };
    // },

    async update(ctx) {
        const user = ctx.state.user;
        if (!user) return ctx.unauthorized("Not authorized");

        const { id } = ctx.params;

        const product = await strapi.documents('api::product.product').findOne({
            documentId: id,
            populate: ["seller"],
        });

        if (!product) return ctx.notFound("Product not found");

        if (product.seller?.documentId !== user.documentId) {
            return ctx.forbidden("You cannot update this product");
        }

        return await super.update(ctx);
    },

    async delete(ctx) {
        const user = ctx.state.user;
        const { id } = ctx.params;

        const product = await strapi.documents('api::product.product').findOne({
            documentId: id,
            populate: ["seller"],
        });

        if (!product) return ctx.notFound("Product not found");

        if (product.seller?.documentId !== user.documentId) {
            return ctx.forbidden("You cannot delete this product");
        }

        return await super.delete(ctx);
    },

    async search(ctx) {
        const { q } = ctx.query;

        if (typeof q !== "string" || !q.trim()) {
            return ctx.badRequest("Search query is required");
        }

        const query = q.toLowerCase();

        const products = await strapi.documents(
            "api::product.product").findMany(
                {
                    filters: {
                    },
                    populate: {
                        brand: true,
                        category: true,
                        productImages: true,
                    },
                }
            );

        const filtered = (products as any[]).filter((p) => {
            const name = p.name?.toLowerCase() || "";
            const brand = p.brand?.name?.toLowerCase() || "";
            const category = p.category?.name?.toLowerCase() || "";

            return (
                name.includes(query) ||
                brand.includes(query) ||
                category.includes(query)
            );
        });
        if (filtered.length === 0) {
            return {
                message: "not product found",
                data: []
            }
        }
        return filtered;
    }
}));