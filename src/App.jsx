import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Bell, CheckCircle, Mail, MessageSquare, X } from 'lucide-react';
import './App.css'; 

const socket = io('http://localhost:3001');

export default function NotificationSystem() {
  const [notifs, setNotifs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = "user_123"; // Mock User

  useEffect(() => {
    socket.emit('join', userId);
    fetchNotifs();

    socket.on('new_notif', (newNotif) => {
      setNotifs(prev => [newNotif, ...prev]);
    });

    return () => socket.off('new_notif');
  }, []);

  const fetchNotifs = async () => {
    const res = await fetch(`/api/notifications/${userId}`);
    const data = await res.json();
    setNotifs(data);
  };

  const markRead = async (id) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    setNotifs(notifs.map(n => n._id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <nav className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
        <button onClick={() => setIsOpen(true)} className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Slide-out Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
        <div className="p-4 border-b flex justify-between items-center bg-indigo-600 text-white">
          <h2 className="font-semibold text-lg">Notifications</h2>
          <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {notifs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">All caught up!</div>
          ) : (
            notifs.map(n => (
              <div key={n._id} className={`p-4 border-b hover:bg-gray-50 transition ${!n.isRead ? 'bg-blue-50/50 border-l-4 border-l-indigo-500' : ''}`}>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-indigo-600 uppercase mb-1">{n.type || 'Alert'}</span>
                  {!n.isRead && <button onClick={() => markRead(n._id)} className="text-xs text-indigo-500 hover:underline">Mark read</button>}
                </div>
                <h3 className={`text-sm ${!n.isRead ? 'font-bold' : 'font-medium'} text-gray-800`}>{n.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <span className="text-[10px] text-gray-400 mt-2 block">{new Date(n.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}