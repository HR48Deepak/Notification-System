import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import NotificationDrawer from './components/NotificationDrawer';
import "./App.css";

const socket = io('http://localhost:3001');

export default function App() {
  const [notifs, setNotifs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = "user_123";

  useEffect(() => {
    socket.emit('join', userId);
    fetchNotifs();

    socket.on('new_notif', (newNotif) => {
      setNotifs(prev => [newNotif, ...prev]);
    });

    return () => socket.off('new_notif');
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/notifications/${userId}`);
      const data = await res.json();
      setNotifs(data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const markRead = async (id) => {
    await fetch(`http://localhost:3001/api/notifications/${id}/read`, { method: 'PATCH' });
    setNotifs(notifs.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar unreadCount={unreadCount} onOpen={() => setIsOpen(true)} />
      
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome back!</h2>
          <p className="text-slate-500 mt-2">Check your notifications</p>
        </div>
      </main>

      <NotificationDrawer 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        notifications={notifs} 
        onMarkRead={markRead}
      />
    </div>
  );
}