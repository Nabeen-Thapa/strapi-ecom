export default {
  async afterCreate(event) {
    const { result } = event;
    try {
      const order: any = await strapi.entityService.findOne(
        "api::order.order",
        result.id,
        {
          populate: {
            users_permissions_user: { fields: ["email"] }, // only get email
          } as any,
        }
      );
      const ordernew = await strapi.documents('api::order.order').findOne({
        documentId: result.documentId,
        populate: ['users_permissions_user', 'product'],
      });
      // console.log("this is order lifecycle1:", order)
      if (!order) return;
      
      // const product: any = ordernew.product;
      // if (product) {
      //   const newStock = Number(product.stock) - Number(ordernew.quantity);

      //   await strapi.documents('api::product.product').update({
      //     documentId: product.documentId,
      //     data: {
      //       stock: newStock,
      //     },
      //   });
      // }

      const userEmail = order.users_permissions_user?.email;
      if (!userEmail) return console.warn("User email not found!");


      // Send email
      await strapi.plugin("email").service("email").send({
        to: userEmail,
        subject: "Order Confirmation",
        text: `Your order has been placed successfully.`,
        html: `
          <h2>Order Confirmed</h2>
        `,
      });

      // console.log("Order email sent to :", userEmail);
    } catch (err) {
      console.error("Error sending order email:", err);
    }
  },
};