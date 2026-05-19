import redisClient from "../../../../../config/redis";

export default {

    async afterCreate() {
        await redisClient.del("products");
    },

    async afterUpdate() {
        await redisClient.del("products");
    },

    async afterDelete() {
        await redisClient.del("products");
    }
};