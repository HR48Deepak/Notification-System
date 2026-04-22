require('dotenv').config();
const { Worker } = require('bullmq'); // Notice we only need Worker here, not Queue
const mongoose = require('mongoose');
const { Notification, Template } = require('./models/schemas');
const { connection } = require('./queues/config'); // Import the connection we already made

mongoose.connect(process.env.MONGODB_URI);

const worker = new Worker('notificationQueue', async (job) => {
  const { userId, templateSlug, payload } = job.data;
  
  const template = await Template.findOne({ slug: templateSlug });
  if (!template) throw new Error("Template not found");

  const message = template.body.replace(/{{(\w+)}}/g, (_, k) => payload[k] || '');

  return await Notification.create({
    userId,
    title: template.subject,
    message,
    type: template.type
  });
}, { connection });

console.log("👷 Worker is running and connected to Cloud Redis...");