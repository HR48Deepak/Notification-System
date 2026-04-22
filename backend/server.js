require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { Notification } = require('./models/schemas');
const { notificationQueue } = require('./queues/config');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());

// Connect to Cloud MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to Cloud MongoDB"))
  .catch(err => console.error("❌ Mongo Connection Error:", err));

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} connected to real-time room`);
  });
});

// API: Get Notifications
app.get('/api/notifications/:userId', async (req, res) => {
  const notifs = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(notifs);
});

// API: Mark Read
app.patch('/api/notifications/:id/read', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.sendStatus(200);
});

// API: Trigger Notification (Produces a job)
app.post('/api/notify', async (req, res) => {
  const { userId, templateSlug, payload } = req.body;
  await notificationQueue.add('send-notif', { userId, templateSlug, payload });
  res.json({ success: true, message: "Queued in Cloud Redis" });
});

server.listen(process.env.PORT || 3001, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3001}`);
});