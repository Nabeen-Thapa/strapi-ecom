/**
 * product controller
 */

import { factories } from '@strapi/strapi';

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
        return { data: response };
    },

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
        if(filtered.length ===0){
            return{
                message: "not product found",
                data: []
            }
        }
        return filtered;
    }
}));