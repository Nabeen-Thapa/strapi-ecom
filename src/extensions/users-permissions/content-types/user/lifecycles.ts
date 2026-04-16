// export default {
//   async afterCreate(event) {
//     const { result, params } = event;

//     const roleType = params.data.roleType; // from request body
//     console.log("lifecycle:", roleType)
//     if (roleType === 'seller') {
//       const sellerRole = await strapi.documents('plugin::users-permissions.role').findFirst({
//         filters: { name: 'seller' },
//       });
//     console.log("lifecycle1:", sellerRole)
//       if (sellerRole) {
//         await strapi.documents('plugin::users-permissions.user').update({
//           documentId: result.documentId,
//           data: {
//             role: sellerRole.id,
//           },
//         });
//       }
//     }
//   },
// };