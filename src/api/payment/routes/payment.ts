// const { customRouter } = require("../../../helpers/route.helper");
// const { createCoreRouter } = require("@strapi/strapi").factories;

// const defaultRoutes = createCoreRouter("api::payment.payment");

// const customRoutes = [
//   {
//     method: "POST",
//     path: "/payments/create",
//     handler: "payment.create",
//     config: {
//       auth: false, // optional (use true if protected)
//     },
//   },
// ];

// module.exports = customRouter(defaultRoutes, customRoutes);


export default {
  routes: [
    {
      method: "POST",
      path: "/payments/create",
      handler: "payment.create",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/payments/webhook",
      handler: "webhook.handleWebhook",
      config: {
        auth: false,
        // IMPORTANT: disable body parsing
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/payments/refund",
      handler: "payment.refundPayment",
      config: {
        auth: false,
      },
    },
  ],
};