// import type { Core } from '@strapi/strapi';

import redisClient from "../config/redis";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */


  async bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    await redisClient.set("test", "Hello Redis");

    const value = await redisClient.get("test");

    console.log("redis responce:",value);
  },
};
