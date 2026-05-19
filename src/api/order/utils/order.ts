export const createOrUpdateOrder = async (strapi, userId, orderItem) => {
  return await strapi.documents('api::order.order').create({
    data: {
      product: orderItem.product,
      users_permissions_user: userId,
      quantity: orderItem.quantity,
      price: orderItem.price,
      totalPrice: orderItem.price * orderItem.quantity,
    }
  });
};



//decrease product stock/quantity
// export const decreaseStock = async (item, ctx) => {
//     const products = item.products;
//     if (!products || products.length === 0) return ctx.badRequest("product is not found");

//     for (const product of products) {
//         await strapi.documents('api::product.product').update({
//             documentId: product.documentId,
//             data: {
//                 stock: product.stock - item.quantity,
//             }
//         });
//     }
// }

export const sendSeccess = async (data, ctx) => {
    ctx.send({
        message: 'Your product has been ordered successfully',
        data,
    });
}

// export const decreaseProductStock = async (
//   strapi: any,
//   productDocumentId: string,
//   quantity: number
// ) => {
//   const product: any = await strapi.documents('api::product.product').findOne({
//     documentId: productDocumentId,
//   });

//   if (!product) {
//     throw new Error('Product not found');
//   }

//   if (Number(product.stock) < Number(quantity)) {
//     throw new Error(`Not enough stock for ${product.name}`);
//   }

//   await strapi.documents('api::product.product').update({
//     documentId: product.documentId,
//     data: {
//       stock: Number(product.stock) - Number(quantity),
//     },
//   });
// };