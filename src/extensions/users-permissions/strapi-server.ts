import { emailQueue } from "../../utils/queues/emailQueue";

export default (plugin: any) => {
  const userContentType = plugin.contentTypes.user;
try{
  userContentType.lifecycles = {
    ...userContentType.lifecycles, //withotu this line overwrites ALL lifecycles, due to this line only aftercreate overwrites
    async afterCreate(event) {
      const { result, params } = event;

      const roleType = params.data.roleType;

      if (roleType === 'seller') {
        const sellerRole = await strapi.documents('plugin::users-permissions.role').findFirst({
          filters: { name: 'seller' },
        });

        console.log("sellerRole:", sellerRole);

        if (sellerRole) {
          await strapi.documents('plugin::users-permissions.user').update({
            documentId: result.documentId,
            data: {
              role: sellerRole.id,
            },
          });
        }
      }

      await emailQueue.add(
        'send-email',
        { to: result.email, username: result.username },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        }
      );
    },
  };
  return plugin;
}catch(error){
  throw new Error(`errro during register: ${error}`)
}
};