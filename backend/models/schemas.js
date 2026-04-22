const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  slug: { type: String, unique: true },
  type: { type: String, enum: ['EMAIL', 'SMS', 'IN_APP'] },
  subject: String,
  body: String // e.g., "Hi {{name}}, {{message}}"
});

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, index: true },
  title: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  Template: mongoose.model('Template', TemplateSchema),
  Notification: mongoose.model('Notification', NotificationSchema)
};