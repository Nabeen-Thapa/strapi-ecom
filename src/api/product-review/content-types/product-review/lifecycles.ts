// export default {
//   async afterCreate(event) {
//     try {
//       const { result } = event;

//       // ✅ Ignore drafts (important to avoid double execution)
//     //  if (!result.publishedAt) return;

//       // 🔍 Get review with product relation
//       const review = await strapi
//         .documents('api::product-review.product-review')
//         .findOne({
//           documentId: result.documentId,
//           populate: {
//             product: true,
//           },
//         });

//       const productId = review?.product?.documentId;
//       if (!productId) return;

//       const totalReviews = await strapi
//         .documents('api::product-review.product-review')
//         .count({
//           filters: {
//             product: {documentId: productId,},
//             publishedAt: { $notNull: true,},
//           },
//         });

//       await strapi.documents('api::product.product').update({
//         documentId: productId,
//         data: {
//           totalReviews,
//         },
//       });

//     } catch (error) {
//       console.error("Error updating totalReviews:", error);
//     }
//   },
// };

export default {
  async afterCreate(event) {
    const { result } = event;

    // ✅ prevent double trigger (draft vs publish)
    if (!result.publishedAt) return;

    const review = await strapi
      .documents('api::product-review.product-review')
      .findOne({
        documentId: result.documentId,
        populate: { product: true },
      });
      console.log("preview data:", review)
    const productId = review?.product?.documentId;
    if (!productId) return;

    const product = await strapi
      .documents('api::product.product')
      .findOne({
        documentId: productId,
      });

    if (!product) return;
   console.log("product data:", product, productId)
    await strapi.documents('api::product.product').update({
      documentId: productId,
      data: {
        totalReviews: product.totalReviews + 1,
      },
    });
  },
};