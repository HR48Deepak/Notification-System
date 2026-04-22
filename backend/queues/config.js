require('dotenv').config();
const { Queue } = require('bullmq'); // Declared here once
const IORedis = require('ioredis');

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: { rejectUnauthorized: false } 
});

const notificationQueue = new Queue('notificationQueue', { connection });

// Exporting so other files can use the SAME instances
module.exports = { notificationQueue, connection };