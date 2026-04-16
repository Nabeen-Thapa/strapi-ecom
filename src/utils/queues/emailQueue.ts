import { Queue } from 'bullmq';
import IORedis from 'ioredis';


export const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null, // <- THIS IS REQUIRED
  enableReadyCheck: false,    // optional, helps on Windows
});

export const emailQueue = new Queue('email-queue', {
  connection,
});